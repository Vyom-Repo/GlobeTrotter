from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from backend.core.dependencies import get_db, get_current_user, get_current_user_optional
from backend.models.user import User
from backend.schemas.common import SuccessResponse
from backend.schemas.trip_stop import TripStopCreate, TripStopUpdate, TripStopResponse, TripStopReorderItem
from backend.services.trip_service import TripService

router = APIRouter(tags=["Trip Stops"])

@router.get("/trip-stops", response_model=SuccessResponse[List[TripStopResponse]])
def list_trip_stops(
    trip_id: UUID = Query(..., description="Trip ID to fetch stops for"),
    current_user: User = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    """List ordered destination city stops for a trip."""
    stops = TripService.list_stops(db, trip_id, current_user)
    return SuccessResponse(data=[TripStopResponse.model_validate(s) for s in stops])

@router.get("/trips/{trip_id}/stops", response_model=SuccessResponse[List[TripStopResponse]])
def list_trip_stops_alt(
    trip_id: UUID,
    current_user: User = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    """List ordered destination city stops for a trip (path parameter variant)."""
    stops = TripService.list_stops(db, trip_id, current_user)
    return SuccessResponse(data=[TripStopResponse.model_validate(s) for s in stops])

@router.post("/trip-stops", response_model=SuccessResponse[TripStopResponse], status_code=status.HTTP_201_CREATED)
def create_trip_stop(
    stop_in: TripStopCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Add a new destination city stop to a trip."""
    stop = TripService.add_stop(db, stop_in, current_user)
    return SuccessResponse(data=TripStopResponse.model_validate(stop))

@router.get("/trip-stops/{stop_id}", response_model=SuccessResponse[TripStopResponse])
def get_trip_stop(
    stop_id: UUID,
    current_user: User = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    """Get details of a specific trip stop."""
    stop = TripService.get_stop(db, stop_id, current_user)
    return SuccessResponse(data=TripStopResponse.model_validate(stop))

@router.put("/trip-stops/{stop_id}", response_model=SuccessResponse[TripStopResponse])
@router.patch("/trip-stops/{stop_id}", response_model=SuccessResponse[TripStopResponse])
def update_trip_stop(
    stop_id: UUID,
    stop_in: TripStopUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update destination dates, order, or notes for a trip stop (owner only)."""
    stop = TripService.update_stop(db, stop_id, stop_in, current_user)
    return SuccessResponse(data=TripStopResponse.model_validate(stop))

@router.delete("/trip-stops/{stop_id}", status_code=status.HTTP_200_OK)
def delete_trip_stop(
    stop_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a destination stop from a trip (owner only)."""
    TripService.delete_stop(db, stop_id, current_user)
    return {"success": True, "message": "Trip stop deleted successfully"}

@router.post("/trips/{trip_id}/stops/reorder", response_model=SuccessResponse[List[TripStopResponse]])
def reorder_trip_stops(
    trip_id: UUID,
    reorder_items: List[TripStopReorderItem],
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Reorder destination stops for a trip."""
    stops = TripService.reorder_stops(db, trip_id, reorder_items, current_user)
    return SuccessResponse(data=[TripStopResponse.model_validate(s) for s in stops])
