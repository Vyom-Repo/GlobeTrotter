from typing import List, Optional
from uuid import UUID
from datetime import date
from sqlalchemy.orm import Session

from backend.core.exceptions import NotFoundException, ForbiddenException, BadRequestException
from backend.models.itinerary_item import ItineraryItem
from backend.models.trip_stop import TripStop
from backend.models.trip import Trip
from backend.models.activity import Activity
from backend.models.user import User
from backend.schemas.itinerary import ItineraryItemCreate, ItineraryItemUpdate, ItineraryItemReorderItem

class ItineraryService:
    """Service layer handling itinerary items, activity scheduling, and day-wise orchestration."""

    @staticmethod
    def get_items_by_stop(db: Session, trip_stop_id: UUID, current_user: Optional[User] = None) -> List[ItineraryItem]:
        stop = db.query(TripStop).filter(TripStop.id == trip_stop_id).first()
        if not stop:
            raise NotFoundException(message="Trip stop not found", code="TRIP_STOP_NOT_FOUND")

        # Authorization check via trip
        trip = db.query(Trip).filter(Trip.id == stop.trip_id).first()
        if not trip:
            raise NotFoundException(message="Associated trip not found", code="TRIP_NOT_FOUND")

        if current_user and trip.user_id == current_user.id:
            pass
        elif trip.visibility.value == "public":
            pass
        else:
            raise ForbiddenException(message="You do not have permission to view this itinerary", code="ITINERARY_ACCESS_DENIED")

        items = db.query(ItineraryItem).filter(
            ItineraryItem.trip_stop_id == trip_stop_id
        ).order_by(ItineraryItem.scheduled_date, ItineraryItem.item_order).all()

        return items

    @staticmethod
    def get_item_by_id(db: Session, item_id: UUID, current_user: Optional[User] = None) -> ItineraryItem:
        item = db.query(ItineraryItem).filter(ItineraryItem.id == item_id).first()
        if not item:
            raise NotFoundException(message="Itinerary item not found", code="ITINERARY_ITEM_NOT_FOUND")

        stop = db.query(TripStop).filter(TripStop.id == item.trip_stop_id).first()
        trip = db.query(Trip).filter(Trip.id == stop.trip_id).first() if stop else None

        if current_user and trip and trip.user_id == current_user.id:
            return item
        if trip and trip.visibility.value == "public":
            return item

        raise ForbiddenException(message="You do not have permission to view this itinerary item", code="ITINERARY_ACCESS_DENIED")

    @staticmethod
    def add_item(db: Session, item_in: ItineraryItemCreate, user: User) -> ItineraryItem:
        stop = db.query(TripStop).filter(TripStop.id == item_in.trip_stop_id).first()
        if not stop:
            raise NotFoundException(message="Trip stop not found", code="TRIP_STOP_NOT_FOUND")

        trip = db.query(Trip).filter(Trip.id == stop.trip_id).first()
        if not trip or trip.user_id != user.id:
            raise ForbiddenException(message="You do not have permission to modify this trip's itinerary", code="ITINERARY_MODIFY_DENIED")

        activity = db.query(Activity).filter(Activity.id == item_in.activity_id).first()
        if not activity:
            raise NotFoundException(message="Activity not found in dataset", code="ACTIVITY_NOT_FOUND")

        if activity.city_id != stop.city_id:
            raise BadRequestException(message="Activity does not belong to the selected destination stop city", code="ACTIVITY_CITY_MISMATCH")

        if item_in.scheduled_date < stop.start_date or item_in.scheduled_date > stop.end_date:
            raise BadRequestException(
                message=f"Scheduled date ({item_in.scheduled_date}) must fall within stop date range ({stop.start_date} to {stop.end_date})",
                code="SCHEDULED_DATE_OUT_OF_RANGE"
            )

        if item_in.item_order <= 0:
            raise BadRequestException(message="Item order must be a positive integer", code="INVALID_ITEM_ORDER")

        if item_in.start_time and item_in.end_time and item_in.start_time >= item_in.end_time:
            raise BadRequestException(message="Start time must be before end time", code="INVALID_TIME_RANGE")

        db_item = ItineraryItem(
            trip_stop_id=item_in.trip_stop_id,
            activity_id=item_in.activity_id,
            scheduled_date=item_in.scheduled_date,
            start_time=item_in.start_time,
            end_time=item_in.end_time,
            item_order=item_in.item_order,
            notes=item_in.notes,
            estimated_cost=item_in.estimated_cost if item_in.estimated_cost is not None else activity.estimated_cost
        )
        db.add(db_item)
        db.commit()
        db.refresh(db_item)
        return db_item

    @staticmethod
    def update_item(db: Session, item_id: UUID, item_in: ItineraryItemUpdate, user: User) -> ItineraryItem:
        item = db.query(ItineraryItem).filter(ItineraryItem.id == item_id).first()
        if not item:
            raise NotFoundException(message="Itinerary item not found", code="ITINERARY_ITEM_NOT_FOUND")

        stop = db.query(TripStop).filter(TripStop.id == item.trip_stop_id).first()
        trip = db.query(Trip).filter(Trip.id == stop.trip_id).first() if stop else None

        if not trip or trip.user_id != user.id:
            raise ForbiddenException(message="You do not have permission to modify this itinerary item", code="ITINERARY_MODIFY_DENIED")

        update_data = item_in.model_dump(exclude_unset=True)

        if "scheduled_date" in update_data:
            new_date = update_data["scheduled_date"]
            if new_date < stop.start_date or new_date > stop.end_date:
                raise BadRequestException(
                    message=f"Scheduled date ({new_date}) must fall within stop date range ({stop.start_date} to {stop.end_date})",
                    code="SCHEDULED_DATE_OUT_OF_RANGE"
                )

        if "item_order" in update_data and update_data["item_order"] <= 0:
            raise BadRequestException(message="Item order must be a positive integer", code="INVALID_ITEM_ORDER")

        new_start = update_data.get("start_time", item.start_time)
        new_end = update_data.get("end_time", item.end_time)
        if new_start and new_end and new_start >= new_end:
            raise BadRequestException(message="Start time must be before end time", code="INVALID_TIME_RANGE")

        for key, value in update_data.items():
            setattr(item, key, value)

        db.commit()
        db.refresh(item)
        return item

    @staticmethod
    def delete_item(db: Session, item_id: UUID, user: User) -> None:
        item = db.query(ItineraryItem).filter(ItineraryItem.id == item_id).first()
        if not item:
            raise NotFoundException(message="Itinerary item not found", code="ITINERARY_ITEM_NOT_FOUND")

        stop = db.query(TripStop).filter(TripStop.id == item.trip_stop_id).first()
        trip = db.query(Trip).filter(Trip.id == stop.trip_id).first() if stop else None

        if not trip or trip.user_id != user.id:
            raise ForbiddenException(message="You do not have permission to delete this itinerary item", code="ITINERARY_DELETE_DENIED")

        db.delete(item)
        db.commit()

    @staticmethod
    def reorder_items(db: Session, trip_stop_id: UUID, scheduled_date: date, reorder_items: List[ItineraryItemReorderItem], user: User) -> List[ItineraryItem]:
        stop = db.query(TripStop).filter(TripStop.id == trip_stop_id).first()
        if not stop:
            raise NotFoundException(message="Trip stop not found", code="TRIP_STOP_NOT_FOUND")

        trip = db.query(Trip).filter(Trip.id == stop.trip_id).first()
        if not trip or trip.user_id != user.id:
            raise ForbiddenException(message="You do not have permission to modify this trip's itinerary", code="ITINERARY_MODIFY_DENIED")

        items_by_id = {
            i.id: i for i in db.query(ItineraryItem).filter(
                ItineraryItem.trip_stop_id == trip_stop_id,
                ItineraryItem.scheduled_date == scheduled_date
            ).all()
        }

        for idx, item in enumerate(reorder_items):
            if item.item_id in items_by_id:
                items_by_id[item.item_id].item_order = 10000 + idx
        db.flush()

        for item in reorder_items:
            if item.item_id in items_by_id:
                if item.item_order <= 0:
                    raise BadRequestException(message="Item order must be positive", code="INVALID_ITEM_ORDER")
                items_by_id[item.item_id].item_order = item.item_order

        db.commit()
        return ItineraryService.get_items_by_stop(db, trip_stop_id, user)
