import uuid
from datetime import datetime
from typing import List
from sqlmodel import Session, select
from src.schemas.mission import MissionBroadcastRequest, MissionBroadcastResponse
from src.models.mission import Mission, MissionItem
from sqlalchemy.orm import selectinload

class MissionService:
    @staticmethod
    def broadcast_mission(session: Session, payload: MissionBroadcastRequest) -> MissionBroadcastResponse:
        short_id = f"NODE-{str(uuid.uuid4())[:4].upper()}"
        timestamp = datetime.utcnow().isoformat() + "Z"

        # Calculate initial escrow sponsorship dynamically
        base_sol = 0.1
        priority_multiplier = (payload.priorityScore / 100.0) * 0.4
        headcount_alloc = min(payload.affectedCount * 0.005, 0.5)
        allocated_sol = round(base_sol + priority_multiplier + headcount_alloc, 2)

        # Create SQLModel Entities
        db_mission = Mission(
            mission_id=short_id,
            incident_zone=payload.incidentZone,
            extracted_coordinates=payload.extractedCoordinates,
            reported_timestamp=payload.reportedTimestamp,
            affected_count=payload.affectedCount,
            summary=payload.summary,
            priority_score=payload.priorityScore,
            status="DISPATCHING",
            escrow_allocated_sol=allocated_sol,
            broadcast_timestamp=timestamp,
        )

        db_items = [
            MissionItem(
                item_key=item.id,
                category=item.category,
                title=item.title,
                target_qty=item.targetQty,
                raised_qty=item.raisedQty,
                unit=item.unit,
                urgency=item.urgency,
                mission=db_mission
            )
            for item in payload.items
        ]

        session.add(db_mission)
        session.add_all(db_items)
        session.commit()
        session.refresh(db_mission)

        return MissionBroadcastResponse(
            missionId=short_id,
            status="DISPATCHING",
            escrowAllocatedSol=allocated_sol,
            broadcastTimestamp=timestamp,
            activeNeedCount=len(db_items),
            message="Mission durably committed to PostgreSQL."
        )

    @staticmethod
    def get_all_missions(session: Session) -> List[Mission]:
        statement = select(Mission).options(selectinload(Mission.items))
        return list(session.exec(statement).all())

mission_service = MissionService()