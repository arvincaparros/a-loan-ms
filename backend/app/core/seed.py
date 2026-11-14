"""Development-only seed data.

Mirrors the frontend's existing mock borrowers/loans/payments closely enough
that the frontend can later be pointed at this API with minimal surprise.
Never invoked automatically (not wired into app startup) - run explicitly:

    .venv\\Scripts\\python.exe -m app.core.seed

Idempotent: if any borrowers already exist, the whole seed is skipped, so
re-running it during development does not create duplicates.
"""

from datetime import date
from decimal import Decimal

from app.core.database import SessionLocal
from app.models.borrower import Borrower
from app.models.loan import Loan
from app.models.payment import Payment
from app.services.numbering import generate_business_number

RATE = Decimal("5.00")

BORROWERS = [
    {
        "full_name": "Maria Santos",
        "email": "maria@example.com",
        "phone": "0912 345 6789",
        "address": "Quezon City, Philippines",
    },
    {
        "full_name": "John Cruz",
        "email": "john@example.com",
        "phone": "0917 123 4567",
        "address": "Makati City, Philippines",
    },
    {
        "full_name": "Anna Reyes",
        "email": "anna@example.com",
        "phone": "0922 987 6543",
        "address": "Pasig City, Philippines",
    },
    {
        "full_name": "Carlos Dela Cruz",
        "email": "carlos@example.com",
        "phone": "0918 765 4321",
        "address": "Taguig City, Philippines",
    },
    {
        "full_name": "Peter Lim",
        "email": "peter@example.com",
        "phone": "0916 111 2233",
        "address": "Mandaluyong City, Philippines",
    },
]

# (borrower email, principal, start_date, due_date, [(payment_date, amount), ...])
# Produces: Maria=Active, John=Overdue, Anna=Paid, Carlos=Active, Peter=Paid
# (relative to "today" at seed time being on/after 2026-10-01).
LOANS = [
    {
        "borrower_email": "maria@example.com",
        "principal_amount": Decimal("30000.00"),
        "start_date": date(2026, 9, 1),
        "due_date": date(2026, 12, 1),
        "payments": [
            (date(2026, 8, 15), Decimal("4500.00")),
            (date(2026, 9, 15), Decimal("4500.00")),
            (date(2026, 10, 1), Decimal("4500.00")),
        ],
    },
    {
        "borrower_email": "john@example.com",
        "principal_amount": Decimal("20000.00"),
        "start_date": date(2026, 6, 28),
        "due_date": date(2026, 9, 28),
        "payments": [
            (date(2026, 7, 1), Decimal("10000.00")),
            (date(2026, 9, 20), Decimal("6000.00")),
        ],
    },
    {
        "borrower_email": "anna@example.com",
        "principal_amount": Decimal("15000.00"),
        "start_date": date(2026, 6, 15),
        "due_date": date(2026, 9, 15),
        "payments": [
            (date(2026, 8, 1), Decimal("7875.00")),
            (date(2026, 9, 10), Decimal("7875.00")),
        ],
    },
    {
        "borrower_email": "carlos@example.com",
        "principal_amount": Decimal("25000.00"),
        "start_date": date(2026, 9, 15),
        "due_date": date(2026, 12, 15),
        "payments": [
            (date(2026, 9, 28), Decimal("6875.00")),
            (date(2026, 10, 1), Decimal("6875.00")),
        ],
    },
    {
        "borrower_email": "peter@example.com",
        "principal_amount": Decimal("10000.00"),
        "start_date": date(2026, 5, 30),
        "due_date": date(2026, 8, 30),
        "payments": [
            (date(2026, 8, 20), Decimal("10500.00")),
        ],
    },
]

PAYMENT_METHOD = "Cash"


def seed() -> None:
    db = SessionLocal()
    try:
        if db.query(Borrower).first() is not None:
            print("Seed skipped: borrowers already exist.")
            return

        borrowers_by_email: dict[str, Borrower] = {}
        for data in BORROWERS:
            borrower = Borrower(**data)
            db.add(borrower)
            db.flush()
            borrowers_by_email[borrower.email] = borrower

        for loan_data in LOANS:
            borrower = borrowers_by_email[loan_data["borrower_email"]]
            loan_number = generate_business_number(
                db, entity_type="loan", prefix="LN", year=loan_data["start_date"].year
            )
            loan = Loan(
                loan_number=loan_number,
                borrower_id=borrower.id,
                principal_amount=loan_data["principal_amount"],
                interest_rate=RATE,
                start_date=loan_data["start_date"],
                due_date=loan_data["due_date"],
            )
            db.add(loan)
            db.flush()

            for payment_date, amount in loan_data["payments"]:
                payment_number = generate_business_number(
                    db, entity_type="payment", prefix="PAY", year=payment_date.year
                )
                db.add(
                    Payment(
                        payment_number=payment_number,
                        loan_id=loan.id,
                        amount=amount,
                        payment_date=payment_date,
                        payment_method=PAYMENT_METHOD,
                    )
                )

        db.commit()
        print(f"Seeded {len(BORROWERS)} borrowers and {len(LOANS)} loans.")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
