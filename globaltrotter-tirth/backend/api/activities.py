from typing import Optional
from decimal import Decimal
from uuid import UUID
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from backend.core.dependencies import get_db
from backend.core.exceptions import NotFoundException
from backend.models.activity import Activity
from backend.schemas.activity import ActivityResponse
from backend.schemas.common import PaginatedResponse, PaginationMeta, SuccessResponse

router = APIRouter(prefix="/activities", tags=["Activities"])

@router.get("", response_model=PaginatedResponse[ActivityResponse])
def list_activities(
    search: Optional[str] = Query(None, description="Search activity name or description"),
    city_id: Optional[UUID] = Query(None, description="Filter by city ID"),
    activity_type: Optional[str] = Query(None, description="Filter by activity category (e.g. food, historical)"),
    max_cost: Optional[Decimal] = Query(None, description="Maximum estimated cost filter"),
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(20, ge=1, le=100, description="Items per page"),
    db: Session = Depends(get_db)
):
    """List and search global tourist activities from the offline PostgreSQL dataset."""
    query = db.query(Activity)
    if search:
        query = query.filter(Activity.name.ilike(f"%{search}%") | Activity.description.ilike(f"%{search}%"))
    if city_id:
        query = query.filter(Activity.city_id == city_id)
    if activity_type:
        query = query.filter(Activity.activity_type == activity_type)
    if max_cost is not None:
        query = query.filter(Activity.estimated_cost <= max_cost)

    total = query.count()
    total_pages = (total + page_size - 1) // page_size if total > 0 else 0
    offset = (page - 1) * page_size
    items = query.order_by(Activity.popularity_score.desc().nullslast(), Activity.name).offset(offset).limit(page_size).all()

    return PaginatedResponse(
        data=[ActivityResponse.model_validate(a) for a in items],
        pagination=PaginationMeta(page=page, page_size=page_size, total=total, total_pages=total_pages)
    )

@router.get("/{activity_id}", response_model=SuccessResponse[ActivityResponse])
def get_activity(activity_id: UUID, db: Session = Depends(get_db)):
    """Retrieve details for a specific activity by ID."""
    activity = db.query(Activity).filter(Activity.id == activity_id).first()
    if not activity:
        raise NotFoundException(message="Activity not found", code="ACTIVITY_NOT_FOUND")
    return SuccessResponse(data=ActivityResponse.model_validate(activity))
