from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1.api import api_router
from pydantic import BaseModel, EmailStr

class UserData(BaseModel):
    id: str
    firstName: str
    lastName: str
    email: EmailStr

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="A modern FastAPI backend",
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Set up CORS middleware with more specific configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Your frontend URL
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"]
)

# Include API router
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
async def root():
    return {"message": "Welcome to FastAPI Backend"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True) 