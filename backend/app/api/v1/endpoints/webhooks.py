from fastapi import APIRouter, Request, HTTPException, status
from app.repositories.user_repository import UserRepository
from app.db.session import get_db
from sqlalchemy.orm import Session
from fastapi import Depends
import logging
from typing import Dict, Any
import hmac
import hashlib
from app.core.config import settings

router = APIRouter()

@router.post("/clerk")
async def clerk_webhook(request: Request, db: Session = Depends(get_db)):
    try:
        # Get the webhook payload
        payload = await request.json()
        
        # Verify the webhook signature (you should implement this)
        await verify_webhook_signature(request)
        
        # Get the event type
        event_type = payload.get("type")
        
        if event_type == "user.deleted":
            # Get the user ID from the payload
            user_id = payload.get("data", {}).get("id")
            
            if not user_id:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="No user ID provided in webhook payload"
                )
            
            # Delete the user from your database
            user_repository = UserRepository(db)
            user = user_repository.get_by_id(user_id)
            
            if user:
                user_repository.delete(user.id)
                logging.info(f"User {user_id} deleted from database")
                return {"status": "success", "message": "User deleted successfully"}
            else:
                logging.warning(f"User {user_id} not found in database")
                return {"status": "success", "message": "User not found in database"}
        
        # Handle other webhook events if needed
        return {"status": "success", "message": f"Event {event_type} processed"}
        
    except Exception as e:
        logging.error(f"Error processing webhook: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

async def verify_webhook_signature(request: Request):
    """
    Verify the webhook signature from Clerk
    """
    try:
        # Get the signature from the header
        signature = request.headers.get("svix-signature")
        if not signature:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="No signature provided"
            )
        
        # Get the timestamp from the header
        timestamp = request.headers.get("svix-timestamp")
        if not timestamp:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="No timestamp provided"
            )
        
        # Get the webhook secret from your environment variables
        webhook_secret = settings.CLERK_WEBHOOK_SECRET
        
        # Get the raw body
        body = await request.body()
        
        # Create the signature string
        signature_string = f"{timestamp}.{body.decode()}"
        
        # Create the expected signature
        expected_signature = hmac.new(
            webhook_secret.encode(),
            signature_string.encode(),
            hashlib.sha256
        ).hexdigest()
        
        # Compare signatures
        if not hmac.compare_digest(signature, expected_signature):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid signature"
            )
            
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e)
        )
