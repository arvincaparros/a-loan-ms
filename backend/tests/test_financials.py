from datetime import date
from decimal import Decimal

from app.models.loan import LoanStatus
from app.services import financials as f


def test_calculate_interest_amount():
    assert f.calculate_interest_amount(Decimal("30000.00"), Decimal("5.00")) == Decimal("1500.00")


def test_calculate_total_payable():
    assert f.calculate_total_payable(Decimal("30000.00"), Decimal("5.00")) == Decimal("31500.00")


def test_calculate_total_paid_sums_and_rounds():
    assert f.calculate_total_paid([Decimal("4500"), Decimal("4500"), Decimal("4500")]) == Decimal("13500.00")


def test_calculate_outstanding_balance_never_negative():
    assert f.calculate_outstanding_balance(Decimal("100.00"), Decimal("150.00")) == Decimal("0.00")


def test_calculate_outstanding_balance_normal():
    assert f.calculate_outstanding_balance(Decimal("31500.00"), Decimal("13500.00")) == Decimal("18000.00")


def test_calculate_payment_progress():
    assert f.calculate_payment_progress(Decimal("13500.00"), Decimal("31500.00")) == Decimal("42.86")


def test_calculate_payment_progress_zero_payable_is_zero_not_divide_error():
    assert f.calculate_payment_progress(Decimal("0.00"), Decimal("0.00")) == Decimal("0.00")


def test_status_active_when_balance_remains_and_not_past_due():
    status = f.derive_loan_status(Decimal("18000.00"), date(2026, 12, 1), date(2026, 10, 1))
    assert status == LoanStatus.ACTIVE


def test_status_overdue_when_balance_remains_past_due_date():
    status = f.derive_loan_status(Decimal("5000.00"), date(2026, 9, 28), date(2026, 10, 1))
    assert status == LoanStatus.OVERDUE


def test_status_paid_when_balance_zero_even_if_past_due_date():
    status = f.derive_loan_status(Decimal("0.00"), date(2026, 8, 30), date(2026, 10, 1))
    assert status == LoanStatus.PAID
