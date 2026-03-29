import json
import os
from pathlib import Path

from openai import APIError, AuthenticationError, OpenAI

from ..schemas.market import MarketRequest, MarketResponse
from .service_errors import ExternalServiceError, ServiceConfigurationError

PROMPT_DIR = Path(__file__).resolve().parents[3] / "shared" / "prompts"


def _load_prompt(name: str) -> str:
    return (PROMPT_DIR / name).read_text(encoding="utf-8")


def _is_placeholder_key(api_key: str | None) -> bool:
    if not api_key:
        return True

    normalized = api_key.strip().lower()
    return normalized in {
        "",
        "your-api-key-here",
        "your_api_key_here",
        "sk-your-api-key-here",
    } or "your-api" in normalized


def get_market_snapshot(payload: MarketRequest) -> MarketResponse:
    api_key = os.getenv("OPENAI_API_KEY")
    if _is_placeholder_key(api_key):
        raise ServiceConfigurationError(
            "OPENAI_API_KEY is not configured. Add a valid key to enable live market intelligence."
        )

    client = OpenAI(api_key=api_key)
    prompt = _load_prompt("market_snapshot.txt")

    try:
        response = client.responses.create(
            model="gpt-4.1-mini",
            input=[
                {
                    "role": "system",
                    "content": [{"type": "input_text", "text": prompt}],
                },
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "input_text",
                            "text": json.dumps(payload.model_dump()),
                        }
                    ],
                },
            ],
        )
        parsed = json.loads(response.output_text.strip())
        return MarketResponse(
            target_role=payload.target_role,
            region=payload.region,
            demand_level=parsed["demand_level"],
            salary_range=parsed["salary_range"],
            top_skills=parsed["top_skills"],
            hiring_signals=parsed["hiring_signals"],
            recommended_focus=parsed["recommended_focus"],
        )
    except AuthenticationError as exc:
        raise ServiceConfigurationError(
            "The configured OpenAI API key was rejected."
        ) from exc
    except (APIError, ValueError, KeyError, json.JSONDecodeError) as exc:
        raise ExternalServiceError(
            "CareerCopilot could not generate market intelligence right now."
        ) from exc
