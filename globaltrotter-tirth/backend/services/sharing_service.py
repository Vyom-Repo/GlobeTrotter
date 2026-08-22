import secrets
from typing import Optional
from uuid import UUID
from sqlalchemy.orm import Session

from backend.core.exceptions import NotFoundException, ForbiddenException
from backend.models.trip import Trip
from backend.models.trip_share import TripShare, SharePermission
from backend.models.user import User

class SharingService:
    """Service layer handling trip share token verification and access permissions."""

    @staticmethod
    def get_trip_by_share_token(db: Session, share_token: str) -> Trip:
        trip = db.query(Trip).filter(Trip.share_token == share_token).first()
        if not trip:
            # Check trip_shares table for specific token
            share = db.query(TripShare).filter(TripShare.share_token == share_token).first()
            if not share:
                raise NotFoundException(message="Shared trip token not found or invalid", code="SHARE_TOKEN_INVALID")
            trip = db.query(Trip).filter(Trip.id == share.trip_id).first()

        return trip
