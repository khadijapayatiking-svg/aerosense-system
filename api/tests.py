from django.contrib.auth.models import User
from rest_framework.test import APIClient, APITestCase


class HealthEndpointTests(APITestCase):
    def test_health_is_public(self):
        response = self.client.get("/api/health/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {"status": "ok", "service": "aerosense"})

    def test_health_returns_json_for_an_html_accept_header(self):
        response = self.client.get("/api/health/", HTTP_ACCEPT="text/html")
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response["Content-Type"].startswith("application/json"))


class CsrfEndpointTests(APITestCase):
    def test_csrf_sets_readable_cookie(self):
        response = self.client.get("/api/auth/csrf/")
        self.assertEqual(response.status_code, 204)
        self.assertIn("csrftoken", response.cookies)


class LoginEndpointTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="demo", password="correct-horse")

    def test_login_success(self):
        response = self.client.post(
            "/api/auth/login/", {"username": "demo", "password": "correct-horse"}
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["user"]["username"], "demo")

        me_response = self.client.get("/api/auth/me/")
        self.assertEqual(me_response.status_code, 200)
        self.assertEqual(me_response.json()["user"]["username"], "demo")

    def test_login_failure(self):
        response = self.client.post(
            "/api/auth/login/", {"username": "demo", "password": "wrong"}
        )
        self.assertEqual(response.status_code, 400)


class MeEndpointTests(APITestCase):
    def test_me_requires_authentication(self):
        self.assertEqual(self.client.get("/api/auth/me/").status_code, 403)

    def test_me_returns_json_for_an_html_accept_header(self):
        response = self.client.get("/api/auth/me/", HTTP_ACCEPT="text/html")
        self.assertEqual(response.status_code, 403)
        self.assertTrue(response["Content-Type"].startswith("application/json"))

    def test_me_returns_authenticated_user(self):
        self.client.force_authenticate(user=User.objects.create_user("demo"))
        response = self.client.get("/api/auth/me/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["user"]["username"], "demo")


class LogoutEndpointTests(APITestCase):
    def test_logout_requires_authentication(self):
        self.assertEqual(self.client.post("/api/auth/logout/").status_code, 403)

    def test_logout_clears_session(self):
        user = User.objects.create_user(username="demo", password="correct-horse")
        self.client.force_login(user)
        self.assertEqual(self.client.post("/api/auth/logout/").status_code, 204)
        self.assertEqual(self.client.get("/api/auth/me/").status_code, 403)


class LogoutCsrfTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="demo", password="correct-horse"
        )

    def test_logout_without_csrf_is_rejected(self):
        client = APIClient(enforce_csrf_checks=True)
        client.force_login(self.user)

        self.assertEqual(client.post("/api/auth/logout/").status_code, 403)

    def test_logout_with_csrf_clears_session(self):
        client = APIClient(enforce_csrf_checks=True)
        client.force_login(self.user)

        client.get("/api/auth/csrf/")
        token = client.cookies["csrftoken"].value
        response = client.post("/api/auth/logout/", HTTP_X_CSRFTOKEN=token)

        self.assertEqual(response.status_code, 204)
        self.assertEqual(client.get("/api/auth/me/").status_code, 403)


class LoginCsrfTests(APITestCase):
    def setUp(self):
        User.objects.create_user(username="demo", password="correct-horse")

    def test_login_without_csrf_is_rejected(self):
        client = APIClient(enforce_csrf_checks=True)
        response = client.post(
            "/api/auth/login/", {"username": "demo", "password": "correct-horse"}
        )
        self.assertEqual(response.status_code, 403)

    def test_login_with_csrf_succeeds(self):
        client = APIClient(enforce_csrf_checks=True)
        client.get("/api/auth/csrf/")
        token = client.cookies["csrftoken"].value
        response = client.post(
            "/api/auth/login/",
            {"username": "demo", "password": "correct-horse"},
            HTTP_X_CSRFTOKEN=token,
        )
        self.assertEqual(response.status_code, 200)
