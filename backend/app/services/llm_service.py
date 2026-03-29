import json
import os
import uuid
from pathlib import Path

from openai import OpenAI
from openai import APIError, AuthenticationError

from ..schemas.analysis import AnalysisRequest, AnalysisResponse, Roadmap

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


def _mock_analysis(payload: AnalysisRequest) -> AnalysisResponse:
    return AnalysisResponse(
        analysis_id=str(uuid.uuid4()),
        match_score=78,
        missing_skills=["SQL optimization", "Power BI", "A/B testing"],
        strengths=["Python", "data cleaning", "project ownership"],
        weaknesses=[
            "Resume bullets are descriptive instead of impact-oriented",
            "Technical tools are not grouped clearly by category",
            "Experience section lacks quantified results",
        ],
        rewritten_bullets=[
            "Built a Python workflow that cleaned and transformed 50,000+ records, cutting manual reporting time by 40%.",
            "Created a dashboard-ready analytics dataset with SQL and spreadsheet automation to support faster weekly business reviews.",
        ],
        roadmap=Roadmap(
            thirty_days=[
                f"Rewrite your resume around measurable outcomes for {payload.target_role}.",
                "Complete one SQL practice project with joins, aggregations, and query tuning.",
                "Publish an improved LinkedIn summary aligned to the target role.",
            ],
            sixty_days=[
                "Build a portfolio project using the top two missing skills from the report.",
                "Apply to 15 targeted internships and track responses in a spreadsheet or Notion board.",
                "Practice role-specific behavioral and technical interview questions weekly.",
            ],
            ninety_days=[
                "Ship a polished project demo with metrics, screenshots, and GitHub documentation.",
                "Ask for mock interviews from a mentor, classmate, or career center.",
                "Refine applications based on recruiter feedback and re-run the analysis on stronger job postings.",
            ],
        ),
    )


def generate_analysis(payload: AnalysisRequest) -> AnalysisResponse:
    api_key = os.getenv("OPENAI_API_KEY")
    if _should_use_mock(api_key):
        return _mock_analysis(payload)

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
    except (AuthenticationError, APIError, ValueError, KeyError, json.JSONDecodeError):
        return _mock_analysis(payload)
