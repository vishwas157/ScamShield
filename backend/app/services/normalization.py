import re
from typing import Tuple, Optional

class NormalizationService:
    @staticmethod
    def normalize_phone(raw_phone: str) -> Tuple[bool, Optional[str], Optional[str], Optional[str]]:
        """
        Validates and normalizes Indian mobile numbers.
        Returns (is_valid, normalized_id, masked_id, error_message).
        Accepts: 9876543210, +919876543210, 09876543210, 91 98765 43210
        Normalized: 919876543210
        Masked: +91 98****3210
        """
        if not raw_phone or not isinstance(raw_phone, str):
            return False, None, None, "Phone number is required"

        # Remove spaces, hyphens, parentheses, plus
        cleaned = re.sub(r"[\s\-\(\)\+]", "", raw_phone)

        # Check prefixes
        if cleaned.startswith("0") and len(cleaned) == 11:
            cleaned = cleaned[1:]
        elif cleaned.startswith("91") and len(cleaned) == 12:
            cleaned = cleaned[2:]

        # Validate 10-digit Indian mobile number (starts with 6, 7, 8, or 9)
        if not re.match(r"^[6-9]\d{9}$", cleaned):
            return (
                False,
                None,
                None,
                "Please enter a valid 10-digit Indian mobile number (e.g., 9876543210)."
            )

        normalized = f"91{cleaned}"
        masked = f"+91 {cleaned[:2]}****{cleaned[-4:]}"
        return True, normalized, masked, None

    @staticmethod
    def normalize_upi(raw_upi: str) -> Tuple[bool, Optional[str], Optional[str], Optional[str]]:
        """
        Validates and normalizes UPI IDs.
        Returns (is_valid, normalized_id, masked_id, error_message).
        Format: username@handle (e.g., rahul99@okhdfcbank, 9876543210@paytm)
        Normalized: rahul99@okhdfcbank (lowercased, stripped)
        Masked: rah***@okhdfcbank
        """
        if not raw_upi or not isinstance(raw_upi, str):
            return False, None, None, "UPI ID is required"

        cleaned = raw_upi.strip().lower()

        # UPI pattern: username@provider
        # Username can have alphanumeric, dots, underscores, hyphens
        # Provider usually letters (e.g. okhdfcbank, paytm, ybl, axl, icici, sbi)
        upi_pattern = r"^[a-zA-Z0-9.\-_]{2,64}@[a-zA-Z0-9]{2,32}$"
        if not re.match(upi_pattern, cleaned):
            return (
                False,
                None,
                None,
                "Invalid UPI ID format. Expected format: username@handle (e.g., name@okhdfcbank or 9876543210@paytm)."
            )

        parts = cleaned.split("@")
        username = parts[0]
        handle = parts[1]

        if len(username) <= 3:
            masked_user = f"{username[0]}***"
        elif len(username) <= 6:
            masked_user = f"{username[:2]}***{username[-1]}"
        else:
            masked_user = f"{username[:3]}****{username[-2:]}"

        masked = f"{masked_user}@{handle}"
        return True, cleaned, masked, None

    @classmethod
    def normalize_identifier(cls, id_type: str, raw_value: str) -> Tuple[bool, Optional[str], Optional[str], Optional[str]]:
        id_type_clean = id_type.strip().lower()
        if id_type_clean in ["phone", "mobile", "number"]:
            return cls.normalize_phone(raw_value)
        elif id_type_clean in ["upi", "upi_id"]:
            return cls.normalize_upi(raw_value)
        else:
            return False, None, None, f"Unsupported identifier type: {id_type}. Must be 'phone' or 'upi'."
