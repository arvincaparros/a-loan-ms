from datetime import date, datetime
from decimal import Decimal

from pydantic import BaseModel, Field, model_validator

from app.models.loan import LoanStatus


class LoanCreate(BaseModel):
    borrower_id: int
    principal_amount: Decimal = Field(gt=0, max_digits=12, decimal_places=2)
    interest_rate: Decimal = Field(ge=0, max_digits=5, decimal_places=2)
    start_date: date
    due_date: date

    @model_validator(mode="after")
    def check_due_date_after_start_date(self) -> "LoanCreate":
        if self.due_date < self.start_date:
            raise ValueError("due_date must be on or after start_date")
        return self


class LoanResponse(BaseModel):
    id: int
    loan_number: str
    borrower_id: int
    principal_amount: Decimal
    interest_rate: Decimal
    interest_amount: Decimal
    total_payable: Decimal
    total_paid: Decimal
    outstanding_balance: Decimal
    payment_progress: Decimal
    start_date: date
    due_date: date
    status: LoanStatus
    created_at: datetime
    updated_at: datetime
