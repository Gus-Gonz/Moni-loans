from rest_framework import serializers
from .models import LoanRequest


class LoanRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = LoanRequest
        fields = [
            "id",
            'id_number',
            'full_name',
            'gender',
            'email',
            'amount',
            'status',
            'created_at',
            'updated_at',
        ]
        read_only_fields = [
            "id",
            'status',
            'created_at',
            'updated_at',
        ]
