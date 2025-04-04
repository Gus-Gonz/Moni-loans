from django.contrib.auth.models import User, Group
from rest_framework.test import APITestCase
from rest_framework.reverse import reverse
from rest_framework_simplejwt.tokens import RefreshToken


class MeEndpointTest(APITestCase):
    def setUp(self):
        self.analyst_user = User.objects.create_user(
            username="test_analyst", password="pass1234")

        analyst_group = Group.objects.get(name="Analyst")
        self.analyst_user.groups.add(analyst_group)

        refresh = RefreshToken.for_user(self.analyst_user)
        self.token = str(refresh.access_token)

    def test_me_returns_user_info(self):
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.token}")
        response = self.client.get(reverse("me"))

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["username"], "test_analyst")
        self.assertIn("auth.view_loan", response.data["permissions"])
        self.assertIn("Analyst", response.data["groups"])

    def test_unauthenticated_user_gets_401(self):
        response = self.client.get(reverse("me"))
        self.assertEqual(response.status_code, 401)
