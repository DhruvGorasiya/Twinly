from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from openai import OpenAI
from app.core.config import settings
import logging
import json

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

@router.post("/chat")
async def chat(request: ChatRequest):
    logger.info(f"Received request: {request}")
    
    if not settings.OPENAI_API_KEY:
        logger.error("OpenAI API key not configured")
        raise HTTPException(
            status_code=500,
            detail="OpenAI API key is not configured. Please set the OPENAI_API_KEY environment variable."
        )
    
    try:
        # Initialize OpenAI client
        client = OpenAI(api_key=settings.OPENAI_API_KEY)

        # Build message context
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": request.message}
        ]
        
        async def generate():
            # Call OpenAI Chat Completion API with streaming
            stream = client.chat.completions.create(
                model="gpt-4o-mini",  # Use "gpt-4" or "gpt-3.5-turbo" as per availability
                messages=messages,
                temperature=0.7,
                stream=True  # Enable streaming
            )
            
            for chunk in stream:
                if chunk.choices[0].delta.content is not None:
                    # Send each chunk as a JSON object
                    yield json.dumps({"content": chunk.choices[0].delta.content}) + "\n"

        return StreamingResponse(
            generate(),
            media_type="application/x-ndjson"  # Newline-delimited JSON
        )

    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"An unexpected error occurred: {str(e)}"
        )