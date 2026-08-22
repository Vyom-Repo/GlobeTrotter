from datetime import datetime
from typing import Optional, Dict, Any
from uuid import UUID
from pydantic import BaseModel, ConfigDict

class UserActivityResponse(BaseModel):
    id: UUID
    user_id: UUID
    activity_type: str
    description: str
    entity_type: Optional[str] = None
    entity_id: Optional[UUID] = None
    created_at: datetime
    metadata_payload: Optional[Dict[str, Any]] = None

    model_config = ConfigDict(from_attributes=True)
