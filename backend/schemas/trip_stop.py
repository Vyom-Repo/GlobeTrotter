from datetime import date, datetime
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, ConfigDict
from backend.schemas.city import CityResponse

class TripStopBase(BaseModel):
    trip_id: UUID
    city_id: UUID
    start_date: date
    end_date: date
    stop_order: int
    notes: Optional[str] = None

class TripStopCreate(TripStopBase):
    pass

class TripStopUpdate(BaseModel):
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    stop_order: Optional[int] = None
    notes: Optional[str] = None

class TripStopReorderItem(BaseModel):
    stop_id: UUID
    stop_order: int

class TripStopResponse(TripStopBase):
    id: UUID
    created_at: datetime
    updated_at: datetime
    city: Optional[CityResponse] = None

    model_config = ConfigDict(from_attributes=True)
