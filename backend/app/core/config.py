from typing import List, Optional
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
    CLERK_CLIENT_ID: str | None = None  # Your Clerk application ID
    CLERK_ISSUER: str | None = None     # Your Clerk instance (e.g., "your-app.clerk.accounts.dev")
    
    # Google OAuth Configuration
    GOOGLE_CLIENT_ID: str = os.getenv("GOOGLE_CLIENT_ID")
    GOOGLE_CLIENT_SECRET: str = os.getenv("GOOGLE_CLIENT_SECRET")
    GOOGLE_AUTH_URI: str = os.getenv("GOOGLE_AUTH_URI", "https://accounts.google.com/o/oauth2/auth")
    GOOGLE_TOKEN_URI: str = os.getenv("GOOGLE_TOKEN_URI", "https://oauth2.googleapis.com/token")
    GOOGLE_AUTH_PROVIDER_CERT_URL: str = os.getenv("GOOGLE_AUTH_PROVIDER_CERT_URL", "https://www.googleapis.com/oauth2/v1/certs")
    GOOGLE_REDIRECT_URI: str = os.getenv("GOOGLE_REDIRECT_URI", "http://localhost:3000/oauth/callback")
    GOOGLE_JAVASCRIPT_ORIGINS: List[str] = os.getenv("GOOGLE_JAVASCRIPT_ORIGINS", "http://localhost:3000").split(",")
    
    FRONTEND_URL: str = "http://localhost:3000"
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        # Override CORS origins if environment variable is set
        if os.getenv("CORS_ORIGINS"):
            self.BACKEND_CORS_ORIGINS = [origin.strip() for origin in os.getenv("CORS_ORIGINS").split(",")]
    
    class Config:
        case_sensitive = True
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "allow"

settings = Settings() 