from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.core.security import create_access_token, get_password_hash, verify_password
from app.db.session import get_db
from app.models.user import User
from pydantic import BaseModel, EmailStr

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

class Token(BaseModel):
    access_token: str
    token_type: str

class UserCreate(BaseModel):
    email: str
    password: str
    full_name: str

class ClerkUserData(BaseModel):
    id: str
    firstName: str
    lastName: str
    email: str

class UserData(BaseModel):
    id: str
    firstName: str
    lastName: str
    email: EmailStr

@router.post("/token", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

# New endpoints for Clerk.js integration
@router.post("/register")
async def register(user_data: UserData):
    """
    Register a new user with Clerk.js data
    """
    print("Registered User from Clerk:", user_data.dict())
    return {"message": "User registered successfully", "user": user_data}

@router.post("/login")
async def login(user_data: UserData, db: Session = Depends(get_db)):
    """
    Login user with Clerk.js data and add to database if not exists
    """
    try:
        # Check if user already exists
        existing_user = db.query(User).filter(User.id == user_data.id).first()
        
        if existing_user:
            return {
                "message": "User logged in successfully",
                "user": user_data
            }
        
        # User doesn't exist, create new user
        new_user = User(
            id=user_data.id,
            email=user_data.email,
            first_name=user_data.firstName,  # Changed to match Clerk.js
            last_name=user_data.lastName     # Changed to match Clerk.js
        )
        
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        
        return {
            "message": "User created and logged in successfully",
            "user": user_data
        }
    except Exception as e:
        db.rollback()
        print(f"Error in login endpoint: {str(e)}")  # Add logging
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )



