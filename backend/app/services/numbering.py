"""Generates unique, human-readable business identifiers (e.g. LN-2026-001).

Strategy: a per-(entity_type, year) counter row in `number_sequences`,
incremented with a single atomic SQL Server MERGE statement. This avoids the
classic COUNT(*) + 1 bug, where deleting a row lets a later insert reuse its
number - the counter here only ever goes up, independent of how many rows
currently exist. The MERGE's UPSERT is a single statement, so SQL Server's
own row locking serializes concurrent callers for the same (entity_type,
year) key; the table's composite primary key is a backstop that would turn
any residual race into a clear IntegrityError rather than a silent duplicate.
"""

from sqlalchemy import text
from sqlalchemy.orm import Session

_NEXT_VALUE_SQL = text(
    """
    MERGE number_sequences WITH (HOLDLOCK) AS target
    USING (SELECT :entity_type AS entity_type, :year AS year) AS source
    ON target.entity_type = source.entity_type AND target.year = source.year
    WHEN MATCHED THEN
        UPDATE SET last_value = target.last_value + 1
    WHEN NOT MATCHED THEN
        INSERT (entity_type, year, last_value) VALUES (source.entity_type, source.year, 1)
    OUTPUT inserted.last_value;
    """
)


def generate_business_number(db: Session, *, entity_type: str, prefix: str, year: int) -> str:
    result = db.execute(_NEXT_VALUE_SQL, {"entity_type": entity_type, "year": year})
    next_value = result.scalar_one()
    return f"{prefix}-{year}-{next_value:03d}"
