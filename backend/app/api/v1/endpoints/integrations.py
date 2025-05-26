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

router = APIRouter()

class OAuthCallbackRequest(BaseModel):
    code: str

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

@router.get("/gmail/auth")
async def gmail_auth(user_id: str, db: Session = Depends(get_db)):
    try:
        # First check if there's an existing integration
        integration_service = IntegrationService(db)
        existing_integration = integration_service.get_integration(user_id, ServiceType.GMAIL)
        
        # If integration exists and is revoked, we'll update it later in the callback
        if existing_integration and existing_integration.status == IntegrationStatus.revoked:
            print(f"Found revoked integration for user {user_id}, will update in callback")
        
        print(settings.GOOGLE_REDIRECT_URI)
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
        
        return RedirectResponse(url=authorization_url)
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

@router.get("/gmail/status")
async def gmail_status(user_id: str, db: Session = Depends(get_db)):
    """
    Check if a user has an active Gmail integration
    """
    try:
        integration_service = IntegrationService(db)
        integration = integration_service.get_integration(user_id, ServiceType.GMAIL)
        if not integration:
            return {
                "status": "not_connected",
                "message": "User is not connected to Gmail",
                "data": None
            }
        # Check if the integration is active
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
async def gmail_disconnect(user_id: str, db: Session = Depends(get_db)):
    """
    Disconnect a user's Gmail integration
    """
    try:
        integration_service = IntegrationService(db)
        integration = integration_service.get_integration(user_id, ServiceType.GMAIL)
        
        if not integration:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No Gmail integration found for this user"
            )
        
        # Update the integration status to revoked
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
        
    except HTTPException as he:
        raise he
    except Exception as e:
        logging.error(f"Error disconnecting Gmail: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


