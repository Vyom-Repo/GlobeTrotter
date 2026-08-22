from datetime import datetime
from typing import Optional, Any
from uuid import UUID
from pydantic import BaseModel, ConfigDict
from backend.models.saved_destination import SavedEntityType
from backend.schemas.city import CityResponse

class SavedDestinationCreate(BaseModel):
    entity_type: Optional[SavedEntityType] = SavedEntityType.CITY
    entity_id: Optional[UUID] = None
    city_id: Optional[UUID] = None  # Backward compatibility

class SavedDestinationResponse(BaseModel):
    id: UUID
    user_id: UUID
    entity_type: SavedEntityType
    entity_id: UUID
    name: str
    country: Optional[str] = None
    city_id: Optional[UUID] = None
    country_id: Optional[UUID] = None
    activity_id: Optional[UUID] = None
    created_at: datetime
    city: Optional[CityResponse] = None
    details: Optional[dict] = None

    model_config = ConfigDict(from_attributes=True)

class SavedStateResponse(BaseModel):
    saved: bool
    saved_id: Optional[UUID] = None
