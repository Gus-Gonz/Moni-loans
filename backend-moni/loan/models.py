from django.db import models
from django.contrib.auth.models import AbstractUser


class LoanRequest(models.Model):
    """Model for loan requests."""

    class StatusChoices(models.TextChoices):
        PENDING = 'PEN', 'Pending'
        APPROVED = 'APR', 'Approved'
        REJECTED = 'REJ', 'Rejected'

    class GenderChoices(models.TextChoices):
        MALE = 'M', 'Male'
        FEMALE = 'F', 'Female'
        OTHER = 'O', 'Other'

    id_number = models.CharField(max_length=16, unique=True)
    full_name = models.CharField(max_length=255)
    gender = models.CharField(max_length=10, choices=GenderChoices.choices)
    email = models.EmailField()
    amount = models.DecimalField(max_digits=28, decimal_places=2)
    status = models.CharField(
        max_length=10,
        choices=StatusChoices.choices,
        default=StatusChoices.PENDING
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
