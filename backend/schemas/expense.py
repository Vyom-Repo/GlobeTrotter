from datetime import date, datetime
from typing import Optional
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

class ExpenseResponse(ExpenseBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class BudgetSummary(BaseModel):
    trip_id: UUID
    budget_limit: Optional[Decimal] = None
    total_expenses: Decimal
    remaining_budget: Optional[Decimal] = None
    currency: str = "USD"
    by_category: dict
