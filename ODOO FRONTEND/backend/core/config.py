import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "GlobeTrotter API"
    API_V1_STR: str = "/api/v1"
    
    # Environment variables loaded from backend/.env
    DATABASE_URL: str = "postgresql://username:password@localhost:5432/globe_trotter"
    SECRET_KEY: str = "default_secret_key_change_me"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True

settings = Settings()
