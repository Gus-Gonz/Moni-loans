from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.response import Response
from rest_framework.views import APIView


from django.core.exceptions import PermissionDenied
from main.permissions import IsAnalystOrAdmin

from .models import LoanRequest
from .serializers import LoanRequestSerializer
from .services import LoanValidationService


class LoanRequestAPIView(APIView):
    """API for creating a loan requests."""

    def post(self, request, *args, **kwargs):
        serializer = LoanRequestSerializer(data=request.data)
        if serializer.is_valid():
            user_id_number = serializer.validated_data["id_number"]

            is_approved = LoanValidationService.check_loan_eligibility(
                user_id_number
            )

            status_choice = (
                LoanRequest.StatusChoices.APPROVED
                if is_approved else
                LoanRequest.StatusChoices.REJECTED
            )

            loan_request = serializer.save(status=status_choice)

            return Response(LoanRequestSerializer(loan_request).data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AdminLoanRequestAPIView(viewsets.ModelViewSet):
    """Admin API for managing loan requests"""

    queryset = LoanRequest.objects.all()
    serializer_class = LoanRequestSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, IsAnalystOrAdmin]

    def create(self, *args, **kwargs):
        return Response(
            status=status.HTTP_400_BAD_REQUEST
        )

    @action(detail=True, methods=["post"], url_path="approve")
    def approve_loan(self, request, pk=None):
        loan = self.get_object()
        loan.status = LoanRequest.StatusChoices.APPROVED
        loan.save()

        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=True, methods=["post"], url_path="reject")
    def reject_loan(self, request, pk=None):
        loan = self.get_object()
        loan.status = LoanRequest.StatusChoices.REJECTED
        loan.save()

        return Response(status=status.HTTP_204_NO_CONTENT)