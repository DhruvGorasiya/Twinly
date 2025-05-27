from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.repositories.user_repository import UserRepository
from app.services.auth_service import AuthService
from app.services.user_service import UserService
from app.schemas.auth import Token
from app.schemas.user import UserData
from pydantic import BaseModel


router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

class LoginRequest(BaseModel):
    user: UserData
    isNewUser: bool

@router.post("/token", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user_repository = UserRepository(db)
    auth_service = AuthService(user_repository)
    
    user = auth_service.authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = auth_service.create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/register")
async def register(user_data: UserData, db: Session = Depends(get_db)):
    """
    Register a new user with Clerk.js data
    """
    user_repository = UserRepository(db)
    auth_service = AuthService(user_repository)
    
    print("Registered User from Clerk:", user_data.dict())
    return {"message": "User registered successfully", "user": user_data}

@router.post("/login")
async def login(login_request: LoginRequest, db: Session = Depends(get_db)):
    """
    Login user with Clerk.js data and add to database if not exists
    """
    try:
        user_data = login_request.user
        isNewUser = login_request.isNewUser
        
        user_repository = UserRepository(db)
        user_service = UserService(user_repository)
        
        # Check if user already exists
        existing_user = user_repository.get_by_email(user_data.email)
        # existing_user = user_repository.get_by_id(user_data.id)
        
        if not existing_user:
            user_service.create_user(user_data)
            return {
                "message": "User created and logged in successfully",
                "user": user_data
            }
            
        if existing_user and isNewUser:
            user_service.delete_user(existing_user.id)
            user_service.create_user(user_data)
            return {
                "message": "User logged in successfully",
                "user": user_data
            }
        
        return {
            "message": "User created and logged in successfully",
            "user": user_data
        }
    except Exception as e:
        db.rollback()
        print(f"Error in login endpoint: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )