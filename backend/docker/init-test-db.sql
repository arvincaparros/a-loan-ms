-- Mirrors the existing dev pattern (backend/tests/conftest.py): one server
-- instance, two databases - the default POSTGRES_DB for app/dev use, and
-- this one for the test suite.
CREATE DATABASE "ALoanMS_Test";
