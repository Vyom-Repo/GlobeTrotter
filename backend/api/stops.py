from fastapi import APIRouter

router = APIRouter(prefix="/stops", tags=["stops"])

@router.get("/")
def list_stops():
    return []
