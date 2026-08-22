import logging
from typing import Any, Dict, Optional
from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException

logger = logging.getLogger(__name__)

class AppException(Exception):
    """Base application exception with custom status code and error details."""
    def __init__(
        self,
        message: str,
        code: str = "INTERNAL_SERVER_ERROR",
        status_code: int = status.HTTP_500_INTERNAL_SERVER_ERROR,
        details: Optional[Dict[str, Any]] = None
    ):
        self.message = message
        self.code = code
        self.status_code = status_code
        self.details = details
        super().__init__(message)

class NotFoundException(AppException):
    def __init__(self, message: str = "Requested resource not found", code: str = "RESOURCE_NOT_FOUND"):
        super().__init__(message=message, code=code, status_code=status.HTTP_404_NOT_FOUND)

class BadRequestException(AppException):
    def __init__(self, message: str = "Bad request parameters", code: str = "BAD_REQUEST"):
        super().__init__(message=message, code=code, status_code=status.HTTP_400_BAD_REQUEST)

class UnauthorizedException(AppException):
    def __init__(self, message: str = "Could not validate credentials", code: str = "UNAUTHORIZED"):
        super().__init__(message=message, code=code, status_code=status.HTTP_401_UNAUTHORIZED)

class ForbiddenException(AppException):
    def __init__(self, message: str = "Access denied", code: str = "FORBIDDEN"):
        super().__init__(message=message, code=code, status_code=status.HTTP_403_FORBIDDEN)

def create_error_response(message: str, code: str, status_code: int) -> JSONResponse:
    """Format standard JSON error payload."""
    return JSONResponse(
        status_code=status_code,
        content={
            "success": False,
            "error": {
                "code": code,
                "message": message
            }
        }
    )

def setup_exception_handlers(app: FastAPI) -> None:
    """Register custom and global exception handlers to enforce standard error responses."""
    
    @app.exception_handler(AppException)
    async def app_exception_handler(request: Request, exc: AppException):
        return create_error_response(exc.message, exc.code, exc.status_code)

    @app.exception_handler(StarletteHTTPException)
    async def http_exception_handler(request: Request, exc: StarletteHTTPException):
        code_map = {
            401: "UNAUTHORIZED",
            403: "FORBIDDEN",
            404: "RESOURCE_NOT_FOUND",
            400: "BAD_REQUEST",
            405: "METHOD_NOT_ALLOWED",
            422: "UNPROCESSABLE_ENTITY"
        }
        code = code_map.get(exc.status_code, "HTTP_ERROR")
        message = str(exc.detail) if exc.detail else "An HTTP error occurred"
        return create_error_response(message, code, exc.status_code)

    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(request: Request, exc: RequestValidationError):
        return create_error_response("Invalid request payload or parameters", "VALIDATION_ERROR", status.HTTP_422_UNPROCESSABLE_ENTITY)

    @app.exception_handler(Exception)
    async def global_exception_handler(request: Request, exc: Exception):
        logger.error(f"Unhandled server exception: {exc}", exc_info=True)
        return create_error_response("Internal server error", "INTERNAL_SERVER_ERROR", status.HTTP_500_INTERNAL_SERVER_ERROR)
