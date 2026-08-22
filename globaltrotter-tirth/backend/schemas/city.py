from datetime import datetime
from typing import Optional
from decimal import Decimal
from uuid import UUID
from pydantic import BaseModel, ConfigDict
from backend.schemas.country import CountryResponse

class CityBase(BaseModel):
    country_id: UUID
    name: str
    region: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
    cost_index: Optional[Decimal] = None
    popularity_score: Optional[Decimal] = None
    latitude: Optional[Decimal] = None
    longitude: Optional[Decimal] = None

class CityResponse(CityBase):
    id: UUID
    created_at: datetime
    updated_at: datetime
    country: Optional[CountryResponse] = None

    model_config = ConfigDict(from_attributes=True)
