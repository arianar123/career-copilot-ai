from fastapi import APIRouter

from ..schemas.market import MarketRequest, MarketResponse
from ..services.market_service import get_market_snapshot

router = APIRouter(prefix="/market", tags=["market"])


@router.post("/snapshot", response_model=MarketResponse)
def market_snapshot(payload: MarketRequest) -> MarketResponse:
    return get_market_snapshot(payload)
