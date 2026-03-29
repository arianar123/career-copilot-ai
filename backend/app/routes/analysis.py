from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..db.database import get_db
from ..repositories.analysis_repository import (
    create_analysis,
    get_analysis_by_id,
    hydrate_analysis,
    list_recent_analyses,
)
from ..schemas.analysis import AnalysisRequest, AnalysisResponse, AnalysisSummary
from ..services.llm_service import generate_analysis

router = APIRouter(prefix="/analysis", tags=["analysis"])


@router.post("/run", response_model=AnalysisResponse)
def run_analysis(
    payload: AnalysisRequest, db: Session = Depends(get_db)
) -> AnalysisResponse:
    response = generate_analysis(payload)
    return create_analysis(db, payload, response)


@router.get("", response_model=list[AnalysisSummary])
def fetch_recent_analyses(db: Session = Depends(get_db)) -> list[AnalysisSummary]:
    return list_recent_analyses(db)


@router.get("/{analysis_id}", response_model=AnalysisResponse)
def fetch_analysis(
    analysis_id: str, db: Session = Depends(get_db)
) -> AnalysisResponse:
    record = get_analysis_by_id(db, analysis_id)
    if record is None:
        raise HTTPException(status_code=404, detail="Analysis not found")
    return hydrate_analysis(record)
