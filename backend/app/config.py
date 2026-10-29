import os
from typing import List
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    PROJECT_NAME: str = "Shetkari Suchna-Setu API"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    PORT: int = 8000
    HOST: str = "0.0.0.0"

    # Database
    DATABASE_URL: str = "sqlite+aiosqlite:///./shetkari.db"

    # Security & Auth
    SECRET_KEY: str = "default-insecure-dev-secret-key-replace-in-production-with-256bit"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15

    # CORS
    CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:5173", "http://127.0.0.1:3000"]

    # Initial Admin Bootstrap
    ADMIN_BOOTSTRAP_EMAIL: str = "admin@shetkari-setu.gov.in"
    ADMIN_BOOTSTRAP_PASSWORD: str = "Admin@SecurePassword123"

    # External LLM Integration (Optional)
    OPENAI_API_KEY: str = ""
    LLM_MODEL: str = "gpt-4o-mini"

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()
