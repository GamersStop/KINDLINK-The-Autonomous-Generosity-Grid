from typing import Optional, List
from sqlmodel import SQLModel, Field, Column
from sqlalchemy import JSON

class NGOPartner(SQLModel, table=True):
    __tablename__ = "ngo_partners"

    id: Optional[int] = Field(default=None, primary_key=True)
    org_name: str = Field(index=True)
    reg_number: str = Field(unique=True, index=True)
    org_type: str = Field(default="Disaster Response")
    lead_name: str
    lead_role: str = Field(default="Ground Operations Lead")
    lead_phone: str
    lead_email: str
    password_hash: str  # Store salted/hashed password
    operational_zones: List[str] = Field(default=[], sa_column=Column(JSON))
    active_personnel: int = Field(default=1)
    vehicle_fleet: List[str] = Field(default=[], sa_column=Column(JSON))
    alert_channel: str = Field(default="SMS & WhatsApp")
    solana_treasury_address: Optional[str] = None
    verification_status: str = Field(default="VERIFIED")
    created_at: str