from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.borrower import BorrowerCreate, BorrowerResponse
from app.services import borrowers as borrower_service

router = APIRouter(prefix="/borrowers", tags=["borrowers"])


@router.get("", response_model=list[BorrowerResponse])
def list_borrowers(db: Session = Depends(get_db)) -> list[BorrowerResponse]:
    return borrower_service.list_borrowers(db)


@router.get("/{borrower_id}", response_model=BorrowerResponse)
def get_borrower(borrower_id: int, db: Session = Depends(get_db)) -> BorrowerResponse:
    return borrower_service.get_borrower_or_404(db, borrower_id)


@router.post("", response_model=BorrowerResponse, status_code=status.HTTP_201_CREATED)
def create_borrower(payload: BorrowerCreate, db: Session = Depends(get_db)) -> BorrowerResponse:
    return borrower_service.create_borrower(db, payload)
