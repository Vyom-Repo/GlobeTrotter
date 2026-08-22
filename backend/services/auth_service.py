from typing import Tuple
from sqlalchemy.orm import Session

from backend.core.exceptions import BadRequestException, UnauthorizedException
from backend.core.security import create_access_token, get_password_hash, verify_password
from backend.models.user import User
from backend.models.user_preference import UserPreference
from backend.schemas.auth import LoginRequest
from backend.schemas.user import UserCreate

class AuthService:
    """Service layer handling user authentication and registration."""

    @staticmethod
    def register_user(db: Session, user_in: UserCreate) -> Tuple[User, str]:
        normalized_email = user_in.email.lower().strip()
        existing_user = db.query(User).filter(User.email == normalized_email).first()
        if existing_user:
            raise BadRequestException(
                message="An account with this email already exists.",
                code="EMAIL_ALREADY_EXISTS"
            )

        hashed_password = get_password_hash(user_in.password)
        db_user = User(
            name=user_in.name.strip(),
            email=normalized_email,
            password_hash=hashed_password,
            profile_photo_url=user_in.profile_photo_url
        )
        db.add(db_user)
        db.flush()

        # Initialize default user preferences
        preferences = UserPreference(user_id=db_user.id)
        db.add(preferences)

        db.commit()
        db.refresh(db_user)

        token = create_access_token(subject=db_user.id)
        return db_user, token

    @staticmethod
    def authenticate_user(db: Session, login_data: LoginRequest) -> Tuple[User, str]:
        normalized_email = login_data.email.lower().strip()
        user = db.query(User).filter(User.email == normalized_email).first()
        if not user or not verify_password(login_data.password, user.password_hash):
            raise UnauthorizedException(
                message="Invalid email or password credentials.",
                code="INVALID_CREDENTIALS"
            )

        if not user.is_active:
            raise UnauthorizedException(
                message="User account is deactivated.",
                code="ACCOUNT_DEACTIVATED"
            )

        token = create_access_token(subject=user.id)
        return user, token
