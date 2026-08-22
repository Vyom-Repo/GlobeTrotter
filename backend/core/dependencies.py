from typing import Optional
from fastapi import Depends, Security
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from backend.core.exceptions import UnauthorizedException
from backend.core.security import decode_token
from backend.database.connection import get_db
from backend.models.user import User

security_scheme = HTTPBearer(auto_error=False)

def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Security(security_scheme),
    db: Session = Depends(get_db)
) -> User:
    """FastAPI dependency to extract Bearer JWT and return authenticated User."""
    if not credentials or not credentials.credentials:
        raise UnauthorizedException(message="Not authenticated", code="AUTHENTICATION_REQUIRED")
    
    token = credentials.credentials
    payload = decode_token(token)
    if not payload or "sub" not in payload:
        raise UnauthorizedException(message="Invalid or expired authentication token", code="INVALID_TOKEN")
    
    user_id = payload["sub"]
    user = db.query(User).filter(User.id == user_id, User.is_active == True).first()
    if not user:
        raise UnauthorizedException(message="User account not found or deactivated", code="USER_NOT_FOUND")
    
    return user

def get_current_user_optional(
    credentials: Optional[HTTPAuthorizationCredentials] = Security(security_scheme),
    db: Session = Depends(get_db)
) -> Optional[User]:
    """Optional authentication dependency returning User if valid Bearer token provided, else None."""
    if not credentials or not credentials.credentials:
        return None
    try:
        return get_current_user(credentials=credentials, db=db)
    except UnauthorizedException:
        return None
