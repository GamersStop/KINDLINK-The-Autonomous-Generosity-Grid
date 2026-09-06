from typing import Optional
from sqlmodel import SQLModel, Field
from datetime import date

class VolunteerOffer(SQLModel, table=True):
    __tablename__ = "volunteer_offers"

    id: Optional[int] = Field(default=None, primary_key=True)
    full_name: str
    contact: Optional[str] = ""
    location: Optional[str] = ""
    category: str  # "all", "money", "logistics", "labour", "skill", "ration"
    dispatch_radius_km: int = 25
    vehicle_capacity_kg: Optional[int] = 500
    available_from: Optional[date] = None
    available_to: Optional[date] = None
    notes: Optional[str] = ""
    status: str = Field(default="ACTIVE_STANDBY")  # "ACTIVE_STANDBY", "COMMITTED"
    created_at: str

class VolunteerCommitment(SQLModel, table=True):
    __tablename__ = "volunteer_commitments"

    id: Optional[int] = Field(default=None, primary_key=True)
    giver_email: str = Field(index=True)
    mission_id: str = Field(index=True)
    item_key: str
    item_title: str
    commitment_type: str  # "DATES_BLOCKED" or "SOL_ESCROW"
    details: str
    sol_amount: Optional[float] = 0.0
    tx_signature: Optional[str] = None
    status: str = Field(default="CONFIRMED")
    created_at: str