from typing import Optional, List
from fastapi import APIRouter, Query, Depends, HTTPException, status, Request
from app.schemas.report import ReportCreate, PublicReportItem, ReportSubmissionResponse
from app.services.report_service import ReportService
from app.services.auth_service import get_current_user_optional
from app.db.mongodb import get_reports_collection
from bson import ObjectId

router = APIRouter(tags=["Reports"])

@router.get("/reports")
def list_public_reports(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=50),
    category: Optional[str] = Query(None),
    type: Optional[str] = Query(None),
    query: Optional[str] = Query(None),
    sort: str = Query("newest", pattern="^(newest|oldest|amount_high|amount_low)$")
):
    items, total = ReportService.get_public_reports(
        page=page,
        limit=limit,
        category=category,
        id_type=type,
        search_query=query,
        sort_by=sort
    )
    return {
        "items": items,
        "total": total,
        "page": page,
        "limit": limit,
        "total_pages": (total + limit - 1) // limit if total > 0 else 1
    }

@router.get("/reports/{report_id}", response_model=PublicReportItem)
def get_report_detail(report_id: str):
    reports_col = get_reports_collection()
    query = {"status": "approved"}
    if ObjectId.is_valid(report_id):
        query["_id"] = ObjectId(report_id)
    else:
        query["reference_id"] = report_id

    doc = reports_col.find_one(query)
    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Approved report not found.")

    return PublicReportItem(
        reference_id=doc["reference_id"],
        identifier_type=doc["identifier_type"],
        masked_identifier=doc["masked_identifier"],
        scam_category=doc["scam_category"],
        description=doc["description"],
        incident_date=doc["incident_date"],
        amount_inr=doc.get("amount_inr"),
        created_at=doc["created_at"],
        status=doc["status"]
    )

@router.post("/reports", response_model=ReportSubmissionResponse, status_code=status.HTTP_201_CREATED)
def submit_scam_report(
    report_data: ReportCreate,
    request: Request,
    user: Optional[dict] = Depends(get_current_user_optional)
):
    # If user is authenticated, use their user ID; else use client host IP or anonymous token
    reporter_id = user["id"] if user else f"guest-{request.client.host if request.client else 'anon'}"
    
    doc = ReportService.create_report(report_data, reporter_id)

    return ReportSubmissionResponse(
        success=True,
        message="Your report has been successfully recorded and submitted for moderator verification. It will be made visible in the public database once verified.",
        reference_id=doc["reference_id"],
        status="pending",
        masked_identifier=doc["masked_identifier"],
        identifier_type=doc["identifier_type"]
    )
