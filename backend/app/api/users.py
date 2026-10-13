from typing import List
from fastapi import APIRouter, Depends
from app.services.auth_service import get_current_user
from app.services.report_service import ReportService
from app.schemas.report import UserReportItem

router = APIRouter(tags=["User Reports"])

@router.get("/users/me/reports", response_model=List[UserReportItem])
def get_my_reports(user: dict = Depends(get_current_user)):
    return ReportService.get_user_reports(user["id"])
