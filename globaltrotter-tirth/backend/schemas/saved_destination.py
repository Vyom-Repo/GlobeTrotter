from datetime import datetime
from uuid import UUID
from pydantic import BaseModel, ConfigDict
from backend.schemas.city import CityResponse

class SavedDestinationCreate(BaseModel):
    city_id: UUID

class SavedDestinationResponse(BaseModel):
    id: UUID
    user_id: UUID
    city_id: UUID
    created_at: datetime
    city: CityResponse

    model_config = ConfigDict(from_attributes=True)
