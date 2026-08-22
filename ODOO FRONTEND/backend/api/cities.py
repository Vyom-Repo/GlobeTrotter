from fastapi import APIRouter

router = APIRouter(prefix="/cities", tags=["cities"])

@router.get("/")
def list_cities():
    return []
