import logging
from datetime import datetime, timedelta
from app.db.mongodb import get_reports_collection, get_audit_logs_collection
from app.services.normalization import NormalizationService
from app.services.auth_service import AuthService

logger = logging.getLogger("scamshield.seed")

def seed_initial_demo_data():
    """
    Seeds initial realistic records for academic demonstration so that
    the search, public database, and admin dashboard have authentic academic data out of the box.
    """
    reports_col = get_reports_collection()
    audit_col = get_audit_logs_collection()
    
    # Always ensure admin exists
    AuthService.bootstrap_default_admin()

    if reports_col.count_documents({"status": "approved"}) > 0:
        logger.info("Database already populated with approved records. Skipping demo seed.")
        return

    logger.info("Seeding initial academic demonstration dataset...")
    now = datetime.utcnow()

    sample_reports = [
        # Repeated offender 1: Fake Electricity Bill Disconnection Caller
        {
            "reference_id": "RPT-2026-EB0192A",
            "identifier_type": "phone",
            "identifier_value": "9876543210",
            "scam_category": "Fake Customer Care",
            "description": "Caller claimed to be from Maharashtra State Electricity Board warning that power would be disconnected at 9:30 PM unless an immediate bill update fee was paid via an APK link.",
            "days_ago": 12,
            "amount_inr": 4500.0,
            "status": "approved",
            "reporter_id": "user-demo-101"
        },
        {
            "reference_id": "RPT-2026-EB0192B",
            "identifier_type": "phone",
            "identifier_value": "9876543210",
            "scam_category": "Fake Customer Care",
            "description": "Received automated WhatsApp call from this number threatening power disconnection. Asked to download QuickSupport app and enter banking OTP.",
            "days_ago": 7,
            "amount_inr": 18200.0,
            "status": "approved",
            "reporter_id": "user-demo-102"
        },
        {
            "reference_id": "RPT-2026-EB0192C",
            "identifier_type": "phone",
            "identifier_value": "9876543210",
            "scam_category": "OTP Scam",
            "description": "Targeted my elderly parents claiming pending bill from last month. Demanded credit card OTP.",
            "days_ago": 3,
            "amount_inr": 12500.0,
            "status": "approved",
            "reporter_id": "user-demo-103"
        },

        # Offender 2: UPI QR Code Reversal Fraud
        {
            "reference_id": "RPT-2026-UPI991A",
            "identifier_type": "upi",
            "identifier_value": "refund.officer99@okhdfcbank",
            "scam_category": "UPI Payment Fraud",
            "description": "Olx buyer sent a payment request QR code claiming 'scan this QR to RECEIVE your advance payment'. Deducted ₹15,000 upon entering PIN.",
            "days_ago": 15,
            "amount_inr": 15000.0,
            "status": "approved",
            "reporter_id": "user-demo-104"
        },
        {
            "reference_id": "RPT-2026-UPI991B",
            "identifier_type": "upi",
            "identifier_value": "refund.officer99@okhdfcbank",
            "scam_category": "UPI Payment Fraud",
            "description": "Same UPI handle was used to demand security deposit for a fake rental apartment listing on Facebook Marketplace.",
            "days_ago": 4,
            "amount_inr": 22000.0,
            "status": "approved",
            "reporter_id": "user-demo-105"
        },

        # Offender 3: Work-From-Home Telegram Task Scam
        {
            "reference_id": "RPT-2026-JOB401A",
            "identifier_type": "phone",
            "identifier_value": "8826190455",
            "scam_category": "Job Scam",
            "description": "Offered ₹3,000 daily for liking YouTube videos and rating hotels on Google Maps. Later locked my funds in a 'prepaid VIP merchant task' portal.",
            "days_ago": 20,
            "amount_inr": 48000.0,
            "status": "approved",
            "reporter_id": "user-demo-106"
        },

        # Offender 4: Fake Bank KYC Verification UPI
        {
            "reference_id": "RPT-2026-KYC771A",
            "identifier_type": "upi",
            "identifier_value": "kyc.update.sbi@paytm",
            "scam_category": "Phishing",
            "description": "SMS alert with urgent threat: 'Dear customer, your YONO account is blocked. Verify KYC immediately by transferring ₹1 token fee.'",
            "days_ago": 2,
            "amount_inr": 1.0,
            "status": "approved",
            "reporter_id": "user-demo-107"
        },

        # Pending reports awaiting admin review (Demonstration of Admin queue)
        {
            "reference_id": "RPT-2026-PND001A",
            "identifier_type": "phone",
            "identifier_value": "9123456789",
            "scam_category": "Investment Scam",
            "description": "Instagram crypto trader promised 300% returns in 48 hours through a guaranteed trading bot. Refused withdrawal after deposit.",
            "days_ago": 1,
            "amount_inr": 35000.0,
            "status": "pending",
            "reporter_id": "user-demo-108"
        },
        {
            "reference_id": "RPT-2026-PND002B",
            "identifier_type": "upi",
            "identifier_value": "courier.customs@ybl",
            "scam_category": "Impersonation",
            "description": "Caller claimed FedEx international parcel containing illegal items was held by Delhi Customs and demanded clearance fee.",
            "days_ago": 0,
            "amount_inr": 25000.0,
            "status": "pending",
            "reporter_id": "user-demo-109"
        }
    ]

    for item in sample_reports:
        _, norm_id, masked_id, _ = NormalizationService.normalize_identifier(
            item["identifier_type"], item["identifier_value"]
        )
        created_time = (now - timedelta(days=item["days_ago"])).isoformat()
        
        doc = {
            "reference_id": item["reference_id"],
            "identifier_type": item["identifier_type"],
            "normalized_identifier": norm_id,
            "masked_identifier": masked_id,
            "scam_category": item["scam_category"],
            "description": item["description"],
            "incident_date": (now - timedelta(days=item["days_ago"] + 1)).date().isoformat(),
            "amount_inr": item["amount_inr"],
            "reporter_id": item["reporter_id"],
            "status": item["status"],
            "created_at": created_time,
            "reviewed_at": created_time if item["status"] == "approved" else None,
            "reviewed_by": "admin@scamshield.org" if item["status"] == "approved" else None,
            "review_notes": "Verified against victim evidence screenshot" if item["status"] == "approved" else None
        }
        reports_col.insert_one(doc)

    # Initial audit log
    audit_col.insert_one({
        "actor_id": "admin-system",
        "actor_email": "admin@scamshield.org",
        "action": "system_bootstrap",
        "resource_id": "INITIAL_SEED",
        "reason": "Initialized baseline academic demonstration records",
        "timestamp": now.isoformat()
    })
    logger.info("Initial academic demonstration records seeded successfully.")
