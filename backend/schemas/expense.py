from datetime import date, datetime
from typing import Optional, Dict
from decimal import Decimal
from uuid import UUID
from pydantic import BaseModel, ConfigDict
from backend.models.expense import ExpenseCategory

class ExpenseBase(BaseModel):
    trip_id: UUID
    trip_stop_id: Optional[UUID] = None
    itinerary_item_id: Optional[UUID] = None
    category: ExpenseCategory
    description: Optional[str] = None
    amount: Decimal
    currency: str = "USD"
    expense_date: Optional[date] = None

class ExpenseCreate(ExpenseBase):
    pass

class ExpenseUpdate(BaseModel):
    trip_stop_id: Optional[UUID] = None
    itinerary_item_id: Optional[UUID] = None
    category: Optional[ExpenseCategory] = None
    description: Optional[str] = None
    amount: Optional[Decimal] = None
    currency: Optional[str] = None
    expense_date: Optional[date] = None

class ExpenseResponse(ExpenseBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class BudgetSummary(BaseModel):
    trip_id: UUID
    budget_limit: Optional[Decimal] = None
    total_spent: Decimal
    remaining_budget: Optional[Decimal] = None
    utilization_percentage: Optional[float] = None
    currency: str = "USD"
    category_breakdown: Dict[str, Decimal]
