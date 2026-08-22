from typing import Optional
from uuid import UUID
from sqlalchemy.orm import Session

from backend.core.exceptions import BadRequestException, NotFoundException
from backend.models.user import User
from backend.models.user_preference import UserPreference
from backend.schemas.user import UserUpdate, UserPreferenceUpdate

class UserService:
    """Service layer handling user profile updates and preference management."""

    @staticmethod
    def update_profile(db: Session, user: User, user_update: UserUpdate) -> User:
        if user_update.name is not None:
            user.name = user_update.name

        if user_update.email is not None and user_update.email != user.email:
            existing = db.query(User).filter(User.email == user_update.email).first()
            if existing:
                raise BadRequestException(message="Email address is already in use", code="EMAIL_ALREADY_EXISTS")
            user.email = user_update.email

        if user_update.profile_photo_url is not None:
            user.profile_photo_url = user_update.profile_photo_url

        db.commit()
        db.refresh(user)
        return user

    @staticmethod
    def get_preferences(db: Session, user: User) -> UserPreference:
        pref = db.query(UserPreference).filter(UserPreference.user_id == user.id).first()
        if not pref:
            pref = UserPreference(user_id=user.id, language="en", currency="INR")
            db.add(pref)
            db.commit()
            db.refresh(pref)
        return pref

    @staticmethod
    def update_preferences(db: Session, user: User, pref_update: UserPreferenceUpdate) -> UserPreference:
        pref = UserService.get_preferences(db, user)

        update_data = pref_update.model_dump(exclude_unset=True)
        if "language" in update_data and update_data["language"]:
            pref.language = update_data["language"].lower()
        if "currency" in update_data and update_data["currency"]:
            pref.currency = update_data["currency"].upper()

        db.commit()
        db.refresh(pref)
        return pref
