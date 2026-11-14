from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class NumberSequence(Base):
    """Backing counter for generated business identifiers (loan/payment numbers).

    One row per (entity_type, year). Incremented atomically in the database
    (see app/services/numbering.py) so numbers are never reused, even after
    rows are deleted - unlike a naive COUNT(*) + 1 approach.
    """

    __tablename__ = "number_sequences"

    entity_type: Mapped[str] = mapped_column(String(20), primary_key=True)
    year: Mapped[int] = mapped_column(Integer, primary_key=True)
    last_value: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
