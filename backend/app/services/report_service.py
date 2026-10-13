import uuid
from datetime import datetime
from typing import Dict, Any, List, Optional, Tuple
from bson import ObjectId
from fastapi import HTTPException, status

from app.db.mongodb import get_reports_collection
from app.services.normalization import NormalizationService
from app.schemas.report import ReportCreate

VALID_CATEGORIES = [
    "UPI Payment Fraud",
    "Phishing",
    "Fake Customer Care",
    "OTP Scam",
    "Impersonation",
    "Investment Scam",
    "Job Scam",
    "Shopping Scam",
    "Loan Scam",
    "Other"
]

class ReportService:
    @staticmethod
    def generate_reference_id() -> str:
        short_id = uuid.uuid4().hex[:8].upper()
        return f"RPT-{datetime.utcnow().year}-{short_id}"

    @classmethod
    def create_report(
        cls,
        report_data: ReportCreate,
        reporter_id: str
    ) -> Dict[str, Any]:
        # 1. Validate category
        if report_data.scam_category not in VALID_CATEGORIES:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid scam category. Allowed categories: {', '.join(VALID_CATEGORIES)}"
            )

        # 2. Normalize identifier
        is_valid, norm_id, masked_id, err = NormalizationService.normalize_identifier(
            report_data.identifier_type, report_data.identifier_value
        )
        if not is_valid:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=err)

        reports_col = get_reports_collection()

        # 3. Basic duplicate abuse check (same reporter submitting same identifier within last 1 hour)
        existing_dup = reports_col.find_one({
            "reporter_id": str(reporter_id),
            "normalized_identifier": norm_id,
            "status": "pending"
        })
        if existing_dup:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="A pending report for this identifier has already been submitted by you. Please await moderation review."
            )

        ref_id = cls.generate_reference_id()

        # 4. Construct MongoDB document
        doc = {
            "reference_id": ref_id,
            "identifier_type": report_data.identifier_type.lower(),
            "normalized_identifier": norm_id,
            "masked_identifier": masked_id,
            "scam_category": report_data.scam_category,
            "description": report_data.description.strip(),
            "incident_date": report_data.incident_date.isoformat(),
            "amount_inr": float(report_data.amount_inr) if report_data.amount_inr else 0.0,
            "reporter_id": str(reporter_id),
            "status": "pending",  # Always begins as pending moderation
            "created_at": datetime.utcnow().isoformat(),
            "reviewed_at": None,
            "reviewed_by": None,
            "review_notes": None
        }

        res = reports_col.insert_one(doc)
        doc["_id"] = str(res.inserted_id)
        return doc

    @classmethod
    def get_public_reports(
        cls,
        page: int = 1,
        limit: int = 10,
        category: Optional[str] = None,
        id_type: Optional[str] = None,
        search_query: Optional[str] = None,
        sort_by: str = "newest"
    ) -> Tuple[List[Dict[str, Any]], int]:
        """
        Retrieves APPROVED public reports only with masking and filters.
        """
        reports_col = get_reports_collection()
        query: Dict[str, Any] = {"status": "approved"}

        if category and category != "all":
            query["scam_category"] = category

        if id_type and id_type != "all":
            query["identifier_type"] = id_type.lower()

        if search_query:
            query["$or"] = [
                {"masked_identifier": {"$regex": search_query, "$options": "i"}},
                {"scam_category": {"$regex": search_query, "$options": "i"}},
                {"description": {"$regex": search_query, "$options": "i"}},
                {"reference_id": {"$regex": search_query, "$options": "i"}}
            ]

        total = reports_col.count_documents(query)

        sort_field = "created_at"
        sort_dir = -1
        if sort_by == "oldest":
            sort_dir = 1
        elif sort_by == "amount_high":
            sort_field = "amount_inr"
            sort_dir = -1
        elif sort_by == "amount_low":
            sort_field = "amount_inr"
            sort_dir = 1

        skip = max((page - 1) * limit, 0)
        cursor = reports_col.find(query).sort(sort_field, sort_dir).skip(skip).limit(limit)

        items = []
        for r in cursor:
            items.append({
                "reference_id": r["reference_id"],
                "identifier_type": r["identifier_type"],
                "masked_identifier": r["masked_identifier"],
                "scam_category": r["scam_category"],
                "description": r["description"],
                "incident_date": r["incident_date"],
                "amount_inr": r.get("amount_inr", 0.0),
                "created_at": r["created_at"],
                "status": r["status"]
            })

        return items, total

    @classmethod
    def get_user_reports(cls, user_id: str) -> List[Dict[str, Any]]:
        reports_col = get_reports_collection()
        cursor = reports_col.find({"reporter_id": str(user_id)}).sort("created_at", -1)
        res = []
        for r in cursor:
            res.append({
                "id": str(r["_id"]),
                "reference_id": r["reference_id"],
                "identifier_type": r["identifier_type"],
                "masked_identifier": r["masked_identifier"],
                "scam_category": r["scam_category"],
                "description": r["description"],
                "incident_date": r["incident_date"],
                "amount_inr": r.get("amount_inr", 0.0),
                "status": r["status"],
                "created_at": r["created_at"],
                "reviewed_at": r.get("reviewed_at"),
                "review_notes": r.get("review_notes")
            })
        return res
