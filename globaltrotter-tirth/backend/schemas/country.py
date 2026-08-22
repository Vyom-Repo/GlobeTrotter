from datetime import datetime
from typing import Optional
from decimal import Decimal
from uuid import UUID
from pydantic import BaseModel, ConfigDict

class CountryBase(BaseModel):
    name: str
    iso_code: str
    iso3_code: str
    region: str
    subregion: Optional[str] = None
    capital: Optional[str] = None
    currency_code: Optional[str] = None
    latitude: Optional[Decimal] = None
    longitude: Optional[Decimal] = None
    flag_emoji: Optional[str] = None
    description: Optional[str] = None

class CountryResponse(CountryBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
