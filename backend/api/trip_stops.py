from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from backend.core.dependencies import get_db, get_current_user
from backend.models.trip_stop import TripStop
from backend.models.user import User
from backend.schemas.common import SuccessResponse
from backend.schemas.trip_stop import TripStopCreate, TripStopResponse
from backend.services.trip_service import TripService

router = APIRouter(prefix="/trip-stops", tags=["Trip Stops"])

@router.get("", response_model=SuccessResponse[List[TripStopResponse]])
def list_trip_stops(
    trip_id: UUID = Query(..., description="Trip ID to fetch stops for"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """List ordered destination city stops for a trip."""
    # Verify trip ownership / access
    TripService.get_trip_by_id(db, trip_id, current_user)
    stops = db.query(TripStop).filter(TripStop.trip_id == trip_id).order_by(TripStop.stop_order).all()
    return SuccessResponse(data=[TripStopResponse.model_validate(s) for s in stops])

@router.post("", response_model=SuccessResponse[TripStopResponse], status_code=status.HTTP_201_CREATED)
def create_trip_stop(
    stop_in: TripStopCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Add a new destination city stop to a trip."""
    TripService.get_trip_by_id(db, stop_in.trip_id, current_user)
    db_stop = TripStop(
        trip_id=stop_in.trip_id,
        city_id=stop_in.city_id,
        start_date=stop_in.start_date,
        end_date=stop_in.end_date,
        stop_order=stop_in.stop_order,
        notes=stop_in.notes
    )
    db.add(db_stop)
    db.commit()
    db.refresh(db_stop)
    return SuccessResponse(data=TripStopResponse.model_validate(db_stop))
