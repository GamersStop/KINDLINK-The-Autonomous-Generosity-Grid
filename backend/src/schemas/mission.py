from pydantic import BaseModel, Field
from typing import List, Literal, Optional
from datetime import datetime
from src.schemas.decomposition import DecompositionResponse

class MissionBroadcastRequest(DecompositionResponse):
    pass

class MissionBroadcastResponse(BaseModel):
    missionId: str = Field(..., description="Unique node ID for live grid tracking")
    status: Literal["QUEUED", "DISPATCHING", "MATCHED"]
    escrowAllocatedSol: float
    broadcastTimestamp: str
    activeNeedCount: int
    message: str