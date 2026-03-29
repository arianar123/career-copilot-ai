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
from .service_errors import ExternalServiceError, ServiceConfigurationError


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


def generate_questions(payload: InterviewStartRequest) -> InterviewStartResponse:
    api_key = os.getenv("OPENAI_API_KEY")
    if _should_use_mock(api_key):
        raise ServiceConfigurationError(
            "OPENAI_API_KEY is not configured. Add a valid key to enable live interview generation."
        )

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
    except AuthenticationError as exc:
        raise ServiceConfigurationError(
            "The configured OpenAI API key was rejected."
        ) from exc
    except (APIError, ValueError, KeyError, json.JSONDecodeError) as exc:
        raise ExternalServiceError(
            "CareerCopilot could not generate interview questions right now."
        ) from exc


def generate_feedback(payload: InterviewFeedbackRequest) -> InterviewFeedbackResponse:
    api_key = os.getenv("OPENAI_API_KEY")
    if _should_use_mock(api_key):
        raise ServiceConfigurationError(
            "OPENAI_API_KEY is not configured. Add a valid key to enable live interview feedback."
        )

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
    except AuthenticationError as exc:
        raise ServiceConfigurationError(
            "The configured OpenAI API key was rejected."
        ) from exc
    except (APIError, ValueError, KeyError, json.JSONDecodeError) as exc:
        raise ExternalServiceError(
            "CareerCopilot could not generate interview feedback right now."
        ) from exc
