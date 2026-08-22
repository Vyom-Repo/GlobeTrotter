from typing import List
from uuid import UUID
from datetime import date
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from backend.core.dependencies import get_db, get_current_user, get_current_user_optional
from backend.models.user import User
from backend.schemas.common import SuccessResponse
from backend.schemas.itinerary import ItineraryItemCreate, ItineraryItemUpdate, ItineraryItemResponse, ItineraryItemReorderItem
from backend.services.itinerary_service import ItineraryService

router = APIRouter(tags=["Itinerary"])

@router.get("/itinerary", response_model=SuccessResponse[List[ItineraryItemResponse]])
def list_itinerary_items(
    trip_stop_id: UUID = Query(..., description="Trip stop ID to fetch scheduled items for"),
    current_user: User = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    """List scheduled activities for a specific trip stop."""
    items = ItineraryService.get_items_by_stop(db, trip_stop_id, current_user)
    return SuccessResponse(data=[ItineraryItemResponse.model_validate(i) for i in items])

@router.get("/trip-stops/{stop_id}/itinerary", response_model=SuccessResponse[List[ItineraryItemResponse]])
def list_itinerary_items_by_stop(
    stop_id: UUID,
    current_user: User = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    """List scheduled activities for a specific trip stop (path parameter variant)."""
    items = ItineraryService.get_items_by_stop(db, stop_id, current_user)
    return SuccessResponse(data=[ItineraryItemResponse.model_validate(i) for i in items])

@router.post("/itinerary", response_model=SuccessResponse[ItineraryItemResponse], status_code=status.HTTP_201_CREATED)
def create_itinerary_item(
    item_in: ItineraryItemCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Schedule an activity in a trip stop itinerary (owner only)."""
    item = ItineraryService.add_item(db, item_in, current_user)
    return SuccessResponse(data=ItineraryItemResponse.model_validate(item))

@router.get("/itinerary/{item_id}", response_model=SuccessResponse[ItineraryItemResponse])
def get_itinerary_item(
    item_id: UUID,
    current_user: User = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    """Get details of a specific itinerary item."""
    item = ItineraryService.get_item_by_id(db, item_id, current_user)
    return SuccessResponse(data=ItineraryItemResponse.model_validate(item))

@router.put("/itinerary/{item_id}", response_model=SuccessResponse[ItineraryItemResponse])
@router.patch("/itinerary/{item_id}", response_model=SuccessResponse[ItineraryItemResponse])
def update_itinerary_item(
    item_id: UUID,
    item_in: ItineraryItemUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update date, time, order, or notes of an itinerary item (owner only)."""
    item = ItineraryService.update_item(db, item_id, item_in, current_user)
    return SuccessResponse(data=ItineraryItemResponse.model_validate(item))

@router.delete("/itinerary/{item_id}", status_code=status.HTTP_200_OK)
def delete_itinerary_item(
    item_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete an itinerary item from a trip stop (owner only)."""
    ItineraryService.delete_item(db, item_id, current_user)
    return {"success": True, "message": "Itinerary item deleted successfully"}

@router.post("/trip-stops/{stop_id}/itinerary/reorder", response_model=SuccessResponse[List[ItineraryItemResponse]])
def reorder_itinerary_items(
    stop_id: UUID,
    scheduled_date: date,
    reorder_items: List[ItineraryItemReorderItem],
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Reorder itinerary items for a specific trip stop day."""
    items = ItineraryService.reorder_items(db, stop_id, scheduled_date, reorder_items, current_user)
    return SuccessResponse(data=[ItineraryItemResponse.model_validate(i) for i in items])
