from datetime import date
from decimal import Decimal

from fastapi import HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.borrower import Borrower
from app.models.loan import Loan
from app.models.payment import Payment
from app.schemas.loan import LoanCreate, LoanResponse
from app.services import financials
from app.services.numbering import generate_business_number


def sum_payments_for_loan(db: Session, loan_id: int) -> Decimal:
    total = db.execute(
        select(func.coalesce(func.sum(Payment.amount), 0)).where(Payment.loan_id == loan_id)
    ).scalar_one()
    return financials.round_money(Decimal(total))


def build_loan_response(db: Session, loan: Loan, *, as_of: date | None = None) -> LoanResponse:
    as_of = as_of or date.today()
    total_paid = sum_payments_for_loan(db, loan.id)
    total_payable = financials.calculate_total_payable(loan.principal_amount, loan.interest_rate)
    interest_amount = financials.calculate_interest_amount(loan.principal_amount, loan.interest_rate)
    outstanding_balance = financials.calculate_outstanding_balance(total_payable, total_paid)
    payment_progress = financials.calculate_payment_progress(total_paid, total_payable)
    loan_status = financials.derive_loan_status(outstanding_balance, loan.due_date, as_of)

    return LoanResponse(
        id=loan.id,
        loan_number=loan.loan_number,
        borrower_id=loan.borrower_id,
        principal_amount=loan.principal_amount,
        interest_rate=loan.interest_rate,
        interest_amount=interest_amount,
        total_payable=total_payable,
        total_paid=total_paid,
        outstanding_balance=outstanding_balance,
        payment_progress=payment_progress,
        start_date=loan.start_date,
        due_date=loan.due_date,
        status=loan_status,
        created_at=loan.created_at,
        updated_at=loan.updated_at,
    )


def create_loan(db: Session, payload: LoanCreate) -> Loan:
    borrower = db.get(Borrower, payload.borrower_id)
    if borrower is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Borrower not found")

    loan_number = generate_business_number(
        db, entity_type="loan", prefix="LN", year=payload.start_date.year
    )

    loan = Loan(
        loan_number=loan_number,
        borrower_id=payload.borrower_id,
        principal_amount=payload.principal_amount,
        interest_rate=payload.interest_rate,
        start_date=payload.start_date,
        due_date=payload.due_date,
    )
    db.add(loan)
    db.commit()
    db.refresh(loan)
    return loan


def get_loan_or_404(db: Session, loan_id: int) -> Loan:
    loan = db.get(Loan, loan_id)
    if loan is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Loan not found")
    return loan


def list_loans(db: Session) -> list[Loan]:
    return list(db.execute(select(Loan)).scalars().all())
