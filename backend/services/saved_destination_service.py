from typing import List, Optional, Tuple
from uuid import UUID
from sqlalchemy.orm import Session
from sqlalchemy import distinct, or_

from backend.core.exceptions import BadRequestException, NotFoundException, ForbiddenException
from backend.models.activity import Activity
from backend.models.city import City
from backend.models.country import Country
from backend.models.saved_destination import SavedDestination, SavedEntityType
from backend.models.user import User
from backend.schemas.city import CityResponse
from backend.schemas.saved_destination import SavedDestinationCreate, SavedDestinationResponse, SavedStateResponse

class SavedDestinationService:
    """Service layer handling bookmarked countries, cities, and activities."""

    @staticmethod
    def _build_response_dto(s: SavedDestination) -> SavedDestinationResponse:
        name = ""
        country_name = None
        entity_id = s.id
        city_dto = None
        details_dict = {}

        if s.entity_type == SavedEntityType.COUNTRY and s.country:
            entity_id = s.country_id
            name = s.country.name
            country_name = s.country.name
            details_dict = {"iso_code": s.country.iso_code, "region": s.country.region}
        elif s.entity_type == SavedEntityType.CITY and s.city:
            entity_id = s.city_id
            name = s.city.name
            if s.city.country:
                country_name = s.city.country.name
            city_dto = CityResponse.model_validate(s.city)
            details_dict = {"region": s.city.region, "cost_index": float(s.city.cost_index) if s.city.cost_index is not None else None}
        elif s.entity_type == SavedEntityType.ACTIVITY and s.activity:
            entity_id = s.activity_id
            name = s.activity.name
            if s.activity.city:
                details_dict["city_name"] = s.activity.city.name
                if s.activity.city.country:
                    country_name = s.activity.city.country.name
            details_dict["activity_type"] = s.activity.activity_type
            details_dict["estimated_cost"] = float(s.activity.estimated_cost) if s.activity.estimated_cost is not None else None

        return SavedDestinationResponse(
            id=s.id,
            user_id=s.user_id,
            entity_type=s.entity_type,
            entity_id=entity_id,
            name=name,
            country=country_name,
            city_id=s.city_id,
            country_id=s.country_id,
            activity_id=s.activity_id,
            created_at=s.created_at,
            city=city_dto,
            details=details_dict
        )

    @staticmethod
    def save_destination(db: Session, user: User, dest_in: SavedDestinationCreate) -> SavedDestinationResponse:
        entity_type = dest_in.entity_type or SavedEntityType.CITY
        entity_id = dest_in.entity_id or dest_in.city_id

        if not entity_id:
            raise BadRequestException(message="entity_id (or city_id) is required", code="INVALID_ENTITY_ID")

        country_id = None
        city_id = None
        activity_id = None

        if entity_type == SavedEntityType.COUNTRY:
            country = db.query(Country).filter(Country.id == entity_id).first()
            if not country:
                raise NotFoundException(message="Country not found in travel dataset", code="COUNTRY_NOT_FOUND")
            country_id = entity_id
            existing = db.query(SavedDestination).filter(
                SavedDestination.user_id == user.id,
                SavedDestination.country_id == country_id
            ).first()
        elif entity_type == SavedEntityType.CITY:
            city = db.query(City).filter(City.id == entity_id).first()
            if not city:
                raise NotFoundException(message="City not found in travel dataset", code="CITY_NOT_FOUND")
            city_id = entity_id
            existing = db.query(SavedDestination).filter(
                SavedDestination.user_id == user.id,
                SavedDestination.city_id == city_id
            ).first()
        elif entity_type == SavedEntityType.ACTIVITY:
            activity = db.query(Activity).filter(Activity.id == entity_id).first()
            if not activity:
                raise NotFoundException(message="Activity not found in travel dataset", code="ACTIVITY_NOT_FOUND")
            activity_id = entity_id
            existing = db.query(SavedDestination).filter(
                SavedDestination.user_id == user.id,
                SavedDestination.activity_id == activity_id
            ).first()
        else:
            raise BadRequestException(message="Invalid entity_type. Must be 'country', 'city', or 'activity'", code="INVALID_ENTITY_TYPE")

        if existing:
            raise BadRequestException(message="Entity is already in your saved items", code="DESTINATION_ALREADY_SAVED")

        db_saved = SavedDestination(
            user_id=user.id,
            entity_type=entity_type,
            country_id=country_id,
            city_id=city_id,
            activity_id=activity_id
        )
        db.add(db_saved)
        db.commit()
        db.refresh(db_saved)

        return SavedDestinationService._build_response_dto(db_saved)

    @staticmethod
    def list_saved_destinations(
        db: Session,
        user: User,
        entity_type: Optional[SavedEntityType] = None,
        search: Optional[str] = None,
        country_id: Optional[UUID] = None,
        city_id: Optional[UUID] = None,
        page: int = 1,
        page_size: int = 20
    ) -> Tuple[List[SavedDestinationResponse], int]:
        query = db.query(SavedDestination).filter(SavedDestination.user_id == user.id)

        if entity_type:
            query = query.filter(SavedDestination.entity_type == entity_type)
        if country_id:
            query = query.filter(
                or_(
                    SavedDestination.country_id == country_id,
                    SavedDestination.city.has(City.country_id == country_id)
                )
            )
        if city_id:
            query = query.filter(
                or_(
                    SavedDestination.city_id == city_id,
                    SavedDestination.activity.has(Activity.city_id == city_id)
                )
            )
        if search:
            search_pattern = f"%{search}%"
            query = query.filter(
                or_(
                    SavedDestination.country.has(Country.name.ilike(search_pattern)),
                    SavedDestination.city.has(City.name.ilike(search_pattern)),
                    SavedDestination.activity.has(Activity.name.ilike(search_pattern))
                )
            )

        total = query.count()
        items = (
            query.order_by(SavedDestination.created_at.desc())
            .offset((page - 1) * page_size)
            .limit(page_size)
            .all()
        )

        dtos = [SavedDestinationService._build_response_dto(s) for s in items]
        return dtos, total

    @staticmethod
    def get_saved_destination(db: Session, saved_id: UUID, user: User) -> SavedDestinationResponse:
        saved = db.query(SavedDestination).filter(SavedDestination.id == saved_id).first()
        if not saved or saved.user_id != user.id:
            raise NotFoundException(message="Saved item not found", code="SAVED_DESTINATION_NOT_FOUND")

        return SavedDestinationService._build_response_dto(saved)

    @staticmethod
    def remove_saved_destination(db: Session, user: User, saved_id: UUID) -> None:
        saved = db.query(SavedDestination).filter(SavedDestination.id == saved_id).first()
        if not saved or saved.user_id != user.id:
            raise NotFoundException(message="Saved item not found", code="SAVED_DESTINATION_NOT_FOUND")

        db.delete(saved)
        db.commit()

    @staticmethod
    def check_saved_state(db: Session, user: User, entity_type: SavedEntityType, entity_id: UUID) -> SavedStateResponse:
        query = db.query(SavedDestination).filter(SavedDestination.user_id == user.id)

        if entity_type == SavedEntityType.COUNTRY:
            query = query.filter(SavedDestination.country_id == entity_id)
        elif entity_type == SavedEntityType.CITY:
            query = query.filter(SavedDestination.city_id == entity_id)
        elif entity_type == SavedEntityType.ACTIVITY:
            query = query.filter(SavedDestination.activity_id == entity_id)

        item = query.first()
        if item:
            return SavedStateResponse(saved=True, saved_id=item.id)
        return SavedStateResponse(saved=False, saved_id=None)
