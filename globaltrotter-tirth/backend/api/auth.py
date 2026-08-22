from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from backend.core.dependencies import get_db, get_current_user
from backend.models.user import User
from backend.schemas.auth import LoginRequest, TokenResponse
from backend.schemas.common import SuccessResponse
from backend.schemas.user import UserCreate, UserResponse
from backend.services.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/register", response_model=SuccessResponse[TokenResponse], status_code=status.HTTP_201_CREATED)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    """Register a new user account and return a Bearer JWT access token."""
    user, token = AuthService.register_user(db, user_in)
    user_resp = UserResponse.model_validate(user)
    token_resp = TokenResponse(access_token=token, token_type="bearer", user=user_resp)
    return SuccessResponse(data=token_resp)

@router.post("/login", response_model=SuccessResponse[TokenResponse])
def login(login_data: LoginRequest, db: Session = Depends(get_db)):
    """Authenticate user credentials and return a Bearer JWT access token."""
    user, token = AuthService.authenticate_user(db, login_data)
    user_resp = UserResponse.model_validate(user)
    token_resp = TokenResponse(access_token=token, token_type="bearer", user=user_resp)
    return SuccessResponse(data=token_resp)

@router.get("/me", response_model=SuccessResponse[UserResponse])
def get_me(current_user: User = Depends(get_current_user)):
    """Return current authenticated user profile."""
    return SuccessResponse(data=UserResponse.model_validate(current_user))
