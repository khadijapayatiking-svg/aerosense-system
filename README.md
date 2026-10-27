# AeroSense

Django project for aerial crop monitoring (thesis). The backend is named **aerosense**; a single home template is in place while the React frontend is still planned.

## Requirements

- Python 3.11+
- pip
- Node.js 22.12+ and npm 10+ (for the planned React frontend; see `plan.md`)

## Setup

From the project root:

```bash
python -m venv .venv
```

**Windows (PowerShell)**

```powershell
.\.venv\Scripts\Activate.ps1
Copy-Item .env.example .env
# Generate a secret key and replace the placeholder in .env:
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

**macOS / Linux**

```bash
source .venv/bin/activate
cp .env.example .env
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

Open [http://127.0.0.1:8000/](http://127.0.0.1:8000/) for the home page. Admin is at `/admin/`.

## Configuration

Settings are read from `.env` via `python-dotenv`; `.env` is gitignored and must never be committed.

| Variable | Purpose |
|---|---|
| `DJANGO_SECRET_KEY` | Required 50+ character secret |
| `DJANGO_DEBUG` | `True` for local development, `False` in production |
| `DJANGO_ALLOWED_HOSTS` | Comma-separated host names |
| `DJANGO_CSRF_TRUSTED_ORIGINS` | Comma-separated trusted origins, with scheme |
| `DJANGO_SECURE_SSL_REDIRECT` | Optional override; defaults to `not DEBUG` |
| `DJANGO_SECURE_HSTS_SECONDS` | Optional override; defaults to `0` in development and 1 year in production |
| `DJANGO_TRUST_PROXY_HEADERS` | Set `True` only behind a trusted reverse proxy |

The project fails fast when `DJANGO_SECRET_KEY` is missing or shorter than 50 characters.

## Security Baseline

- The secret key is loaded from the environment; the old hardcoded key is removed.
- `DEBUG` defaults to `False`; local development opts in through `.env`.
- Secure session/CSRF cookies, SSL redirect, and HSTS are enabled automatically when `DEBUG=False`.
- `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: same-origin`, and `Cross-Origin-Opener-Policy: same-origin` are sent.
- Session cookies remain `HttpOnly`; the CSRF cookie is readable by the future React client so it can send `X-CSRFToken`.
- Before deploying, run:

```powershell
$env:DJANGO_DEBUG = "False"
$env:DJANGO_ALLOWED_HOSTS = "your-domain.example"
$env:DJANGO_CSRF_TRUSTED_ORIGINS = "https://your-domain.example"
python manage.py check --deploy
```

Serve the site over HTTPS and enable HSTS only after TLS is verified.

## Project Layout

```text
aerosense/          # Django project settings and URLs
home/               # Home app (landing view)
templates/home.html # Landing page template
static/css/home.css # Starter stylesheet
plan.md             # Approved frontend integration and security plan
.env.example        # Environment variable template
manage.py
requirements.txt
```

## Testing

```powershell
python manage.py test
python manage.py check
python manage.py check --deploy
```

Implementation planning is maintained locally by the repository owner until the frontend work is complete.
