from rest_framework import serializers
from django.contrib.auth.models import AbstractUser


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = AbstractUser
        fields = [
            'id',
            'username',
            'email',
            'first_name',
            'last_name',
        ]
