def _create_borrower(client, email="borrower@example.com"):
    response = client.post(
        "/api/borrowers",
        json={"full_name": "Borrower", "email": email, "phone": "0900 000 0000", "address": "City"},
    )
    assert response.status_code == 201
    return response.json()["id"]


def _create_loan(client, borrower_id, **overrides):
    payload = {
        "borrower_id": borrower_id,
        "principal_amount": "30000.00",
        "interest_rate": "5.00",
        "start_date": "2026-09-01",
        "due_date": "2026-12-01",
    }
    payload.update(overrides)
    response = client.post("/api/loans", json=payload)
    assert response.status_code == 201
    return response.json()


def test_create_borrower(client):
    response = client.post(
        "/api/borrowers",
        json={
            "full_name": "Test Borrower",
            "email": "test@example.com",
            "phone": "0900 000 0000",
            "address": "Test City",
        },
    )
    assert response.status_code == 201
    body = response.json()
    assert body["full_name"] == "Test Borrower"
    assert "id" in body


def test_create_loan_computes_financials_and_generates_number(client):
    borrower_id = _create_borrower(client)
    loan = _create_loan(client, borrower_id)

    assert loan["loan_number"].startswith("LN-2026-")
    assert loan["interest_amount"] == "1500.00"
    assert loan["total_payable"] == "31500.00"
    assert loan["total_paid"] == "0.00"
    assert loan["outstanding_balance"] == "31500.00"
    assert loan["status"] == "Active"


def test_record_valid_payment_updates_loan_balance(client):
    borrower_id = _create_borrower(client)
    loan = _create_loan(client, borrower_id)

    response = client.post(
        "/api/payments",
        json={
            "loan_id": loan["id"],
            "amount": "13500.00",
            "payment_date": "2026-10-01",
            "payment_method": "Cash",
        },
    )
    assert response.status_code == 201
    payment = response.json()
    assert payment["payment_number"].startswith("PAY-2026-")
    assert payment["balance_after"] == "18000.00"

    updated_loan = client.get(f"/api/loans/{loan['id']}").json()
    assert updated_loan["total_paid"] == "13500.00"
    assert updated_loan["outstanding_balance"] == "18000.00"
    assert updated_loan["status"] == "Active"


def test_reject_overpayment(client):
    borrower_id = _create_borrower(client)
    loan = _create_loan(client, borrower_id, principal_amount="10000.00")

    response = client.post(
        "/api/payments",
        json={
            "loan_id": loan["id"],
            "amount": "99999.00",
            "payment_date": "2026-10-01",
            "payment_method": "Cash",
        },
    )
    assert response.status_code == 400
    assert "exceeds the outstanding balance" in response.json()["detail"]


def test_reject_payment_against_fully_paid_loan(client):
    borrower_id = _create_borrower(client)
    loan = _create_loan(client, borrower_id, principal_amount="10000.00")

    first_payment = client.post(
        "/api/payments",
        json={
            "loan_id": loan["id"],
            "amount": "10500.00",
            "payment_date": "2026-10-01",
            "payment_method": "Cash",
        },
    )
    assert first_payment.status_code == 201

    second_payment = client.post(
        "/api/payments",
        json={
            "loan_id": loan["id"],
            "amount": "1.00",
            "payment_date": "2026-10-02",
            "payment_method": "Cash",
        },
    )
    assert second_payment.status_code == 400
    assert "already fully paid" in second_payment.json()["detail"]


def test_payment_against_missing_loan_returns_404(client):
    response = client.post(
        "/api/payments",
        json={
            "loan_id": 999999,
            "amount": "100.00",
            "payment_date": "2026-10-01",
            "payment_method": "Cash",
        },
    )
    assert response.status_code == 404


def test_loan_against_missing_borrower_returns_404(client):
    response = client.post(
        "/api/loans",
        json={
            "borrower_id": 999999,
            "principal_amount": "1000.00",
            "interest_rate": "5.00",
            "start_date": "2026-09-01",
            "due_date": "2026-12-01",
        },
    )
    assert response.status_code == 404


def test_get_missing_borrower_returns_404(client):
    response = client.get("/api/borrowers/999999")
    assert response.status_code == 404


def test_invalid_email_rejected(client):
    response = client.post(
        "/api/borrowers",
        json={"full_name": "Bad Email", "email": "not-an-email", "phone": "123", "address": "Somewhere"},
    )
    assert response.status_code == 422


def test_due_date_before_start_date_rejected(client):
    borrower_id = _create_borrower(client)
    response = client.post(
        "/api/loans",
        json={
            "borrower_id": borrower_id,
            "principal_amount": "1000.00",
            "interest_rate": "5.00",
            "start_date": "2026-10-01",
            "due_date": "2026-09-01",
        },
    )
    assert response.status_code == 422
