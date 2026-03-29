from fastapi import APIRouter, HTTPException

from ..schemas.interview import (
    InterviewFeedbackRequest,
    InterviewFeedbackResponse,
    InterviewStartRequest,
    InterviewStartResponse,
)
from ..services.interview_service import generate_feedback, generate_questions
from ..services.service_errors import ExternalServiceError, ServiceConfigurationError

router = APIRouter(prefix="/interview", tags=["interview"])


@router.post("/start", response_model=InterviewStartResponse)
def start_interview(payload: InterviewStartRequest) -> InterviewStartResponse:
    try:
        return generate_questions(payload)
    except ServiceConfigurationError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    except ExternalServiceError as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc


@router.post("/feedback", response_model=InterviewFeedbackResponse)
def interview_feedback(payload: InterviewFeedbackRequest) -> InterviewFeedbackResponse:
    try:
        return generate_feedback(payload)
    except ServiceConfigurationError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    except ExternalServiceError as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc
