import json
import os
import uuid
from pathlib import Path

from openai import OpenAI
from openai import APIError, AuthenticationError

from ..schemas.analysis import AnalysisRequest, AnalysisResponse, Roadmap
from .service_errors import ExternalServiceError, ServiceConfigurationError

PROMPT_DIR = Path(__file__).resolve().parents[3] / "shared" / "prompts"


def _load_prompt(name: str) -> str:
    return (PROMPT_DIR / name).read_text(encoding="utf-8")


def _should_use_mock(api_key: str | None) -> bool:
    if not api_key:
        return True

    normalized_key = api_key.strip().lower()
    placeholder_fragments = {
        "",
        "your-api-key-here",
        "your_api_key_here",
        "sk-your-api-key-here",
    }
    return normalized_key in placeholder_fragments or "your-api" in normalized_key


def generate_analysis(payload: AnalysisRequest) -> AnalysisResponse:
    api_key = os.getenv("OPENAI_API_KEY")
    if _should_use_mock(api_key):
        raise ServiceConfigurationError(
            "OPENAI_API_KEY is not configured. Add a valid key to enable live resume analysis."
        )

    client = OpenAI(api_key=api_key)
    prompt = _load_prompt("resume_analysis.txt")

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
                            "text": json.dumps(
                                {
                                    "target_role": payload.target_role,
                                    "resume_text": payload.resume_text,
                                    "job_description": payload.job_description,
                                }
                            ),
                        }
                    ],
                },
            ],
        )

        raw_output = response.output_text.strip()
        parsed = json.loads(raw_output)

        return AnalysisResponse(
            analysis_id=str(uuid.uuid4()),
            match_score=parsed["match_score"],
            missing_skills=parsed["missing_skills"],
            strengths=parsed["strengths"],
            weaknesses=parsed["weaknesses"],
            rewritten_bullets=parsed["rewritten_bullets"],
            roadmap=Roadmap(**parsed["roadmap"]),
        )
    except AuthenticationError as exc:
        raise ServiceConfigurationError(
            "The configured OpenAI API key was rejected."
        ) from exc
    except (APIError, ValueError, KeyError, json.JSONDecodeError) as exc:
        raise ExternalServiceError(
            "CareerCopilot could not generate a valid analysis response right now."
        ) from exc
