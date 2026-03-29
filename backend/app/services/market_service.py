from pathlib import Path

from ..schemas.market import MarketRequest, MarketResponse
from .ollama_client import generate_structured_output

PROMPT_DIR = Path(__file__).resolve().parents[3] / "shared" / "prompts"


def _load_prompt(name: str) -> str:
    return (PROMPT_DIR / name).read_text(encoding="utf-8")

def get_market_snapshot(payload: MarketRequest) -> MarketResponse:
    prompt = _load_prompt("market_snapshot.txt")
    parsed = generate_structured_output(
        system_prompt=prompt,
        user_payload=payload.model_dump(),
        schema_model=MarketResponse,
    )
    return MarketResponse(
        target_role=payload.target_role,
        region=payload.region,
        demand_level=parsed["demand_level"],
        salary_range=parsed["salary_range"],
        top_skills=parsed["top_skills"],
        hiring_signals=parsed["hiring_signals"],
        recommended_focus=parsed["recommended_focus"],
    )
