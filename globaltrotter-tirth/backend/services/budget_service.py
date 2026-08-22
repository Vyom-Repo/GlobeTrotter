from decimal import Decimal
from typing import Dict
from uuid import UUID
from sqlalchemy.orm import Session
from sqlalchemy import func

from backend.core.exceptions import NotFoundException
from backend.models.expense import Expense, ExpenseCategory
from backend.models.trip import Trip
from backend.schemas.expense import BudgetSummary

class BudgetService:
    """Service layer handling trip budget breakdowns and expense aggregations."""

    @staticmethod
    def get_trip_budget_summary(db: Session, trip_id: UUID) -> BudgetSummary:
        trip = db.query(Trip).filter(Trip.id == trip_id).first()
        if not trip:
            raise NotFoundException(message="Trip not found", code="TRIP_NOT_FOUND")

        # Aggregate total expenses by category
        category_sums = db.query(
            Expense.category,
            func.coalesce(func.sum(Expense.amount), Decimal("0.00")).label("cat_total")
        ).filter(Expense.trip_id == trip_id).group_by(Expense.category).all()

        by_cat_dict: Dict[str, float] = {cat.value: 0.0 for cat in ExpenseCategory}
        total_expense = Decimal("0.00")

        for cat, amount in category_sums:
            by_cat_dict[cat.value] = float(amount)
            total_expense += amount

        remaining_budget = (trip.budget_limit - total_expense) if trip.budget_limit is not None else None

        return BudgetSummary(
            trip_id=trip.id,
            budget_limit=trip.budget_limit,
            total_expenses=total_expense,
            remaining_budget=remaining_budget,
            currency=trip.currency,
            by_category=by_cat_dict
        )
