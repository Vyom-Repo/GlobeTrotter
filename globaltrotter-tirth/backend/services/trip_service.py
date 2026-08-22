import secrets
from typing import List, Optional, Tuple
from uuid import UUID
from sqlalchemy.orm import Session

from backend.core.exceptions import NotFoundException, ForbiddenException, BadRequestException
from backend.models.trip import Trip
from backend.models.user import User
from backend.schemas.trip import TripCreate, TripUpdate

class TripService:
    """Service layer handling trip creation, querying, and updating."""

    @staticmethod
    def get_user_trips(db: Session, user: User, page: int = 1, page_size: int = 20) -> Tuple[List[Trip], int]:
        query = db.query(Trip).filter(Trip.user_id == user.id)
        total = query.count()
        offset = (page - 1) * page_size
        trips = query.order_by(Trip.start_date.desc()).offset(offset).limit(page_size).all()
        return trips, total

    @staticmethod
    def get_trip_by_id(db: Session, trip_id: UUID, current_user: Optional[User] = None) -> Trip:
        trip = db.query(Trip).filter(Trip.id == trip_id).first()
        if not trip:
            raise NotFoundException(message="Trip not found", code="TRIP_NOT_FOUND")

        # Authorization check
        if current_user and trip.user_id == current_user.id:
            return trip
        if trip.visibility.value == "public":
            return trip
        
        raise ForbiddenException(message="You do not have permission to view this trip", code="TRIP_ACCESS_DENIED")

    @staticmethod
    def create_trip(db: Session, user: User, trip_in: TripCreate) -> Trip:
        if trip_in.start_date > trip_in.end_date:
            raise BadRequestException(message="Trip start date cannot be after end date", code="INVALID_DATE_RANGE")

        share_token = secrets.token_urlsafe(16)
        db_trip = Trip(
            user_id=user.id,
            name=trip_in.name,
            description=trip_in.description,
            start_date=trip_in.start_date,
            end_date=trip_in.end_date,
            budget_limit=trip_in.budget_limit,
            currency=trip_in.currency,
            visibility=trip_in.visibility,
            share_token=share_token
        )
        db.add(db_trip)
        db.commit()
        db.refresh(db_trip)
        return db_trip
