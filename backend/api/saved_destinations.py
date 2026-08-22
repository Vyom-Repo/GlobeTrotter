from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from backend.core.dependencies import get_db, get_current_user
from backend.models.user import User
from backend.schemas.common import SuccessResponse
from backend.schemas.saved_destination import SavedDestinationCreate, SavedDestinationResponse
from backend.services.saved_destination_service import SavedDestinationService

router = APIRouter(prefix="/saved-destinations", tags=["Saved Destinations"])

@router.get("", response_model=SuccessResponse[List[SavedDestinationResponse]])
def list_saved_destinations(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """List bookmarked destination cities for the current user."""
    saved = SavedDestinationService.list_saved_destinations(db, current_user)
    return SuccessResponse(data=[SavedDestinationResponse.model_validate(s) for s in saved])

@router.post("", response_model=SuccessResponse[SavedDestinationResponse], status_code=status.HTTP_201_CREATED)
def save_destination(
    dest_in: SavedDestinationCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Bookmark a destination city."""
    db_saved = SavedDestinationService.save_destination(db, current_user, dest_in.city_id)
    return SuccessResponse(data=SavedDestinationResponse.model_validate(db_saved))

@router.delete("/{saved_id}", response_model=SuccessResponse[dict])
def remove_saved_destination(
    saved_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Remove a bookmarked destination city."""
    SavedDestinationService.remove_saved_destination(db, current_user, saved_id)
    return SuccessResponse(data={"message": "Destination removed successfully"})
