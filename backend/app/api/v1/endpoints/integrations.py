from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.integrations import ServiceType, IntegrationStatus
from datetime import datetime, timedelta
from google_auth_oauthlib.flow import Flow
from app.core.config import settings
import logging
from urllib.parse import quote_plus
from jose import jwt
import requests
from pydantic import BaseModel
from app.schemas.integration import IntegrationCreate
from app.services.integration_service import IntegrationService
from app.repositories.user_repository import UserRepository

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

notion_scopes = [
    "read_user",
    "read_blocks",
    "read_databases",
    "write_blocks",
    "write_databases"
]

router = APIRouter()

class OAuthCallbackRequest(BaseModel):
    code: str

class UserIdRequest(BaseModel):
    user_id: str

google_scopes = [
    "https://www.googleapis.com/auth/gmail.readonly",
    "https://www.googleapis.com/auth/gmail.send",
    "https://www.googleapis.com/auth/gmail.modify",
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile",
    "openid"
]

def exchange_code_for_tokens(code: str) -> dict:
    """Exchange the authorization code for access and refresh tokens."""
    flow = Flow.from_client_config(
        {
            "web": {
                "client_id": settings.GOOGLE_CLIENT_ID,
                "client_secret": settings.GOOGLE_CLIENT_SECRET,
                "redirect_uri": settings.GOOGLE_REDIRECT_URI,
                "auth_uri": settings.GOOGLE_AUTH_URI,
                "token_uri": settings.GOOGLE_TOKEN_URI
            }
        },
        scopes=google_scopes,
        redirect_uri=settings.GOOGLE_REDIRECT_URI
    )
    
    # Disable scope validation
    flow.oauth2session._client.scope = None
    
    flow.fetch_token(code=code)
    return {
        "access_token": flow.credentials.token,
        "refresh_token": flow.credentials.refresh_token,
        "expires_in": flow.credentials.expiry.timestamp() - datetime.utcnow().timestamp(),
        "scope": " ".join(flow.credentials.scopes)
    }

def get_user_info_from_token(access_token: str) -> dict:
    """Get user information using the access token."""
    response = requests.get(
        "https://www.googleapis.com/oauth2/v2/userinfo",
        headers={"Authorization": f"Bearer {access_token}"}
    )
    response.raise_for_status()
    return response.json()

@router.post("/gmail/auth")
async def gmail_auth(request: UserIdRequest, db: Session = Depends(get_db)):
    try:
        # First check if there's an existing integration
        integration_service = IntegrationService(db)
        existing_integration = integration_service.get_integration(request.user_id, ServiceType.GMAIL)
        
        if existing_integration and existing_integration.status == IntegrationStatus.revoked:
            print(f"Found revoked integration for user {request.user_id}, will update in callback")
        
        flow = Flow.from_client_config(
            {
                "web": {
                    "client_id": settings.GOOGLE_CLIENT_ID,
                    "client_secret": settings.GOOGLE_CLIENT_SECRET,
                    "redirect_uri": settings.GOOGLE_REDIRECT_URI,
                    "auth_uri": settings.GOOGLE_AUTH_URI,
                    "token_uri": settings.GOOGLE_TOKEN_URI
                }
            },
            scopes=google_scopes,
            redirect_uri=settings.GOOGLE_REDIRECT_URI
        )
        
        authorization_url, state = flow.authorization_url(
            access_type="offline",
            include_granted_scopes="true",
            prompt="consent"
        )
        
        return {"auth_url": authorization_url}
    except Exception as e:
        logging.error(f"Error in Gmail auth: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.post("/gmail/callback")
async def gmail_oauth_callback_post(request: OAuthCallbackRequest, db: Session = Depends(get_db)):
    try:
        # Step 1: Exchange code for tokens using the oauth service
        tokens = exchange_code_for_tokens(request.code)
        access_token = tokens["access_token"]

        # Step 2: Get user info using the oauth service
        profile = get_user_info_from_token(access_token)
        
        # Step 3: Get the user from the database using the email
        user_repository = UserRepository(db)
        user = user_repository.get_by_email(profile["email"])
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"User with email {profile['email']} not found. Please login first."
            )

        # Step 4: Check for existing integration
        integration_service = IntegrationService(db)
        existing_integration = integration_service.get_integration(user.id, ServiceType.GMAIL)

        if existing_integration:
            # Update existing integration
            if existing_integration.status == IntegrationStatus.revoked:
                # Update the revoked integration
                updated_integration = integration_service.update_integration(
                    existing_integration.id,
                    {
                        "access_token": access_token,
                        "refresh_token": tokens.get("refresh_token"),
                        "expires_at": datetime.utcnow() + timedelta(seconds=tokens["expires_in"]),
                        "scopes": tokens.get("scope", "").split(" "),
                        "status": IntegrationStatus.active,
                        "service_metadata": {"email_address": profile["email"]}
                    }
                )
                return {
                    "status": "success", 
                    "message": "Gmail integration reactivated successfully", 
                    "data": updated_integration
                }
            else:
                # Update active integration with new tokens
                updated_integration = integration_service.update_integration(
                    existing_integration.id,
                    {
                        "access_token": access_token,
                        "refresh_token": tokens.get("refresh_token"),
                        "expires_at": datetime.utcnow() + timedelta(seconds=tokens["expires_in"]),
                        "scopes": tokens.get("scope", "").split(" ")
                    }
                )
                return {
                    "status": "success", 
                    "message": "Gmail integration updated successfully", 
                    "data": updated_integration
                }
        else:
            # Create new integration
            integration = IntegrationCreate(
                user_id=user.id,
                service_type=ServiceType.GMAIL,
                external_user_id=profile["email"],
                access_token=access_token,
                refresh_token=tokens.get("refresh_token"),
                expires_at=datetime.utcnow() + timedelta(seconds=tokens["expires_in"]),
                scopes=tokens.get("scope", "").split(" "),
                service_metadata={"email_address": profile["email"]}
            )
            result = integration_service.create_integration(integration)
            return {
                "status": "success", 
                "message": "Gmail integration created successfully", 
                "data": result
            }

    except Exception as e:
        logging.error(f"Gmail OAuth callback failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.post("/gmail/status")
async def gmail_status(request: UserIdRequest, db: Session = Depends(get_db)):
    try:
        integration_service = IntegrationService(db)
        integration = integration_service.get_integration(request.user_id, ServiceType.GMAIL)
        if not integration:
            return {
                "status": "not_connected",
                "message": "User is not connected to Gmail",
                "data": None
            }
        if integration.status == IntegrationStatus.active:
            return {
                "status": "connected",
                "message": "User is connected to Gmail",
                "data": {
                    "email": integration.service_metadata.get("email_address"),
                    "connected_at": integration.created_at,
                    "last_synced": integration.last_synced_at
                }
            }
        else:
            return {
                "status": "disconnected",
                "message": "Gmail integration is not active",
                "data": None
            }
    except Exception as e:
        logging.error(f"Error checking Gmail status: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.delete("/gmail/disconnect")
async def gmail_disconnect(request: UserIdRequest, db: Session = Depends(get_db)):
    try:
        integration_service = IntegrationService(db)
        integration = integration_service.get_integration(request.user_id, ServiceType.GMAIL)
        
        if not integration:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No Gmail integration found for this user"
            )
        
        updated_integration = integration_service.update_integration_status(
            integration.id, 
            IntegrationStatus.revoked
        )
        
        if not updated_integration:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to disconnect Gmail integration"
            )
        
        return {
            "status": "success",
            "message": "Gmail integration disconnected successfully",
            "data": None
        }
    except Exception as e:
        logging.error(f"Error disconnecting Gmail: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


def exchange_notion_code_for_tokens(code: str) -> dict:
    """Exchange the authorization code for Notion access token."""
    import base64
    
    # Create the Basic auth string
    auth_string = f"{settings.NOTION_CLIENT_ID}:{settings.NOTION_CLIENT_SECRET}"
    auth_bytes = auth_string.encode('ascii')
    base64_auth = base64.b64encode(auth_bytes).decode('ascii')
    
    response = requests.post(
        "https://api.notion.com/v1/oauth/token",
        headers={
            "Authorization": f"Basic {base64_auth}",
            "Content-Type": "application/json"
        },
        json={
            "grant_type": "authorization_code",
            "code": code,
            "redirect_uri": settings.NOTION_REDIRECT_URI
        }
    )
    response.raise_for_status()
    return response.json()

def get_notion_user_info(access_token: str) -> dict:
    """Get Notion user information using the access token."""
    response = requests.get(
        "https://api.notion.com/v1/users/me",
        headers={
            "Authorization": f"Bearer {access_token}",
            "Notion-Version": "2022-06-28"
        }
    )
    response.raise_for_status()
    return response.json()

@router.post("/notion/auth")
async def notion_auth(request: UserIdRequest, db: Session = Depends(get_db)):
    try:
        integration_service = IntegrationService(db)
        existing_integration = integration_service.get_integration(request.user_id, ServiceType.NOTION)
        
        if existing_integration and existing_integration.status == IntegrationStatus.revoked:
            print(f"Found revoked Notion integration for user {request.user_id}, will update in callback")
        
        print("Notion auth url", settings.NOTION_AUTH_URL)
        return {"auth_url": f"{settings.NOTION_AUTH_URL}"}
        # return {"auth_url": "https://api.notion.com/v1/oauth/authorize?client_id=204d872b-594c-807b-a472-00377a4a716f&response_type=code&owner=user&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Foauth%2Fcallback"}
    except Exception as e:
        logging.error(f"Error in Notion auth: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.post("/notion/callback")
async def notion_oauth_callback_post(request: OAuthCallbackRequest, db: Session = Depends(get_db)):
    try:
        # Exchange code for tokens
        tokens = exchange_notion_code_for_tokens(request.code)
        print("tokens", tokens)
        access_token = tokens["access_token"]

        # Get user info
        profile = get_notion_user_info(access_token)
        print("profile", profile)

        # Get user from database
        user_repository = UserRepository(db)
        user_email = profile["bot"]["owner"]["user"]["person"]["email"]
        user = user_repository.get_by_email(user_email)

        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"User with email {user_email} not found. Please login first."
            )

        # Check for existing integration
        integration_service = IntegrationService(db)
        existing_integration = integration_service.get_integration(user.id, ServiceType.NOTION)

        if existing_integration:
            # Update existing integration
            if existing_integration.status == IntegrationStatus.revoked:
                updated_integration = integration_service.update_integration(
                    existing_integration.id,
                    {
                        "access_token": access_token,
                        "expires_at": datetime.utcnow() + timedelta(days=30),  # Notion tokens don't expire
                        "scopes": notion_scopes,
                        "status": IntegrationStatus.active,
                        "service_metadata": {
                            "workspace_id": profile.get("workspace_id"),
                            "workspace_name": profile.get("workspace_name"),
                            "workspace_icon": profile.get("workspace_icon")
                        }
                    }
                )
                return {
                    "status": "success",
                    "message": "Notion integration reactivated successfully",
                    "data": updated_integration
                }
            else:
                updated_integration = integration_service.update_integration(
                    existing_integration.id,
                    {
                        "access_token": access_token,
                        "scopes": notion_scopes
                    }
                )
                return {
                    "status": "success",
                    "message": "Notion integration updated successfully",
                    "data": updated_integration
                }
        else:
            # Create new integration
            integration = IntegrationCreate(
                user_id=user.id,
                service_type=ServiceType.NOTION,
                external_user_id=profile["id"],
                access_token=access_token,
                expires_at=datetime.utcnow() + timedelta(days=30),  # Notion tokens don't expire
                scopes=notion_scopes,
                service_metadata={
                    "workspace_id": profile.get("workspace_id"),
                    "workspace_name": profile.get("workspace_name"),
                    "workspace_icon": profile.get("workspace_icon")
                }
            )
            result = integration_service.create_integration(integration)
            return {
                "status": "success",
                "message": "Notion integration created successfully",
                "data": result
            }

    except Exception as e:
        logging.error(f"Notion OAuth callback failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.post("/notion/status")
async def notion_status(request: UserIdRequest, db: Session = Depends(get_db)):
    """
    Check if a user has an active Notion integration
    """
    try:
        integration_service = IntegrationService(db)
        integration = integration_service.get_integration(request.user_id, ServiceType.NOTION)
        print("integration", integration)
        if not integration:
            return {
                "status": "not_connected",
                "message": "User is not connected to Notion",
                "data": None
            }
            
        if integration.status == IntegrationStatus.active:
            return {
                "status": "connected",
                "message": "User is connected to Notion",
                "data": {
                    "workspace_name": integration.service_metadata.get("workspace_name"),
                    "connected_at": integration.created_at,
                    "last_synced": integration.last_synced_at
                }
            }
        else:
            return {
                "status": "disconnected",
                "message": "Notion integration is not active",
                "data": None
            }
            
    except Exception as e:
        logging.error(f"Error checking Notion status: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.delete("/notion/disconnect")
async def notion_disconnect(request: UserIdRequest, db: Session = Depends(get_db)):
    """
    Disconnect a user's Notion integration
    """
    try:
        integration_service = IntegrationService(db)
        integration = integration_service.get_integration(request.user_id, ServiceType.NOTION)
        
        if not integration:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No Notion integration found for this user"
            )
        
        updated_integration = integration_service.update_integration_status(
            integration.id, 
            IntegrationStatus.revoked
        )
        
        if not updated_integration:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to disconnect Notion integration"
            )
        
        return {
            "status": "success",
            "message": "Notion integration disconnected successfully",
            "data": None
        }
        
    except HTTPException as he:
        raise he
    except Exception as e:
        logging.error(f"Error disconnecting Notion: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )