from fastapi import APIRouter

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/login")
def login():
    return {"message": "Login endpoint placeholder"}

@router.post("/register")
def register():
    return {"message": "Register endpoint placeholder"}
