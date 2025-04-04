from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import MeAPIView

admin_router = DefaultRouter()

urlpatterns = [
    path('me/', MeAPIView.as_view(), name='me'),
]
