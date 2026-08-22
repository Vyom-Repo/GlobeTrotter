from datetime import datetime
from typing import Optional
from decimal import Decimal
from uuid import UUID
from pydantic import BaseModel, ConfigDict

class ActivityBase(BaseModel):
    city_id: UUID
    name: str
    description: Optional[str] = None
    activity_type: str
    estimated_cost: Decimal = Decimal("0.00")
    currency: str = "USD"
    duration_minutes: Optional[int] = None
    image_url: Optional[str] = None
    popularity_score: Optional[Decimal] = None

class ActivityResponse(ActivityBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
