from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime
from src.core.database import get_session
from src.models.volunteer import VolunteerOffer,VolunteerCommitment
from src.models.ngo import NGOPartner
from src.models.mission import MissionItem
import uuid

router = APIRouter()

class VolunteerStandbyRequest(BaseModel):
    fullName: str
    contact: Optional[str] = ""
    location: Optional[str] = ""
    selectedCategory: str
    maxDistanceKm: int
    vehicleCapacityKg: Optional[int] = 0
    availableFrom: Optional[date] = None
    availableTo: Optional[date] = None
    notes: Optional[str] = ""

class CommitItemRequest(BaseModel):
    itemKey: str
    missionId: str
    itemTitle: str
    availableFrom: str
    availableTo: str
    giverEmail: str

@router.post("/standby", status_code=status.HTTP_201_CREATED)
def register_volunteer_standby(
    payload: VolunteerStandbyRequest,
    session: Session = Depends(get_session)
):
    try:
        volunteer = VolunteerOffer(
            full_name=payload.fullName if payload.fullName.strip() else "Anonymous Volunteer",
            contact=payload.contact,
            location=payload.location,
            category=payload.selectedCategory.lower(),
            dispatch_radius_km=payload.maxDistanceKm,
            vehicle_capacity_kg=payload.vehicleCapacityKg if payload.selectedCategory == "logistics" else 0,
            available_from=payload.availableFrom,
            available_to=payload.availableTo,
            notes=payload.notes,
            status="ACTIVE_STANDBY",
            created_at=datetime.utcnow().isoformat() + "Z"
        )
        session.add(volunteer)
        session.commit()
        session.refresh(volunteer)

        return {
            "status": "REGISTERED",
            "volunteerId": volunteer.id,
            "message": "Availability and profile successfully indexed in the volunteer standby registry."
        }
    except Exception as exc:
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to register volunteer offer: {str(exc)}"
        )

@router.get("/capacity-roster", status_code=status.HTTP_200_OK)
def get_capacity_roster(session: Session = Depends(get_session)):
    volunteers = session.exec(select(VolunteerOffer)).all()
    ngos = session.exec(select(NGOPartner)).all()

    return {
        "summary": {
            "totalIndividualResponders": len(volunteers),
            "totalNgoPartners": len(ngos),
            "cumulativeReadiness": "Operational",
        },
        "individuals": [
            {
                "id": v.id,
                "fullName": v.full_name,
                "contact": v.contact or "Confidential",
                "location": v.location or "Grid Roving Unit",
                "category": v.category,
                "dispatchRadiusKm": v.dispatch_radius_km,
                "vehicleCapacityKg": v.vehicle_capacity_kg,
                "availableFrom": str(v.available_from) if v.available_from else "Immediate",
                "availableTo": str(v.available_to) if v.available_to else "Open",
                "notes": v.notes,
                "status": v.status,
            }
            for v in volunteers
        ],
        "ngoPartners": [
            {
                "organizationName": n.org_name,
                "headquartersZone": ", ".join(n.operational_zones) if n.operational_zones else "Field Deployable",
                "coordinates": "Network Verified",
                "activeNodesManaged": n.active_personnel,
                "supportedCategories": n.vehicle_fleet,
                "priorityTier": "Tier 1 Certified NGO",
            }
            for n in ngos
        ]
    }

@router.post("/commit-item")
def commit_dates_to_item(
    payload: CommitItemRequest,
    session: Session = Depends(get_session)
):
    # Increment mission item raised quantity
    item = session.exec(
        select(MissionItem).where(MissionItem.item_key == payload.itemKey)
    ).first()
    if item:
        item.raised_qty = (item.raised_qty or 0) + 1
        session.add(item)

    # Record volunteer commitment
    commitment = VolunteerCommitment(
        giver_email=payload.giverEmail,
        mission_id=payload.missionId,
        item_key=payload.itemKey,
        item_title=payload.itemTitle,
        commitment_type="DATES_BLOCKED",
        details=f"Dates Blocked: {payload.availableFrom} to {payload.availableTo}",
        sol_amount=0.0,
        tx_signature=f"BLOCK-{uuid.uuid4().hex[:8].upper()}",
        status="CONFIRMED",
        created_at=datetime.utcnow().isoformat() + "Z"
    )
    session.add(commitment)
    session.commit()
    session.refresh(commitment)

    return {
        "status": "CONFIRMED",
        "commitmentId": commitment.id,
        "message": f"Dates successfully scheduled for {payload.itemTitle}."
    }

@router.get("/my-offers")
def get_my_offers(email: Optional[str] = "", session: Session = Depends(get_session)):
    offers = session.exec(select(VolunteerOffer)).all()
    return [
        {
            "id": o.id,
            "fullName": o.full_name,
            "category": o.category,
            "dispatchRadiusKm": o.dispatch_radius_km,
            "vehicleCapacityKg": o.vehicle_capacity_kg,
            "availableFrom": str(o.available_from),
            "availableTo": str(o.available_to),
            "notes": o.notes,
            "status": o.status,
            "createdAt": o.created_at
        }
        for o in reversed(offers)
    ]

@router.get("/my-completed-services")
def get_my_completed_services(email: Optional[str] = "", session: Session = Depends(get_session)):
    query = select(VolunteerCommitment)
    if email:
        query = query.where(VolunteerCommitment.giver_email == email)
    commits = session.exec(query).all()

    return [
        {
            "id": c.id,
            "giverEmail": c.giver_email,
            "missionId": c.mission_id,
            "itemKey": c.item_key,
            "itemTitle": c.item_title,
            "commitmentType": c.commitment_type,
            "details": c.details,
            "solAmount": c.sol_amount,
            "txSignature": c.tx_signature,
            "status": c.status,
            "createdAt": c.created_at
        }
        for c in reversed(commits)
    ]