from fastapi import APIRouter

router = APIRouter(prefix="/trips", tags=["trips"])

@router.get("/")
def list_trips():
    return []

@router.post("/")
def create_trip():
    return {"message": "Create trip placeholder"}
