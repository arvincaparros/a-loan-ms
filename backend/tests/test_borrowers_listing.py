def _create_borrower(client, full_name="Borrower", email="borrower@example.com", phone="0900 000 0000", address="City"):
    response = client.post(
        "/api/borrowers",
        json={"full_name": full_name, "email": email, "phone": phone, "address": address},
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


def _pay(client, loan_id, amount, payment_date="2026-10-01"):
    response = client.post(
        "/api/payments",
        json={"loan_id": loan_id, "amount": amount, "payment_date": payment_date, "payment_method": "Cash"},
    )
    assert response.status_code == 201
    return response.json()


def _make_paid_borrower(client, email):
    borrower_id = _create_borrower(client, email=email)
    loan = _create_loan(client, borrower_id, principal_amount="10000.00", interest_rate="5.00")
    _pay(client, loan["id"], "10500.00")
    return borrower_id


def _make_active_borrower(client, email):
    borrower_id = _create_borrower(client, email=email)
    _create_loan(client, borrower_id, principal_amount="10000.00", interest_rate="5.00", due_date="2027-06-01")
    return borrower_id


def _make_overdue_borrower(client, email):
    borrower_id = _create_borrower(client, email=email)
    _create_loan(
        client,
        borrower_id,
        principal_amount="10000.00",
        interest_rate="5.00",
        start_date="2026-01-01",
        due_date="2026-01-31",
    )
    return borrower_id


def test_list_borrowers_default_envelope_shape(client):
    _create_borrower(client, email="a@example.com")
    _create_borrower(client, email="b@example.com")

    response = client.get("/api/borrowers")
    assert response.status_code == 200
    body = response.json()

    assert set(body.keys()) == {"items", "total", "page", "page_size", "total_pages"}
    assert body["total"] == 2
    assert body["page"] == 1
    assert body["page_size"] == 20
    assert body["total_pages"] == 1
    assert len(body["items"]) == 2
    for item in body["items"]:
        assert "status" in item


def test_search_matches_by_full_name_case_insensitively(client):
    _create_borrower(client, full_name="borrower one", email="one@example.com")
    _create_borrower(client, full_name="someone else", email="two@example.com")

    response = client.get("/api/borrowers", params={"search": "BORROWER"})
    assert response.status_code == 200
    body = response.json()
    assert body["total"] == 1
    assert body["items"][0]["full_name"] == "borrower one"


def test_search_matches_by_email_case_insensitively(client):
    _create_borrower(client, full_name="Match Me", email="findme@example.com")
    _create_borrower(client, full_name="No Match", email="other@example.com")

    response = client.get("/api/borrowers", params={"search": "FINDME"})
    assert response.status_code == 200
    body = response.json()
    assert body["total"] == 1
    assert body["items"][0]["email"] == "findme@example.com"


def test_search_matches_by_phone_substring(client):
    _create_borrower(client, full_name="Phone Match", email="phone1@example.com", phone="0917 123 4567")
    _create_borrower(client, full_name="Phone Other", email="phone2@example.com", phone="0920 999 8888")

    response = client.get("/api/borrowers", params={"search": "123 4567"})
    assert response.status_code == 200
    body = response.json()
    assert body["total"] == 1
    assert body["items"][0]["phone"] == "0917 123 4567"


def test_search_no_match_returns_empty_items(client):
    _create_borrower(client, email="x@example.com")

    response = client.get("/api/borrowers", params={"search": "nonexistent-string"})
    assert response.status_code == 200
    body = response.json()
    assert body["items"] == []
    assert body["total"] == 0


def test_status_filter_active_zero_loans(client):
    borrower_id = _create_borrower(client, email="zeroloans@example.com")

    response = client.get("/api/borrowers", params={"status": "Active"})
    body = response.json()
    ids = [item["id"] for item in body["items"]]
    assert borrower_id in ids
    for item in body["items"]:
        assert item["status"] == "Active"


def test_status_filter_paid_fully_paid_loan(client):
    borrower_id = _make_paid_borrower(client, email="paidloan@example.com")
    active_id = _make_active_borrower(client, email="activeloan@example.com")

    response = client.get("/api/borrowers", params={"status": "Paid"})
    body = response.json()
    ids = [item["id"] for item in body["items"]]
    assert borrower_id in ids
    assert active_id not in ids
    for item in body["items"]:
        assert item["status"] == "Paid"


def test_status_filter_active(client):
    active_id = _make_active_borrower(client, email="activeonly@example.com")
    paid_id = _make_paid_borrower(client, email="paidonly@example.com")

    response = client.get("/api/borrowers", params={"status": "Active"})
    body = response.json()
    ids = [item["id"] for item in body["items"]]
    assert active_id in ids
    assert paid_id not in ids
    for item in body["items"]:
        assert item["status"] == "Active"


def test_status_filter_overdue(client):
    overdue_id = _make_overdue_borrower(client, email="overdueonly@example.com")
    active_id = _make_active_borrower(client, email="activeonly2@example.com")

    response = client.get("/api/borrowers", params={"status": "Overdue"})
    body = response.json()
    ids = [item["id"] for item in body["items"]]
    assert overdue_id in ids
    assert active_id not in ids
    for item in body["items"]:
        assert item["status"] == "Overdue"


def test_borrower_with_paid_and_overdue_loan_rolls_up_to_overdue(client):
    borrower_id = _create_borrower(client, email="mixed1@example.com")
    paid_loan = _create_loan(client, borrower_id, principal_amount="5000.00", interest_rate="5.00")
    _pay(client, paid_loan["id"], "5250.00")
    _create_loan(
        client,
        borrower_id,
        principal_amount="5000.00",
        interest_rate="5.00",
        start_date="2026-01-01",
        due_date="2026-01-31",
    )

    response = client.get(f"/api/borrowers/{borrower_id}")
    assert response.json()["status"] == "Overdue"


def test_borrower_with_paid_and_active_loan_rolls_up_to_active(client):
    borrower_id = _create_borrower(client, email="mixed2@example.com")
    paid_loan = _create_loan(client, borrower_id, principal_amount="5000.00", interest_rate="5.00")
    _pay(client, paid_loan["id"], "5250.00")
    _create_loan(client, borrower_id, principal_amount="5000.00", interest_rate="5.00", due_date="2027-06-01")

    response = client.get(f"/api/borrowers/{borrower_id}")
    assert response.json()["status"] == "Active"


def test_pagination_pages_and_total_pages(client):
    emails = [f"page{i}@example.com" for i in range(5)]
    created_ids = [_create_borrower(client, email=e) for e in emails]

    page1 = client.get("/api/borrowers", params={"page": 1, "page_size": 2}).json()
    assert page1["total"] == 5
    assert page1["page"] == 1
    assert page1["page_size"] == 2
    assert page1["total_pages"] == 3
    assert len(page1["items"]) == 2

    page2 = client.get("/api/borrowers", params={"page": 2, "page_size": 2}).json()
    assert page2["page"] == 2
    assert len(page2["items"]) == 2

    page1_ids = {item["id"] for item in page1["items"]}
    page2_ids = {item["id"] for item in page2["items"]}
    assert page1_ids.isdisjoint(page2_ids)
    assert page1_ids.issubset(set(created_ids))
    assert page2_ids.issubset(set(created_ids))

    page3 = client.get("/api/borrowers", params={"page": 3, "page_size": 2}).json()
    assert len(page3["items"]) == 1
    assert page3["total_pages"] == 3

    page_past_end = client.get("/api/borrowers", params={"page": 4, "page_size": 2}).json()
    assert page_past_end["items"] == []
    assert page_past_end["total"] == 5
    assert page_past_end["total_pages"] == 3


def test_page_zero_is_rejected(client):
    response = client.get("/api/borrowers", params={"page": 0})
    assert response.status_code == 422


def test_page_size_zero_is_rejected(client):
    response = client.get("/api/borrowers", params={"page_size": 0})
    assert response.status_code == 422


def test_page_size_over_limit_is_rejected(client):
    response = client.get("/api/borrowers", params={"page_size": 101})
    assert response.status_code == 422


def test_search_status_and_pagination_combined(client):
    # Three "combo" active borrowers matching search term, plus a non-matching
    # active borrower and a matching paid borrower - to prove filters compose
    # (search AND status), not just apply independently.
    for i in range(3):
        _make_active_borrower(client, email=f"combo-active-{i}@example.com")
    _make_active_borrower(client, email="unrelated-active@example.com")
    _make_paid_borrower(client, email="combo-paid@example.com")

    response = client.get(
        "/api/borrowers",
        params={"search": "combo", "status": "Active", "page": 1, "page_size": 2},
    )
    body = response.json()
    assert body["total"] == 3
    assert body["total_pages"] == 2
    assert len(body["items"]) == 2
    for item in body["items"]:
        assert item["status"] == "Active"
        assert "combo" in item["email"]

    response_page2 = client.get(
        "/api/borrowers",
        params={"search": "combo", "status": "Active", "page": 2, "page_size": 2},
    )
    body2 = response_page2.json()
    assert len(body2["items"]) == 1
    assert body2["total"] == 3


def test_status_filter_invalid_value_is_rejected(client):
    response = client.get("/api/borrowers", params={"status": "bogus"})
    assert response.status_code == 422


def test_get_borrower_by_id_includes_status(client):
    borrower_id = _create_borrower(client, email="single@example.com")
    response = client.get(f"/api/borrowers/{borrower_id}")
    assert response.status_code == 200
    assert response.json()["status"] == "Active"


def test_create_borrower_response_includes_status(client):
    response = client.post(
        "/api/borrowers",
        json={
            "full_name": "Fresh Borrower",
            "email": "fresh@example.com",
            "phone": "0900 111 2222",
            "address": "Somewhere",
        },
    )
    assert response.status_code == 201
    assert response.json()["status"] == "Active"
