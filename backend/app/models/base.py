from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, DateTime, String
import datetime

Base = declarative_base()

class BaseModel(Base):
    __abstract__ = True