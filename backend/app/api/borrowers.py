from fastapi import APIRouter, Depends, Query
from fastapi import status as http_status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.loan import LoanStatus
from app.schemas.borrower import BorrowerCreate, BorrowerListResponse, BorrowerResponse
from app.services import borrowers as borrower_service

router = APIRouter(prefix="/borrowers", tags=["borrowers"])


@router.get("", response_model=BorrowerListResponse)
def list_borrowers(
    search: str | None = Query(None),
    status_filter: LoanStatus | None = Query(None, alias="status"),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
) -> BorrowerListResponse:
    return borrower_service.list_borrowers(
        db, search=search, status_filter=status_filter, page=page, page_size=page_size
    )


@router.get("/{borrower_id}", response_model=BorrowerResponse)
def get_borrower(borrower_id: int, db: Session = Depends(get_db)) -> BorrowerResponse:
    borrower = borrower_service.get_borrower_or_404(db, borrower_id)
    return borrower_service.build_borrower_response_for(db, borrower)


@router.post("", response_model=BorrowerResponse, status_code=http_status.HTTP_201_CREATED)
def create_borrower(payload: BorrowerCreate, db: Session = Depends(get_db)) -> BorrowerResponse:
    borrower = borrower_service.create_borrower(db, payload)
    return borrower_service.build_borrower_response_for(db, borrower)
