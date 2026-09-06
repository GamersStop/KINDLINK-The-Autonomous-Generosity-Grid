from pydantic import BaseModel, Field
from typing import List, Optional

class SentinelAuditRequest(BaseModel):
    videoFramesBase64: List[str] = Field(..., description="List of base64 JPEG keyframes captured from stream")
    latitude: Optional[float] = None
    longitude: Optional[float] = None

class SentinelAuditResponse(BaseModel):
    missionId: str
    threatLevel: str
    estimatedWaterDepth: str
    trappedVictimsCount: int
    structuralEvaluation: str
    environmentalHazards: List[str]
    spokenDirective: str
    audioBase64: Optional[str] = None