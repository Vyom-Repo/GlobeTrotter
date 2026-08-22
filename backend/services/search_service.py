from typing import Optional, List, Tuple
from uuid import UUID
from sqlalchemy.orm import Session
from sqlalchemy import func, or_, desc

from backend.core.exceptions import NotFoundException
from backend.models.country import Country
from backend.models.city import City
from backend.models.activity import Activity
from backend.models.trip import Trip, TripVisibility
from backend.models.trip_stop import TripStop
from backend.schemas.common import PaginationMeta
from backend.schemas.search import SearchResultItem

class SearchService:
    @staticmethod
    def unified_search(
        db: Session,
        query_str: Optional[str] = None,
        entity_type: Optional[str] = None,
        country_id: Optional[UUID] = None,
        city_id: Optional[UUID] = None,
        page: int = 1,
        page_size: int = 20,
        sort: Optional[str] = None
    ) -> Tuple[List[SearchResultItem], PaginationMeta]:
        """Perform robust server-side search across countries, cities, activities, and public trips."""
        results: List[SearchResultItem] = []
        clean_q = (query_str or "").strip().lower()

        # Normalize entity type filter
        valid_entity_types = {"country", "city", "activity", "public_trip"}
        target_entities = {entity_type.lower()} if entity_type and entity_type.lower() in valid_entity_types else valid_entity_types

        # 1. Search Countries
        if "country" in target_entities:
            c_query = db.query(Country)
            if clean_q:
                c_query = c_query.filter(func.lower(Country.name).contains(clean_q))
            if country_id:
                c_query = c_query.filter(Country.id == country_id)
            
            for c in c_query.limit(50).all():
                results.append(SearchResultItem(
                    id=c.id,
                    entity_type="country",
                    title=c.name,
                    description=f"{c.region or 'Global'} destination ({c.iso_code})",
                    image_url=getattr(c, 'flag_emoji', None),
                    location=c.name
                ))

        # 2. Search Cities
        if "city" in target_entities:
            ci_query = db.query(City)
            if clean_q:
                ci_query = ci_query.filter(or_(
                    func.lower(City.name).contains(clean_q),
                    func.lower(City.description).contains(clean_q)
                ))
            if country_id:
                ci_query = ci_query.filter(City.country_id == country_id)
            if city_id:
                ci_query = ci_query.filter(City.id == city_id)

            for ci in ci_query.limit(50).all():
                country_name = ci.country.name if hasattr(ci, 'country') and ci.country else ""
                results.append(SearchResultItem(
                    id=ci.id,
                    entity_type="city",
                    title=ci.name,
                    description=ci.description,
                    image_url=ci.image_url,
                    location=f"{ci.name}, {country_name}".strip(", ")
                ))

        # 3. Search Activities
        if "activity" in target_entities:
            act_query = db.query(Activity)
            if clean_q:
                act_query = act_query.filter(or_(
                    func.lower(Activity.name).contains(clean_q),
                    func.lower(Activity.description).contains(clean_q),
                    func.lower(Activity.activity_type).contains(clean_q)
                ))
            if city_id:
                act_query = act_query.filter(Activity.city_id == city_id)

            for act in act_query.limit(50).all():
                city_name = act.city.name if hasattr(act, 'city') and act.city else ""
                results.append(SearchResultItem(
                    id=act.id,
                    entity_type="activity",
                    title=act.name,
                    description=act.description,
                    image_url=act.image_url,
                    location=f"{city_name} • {act.activity_type.title()}"
                ))

        # 4. Search Public Trips
        if "public_trip" in target_entities:
            t_query = db.query(Trip).filter(Trip.visibility == TripVisibility.PUBLIC)
            if clean_q:
                t_query = t_query.filter(or_(
                    func.lower(Trip.name).contains(clean_q),
                    func.lower(Trip.description).contains(clean_q)
                ))
            if city_id:
                t_query = t_query.join(TripStop).filter(TripStop.city_id == city_id)

            for t in t_query.limit(50).all():
                results.append(SearchResultItem(
                    id=t.id,
                    entity_type="public_trip",
                    title=t.name,
                    description=t.description,
                    image_url=t.cover_photo_url,
                    location=f"Public Trip • {t.start_date} to {t.end_date}"
                ))

        # Deterministic sorting
        if sort == "name":
            results.sort(key=lambda r: r.title.lower())
        else:
            results.sort(key=lambda r: (r.entity_type, r.title.lower()))

        total = len(results)
        total_pages = max(1, (total + page_size - 1) // page_size)
        offset = (page - 1) * page_size
        paginated_items = results[offset : offset + page_size]

        pagination = PaginationMeta(
            page=page,
            page_size=page_size,
            total=total,
            total_pages=total_pages
        )

        return paginated_items, pagination

    @staticmethod
    def get_related_cities(db: Session, city_id: UUID, limit: int = 6) -> List[SearchResultItem]:
        """Find related cities in the same country/region."""
        target_city = db.query(City).filter(City.id == city_id).first()
        if not target_city:
            raise NotFoundException("City not found")

        related = (
            db.query(City)
            .filter(City.country_id == target_city.country_id, City.id != city_id)
            .limit(limit)
            .all()
        )

        return [
            SearchResultItem(
                id=c.id,
                entity_type="city",
                title=c.name,
                description=c.description,
                image_url=c.image_url,
                location=f"{c.name}, {c.country.name if c.country else ''}".strip(", ")
            )
            for c in related
        ]

    @staticmethod
    def get_related_activities(db: Session, activity_id: UUID, limit: int = 6) -> List[SearchResultItem]:
        """Find related activities in the same city or activity type."""
        target_act = db.query(Activity).filter(Activity.id == activity_id).first()
        if not target_act:
            raise NotFoundException("Activity not found")

        related = (
            db.query(Activity)
            .filter(
                Activity.id != activity_id,
                or_(Activity.city_id == target_act.city_id, Activity.activity_type == target_act.activity_type)
            )
            .limit(limit)
            .all()
        )

        return [
            SearchResultItem(
                id=a.id,
                entity_type="activity",
                title=a.name,
                description=a.description,
                image_url=a.image_url,
                location=f"{a.city.name if a.city else ''} • {a.activity_type.title()}"
            )
            for a in related
        ]

    @staticmethod
    def get_related_trips(db: Session, trip_id: UUID, limit: int = 6) -> List[SearchResultItem]:
        """Find related public trips."""
        target_trip = db.query(Trip).filter(Trip.id == trip_id).first()
        if not target_trip:
            raise NotFoundException("Trip not found")

        related = (
            db.query(Trip)
            .filter(Trip.visibility == TripVisibility.PUBLIC, Trip.id != trip_id)
            .limit(limit)
            .all()
        )

        return [
            SearchResultItem(
                id=t.id,
                entity_type="public_trip",
                title=t.name,
                description=t.description,
                image_url=t.cover_photo_url,
                location=f"Public Trip • {t.start_date} to {t.end_date}"
            )
            for t in related
        ]
