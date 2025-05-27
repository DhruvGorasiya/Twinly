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
from svix.webhooks import Webhook

router = APIRouter()

@router.post("/clerk")
async def clerk_webhook(request: Request, db: Session = Depends(get_db)):
    try:
        # Get the webhook payload
        payload = await request.json()
        logging.info(f"Received webhook payload: {payload}")  # Log the payload
        # Verify the webhook signature
        await verify_webhook_signature(request)
        
        # Get the event type
        event_type = payload.get("type")
        logging.info(f"Processing event type: {event_type}")  # Log the event type
        
        if event_type == "user.deleted":
            # Get the user ID from the payload
            user_id = payload.get("data", {}).get("id")
            logging.info(f"Attempting to delete user with ID: {user_id}")  # Log the user ID
            
            if not user_id:
                logging.error("No user ID provided in webhook payload")  # Log error
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="No user ID provided in webhook payload"
                )
            
            # Delete the user from your database
            user_repository = UserRepository(db)
            user = user_repository.get_by_id(user_id)
            
            if user:
                logging.info(f"Found user {user_id}, attempting to delete")  # Log found user
                try:
                    user_repository.delete(user.id)
                    db.commit()  # Make sure to commit the transaction
                    logging.info(f"Successfully deleted user {user_id}")
                    return {"status": "success", "message": "User deleted successfully"}
                except Exception as delete_error:
                    db.rollback()  # Rollback on error
                    logging.error(f"Error deleting user {user_id}: {str(delete_error)}")
                    raise HTTPException(
                        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                        detail=f"Error deleting user: {str(delete_error)}"
                    )
            else:
                logging.warning(f"User {user_id} not found in database")
                return {"status": "success", "message": "User not found in database"}
        
        # Handle other webhook events if needed
        logging.info(f"Processed event {event_type}")
        return {"status": "success", "message": f"Event {event_type} processed"}
        
    except Exception as e:
        logging.error(f"Error processing webhook: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

async def verify_webhook_signature(request: Request):
    body = await request.body()
    headers = request.headers

    try:
        wh = Webhook(settings.CLERK_WEBHOOK_SECRET)
        wh.verify(body, headers)  # Raises exception if invalid
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid webhook signature")