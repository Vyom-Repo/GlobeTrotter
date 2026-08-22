from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from backend.core.dependencies import get_db, get_current_user
from backend.models.user import User
from backend.schemas.common import SuccessResponse
from backend.schemas.user import UserResponse, UserUpdate, UserPreferenceResponse, UserPreferenceUpdate
from backend.services.user_service import UserService

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
    updated_user = UserService.update_profile(db, current_user, user_update)
    return SuccessResponse(data=UserResponse.model_validate(updated_user))

@router.get("/me/preferences", response_model=SuccessResponse[UserPreferenceResponse])
def get_user_preferences(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Fetch preferences (language, currency) for the current authenticated user."""
    pref = UserService.get_preferences(db, current_user)
    return SuccessResponse(data=UserPreferenceResponse.model_validate(pref))

@router.put("/me/preferences", response_model=SuccessResponse[UserPreferenceResponse])
@router.patch("/me/preferences", response_model=SuccessResponse[UserPreferenceResponse])
def update_user_preferences(
    pref_update: UserPreferenceUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update preferences (language, currency) for the current authenticated user."""
    updated_pref = UserService.update_preferences(db, current_user, pref_update)
    return SuccessResponse(data=UserPreferenceResponse.model_validate(updated_pref))
