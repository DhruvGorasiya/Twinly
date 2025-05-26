from fastapi import APIRouter
from app.api.v1.endpoints import users, auth, chat, integrations, webhooks

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(chat.router, tags=["chat"])
api_router.include_router(integrations.router, prefix="/integrations", tags=["integrations"])
api_router.include_router(webhooks.router, prefix="/webhooks", tags=["webhooks"]) 
