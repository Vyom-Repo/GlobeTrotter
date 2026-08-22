from typing import List
from uuid import UUID
from sqlalchemy.orm import Session

from backend.core.exceptions import BadRequestException, NotFoundException
from backend.models.city import City
from backend.models.saved_destination import SavedDestination
from backend.models.user import User

class SavedDestinationService:
    """Service layer handling bookmarked destination cities."""

    @staticmethod
    def list_saved_destinations(db: Session, user: User) -> List[SavedDestination]:
        return (
            db.query(SavedDestination)
            .filter(SavedDestination.user_id == user.id)
            .order_by(SavedDestination.created_at.desc())
            .all()
        )

    @staticmethod
    def save_destination(db: Session, user: User, city_id: UUID) -> SavedDestination:
        city = db.query(City).filter(City.id == city_id).first()
        if not city:
            raise NotFoundException(message="City not found in travel dataset", code="CITY_NOT_FOUND")

        existing = db.query(SavedDestination).filter(
            SavedDestination.user_id == user.id,
            SavedDestination.city_id == city_id
        ).first()
        if existing:
            raise BadRequestException(message="City is already in your saved destinations", code="DESTINATION_ALREADY_SAVED")

        db_saved = SavedDestination(user_id=user.id, city_id=city_id)
        db.add(db_saved)
        db.commit()
        db.refresh(db_saved)
        return db_saved

    @staticmethod
    def remove_saved_destination(db: Session, user: User, saved_id: UUID) -> None:
        saved = db.query(SavedDestination).filter(
            SavedDestination.id == saved_id,
            SavedDestination.user_id == user.id
        ).first()
        if not saved:
            raise NotFoundException(message="Saved destination not found", code="SAVED_DESTINATION_NOT_FOUND")

        db.delete(saved)
        db.commit()
