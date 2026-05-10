import type { Lesson } from '@/types/lesson'

export const productionLessons: Lesson[] = [
  // ─────────────────────────────────────────────────────────────
  // LESSON 15: Docker & Containerization
  // ─────────────────────────────────────────────────────────────
  {
    id: 'pb-prod-docker',
    moduleId: 'python-backend',
    phaseId: 'pb-production',
    phaseNumber: 8,
    order: 15,
    title: 'Docker: Containerizing Your FastAPI App',
    description: 'Build production-grade Docker images for Python APIs with multi-stage builds, proper layer caching, Docker Compose for local development, and security best practices.',
    duration: '22 min',
    difficulty: 'intermediate',
    objectives: [
      'Write a multi-stage Dockerfile that produces a slim production image',
      'Use Docker Compose for local development with PostgreSQL and Redis',
      'Configure environment variables securely in containers',
      'Understand layer caching to keep builds fast',
    ],
    content: [
      {
        type: 'text',
        markdown: `## Why Docker for Python APIs?

A Docker container packages your app + its exact runtime environment. This eliminates "works on my machine" — if it runs in Docker locally, it runs the same way in production.

For a FastAPI app, the container includes:
- Python runtime
- Your application code
- All dependencies (pinned versions)
- Environment configuration (via env vars, not baked in)

The image you build locally is the exact same image that runs in production.`,
      },
      {
        type: 'code',
        language: 'dockerfile',
        filename: 'Dockerfile',
        code: `# ── Stage 1: Builder ──────────────────────────────────────────
# Install dependencies in a builder stage, then copy only what we need
FROM python:3.12-slim AS builder

# Install uv for fast dependency installation
COPY --from=ghcr.io/astral-sh/uv:latest /uv /usr/local/bin/uv

WORKDIR /app

# Copy dependency files first (enables Docker layer caching)
# These layers are cached as long as pyproject.toml doesn't change
COPY pyproject.toml uv.lock ./

# Install dependencies to a separate location
RUN uv sync --frozen --no-dev --no-install-project


# ── Stage 2: Production image ─────────────────────────────────
FROM python:3.12-slim AS production

# Security: run as non-root user
RUN useradd --create-home --shell /bin/bash appuser
WORKDIR /home/appuser/app
USER appuser

# Copy the installed packages from builder
COPY --from=builder --chown=appuser:appuser /app/.venv /home/appuser/app/.venv

# Copy application code
COPY --chown=appuser:appuser ./app ./app

# Add the venv to PATH
ENV PATH="/home/appuser/app/.venv/bin:$PATH"

# Expose the port the app runs on
EXPOSE 8000

# Health check — Docker marks container as unhealthy if this fails
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/health')"

# Production server: Gunicorn manages Uvicorn workers
CMD ["gunicorn", "app.main:app", \
     "--workers", "4", \
     "--worker-class", "uvicorn.workers.UvicornWorker", \
     "--bind", "0.0.0.0:8000", \
     "--timeout", "120", \
     "--access-logfile", "-"]`,
        explanation: 'Multi-stage builds are critical. The builder stage installs all build tools and dev dependencies. The production stage only copies the final artifacts — resulting in a much smaller and more secure image.',
      },
      {
        type: 'code',
        language: 'yaml',
        filename: 'docker-compose.yml',
        code: `version: "3.9"

services:
  api:
    build:
      context: .
      target: production        # use the production stage
    ports:
      - "8000:8000"
    environment:
      DATABASE_URL: postgresql+asyncpg://postgres:postgres@db:5432/myapp
      REDIS_URL: redis://redis:6379/0
      SECRET_KEY: \${SECRET_KEY:-dev-secret-change-in-production}
      ENVIRONMENT: development
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_healthy
    volumes:
      - ./app:/home/appuser/app/app   # hot reload in development
    command: uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: myapp
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 3s
      retries: 5

  worker:
    build: .
    command: celery -A app.worker.celery_app worker --loglevel=info
    environment:
      DATABASE_URL: postgresql+asyncpg://postgres:postgres@db:5432/myapp
      REDIS_URL: redis://redis:6379/0
    depends_on:
      - db
      - redis

volumes:
  postgres_data:`,
        explanation: 'Use healthchecks with depends_on condition: service_healthy. Without this, your API starts before PostgreSQL is ready — causing connection errors.',
      },
      {
        type: 'code',
        language: 'python',
        filename: 'app/config.py',
        code: `from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache


class Settings(BaseSettings):
    """Application settings loaded from environment variables.
    
    Install: uv add pydantic-settings
    """
    # Database
    DATABASE_URL: str
    REDIS_URL: str = "redis://localhost:6379/0"

    # Security
    SECRET_KEY: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # App
    ENVIRONMENT: str = "development"
    DEBUG: bool = False
    ALLOWED_ORIGINS: list[str] = ["http://localhost:3000"]

    # Load from .env file in development
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )

    @property
    def is_production(self) -> bool:
        return self.ENVIRONMENT == "production"


@lru_cache
def get_settings() -> Settings:
    """Cache settings so they are only parsed once."""
    return Settings()


# Single instance used everywhere
settings = get_settings()`,
        explanation: 'pydantic-settings validates environment variables at startup. If DATABASE_URL is missing, your app fails immediately with a clear error — instead of crashing later when a DB call is made.',
      },
      {
        type: 'code',
        language: 'bash',
        filename: '.dockerignore',
        code: `# Exclude files not needed in the Docker image
.git
.github
.pytest_cache
__pycache__
*.pyc
*.pyo
.env
.env.*
tests/
alembic/versions/   # migrations run as a separate step, not baked in
*.md
.venv
node_modules`,
      },
      {
        type: 'callout',
        tone: 'production',
        title: 'Container Best Practices',
        content: `- Never bake secrets into the image — use environment variables or secrets manager
- Run as non-root user (shown in Dockerfile above)
- Use slim base images (python:3.12-slim, not python:3.12)
- Pin your base image version: python:3.12.4-slim, not python:latest
- Keep images under 300MB — use multi-stage builds and .dockerignore
- Run migrations as a separate step, not in the app startup`,
      },
      {
        type: 'exercise',
        title: 'Add a Migration Entrypoint',
        description: 'Create a docker-compose.override.yml that adds a migrate service. This service uses the same image but runs `alembic upgrade head` then exits. Add a Makefile target `make migrate` that runs this service. Also create a `make dev` target that starts all services in development mode with hot reload.',
        language: 'dockerfile',
        starterCode: `# docker-compose.override.yml
# This overrides docker-compose.yml for local development

version: "3.9"

services:
  api:
    # TODO: override command for hot reload

  # TODO: add a 'migrate' service that runs alembic upgrade head

---
# Makefile
.PHONY: dev migrate build

# TODO: make dev - start all services
# TODO: make migrate - run database migrations
# TODO: make build - build the Docker image`,
        solution: `# docker-compose.override.yml
version: "3.9"

services:
  api:
    command: uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
    volumes:
      - ./app:/home/appuser/app/app

  migrate:
    build: .
    command: alembic upgrade head
    environment:
      DATABASE_URL: postgresql://postgres:postgres@db:5432/myapp
    depends_on:
      db:
        condition: service_healthy
    profiles: ["migrate"]   # only runs when explicitly called

---
# Makefile
.PHONY: dev migrate build logs

dev:
\tdocker compose up --build

migrate:
\tdocker compose run --rm migrate

build:
\tdocker build -t my-api:latest .

logs:
\tdocker compose logs -f api`,
        hints: [
          'Use profiles: ["migrate"] so the migrate service does not start with docker compose up',
          'docker compose run --rm migrate runs the service and removes the container after exit',
          'Use postgresql:// (sync) not postgresql+asyncpg:// for Alembic — it uses a sync driver',
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // LESSON 16: Background Jobs with Celery
  // ─────────────────────────────────────────────────────────────
  {
    id: 'pb-prod-celery',
    moduleId: 'python-backend',
    phaseId: 'pb-production',
    phaseNumber: 8,
    order: 16,
    title: 'Celery: Durable Background Job Queues',
    description: 'Move slow operations (emails, reports, file processing) out of HTTP requests with Celery + Redis. Handle retries, rate limiting, and task monitoring.',
    duration: '22 min',
    difficulty: 'intermediate',
    objectives: [
      'Set up Celery with Redis as broker and result backend',
      'Define and call tasks from FastAPI route handlers',
      'Configure automatic retries with exponential backoff',
      'Monitor tasks with Flower and beat for scheduled jobs',
    ],
    content: [
      {
        type: 'text',
        markdown: `## FastAPI BackgroundTasks vs Celery

FastAPI's \`BackgroundTasks\` runs tasks in the same process after the response. It is fine for:
- Sending a single email
- Logging analytics events

Use Celery when you need:
- Tasks that survive server restarts (durable)
- Retries on failure
- Scheduled/recurring jobs (like cron)
- Rate limiting (e.g., max 100 emails/minute)
- Distributed workers across multiple machines
- Task progress tracking and monitoring`,
      },
      {
        type: 'code',
        language: 'bash',
        filename: 'terminal',
        code: `uv add celery[redis] flower

# celery        → task queue framework
# celery[redis] → includes redis support
# flower        → web UI for monitoring tasks`,
      },
      {
        type: 'code',
        language: 'python',
        filename: 'app/worker/celery_app.py',
        code: `from celery import Celery
from app.config import settings

# Create the Celery application
celery_app = Celery(
    "worker",
    broker=settings.REDIS_URL,          # Redis as message broker
    backend=settings.REDIS_URL,         # Redis to store task results
    include=["app.worker.tasks"],        # task modules to import
)

celery_app.conf.update(
    # Serialization
    task_serializer="json",
    result_serializer="json",
    accept_content=["json"],

    # Reliability
    task_acks_late=True,                # acknowledge task after completion, not on pickup
    worker_prefetch_multiplier=1,       # one task at a time per worker (fair processing)
    task_reject_on_worker_lost=True,    # re-queue tasks if worker dies mid-task

    # Results
    result_expires=3600,                # delete results after 1 hour

    # Scheduled tasks (like cron)
    beat_schedule={
        "cleanup-expired-tokens": {
            "task": "app.worker.tasks.cleanup_expired_tokens",
            "schedule": 3600.0,         # every hour
        },
    },
)`,
        explanation: 'task_acks_late=True is critical for reliability. With the default (ack_early), if a worker crashes mid-task, the task is lost. ack_late means the task is re-queued if the worker dies.',
      },
      {
        type: 'code',
        language: 'python',
        filename: 'app/worker/tasks.py',
        code: `from celery import Task
from app.worker.celery_app import celery_app
import time


# ── Basic task with retry ──

@celery_app.task(
    bind=True,              # allows self.retry()
    max_retries=3,
    default_retry_delay=60, # seconds before first retry
)
def send_welcome_email(self, user_id: int, email: str, name: str) -> dict:
    """Send a welcome email. Retries up to 3 times with exponential backoff."""
    try:
        # In production: call your email provider (SendGrid, Resend, SES)
        print(f"Sending welcome email to {email}")
        time.sleep(1)   # simulate API call
        return {"status": "sent", "email": email}

    except Exception as exc:
        # Exponential backoff: 60s, 120s, 240s between retries
        raise self.retry(exc=exc, countdown=60 * (2 ** self.request.retries))


# ── Task with database access ──

@celery_app.task
def generate_user_report(user_id: int) -> dict:
    """Generate a report — runs in a worker process, not the API process."""
    from sqlalchemy import create_engine
    from sqlalchemy.orm import Session
    from app.models.post import Post
    from app.config import settings

    # Workers are separate processes — need their own DB connections
    # Use sync SQLAlchemy here (not async)
    sync_url = settings.DATABASE_URL.replace("+asyncpg", "")
    engine = create_engine(sync_url)

    with Session(engine) as session:
        post_count = session.query(Post).filter(Post.author_id == user_id).count()
        return {"user_id": user_id, "post_count": post_count}


# ── Scheduled task ──

@celery_app.task
def cleanup_expired_tokens() -> dict:
    """Runs every hour — removes expired blacklisted tokens from Redis."""
    # In production: use SCAN instead of KEYS for large datasets
    import redis
    from app.config import settings
    client = redis.from_url(settings.REDIS_URL, decode_responses=True)
    # Redis handles TTL automatically — nothing to delete manually
    # But you can log the current blacklist size for monitoring
    count = len(client.keys("blacklist:*"))
    return {"blacklisted_tokens": count}`,
      },
      {
        type: 'code',
        language: 'python',
        filename: 'routers/users.py (with Celery)',
        code: `from fastapi import APIRouter, status
from app.worker.tasks import send_welcome_email
from app.schemas.user import UserCreate, UserResponse

router = APIRouter(prefix="/users", tags=["users"])


@router.post("/", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def create_user(body: UserCreate, db: AsyncSession = Depends(get_db)):
    # ... create user in DB ...
    user = await create_user_in_db(body, db)

    # Queue the welcome email — do not await it, just schedule it
    # .delay() is shorthand for .apply_async()
    send_welcome_email.delay(user.id, user.email, user.name)

    # Response is returned immediately — email sends in the background
    return user


# ── Check task status (for long-running tasks) ──

@router.get("/reports/{task_id}")
async def get_report_status(task_id: str):
    from celery.result import AsyncResult
    result = AsyncResult(task_id)
    return {
        "task_id": task_id,
        "status": result.status,   # PENDING, STARTED, SUCCESS, FAILURE, RETRY
        "result": result.result if result.ready() else None,
    }


@router.post("/{user_id}/generate-report")
async def trigger_report(user_id: int, current_user: dict = Depends(get_current_user)):
    task = generate_user_report.delay(user_id)
    return {"task_id": task.id, "status": "queued"}`,
      },
      {
        type: 'code',
        language: 'bash',
        filename: 'Running Celery',
        code: `# Start a worker (in a separate terminal)
celery -A app.worker.celery_app worker --loglevel=info

# Start beat scheduler (for periodic tasks — in another terminal)
celery -A app.worker.celery_app beat --loglevel=info

# Start Flower monitoring UI (http://localhost:5555)
celery -A app.worker.celery_app flower --port=5555

# Or with Docker Compose (see previous lesson):
docker compose up worker`,
      },
      {
        type: 'callout',
        tone: 'production',
        title: 'Celery in Production',
        content: `- Run workers with: celery -A app.worker.celery_app worker --concurrency=4 -Q default,email
- Separate queues for different priority: emails on "email" queue, reports on "reports" queue
- Use --max-tasks-per-child=1000 to restart workers after N tasks (prevents memory leaks)
- Always set task_time_limit and task_soft_time_limit to prevent stuck tasks
- Monitor with Flower or integrate with Datadog/Prometheus for alerts`,
      },
      {
        type: 'exercise',
        title: 'Image Processing Task Queue',
        description: 'Create a Celery task process_avatar(user_id: int, image_url: str) that simulates downloading and resizing an avatar (use time.sleep(2) to simulate work). Then create a POST /users/{id}/avatar endpoint that queues the task and immediately returns {"task_id": ..., "status": "processing"}. Create a GET /users/{id}/avatar/status/{task_id} endpoint that returns the task status.',
        language: 'python',
        starterCode: `# app/worker/tasks.py
from app.worker.celery_app import celery_app
import time

# TODO: create process_avatar task (max_retries=2, bind=True)
# Simulates: download image (sleep 1s), resize (sleep 1s), save result


# routers/avatars.py
from fastapi import APIRouter, Depends
from celery.result import AsyncResult
from app.dependencies import get_current_user

router = APIRouter(prefix="/users", tags=["avatars"])

# TODO: POST /{id}/avatar - queue the task, return task_id
# TODO: GET /{id}/avatar/status/{task_id} - return task status and result`,
        solution: `# app/worker/tasks.py
from app.worker.celery_app import celery_app
import time

@celery_app.task(bind=True, max_retries=2)
def process_avatar(self, user_id: int, image_url: str) -> dict:
    try:
        print(f"Downloading avatar from {image_url}")
        time.sleep(1)   # simulate download
        print(f"Resizing avatar for user {user_id}")
        time.sleep(1)   # simulate resize
        return {"user_id": user_id, "avatar_url": f"/avatars/{user_id}_processed.jpg", "status": "done"}
    except Exception as exc:
        raise self.retry(exc=exc, countdown=30 * (2 ** self.request.retries))


# routers/avatars.py
from fastapi import APIRouter, Depends
from celery.result import AsyncResult
from app.dependencies import get_current_user
from app.worker.tasks import process_avatar

router = APIRouter(prefix="/users", tags=["avatars"])

@router.post("/{id}/avatar")
async def upload_avatar(id: int, image_url: str, current_user: dict = Depends(get_current_user)):
    task = process_avatar.delay(id, image_url)
    return {"task_id": task.id, "status": "processing", "message": "Avatar is being processed"}

@router.get("/{id}/avatar/status/{task_id}")
async def get_avatar_status(id: int, task_id: str):
    result = AsyncResult(task_id)
    return {
        "task_id": task_id,
        "status": result.status,
        "result": result.result if result.ready() else None,
        "failed": result.failed(),
    }`,
        hints: [
          '.delay(arg1, arg2) sends args as positional parameters to the task function',
          'AsyncResult(task_id).status returns: PENDING, STARTED, SUCCESS, FAILURE, RETRY',
          'result.ready() returns True only when status is SUCCESS or FAILURE',
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // LESSON 17: Structured Logging & Observability
  // ─────────────────────────────────────────────────────────────
  {
    id: 'pb-prod-observability',
    moduleId: 'python-backend',
    phaseId: 'pb-production',
    phaseNumber: 8,
    order: 17,
    title: 'Structured Logging & Observability',
    description: 'Replace print() with structured JSON logging, add request tracing, expose metrics for Prometheus, and use OpenTelemetry to trace requests across services.',
    duration: '20 min',
    difficulty: 'intermediate',
    objectives: [
      'Set up structlog for structured JSON logging',
      'Add request context (request_id, user_id) to every log line',
      'Expose Prometheus metrics from FastAPI',
      'Understand distributed tracing with OpenTelemetry',
    ],
    content: [
      {
        type: 'text',
        markdown: `## The Problem with print()

In production, you need to:
1. Search logs by request_id, user_id, or error type
2. Set log levels (DEBUG in staging, WARNING in production)
3. Parse logs programmatically (Datadog, CloudWatch, Loki)
4. Correlate a user complaint ("it broke at 2PM") to the exact log entry

\`print()\` gives you none of this. Structured logging gives you all of it.

**Structured logging** means every log line is a JSON object with fields:
\`\`\`json
{"timestamp": "2025-01-03T14:00:00Z", "level": "error", "message": "DB connection failed", "request_id": "abc-123", "user_id": 42, "error": "timeout after 5s"}
\`\`\``,
      },
      {
        type: 'code',
        language: 'bash',
        filename: 'terminal',
        code: `uv add structlog prometheus-client opentelemetry-sdk opentelemetry-instrumentation-fastapi`,
      },
      {
        type: 'code',
        language: 'python',
        filename: 'app/core/logging.py',
        code: `import structlog
import logging
from app.config import settings


def configure_logging() -> None:
    """Set up structured logging for the application.
    
    Call this once at startup in main.py.
    """
    # Set standard library log level
    logging.basicConfig(
        level=logging.DEBUG if settings.DEBUG else logging.WARNING,
        format="%(message)s",
    )

    # Configure structlog
    processors = [
        structlog.contextvars.merge_contextvars,    # merge context (request_id, user_id)
        structlog.stdlib.add_log_level,             # add "level" field
        structlog.stdlib.add_logger_name,           # add "logger" field
        structlog.processors.TimeStamper(fmt="iso"), # ISO timestamp
        structlog.processors.StackInfoRenderer(),
    ]

    if settings.is_production:
        # JSON output for log aggregation systems
        processors.append(structlog.processors.JSONRenderer())
    else:
        # Pretty output for local development
        processors.append(structlog.dev.ConsoleRenderer())

    structlog.configure(
        processors=processors,
        wrapper_class=structlog.make_filtering_bound_logger(logging.INFO),
        context_class=dict,
        logger_factory=structlog.PrintLoggerFactory(),
        cache_logger_on_first_use=True,
    )


# Get a logger in any module:
# logger = structlog.get_logger(__name__)
# logger.info("user.created", user_id=42, email="alice@example.com")`,
        explanation: 'structlog.contextvars allows you to bind context variables (like request_id) once and have them appear in every subsequent log call within that request — without passing them around.',
      },
      {
        type: 'code',
        language: 'python',
        filename: 'middleware/logging.py',
        code: `import structlog
import uuid
from starlette.middleware.base import BaseHTTPMiddleware
from fastapi import Request, Response

logger = structlog.get_logger(__name__)


class LoggingMiddleware(BaseHTTPMiddleware):
    """Adds request context to every log line and logs each request."""

    async def dispatch(self, request: Request, call_next) -> Response:
        request_id = str(uuid.uuid4())[:8]   # short ID for readability
        user_id = None

        # Try to extract user ID from JWT (don't fail if missing)
        try:
            from jose import jwt
            auth = request.headers.get("Authorization", "")
            if auth.startswith("Bearer "):
                payload = jwt.decode(auth[7:], options={"verify_signature": False})
                user_id = payload.get("sub")
        except Exception:
            pass

        # Bind context — all logs within this request will include these fields
        structlog.contextvars.clear_contextvars()
        structlog.contextvars.bind_contextvars(
            request_id=request_id,
            user_id=user_id,
            method=request.method,
            path=request.url.path,
        )

        logger.info("request.started")

        import time
        start = time.perf_counter()
        response = await call_next(request)
        elapsed_ms = (time.perf_counter() - start) * 1000

        logger.info(
            "request.completed",
            status_code=response.status_code,
            duration_ms=round(elapsed_ms, 2),
        )

        return response`,
      },
      {
        type: 'code',
        language: 'python',
        filename: 'Using the logger',
        code: `import structlog

logger = structlog.get_logger(__name__)


class UserService:
    async def create_user(self, email: str, db) -> User:
        logger.info("user.create.started", email=email)

        try:
            user = await db.create_user(email=email)
            logger.info("user.create.success", user_id=user.id, email=email)
            return user

        except DuplicateEmailError:
            # Structured fields make this searchable in log aggregation
            logger.warning("user.create.duplicate_email", email=email)
            raise

        except Exception as exc:
            logger.error("user.create.failed", email=email, error=str(exc), exc_info=True)
            raise

# Log output (development):
# 2025-01-03 14:00:00 [info] user.create.success [request_id=abc123 user_id=42 email=alice@example.com]

# Log output (production JSON):
# {"timestamp": "2025-01-03T14:00:00Z", "level": "info", "event": "user.create.success", "request_id": "abc123", "user_id": 42, "email": "alice@example.com"}`,
      },
      {
        type: 'code',
        language: 'python',
        filename: 'app/metrics.py (Prometheus)',
        code: `from prometheus_client import Counter, Histogram, generate_latest, CONTENT_TYPE_LATEST
from fastapi import APIRouter, Response
import time

# ── Define metrics ──
REQUEST_COUNT = Counter(
    "http_requests_total",
    "Total HTTP requests",
    ["method", "path", "status_code"],
)

REQUEST_LATENCY = Histogram(
    "http_request_duration_seconds",
    "HTTP request duration",
    ["method", "path"],
    buckets=[0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1.0, 2.5, 5.0],
)

DB_QUERY_COUNT = Counter(
    "db_queries_total",
    "Database queries",
    ["operation", "table"],
)

router = APIRouter()


@router.get("/metrics", include_in_schema=False)
async def metrics():
    """Prometheus scrape endpoint."""
    return Response(generate_latest(), media_type=CONTENT_TYPE_LATEST)


# ── Middleware to record metrics ──
class MetricsMiddleware:
    async def dispatch(self, request, call_next):
        start = time.perf_counter()
        response = await call_next(request)
        duration = time.perf_counter() - start

        REQUEST_COUNT.labels(
            method=request.method,
            path=request.url.path,
            status_code=response.status_code,
        ).inc()

        REQUEST_LATENCY.labels(
            method=request.method,
            path=request.url.path,
        ).observe(duration)

        return response`,
        explanation: 'Prometheus scrapes /metrics every 15 seconds. These counters and histograms power dashboards (Grafana) and alerts ("alert me if p99 latency > 1s").',
      },
      {
        type: 'exercise',
        title: 'Add Business Metrics',
        description: 'Add Prometheus metrics to track: (1) a Counter for user_registrations_total (increment when a user registers successfully), (2) a Histogram for email_send_duration_seconds (how long email sending takes in Celery tasks), (3) a Gauge for active_sessions_total (increment on login, decrement on logout). Expose all metrics at /metrics.',
        language: 'python',
        starterCode: `from prometheus_client import Counter, Histogram, Gauge

# TODO: Define user_registrations_total Counter
# TODO: Define email_send_duration_seconds Histogram (buckets: 0.1 to 30s)
# TODO: Define active_sessions_total Gauge

# In register endpoint:
# TODO: increment user_registrations_total after successful creation

# In Celery email task:
# TODO: use histogram to measure email send duration

# In login/logout:
# TODO: increment/decrement active_sessions_total`,
        solution: `from prometheus_client import Counter, Histogram, Gauge
import time

user_registrations_total = Counter(
    "user_registrations_total",
    "Total successful user registrations",
)

email_send_duration_seconds = Histogram(
    "email_send_duration_seconds",
    "Time taken to send emails",
    buckets=[0.1, 0.5, 1.0, 2.5, 5.0, 10.0, 30.0],
)

active_sessions_total = Gauge(
    "active_sessions_total",
    "Current number of active user sessions",
)


# In register endpoint:
# user_registrations_total.inc()

# In Celery email task:
# start = time.perf_counter()
# ... send email ...
# email_send_duration_seconds.observe(time.perf_counter() - start)

# In login:
# active_sessions_total.inc()

# In logout:
# active_sessions_total.dec()`,
        hints: [
          'Counter.inc() adds 1, Counter.inc(n) adds n',
          'Histogram.observe(value) records a single observation in seconds',
          'Gauge.inc() adds, Gauge.dec() subtracts, Gauge.set(n) sets absolute value',
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // LESSON 18: Production Deployment Patterns
  // ─────────────────────────────────────────────────────────────
  {
    id: 'pb-prod-deployment',
    moduleId: 'python-backend',
    phaseId: 'pb-production',
    phaseNumber: 8,
    order: 18,
    title: 'Production Deployment: Patterns & Checklist',
    description: 'Deploy a FastAPI application to production: zero-downtime deployments, environment configuration, database migration strategy, health checks, and the pre-deploy checklist.',
    duration: '20 min',
    difficulty: 'advanced',
    objectives: [
      'Configure a production deployment pipeline with zero-downtime updates',
      'Manage secrets with environment variables and secret managers',
      'Run database migrations safely in production',
      'Apply the pre-production checklist before every deployment',
    ],
    content: [
      {
        type: 'text',
        markdown: `## Deployment Options for FastAPI

| Platform | Best For | Complexity |
|----------|---------|-----------|
| Railway | Small projects, fast start | Low |
| Render | Side projects, auto-deploy from GitHub | Low |
| Fly.io | Global edge deployment, affordable | Medium |
| AWS ECS / Fargate | Production, scalable, AWS ecosystem | High |
| Kubernetes (EKS/GKE) | Large scale, complex orchestration | Very High |

For most teams: start with Railway or Fly.io, migrate to ECS/Kubernetes when you need scale.`,
      },
      {
        type: 'code',
        language: 'yaml',
        filename: '.github/workflows/deploy.yml',
        code: `name: Deploy to Production

on:
  push:
    branches: [main]

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: \${{ github.repository }}

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: astral-sh/setup-uv@v3
      - run: uv sync
      - run: uv run pytest --cov=app --cov-fail-under=80

  build-and-push:
    needs: test
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    steps:
      - uses: actions/checkout@v4
      - uses: docker/login-action@v3
        with:
          registry: \${{ env.REGISTRY }}
          username: \${{ github.actor }}
          password: \${{ secrets.GITHUB_TOKEN }}

      - uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: |
            \${{ env.REGISTRY }}/\${{ env.IMAGE_NAME }}:latest
            \${{ env.REGISTRY }}/\${{ env.IMAGE_NAME }}:\${{ github.sha }}
          cache-from: type=gha
          cache-to: type=gha,mode=max   # GitHub Actions cache for fast builds

  deploy:
    needs: build-and-push
    runs-on: ubuntu-latest
    environment: production             # requires manual approval if configured
    steps:
      - name: Run migrations
        run: |
          docker run --rm \\
            --env DATABASE_URL=\${{ secrets.DATABASE_URL }} \\
            \${{ env.REGISTRY }}/\${{ env.IMAGE_NAME }}:\${{ github.sha }} \\
            alembic upgrade head

      - name: Deploy new version
        # Replace with your actual deploy command (fly deploy, ecs update, etc.)
        run: echo "Deploy \${{ github.sha }} to production"`,
        explanation: 'Always run migrations BEFORE deploying the new application version. The new code must be compatible with both old and new schema during the rollout window.',
      },
      {
        type: 'text',
        markdown: `## Safe Migration Strategy

When you add a column, the safe order is:

\`\`\`
1. Deploy migration: ADD COLUMN new_col (nullable or with default)
2. Deploy new code: reads/writes new_col
3. [Later] Deploy migration: SET NOT NULL if needed
\`\`\`

**Never deploy step 2 before step 1.** The old code does not know about the new column — but the new code requires it.

For removing a column:
\`\`\`
1. Deploy new code: stop reading/writing the old column
2. Wait for all instances to update
3. Deploy migration: DROP COLUMN
\`\`\``,
      },
      {
        type: 'code',
        language: 'python',
        filename: 'app/main.py (health check for load balancer)',
        code: `from fastapi import FastAPI
from sqlalchemy import text
from app.db.session import AsyncSessionLocal
from app.db.redis import get_redis

app = FastAPI()


@app.get("/health", tags=["system"])
async def health_check():
    """Simple health check — load balancer uses this to route traffic."""
    return {"status": "ok"}


@app.get("/health/ready", tags=["system"])
async def readiness_check():
    """Readiness check — returns 503 if dependencies are unavailable.
    
    Load balancers use this before sending traffic to a new instance.
    Kubernetes liveness vs readiness:
    - liveness: is the app running? (restart if no)
    - readiness: is the app ready to serve? (remove from pool if no)
    """
    checks = {}

    # Check database
    try:
        async with AsyncSessionLocal() as session:
            await session.execute(text("SELECT 1"))
        checks["database"] = "ok"
    except Exception as e:
        checks["database"] = f"error: {e}"

    # Check Redis
    try:
        redis = get_redis()
        await redis.ping()
        await redis.aclose()
        checks["redis"] = "ok"
    except Exception as e:
        checks["redis"] = f"error: {e}"

    all_ok = all(v == "ok" for v in checks.values())
    return {
        "status": "ready" if all_ok else "unavailable",
        "checks": checks,
    }, 200 if all_ok else 503`,
      },
      {
        type: 'callout',
        tone: 'production',
        title: 'Pre-Deploy Checklist',
        content: `Before every production deployment, verify:
- [ ] All tests pass (unit + integration)
- [ ] Coverage >= 80%
- [ ] Migrations are backward-compatible (old app works with new schema)
- [ ] New secrets added to secret manager AND deployment environment
- [ ] ALLOWED_ORIGINS includes production frontend URL
- [ ] DEBUG=False in production
- [ ] SECRET_KEY is a long random string (not a dev placeholder)
- [ ] Rate limiting is configured
- [ ] /health and /health/ready endpoints respond correctly
- [ ] Rollback plan: can you revert in < 5 minutes?`,
      },
      {
        type: 'code',
        language: 'python',
        filename: 'Deployment to Fly.io',
        code: `# fly.toml — Fly.io deployment config
# [fly.toml]
# app = "my-api"
# primary_region = "iad"  # us-east
#
# [build]
#   dockerfile = "Dockerfile"
#
# [[services]]
#   internal_port = 8000
#   protocol = "tcp"
#
#   [[services.ports]]
#     port = 443
#     handlers = ["tls", "http"]
#
#   [services.concurrency]
#     type = "requests"
#     hard_limit = 250
#     soft_limit = 200
#
#   [[services.checks]]  # health checks
#     grace_period = "10s"
#     interval = "15s"
#     method = "get"
#     path = "/health/ready"
#     timeout = "5s"

# Deploy commands:
# flyctl auth login
# flyctl launch           # first time setup
# flyctl secrets set SECRET_KEY=xxx DATABASE_URL=xxx
# flyctl deploy           # subsequent deploys`,
      },
      {
        type: 'exercise',
        title: 'Complete the Production Checklist',
        description: 'Audit your application code against the production checklist. Implement the 3 most commonly missing items: (1) Add a /health/ready endpoint that checks DB and Redis connectivity and returns 503 if either is down, (2) Add a STARTUP_MESSAGE that logs the app version, environment, and all config values (except secrets) when the app starts, (3) Create a settings validation function that raises an error at startup if SECRET_KEY is still the dev default.',
        language: 'python',
        starterCode: `from fastapi import FastAPI
from contextlib import asynccontextmanager
import structlog

logger = structlog.get_logger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # TODO: validate settings (fail if SECRET_KEY is dev default)
    # TODO: log startup message (version, environment, safe config values)
    yield

app = FastAPI(lifespan=lifespan)

# TODO: GET /health/ready - check DB + Redis, return 503 if unavailable`,
        solution: `from fastapi import FastAPI
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
from sqlalchemy import text
import structlog
from app.config import settings
from app.db.session import AsyncSessionLocal
from app.db.redis import get_redis

logger = structlog.get_logger(__name__)


def validate_production_settings() -> None:
    """Fail fast if critical settings are misconfigured."""
    if settings.is_production:
        if settings.SECRET_KEY in ["your-secret-key-change-in-production", "dev-secret", ""]:
            raise RuntimeError("SECRET_KEY must be set to a secure random value in production")
        if settings.DEBUG:
            raise RuntimeError("DEBUG must be False in production")


@asynccontextmanager
async def lifespan(app: FastAPI):
    validate_production_settings()
    logger.info(
        "app.started",
        version="1.0.0",
        environment=settings.ENVIRONMENT,
        allowed_origins=settings.ALLOWED_ORIGINS,
        debug=settings.DEBUG,
    )
    yield
    logger.info("app.stopped")


app = FastAPI(lifespan=lifespan)


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.get("/health/ready")
async def readiness():
    checks = {}

    try:
        async with AsyncSessionLocal() as session:
            await session.execute(text("SELECT 1"))
        checks["database"] = "ok"
    except Exception as e:
        checks["database"] = f"error: {e}"

    try:
        redis = get_redis()
        await redis.ping()
        await redis.aclose()
        checks["redis"] = "ok"
    except Exception as e:
        checks["redis"] = f"error: {e}"

    all_ok = all(v == "ok" for v in checks.values())
    status_code = 200 if all_ok else 503
    return JSONResponse(
        {"status": "ready" if all_ok else "unavailable", "checks": checks},
        status_code=status_code,
    )`,
        hints: [
          'Raise RuntimeError in lifespan before yield to abort startup',
          'Return JSONResponse with status_code=503 for readiness failures',
          'Log safe config values (origins, debug flag) but never the SECRET_KEY',
        ],
      },
    ],
  },
]
