from datetime import date, datetime
from typing import Optional
from decimal import Decimal
from uuid import UUID
from pydantic import BaseModel, ConfigDict
from backend.models.trip import TripVisibility

class TripBase(BaseModel):
    name: str
    description: Optional[str] = None
    start_date: date
    end_date: date
    budget_limit: Optional[Decimal] = None
    currency: str = "USD"
    visibility: TripVisibility = TripVisibility.PRIVATE

class TripCreate(TripBase):
    pass

class TripUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    budget_limit: Optional[Decimal] = None
    currency: Optional[str] = None
    visibility: Optional[TripVisibility] = None

class TripResponse(TripBase):
    id: UUID
    user_id: UUID
    share_token: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
