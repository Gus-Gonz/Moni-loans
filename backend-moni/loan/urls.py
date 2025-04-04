from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LoanRequestAPIView, AdminLoanRequestAPIView


admin_router = DefaultRouter()
admin_router.register(r'loans', AdminLoanRequestAPIView, basename='admin-loans')


urlpatterns = [
    path('loan-requests/', LoanRequestAPIView.as_view(), name='loan-requests'),

    # Admin endpoints
    path("admin/", include(admin_router.urls) ) 
]
