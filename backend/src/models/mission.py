from typing import List, Optional
from sqlmodel import SQLModel, Field, Relationship

class MissionItem(SQLModel, table=True):
    __tablename__ = "mission_items"

    id: Optional[int] = Field(default=None, primary_key=True)
    item_key: str  # e.g., "sku-1"
    category: str
    title: str
    target_qty: int
    raised_qty: int = 0
    unit: str
    urgency: str

    mission_id: Optional[str] = Field(default=None, foreign_key="missions.mission_id")
    mission: Optional["Mission"] = Relationship(back_populates="items")


class Mission(SQLModel, table=True):
    __tablename__ = "missions"

    mission_id: str = Field(primary_key=True, index=True)
    incident_zone: str
    extracted_coordinates: str
    reported_timestamp: str
    affected_count: int
    summary: str
    priority_score: int=Field(index=True)
    status: str = Field(default="DISPATCHING",index=True)
    escrow_allocated_sol: float
    broadcast_timestamp: str=Field(index=True)

    items: List[MissionItem] = Relationship(
        back_populates="mission", 
        sa_relationship_kwargs={"cascade": "all, delete-orphan"}
    )