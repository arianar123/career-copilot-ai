import json
import os
import uuid

from openai import OpenAI
from openai import APIError, AuthenticationError

from ..schemas.interview import (
    InterviewFeedbackRequest,
    InterviewFeedbackResponse,
    InterviewQuestion,
    InterviewStartRequest,
    InterviewStartResponse,
)


def _should_use_mock(api_key: str | None) -> bool:
    if not api_key:
        return True

    normalized_key = api_key.strip().lower()
    return normalized_key in {
        "",
        "your-api-key-here",
        "your_api_key_here",
        "sk-your-api-key-here",
    } or "your-api" in normalized_key


def _mock_questions(payload: InterviewStartRequest) -> InterviewStartResponse:
    role = payload.target_role
    return InterviewStartResponse(
        session_id=str(uuid.uuid4()),
        questions=[
            InterviewQuestion(
                question=f"Tell me about yourself and why you are interested in this {role} role.",
                focus_area="storytelling",
            ),
            InterviewQuestion(
                question=f"Describe a project where you used data or software skills relevant to a {role}.",
                focus_area="technical experience",
            ),
            InterviewQuestion(
                question="Tell me about a time you faced a challenge, and how you handled it.",
                focus_area="behavioral",
            ),
        ],
    )


def _mock_feedback(payload: InterviewFeedbackRequest) -> InterviewFeedbackResponse:
    answer_length = len(payload.answer.split())
    confidence = min(92, max(58, answer_length))
    clarity = 74 if answer_length > 35 else 63
    technical = 78 if any(
        keyword in payload.answer.lower()
        for keyword in ("python", "sql", "api", "dashboard", "analysis", "project")
    ) else 61
    overall = round((confidence + clarity + technical) / 3)

    return InterviewFeedbackResponse(
        overall_score=overall,
        confidence_score=confidence,
        clarity_score=clarity,
        technical_score=technical,
        strengths=[
            "Your answer sounds engaged and role-focused.",
            "You provide enough detail to show ownership of your work.",
            "The response connects your experience back to the target position.",
        ],
        improvements=[
            "Lead with your strongest example sooner instead of circling into it.",
            "Add one measurable result to make the impact easier to trust.",
            "End with a tighter final sentence that links your experience to the role.",
        ],
        sample_better_answer=(
            "I am interested in this role because it combines analysis, problem-solving, and clear communication. "
            "In a recent project, I used Python and SQL to clean a large dataset and build a reporting workflow "
            "that reduced manual work and made insights easier to share with my team. That experience showed me "
            "that I enjoy turning messy information into practical decisions, which is exactly why this position stands out to me."
        ),
    )


def generate_questions(payload: InterviewStartRequest) -> InterviewStartResponse:
    api_key = os.getenv("OPENAI_API_KEY")
    if _should_use_mock(api_key):
      return _mock_questions(payload)

    client = OpenAI(api_key=api_key)
    prompt = (
        "You are an interview coach. Return strict JSON with shape "
        '{"questions":[{"question":"","focus_area":""},{"question":"","focus_area":""},{"question":"","focus_area":""}]}. '
        "Generate 3 tailored mock interview questions based on the target role and resume."
    )

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
        return InterviewStartResponse(
            session_id=str(uuid.uuid4()),
            questions=[InterviewQuestion(**question) for question in parsed["questions"]],
        )
    except (AuthenticationError, APIError, ValueError, KeyError, json.JSONDecodeError):
        return _mock_questions(payload)


def generate_feedback(payload: InterviewFeedbackRequest) -> InterviewFeedbackResponse:
    api_key = os.getenv("OPENAI_API_KEY")
    if _should_use_mock(api_key):
        return _mock_feedback(payload)

    client = OpenAI(api_key=api_key)
    prompt = (
        "You are an interview coach. Return strict JSON with shape "
        '{"overall_score":0,"confidence_score":0,"clarity_score":0,"technical_score":0,'
        '"strengths":[],"improvements":[],"sample_better_answer":""}. '
        "Scores must be integers from 0 to 100. Be constructive and specific."
    )

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
        return InterviewFeedbackResponse(**parsed)
    except (AuthenticationError, APIError, ValueError, KeyError, json.JSONDecodeError):
        return _mock_feedback(payload)
