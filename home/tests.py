from django.conf import settings
from django.test import TestCase


class SecurityConfigurationTests(TestCase):
    def test_secret_key_is_not_the_insecure_development_default(self):
        self.assertNotIn("django-insecure", settings.SECRET_KEY)
        self.assertGreaterEqual(len(settings.SECRET_KEY), 50)

    def test_allowed_hosts_are_configured(self):
        configured_hosts = set(settings.ALLOWED_HOSTS) - {"testserver"}
        self.assertTrue(configured_hosts)

    def test_security_headers_are_sent(self):
        response = self.client.get("/")

        self.assertEqual(response.headers["X-Content-Type-Options"], "nosniff")
        self.assertEqual(response.headers["X-Frame-Options"], "DENY")
        self.assertEqual(response.headers["Referrer-Policy"], "same-origin")
        self.assertEqual(
            response.headers["Cross-Origin-Opener-Policy"], "same-origin"
        )

    def test_csrf_cookie_is_readable_by_the_frontend(self):
        self.assertFalse(settings.CSRF_COOKIE_HTTPONLY)

    def test_session_cookie_is_not_readable_by_javascript(self):
        self.assertTrue(settings.SESSION_COOKIE_HTTPONLY)
