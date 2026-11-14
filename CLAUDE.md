# A-Loan MS — Project Instructions

## 1. Project Overview

A-Loan MS is a loan management system for small lending businesses.

It manages:
- Borrowers
- Loans
- Payments
- Outstanding balances
- Loan portfolio monitoring
- AI-powered natural-language queries over loan data

The AI assistant must use controlled backend functions to retrieve business data. It must not generate or execute arbitrary SQL.

## 2. Technology Stack

### Frontend
- React 19
- TypeScript
- Vite 8
- Mantine UI 9
- React Router 7
- Recharts
- Lucide React
- Day.js

### Backend
- Python 3.14
- FastAPI
- Pydantic v2
- SQLAlchemy 2.x
- Alembic
- pyodbc
- Microsoft SQL Server

## 3. Architecture

The application uses a separate frontend and backend.

- frontend/ contains the React application.
- backend/ contains the FastAPI application.
- FastAPI owns business logic and financial calculations.
- SQL Server is the persistent database.
- The frontend communicates with the backend through REST APIs.

Do not introduce unnecessary architectural complexity.

Avoid microservices, CQRS, MediatR, and unnecessary abstraction layers.

## 4. Domain Rules

Core relationships:

Borrower 1 → Many Loans

Loan 1 → Many Payments

Financial calculations must use Python Decimal.

Never use floating-point arithmetic for money.

Financial values:
- Interest Amount = Principal × Interest Rate / 100
- Total Payable = Principal + Interest Amount
- Total Paid = Sum of recorded payments
- Outstanding Balance = max(Total Payable - Total Paid, 0)

Loan status is derived:
- Paid
- Overdue
- Active

Do not trust frontend-provided financial calculations or loan status.

Payment creation must reject overpayments.

## 5. Frontend Guidelines

- Use Mantine components for UI.
- Use TypeScript types consistently.
- Use React Router for navigation.
- Keep reusable components organized by feature.
- Preserve the established design system.
- Do not introduce Tailwind CSS.
- Do not add unnecessary dependencies.

UI changes should prioritize usability, visual consistency, responsive behavior, and accessibility.

## 6. Backend Guidelines

- Use FastAPI routers for API endpoints.
- Use Pydantic schemas for request/response validation.
- Use SQLAlchemy for database access.
- Use Alembic for schema migrations.
- Keep business calculations in service modules.
- Use environment variables for configuration.
- Never commit real credentials.

## 7. Development Workflow

Before modifying code:
1. Inspect the existing implementation.
2. Understand related components and dependencies.
3. Identify the smallest appropriate change.
4. Avoid modifying unrelated files.

After implementation:
1. Run relevant tests.
2. Run TypeScript checks for frontend changes.
3. Run frontend build and lint.
4. Run backend tests for backend changes.
5. Report modified files and verification results.

## 8. Important Rules

- Do not redesign approved pages without explicit approval.
- Do not modify unrelated functionality.
- Do not duplicate existing data structures unnecessarily.
- Do not bypass security policies.
- Do not invent business requirements.
- Stop after completing the explicitly requested scope.
- Report blockers rather than silently working around them.
