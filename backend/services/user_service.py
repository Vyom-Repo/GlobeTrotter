from typing import Optional
from uuid import UUID
from sqlalchemy.orm import Session
from sqlalchemy import func

from backend.core.exceptions import BadRequestException, NotFoundException
from backend.core.security import verify_password, get_password_hash
from backend.models.user import User
from backend.models.user_preference import UserPreference
from backend.schemas.user import UserUpdate, PasswordChangeRequest, UserPreferenceUpdate

class UserService:
    """Service layer handling user profile updates, password changes, preferences, and account lifecycle."""

    @staticmethod
    def get_profile(db: Session, user: User) -> User:
        """Retrieve user profile ensuring preferences are attached."""
        db.refresh(user)
        return user

    @staticmethod
    def update_profile(db: Session, user: User, user_update: UserUpdate) -> User:
        """Update authenticated user profile fields with email normalization and uniqueness checks."""
        if user_update.name is not None and user_update.name.strip():
            user.name = user_update.name.strip()

        if user_update.email is not None and user_update.email.strip():
            normalized_email = user_update.email.lower().strip()
            if normalized_email != user.email:
                existing = (
                    db.query(User)
                    .filter(func.lower(User.email) == normalized_email, User.id != user.id)
                    .first()
                )
                if existing:
                    raise BadRequestException(
                        message="Email address is already in use",
                        code="EMAIL_ALREADY_EXISTS"
                    )
                user.email = normalized_email

        if user_update.profile_photo_url is not None:
            user.profile_photo_url = user_update.profile_photo_url

        if user_update.phone is not None:
            user.phone = user_update.phone.strip() if user_update.phone else None

        if user_update.city is not None:
            user.city = user_update.city.strip() if user_update.city else None

        if user_update.country is not None:
            user.country = user_update.country.strip() if user_update.country else None

        db.commit()
        db.refresh(user)
        return user

    @staticmethod
    def change_password(db: Session, user: User, pwd_data: PasswordChangeRequest) -> None:
        """Verify current password and securely change password."""
        # 1. Verify current password
        if not verify_password(pwd_data.current_password, user.password_hash):
            raise BadRequestException(
                message="Current password is incorrect",
                code="INVALID_CURRENT_PASSWORD"
            )

        # 2. Verify new password confirmation match
        if pwd_data.new_password != pwd_data.confirm_password:
            raise BadRequestException(
                message="New password and confirmation do not match",
                code="PASSWORD_CONFIRMATION_MISMATCH"
            )

        # 3. Prevent password reuse
        if verify_password(pwd_data.new_password, user.password_hash):
            raise BadRequestException(
                message="New password cannot be the same as current password",
                code="PASSWORD_REUSE_NOT_ALLOWED"
            )

        # 4. Check password strength
        if len(pwd_data.new_password) < 6:
            raise BadRequestException(
                message="New password does not meet minimum security requirements (min 6 characters)",
                code="PASSWORD_TOO_WEAK"
            )

        # 5. Update password hash
        user.password_hash = get_password_hash(pwd_data.new_password)
        db.commit()

    @staticmethod
    def get_preferences(db: Session, user: User) -> UserPreference:
        """Get or initialize user preferences."""
        pref = db.query(UserPreference).filter(UserPreference.user_id == user.id).first()
        if not pref:
            pref = UserPreference(user_id=user.id, language="en", currency="INR")
            db.add(pref)
            db.commit()
            db.refresh(pref)
        return pref

    @staticmethod
    def update_preferences(db: Session, user: User, pref_update: UserPreferenceUpdate) -> UserPreference:
        """Update user preferences."""
        pref = UserService.get_preferences(db, user)

        update_data = pref_update.model_dump(exclude_unset=True)
        if "language" in update_data and update_data["language"]:
            pref.language = update_data["language"].lower()
        if "currency" in update_data and update_data["currency"]:
            pref.currency = update_data["currency"].upper()
        if "notifications_enabled" in update_data and update_data["notifications_enabled"] is not None:
            pref.notifications_enabled = update_data["notifications_enabled"]
        if "budget_alerts_enabled" in update_data and update_data["budget_alerts_enabled"] is not None:
            pref.budget_alerts_enabled = update_data["budget_alerts_enabled"]
        if "theme" in update_data and update_data["theme"]:
            pref.theme = update_data["theme"].lower()

        db.commit()
        db.refresh(pref)
        return pref

    @staticmethod
    def deactivate_account(db: Session, user: User) -> None:
        """Deactivate account to prevent future logins while preserving user data integrity."""
        user.is_active = False
        db.commit()

    @staticmethod
    def delete_account(db: Session, user: User) -> None:
        """Safe soft-deactivation for account deletion to prevent orphan data issues."""
        user.is_active = False
        db.commit()
