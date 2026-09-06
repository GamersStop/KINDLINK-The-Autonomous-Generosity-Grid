from pydantic import BaseModel, Field
from typing import List, Literal

class PleaRequest(BaseModel):
    rawPlea: str = Field(..., min_length=5, description="Unstructured emergency distress text")

class SKUItem(BaseModel):
    id: str
    category: Literal["ration", "labour", "skill", "money", "logistics", "medical"] = Field(
        ..., description="Category of the unbundled aid unit"
    )
    title: str
    targetQty: int
    raisedQty: int = 0
    unit: str  # e.g., 'SOL', 'Hours', 'Days', 'Packets', 'Volunteers'
    urgency: Literal["CRITICAL", "HIGH", "NORMAL"]

class DecompositionResponse(BaseModel):
    incidentZone: str
    extractedCoordinates: str
    reportedTimestamp: str
    affectedCount: int
    summary: str
    priorityScore: int
    items: List[SKUItem]