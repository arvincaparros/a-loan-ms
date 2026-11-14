from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.borrower import Borrower
from app.schemas.borrower import BorrowerCreate


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


def list_borrowers(db: Session) -> list[Borrower]:
    return list(db.execute(select(Borrower)).scalars().all())
