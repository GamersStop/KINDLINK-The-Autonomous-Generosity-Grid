import os
import uuid
import base64
import httpx
from datetime import datetime
from google import genai
from google.genai import types
from sqlmodel import Session
from src.schemas.sentinel import SentinelAuditRequest, SentinelAuditResponse
from src.models.mission import Mission, MissionItem

class SentinelService:
    def __init__(self):
        self.gemini_client = genai.Client(api_key=os.getenv("GEMINI_API_KEY", ""))
        self.elevenlabs_key = os.getenv("ELEVENLABS_API_KEY", "")
        self.elevenlabs_voice_id = os.getenv("ELEVENLABS_VOICE_ID", "21m00Tcm4TlvDq8ikWAM")

    async def generate_speech(self, text: str) -> Optional[str]:
        """Synthesizes speech using ElevenLabs API and returns base64 MP3."""
        if not self.elevenlabs_key:
            return None
        url = f"https://api.elevenlabs.io/v1/text-to-speech/{self.elevenlabs_voice_id}"
        headers = {
            "Accept": "audio/mpeg",
            "Content-Type": "application/json",
            "xi-api-key": self.elevenlabs_key,
        }
        data = {
            "text": text,
            "model_id": "eleven_turbo_v2",
            "voice_settings": {"stability": 0.5, "similarity_boost": 0.8}
        }
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.post(url, headers=headers, json=data)
            if resp.status_code == 200:
                return base64.b64encode(resp.content).decode("utf-8")
        return None

    async def audit_and_broadcast(
        self, session: Session, payload: SentinelAuditRequest
    ) -> SentinelAuditResponse:
        short_id = f"SOS-{str(uuid.uuid4())[:4].upper()}"
        coords_str = (
            f"{payload.latitude:.4f}° N, {payload.longitude:.4f}° E"
            if payload.latitude and payload.longitude
            else "Live GPS Verified"
        )

        # 1. Prepare image parts for Gemini 3.5 Flash
        image_parts = []
        for b64 in payload.videoFramesBase64[:5]: # Send top 5 representative frames
            clean_b64 = b64.split(",")[-1]
            image_parts.append(
                types.Part.from_bytes(
                    data=base64.b64decode(clean_b64),
                    mime_type="image/jpeg",
                )
            )

        prompt = (
            "You are Sentinel, an autonomous disaster response AI. Analyze these camera frames from an active SOS situation.\n"
            "Return JSON matching this exact schema:\n"
            "{\n"
            '  "threatLevel": "EXTREME THREAT" | "HIGH THREAT" | "MODERATE",\n'
            '  "estimatedWaterDepth": "string (e.g. 3.5 - 4.0 Feet or None)",\n'
            '  "trappedVictimsCount": int,\n'
            '  "structuralEvaluation": "string (condition of building/ground)",\n'
            '  "environmentalHazards": ["list of immediate dangers"],\n'
            '  "spokenDirective": "Short, clear instructions for trapped victims telling them what safe action to take immediately."\n'
            "}"
        )

        # 2. Vision analysis via Gemini
        gemini_res = await self.gemini_client.aio.models.generate_content(
            model="gemini-3.5-flash",
            contents=[prompt, *image_parts],
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                temperature=0.1
            ),
        )

        import json
        parsed = json.loads(gemini_res.text)

        threat_level = parsed.get("threatLevel", "EXTREME THREAT")
        water_depth = parsed.get("estimatedWaterDepth", "Submerged Ground")
        victims_count = int(parsed.get("trappedVictimsCount", 1))
        structural_eval = parsed.get("structuralEvaluation", "Critical stability risk")
        hazards = parsed.get("environmentalHazards", ["Rising floodwaters"])
        directive = parsed.get(
            "spokenDirective",
            "Emergency dispatches are on the way. Move to high ground immediately."
        )

        # 3. Create high-urgency Mission in PostgreSQL
        timestamp = datetime.utcnow().isoformat() + "Z"
        db_mission = Mission(
            mission_id=short_id,
            incident_zone=f"Sentinel SOS Node ({coords_str})",
            extracted_coordinates=coords_str,
            reported_timestamp="Just now",
            affected_count=victims_count,
            summary=f"Automated Sentinel SOS. {structural_eval}. Hazards: {', '.join(hazards)}",
            priority_score=100,  # Max priority for SOS
            status="URGENT_DISPATCH",
            escrow_allocated_sol=1.5,
            broadcast_timestamp=timestamp,
        )

        # Add critical items based on vision analysis
        db_items = [
            MissionItem(
                item_key=f"{short_id}-rescue",
                category="logistics",
                title="Immediate Evacuation Shuttle / Boat",
                target_qty=1,
                raised_qty=0,
                unit="Shuttle",
                urgency="CRITICAL",
                mission=db_mission
            ),
            MissionItem(
                item_key=f"{short_id}-medical",
                category="medical",
                title="Emergency Trauma / First Aid Kits",
                target_qty=victims_count,
                raised_qty=0,
                unit="Kits",
                urgency="CRITICAL",
                mission=db_mission
            )
        ]

        session.add(db_mission)
        session.add_all(db_items)
        session.commit()

        # 4. Generate audio directives via ElevenLabs
        audio_b64 = await self.generate_speech(f"{directive} We will dispatch help as soon as possible.")

        return SentinelAuditResponse(
            missionId=short_id,
            threatLevel=threat_level,
            estimatedWaterDepth=water_depth,
            trappedVictimsCount=victims_count,
            structuralEvaluation=structural_eval,
            environmentalHazards=hazards,
            spokenDirective=directive,
            audioBase64=audio_b64,
        )

sentinel_service = SentinelService()