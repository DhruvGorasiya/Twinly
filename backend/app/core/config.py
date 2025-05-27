from typing import List, Optional
from pydantic_settings import BaseSettings
from pydantic import AnyHttpUrl, Field


class Settings(BaseSettings):
    PROJECT_NAME: str = "FastAPI Backend"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"

    # CORS
    BACKEND_CORS_ORIGINS: List[AnyHttpUrl] = [
        "http://localhost:3000",
        "https://twinly.net",
        "http://twinly.net",
    ]

    # DB Fields
    POSTGRES_USER: str = Field(default="postgres", env="POSTGRES_USER")
    POSTGRES_PASSWORD: str = Field(default="postgres", env="POSTGRES_PASSWORD")
    POSTGRES_DB: str = Field(default="twinly_db", env="POSTGRES_DB")
    POSTGRES_PORT: str = Field(default="5432", env="POSTGRES_PORT")
    USE_CLOUD_SQL_SOCKET: bool = Field(default=False, env="USE_CLOUD_SQL_SOCKET")

    @property
    def POSTGRES_SERVER(self) -> str:
        return (
            "/cloudsql/twinly-459118:us-central1:twinly"
            if self.USE_CLOUD_SQL_SOCKET
            else "127.0.0.1"
        )

    @property
    def SQLALCHEMY_DATABASE_URI(self) -> str:
        if self.USE_CLOUD_SQL_SOCKET:
            return (
                f"postgresql://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}"
                f"@/{self.POSTGRES_DB}?host={self.POSTGRES_SERVER}"
            )
        return (
            f"postgresql://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}"
            f"@{self.POSTGRES_SERVER}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
        )

    # JWT
    SECRET_KEY: str = "your-secret-key-here"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # OpenAI
    OPENAI_API_KEY: str

    # Clerk
    CLERK_JWKS_URL: Optional[str] = None
    CLERK_CLIENT_ID: Optional[str] = None
    CLERK_ISSUER: Optional[str] = None
    CLERK_WEBHOOK_SECRET: Optional[str] = Field(default=None, env="CLERK_WEBHOOK_SECRET")

    # Google OAuth
    GOOGLE_CLIENT_ID: str = Field(..., env="GOOGLE_CLIENT_ID")
    GOOGLE_CLIENT_SECRET: str = Field(..., env="GOOGLE_CLIENT_SECRET")
    GOOGLE_AUTH_URI: str = Field(default="https://accounts.google.com/o/oauth2/auth", env="GOOGLE_AUTH_URI")
    GOOGLE_TOKEN_URI: str = Field(default="https://oauth2.googleapis.com/token", env="GOOGLE_TOKEN_URI")
    GOOGLE_AUTH_PROVIDER_CERT_URL: str = Field(default="https://www.googleapis.com/oauth2/v1/certs", env="GOOGLE_AUTH_PROVIDER_CERT_URL")

    @property
    def GOOGLE_REDIRECT_URI(self) -> str:
        return (
            "https://twinly.net/oauth/callback"
            if self.USE_CLOUD_SQL_SOCKET
            else "http://localhost:3000/oauth/callback"
        )

    FRONTEND_URL: str = "http://localhost:3000"

    class Config:
        case_sensitive = True
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "allow"


settings = Settings()