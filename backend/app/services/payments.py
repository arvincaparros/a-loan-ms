from decimal import Decimal

from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.loan import Loan
from app.models.payment import Payment
from app.schemas.payment import PaymentCreate, PaymentResponse
from app.services import financials
from app.services.loans import sum_payments_for_loan
from app.services.numbering import generate_business_number


def _balance_after_for_payment(db: Session, loan: Loan, payment: Payment) -> Decimal:
    """Outstanding balance immediately after this payment, in chronological order.

    Ordered by (payment_date, id) rather than just insertion order, so the
    figure reflects the loan's running balance history even if payments were
    recorded out of date order.
    """
    total_payable = financials.calculate_total_payable(loan.principal_amount, loan.interest_rate)
    all_payments = list(db.execute(select(Payment).where(Payment.loan_id == loan.id)).scalars().all())
    ordered = sorted(all_payments, key=lambda p: (p.payment_date, p.id))

    running_paid = Decimal("0.00")
    for p in ordered:
        running_paid = financials.round_money(running_paid + p.amount)
        if p.id == payment.id:
            break

    return financials.calculate_outstanding_balance(total_payable, running_paid)


def build_payment_response(db: Session, payment: Payment, *, loan: Loan | None = None) -> PaymentResponse:
    loan = loan or db.get(Loan, payment.loan_id)
    if loan is None:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Associated loan not found")

    balance_after = _balance_after_for_payment(db, loan, payment)

    return PaymentResponse(
        id=payment.id,
        payment_number=payment.payment_number,
        loan_id=payment.loan_id,
        amount=payment.amount,
        payment_date=payment.payment_date,
        payment_method=payment.payment_method,
        reference_number=payment.reference_number,
        notes=payment.notes,
        balance_after=balance_after,
        created_at=payment.created_at,
        updated_at=payment.updated_at,
    )


def create_payment(db: Session, payload: PaymentCreate) -> Payment:
    loan = db.get(Loan, payload.loan_id)
    if loan is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Loan not found")

    total_paid_so_far = sum_payments_for_loan(db, loan.id)
    total_payable = financials.calculate_total_payable(loan.principal_amount, loan.interest_rate)
    outstanding_balance = financials.calculate_outstanding_balance(total_payable, total_paid_so_far)

    if outstanding_balance <= Decimal("0.00"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This loan is already fully paid; no further payments can be recorded.",
        )

    if payload.amount > outstanding_balance:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                f"Payment amount {payload.amount} exceeds the outstanding balance "
                f"of {outstanding_balance}."
            ),
        )

    payment_number = generate_business_number(
        db, entity_type="payment", prefix="PAY", year=payload.payment_date.year
    )

    payment = Payment(
        payment_number=payment_number,
        loan_id=payload.loan_id,
        amount=payload.amount,
        payment_date=payload.payment_date,
        payment_method=payload.payment_method,
        reference_number=payload.reference_number,
        notes=payload.notes,
    )
    db.add(payment)
    db.commit()
    db.refresh(payment)
    return payment


def get_payment_or_404(db: Session, payment_id: int) -> Payment:
    payment = db.get(Payment, payment_id)
    if payment is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Payment not found")
    return payment


def list_payments(db: Session) -> list[Payment]:
    return list(db.execute(select(Payment)).scalars().all())
