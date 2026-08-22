from datetime import date, time, datetime
from typing import Optional
from decimal import Decimal
from uuid import UUID
from pydantic import BaseModel, ConfigDict
from backend.schemas.activity import ActivityResponse

class ItineraryItemBase(BaseModel):
    trip_stop_id: UUID
    activity_id: UUID
    scheduled_date: date
    start_time: Optional[time] = None
    end_time: Optional[time] = None
    item_order: int
    notes: Optional[str] = None
    estimated_cost: Optional[Decimal] = None

class ItineraryItemCreate(ItineraryItemBase):
    pass

class ItineraryItemResponse(ItineraryItemBase):
    id: UUID
    created_at: datetime
    updated_at: datetime
    activity: Optional[ActivityResponse] = None

    model_config = ConfigDict(from_attributes=True)
