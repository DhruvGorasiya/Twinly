from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
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

# Custom Twinly system prompt
system_prompt = (
    "You are Twinly, a personalized AI assistant that thinks, reasons, and remembers for the user. "
    "You help them manage their thoughts, track ideas, plan tasks, and reflect on conversations. "
    "Be proactive, concise, and thoughtful. Ask clarifying questions if needed."
)

@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    logger.info(f"Received request: {request}")
    
    if not settings.OPENAI_API_KEY:
        logger.error("OpenAI API key not configured")
        raise HTTPException(
            status_code=500,
            detail="OpenAI API key is not configured. Please set the OPENAI_API_KEY environment variable."
        )
    
    try:
        # Initialize OpenAI client (new SDK style)
        client = OpenAI(api_key=settings.OPENAI_API_KEY)

        # Build message context
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": request.message}
        ]
        
        # Call OpenAI Chat Completion API (sync call in SDK v1.x)
        response = client.chat.completions.create(
            model="gpt-4o",  # Use "gpt-4o" or "gpt-3.5-turbo" as per availability
            messages=messages,
            temperature=0.7
        )
        
        assistant_message = response.choices[0].message.content
        return ChatResponse(response=assistant_message)

    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"An unexpected error occurred: {str(e)}"
        )