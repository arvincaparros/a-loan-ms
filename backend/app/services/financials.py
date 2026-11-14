"""Core financial calculations for the simple-interest loan model.

Everything here operates on `decimal.Decimal` - money is never represented as
a binary float. All monetary results are rounded to two decimal places using
ROUND_HALF_UP, the conventional rounding mode for currency.
"""

from datetime import date
from decimal import ROUND_HALF_UP, Decimal

from app.models.loan import LoanStatus

TWO_PLACES = Decimal("0.01")
ZERO = Decimal("0.00")
HUNDRED = Decimal("100")


def round_money(value: Decimal) -> Decimal:
    return value.quantize(TWO_PLACES, rounding=ROUND_HALF_UP)


def calculate_interest_amount(principal_amount: Decimal, interest_rate: Decimal) -> Decimal:
    return round_money(principal_amount * (interest_rate / HUNDRED))


def calculate_total_payable(principal_amount: Decimal, interest_rate: Decimal) -> Decimal:
    interest_amount = calculate_interest_amount(principal_amount, interest_rate)
    return round_money(principal_amount + interest_amount)


def calculate_total_paid(payment_amounts: list[Decimal]) -> Decimal:
    return round_money(sum(payment_amounts, ZERO))


def calculate_outstanding_balance(total_payable: Decimal, total_paid: Decimal) -> Decimal:
    return max(round_money(total_payable - total_paid), ZERO)


def calculate_payment_progress(total_paid: Decimal, total_payable: Decimal) -> Decimal:
    if total_payable <= ZERO:
        return ZERO
    return round_money((total_paid / total_payable) * HUNDRED)


def derive_loan_status(outstanding_balance: Decimal, due_date: date, as_of: date) -> LoanStatus:
    """Paid when nothing is owed; Overdue when something is owed past the due
    date; Active otherwise. Balance-zero always wins over the due date, so a
    loan paid off after its due date is still reported as Paid, not Overdue.
    """
    if outstanding_balance <= ZERO:
        return LoanStatus.PAID
    if due_date < as_of:
        return LoanStatus.OVERDUE
    return LoanStatus.ACTIVE
