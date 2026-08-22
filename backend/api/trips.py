from uuid import UUID
from typing import List
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from backend.core.dependencies import get_db, get_current_user, get_current_user_optional
from backend.models.user import User
from backend.schemas.common import PaginatedResponse, PaginationMeta, SuccessResponse
from backend.schemas.trip import TripCreate, TripUpdate, TripResponse, TripDetailResponse
from backend.services.trip_service import TripService

router = APIRouter(prefix="/trips", tags=["Trips"])

@router.get("", response_model=PaginatedResponse[TripResponse])
def list_trips(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """List all trips created by the current authenticated user."""
    trips, total = TripService.get_user_trips(db, current_user, page, page_size)
    total_pages = (total + page_size - 1) // page_size if total > 0 else 0
    return PaginatedResponse(
        data=[TripResponse.model_validate(t) for t in trips],
        pagination=PaginationMeta(page=page, page_size=page_size, total=total, total_pages=total_pages)
    )

@router.post("", response_model=SuccessResponse[TripResponse], status_code=status.HTTP_201_CREATED)
def create_trip(
    trip_in: TripCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new travel trip for the current authenticated user."""
    trip = TripService.create_trip(db, current_user, trip_in)
    return SuccessResponse(data=TripResponse.model_validate(trip))

@router.get("/{trip_id}", response_model=SuccessResponse[TripDetailResponse])
def get_trip(
    trip_id: UUID,
    current_user: User = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    """Retrieve trip details by ID (authenticated owner or public visibility)."""
    trip = TripService.get_trip_by_id(db, trip_id, current_user)
    return SuccessResponse(data=TripDetailResponse.model_validate(trip))

@router.put("/{trip_id}", response_model=SuccessResponse[TripResponse])
@router.patch("/{trip_id}", response_model=SuccessResponse[TripResponse])
def update_trip(
    trip_id: UUID,
    trip_in: TripUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update trip details (owner only)."""
    trip = TripService.update_trip(db, trip_id, current_user, trip_in)
    return SuccessResponse(data=TripResponse.model_validate(trip))

@router.delete("/{trip_id}", status_code=status.HTTP_200_OK)
def delete_trip(
    trip_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a trip by ID (owner only)."""
    TripService.delete_trip(db, trip_id, current_user)
    return {"success": True, "message": "Trip deleted successfully"}
