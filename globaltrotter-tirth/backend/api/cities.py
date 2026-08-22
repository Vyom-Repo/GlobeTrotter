from typing import Optional
from uuid import UUID
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from backend.core.dependencies import get_db
from backend.core.exceptions import NotFoundException
from backend.models.city import City
from backend.schemas.city import CityResponse
from backend.schemas.common import PaginatedResponse, PaginationMeta, SuccessResponse

router = APIRouter(prefix="/cities", tags=["Cities"])

@router.get("", response_model=PaginatedResponse[CityResponse])
def list_cities(
    search: Optional[str] = Query(None, description="Search by city name"),
    country_id: Optional[UUID] = Query(None, description="Filter by country ID"),
    region: Optional[str] = Query(None, description="Filter by city region"),
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(20, ge=1, le=100, description="Items per page"),
    db: Session = Depends(get_db)
):
    """List and search global destination cities from the offline PostgreSQL dataset."""
    query = db.query(City)
    if search:
        query = query.filter(City.name.ilike(f"%{search}%"))
    if country_id:
        query = query.filter(City.country_id == country_id)
    if region:
        query = query.filter(City.region == region)

    total = query.count()
    total_pages = (total + page_size - 1) // page_size if total > 0 else 0
    offset = (page - 1) * page_size
    items = query.order_by(City.popularity_score.desc().nullslast(), City.name).offset(offset).limit(page_size).all()

    return PaginatedResponse(
        data=[CityResponse.model_validate(c) for c in items],
        pagination=PaginationMeta(page=page, page_size=page_size, total=total, total_pages=total_pages)
    )

@router.get("/{city_id}", response_model=SuccessResponse[CityResponse])
def get_city(city_id: UUID, db: Session = Depends(get_db)):
    """Retrieve details for a specific city by ID."""
    city = db.query(City).filter(City.id == city_id).first()
    if not city:
        raise NotFoundException(message="City not found", code="CITY_NOT_FOUND")
    return SuccessResponse(data=CityResponse.model_validate(city))
