from django.test import TestCase
from unittest.mock import patch
from loan.services import LoanValidationService

from requests import RequestException

class LoanValidationServiceTest(TestCase):

    @patch("loan.services.requests.post")
    def test_check_loan_eligibility_approved(self, mock_post):
        mock_post.return_value.status_code = 200
        mock_post.return_value.json.return_value = {"status": "approved"}

        result = LoanValidationService.check_loan_eligibility("20123456789")

        self.assertTrue(result)
        mock_post.assert_called_once()

    @patch("loan.services.requests.post")
    def test_check_loan_eligibility_rejected(self, mock_post):
        mock_post.return_value.status_code = 200
        mock_post.return_value.json.return_value = {"status": "rejected"}

        result = LoanValidationService.check_loan_eligibility("20123456789")

        self.assertFalse(result)

    @patch("loan.services.requests.post")
    def test_check_loan_eligibility_request_fails(self, mock_post):
        mock_post.side_effect = RequestException("Request failed")

        result = LoanValidationService.check_loan_eligibility("20123456789")

        self.assertFalse(result)
