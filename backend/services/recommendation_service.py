import logging
from typing import Optional, List, Dict, Set
from uuid import UUID
from sqlalchemy.orm import Session
from sqlalchemy import desc

from backend.models.user import User
from backend.models.user_preference import UserPreference
from backend.models.saved_destination import SavedDestination
from backend.models.trip import Trip, TripVisibility
from backend.models.trip_stop import TripStop
from backend.models.city import City
from backend.models.activity import Activity
from backend.schemas.search import RecommendationItem, RecommendationListResponse

logger = logging.getLogger(__name__)

class RecommendationService:
    @staticmethod
    def get_recommendations(
        db: Session,
        user: User,
        rec_type: Optional[str] = None,
        limit: int = 20
    ) -> RecommendationListResponse:
        """Generate deterministic personalized recommendations based on saved destinations, trip history, and preferences."""
        recommendations: List[RecommendationItem] = []
        user_id = user.id

        # 1. Collect user's saved interests
        saved_items = db.query(SavedDestination).filter(SavedDestination.user_id == user_id).all()
        saved_city_ids: Set[UUID] = {s.city_id for s in saved_items if s.city_id}
        saved_country_ids: Set[UUID] = {s.country_id for s in saved_items if s.country_id}

        # 2. Collect user's previous trip stop city IDs
        trip_stops = (
            db.query(TripStop.city_id)
            .join(Trip, TripStop.trip_id == Trip.id)
            .filter(Trip.user_id == user_id)
            .all()
        )
        trip_city_ids: Set[UUID] = {ts[0] for ts in trip_stops if ts[0]}

        # 3. Collect user preference currency/language
        pref = db.query(UserPreference).filter(UserPreference.user_id == user_id).first()
        preferred_currency = (pref.currency if pref else "INR").upper()

        target_types = {rec_type.lower()} if rec_type and rec_type.lower() != "all" else {"cities", "activities", "trips"}

        # --- A. Recommend Cities ---
        if "cities" in target_types or "destinations" in target_types:
            cities = db.query(City).order_by(desc(City.popularity_score)).limit(30).all()
            for city in cities:
                if city.id in saved_city_ids:
                    continue  # Skip already saved

                score = 10.0  # Base score
                reasons = []

                if city.country_id in saved_country_ids:
                    score += 40.0
                    reasons.append("Matches your saved country preferences")
                if city.id in trip_city_ids:
                    score += 30.0
                    reasons.append("Similar to destinations from your past trips")
                if city.popularity_score and float(city.popularity_score) > 80:
                    score += 20.0
                    reasons.append("Top-rated popular destination")

                if reasons:
                    country_name = city.country.name if city.country else ""
                    recommendations.append(RecommendationItem(
                        id=city.id,
                        entity_type="city",
                        title=city.name,
                        subtitle=f"{city.name}, {country_name}".strip(", "),
                        image_url=city.image_url,
                        score=score,
                        match_reasons=reasons,
                        metadata_payload={"city_id": str(city.id), "popularity": float(city.popularity_score or 0)}
                    ))

        # --- B. Recommend Activities ---
        if "activities" in target_types:
            activities = db.query(Activity).order_by(desc(Activity.popularity_score)).limit(30).all()
            for act in activities:
                score = 10.0
                reasons = []

                if act.city_id in saved_city_ids:
                    score += 40.0
                    reasons.append("Located in one of your bookmarked cities")
                if act.city_id in trip_city_ids:
                    score += 30.0
                    reasons.append("Activity in a city from your trip itinerary")
                if act.currency.upper() == preferred_currency:
                    score += 10.0
                    reasons.append(f"Matches your currency preference ({preferred_currency})")

                if reasons:
                    city_name = act.city.name if act.city else "Popular Destination"
                    recommendations.append(RecommendationItem(
                        id=act.id,
                        entity_type="activity",
                        title=act.name,
                        subtitle=f"{city_name} • {act.activity_type.title()}",
                        image_url=act.image_url,
                        score=score,
                        match_reasons=reasons,
                        metadata_payload={"activity_id": str(act.id), "activity_type": act.activity_type}
                    ))

        # --- C. Recommend Public Trips ---
        if "trips" in target_types or "public_trips" in target_types:
            public_trips = db.query(Trip).filter(Trip.visibility == TripVisibility.PUBLIC, Trip.user_id != user_id).limit(20).all()
            for trip in public_trips:
                score = 15.0
                reasons = ["Community public trip itinerary"]

                if trip.currency.upper() == preferred_currency:
                    score += 15.0
                    reasons.append(f"Matches your currency ({preferred_currency})")

                recommendations.append(RecommendationItem(
                    id=trip.id,
                    entity_type="public_trip",
                    title=trip.name,
                    subtitle=f"{trip.start_date} to {trip.end_date}",
                    image_url=trip.cover_photo_url,
                    score=score,
                    match_reasons=reasons,
                    metadata_payload={"trip_id": str(trip.id)}
                ))

        # Rank-order by score descending, then title
        recommendations.sort(key=lambda r: (-r.score, r.title.lower()))
        top_recommendations = recommendations[:limit]

        return RecommendationListResponse(
            items=top_recommendations,
            total=len(top_recommendations)
        )
