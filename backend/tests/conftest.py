"""Test fixtures.

Runs against a dedicated ALoanMS_Test database on the same local SQL Server
instance used for development - not SQLite, not an in-memory mock - so tests
exercise the real dialect (decimal precision, MERGE-based numbering, etc.)
without touching the ALoanMS development data.
"""

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

from app.core.config import Settings
from app.core.database import Base, get_db
from app.main import app

test_settings = Settings(db_name="ALoanMS_Test")
engine = create_engine(test_settings.database_url)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="session", autouse=True)
def _schema():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


@pytest.fixture
def db_session():
    with engine.begin() as conn:
        conn.execute(text("DELETE FROM payments"))
        conn.execute(text("DELETE FROM loans"))
        conn.execute(text("DELETE FROM borrowers"))
        conn.execute(text("DELETE FROM number_sequences"))

    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()


@pytest.fixture
def client(db_session):
    def _override_get_db():
        yield db_session

    app.dependency_overrides[get_db] = _override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()
