import secrets
from uuid import UUID
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from backend.core.dependencies import get_db, get_current_user
from backend.models.trip_share import TripShare
from backend.models.user import User
from backend.schemas.common import SuccessResponse
from backend.schemas.trip import TripResponse
from backend.schemas.trip_share import TripShareCreate, TripShareResponse
from backend.services.sharing_service import SharingService
from backend.services.trip_service import TripService

router = APIRouter(prefix="/trip-shares", tags=["Trip Shares"])

@router.post("", response_model=SuccessResponse[TripShareResponse], status_code=status.HTTP_201_CREATED)
def create_trip_share(
    trip_id: UUID = Query(..., description="Trip ID to share"),
    share_in: TripShareCreate = TripShareCreate(),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Generate a share token for a trip."""
    TripService.get_trip_by_id(db, trip_id, current_user)
    token = secrets.token_urlsafe(24)
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
    return SuccessResponse(data=TripShareResponse.model_validate(db_share))

@router.get("/verify/{share_token}", response_model=SuccessResponse[TripResponse])
def verify_share_token(share_token: str, db: Session = Depends(get_db)):
    """Resolve and return trip details from a share token."""
    trip = SharingService.get_trip_by_share_token(db, share_token)
    return SuccessResponse(data=TripResponse.model_validate(trip))
