from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from backend.core.dependencies import get_db, get_current_user
from backend.models.user import User
from backend.schemas.common import SuccessResponse
from backend.schemas.trip import TripDetailResponse
from backend.schemas.trip_share import TripShareCreate, TripShareResponse
from backend.services.sharing_service import SharingService

router = APIRouter(tags=["Trip Sharing"])

@router.post("/trip-shares", response_model=SuccessResponse[TripShareResponse], status_code=status.HTTP_201_CREATED)
def create_trip_share(
    trip_id: UUID = Query(..., description="Trip ID to share"),
    share_in: TripShareCreate = TripShareCreate(),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Generate a share token for a trip (owner only)."""
    db_share = SharingService.create_share(db, trip_id, share_in, current_user)
    return SuccessResponse(data=TripShareResponse.model_validate(db_share))

@router.get("/trips/{trip_id}/shares", response_model=SuccessResponse[List[TripShareResponse]])
def list_trip_shares(
    trip_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """List all active share tokens for a trip (owner only)."""
    shares = SharingService.list_shares(db, trip_id, current_user)
    return SuccessResponse(data=[TripShareResponse.model_validate(s) for s in shares])

@router.delete("/trip-shares/{share_id}", status_code=status.HTTP_200_OK)
def revoke_trip_share(
    share_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Revoke/delete a share token (owner only)."""
    SharingService.revoke_share(db, share_id, current_user)
    return {"success": True, "message": "Share token revoked successfully"}

@router.get("/trip-shares/{share_token}", response_model=SuccessResponse[TripDetailResponse])
def get_shared_trip_by_token(share_token: str, db: Session = Depends(get_db)):
    """Resolve and return public trip details from a share token (no auth required)."""
    trip = SharingService.get_trip_by_share_token(db, share_token)
    return SuccessResponse(data=TripDetailResponse.model_validate(trip))
