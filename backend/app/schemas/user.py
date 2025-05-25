from pydantic import BaseModel, EmailStr
from typing import Optional

class UserBase(BaseModel):
    email: EmailStr
    is_active: bool = True

class UserCreate(UserBase):
    password: str

class UserUpdate(UserBase):
    password: Optional[str] = None
    
class UserData(BaseModel):
    id: str
    first_name: str
    last_name: str
    email: EmailStr

class UserInDB(UserBase):
    id: int

    class Config:
        from_attributes = True
