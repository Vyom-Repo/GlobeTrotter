from typing import Generic, List, TypeVar
from pydantic import BaseModel, Field

T = TypeVar("T")

class ErrorPayload(BaseModel):
    code: str = Field(..., json_schema_extra={"example": "RESOURCE_NOT_FOUND"})
    message: str = Field(..., json_schema_extra={"example": "Requested resource was not found"})

class ErrorResponse(BaseModel):
    success: bool = False
    error: ErrorPayload

class SuccessResponse(BaseModel, Generic[T]):
    success: bool = True
    data: T

class PaginationMeta(BaseModel):
    page: int = Field(..., ge=1, json_schema_extra={"example": 1})
    page_size: int = Field(..., ge=1, le=100, json_schema_extra={"example": 20})
    total: int = Field(..., ge=0, json_schema_extra={"example": 608})
    total_pages: int = Field(..., ge=0, json_schema_extra={"example": 31})

class PaginatedResponse(BaseModel, Generic[T]):
    data: List[T]
    pagination: PaginationMeta
