from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from backend.core.dependencies import get_db, get_current_user
from backend.models.itinerary_item import ItineraryItem
from backend.models.user import User
from backend.schemas.common import SuccessResponse
from backend.schemas.itinerary import ItineraryItemCreate, ItineraryItemResponse
from backend.services.itinerary_service import ItineraryService

router = APIRouter(prefix="/itinerary", tags=["Itinerary"])

@router.get("", response_model=SuccessResponse[List[ItineraryItemResponse]])
def list_itinerary_items(
    trip_stop_id: UUID = Query(..., description="Trip stop ID to fetch scheduled items for"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """List scheduled activities for a specific trip stop."""
    items = ItineraryService.get_items_by_stop(db, trip_stop_id)
    return SuccessResponse(data=[ItineraryItemResponse.model_validate(i) for i in items])

@router.post("", response_model=SuccessResponse[ItineraryItemResponse], status_code=status.HTTP_201_CREATED)
def create_itinerary_item(
    item_in: ItineraryItemCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Schedule an activity in a trip stop itinerary."""
    db_item = ItineraryItem(
        trip_stop_id=item_in.trip_stop_id,
        activity_id=item_in.activity_id,
        scheduled_date=item_in.scheduled_date,
        start_time=item_in.start_time,
        end_time=item_in.end_time,
        item_order=item_in.item_order,
        notes=item_in.notes,
        estimated_cost=item_in.estimated_cost
    )
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return SuccessResponse(data=ItineraryItemResponse.model_validate(db_item))
