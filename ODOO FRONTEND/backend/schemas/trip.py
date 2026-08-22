from typing import Optional
from datetime import date
from pydantic import BaseModel

class TripBase(BaseModel):
    title: str
    description: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    total_budget: Optional[float] = 0.0

class TripCreate(TripBase):
    pass

class TripResponse(TripBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True
