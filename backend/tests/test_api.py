import time
import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.db.mongodb import db_manager
from app.db.seed import seed_initial_demo_data

@pytest.fixture(scope="session", autouse=True)
def setup_test_db():
    db_manager.connect()
    seed_initial_demo_data()

@pytest.fixture(scope="session")
def client():
    with TestClient(app) as test_client:
        yield test_client

def test_health_check(client):
    res = client.get("/api/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "healthy"
    assert "database" in data
    assert "machine_learning" in data

def test_public_stats(client):
    res = client.get("/api/stats")
    assert res.status_code == 200
    data = res.json()
    assert "total_reports" in data
    assert "approved_reports" in data
    assert "unique_approved_identifiers" in data
    assert data["approved_reports"] >= 1

def test_search_valid_phone_found(client):
    # 9876543210 is in seed data as approved
    res = client.get("/api/search?type=phone&query=9876543210")
    assert res.status_code == 200
    data = res.json()
    assert data["found"] is True
    assert data["approved_reports_count"] >= 1
    assert data["risk_level"] in ["MEDIUM_RISK", "HIGH_RISK"]
    assert "ml_assessment" in data
    assert data["ml_assessment"]["status"] == "SUCCESS"

def test_search_clean_identifier_no_reports(client):
    res = client.get("/api/search?type=phone&query=9999911111")
    assert res.status_code == 200
    data = res.json()
    assert data["found"] is False
    assert data["approved_reports_count"] == 0
    assert data["risk_level"] == "NO_REPORTS"
    assert "No approved community reports" in data["risk_explanation"] or "No reports found" in data["risk_explanation"]
    assert data["ml_assessment"]["data_sufficiency"] == "INSUFFICIENT"

def test_search_invalid_phone_rejected(client):
    res = client.get("/api/search?type=phone&query=12345")
    assert res.status_code == 400
    assert "valid 10-digit" in res.json()["detail"]

def test_search_valid_upi_found(client):
    res = client.get("/api/search?type=upi&query=refund.officer99@okhdfcbank")
    assert res.status_code == 200
    data = res.json()
    assert data["found"] is True
    assert data["identifier_type"] == "upi"
    assert data["approved_reports_count"] >= 1

def test_search_invalid_upi_rejected(client):
    res = client.get("/api/search?type=upi&query=invalid-upi-handle-without-at")
    assert res.status_code == 400
    assert "Invalid UPI ID format" in res.json()["detail"]

def test_public_reports_listing(client):
    res = client.get("/api/reports?page=1&limit=5")
    assert res.status_code == 200
    data = res.json()
    assert "items" in data
    assert "total" in data
    for item in data["items"]:
        assert item["status"] == "approved"

def test_report_submission_and_duplicate_flow(client):
    # Unique number per run
    unique_suffix = str(int(time.time()))[-8:]
    unique_phone = f"98{unique_suffix}"
    payload = {
        "identifier_type": "phone",
        "identifier_value": unique_phone,
        "scam_category": "Phishing",
        "description": "Victim received fraudulent banking alert asking to verify debit card on phishing URL.",
        "incident_date": "2026-10-10",
        "amount_inr": 8500.0,
        "consent_given": True
    }
    # First submission -> 201
    res1 = client.post("/api/reports", json=payload)
    assert res1.status_code == 201
    data = res1.json()
    assert data["success"] is True
    assert data["status"] == "pending"
    assert data["reference_id"].startswith("RPT-")

    # Immediate second submission -> 429
    res2 = client.post("/api/reports", json=payload)
    assert res2.status_code == 429
    assert "pending report" in res2.json()["detail"]

def test_auth_and_admin_security(client):
    unique_email = f"student_{int(time.time())}@college.edu"
    reg_payload = {
        "email": unique_email,
        "password": "Password123!",
        "full_name": "Final Year Student"
    }
    res_reg = client.post("/api/auth/register", json=reg_payload)
    assert res_reg.status_code == 201
    user_token = res_reg.json()["access_token"]

    # Regular user receives 403 Forbidden on admin endpoint
    res_forbidden = client.get(
        "/api/admin/stats",
        headers={"Authorization": f"Bearer {user_token}"}
    )
    assert res_forbidden.status_code == 403

    # Unauthorized access without token receives 401
    res_unauth = client.get("/api/admin/stats")
    assert res_unauth.status_code == 401

    # Admin login with bootstrapped credentials
    login_payload = {
        "email": "admin@scamshield.org",
        "password": "Admin@ScamShield2026"
    }
    res_admin_login = client.post("/api/auth/login", json=login_payload)
    assert res_admin_login.status_code == 200
    admin_token = res_admin_login.json()["access_token"]

    # Admin accesses stats -> 200 OK
    res_admin_stats = client.get(
        "/api/admin/stats",
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert res_admin_stats.status_code == 200
    assert "pending_reports" in res_admin_stats.json()

    # Admin moderates pending report
    admin_reports = client.get(
        "/api/admin/reports?status=pending",
        headers={"Authorization": f"Bearer {admin_token}"}
    ).json()
    if len(admin_reports) > 0:
        target_report_id = admin_reports[0]["id"]
        res_approve = client.post(
            f"/api/admin/reports/{target_report_id}/approve",
            json={"action": "approve", "reason": "Verified bank statement proof provided."},
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert res_approve.status_code == 200
        assert res_approve.json()["new_status"] == "approved"

    # Check audit log entry
    res_audit = client.get(
        "/api/admin/audit-logs",
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert res_audit.status_code == 200
    assert len(res_audit.json()) >= 1

def test_ml_endpoints(client):
    res_status = client.get("/api/ml/status")
    assert res_status.status_code == 200
    data = res_status.json()
    assert data["is_trained"] is True
    assert data["algorithm"] == "RandomForestClassifier"

    predict_payload = {
        "approved_reports_count": 5,
        "distinct_reporters": 4,
        "days_since_first_report": 45.0,
        "days_since_last_report": 2.0,
        "total_loss_amount": 55000.0,
        "category_severity_score": 4.5,
        "dispute_count": 0
    }
    res_pred = client.post("/api/ml/predict", json=predict_payload)
    assert res_pred.status_code == 200
    pred_data = res_pred.json()
    assert pred_data["is_sufficient_data"] is True
    assert pred_data["risk_label"] in ["MEDIUM_RISK", "HIGH_RISK"]
    assert pred_data["fraud_probability"] is not None

    zero_payload = {
        "approved_reports_count": 0,
        "distinct_reporters": 0,
        "days_since_first_report": 0.0,
        "days_since_last_report": 0.0,
        "total_loss_amount": 0.0,
        "category_severity_score": 1.0,
        "dispute_count": 0
    }
    res_zero = client.post("/api/ml/predict", json=zero_payload)
    assert res_zero.status_code == 200
    zero_data = res_zero.json()
    assert zero_data["is_sufficient_data"] is False
    assert zero_data["risk_label"] == "INSUFFICIENT_DATA"
