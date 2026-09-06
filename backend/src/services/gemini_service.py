import os
from google import genai
from google.genai import types
from src.schemas.decomposition import DecompositionResponse

# In src/services/gemini_service.py
class GeminiService:
    def __init__(self):
        self.client = genai.Client(api_key=os.getenv("GEMINI_API_KEY", ""))

    async def decompose_text(self, raw_plea: str) -> DecompositionResponse:
        # Use client.aio to avoid thread blocking
        response = await self.client.aio.models.generate_content(
            model="gemini-3.5-flash",
            contents=f"Analyze this field distress report:\n{raw_plea}",
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=DecompositionResponse,
                temperature=0.1,
            ),
        )
        return response.parsed

# Export a single reusable instance
gemini_service = GeminiService()