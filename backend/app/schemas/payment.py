from datetime import date, datetime
from decimal import Decimal

from pydantic import BaseModel, Field


class PaymentCreate(BaseModel):
    loan_id: int
    amount: Decimal = Field(gt=0, max_digits=12, decimal_places=2)
    payment_date: date
    payment_method: str = Field(min_length=1, max_length=50)
    reference_number: str | None = Field(default=None, max_length=100)
    notes: str | None = None


class PaymentResponse(BaseModel):
    id: int
    payment_number: str
    loan_id: int
    amount: Decimal
    payment_date: date
    payment_method: str
    reference_number: str | None
    notes: str | None
    balance_after: Decimal
    created_at: datetime
    updated_at: datetime
