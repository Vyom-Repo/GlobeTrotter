from typing import List, Optional
from uuid import UUID
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from backend.core.dependencies import get_db
from backend.schemas.common import PaginatedResponse, PaginationMeta, SuccessResponse
from backend.schemas.trip import TripResponse, TripDetailResponse
from backend.services.sharing_service import SharingService

router = APIRouter(prefix="/public/trips", tags=["Public Discovery"])

@router.get("", response_model=PaginatedResponse[TripResponse])
def list_public_trips(
    search: Optional[str] = Query(None, description="Search public trips by title"),
    city_id: Optional[UUID] = Query(None, description="Filter by destination city ID"),
    country_id: Optional[UUID] = Query(None, description="Filter by destination country ID"),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """Search and discover public trips (no auth required)."""
    trips, total = SharingService.get_public_trips(
        db, search=search, city_id=city_id, country_id=country_id, page=page, page_size=page_size
    )
    total_pages = (total + page_size - 1) // page_size if total > 0 else 0
    return PaginatedResponse(
        data=[TripResponse.model_validate(t) for t in trips],
        pagination=PaginationMeta(page=page, page_size=page_size, total=total, total_pages=total_pages)
    )

@router.get("/{trip_id}", response_model=SuccessResponse[TripDetailResponse])
def get_public_trip_detail(trip_id: UUID, db: Session = Depends(get_db)):
    """Retrieve full public trip itinerary details by ID (no auth required)."""
    trip = SharingService.get_public_trip_by_id(db, trip_id)
    return SuccessResponse(data=TripDetailResponse.model_validate(trip))
