from functools import lru_cache

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict
from sqlalchemy.engine import URL


class Settings(BaseSettings):
    """Application configuration, sourced from environment variables / .env."""

    app_name: str = "A-Loan MS API"
    cors_origins: list[str] = [
        "http://localhost:5173",
        "http://localhost:5174",
    ]

    # SQL Server connection. Defaults match a local, Windows-authenticated
    # SQL Server instance so the project runs out of the box in dev without
    # any credentials having to be configured or committed.
    db_server: str = "localhost"
    db_name: str = "ALoanMS"
    db_driver: str = "ODBC Driver 18 for SQL Server"
    db_trusted_connection: bool = True
    db_username: str | None = None
    db_password: str | None = None
    db_trust_server_certificate: bool = True

    # Postgres connection (Phase 2 migration target). SQL Server fields above
    # are kept as-is for the future one-time data migration script.
    postgres_host: str = "localhost"
    postgres_port: int = 5433
    postgres_db: str = "ALoanMS"
    postgres_user: str = "aloanms"
    postgres_password: str
    # "disable" is fine for local Docker dev; any non-local environment must
    # override this to "require" or "verify-full".
    postgres_sslmode: str = "disable"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    @field_validator("cors_origins", mode="before")
    @classmethod
    def split_cors_origins(cls, value: object) -> object:
        if isinstance(value, str):
            return [origin.strip() for origin in value.split(",") if origin.strip()]
        return value

    @property
    def sqlserver_database_url(self) -> URL:
        query: dict[str, str] = {"driver": self.db_driver}
        if self.db_trust_server_certificate:
            query["TrustServerCertificate"] = "yes"

        if self.db_trusted_connection:
            query["trusted_connection"] = "yes"
            return URL.create(
                "mssql+pyodbc",
                host=self.db_server,
                database=self.db_name,
                query=query,
            )

        return URL.create(
            "mssql+pyodbc",
            username=self.db_username,
            password=self.db_password,
            host=self.db_server,
            database=self.db_name,
            query=query,
        )

    @property
    def database_url(self) -> URL:
        return URL.create(
            "postgresql+psycopg",
            username=self.postgres_user,
            password=self.postgres_password,
            host=self.postgres_host,
            port=self.postgres_port,
            database=self.postgres_db,
            query={"sslmode": self.postgres_sslmode},
        )


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
