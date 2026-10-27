import unittest

from django.conf import settings
from django.core.exceptions import ImproperlyConfigured
from django.test import SimpleTestCase, TestCase

from aerosense.settings import validate_allowed_hosts


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


class AllowedHostsValidationTests(SimpleTestCase):
    def test_debug_allows_wildcards(self):
        validate_allowed_hosts(["*"], debug=True)
        validate_allowed_hosts([".example.com"], debug=True)

    def test_production_requires_at_least_one_host(self):
        with self.assertRaises(ImproperlyConfigured):
            validate_allowed_hosts([], debug=False)

    def test_production_rejects_the_star_wildcard(self):
        with self.assertRaises(ImproperlyConfigured):
            validate_allowed_hosts(["*"], debug=False)

    def test_production_rejects_leading_dot_wildcards(self):
        with self.assertRaises(ImproperlyConfigured):
            validate_allowed_hosts([".example.com"], debug=False)

    def test_production_allows_explicit_hosts(self):
        validate_allowed_hosts(["example.com", "localhost"], debug=False)


class SpaShellTests(TestCase):
    def test_root_serves_spa_shell(self):
        response = self.client.get("/")
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, '<div id="root"></div>')

    def test_client_route_serves_spa_shell(self):
        response = self.client.get("/fields")
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, '<div id="root"></div>')

    def test_api_health_is_not_swallowed(self):
        response = self.client.get("/api/health/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["status"], "ok")

    def test_unknown_api_path_is_not_swallowed(self):
        self.assertEqual(self.client.get("/api/unknown/").status_code, 404)

    def test_bare_admin_prefix_is_not_swallowed(self):
        response = self.client.get("/admin")
        self.assertEqual(response.status_code, 301)
        self.assertEqual(response.url, "/admin/")

    def test_bare_api_prefix_is_not_swallowed(self):
        # /api/ has no resolving pattern, so APPEND_SLASH cannot redirect;
        # Django 404s instead. The shell must not be served either way.
        response = self.client.get("/api")
        self.assertEqual(response.status_code, 404)
        self.assertNotContains(response, '<div id="root"></div>', status_code=404)

    # Django's test runner forces settings.DEBUG to False, so use the Vite
    # dev-mode flag captured from the real configuration at import time.
    @unittest.skipUnless(
        not settings.DJANGO_VITE["default"]["dev_mode"]
        and (settings.STATIC_ROOT / "frontend" / "manifest.json").exists(),
        "requires a production build and collectstatic",
    )
    def test_shell_includes_hashed_frontend_assets(self):
        response = self.client.get("/")

        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "/static/frontend/assets/")
        self.assertContains(response, 'rel="stylesheet"')
        self.assertContains(response, 'type="module"')
