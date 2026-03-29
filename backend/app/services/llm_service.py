import uuid
from pathlib import Path

from ..schemas.analysis import AnalysisRequest, AnalysisResponse, Roadmap
from .ollama_client import generate_structured_output

PROMPT_DIR = Path(__file__).resolve().parents[3] / "shared" / "prompts"


def _load_prompt(name: str) -> str:
    return (PROMPT_DIR / name).read_text(encoding="utf-8")

def generate_analysis(payload: AnalysisRequest) -> AnalysisResponse:
    prompt = _load_prompt("resume_analysis.txt")
    parsed = generate_structured_output(
        system_prompt=prompt,
        user_payload={
            "target_role": payload.target_role,
            "resume_text": payload.resume_text,
            "job_description": payload.job_description,
        },
        schema_model=AnalysisResponse,
    )

    return AnalysisResponse(
        analysis_id=str(uuid.uuid4()),
        match_score=parsed["match_score"],
        missing_skills=parsed["missing_skills"],
        strengths=parsed["strengths"],
        weaknesses=parsed["weaknesses"],
        rewritten_bullets=parsed["rewritten_bullets"],
        roadmap=Roadmap(**parsed["roadmap"]),
    )
