from datetime import datetime
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, EmailStr, ConfigDict, Field

class UserPreferenceBase(BaseModel):
    language: str = "en"
    currency: str = "INR"
    notifications_enabled: bool = True
    budget_alerts_enabled: bool = True
    theme: str = "light"

class UserPreferenceUpdate(BaseModel):
    language: Optional[str] = None
    currency: Optional[str] = None
    notifications_enabled: Optional[bool] = None
    budget_alerts_enabled: Optional[bool] = None
    theme: Optional[str] = None

class UserPreferenceResponse(UserPreferenceBase):
    id: UUID
    user_id: UUID
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class UserBase(BaseModel):
    name: str
    email: EmailStr
    profile_photo_url: Optional[str] = None
    phone: Optional[str] = None
    city: Optional[str] = None
    country: Optional[str] = None

class UserCreate(UserBase):
    password: str = Field(..., min_length=6, description="Raw user password")

class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    profile_photo_url: Optional[str] = None
    phone: Optional[str] = None
    city: Optional[str] = None
    country: Optional[str] = None

class PasswordChangeRequest(BaseModel):
    current_password: str = Field(..., description="Current password for verification")
    new_password: str = Field(..., min_length=6, description="New password")
    confirm_password: str = Field(..., description="Confirm new password")

class UserResponse(UserBase):
    id: UUID
    is_active: bool
    is_admin: bool
    created_at: datetime
    updated_at: datetime
    preferences: Optional[UserPreferenceResponse] = None

    model_config = ConfigDict(from_attributes=True)
