from django.core.management.base import BaseCommand
from loan.models import LoanRequest
from django.utils import timezone
import random
import faker

fake = faker.Faker()


class Command(BaseCommand):
    help = "Seed 5 fake loan requests (only in local environment)"

    def handle(self, *args, **kwargs):
        if not self.is_local():
            self.stdout.write(self.style.WARNING(
                "Not in local environment. Skipping seeding."))
            return

        if LoanRequest.objects.count():
            self.stdout.write(self.style.SUCCESS(
                "Loans already exist. Skipping seeding."))
            return

        for _ in range(5):
            LoanRequest.objects.create(
                full_name=fake.name(),
                id_number=fake.identity_card_number[:16],
                amount=random.randint(1000, 10000),
                status=random.choice(["REJ", "APR"]),
                created_at=timezone.now(),
                email=fake.email(),
                gender=random.choice(["F", "M", "O"])
            )

        self.stdout.write(self.style.SUCCESS(
            "Successfully seeded 5 loan requests."))

    def is_local(self):
        from django.conf import settings
        return settings.DEBUG and settings.ENVIRONMENT == "local"
