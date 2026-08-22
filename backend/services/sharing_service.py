import secrets
from datetime import datetime, timezone
from typing import List, Optional, Tuple
from uuid import UUID
from sqlalchemy.orm import Session
from sqlalchemy import distinct

from backend.core.exceptions import NotFoundException, ForbiddenException, BadRequestException
from backend.models.trip import Trip, TripVisibility
from backend.models.trip_stop import TripStop
from backend.models.city import City
from backend.models.trip_share import TripShare, SharePermission
from backend.models.user import User
from backend.schemas.trip_share import TripShareCreate
from backend.services.trip_service import TripService

class SharingService:
    """Service layer handling trip share token verification, public discovery, and access permissions."""

    @staticmethod
    def create_share(db: Session, trip_id: UUID, share_in: TripShareCreate, user: User) -> TripShare:
        trip = TripService.get_trip_by_id(db, trip_id, user)
        if trip.user_id != user.id:
            raise ForbiddenException(message="You do not have permission to share this trip", code="TRIP_MODIFY_DENIED")

        if share_in.expires_at:
            exp_at = share_in.expires_at.replace(tzinfo=timezone.utc) if share_in.expires_at.tzinfo is None else share_in.expires_at
            if exp_at <= datetime.now(timezone.utc):
                raise BadRequestException(message="Expiration date must be in the future", code="INVALID_EXPIRATION_DATE")

        token = secrets.token_urlsafe(32)
        db_share = TripShare(
            trip_id=trip_id,
            shared_with_user_id=share_in.shared_with_user_id,
            share_token=token,
            permission=share_in.permission,
            expires_at=share_in.expires_at
        )
        db.add(db_share)
        db.commit()
        db.refresh(db_share)
        return db_share

    @staticmethod
    def list_shares(db: Session, trip_id: UUID, user: User) -> List[TripShare]:
        trip = TripService.get_trip_by_id(db, trip_id, user)
        if trip.user_id != user.id:
            raise ForbiddenException(message="You do not have permission to view shares for this trip", code="TRIP_MODIFY_DENIED")

        return db.query(TripShare).filter(TripShare.trip_id == trip_id).order_by(TripShare.created_at.desc()).all()

    @staticmethod
    def revoke_share(db: Session, share_id: UUID, user: User) -> None:
        share = db.query(TripShare).filter(TripShare.id == share_id).first()
        if not share:
            raise NotFoundException(message="Share token not found", code="SHARE_NOT_FOUND")

        trip = db.query(Trip).filter(Trip.id == share.trip_id).first()
        if not trip or trip.user_id != user.id:
            raise ForbiddenException(message="You do not have permission to revoke this share token", code="SHARE_REVOKE_DENIED")

        db.delete(share)
        db.commit()

    @staticmethod
    def get_trip_by_share_token(db: Session, share_token: str) -> Trip:
        # Check trip_shares table first
        share = db.query(TripShare).filter(TripShare.share_token == share_token).first()
        if share:
            if share.expires_at:
                exp_at = share.expires_at.replace(tzinfo=timezone.utc) if share.expires_at.tzinfo is None else share.expires_at
                now_dt = datetime.now(timezone.utc)
                if exp_at < now_dt:
                    raise NotFoundException(message="Shared trip token has expired", code="SHARE_TOKEN_EXPIRED")
            trip = db.query(Trip).filter(Trip.id == share.trip_id).first()
            if trip:
                return trip

        # Fallback check Trip.share_token
        trip = db.query(Trip).filter(Trip.share_token == share_token).first()
        if not trip:
            raise NotFoundException(message="Shared trip token not found or invalid", code="SHARE_TOKEN_INVALID")

        return trip

    @staticmethod
    def get_public_trips(
        db: Session,
        search: Optional[str] = None,
        city_id: Optional[UUID] = None,
        country_id: Optional[UUID] = None,
        page: int = 1,
        page_size: int = 20
    ) -> Tuple[List[Trip], int]:
        query = db.query(Trip).filter(Trip.visibility == TripVisibility.PUBLIC)

        if search:
            query = query.filter(Trip.name.ilike(f"%{search}%"))

        if city_id or country_id:
            query = query.join(TripStop, TripStop.trip_id == Trip.id)
            if city_id:
                query = query.filter(TripStop.city_id == city_id)
            if country_id:
                query = query.join(City, City.id == TripStop.city_id).filter(City.country_id == country_id)

        total = query.with_entities(distinct(Trip.id)).count()

        trips = (
            query.distinct()
            .order_by(Trip.created_at.desc())
            .offset((page - 1) * page_size)
            .limit(page_size)
            .all()
        )
        return trips, total

    @staticmethod
    def get_public_trip_by_id(db: Session, trip_id: UUID) -> Trip:
        trip = db.query(Trip).filter(Trip.id == trip_id, Trip.visibility == TripVisibility.PUBLIC).first()
        if not trip:
            raise NotFoundException(message="Public trip not found", code="TRIP_NOT_FOUND")
        return trip
