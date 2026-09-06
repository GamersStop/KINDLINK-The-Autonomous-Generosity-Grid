from pydantic import BaseModel, Field
from typing import List, Literal

class SKUItem(BaseModel):
    id: str
    category: Literal["water", "food", "medical", "shelter", "logistics"]
    title: str
    targetQty: int
    raisedQty: int = 0
    unit: str
    urgency: Literal["CRITICAL", "HIGH", "NORMAL"]

class DecompositionResponse(BaseModel):
    incidentZone: str
    extractedCoordinates: str
    reportedTimestamp: str
    affectedCount: int
    summary: str
    priorityScore: int
    items: List[SKUItem]

class PleaRequest(BaseModel):
    rawPlea: str = Field(..., min_length=5, description="Raw unstructured distress report")