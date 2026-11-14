from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.payment import PaymentCreate, PaymentResponse
from app.services import payments as payment_service

router = APIRouter(prefix="/payments", tags=["payments"])


@router.get("", response_model=list[PaymentResponse])
def list_payments(db: Session = Depends(get_db)) -> list[PaymentResponse]:
    return [payment_service.build_payment_response(db, payment) for payment in payment_service.list_payments(db)]


@router.get("/{payment_id}", response_model=PaymentResponse)
def get_payment(payment_id: int, db: Session = Depends(get_db)) -> PaymentResponse:
    payment = payment_service.get_payment_or_404(db, payment_id)
    return payment_service.build_payment_response(db, payment)


@router.post("", response_model=PaymentResponse, status_code=status.HTTP_201_CREATED)
def create_payment(payload: PaymentCreate, db: Session = Depends(get_db)) -> PaymentResponse:
    payment = payment_service.create_payment(db, payload)
    return payment_service.build_payment_response(db, payment)
