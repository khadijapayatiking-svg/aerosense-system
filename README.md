# AeroSense

Django + React single-page application for aerial crop monitoring (thesis).
Django 5.2 serves the API and the SPA shell, React 19 and TypeScript render the
client, and authentication uses same-origin Django sessions. The dashboard is
populated with clearly labelled sample data until crop-monitoring APIs exist.

## Prerequisites

- Python 3.11+
- Node.js 22.12+
- npm 10+
- Git

## Backend setup

Create a virtual environment and install the Python dependencies from the
project root.

**Windows (PowerShell)**

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
```

**macOS / Linux**

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```

Generate a secret key and replace the `DJANGO_SECRET_KEY` placeholder in `.env`.
The value must be at least 50 characters; settings fail fast when it is missing
or too short. The command is the same on Windows, macOS, and Linux; use `python3`
instead of `python` if your system does not provide `python`.

```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

Then apply the database migrations:

```bash
python manage.py migrate
```

On macOS/Linux, use `python3 manage.py migrate` if `python` is unavailable.

`.env` is gitignored and must never be committed. `.env.example` contains
placeholders only.

## Frontend setup

Install the Node dependencies once, from the `frontend/` directory:

```powershell
cd frontend
npm install
```

## Development

Run the Django server and the Vite dev server in two terminals.

**Terminal 1 — Django**

```powershell
.\.venv\Scripts\python.exe manage.py runserver
```

**Terminal 2 — Vite**

```powershell
cd frontend
npm run dev
```

Vite listens on `http://localhost:5173` and uses a strict port, so it fails
rather than silently moving to another port. Open the application through
Django at [http://127.0.0.1:8000/](http://127.0.0.1:8000/), not through the Vite
URL.

Django serves `templates/spa.html` for client-side routes. When
`DJANGO_DEBUG=True`, `django-vite` points the module script tags at the Vite dev
server so React Fast Refresh and HMR work. `DJANGO_DEBUG=True` is required for
this dev mode; with `DEBUG=False`, Django expects a production build and its
manifest instead. Vite is only the module and HMR server — the SPA is opened and
served through Django. Because the app is same-origin, `DJANGO_CSRF_TRUSTED_ORIGINS`
only needs the Django origins in development; add the Vite origin only if you
deliberately split the frontend and backend origins.

## Login

Create an account, then sign in through the SPA:

```powershell
python manage.py createsuperuser
```

Visit [http://127.0.0.1:8000/login](http://127.0.0.1:8000/login) and use the
Django session credentials. The same account also works at `/admin/`.

### API endpoints

| Method | Path | Permission | Result |
|---|---|---|---|
| `GET` | `/api/health/` | Public | `200` with `{"status": "ok", "service": "aerosense"}` |
| `GET` | `/api/auth/csrf/` | Public | `204` and sets the readable `csrftoken` cookie |
| `POST` | `/api/auth/login/` | Public, CSRF required | `200` with `{"user": {...}}`; `400` for invalid credentials; `403` without a CSRF token |
| `POST` | `/api/auth/logout/` | Authenticated, CSRF required | `204` and clears the session |
| `GET` | `/api/auth/me/` | Authenticated | `200` with `{"user": {...}}`; `403` when anonymous |

Unsafe requests must send the `X-CSRFToken` header. The React client fetches
`/api/auth/csrf/` first and reads the cookie per request because Django rotates
the token during login.

## Production build

Build the React application, then collect the static files:

```powershell
cd frontend
npm run build
cd ..
python manage.py collectstatic --noinput
```

`npm run build` writes the hashed bundles and `manifest.json` to
`static/frontend/`. `collectstatic` copies them, along with Django admin and
other static assets, into `staticfiles/`.

Run the site with production settings, for example:

```powershell
$env:DJANGO_DEBUG = "False"
$env:DJANGO_ALLOWED_HOSTS = "your-domain.example"
$env:DJANGO_CSRF_TRUSTED_ORIGINS = "https://your-domain.example"
.\.venv\Scripts\python.exe manage.py check --deploy
```

```bash
export DJANGO_DEBUG=False
export DJANGO_ALLOWED_HOSTS=your-domain.example
export DJANGO_CSRF_TRUSTED_ORIGINS=https://your-domain.example
python manage.py check --deploy
```

Serve the application over HTTPS behind the WSGI/ASGI server of your choice
(Gunicorn, Uvicorn, Waitress, and so on). WhiteNoise serves the collected
`staticfiles/` directory; it is not intended for user-uploaded media. Configure
your web server or object storage for `media/` separately.

`static/frontend/` and `staticfiles/` are generated and gitignored. A fresh
checkout must run `npm run build` and `collectstatic` before production serving.

## Configuration

Settings are read from `.env` via `python-dotenv`. `.env` is gitignored and must
never be committed.

| Variable | Purpose |
|---|---|
| `DJANGO_SECRET_KEY` | Required secret of at least 50 characters; settings fail fast when missing or too short |
| `DJANGO_DEBUG` | `True` for local development, `False` in production. Defaults to `False` |
| `DJANGO_ALLOWED_HOSTS` | Comma-separated host names. Required when `DEBUG=False`; wildcards are rejected in production |
| `DJANGO_CSRF_TRUSTED_ORIGINS` | Comma-separated trusted origins with scheme. Defaults to the local Django origins in development |
| `DJANGO_SECURE_SSL_REDIRECT` | Optional override; defaults to `not DEBUG` |
| `DJANGO_SECURE_HSTS_SECONDS` | Optional override; defaults to `0` in development and one year (`31536000`) in production |
| `DJANGO_SECURE_HSTS_INCLUDE_SUBDOMAINS` | Optional override; defaults to `not DEBUG` |
| `DJANGO_SECURE_HSTS_PRELOAD` | Optional override; defaults to `not DEBUG` |
| `DJANGO_TRUST_PROXY_HEADERS` | Set `True` only behind a trusted reverse proxy that sets `X-Forwarded-Proto`; defaults to `False` |

Secure defaults: `DEBUG` is `False`; secure session/CSRF cookies, SSL redirect,
and HSTS are enabled automatically when `DEBUG=False`; HSTS is off in
development. Enable HSTS only after HTTPS is verified.

## Security baseline

- The secret key comes from the environment. The insecure development key is
  gone, and startup fails when the key is missing or shorter than 50 characters.
- `DEBUG` defaults to `False`; local development opts in through `.env`.
- Session cookies are `HttpOnly` and `SameSite=Lax`. The CSRF cookie is
  deliberately not `HttpOnly` so the React client can read it and echo it in the
  `X-CSRFToken` header.
- Authentication is same-origin, so no CORS configuration is needed and
  credentialed wildcard origins are not enabled.
- `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`,
  `Referrer-Policy: same-origin`, and `Cross-Origin-Opener-Policy: same-origin`
  are sent.
- React escapes rendered values by default; the client does not use
  `dangerouslySetInnerHTML`.
- The dashboard uses clearly labelled sample data. There are no
  crop-monitoring domain models, imagery pipelines, or real field/flight APIs
  yet, and the fields, flights, and alerts pages are placeholders.

Before deploying, run `python manage.py check --deploy` with production
environment variables and serve the site over HTTPS.

## Testing

Backend:

```powershell
.\.venv\Scripts\python.exe manage.py check
.\.venv\Scripts\python.exe manage.py test
```

Frontend:

```powershell
cd frontend
npm run lint
npm run test -- --run
npm run build
cd ..
```

Production settings check:

```powershell
$env:DJANGO_DEBUG = "False"
$env:DJANGO_ALLOWED_HOSTS = "example.com"
$env:DJANGO_CSRF_TRUSTED_ORIGINS = "https://example.com"
.\.venv\Scripts\python.exe manage.py check --deploy
Remove-Item Env:DJANGO_DEBUG
Remove-Item Env:DJANGO_ALLOWED_HOSTS
Remove-Item Env:DJANGO_CSRF_TRUSTED_ORIGINS
```

macOS / Linux:

```bash
export DJANGO_DEBUG=False
export DJANGO_ALLOWED_HOSTS=example.com
export DJANGO_CSRF_TRUSTED_ORIGINS=https://example.com
python manage.py check --deploy
```

The deployment check must report no unresolved security warnings. After the
build, `python manage.py collectstatic --noinput` verifies that the production
static pipeline works.

## Project layout

```text
aerosense/            # Django settings, URLs, WSGI/ASGI entry points
api/                  # DRF views, serializers, URLs, and API tests
home/                 # App identity plus security and SPA-shell tests
frontend/             # React source, Vite config, package files
templates/spa.html    # Django-rendered SPA shell
static/               # Django static dir; static/frontend/ holds generated, gitignored build output
staticfiles/          # collectstatic output (gitignored)
requirements.txt      # Python dependencies
.env.example          # Environment variable template
manage.py             # Django management entry point
```

## Current scope

- The dashboard shows sample statistics, an NDVI trend, sample alerts, and
  recent flights. The data is labelled as sample data and is not connected to
  field records.
- The fields, flights, and alerts pages are placeholders for future
  crop-monitoring features.
- Only the authentication and health endpoints exist; there are no
  crop-monitoring domain models, imagery processing, or telemetry ingestion yet.
