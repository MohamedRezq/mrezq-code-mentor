import type { ContentBlock, Lesson } from '@/types/lesson'

// ─── PHASE 8: Production ──────────────────────────────────────────────────────
// Expert-reviewer + beginner-tutor standard:
// TL;DR · terminology · full API reference with outputs ·
// lifecycle diagram · real scenarios · junior mistakes + fix ·
// code-reading guide
// ─────────────────────────────────────────────────────────────────────────────

const phase8Blocks: Record<string, string[]> = {
  // ─── Lesson 1: Docker ────────────────────────────────────────────────────
  'pb-prod-docker': [
    `## Beginner TL;DR — Docker

Docker packages your application + all its dependencies into a portable image. The image runs the same way everywhere: your laptop, a CI server, or a cloud VM.

**Mental model:** A Docker image is a shipping container. It holds everything needed to run your app. You ship the container, not just the code.

**Pronunciation:** DOH-ker`,

    `## Terminology

| Term | Meaning |
|---|---|
| Image | A read-only snapshot of your application and dependencies (like a template) |
| Container | A running instance of an image |
| Dockerfile | Recipe to build an image |
| Layer | One instruction in a Dockerfile — Docker caches layers separately |
| Registry | Store for images (Docker Hub, Amazon ECR, GitHub Container Registry) |
| Docker Compose | Tool to run multiple containers together (app + DB + Redis) |
| Volume | Persistent storage that survives container restarts |
| Bind mount | Map a local folder into the container (for dev hot-reload) |
| Health check | Docker periodically runs a command to verify the container is healthy |`,

    `## Full reference: production Dockerfile for FastAPI

\`\`\`dockerfile
# syntax=docker/dockerfile:1

# ── Stage 1: Build dependencies ────────────────────────────────────
FROM python:3.12-slim AS builder

WORKDIR /app

# Install uv for fast dependency resolution
RUN pip install --no-cache-dir uv

# Copy only dependency files first (cache this layer)
COPY pyproject.toml uv.lock ./

# Install to a virtual env that we'll copy later
RUN uv sync --frozen --no-dev

# ── Stage 2: Runtime image (smaller, no build tools) ───────────────
FROM python:3.12-slim AS runtime

WORKDIR /app

# Security: never run as root
RUN adduser --disabled-password --no-create-home appuser

# Copy virtual env from builder
COPY --from=builder /app/.venv ./.venv

# Copy application code
COPY src/ ./src/
COPY alembic/ ./alembic/
COPY alembic.ini .

# Make the venv's executables available
ENV PATH="/app/.venv/bin:$PATH"
ENV PYTHONPATH="/app/src"

# Run as non-root
USER appuser

EXPOSE 8000

# Health check — Docker marks container unhealthy after 3 failed checks
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/health')"

CMD ["gunicorn", "app.main:app", "-w", "4", "-k", "uvicorn.workers.UvicornWorker", \
     "--bind", "0.0.0.0:8000", "--access-logfile", "-", "--error-logfile", "-"]
\`\`\`

**Why multi-stage?** Builder stage installs compilers and build tools. Runtime stage copies only the final artifacts — no build tools, no pip, no compiler → smaller and more secure image.`,

    `## Full reference: .dockerignore (must have)

\`\`\`
# .dockerignore — same syntax as .gitignore
# These files are NOT copied into the image

.git/
.gitignore
.env
.env.*
__pycache__/
*.pyc
*.pyo
*.pyd
.pytest_cache/
.mypy_cache/
.ruff_cache/
htmlcov/
.coverage
node_modules/
*.log
README.md
docs/
tests/
\`\`\`

**Why it matters:** Without .dockerignore, your \`.env\` file (with secrets) and \`.git/\` directory (large) get copied into every image — a security and performance problem.`,

    `## Full reference: Docker Compose for local development

\`\`\`yaml
# docker-compose.yml
version: "3.9"

services:
  api:
    build: .
    ports:
      - "8000:8000"
    environment:
      DATABASE_URL: postgresql+asyncpg://dev:dev@postgres:5432/myapp
      REDIS_URL:    redis://redis:6379
      SECRET_KEY:   dev-only-secret
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_started
    # Hot-reload for development (override CMD)
    command: uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
    volumes:
      - ./src:/app/src   # mount source for hot-reload

  postgres:
    image: postgres:16
    environment:
      POSTGRES_USER:     dev
      POSTGRES_PASSWORD: dev
      POSTGRES_DB:       myapp
    volumes:
      - pg_data:/var/lib/postgresql/data   # persist DB between restarts
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U dev"]
      interval: 5s
      timeout: 3s
      retries: 5

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data

volumes:
  pg_data:
  redis_data:
\`\`\`

\`\`\`bash
# Start all services
docker compose up

# Start in background
docker compose up -d

# View logs for one service
docker compose logs -f api

# Run a command inside the api container
docker compose exec api alembic upgrade head

# Stop and remove containers (keep volumes)
docker compose down

# Stop and remove EVERYTHING including volumes (fresh start)
docker compose down -v
\`\`\``,

    `## Junior mistakes + fix

| Mistake | What happens | Fix |
|---|---|---|
| Run container as root | Security vulnerability | Add \`USER appuser\` with a non-root user |
| No .dockerignore | Secrets in image, large build context | Always create .dockerignore |
| Single-stage Dockerfile | Final image has compilers, pip, build tools | Use multi-stage builds |
| Hardcode env vars in Dockerfile | Credentials in image history | Use \`docker run -e\` or \`docker compose\` env |
| No HEALTHCHECK | Docker doesn't know container is stuck | Always add a HEALTHCHECK pointing to /health |`,
  ],

  // ─── Lesson 2: Celery Background Tasks ──────────────────────────────────
  'pb-prod-celery': [
    `## Beginner TL;DR — Celery

Celery is a distributed task queue. It runs background jobs — work that happens separately from the HTTP request.

**When to use Celery instead of BackgroundTasks:**
- Job must survive a server restart
- Job takes > 30 seconds
- Job might fail and needs retries
- Job needs to be scheduled (run at 9am every Monday)
- You need to track job status

**Pronunciation:** SEL-er-ee`,

    `## Terminology

| Term | Meaning |
|---|---|
| Worker | Python process that picks up and runs tasks |
| Broker | Message queue that holds tasks until a worker picks them up (Redis or RabbitMQ) |
| Result backend | Storage for task results and status (Redis, PostgreSQL) |
| Task | A Python function decorated with \`@celery_app.task\` |
| Queue | Named channel — you can route different tasks to different workers |
| Retry | Re-queue a failed task automatically after a delay |
| Beat | Celery's scheduler — sends tasks on a cron-like schedule |
| Flower | Web UI dashboard for monitoring Celery workers and tasks |`,

    `## Full reference: Celery setup with FastAPI

\`\`\`python
# app/celery_app.py
from celery import Celery

celery_app = Celery(
    "myapp",
    broker="redis://localhost:6379/0",      # tasks stored here while waiting
    backend="redis://localhost:6379/1",     # results stored here after completion
    include=["app.tasks.email", "app.tasks.reports"],  # task modules to import
)

celery_app.conf.update(
    # Serialisation
    task_serializer="json",
    result_serializer="json",
    accept_content=["json"],

    # Reliability
    task_acks_late=True,            # acknowledge AFTER completion (not before)
    task_reject_on_worker_lost=True, # re-queue if worker dies mid-task

    # Timeouts
    task_soft_time_limit=300,       # 5 min: raises SoftTimeLimitExceeded
    task_time_limit=360,            # 6 min: hard kill

    # Results
    result_expires=3600,            # keep results for 1 hour
)
\`\`\``,

    `## Full reference: defining and calling tasks

\`\`\`python
# app/tasks/email.py
from app.celery_app import celery_app
from celery import Task
from celery.exceptions import SoftTimeLimitExceeded
import logging

logger = logging.getLogger(__name__)

@celery_app.task(
    name="tasks.send_welcome_email",
    bind=True,                       # first arg is self (the Task instance)
    max_retries=3,
    default_retry_delay=60,          # wait 60s before retrying
    queue="email",                   # route to dedicated email worker
)
def send_welcome_email(self, user_id: int, email: str):
    try:
        # Simulate sending email
        result = email_client.send(
            to=email,
            subject="Welcome!",
            template="welcome",
            data={"user_id": user_id},
        )
        logger.info("Email sent", user_id=user_id, message_id=result.id)
        return {"sent": True, "message_id": result.id}
    except SoftTimeLimitExceeded:
        logger.error("Email task timed out", user_id=user_id)
        raise
    except Exception as exc:
        logger.error("Email failed, retrying", user_id=user_id, error=str(exc))
        raise self.retry(exc=exc, countdown=60)


# ── Calling tasks from FastAPI routes ────────────────────────────────
@router.post("/users/")
async def create_user(body: UserCreate):
    user = await save_user(body)

    # Fire-and-forget (no result tracking)
    send_welcome_email.delay(user.id, user.email)

    # With countdown delay (send after 5 minutes)
    send_welcome_email.apply_async(args=[user.id, user.email], countdown=300)

    # Get result later
    task = send_welcome_email.delay(user.id, user.email)
    task.id          # → "1a2b3c4d-..." (AsyncResult ID)

    return user
\`\`\``,

    `## Full reference: monitoring task status

\`\`\`python
from celery.result import AsyncResult

@router.get("/tasks/{task_id}")
async def get_task_status(task_id: str):
    result = AsyncResult(task_id)
    return {
        "task_id":  task_id,
        "status":   result.status,  # PENDING → STARTED → SUCCESS / FAILURE / RETRY
        "result":   result.result if result.successful() else None,
        "error":    str(result.result) if result.failed() else None,
    }
# Output: {"task_id": "abc", "status": "SUCCESS", "result": {"sent": true}}
\`\`\``,

    `## Full reference: scheduled tasks with Beat

\`\`\`python
# app/celery_app.py (add to config)
from celery.schedules import crontab

celery_app.conf.beat_schedule = {
    # Run every day at 8:00am UTC
    "daily-digest-email": {
        "task": "tasks.send_daily_digest",
        "schedule": crontab(hour=8, minute=0),
    },

    # Run every 5 minutes
    "sync-external-prices": {
        "task": "tasks.sync_prices",
        "schedule": crontab(minute="*/5"),
    },

    # Run every Monday at 9am
    "weekly-report": {
        "task": "tasks.generate_report",
        "schedule": crontab(day_of_week=1, hour=9, minute=0),
    },
}
\`\`\`

\`\`\`bash
# Start commands:
celery -A app.celery_app worker --loglevel=info -Q default,email    # worker
celery -A app.celery_app beat --loglevel=info                       # scheduler
celery -A app.celery_app flower --port=5555                         # monitoring UI
\`\`\``,

    `## Junior mistakes + fix

| Mistake | What happens | Fix |
|---|---|---|
| Passing SQLAlchemy objects to tasks | Serialisation error or stale data | Pass IDs, not ORM objects |
| No \`task_acks_late=True\` | Task lost if worker dies mid-execution | Set \`acks_late=True\` in config |
| No retry logic | Transient failures are permanent | Add \`max_retries\` and \`default_retry_delay\` |
| No \`task_time_limit\` | Runaway task starves workers indefinitely | Always set a hard time limit |
| Same broker and result backend URL | Busy broker mixes task data with result data | Use different DB index (redis \`/0\` vs \`/1\`) |`,
  ],

  // ─── Lesson 3: Observability ─────────────────────────────────────────────
  'pb-prod-observability': [
    `## Beginner TL;DR — Observability

Observability = can you understand what your running app is doing?

Three pillars:
1. **Logs** — what happened (structured JSON, searchable)
2. **Metrics** — how many times, how fast, how many errors (Prometheus counters/histograms)
3. **Traces** — which code path a specific request took (OpenTelemetry)

Without observability: "something is slow" takes hours to debug. With it: 5 minutes.`,

    `## Full reference: structured logging with structlog

\`\`\`python
# app/logging_config.py
import structlog
import logging

def setup_logging(*, json_logs: bool = False):
    shared_processors = [
        structlog.contextvars.merge_contextvars,    # adds request_id, user_id
        structlog.stdlib.add_log_level,
        structlog.stdlib.add_logger_name,
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.StackInfoRenderer(),
    ]

    if json_logs:
        processors = shared_processors + [structlog.processors.JSONRenderer()]
    else:
        processors = shared_processors + [structlog.dev.ConsoleRenderer()]

    structlog.configure(
        processors=processors,
        wrapper_class=structlog.make_filtering_bound_logger(logging.DEBUG),
        context_class=dict,
        logger_factory=structlog.PrintLoggerFactory(),
    )

# Usage:
logger = structlog.get_logger()

logger.info("course.created", course_id=42, author_id=7, price=0)
# Development output: 2025-01-15 12:00:00 [info] course.created course_id=42 author_id=7 price=0
# Production JSON:    {"event": "course.created", "course_id": 42, "author_id": 7, ...}
\`\`\``,

    `## Full reference: binding context variables per request

\`\`\`python
# middleware/logging.py
import structlog
import uuid
from starlette.middleware.base import BaseHTTPMiddleware

logger = structlog.get_logger()

class LoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        # Clear previous request's context
        structlog.contextvars.clear_contextvars()

        # Bind context for this request — auto-included in every log line
        structlog.contextvars.bind_contextvars(
            request_id=str(uuid.uuid4())[:8],
            method=request.method,
            path=request.url.path,
        )

        response = await call_next(request)

        # Log completion
        logger.info("request.completed", status_code=response.status_code)
        return response

# In a service function — no need to pass request_id manually
async def create_course(data):
    logger.info("course.creating", title=data.title)
    ...
    logger.info("course.created", course_id=new_course.id)
    # Both lines automatically include request_id from context
\`\`\``,

    `## Full reference: Prometheus metrics

\`\`\`python
# app/metrics.py
from prometheus_client import Counter, Histogram, Gauge, generate_latest, CONTENT_TYPE_LATEST
from fastapi import APIRouter

metrics_router = APIRouter()

# ── Counter — always goes up, never down ─────────────────────────────
http_requests_total = Counter(
    "http_requests_total",
    "Total HTTP requests",
    ["method", "endpoint", "status_code"]
)
# Usage: http_requests_total.labels(method="POST", endpoint="/courses", status_code=201).inc()

# ── Histogram — track distributions (latency, payload size) ──────────
request_duration_seconds = Histogram(
    "request_duration_seconds",
    "HTTP request duration",
    ["method", "endpoint"],
    buckets=[0.01, 0.05, 0.1, 0.25, 0.5, 1.0, 2.5, 5.0],
)
# Usage: with request_duration_seconds.labels(...).time():  ← auto-times block

# ── Gauge — can go up and down ───────────────────────────────────────
active_connections = Gauge("active_connections", "Active DB connections")
# active_connections.set(pool.checkedout())

# ── Expose metrics endpoint ───────────────────────────────────────────
@metrics_router.get("/metrics", include_in_schema=False)
async def prometheus_metrics():
    from fastapi.responses import Response
    return Response(generate_latest(), media_type=CONTENT_TYPE_LATEST)

# ── Middleware to auto-record all requests ────────────────────────────
class MetricsMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        start = time.perf_counter()
        response = await call_next(request)
        duration = time.perf_counter() - start
        endpoint = request.url.path
        http_requests_total.labels(request.method, endpoint, response.status_code).inc()
        request_duration_seconds.labels(request.method, endpoint).observe(duration)
        return response
\`\`\``,

    `## Real scenario: diagnosing a spike with structured logs

**Situation:** Prometheus alert fires — p95 request duration > 2s.

\`\`\`bash
# Step 1: find the slow endpoint from Prometheus dashboard
# → /api/courses/ is slow between 14:00 and 14:10

# Step 2: search logs for that endpoint in that window
cat app.log | jq 'select(.path == "/api/courses/" and .duration_ms > 500)'
# → all show "db_query_ms: 480" — DB query is slow

# Step 3: find the query from the slow log lines
# → "SELECT * FROM courses JOIN enrollments..." — missing index

# Step 4: add index, deploy, verify in Prometheus
# → p95 drops from 2.1s to 40ms
\`\`\`

Without structured logs + metrics: "something is slow" is a 4-hour investigation.
With them: 15 minutes.`,

    `## Junior mistakes + fix

| Mistake | What happens | Fix |
|---|---|---|
| Log plain strings with \`print()\` | Can't search or filter logs | Use \`structlog\` with JSON in production |
| Log sensitive data (passwords, tokens) | Security breach in log files | Explicitly exclude auth fields |
| Never look at metrics | Problems detected by users, not you | Set up Prometheus + Grafana + alerting |
| Create new Prometheus metric object per request | Duplicate metric error + memory leak | Create metric objects at module level once |
| No request_id in logs | Cannot correlate logs for one request | Bind request_id in middleware for every request |`,
  ],

  // ─── Lesson 4: Deployment Patterns ──────────────────────────────────────
  'pb-prod-deployment': [
    `## Beginner TL;DR — Production Deployment

Deployment is not just uploading files. It's: build → test → package → deliver → verify — with a rollback plan.

A professional deployment is:
- **Repeatable** — same steps, every time, automated
- **Safe** — zero downtime, instant rollback
- **Verified** — automated tests pass before it goes live`,

    `## Full reference: production environment variables via pydantic-settings

\`\`\`python
# app/config.py
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import PostgresDsn, RedisDsn, SecretStr

class Settings(BaseSettings):
    # API
    environment:  str        = "production"
    debug:        bool       = False
    log_level:    str        = "INFO"

    # Database
    database_url: PostgresDsn

    # Redis
    redis_url:    RedisDsn

    # Auth
    secret_key:   SecretStr
    jwt_expire_minutes: int  = 30

    # External services
    sendgrid_api_key: SecretStr | None = None
    stripe_secret_key: SecretStr | None = None

    model_config = SettingsConfigDict(
        env_file=".env",              # read from .env in dev
        env_file_encoding="utf-8",
        case_sensitive=False,
    )

settings = Settings()                 # raises ValidationError if required vars missing

# Access throughout app:
from app.config import settings
settings.database_url
settings.secret_key.get_secret_value()   # SecretStr prevents accidental logging
\`\`\``,

    `## Full reference: health check endpoints

\`\`\`python
# app/routers/health.py
from fastapi import APIRouter, status
from sqlalchemy.ext.asyncio import AsyncSession

health_router = APIRouter(tags=["health"])

@health_router.get("/health", status_code=200)
async def health_check():
    """Basic liveness check — container is running."""
    return {"status": "ok"}

@health_router.get("/health/ready", status_code=200)
async def readiness_check(db: AsyncSession = Depends(get_db)):
    """Readiness check — can we serve traffic? Checks all dependencies."""
    checks = {}

    # Database
    try:
        await db.execute(text("SELECT 1"))
        checks["database"] = "ok"
    except Exception as e:
        checks["database"] = f"error: {e}"

    # Redis
    try:
        await redis_client.ping()
        checks["redis"] = "ok"
    except Exception as e:
        checks["redis"] = f"error: {e}"

    all_ok = all(v == "ok" for v in checks.values())
    return JSONResponse(
        status_code=200 if all_ok else 503,
        content={"status": "ready" if all_ok else "degraded", "checks": checks},
    )

# Health check response:
# {"status": "ready", "checks": {"database": "ok", "redis": "ok"}}
# {"status": "degraded", "checks": {"database": "ok", "redis": "error: Connection refused"}}
\`\`\`

**Load balancer uses /health for routing. Kubernetes uses /health/ready for pod management.**`,

    `## Full reference: GitHub Actions CI/CD pipeline

\`\`\`yaml
# .github/workflows/deploy.yml
name: Test and Deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_PASSWORD: test
          POSTGRES_DB: testdb
        options: >-
          --health-cmd pg_isready
          --health-interval 5s
      redis:
        image: redis:7-alpine

    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with: { python-version: "3.12" }
      - run: pip install uv && uv sync
      - run: uv run pytest --cov=app --cov-report=xml
      - run: uv run ruff check .
      - run: uv run mypy app/

  deploy:
    needs: test                       # only runs if test job passes
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Build and push Docker image
        run: |
          docker build -t myapp:\${{ github.sha }} .
          docker push myapp:\${{ github.sha }}
      - name: Deploy to production
        run: |
          # Your deployment command:
          # kubectl set image deployment/api api=myapp:\${{ github.sha }}
          # OR: fly deploy --image myapp:\${{ github.sha }}
\`\`\``,

    `## Pre-deploy production checklist

\`\`\`
Before every production deployment, verify:

Environment:
  ☐ All required environment variables set in production secrets
  ☐ SECRET_KEY is random (not the default) — python -c "import secrets; print(secrets.token_hex(32))"
  ☐ DEBUG=False
  ☐ ALLOWED_HOSTS / CORS configured for production domain

Database:
  ☐ alembic upgrade head tested on staging first
  ☐ New nullable=False columns have defaults or backfill migration
  ☐ Migration can be rolled back (downgrade() written)

Testing:
  ☐ All tests pass in CI
  ☐ Coverage ≥ 85%
  ☐ No type errors (mypy passes)
  ☐ No lint errors (ruff passes)

Deployment:
  ☐ Health check endpoints respond correctly
  ☐ Rollback plan documented (previous image tag, previous migration version)
  ☐ On-call engineer available during deploy window

Monitoring:
  ☐ Prometheus metrics being scraped
  ☐ Error rate alert configured
  ☐ p95 latency alert configured
\`\`\``,

    `## Real scenario: zero-downtime migration

**Situation:** You need to add a \`published_at\` column (not null) to a live courses table with 50,000 rows.

\`\`\`bash
# WRONG: do this in one migration → fails on existing rows
ALTER TABLE courses ADD COLUMN published_at TIMESTAMP NOT NULL;
# ERROR: null value in column "published_at"

# CORRECT: three-step process
# Step 1: Add nullable first
alembic revision -m "add_published_at_nullable"
# op.add_column("courses", sa.Column("published_at", sa.DateTime, nullable=True))

# Step 2: Backfill existing rows
alembic revision -m "backfill_published_at"
# op.execute("UPDATE courses SET published_at = created_at WHERE published_at IS NULL")

# Step 3: Enforce not-null
alembic revision -m "published_at_not_null"
# op.alter_column("courses", "published_at", nullable=False)
\`\`\`

Each migration is safe to apply with zero downtime. You can roll back any individual step.`,

    `## Junior mistakes + fix

| Mistake | What happens | Fix |
|---|---|---|
| Deploy on Friday afternoon | Bug found, no one available to fix, weekend ruined | Deploy Tuesday–Thursday before 3pm |
| Skip staging | Production is the first environment the bug appears | Always test on staging with production data snapshot |
| No rollback plan | If deploy breaks, you scramble | Always know the exact command to roll back |
| Expose /health to the public | DoS via repeated fast health checks | Rate-limit or restrict to internal network |
| Different docker image between staging and prod | "Works on staging" doesn't mean it works on prod | Deploy exact same image SHA to both |`,
  ],
}

function toBlocks(markdowns: string[]): ContentBlock[] {
  return markdowns.map(markdown => ({ type: 'text' as const, markdown }))
}

export function applyPhase8ProductionEnhancements(lessons: Lesson[]): Lesson[] {
  return lessons.map(lesson => {
    const markdowns = phase8Blocks[lesson.id]
    if (!markdowns) return lesson
    return {
      ...lesson,
      content: [...toBlocks(markdowns), ...lesson.content],
    }
  })
}
