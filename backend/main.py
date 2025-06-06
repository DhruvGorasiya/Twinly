from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1.api import api_router
from pydantic import BaseModel, EmailStr
import subprocess
import time
import os

class UserData(BaseModel):
    id: str
    first_name: str
    last_name: str
    email: EmailStr

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="A modern FastAPI backend",
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://twinly.net",
        "http://twinly.net"
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"]
)

app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
async def root():
    return {"message": "Welcome to FastAPI Backend"}

def start_cloud_sql_proxy():
    try:
        subprocess.check_output(["lsof", "-i", ":5432"])
        print("Cloud SQL Proxy already running on port 5432.")
    except subprocess.CalledProcessError:
        print("Starting Cloud SQL Proxy...")
        subprocess.Popen([
            "cloud-sql-proxy",
            "twinly-459118:us-central1:twinly",
            f"--credentials-file={os.path.expanduser('~/keys/cloudsql-proxy.json')}",
            "--port=5432"
        ])
        time.sleep(1)

if __name__ == "__main__":
    if os.getenv("ENV") == "local":
        start_cloud_sql_proxy()
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)