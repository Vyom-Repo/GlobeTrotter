from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from backend.core.dependencies import get_db, get_current_user
from backend.core.exceptions import NotFoundException, BadRequestException
from backend.models.saved_destination import SavedDestination
from backend.models.user import User
from backend.schemas.common import SuccessResponse
from backend.schemas.saved_destination import SavedDestinationCreate, SavedDestinationResponse

router = APIRouter(prefix="/saved-destinations", tags=["Saved Destinations"])

@router.get("", response_model=SuccessResponse[List[SavedDestinationResponse]])
def list_saved_destinations(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """List bookmarked destination cities for the current user."""
    saved = db.query(SavedDestination).filter(SavedDestination.user_id == current_user.id).order_by(SavedDestination.created_at.desc()).all()
    return SuccessResponse(data=[SavedDestinationResponse.model_validate(s) for s in saved])

@router.post("", response_model=SuccessResponse[SavedDestinationResponse], status_code=status.HTTP_201_CREATED)
def save_destination(
    dest_in: SavedDestinationCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Bookmark a destination city."""
    existing = db.query(SavedDestination).filter(
        SavedDestination.user_id == current_user.id,
        SavedDestination.city_id == dest_in.city_id
    ).first()
    if existing:
        raise BadRequestException(message="City is already in your saved destinations", code="DESTINATION_ALREADY_SAVED")

    db_saved = SavedDestination(user_id=current_user.id, city_id=dest_in.city_id)
    db.add(db_saved)
    db.commit()
    db.refresh(db_saved)
    return SuccessResponse(data=SavedDestinationResponse.model_validate(db_saved))

@router.delete("/{saved_id}", response_model=SuccessResponse[dict])
def remove_saved_destination(
    saved_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Remove a bookmarked destination city."""
    saved = db.query(SavedDestination).filter(
        SavedDestination.id == saved_id,
        SavedDestination.user_id == current_user.id
    ).first()
    if not saved:
        raise NotFoundException(message="Saved destination not found", code="SAVED_DESTINATION_NOT_FOUND")

    db.delete(saved)
    db.commit()
    return SuccessResponse(data={"message": "Destination removed successfully"})
