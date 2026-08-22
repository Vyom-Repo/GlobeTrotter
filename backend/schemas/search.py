from typing import Optional, List, Dict, Any
from uuid import UUID
from pydantic import BaseModel, ConfigDict
from backend.schemas.common import PaginationMeta

class SearchResultItem(BaseModel):
    id: UUID
    entity_type: str  # "country" | "city" | "activity" | "public_trip"
    title: str
    description: Optional[str] = None
    image_url: Optional[str] = None
    location: Optional[str] = None
    score: Optional[float] = None
    metadata_payload: Optional[Dict[str, Any]] = None

    model_config = ConfigDict(from_attributes=True)

class UnifiedSearchResponse(BaseModel):
    items: List[SearchResultItem]
    pagination: PaginationMeta

class RecommendationItem(BaseModel):
    id: UUID
    entity_type: str  # "city" | "activity" | "country" | "public_trip"
    title: str
    subtitle: Optional[str] = None
    image_url: Optional[str] = None
    score: float
    match_reasons: List[str]
    metadata_payload: Optional[Dict[str, Any]] = None

    model_config = ConfigDict(from_attributes=True)

class RecommendationListResponse(BaseModel):
    items: List[RecommendationItem]
    total: int
