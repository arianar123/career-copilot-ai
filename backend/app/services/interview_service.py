import uuid

from ..schemas.interview import (
    InterviewFeedbackRequest,
    InterviewFeedbackResponse,
    InterviewQuestion,
    InterviewStartRequest,
    InterviewStartResponse,
)
from .ollama_client import generate_structured_output


def generate_questions(payload: InterviewStartRequest) -> InterviewStartResponse:
    prompt = (
        "You are an interview coach. Return strict JSON with shape "
        '{"questions":[{"question":"","focus_area":""},{"question":"","focus_area":""},{"question":"","focus_area":""}]}. '
        "Generate 3 tailored mock interview questions based on the target role and resume."
    )
    parsed = generate_structured_output(
        system_prompt=prompt,
        user_payload=payload.model_dump(),
        schema_model=InterviewStartResponse,
    )
    return InterviewStartResponse(
        session_id=str(uuid.uuid4()),
        questions=[InterviewQuestion(**question) for question in parsed["questions"]],
    )


def generate_feedback(payload: InterviewFeedbackRequest) -> InterviewFeedbackResponse:
    prompt = (
        "You are an interview coach. Return strict JSON with shape "
        '{"overall_score":0,"confidence_score":0,"clarity_score":0,"technical_score":0,'
        '"strengths":[],"improvements":[],"sample_better_answer":""}. '
        "Scores must be integers from 0 to 100. Be constructive and specific."
    )
    parsed = generate_structured_output(
        system_prompt=prompt,
        user_payload=payload.model_dump(),
        schema_model=InterviewFeedbackResponse,
    )
    return InterviewFeedbackResponse(**parsed)
