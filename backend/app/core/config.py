from typing import List
from pydantic_settings import BaseSettings
from pydantic import AnyHttpUrl
import os

class Settings(BaseSettings):
    PROJECT_NAME: str = "FastAPI Backend"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # CORS Configuration
    BACKEND_CORS_ORIGINS: List[AnyHttpUrl] = [
        "http://localhost:3000",  # Local development
        "https://twinly.net",     # Production frontend
        "http://twinly.net"       # Fallback for http
    ]
    
    # Database Configuration
    POSTGRES_SERVER: str = "localhost"
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "postgres"
    POSTGRES_DB: str = "twinly_db"
    SQLALCHEMY_DATABASE_URI: str = f"postgresql://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{POSTGRES_SERVER}/{POSTGRES_DB}"
    
    # JWT Configuration
    SECRET_KEY: str = "your-secret-key-here"  # Change this in production
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # OpenAI Configuration
    OPENAI_API_KEY: str
    
    CLERK_JWKS_URL: str | None = None
    
    # Google OAuth Configuration
    GOOGLE_OAUTH_CREDENTIALS_FILE: str
    GOOGLE_REDIRECT_URI: str
    
    GOOGLE_CLIENT_ID: str
    GOOGLE_CLIENT_SECRET: str
    REDIRECT_URI: str
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        # Override CORS origins if environment variable is set
        if os.getenv("CORS_ORIGINS"):
            self.BACKEND_CORS_ORIGINS = [origin.strip() for origin in os.getenv("CORS_ORIGINS").split(",")]
    
    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings() 