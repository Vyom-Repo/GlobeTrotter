from typing import List, Tuple
from uuid import UUID
from sqlalchemy.orm import Session

from backend.core.exceptions import NotFoundException
from backend.models.itinerary_item import ItineraryItem
from backend.models.trip_stop import TripStop

class ItineraryService:
    """Service layer handling itinerary items and day-wise schedule orchestration."""

    @staticmethod
    def get_items_by_stop(db: Session, trip_stop_id: UUID) -> List[ItineraryItem]:
        stop = db.query(TripStop).filter(TripStop.id == trip_stop_id).first()
        if not stop:
            raise NotFoundException(message="Trip stop not found", code="TRIP_STOP_NOT_FOUND")

        items = db.query(ItineraryItem).filter(
            ItineraryItem.trip_stop_id == trip_stop_id
        ).order_by(ItineraryItem.scheduled_date, ItineraryItem.item_order).all()
        
        return items
