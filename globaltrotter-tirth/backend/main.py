import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.api.router import api_router
from backend.core.config import settings
from backend.core.exceptions import setup_exception_handlers

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="GlobeTrotter Backend API for offline trip planning, itinerary management, and budget analytics.",
    version="1.0.0",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS middleware
origins = settings.CORS_ORIGINS if isinstance(settings.CORS_ORIGINS, list) else [settings.CORS_ORIGINS]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register global exception handlers
setup_exception_handlers(app)

# Include centralized API v1 router
app.include_router(api_router)

@app.get("/", tags=["Health"])
def root():
    """API Welcome root endpoint."""
    return {
        "message": "Welcome to GlobeTrotter API",
        "docs": "/docs",
        "health": "/health",
        "version": "1.0.0"
    }

@app.get("/health", tags=["Health"])
def health_check():
    """Health check endpoint indicating backend process status."""
    return {"status": "ok"}
