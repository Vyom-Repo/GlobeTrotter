from typing import Optional
from uuid import UUID
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from backend.core.dependencies import get_db
from backend.core.exceptions import NotFoundException
from backend.models.country import Country
from backend.schemas.common import PaginatedResponse, PaginationMeta, SuccessResponse
from backend.schemas.country import CountryResponse

router = APIRouter(prefix="/countries", tags=["Countries"])

@router.get("", response_model=PaginatedResponse[CountryResponse])
def list_countries(
    search: Optional[str] = Query(None, description="Search by country name or capital"),
    region: Optional[str] = Query(None, description="Filter by region (e.g. Europe, Asia)"),
    subregion: Optional[str] = Query(None, description="Filter by subregion"),
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(20, ge=1, le=100, description="Items per page"),
    db: Session = Depends(get_db)
):
    """List and search global countries from the offline PostgreSQL dataset."""
    query = db.query(Country)
    if search:
        query = query.filter(Country.name.ilike(f"%{search}%") | Country.capital.ilike(f"%{search}%"))
    if region:
        query = query.filter(Country.region == region)
    if subregion:
        query = query.filter(Country.subregion == subregion)

    total = query.count()
    total_pages = (total + page_size - 1) // page_size if total > 0 else 0
    offset = (page - 1) * page_size
    items = query.order_by(Country.name).offset(offset).limit(page_size).all()

    return PaginatedResponse(
        data=[CountryResponse.model_validate(c) for c in items],
        pagination=PaginationMeta(page=page, page_size=page_size, total=total, total_pages=total_pages)
    )

@router.get("/{country_id}", response_model=SuccessResponse[CountryResponse])
def get_country(country_id: UUID, db: Session = Depends(get_db)):
    """Retrieve details for a specific country by ID."""
    country = db.query(Country).filter(Country.id == country_id).first()
    if not country:
        raise NotFoundException(message="Country not found", code="COUNTRY_NOT_FOUND")
    return SuccessResponse(data=CountryResponse.model_validate(country))
