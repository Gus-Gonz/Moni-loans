from django.test import TestCase
from rest_framework.test import APIClient
from loan.models import LoanRequest
from unittest.mock import patch
from django.urls import reverse



class LoanRequestAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.list_url = reverse("loan-requests")

    @patch("loan.services.LoanValidationService.check_loan_eligibility", return_value=True)
    def test_create_loan_request_approved(self, _):
        data = {
            "id_number": "20123456789",
            "full_name": "Juan Pérez",
            "gender": "M",
            "email": "juan@example.com",
            "amount": 15000
        }

        response = self.client.post(self.list_url, data, format="json")

        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data["status"], "APR")
        self.assertEqual(LoanRequest.objects.count(), 1)

    @patch("loan.services.LoanValidationService.check_loan_eligibility", return_value=False)
    def test_create_loan_request_rejected(self, _):
        data = {
            "id_number": "20123456789",
            "full_name": "Juan Pérez",
            "gender": "M",
            "email": "juan@example.com",
            "amount": 15000
        }

        response = self.client.post(self.list_url, data, format="json")

        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data["status"], "REJ")
        self.assertEqual(LoanRequest.objects.count(), 1)

    @patch("loan.services.LoanValidationService.check_loan_eligibility", return_value=True)
    def test_create_loan_request_invalid_email(self, _):
        data = {
            "id_number": "20123456789",
            "full_name": "Juan Pérez",
            "gender": "M",
            "email": "not-an-email",
            "amount": 15000
        }

        response = self.client.post(self.list_url, data, format="json")

        self.assertEqual(response.status_code, 400)
        self.assertIn("email", response.data)
        self.assertEqual(LoanRequest.objects.count(), 0)

    @patch("loan.services.LoanValidationService.check_loan_eligibility", return_value=True)
    def test_create_loan_request_missing_amount(self, _):
        data = {
            "id_number": "20123456789",
            "full_name": "Juan Pérez",
            "gender": "M",
            "email": "juan@example.com",
            # without amount
        }


        response = self.client.post(self.list_url, data, format="json")

        self.assertEqual(response.status_code, 400)
        self.assertIn("amount", response.data)
        self.assertEqual(LoanRequest.objects.count(), 0)
