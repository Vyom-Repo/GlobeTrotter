from typing import List, Optional
from uuid import UUID
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from backend.core.dependencies import get_db, get_current_user, get_current_user_optional
from backend.models.expense import Expense, ExpenseCategory
from backend.models.user import User
from backend.schemas.common import SuccessResponse
from backend.schemas.expense import BudgetSummary, ExpenseCreate, ExpenseUpdate, ExpenseResponse
from backend.services.budget_service import BudgetService

router = APIRouter(tags=["Expenses & Budgets"])

@router.get("/expenses", response_model=SuccessResponse[List[ExpenseResponse]])
def list_expenses(
    trip_id: UUID = Query(..., description="Trip ID to fetch expenses for"),
    category: Optional[ExpenseCategory] = Query(None, description="Filter by category"),
    trip_stop_id: Optional[UUID] = Query(None, description="Filter by destination stop ID"),
    itinerary_item_id: Optional[UUID] = Query(None, description="Filter by activity itinerary item ID"),
    current_user: User = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    """List financial expenses logged for a trip with optional filters."""
    expenses = BudgetService.list_expenses(
        db, trip_id, category=category, trip_stop_id=trip_stop_id, itinerary_item_id=itinerary_item_id, user=current_user
    )
    return SuccessResponse(data=[ExpenseResponse.model_validate(e) for e in expenses])

@router.post("/expenses", response_model=SuccessResponse[ExpenseResponse], status_code=status.HTTP_201_CREATED)
def create_expense(
    expense_in: ExpenseCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Log a new financial expense for a trip (owner only)."""
    db_exp = BudgetService.create_expense(db, expense_in, current_user)
    return SuccessResponse(data=ExpenseResponse.model_validate(db_exp))

@router.get("/expenses/budget-summary", response_model=SuccessResponse[BudgetSummary])
def get_budget_summary_alt(
    trip_id: UUID = Query(..., description="Trip ID to aggregate budget for"),
    current_user: User = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    """Get aggregated category breakdown and remaining budget summary for a trip (Query param variant)."""
    summary = BudgetService.get_trip_budget_summary(db, trip_id, current_user)
    return SuccessResponse(data=summary)

@router.get("/expenses/{expense_id}", response_model=SuccessResponse[ExpenseResponse])
def get_expense(
    expense_id: UUID,
    current_user: User = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    """Retrieve details for a specific expense by ID."""
    expense = BudgetService.get_expense_by_id(db, expense_id, current_user)
    return SuccessResponse(data=ExpenseResponse.model_validate(expense))

@router.put("/expenses/{expense_id}", response_model=SuccessResponse[ExpenseResponse])
@router.patch("/expenses/{expense_id}", response_model=SuccessResponse[ExpenseResponse])
def update_expense(
    expense_id: UUID,
    expense_in: ExpenseUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update expense details (owner only)."""
    expense = BudgetService.update_expense(db, expense_id, expense_in, current_user)
    return SuccessResponse(data=ExpenseResponse.model_validate(expense))

@router.delete("/expenses/{expense_id}", status_code=status.HTTP_200_OK)
def delete_expense(
    expense_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete an expense (owner only)."""
    BudgetService.delete_expense(db, expense_id, current_user)
    return {"success": True, "message": "Expense deleted successfully"}
