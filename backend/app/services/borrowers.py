from datetime import date

from fastapi import HTTPException, status
from sqlalchemy import or_, select
from sqlalchemy.orm import Session

from app.models.borrower import Borrower
from app.models.loan import LoanStatus
from app.schemas.borrower import BorrowerCreate, BorrowerListResponse, BorrowerResponse
from app.services import financials
from app.services.loans import sum_payments_for_loan


def create_borrower(db: Session, payload: BorrowerCreate) -> Borrower:
    borrower = Borrower(**payload.model_dump())
    db.add(borrower)
    db.commit()
    db.refresh(borrower)
    return borrower


def get_borrower_or_404(db: Session, borrower_id: int) -> Borrower:
    borrower = db.get(Borrower, borrower_id)
    if borrower is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Borrower not found")
    return borrower


def derive_borrower_status(db: Session, borrower: Borrower, *, as_of: date | None = None) -> LoanStatus:
    """Roll a borrower's derived status up from their loans' derived statuses.

    Any Overdue loan makes the borrower Overdue; else any Active loan makes
    them Active; else if all loans are Paid, they're Paid; a borrower with
    zero loans is Active (not yet lent to, not "Paid off"). This rule is not
    in CLAUDE.md - it's a flagged assumption pending Product Owner
    confirmation, so it's isolated here rather than inlined into the list
    query, to make it trivial to change later.
    """
    loans = list(borrower.loans)
    if not loans:
        return LoanStatus.ACTIVE

    as_of = as_of or date.today()
    statuses = set()
    for loan in loans:
        total_payable = financials.calculate_total_payable(loan.principal_amount, loan.interest_rate)
        total_paid = sum_payments_for_loan(db, loan.id)
        outstanding_balance = financials.calculate_outstanding_balance(total_payable, total_paid)
        statuses.add(financials.derive_loan_status(outstanding_balance, loan.due_date, as_of))

    if LoanStatus.OVERDUE in statuses:
        return LoanStatus.OVERDUE
    if LoanStatus.ACTIVE in statuses:
        return LoanStatus.ACTIVE
    return LoanStatus.PAID


def build_borrower_response(borrower: Borrower, derived_status: LoanStatus) -> BorrowerResponse:
    return BorrowerResponse(
        id=borrower.id,
        full_name=borrower.full_name,
        email=borrower.email,
        phone=borrower.phone,
        address=borrower.address,
        status=derived_status,
        created_at=borrower.created_at,
        updated_at=borrower.updated_at,
    )


def build_borrower_response_for(db: Session, borrower: Borrower) -> BorrowerResponse:
    return build_borrower_response(borrower, derive_borrower_status(db, borrower))


def list_borrowers(
    db: Session,
    *,
    search: str | None = None,
    status_filter: LoanStatus | None = None,
    page: int = 1,
    page_size: int = 20,
) -> BorrowerListResponse:
    query = select(Borrower).order_by(Borrower.id)
    if search:
        escaped = search.replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_")
        pattern = f"%{escaped}%"
        query = query.where(
            or_(
                Borrower.full_name.ilike(pattern, escape="\\"),
                Borrower.email.ilike(pattern, escape="\\"),
                Borrower.phone.ilike(pattern, escape="\\"),
            )
        )
    candidates = list(db.execute(query).scalars().all())

    # shortcut: status isn't a stored column, so it's computed per-borrower
    # in Python (one query per loan for payment sums) and the status filter
    # + pagination are applied in memory over the search-matched candidates,
    # rather than as a single SQL aggregate query. Fine at small-lending-
    # business scale; move to DB-side aggregation if borrower counts grow large.
    scored = [(borrower, derive_borrower_status(db, borrower)) for borrower in candidates]
    if status_filter is not None:
        scored = [(borrower, s) for borrower, s in scored if s == status_filter]

    total = len(scored)
    start = (page - 1) * page_size
    page_items = scored[start : start + page_size]
    total_pages = (total + page_size - 1) // page_size if total else 0

    return BorrowerListResponse(
        items=[build_borrower_response(borrower, s) for borrower, s in page_items],
        total=total,
        page=page,
        page_size=page_size,
        total_pages=total_pages,
    )
