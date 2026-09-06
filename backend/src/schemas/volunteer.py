from pydantic import BaseModel
from datetime import date
from typing import List, Optional
from src.schemas.mission import DecompositionResponse

class VolunteerOfferCreate(BaseModel):
    fullName: str
    contact: str
    location: str
    category: str
    capacityDescription: str
    availableFrom: date
    availableTo: date

class VolunteerOfferResponse(BaseModel):
    id: int
    fullName: str
    status: str
    matchedCount: int
    message: str