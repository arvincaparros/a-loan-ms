import enum
from datetime import date, datetime
from decimal import Decimal
from typing import TYPE_CHECKING

from sqlalchemy import Date, DateTime, ForeignKey, Numeric, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base

if TYPE_CHECKING:
    from app.models.borrower import Borrower
    from app.models.payment import Payment


class LoanStatus(str, enum.Enum):
    """Derived, not persisted - see app/services/financials.py.

    "Overdue" depends on the wall-clock current date, not just loan state, so
    a stored column would go stale the instant time passes without any write
    happening. Computing it on read is the only way to keep a single source
    of truth.
    """

    ACTIVE = "Active"
    PAID = "Paid"
    OVERDUE = "Overdue"


class Loan(Base):
    __tablename__ = "loans"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    loan_number: Mapped[str] = mapped_column(String(50), nullable=False, unique=True, index=True)
    borrower_id: Mapped[int] = mapped_column(ForeignKey("borrowers.id"), nullable=False, index=True)

    # Immutable loan terms set at origination. total_payable and interest_amount
    # are intentionally NOT stored here - both are pure functions of
    # principal_amount and interest_rate with no independent business meaning
    # yet, so persisting them would just be a redundant, driftable copy of
    # data already captured by these two columns. They are computed in
    # app/services/financials.py.
    principal_amount: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    interest_rate: Mapped[Decimal] = mapped_column(Numeric(5, 2), nullable=False)

    start_date: Mapped[date] = mapped_column(Date, nullable=False)
    due_date: Mapped[date] = mapped_column(Date, nullable=False)

    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now(), onupdate=func.now(), nullable=False
    )

    borrower: Mapped["Borrower"] = relationship(back_populates="loans")
    payments: Mapped[list["Payment"]] = relationship(back_populates="loan")
