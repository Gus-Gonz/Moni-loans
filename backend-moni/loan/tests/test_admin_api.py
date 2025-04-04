from django.contrib.auth.models import User, Group
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken
from loan.models import LoanRequest
from django.test import TestCase
from django.urls import reverse


class AdminLoanRequestAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()

        self.loan = LoanRequest.objects.create(
            id="20123456789",
            full_name="Test User",
            gender="M",
            email="test@example.com",
            amount=10000,
            status="PEN"
        )

        self.analyst_user = User.objects.create_user(
            username="test_analyst", password="pass1234")
        self.admin_user = User.objects.create_user(
            username="test_admin", password="pass1234")

        analyst_group = Group.objects.get(name="Analyst")
        admin_group = Group.objects.get(name="Admin")
        self.analyst_user.groups.add(analyst_group)
        self.admin_user.groups.add(admin_group)

        # Tokens JWT
        self.analyst_token = str(RefreshToken.for_user(
            self.analyst_user).access_token)
        self.admin_token = str(RefreshToken.for_user(
            self.admin_user).access_token)

        self.list_url = reverse("admin-loans-list")
        self.detail_url = reverse("admin-loans-detail", args=[self.loan.id])

    def test_analyst_can_list_loans(self):
        self.client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {self.analyst_token}")

        response = self.client.get(self.list_url)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)

    def test_admin_can_list_loans(self):
        self.client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {self.admin_token}")

        response = self.client.get(self.list_url)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)

    def test_admin_can_update_loan(self):
        self.client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {self.admin_token}")
        payload = {"amount": 2000}

        response = self.client.patch(self.detail_url, payload, format="json")

        self.assertEqual(response.status_code, 200)
        self.loan.refresh_from_db()
        self.assertEqual(self.loan.amount, 2000)

    def test_analyst_cannot_update_loan(self):
        self.client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {self.analyst_token}")
        payload = {"status": "REJ"}

        response = self.client.patch(self.detail_url, payload, format="json")

        self.assertEqual(response.status_code, 403)

    def test_unauthenticated_user_cannot_access_admin_loans(self):
        self.client.credentials()  # Remove any token

        url = reverse("admin-loans-list")
        response = self.client.get(url)

        self.assertEqual(response.status_code, 401)

    def test_admin_can_approve_loan(self):
        self.client.force_authenticate(user=self.admin_user)

        url = reverse("admin-loans-approve-loan", args=[self.loan.pk])
        response = self.client.post(url)

        self.assertEqual(response.status_code, 204)
        self.loan.refresh_from_db()
        self.assertEqual(self.loan.status, "APR")

    def test_admin_can_reject_loan(self):
        self.client.force_authenticate(user=self.admin_user)

        url = reverse("admin-loans-reject-loan", args=[self.loan.pk])
        response = self.client.post(url)

        self.assertEqual(response.status_code, 204)
        self.loan.refresh_from_db()
        self.assertEqual(self.loan.status, "REJ")

    def test_analyst_cannot_approve_or_reject_loan(self):
        self.client.force_authenticate(user=self.analyst_user)

        approve_url = reverse("admin-loans-approve-loan", args=[self.loan.pk])
        reject_url = reverse("admin-loans-reject-loan", args=[self.loan.pk])

        approve_response = self.client.post(approve_url)
        reject_response = self.client.post(reject_url)

        self.assertEqual(approve_response.status_code, 403)
        self.assertEqual(reject_response.status_code, 403)
