from fastapi import APIRouter

from ..schemas.interview import (
    InterviewFeedbackRequest,
    InterviewFeedbackResponse,
    InterviewStartRequest,
    InterviewStartResponse,
)
from ..services.interview_service import generate_feedback, generate_questions

router = APIRouter(prefix="/interview", tags=["interview"])


@router.post("/start", response_model=InterviewStartResponse)
def start_interview(payload: InterviewStartRequest) -> InterviewStartResponse:
    return generate_questions(payload)


@router.post("/feedback", response_model=InterviewFeedbackResponse)
def interview_feedback(payload: InterviewFeedbackRequest) -> InterviewFeedbackResponse:
    return generate_feedback(payload)
