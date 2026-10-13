from typing import List, Dict, Any, Tuple
from datetime import datetime

CATEGORY_SEVERITY_WEIGHTS = {
    "UPI Payment Fraud": 4.5,
    "OTP Scam": 5.0,
    "Phishing": 4.0,
    "Fake Customer Care": 4.2,
    "Impersonation": 4.0,
    "Investment Scam": 4.8,
    "Job Scam": 3.8,
    "Loan Scam": 4.2,
    "Shopping Scam": 3.5,
    "Other": 2.5
}

class RiskEngine:
    @staticmethod
    def calculate_evidence_risk(approved_reports: List[Dict[str, Any]]) -> Tuple[str, float, str]:
        """
        Calculates transparent evidence-based risk assessment.
        Returns: (risk_level, score, explanation)
        """
        count = len(approved_reports)
        if count == 0:
            return (
                "NO_REPORTS",
                0.0,
                "No approved community reports found. This does not guarantee that the mobile number or UPI ID is safe, as newly generated scam handles may not yet be documented."
            )

        total_amount = sum(float(r.get("amount_inr") or 0.0) for r in approved_reports)
        distinct_reporters = len(set(str(r.get("reporter_id")) for r in approved_reports))
        categories = [r.get("scam_category", "Other") for r in approved_reports]

        # Calculate average category severity
        avg_severity = sum(CATEGORY_SEVERITY_WEIGHTS.get(c, 2.5) for c in categories) / count

        # Risk scoring formula:
        # Base from volume: count * 20 (max 50)
        # Distinct reporters multiplier: min(distinct_reporters, 3) * 10 (max 30)
        # Severity weight contribution: (avg_severity / 5.0) * 15 (max 15)
        # Amount impact: min(total_amount / 50000.0, 1.0) * 5 (max 5)
        raw_score = (
            min(count * 20.0, 50.0) +
            min(distinct_reporters * 10.0, 30.0) +
            (avg_severity / 5.0 * 15.0) +
            min(total_amount / 50000.0, 1.0 * 5.0)
        )
        score = min(max(round(raw_score, 1), 5.0), 100.0)

        if count == 1 and total_amount == 0 and distinct_reporters <= 1:
            level = "LOW_RISK"
            explanation = (
                f"1 community report approved ({categories[0]}). "
                "Classified as Low Risk due to limited corroborating volume. Verify identities through official channels before sending funds."
            )
        elif count >= 4 or (count >= 2 and total_amount >= 50000) or score >= 75.0:
            level = "HIGH_RISK"
            explanation = (
                f"High risk detected: {count} verified reports from {distinct_reporters} distinct sources "
                f"with approximately ₹{total_amount:,.2f} in reported losses. High probability of fraudulent identity."
            )
        elif count >= 2 or score >= 45.0:
            level = "MEDIUM_RISK"
            explanation = (
                f"Medium risk: {count} verified reports associated with {', '.join(set(categories))}. "
                "Multiple individuals have flagged suspicious requests. Exercise extreme caution."
            )
        else:
            level = "LOW_RISK"
            explanation = (
                f"{count} verified report on record. Initial warning flag present. Avoid sharing OTPs or initiating advance payments."
            )

        return level, score, explanation
