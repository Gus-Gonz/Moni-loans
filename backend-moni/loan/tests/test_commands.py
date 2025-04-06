from django.core.management import call_command
from django.test import TestCase, override_settings
from django.conf import settings
from loan.models import LoanRequest
from unittest.mock import patch


class SeedLoansCommandTest(TestCase):

    def test_command_creates_5_loans_in_local_env(self):
        settings.ENVIRONMENT = "local"
        settings.DEBUG = True

        call_command("seed_loans")
        self.assertEqual(LoanRequest.objects.count(), 5)

    def test_command_skips_if_loans_already_exists(self):
        settings.ENVIRONMENT = "local"
        settings.DEBUG = True

        LoanRequest.objects.create(
            id="20123456789",
            full_name="Test User",
            gender="M",
            email="test@example.com",
            amount=10000,
            status="REJ"
        )

        call_command("seed_loans")
        self.assertEqual(LoanRequest.objects.count(), 1)

    def test_command_does_nothing_in_test_env(self):
        settings.ENVIRONMENT = "test"
        settings.DEBUG = True

        call_command("seed_loans")
        self.assertEqual(LoanRequest.objects.count(), 0)
