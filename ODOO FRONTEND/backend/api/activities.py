from fastapi import APIRouter

router = APIRouter(prefix="/activities", tags=["activities"])

@router.get("/")
def list_activities():
    return []
