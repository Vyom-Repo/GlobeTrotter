from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from backend.core.dependencies import get_db, get_current_user
from backend.models.expense import Expense
from backend.models.user import User
from backend.schemas.common import SuccessResponse
from backend.schemas.expense import BudgetSummary, ExpenseCreate, ExpenseResponse
from backend.services.budget_service import BudgetService
from backend.services.trip_service import TripService

router = APIRouter(prefix="/expenses", tags=["Expenses & Budgets"])

@router.get("", response_model=SuccessResponse[List[ExpenseResponse]])
def list_expenses(
    trip_id: UUID = Query(..., description="Trip ID to fetch expenses for"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """List financial expenses logged for a trip."""
    TripService.get_trip_by_id(db, trip_id, current_user)
    expenses = db.query(Expense).filter(Expense.trip_id == trip_id).order_by(Expense.created_at.desc()).all()
    return SuccessResponse(data=[ExpenseResponse.model_validate(e) for e in expenses])

@router.post("", response_model=SuccessResponse[ExpenseResponse], status_code=status.HTTP_201_CREATED)
def create_expense(
    expense_in: ExpenseCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Log a new financial expense for a trip."""
    TripService.get_trip_by_id(db, expense_in.trip_id, current_user)
    db_exp = Expense(
        trip_id=expense_in.trip_id,
        trip_stop_id=expense_in.trip_stop_id,
        itinerary_item_id=expense_in.itinerary_item_id,
        category=expense_in.category,
        description=expense_in.description,
        amount=expense_in.amount,
        currency=expense_in.currency,
        expense_date=expense_in.expense_date
    )
    db.add(db_exp)
    db.commit()
    db.refresh(db_exp)
    return SuccessResponse(data=ExpenseResponse.model_validate(db_exp))

@router.get("/budget-summary", response_model=SuccessResponse[BudgetSummary])
def get_budget_summary(
    trip_id: UUID = Query(..., description="Trip ID to aggregate budget for"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get aggregated category breakdown and remaining budget summary for a trip."""
    TripService.get_trip_by_id(db, trip_id, current_user)
    summary = BudgetService.get_trip_budget_summary(db, trip_id)
    return SuccessResponse(data=summary)
