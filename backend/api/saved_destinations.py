from typing import List, Optional
from uuid import UUID
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from backend.core.dependencies import get_db, get_current_user
from backend.models.saved_destination import SavedEntityType
from backend.models.user import User
from backend.schemas.common import PaginatedResponse, PaginationMeta, SuccessResponse
from backend.schemas.saved_destination import SavedDestinationCreate, SavedDestinationResponse, SavedStateResponse
from backend.services.saved_destination_service import SavedDestinationService

router = APIRouter(prefix="/saved-destinations", tags=["Saved Destinations"])

@router.get("", response_model=PaginatedResponse[SavedDestinationResponse])
def list_saved_destinations(
    entity_type: Optional[SavedEntityType] = Query(None, description="Filter by entity type (country, city, activity)"),
    search: Optional[str] = Query(None, description="Search saved items by name"),
    country_id: Optional[UUID] = Query(None, description="Filter by country ID"),
    city_id: Optional[UUID] = Query(None, description="Filter by city ID"),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """List bookmarked countries, cities, and activities for the current user with pagination and search."""
    dtos, total = SavedDestinationService.list_saved_destinations(
        db, current_user, entity_type=entity_type, search=search, country_id=country_id, city_id=city_id, page=page, page_size=page_size
    )
    total_pages = (total + page_size - 1) // page_size if total > 0 else 0
    return PaginatedResponse(
        data=dtos,
        pagination=PaginationMeta(page=page, page_size=page_size, total=total, total_pages=total_pages)
    )

@router.post("", response_model=SuccessResponse[SavedDestinationResponse], status_code=status.HTTP_201_CREATED)
def save_destination(
    dest_in: SavedDestinationCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Bookmark a country, city, or activity."""
    dto = SavedDestinationService.save_destination(db, current_user, dest_in)
    return SuccessResponse(data=dto)

@router.get("/check", response_model=SuccessResponse[SavedStateResponse])
def check_saved_state(
    entity_type: SavedEntityType = Query(..., description="Entity type (country, city, activity)"),
    entity_id: UUID = Query(..., description="Entity UUID to check"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Convenience endpoint to check if an entity is already saved by the current user."""
    state = SavedDestinationService.check_saved_state(db, current_user, entity_type, entity_id)
    return SuccessResponse(data=state)

@router.get("/{saved_id}", response_model=SuccessResponse[SavedDestinationResponse])
def get_saved_destination(
    saved_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieve details for a single saved item (owner only)."""
    dto = SavedDestinationService.get_saved_destination(db, saved_id, current_user)
    return SuccessResponse(data=dto)

@router.delete("/{saved_id}", response_model=SuccessResponse[dict])
def remove_saved_destination(
    saved_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Remove a bookmarked country, city, or activity (owner only)."""
    SavedDestinationService.remove_saved_destination(db, current_user, saved_id)
    return SuccessResponse(data={"message": "Destination removed successfully"})
