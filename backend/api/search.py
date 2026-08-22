from typing import Optional, List
from uuid import UUID
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from backend.core.dependencies import get_db, get_current_user
from backend.models.user import User
from backend.schemas.common import SuccessResponse, PaginatedResponse, PaginationMeta
from backend.schemas.search import (
    SearchResultItem, UnifiedSearchResponse,
    RecommendationItem, RecommendationListResponse
)
from backend.services.search_service import SearchService
from backend.services.recommendation_service import RecommendationService

router = APIRouter(tags=["Search & Recommendations"])

@router.get("/search", response_model=SuccessResponse[UnifiedSearchResponse])
def search_entities(
    q: Optional[str] = Query(None, description="Search query term"),
    entity_type: Optional[str] = Query(None, description="Filter entity type: country | city | activity | public_trip"),
    country_id: Optional[UUID] = Query(None, description="Filter by country ID"),
    city_id: Optional[UUID] = Query(None, description="Filter by city ID"),
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(20, ge=1, le=100, description="Items per page"),
    sort: Optional[str] = Query(None, description="Sort order: name | type"),
    db: Session = Depends(get_db)
):
    """Unified search endpoint for discovering countries, cities, activities, and public trips (no auth required)."""
    items, pagination = SearchService.unified_search(
        db=db,
        query_str=q,
        entity_type=entity_type,
        country_id=country_id,
        city_id=city_id,
        page=page,
        page_size=page_size,
        sort=sort
    )
    search_resp = UnifiedSearchResponse(items=items, pagination=pagination)
    return SuccessResponse(data=search_resp)

@router.get("/recommendations", response_model=SuccessResponse[RecommendationListResponse])
def get_personalized_recommendations(
    type: Optional[str] = Query("all", description="Recommendation category: cities | activities | trips | all"),
    limit: int = Query(20, ge=1, le=50, description="Maximum recommendations"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get personalized, rank-ordered recommendations for the authenticated user."""
    rec_resp = RecommendationService.get_recommendations(
        db=db,
        user=current_user,
        rec_type=type,
        limit=limit
    )
    return SuccessResponse(data=rec_resp)

@router.get("/cities/{city_id}/related", response_model=SuccessResponse[List[SearchResultItem]])
def get_related_cities(city_id: UUID, limit: int = Query(6, ge=1, le=20), db: Session = Depends(get_db)):
    """Retrieve related cities within the same country or region."""
    items = SearchService.get_related_cities(db, city_id, limit=limit)
    return SuccessResponse(data=items)

@router.get("/activities/{activity_id}/related", response_model=SuccessResponse[List[SearchResultItem]])
def get_related_activities(activity_id: UUID, limit: int = Query(6, ge=1, le=20), db: Session = Depends(get_db)):
    """Retrieve related activities in the same city or category."""
    items = SearchService.get_related_activities(db, activity_id, limit=limit)
    return SuccessResponse(data=items)

@router.get("/trips/{trip_id}/related", response_model=SuccessResponse[List[SearchResultItem]])
def get_related_trips(trip_id: UUID, limit: int = Query(6, ge=1, le=20), db: Session = Depends(get_db)):
    """Retrieve related public trips."""
    items = SearchService.get_related_trips(db, trip_id, limit=limit)
    return SuccessResponse(data=items)
