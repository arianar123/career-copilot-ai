from fastapi import APIRouter, HTTPException

from ..schemas.market import MarketRequest, MarketResponse
from ..services.market_service import get_market_snapshot
from ..services.service_errors import ExternalServiceError, ServiceConfigurationError

router = APIRouter(prefix="/market", tags=["market"])


@router.post("/snapshot", response_model=MarketResponse)
def market_snapshot(payload: MarketRequest) -> MarketResponse:
    try:
        return get_market_snapshot(payload)
    except ServiceConfigurationError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    except ExternalServiceError as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc
