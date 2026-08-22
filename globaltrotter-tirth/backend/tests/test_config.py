from backend.core.config import settings
from backend.main import app

def test_settings_load():
    """Verify settings configuration fields load cleanly."""
    assert settings.PROJECT_NAME == "GlobeTrotter API"
    assert settings.API_V1_STR == "/api/v1"
    assert settings.ALGORITHM == "HS256"

def test_router_registration():
    """Verify all v1 resource routes are registered in the FastAPI app."""
    paths = list(app.openapi()["paths"].keys())

    assert "/health" in paths
    assert "/api/v1/auth/login" in paths
    assert "/api/v1/auth/register" in paths
    assert "/api/v1/users/me" in paths
    assert "/api/v1/countries" in paths
    assert "/api/v1/cities" in paths
    assert "/api/v1/activities" in paths
    assert "/api/v1/trips" in paths
    assert "/api/v1/trip-stops" in paths
    assert "/api/v1/itinerary" in paths
    assert "/api/v1/expenses" in paths
    assert "/api/v1/saved-destinations" in paths
    assert "/api/v1/trip-shares" in paths
