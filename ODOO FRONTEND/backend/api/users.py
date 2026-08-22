from fastapi import APIRouter

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/me")
def get_current_user():
    return {"message": "Current user profile placeholder"}
