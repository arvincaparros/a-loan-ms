from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.loan import LoanCreate, LoanResponse
from app.services import loans as loan_service

router = APIRouter(prefix="/loans", tags=["loans"])


@router.get("", response_model=list[LoanResponse])
def list_loans(db: Session = Depends(get_db)) -> list[LoanResponse]:
    return [loan_service.build_loan_response(db, loan) for loan in loan_service.list_loans(db)]


@router.get("/{loan_id}", response_model=LoanResponse)
def get_loan(loan_id: int, db: Session = Depends(get_db)) -> LoanResponse:
    loan = loan_service.get_loan_or_404(db, loan_id)
    return loan_service.build_loan_response(db, loan)


@router.post("", response_model=LoanResponse, status_code=status.HTTP_201_CREATED)
def create_loan(payload: LoanCreate, db: Session = Depends(get_db)) -> LoanResponse:
    loan = loan_service.create_loan(db, payload)
    return loan_service.build_loan_response(db, loan)
