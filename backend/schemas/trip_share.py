from datetime import datetime
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, ConfigDict
from backend.models.trip_share import SharePermission

class TripShareCreate(BaseModel):
    shared_with_user_id: Optional[UUID] = None
    permission: SharePermission = SharePermission.VIEW
    expires_at: Optional[datetime] = None

class TripShareResponse(BaseModel):
    id: UUID
    trip_id: UUID
    shared_with_user_id: Optional[UUID] = None
    share_token: str
    permission: SharePermission
    created_at: datetime
    expires_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)
