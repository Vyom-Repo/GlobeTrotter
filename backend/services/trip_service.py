import secrets
from typing import List, Optional, Tuple
from uuid import UUID
from sqlalchemy.orm import Session

from backend.core.exceptions import NotFoundException, ForbiddenException, BadRequestException
from backend.models.trip import Trip
from backend.models.trip_stop import TripStop
from backend.models.city import City
from backend.models.user import User
from backend.schemas.trip import TripCreate, TripUpdate
from backend.schemas.trip_stop import TripStopCreate, TripStopUpdate, TripStopReorderItem

class TripService:
    """Service layer handling trip creation, querying, updating, deletion, and destination stops."""

    @staticmethod
    def get_user_trips(db: Session, user: User, page: int = 1, page_size: int = 20) -> Tuple[List[Trip], int]:
        query = db.query(Trip).filter(Trip.user_id == user.id)
        total = query.count()
        offset = (page - 1) * page_size
        trips = query.order_by(Trip.start_date.desc(), Trip.created_at.desc()).offset(offset).limit(page_size).all()
        return trips, total

    @staticmethod
    def get_trip_by_id(db: Session, trip_id: UUID, current_user: Optional[User] = None) -> Trip:
        trip = db.query(Trip).filter(Trip.id == trip_id).first()
        if not trip:
            raise NotFoundException(message="Trip not found", code="TRIP_NOT_FOUND")

        # Authorization check
        if current_user and trip.user_id == current_user.id:
            return trip
        if trip.visibility.value == "public":
            return trip

        raise ForbiddenException(message="You do not have permission to view this trip", code="TRIP_ACCESS_DENIED")

    @staticmethod
    def create_trip(db: Session, user: User, trip_in: TripCreate) -> Trip:
        if trip_in.start_date > trip_in.end_date:
            raise BadRequestException(message="Trip start date cannot be after end date", code="INVALID_DATE_RANGE")

        share_token = secrets.token_urlsafe(16)
        db_trip = Trip(
            user_id=user.id,
            name=trip_in.name,
            description=trip_in.description,
            start_date=trip_in.start_date,
            end_date=trip_in.end_date,
            budget_limit=trip_in.budget_limit,
            currency=trip_in.currency,
            visibility=trip_in.visibility,
            share_token=share_token
        )
        db.add(db_trip)
        db.commit()
        db.refresh(db_trip)
        return db_trip

    @staticmethod
    def update_trip(db: Session, trip_id: UUID, user: User, trip_in: TripUpdate) -> Trip:
        trip = db.query(Trip).filter(Trip.id == trip_id).first()
        if not trip:
            raise NotFoundException(message="Trip not found", code="TRIP_NOT_FOUND")

        if trip.user_id != user.id:
            raise ForbiddenException(message="You do not have permission to modify this trip", code="TRIP_MODIFY_DENIED")

        update_data = trip_in.model_dump(exclude_unset=True)

        new_start = update_data.get("start_date", trip.start_date)
        new_end = update_data.get("end_date", trip.end_date)
        if new_start > new_end:
            raise BadRequestException(message="Trip start date cannot be after end date", code="INVALID_DATE_RANGE")

        for key, value in update_data.items():
            setattr(trip, key, value)

        db.commit()
        db.refresh(trip)
        return trip

    @staticmethod
    def delete_trip(db: Session, trip_id: UUID, user: User) -> None:
        trip = db.query(Trip).filter(Trip.id == trip_id).first()
        if not trip:
            raise NotFoundException(message="Trip not found", code="TRIP_NOT_FOUND")

        if trip.user_id != user.id:
            raise ForbiddenException(message="You do not have permission to delete this trip", code="TRIP_DELETE_DENIED")

        db.delete(trip)
        db.commit()

    # --- TRIP STOPS SERVICE METHODS ---

    @staticmethod
    def add_stop(db: Session, stop_in: TripStopCreate, user: User) -> TripStop:
        # Verify trip ownership
        trip = TripService.get_trip_by_id(db, stop_in.trip_id, user)
        if trip.user_id != user.id:
            raise ForbiddenException(message="You do not have permission to modify this trip", code="TRIP_MODIFY_DENIED")

        # Verify city exists
        city = db.query(City).filter(City.id == stop_in.city_id).first()
        if not city:
            raise NotFoundException(message="City not found in dataset", code="CITY_NOT_FOUND")

        # Validate dates
        if stop_in.start_date > stop_in.end_date:
            raise BadRequestException(message="Stop start date cannot be after end date", code="INVALID_DATE_RANGE")

        if stop_in.stop_order <= 0:
            raise BadRequestException(message="Stop order must be a positive integer", code="INVALID_STOP_ORDER")

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
        return db_stop

    @staticmethod
    def list_stops(db: Session, trip_id: UUID, user: Optional[User] = None) -> List[TripStop]:
        TripService.get_trip_by_id(db, trip_id, user)
        stops = db.query(TripStop).filter(TripStop.trip_id == trip_id).order_by(TripStop.stop_order).all()
        return stops

    @staticmethod
    def get_stop(db: Session, stop_id: UUID, user: Optional[User] = None) -> TripStop:
        stop = db.query(TripStop).filter(TripStop.id == stop_id).first()
        if not stop:
            raise NotFoundException(message="Trip stop not found", code="TRIP_STOP_NOT_FOUND")

        TripService.get_trip_by_id(db, stop.trip_id, user)
        return stop

    @staticmethod
    def update_stop(db: Session, stop_id: UUID, stop_in: TripStopUpdate, user: User) -> TripStop:
        stop = db.query(TripStop).filter(TripStop.id == stop_id).first()
        if not stop:
            raise NotFoundException(message="Trip stop not found", code="TRIP_STOP_NOT_FOUND")

        # Verify trip ownership
        trip = db.query(Trip).filter(Trip.id == stop.trip_id).first()
        if not trip or trip.user_id != user.id:
            raise ForbiddenException(message="You do not have permission to modify this trip stop", code="STOP_MODIFY_DENIED")

        update_data = stop_in.model_dump(exclude_unset=True)

        new_start = update_data.get("start_date", stop.start_date)
        new_end = update_data.get("end_date", stop.end_date)
        if new_start > new_end:
            raise BadRequestException(message="Stop start date cannot be after end date", code="INVALID_DATE_RANGE")

        if "stop_order" in update_data and update_data["stop_order"] <= 0:
            raise BadRequestException(message="Stop order must be a positive integer", code="INVALID_STOP_ORDER")

        for key, value in update_data.items():
            setattr(stop, key, value)

        db.commit()
        db.refresh(stop)
        return stop

    @staticmethod
    def delete_stop(db: Session, stop_id: UUID, user: User) -> None:
        stop = db.query(TripStop).filter(TripStop.id == stop_id).first()
        if not stop:
            raise NotFoundException(message="Trip stop not found", code="TRIP_STOP_NOT_FOUND")

        trip = db.query(Trip).filter(Trip.id == stop.trip_id).first()
        if not trip or trip.user_id != user.id:
            raise ForbiddenException(message="You do not have permission to delete this trip stop", code="STOP_DELETE_DENIED")

        db.delete(stop)
        db.commit()

    @staticmethod
    def reorder_stops(db: Session, trip_id: UUID, reorder_items: List[TripStopReorderItem], user: User) -> List[TripStop]:
        trip = TripService.get_trip_by_id(db, trip_id, user)
        if trip.user_id != user.id:
            raise ForbiddenException(message="You do not have permission to modify this trip", code="TRIP_MODIFY_DENIED")

        stops_by_id = {s.id: s for s in db.query(TripStop).filter(TripStop.trip_id == trip_id).all()}

        for idx, item in enumerate(reorder_items):
            if item.stop_id in stops_by_id:
                stops_by_id[item.stop_id].stop_order = 10000 + idx
        db.flush()

        for item in reorder_items:
            if item.stop_id in stops_by_id:
                if item.stop_order <= 0:
                    raise BadRequestException(message="Stop order must be positive", code="INVALID_STOP_ORDER")
                stops_by_id[item.stop_id].stop_order = item.stop_order

        db.commit()
        return TripService.list_stops(db, trip_id, user)
