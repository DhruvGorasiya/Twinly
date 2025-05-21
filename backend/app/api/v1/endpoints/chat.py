from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional
from openai import OpenAI
from app.core.config import settings
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str

@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        # Debug logging
        logger.info(f"Received request: {request}")
        logger.info(f"API Key present: {bool(settings.OPENAI_API_KEY)}")
        
        # Check if API key is configured
        if not settings.OPENAI_API_KEY:
            logger.error("OpenAI API key not configured")
            raise HTTPException(
                status_code=500,
                detail="OpenAI API key is not configured. Please set the OPENAI_API_KEY environment variable."
            )
        
        # Initialize OpenAI client
        client = OpenAI(api_key=settings.OPENAI_API_KEY)
        
        # Prepare messages with system message and user message
        messages = [
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": request.message}
        ]
        
        logger.info(f"Prepared messages: {messages}")
        
        # Create chat completion
        try:
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=messages,
                temperature=0.7
            )
            logger.info(f"OpenAI Response: {response}")
        except Exception as e:
            logger.error(f"OpenAI API call failed: {str(e)}")
            raise
        
        # Extract the assistant's response
        assistant_message = response.choices[0].message.content
        
        return ChatResponse(response=assistant_message)

    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"An unexpected error occurred: {str(e)}"
        )