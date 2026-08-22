from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.core.dependencies import get_db, get_current_user
from backend.models.user import User
from backend.schemas.common import SuccessResponse
from backend.schemas.user import UserResponse, UserUpdate

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/me", response_model=SuccessResponse[UserResponse])
def get_user_profile(current_user: User = Depends(get_current_user)):
    """Fetch profile details of the current authenticated user."""
    return SuccessResponse(data=UserResponse.model_validate(current_user))

@router.put("/me", response_model=SuccessResponse[UserResponse])
def update_user_profile(
    user_update: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update profile details of the current authenticated user."""
    if user_update.name is not None:
        current_user.name = user_update.name
    if user_update.email is not None:
        current_user.email = user_update.email
    if user_update.profile_photo_url is not None:
        current_user.profile_photo_url = user_update.profile_photo_url

    db.commit()
    db.refresh(current_user)
    return SuccessResponse(data=UserResponse.model_validate(current_user))
