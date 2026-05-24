import type { ContentBlock, Lesson } from '@/types/lesson'

// ─── PHASE 5: FastAPI ─────────────────────────────────────────────────────────
// Expert-reviewer + beginner-tutor standard:
// TL;DR · terminology · full API reference with outputs ·
// lifecycle diagram · real scenarios · junior mistakes + fix ·
// code-reading guide
// ─────────────────────────────────────────────────────────────────────────────

const phase5Blocks: Record<string, string[]> = {
  // ─── Lesson 1: FastAPI Intro ─────────────────────────────────────────────
  'pb-fastapi-intro': [
    `## Beginner TL;DR — What FastAPI is

FastAPI is a Python web framework for building APIs. It is:
- **Fast to write:** type hints do double duty as validation
- **Fast at runtime:** built on Starlette (ASGI), handles thousands of concurrent requests
- **Auto-documented:** Swagger UI and ReDoc generated from your code

**Pronunciation:** FAST-ay-PY-eye (or just "Fast API")

**When to choose FastAPI:** any new Python API project, especially if you want async support and automatic OpenAPI docs.`,

    `## Terminology you must know

| Term | Pronunciation | Meaning |
|---|---|---|
| ASGI | AZ-ghee | Async Server Gateway Interface — the async server protocol FastAPI uses |
| Uvicorn | YEW-vi-korn | The ASGI server that runs FastAPI apps |
| Gunicorn | GUN-i-korn | Process manager that runs multiple Uvicorn workers in production |
| Starlette | star-LET | The ASGI framework FastAPI is built on |
| Pydantic | py-DAN-tik | The validation library FastAPI uses for request/response models |
| Swagger UI | SWAG-er | Interactive API docs at \`/docs\` |
| ReDoc | REE-dok | Alternative clean API docs at \`/redoc\` |
| OpenAPI | OH-pen-AY-pee-eye | The spec standard FastAPI generates automatically |
| Dependency injection | — | FastAPI's system to share code across routes via \`Depends()\` |`,

    `## Full reference: app creation and configuration

\`\`\`python
from fastapi import FastAPI

app = FastAPI(
    title="My API",                 # shown in /docs header
    description="Full description", # supports Markdown
    version="1.0.0",
    docs_url="/docs",               # Swagger UI (set to None to disable)
    redoc_url="/redoc",             # ReDoc (set to None to disable)
    openapi_url="/openapi.json",    # raw OpenAPI spec
    debug=False,                    # enable tracebacks in responses (dev only)
)

# Include a router from another module
from app.routers import courses, users
app.include_router(courses.router)
app.include_router(users.router, prefix="/v2")   # override prefix

# Route with all common options
@app.get(
    "/courses/{course_id}",
    response_model=CourseResponse,    # filters/validates response
    status_code=200,
    tags=["courses"],                 # groups in Swagger UI
    summary="Get one course",
    response_description="Course found",
    deprecated=False,
)
def get_course(course_id: int): ...
\`\`\``,

    `## Full reference: server startup commands

\`\`\`bash
# Development — auto-reload on save
uv run uvicorn app.main:app --reload

# Development — custom host/port
uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8080

# Production — multiple workers (2 × CPU cores + 1 is the common rule)
uvicorn app.main:app --workers 4 --host 0.0.0.0 --port 8000

# Production — Gunicorn manages Uvicorn workers (robust process management)
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000

# Your three free URLs when running:
# http://localhost:8000/        → your API
# http://localhost:8000/docs    → Swagger UI (interactive)
# http://localhost:8000/redoc   → ReDoc
# http://localhost:8000/openapi.json → raw spec
\`\`\``,

    `## Reference: production project layout

\`\`\`
my-api/
├── app/
│   ├── main.py           ← app factory, lifespan, middleware, router includes
│   ├── config.py         ← pydantic-settings: read env vars with type safety
│   ├── dependencies.py   ← get_db(), get_current_user(), require_admin()
│   ├── routers/
│   │   ├── users.py      ← all /users/* routes
│   │   ├── courses.py    ← all /courses/* routes
│   │   └── auth.py       ← login, register, token refresh
│   ├── schemas/          ← Pydantic models (Create / Update / Response)
│   ├── models/           ← SQLAlchemy ORM models
│   └── services/         ← business logic (no HTTP code here)
├── tests/
├── alembic/
├── pyproject.toml
└── Dockerfile
\`\`\`

**Why separate schemas from models?** ORM models are for the DB. Schemas define what crosses the API boundary. They often diverge: the DB has \`password_hash\` but the API response should never expose it.`,

    `## Junior mistakes + fix

| Mistake | What happens | Fix |
|---|---|---|
| All routes in \`main.py\` | File grows to 1000+ lines | Use \`APIRouter\` in separate files |
| No \`--reload\` in dev | Must restart manually on every change | Always use \`--reload\` in development |
| Use \`--reload\` in production | CPU waste + security risk | Remove \`--reload\`, use Gunicorn with workers |
| Return bare dict without \`response_model\` | No response validation, no docs | Add \`response_model=YourSchema\` to route |
| Mix business logic in route handlers | Hard to test | Move logic to service layer |`,
  ],

  // ─── Lesson 2: Routes, Parameters & Responses ───────────────────────────
  'pb-fastapi-routing': [
    `## Beginner TL;DR — Routing

FastAPI maps URLs to functions using decorators:

\`\`\`python
@app.get("/path")    # GET request to /path → call this function
def handler():
    return {"key": "value"}   # auto-converted to JSON
\`\`\`

Parameters come in four forms — FastAPI knows which is which by context:
- **Path param:** \`/users/{user_id}\` — in curly braces in the path
- **Query param:** function argument NOT in the path — \`?page=2\`
- **Body:** Pydantic model argument — sent as JSON body
- **Header:** \`Header()\` annotation`,

    `## Full reference: HTTP methods and when to use them

\`\`\`python
from fastapi import APIRouter, status

router = APIRouter(prefix="/courses", tags=["courses"])

@router.get("/")           # list all
@router.post("/", status_code=status.HTTP_201_CREATED)  # create
@router.get("/{id}")       # get one
@router.put("/{id}")       # replace completely
@router.patch("/{id}")     # update partially
@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)  # remove
\`\`\`

**Status code conventions:**

| Code | Meaning | When |
|---|---|---|
| 200 | OK | Successful GET or PATCH |
| 201 | Created | Successful POST |
| 204 | No Content | Successful DELETE (no body) |
| 400 | Bad Request | Client logic error |
| 401 | Unauthorized | Not authenticated |
| 403 | Forbidden | Authenticated but no permission |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Duplicate (email already exists) |
| 422 | Unprocessable Entity | Pydantic validation failed |
| 500 | Internal Server Error | Unhandled exception |`,

    `## Full reference: path, query, and body parameters

\`\`\`python
from fastapi import APIRouter, Query, Path
from typing import Annotated
from enum import Enum

class Level(str, Enum):
    beginner     = "beginner"
    intermediate = "intermediate"
    advanced     = "advanced"


# Path parameter — FastAPI extracts from URL pattern
@router.get("/{course_id}")
def get_course(
    course_id: Annotated[int, Path(gt=0, description="The course ID")],
):
    ...


# Query parameters — not in path → treated as query string
# GET /courses?level=beginner&search=python&page=2&per_page=20
@router.get("/")
def list_courses(
    level: Level | None = None,                     # optional enum
    search: str | None = Query(None, min_length=2), # optional with min length
    page: Annotated[int, Query(ge=1)] = 1,          # required to be >= 1
    per_page: Annotated[int, Query(ge=1, le=100)] = 20,
):
    return {"level": level, "search": search, "page": page}
# Output for GET /courses?level=beginner&search=python&page=2:
# {"level": "beginner", "search": "python", "page": 2}


# Body parameter — from Pydantic model
from pydantic import BaseModel

class CourseCreate(BaseModel):
    title: str
    price: float

@router.post("/")
def create_course(body: CourseCreate):   # ← body
    return {"title": body.title, "price": body.price}
\`\`\``,

    `## Full reference: route ordering (important!)

\`\`\`python
# ⚠ FastAPI matches routes IN ORDER — specific before general

router = APIRouter(prefix="/courses")

# CORRECT order:
@router.get("/featured")      # ← fixed path — must be FIRST
@router.get("/{id}")          # ← dynamic path — catches everything else

# WRONG order:
@router.get("/{id}")          # ← "featured" would be treated as id=featured
@router.get("/featured")      # ← this is never reached
\`\`\``,

    `## Real scenario: search + pagination

\`\`\`python
@router.get("/")
def list_courses(
    q: str | None = Query(None, min_length=2, description="Search courses"),
    level: Level | None = None,
    page: Annotated[int, Query(ge=1)] = 1,
    per_page: Annotated[int, Query(ge=1, le=100)] = 20,
):
    """
    Client calls: GET /courses?q=python&level=beginner&page=2
    You get: q="python", level="beginner", page=2, per_page=20 (default)
    All values are already validated — no manual checks needed.
    """
    offset = (page - 1) * per_page
    return {"q": q, "level": level, "offset": offset, "limit": per_page}
# Output: {"q": "python", "level": "beginner", "offset": 20, "limit": 20}
\`\`\``,

    `## Junior mistakes + fix

| Mistake | What happens | Fix |
|---|---|---|
| No \`status_code=201\` on POST | Returns 200, clients that check status codes break | Always set correct status_code on decorator |
| No \`status_code=204\` on DELETE | Returns 200 with empty body (weird) | Set \`status_code=status.HTTP_204_NO_CONTENT\` |
| Magic number status codes | Hard to read | Import \`from fastapi import status\` and use constants |
| Forgetting \`tags=[]\` | All routes in one group in Swagger | Always tag routers |
| Specific route after dynamic route | Specific route never matches | Always put fixed paths before \`/{id}\` |`,
  ],

  // ─── Lesson 3: Pydantic v2 Validation ───────────────────────────────────
  'pb-fastapi-validation': [
    `## Beginner TL;DR — Pydantic v2

Pydantic validates data at the Python level. When a client sends JSON, FastAPI passes it through your Pydantic model first. If anything is wrong, FastAPI returns 422 automatically with field-level error details — no manual validation code needed.

\`\`\`json
// Auto-generated 422 response on bad input:
{
  "detail": [
    {"loc": ["body", "email"], "msg": "value is not a valid email address", "type": "value_error"},
    {"loc": ["body", "age"], "msg": "Input should be greater than 0", "type": "greater_than"}
  ]
}
\`\`\``,

    `## Full reference: Pydantic v2 field types and validators

\`\`\`python
from pydantic import BaseModel, EmailStr, Field, field_validator, model_validator
from typing import Annotated
from datetime import datetime
from enum import Enum

class Role(str, Enum):
    member = "member"
    admin  = "admin"

class UserCreate(BaseModel):
    # String with length constraints
    name: Annotated[str, Field(min_length=2, max_length=100)]

    # Validated email (pip install pydantic[email])
    email: EmailStr

    # Integer with range
    age: Annotated[int, Field(gt=0, lt=130, description="Age in years")]

    # Enum (only allows member/admin)
    role: Role = Role.member   # default value

    # Optional field
    bio: str | None = None

    # ── Field-level validator (runs after type coercion) ──
    @field_validator("name")
    @classmethod
    def name_strip_and_check(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("Name cannot be blank")
        return v

    # ── Cross-field validator ──
    @model_validator(mode="after")
    def check_admin_requires_bio(self) -> "UserCreate":
        if self.role == Role.admin and not self.bio:
            raise ValueError("Admin users must have a bio")
        return self
\`\`\`

**Field constraints reference:**

| Constraint | Type | Meaning |
|---|---|---|
| \`gt=0\` | numeric | greater than 0 (exclusive) |
| \`ge=0\` | numeric | greater than or equal to 0 |
| \`lt=100\` | numeric | less than 100 |
| \`le=100\` | numeric | less than or equal to 100 |
| \`min_length=2\` | string | minimum character count |
| \`max_length=200\` | string | maximum character count |
| \`pattern=r"^\\d{5}\$"\` | string | must match regex |`,

    `## Full reference: three-schema split pattern

\`\`\`python
from pydantic import BaseModel, EmailStr, Field, computed_field
from datetime import datetime
from typing import Annotated

# 1. CREATE schema — what client sends to create
class UserCreate(BaseModel):
    name:     Annotated[str, Field(min_length=2, max_length=100)]
    email:    EmailStr
    password: str                 # present on create only

    model_config = {"str_strip_whitespace": True}

# 2. UPDATE schema — what client sends to partially update (all optional)
class UserUpdate(BaseModel):
    name:  Annotated[str, Field(min_length=2, max_length=100)] | None = None
    email: EmailStr | None = None
    # No password here — password change is a separate endpoint

# 3. RESPONSE schema — what the API returns (never exposes internals)
class UserResponse(BaseModel):
    id:         int
    name:       str
    email:      str
    role:       str
    created_at: datetime

    @computed_field     # derived field — not stored, calculated on render
    @property
    def display_name(self) -> str:
        return f"{self.name} ({self.role})"

    model_config = {"from_attributes": True}   # allows ORM model → schema
    # Never include: password_hash, internal flags, system fields
\`\`\``,

    `## Full reference: model_dump() options

\`\`\`python
user = UserCreate(name="Alice", email="a@b.com", password="secret")

user.model_dump()
# → {"name": "Alice", "email": "a@b.com", "password": "secret"}

user.model_dump(exclude={"password"})
# → {"name": "Alice", "email": "a@b.com"}

user.model_dump(include={"name", "email"})
# → {"name": "Alice", "email": "a@b.com"}

# CRITICAL for PATCH — only include fields the client actually sent
update = UserUpdate(name="Bob")   # only name provided
update.model_dump()
# → {"name": "Bob", "email": None}   ← BAD: overwrites email with None

update.model_dump(exclude_unset=True)
# → {"name": "Bob"}                  ← CORRECT: only what was sent
\`\`\`

**Rule:** For POST/PUT use \`model_dump()\`. For PATCH always use \`model_dump(exclude_unset=True)\`.`,

    `## Real scenario: partial update without data loss

\`\`\`python
@router.patch("/{user_id}", response_model=UserResponse)
def update_user(user_id: int, body: UserUpdate, db: Session = Depends(get_db)):
    user = db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # exclude_unset=True — only the fields the client actually provided
    updates = body.model_dump(exclude_unset=True)
    for field, value in updates.items():
        setattr(user, field, value)
    db.commit()
    db.refresh(user)
    return user

# Client sends: PATCH /users/5  body: {"name": "Alice"}
# Only name is updated. Email, role, bio — untouched.
\`\`\``,

    `## Junior mistakes + fix

| Mistake | What happens | Fix |
|---|---|---|
| One schema for create AND response | Exposes \`password_hash\` in response | Always separate Create / Update / Response |
| PATCH with \`model_dump()\` (no exclude_unset) | Unset fields overwrite DB with None | Always use \`model_dump(exclude_unset=True)\` for PATCH |
| No \`from_attributes=True\` in response schema | Pydantic can't read ORM model attributes | Add \`model_config = {"from_attributes": True}\` |
| Skipping \`EmailStr\` type for email | Invalid emails accepted | Import and use \`EmailStr\` from \`pydantic[email]\` |
| Trusting \`request.json()\` directly | No type safety, crashes on bad input | Always route JSON through a Pydantic model |`,
  ],

  // ─── Lesson 4: JWT Authentication ───────────────────────────────────────
  'pb-fastapi-auth': [
    `## Beginner TL;DR — JWT Auth

JWT (pronounced "JOT") = JSON Web Token. It's a signed string the server gives you after login. You send it on every request to prove who you are.

**Flow in plain English:**
1. You POST your email + password to \`/auth/token\`
2. Server checks password hash, creates a signed JWT with your user ID
3. You store the token (browser memory / localStorage / secure cookie)
4. Every protected request: \`Authorization: Bearer <token>\`
5. Server decodes token, extracts user ID, loads user → allows or denies

**JWT structure:** \`header.payload.signature\` — all base64 encoded.
Anyone can read the payload. Only the server can create a valid signature.`,

    `## Full reference: password hashing

\`\`\`python
from passlib.context import CryptContext

# bcrypt is the industry standard — never use MD5, SHA1, or plain SHA256 for passwords
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(plain: str) -> str:
    return pwd_context.hash(plain)
    # → "$2b$12$..." (bcrypt hash, always 60 characters)

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)

# Usage:
h = hash_password("secret123")
print(len(h))                          # → 60
print(verify_password("secret123", h)) # → True
print(verify_password("wrong", h))     # → False

# ⚠ bcrypt is intentionally slow (100ms+ by design)
# That's what makes brute-forcing infeasible
\`\`\``,

    `## Full reference: JWT creation and decoding

\`\`\`python
from datetime import datetime, timedelta, timezone
from jose import jwt, JWTError

SECRET_KEY = "CHANGE_THIS_IN_PRODUCTION"   # load from env in real code
ALGORITHM  = "HS256"
EXPIRE_MIN = 30

def create_access_token(data: dict, expires_in: int = EXPIRE_MIN) -> str:
    payload = data.copy()
    payload["exp"] = datetime.now(timezone.utc) + timedelta(minutes=expires_in)
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

def decode_token(token: str) -> dict:
    # Raises JWTError if expired or invalid signature
    return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

# Usage:
token = create_access_token({"sub": 42, "role": "admin"})
print(token[:20], "...")
# → "eyJhbGciOiJIUzI1..." 

payload = decode_token(token)
print(payload["sub"])    # → 42
print(payload["role"])   # → "admin"
print(payload["exp"])    # → timestamp (Unix seconds)
\`\`\``,

    `## Full reference: dependency injection for auth

\`\`\`python
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

# tokenUrl tells Swagger UI where the login endpoint is
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token")


async def get_current_user(token: str = Depends(oauth2_scheme)) -> dict:
    """
    FastAPI calls this before the route handler.
    If it raises, the route never runs.
    """
    error = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = decode_token(token)
        user_id = payload.get("sub")
        if user_id is None:
            raise error
        return {"user_id": user_id, "role": payload.get("role", "member")}
    except JWTError:
        raise error


async def require_admin(current_user: dict = Depends(get_current_user)) -> dict:
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin only")
    return current_user


# Usage in routes:
@router.get("/me")
def get_me(current_user: dict = Depends(get_current_user)):
    return current_user

@router.get("/admin/stats")
def admin_stats(current_user: dict = Depends(require_admin)):
    return {"message": "admin only", "by": current_user["user_id"]}
\`\`\``,

    `## Production auth hardening checklist

\`\`\`
✓ SECRET_KEY loaded from environment variable (never in source code)
✓ Access token expires in 15–60 minutes
✓ Refresh token mechanism for seamless re-auth
✓ Rate-limit /auth/token (prevent brute-force): max 5 attempts/minute/IP
✓ Password hashed with bcrypt (not MD5, not SHA1, not plain SHA256)
✓ Generic error messages: "Incorrect email or password" — never "email not found"
✓ HTTPS enforced (tokens sent over plain HTTP can be intercepted)
✓ Blacklist revoked tokens in Redis on logout (for sensitive apps)
✓ Log auth failures with request_id (for incident investigation)
\`\`\``,

    `## Junior mistakes + fix

| Mistake | What happens | Fix |
|---|---|---|
| Hardcode \`SECRET_KEY = "abc"\` in source | Token forged if code is leaked | Load from \`os.environ.get("SECRET_KEY")\` |
| Separate error for "email not found" vs "wrong password" | Attacker learns which emails exist | Return same message for both cases |
| Trust JWT \`role\` claim without checking DB | Deleted/demoted user retains access | Verify role against DB for sensitive actions |
| Skip token expiry | Stolen tokens valid forever | Always set \`exp\` in token payload |
| No rate limiting on login | Brute-force works freely | Use slowapi or reverse-proxy rate limiting |`,
  ],

  // ─── Lesson 5: Async Patterns & Background Tasks ─────────────────────────
  'pb-fastapi-async': [
    `## Beginner TL;DR — async in FastAPI

**async def** = the handler runs on the event loop. One Python thread handles thousands of requests by pausing while waiting for I/O (DB queries, HTTP calls).

**def** = FastAPI runs it in a thread pool. Blocking operations won't freeze other requests.

**Simple rule:**
- DB query or HTTP call → \`async def\`
- CPU work, legacy blocking library → \`def\`
- Mixing blocking code into \`async def\` → freezes every other request (the most common bug)`,

    `## Full reference: async vs def choice

\`\`\`python
# ✅ CORRECT: async def — uses async DB driver or async HTTP
@router.get("/users/{id}")
async def get_user(id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.id == id))
    return result.scalar_one_or_none()

# ✅ CORRECT: def — blocking/CPU work (FastAPI uses thread pool)
@router.post("/process")
def process_image(file: UploadFile):
    # PIL/OpenCV are sync blocking — use def
    image = Image.open(file.file)
    resized = image.resize((100, 100))
    return {"width": 100, "height": 100}

# ❌ WRONG: blocking call inside async def — freezes everything
@router.get("/bad")
async def bad_handler():
    time.sleep(5)                    # blocks the event loop
    data = requests.get("...")        # sync HTTP inside async
    return {"ok": True}

# ✅ FIX: offload blocking work to thread
import asyncio
@router.get("/fixed")
async def fixed_handler():
    result = await asyncio.to_thread(some_blocking_function, arg)
    return result
\`\`\``,

    `## Full reference: concurrent HTTP calls with asyncio.gather

\`\`\`python
import asyncio
import httpx
from fastapi import APIRouter

router = APIRouter()

@router.get("/dashboard")
async def dashboard():
    async with httpx.AsyncClient(timeout=10.0) as client:
        # Both requests fire at the same time — total time ≈ max(t1, t2), not t1+t2
        profile_resp, billing_resp = await asyncio.gather(
            client.get("http://profile-service/api/me"),
            client.get("http://billing-service/api/status"),
        )
    return {
        "profile": profile_resp.json(),
        "billing": billing_resp.json(),
    }

# With error handling — one failure doesn't crash the others:
results = await asyncio.gather(
    client.get("http://service-a/data"),
    client.get("http://service-b/data"),
    return_exceptions=True,           # ← errors become results, not exceptions
)
for i, r in enumerate(results):
    if isinstance(r, Exception):
        print(f"Service {i} failed: {r}")
\`\`\``,

    `## Full reference: lifespan (startup / shutdown)

\`\`\`python
from contextlib import asynccontextmanager
from fastapi import FastAPI
import httpx

# Shared resources — created once, reused across all requests
http_client: httpx.AsyncClient | None = None
ml_model = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    # ── Startup ──────────────────────────────────────
    global http_client, ml_model
    http_client = httpx.AsyncClient(timeout=10.0)
    ml_model    = load_model("model.onnx")       # load once
    print("App started, resources ready")

    yield          # ← application runs here

    # ── Shutdown ─────────────────────────────────────
    await http_client.aclose()
    print("App shutting down, connections closed")

app = FastAPI(lifespan=lifespan)

# Access shared resources in routes via dependency:
def get_http_client():
    return http_client

@app.get("/external")
async def call_external(client: httpx.AsyncClient = Depends(get_http_client)):
    resp = await client.get("https://api.example.com/data")
    return resp.json()
\`\`\``,

    `## Full reference: BackgroundTasks

\`\`\`python
from fastapi import BackgroundTasks

def send_email(email: str, subject: str):
    """Runs AFTER the response is sent. User doesn't wait for it."""
    # call SendGrid / Resend / SES here
    print(f"Email sent to {email}: {subject}")

@router.post("/users/")
def create_user(body: UserCreate, background_tasks: BackgroundTasks):
    user = save_user_to_db(body)

    # Scheduled — runs after response is returned
    background_tasks.add_task(send_email, user.email, "Welcome!")

    return user   # ← user sees this immediately

# ⚠ BackgroundTasks are NOT durable:
#   If the server restarts before the task runs → task is lost.
#   For critical tasks (order confirmation, payment) → use Celery instead.
\`\`\``,

    `## Junior mistakes + fix

| Mistake | What happens | Fix |
|---|---|---|
| \`time.sleep()\` inside \`async def\` | Event loop blocked — all requests queue up | Use \`await asyncio.sleep()\` |
| \`requests.get()\` inside \`async def\` | Blocks event loop | Use \`httpx.AsyncClient\` with \`await\` |
| Create new \`AsyncClient\` per request | Connection pool thrashing | Create once in lifespan, reuse |
| No timeout on async HTTP call | One slow external API stalls your workers | Always set \`timeout=10.0\` on client |
| Use \`BackgroundTasks\` for payment processing | Task lost on restart | Use Celery for durable jobs |`,
  ],

  // ─── Lesson 6: Middleware, CORS & Error Handling ─────────────────────────
  'pb-fastapi-middleware': [
    `## Beginner TL;DR — Middleware

Middleware is a function that wraps EVERY request. It runs before the route handler (inspect/modify request) and after (inspect/modify response).

\`\`\`
Request → Middleware N → ... → Middleware 1 → Route Handler
Response ← Middleware N ← ... ← Middleware 1 ← Route Handler
\`\`\`

Common uses: CORS, request IDs, timing, auth pre-checks, compression, rate limiting.`,

    `## Full reference: CORS configuration

\`\`\`python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",       # local Next.js dev
        "https://myapp.vercel.app",    # production frontend
    ],
    allow_credentials=True,           # needed for cookies / Authorization headers
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type", "X-Request-ID"],
)

# ⚠ NEVER do this in production:
# allow_origins=["*"] with allow_credentials=True → browsers reject it
# allow_origins=["*"] with allow_credentials=False → OK for public APIs

# Environment-driven origins:
import os
ORIGINS = os.environ.get("ALLOWED_ORIGINS", "http://localhost:3000").split(",")
app.add_middleware(CORSMiddleware, allow_origins=ORIGINS, ...)
\`\`\``,

    `## Full reference: custom middleware

\`\`\`python
import time, uuid
from starlette.middleware.base import BaseHTTPMiddleware
from fastapi import Request, Response

class RequestIDMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next) -> Response:
        request_id = str(uuid.uuid4())[:8]
        request.state.request_id = request_id          # available in route handlers
        response = await call_next(request)
        response.headers["X-Request-ID"] = request_id  # visible to clients
        return response


class TimingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next) -> Response:
        start = time.perf_counter()
        response = await call_next(request)
        ms = (time.perf_counter() - start) * 1000
        response.headers["X-Response-Time"] = f"{ms:.1f}ms"
        if ms > 1000:
            print(f"SLOW: {request.method} {request.url.path} {ms:.0f}ms")
        return response


# Registration order matters:
# Last added = first to run on request / last on response
app.add_middleware(RequestIDMiddleware)   # runs second on request, second on response
app.add_middleware(TimingMiddleware)      # runs first on request, first on response
# Timing wraps RequestID, so timing includes the time to generate a request ID
\`\`\``,

    `## Full reference: global exception handlers

\`\`\`python
from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError

def register_handlers(app: FastAPI):

    @app.exception_handler(HTTPException)
    async def http_error(request: Request, exc: HTTPException):
        return JSONResponse(
            status_code=exc.status_code,
            content={
                "error": {
                    "code": exc.status_code,
                    "message": exc.detail,
                    "request_id": getattr(request.state, "request_id", None),
                }
            },
        )

    @app.exception_handler(RequestValidationError)
    async def validation_error(request: Request, exc: RequestValidationError):
        fields = [
            {"field": ".".join(str(l) for l in e["loc"] if l != "body"),
             "message": e["msg"],
             "type": e["type"]}
            for e in exc.errors()
        ]
        return JSONResponse(
            status_code=422,
            content={"error": {"code": 422, "message": "Validation failed", "fields": fields}},
        )

    @app.exception_handler(Exception)
    async def unhandled_error(request: Request, exc: Exception):
        import traceback; traceback.print_exc()
        return JSONResponse(
            status_code=500,
            content={"error": {"code": 500, "message": "An internal error occurred."}},
        )
\`\`\``,

    `## Real scenario: incident investigation with request IDs

A user emails: "My request failed around 3:05 PM." Without request IDs, you search logs by timestamp and hope.

With request IDs:
1. User reports the ID from the \`X-Request-ID\` response header (or you fetch it from your frontend error log)
2. Search structured logs: \`request_id = "ab3f71c2"\`
3. See every middleware, service, and DB call that request touched
4. Find the exact line that raised the exception, with full context

This is the difference between a 3-hour investigation and a 3-minute one.`,

    `## Junior mistakes + fix

| Mistake | What happens | Fix |
|---|---|---|
| \`allow_origins=["*"]\` with credentials | Browser silently rejects all requests | Use explicit origin list |
| No catch-all \`Exception\` handler | Raw tracebacks returned to clients | Always register an unhandled exception handler |
| Swallowing exceptions in middleware | Errors silently disappear | Re-raise or return proper error response |
| Not clearing context vars between requests | Request context bleeds across requests | Call \`structlog.contextvars.clear_contextvars()\` at start of each request |
| Middleware order confusion | Timing/auth in wrong order | Remember: last added = first to run |`,
  ],
}

function toBlocks(markdowns: string[]): ContentBlock[] {
  return markdowns.map(markdown => ({ type: 'text' as const, markdown }))
}

export function applyPhase5FastapiEnhancements(lessons: Lesson[]): Lesson[] {
  return lessons.map(lesson => {
    const markdowns = phase5Blocks[lesson.id]
    if (!markdowns) return lesson
    return {
      ...lesson,
      content: [...toBlocks(markdowns), ...lesson.content],
    }
  })
}
