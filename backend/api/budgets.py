from fastapi import APIRouter

router = APIRouter(prefix="/budgets", tags=["budgets"])

@router.get("/")
def get_budgets():
    return []
