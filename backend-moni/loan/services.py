import requests
import logging

from django.conf import settings

logger = logging.getLogger(__name__)

class LoanValidationService:
    """Service to validate loan requests via external API."""

    API_URL = settings.LOAN_VALIDATION_API_URL
    API_KEY = settings.LOAN_VALIDATION_API_KEY

    @classmethod
    def check_loan_eligibility(cls, user_id_number: str) -> bool:
        """Checks if the loan request is approved or rejected."""
        headers = {"x-api-key": cls.API_KEY}
        payload = {"cuil": user_id_number}

        try:
            response = requests.post(
                cls.API_URL,
                json=payload,
                headers=headers,
                timeout=5
            )

            response.raise_for_status()

            data = response.json()

            logger.info(f"Loan validation request successful: {data}")

            return data.get("status") == "approved"

        except requests.RequestException as e:
            logger.error(f"Loan validation request failed: {e}")

            return False
