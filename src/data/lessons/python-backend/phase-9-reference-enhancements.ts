import type { ContentBlock, Lesson } from '@/types/lesson'

// ─── PHASE 9: Python Full-Stack Reference Sheet ───────────────────────────────
// Comprehensive quick-reference for the entire Python backend curriculum.
// Designed for professionals who need to recall syntax/patterns fast.
// ─────────────────────────────────────────────────────────────────────────────

const phase9Blocks: Record<string, string[]> = {
  'py-cheat-sheet': [
    `## How to use this reference

This is a fast-lookup companion for the entire Python Full-Stack module.
Each section mirrors a phase. Use \`Ctrl+F\` to jump to what you need.

**Legend:**
- \`→\` means "evaluates to / outputs"
- \`# ⚠\` marks common mistakes
- \`# ✅\` marks the correct pattern`,

    `## Phase 1: Python Core — types and operators

\`\`\`python
# Numbers
x = 10; y = 3
x // y    # → 3  (floor division)
x % y     # → 1  (modulo — remainder)
x ** 2    # → 100 (power)
abs(-5)   # → 5
round(3.7) # → 4

# Strings
s = "  hello  "
s.strip()           # → "hello"
s.lstrip()          # → "hello  "
s.rstrip()          # → "  hello"
s.upper()           # → "  HELLO  "
s.lower()           # → "  hello  "
s.replace("e","a")  # → "  hallo  "
s.split()           # → ["hello"]
", ".join(["a","b"]) # → "a, b"
"x" in "python"     # → True
f"{'hello':>10}"    # → "     hello" (right-align, width 10)
f"{3.14159:.2f}"    # → "3.14"

# Type conversion
int("42")      # → 42
float("3.14")  # → 3.14
str(100)       # → "100"
bool(0)        # → False
bool(1)        # → True
bool("")       # → False
bool("x")     # → True
\`\`\``,

    `## Phase 1: Control flow and comprehensions

\`\`\`python
# if / elif / else
x = 10
"big" if x > 5 else "small"   # → "big"  (ternary)

# match / case (Python 3.10+)
match status:
    case 200: return "ok"
    case 404: return "not found"
    case _:   return "unknown"

# List comprehension
[x**2 for x in range(5)]              # → [0, 1, 4, 9, 16]
[x for x in range(10) if x % 2 == 0] # → [0, 2, 4, 6, 8]

# Dict comprehension
{k: v*2 for k, v in {"a":1,"b":2}.items()}  # → {"a": 2, "b": 4}

# Set comprehension
{x % 3 for x in range(9)}   # → {0, 1, 2}

# Generator (lazy — no list in memory)
total = sum(x**2 for x in range(1_000_000))  # efficient
\`\`\``,

    `## Phase 1: Collections reference

\`\`\`python
# List
lst = [1, 2, 3]
lst.append(4)       # [1,2,3,4]
lst.extend([5,6])   # [1,2,3,4,5,6]
lst.insert(0, 0)    # [0,1,2,3,4,5,6]
lst.pop()           # removes last → 6
lst.pop(0)          # removes at index 0 → 0
lst.remove(3)       # removes first 3
lst.sort()          # in-place sort
sorted(lst)         # new sorted list
lst.reverse()       # in-place reverse
lst.index(2)        # → 1 (position of value 2)
lst.count(2)        # → 1 (how many times 2 appears)
len(lst)            # → count
lst[1:3]            # → [2, 3] (slice)
lst[::-1]           # → reversed copy

# Tuple (immutable)
t = (1, 2, 3)
t[0]          # → 1
a, b, c = t   # unpack
first, *rest  = t   # → first=1, rest=[2,3]
len(t)        # → 3

# Dict
d = {"a": 1, "b": 2}
d["a"]                   # → 1  (KeyError if missing)
d.get("c", 0)            # → 0  (safe get with default)
d["c"] = 3               # add/update
d.pop("a")               # remove and return value
d.keys()                 # dict_keys(["b", "c"])
d.values()               # dict_values([2, 3])
d.items()                # dict_items([("b",2),("c",3)])
d.update({"d": 4})       # merge another dict in
{**d, "e": 5}            # merge into new dict (spread)

from collections import defaultdict, Counter
dd = defaultdict(list)
dd["x"].append(1)        # safe — no KeyError

c = Counter("aabbc")     # → Counter({'a':2,'b':2,'c':1})
c.most_common(2)         # → [('a',2),('b',2)]

# Set
s = {1, 2, 3}
s.add(4)
s.discard(99)   # remove if present, no error
s | {5}         # union
s & {2, 3}      # intersection → {2, 3}
s - {2}         # difference  → {1, 3, 4}
2 in s          # → True
\`\`\``,

    `## Phase 1: Functions and exceptions

\`\`\`python
# Args, kwargs, keyword-only
def func(pos, /, normal, *, kw_only, **kwargs):
    pass

# Default value — NEVER mutable
def add_item(name, items=None):   # ✅
    if items is None:
        items = []
    items.append(name)
    return items

# Exceptions
try:
    result = int("bad")
except ValueError as e:
    print(e)          # invalid literal for int() with base 10: 'bad'
except (TypeError, KeyError):
    pass
else:
    pass              # runs only if no exception
finally:
    pass              # ALWAYS runs (cleanup)

# Raise
raise ValueError("must be positive")
raise RuntimeError("DB failed") from original_exc   # chain exceptions

# Custom exception
class CourseNotFound(Exception):
    def __init__(self, course_id: int):
        super().__init__(f"Course {course_id} not found")
        self.course_id = course_id
\`\`\``,

    `## Phase 2: DSA — Big O quick reference

\`\`\`python
# List operations — know the complexity
lst.append(x)     # O(1)
lst.pop()         # O(1)
lst.insert(0, x)  # O(n) ← shifts all elements
x in lst          # O(n)
lst[i]            # O(1)
sorted(lst)       # O(n log n)

# Dict / Set operations
d[k]              # O(1)
k in d            # O(1)
s.add(x)          # O(1)
x in s            # O(1)

# Heap (heapq)
import heapq
heap = []
heapq.heappush(heap, 3)    # O(log n)
heapq.heappop(heap)        # O(log n) — returns smallest
heap[0]                    # O(1)  — peek min

# Binary search (requires sorted list)
import bisect
bisect.bisect_left([1,2,3,5], 4)   # → 3 (insertion point)
\`\`\``,

    `## Phase 3: Tooling — essential commands

\`\`\`bash
# Virtual env
python -m venv .venv
source .venv/bin/activate       # Linux/Mac
.venv\\Scripts\\Activate.ps1     # Windows PowerShell

# uv (faster alternative)
uv venv
uv sync                         # install from uv.lock
uv add fastapi                  # add dependency + update lock
uv add --dev pytest ruff mypy   # dev-only

# Code quality
ruff check .                    # lint
ruff check . --fix              # auto-fix
ruff format .                   # format
mypy app/                       # type check
pytest --cov=app                # tests + coverage

# Environment variables
# .env file:
DATABASE_URL=postgresql://...
SECRET_KEY=abc123

# Python:
from dotenv import load_dotenv
import os
load_dotenv()
DB_URL = os.environ["DATABASE_URL"]
\`\`\``,

    `## Phase 4: Django — most-used patterns

\`\`\`python
# ORM lookups
Model.objects.filter(field=value)
Model.objects.get(pk=1)           # exactly one or exception
Model.objects.filter(pk=1).first()  # one or None
Model.objects.filter(name__icontains="py")  # case-insensitive LIKE
Model.objects.filter(price__lte=50)
Model.objects.select_related("author")     # JOIN (FK)
Model.objects.prefetch_related("tags")     # separate SELECT (M2M)
Model.objects.annotate(n=Count("reviews")) # computed per row
Model.objects.aggregate(avg=Avg("price"))  # one value for all rows

# DRF response codes
from rest_framework import status
status.HTTP_200_OK
status.HTTP_201_CREATED
status.HTTP_204_NO_CONTENT
status.HTTP_400_BAD_REQUEST
status.HTTP_401_UNAUTHORIZED
status.HTTP_403_FORBIDDEN
status.HTTP_404_NOT_FOUND
\`\`\``,

    `## Phase 5: FastAPI — most-used patterns

\`\`\`python
from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import Annotated

router = APIRouter(prefix="/courses", tags=["courses"])

@router.get("/", response_model=list[CourseResponse])
async def list_courses(
    q: str | None = Query(None, min_length=2),
    page: Annotated[int, Query(ge=1)] = 1,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user),
):
    ...

# HTTP exceptions
raise HTTPException(status_code=404, detail="Course not found")
raise HTTPException(status_code=401, headers={"WWW-Authenticate": "Bearer"})

# Pydantic PATCH pattern
updates = body.model_dump(exclude_unset=True)  # only sent fields
for k, v in updates.items():
    setattr(obj, k, v)
\`\`\``,

    `## Phase 6: SQLAlchemy 2.0 — most-used patterns

\`\`\`python
from sqlalchemy import select, insert, update, delete, func

# Select
result = await db.execute(select(Course).where(Course.is_published == True))
courses = result.scalars().all()           # list of ORM objects
course  = result.scalar_one_or_none()     # one or None

# With eager loading
result = await db.execute(
    select(Course).options(selectinload(Course.author))
)

# Bulk update
await db.execute(update(Course).where(Course.level=="free").values(price=0))
await db.commit()

# Aggregation
r = await db.execute(select(func.count(Course.id), func.avg(Course.price)))
total, avg = r.one()

# Alembic
# alembic upgrade head         → apply all migrations
# alembic downgrade -1         → undo last migration
# alembic revision --autogenerate -m "desc"  → detect changes
\`\`\``,

    `## Phase 7: Testing — most-used patterns

\`\`\`python
import pytest
from unittest.mock import AsyncMock, patch

# Fixture
@pytest.fixture
async def auth_headers(client):
    resp = await client.post("/auth/token", data={...})
    return {"Authorization": f"Bearer {resp.json()['access_token']}"}

# Basic test
async def test_endpoint(client, auth_headers):
    resp = await client.get("/courses/", headers=auth_headers)
    assert resp.status_code == 200
    assert isinstance(resp.json(), list)

# Exception test
def test_bad_input():
    with pytest.raises(ValueError, match="must be positive"):
        validate_price(-1)

# Parametrize
@pytest.mark.parametrize("price,ok", [(0, True), (-1, False), (None, False)])
def test_price(price, ok):
    assert is_valid_price(price) == ok

# Mock async
@patch("app.services.send_email", new_callable=AsyncMock)
async def test_creates_user(mock_email, client):
    await client.post("/users/", json={...})
    mock_email.assert_awaited_once()
\`\`\``,

    `## Phase 8: Production — most-used commands and patterns

\`\`\`bash
# Docker
docker build -t myapp:latest .
docker run -p 8000:8000 --env-file .env myapp:latest
docker compose up -d
docker compose exec api alembic upgrade head
docker compose logs -f api

# Celery
celery -A app.celery_app worker -Q default,email --loglevel=info
celery -A app.celery_app beat
celery -A app.celery_app flower --port=5555

# Gunicorn + Uvicorn (production)
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000

# Logs (production JSON)
cat app.log | jq 'select(.status_code >= 500)'
cat app.log | jq 'select(.duration_ms > 500)'
cat app.log | jq 'select(.request_id == "ab3f71c2")'
\`\`\`

\`\`\`python
# Health check pattern
@router.get("/health")
async def health(): return {"status": "ok"}

@router.get("/health/ready")
async def ready(db=Depends(get_db)):
    await db.execute(text("SELECT 1"))   # will raise if DB is down
    return {"status": "ready"}
\`\`\``,

    `## Pronunciation guide — terms you must say aloud

| Term | Correct pronunciation |
|---|---|
| Python | PY-thon |
| Django | JANG-oh (D is silent) |
| FastAPI | FAST-ay-PY-eye |
| Pydantic | py-DAN-tik |
| SQLAlchemy | SQL-AL-kem-ee |
| Alembic | AL-em-bik |
| ASGI | AZ-ghee |
| WSGI | WIZ-ghee |
| Uvicorn | YEW-vi-korn |
| Gunicorn | GUN-i-korn |
| Redis | REH-dis |
| Celery | SEL-er-ee |
| pytest | PY-test |
| ORM | O-R-M (say each letter) |
| DRF | D-R-F (say each letter) |
| JWT | JOT (or J-W-T) |
| OAuth | OH-auth |
| CORS | KORZ (or C-O-R-S) |
| API | AY-pee-eye |
| JSON | JAY-son |
| YAML | YAM-ul |
| SQL | SEE-kwel (or S-Q-L) |
| PostgreSQL | POST-gres-cue-el |`,
  ],
}

function toBlocks(markdowns: string[]): ContentBlock[] {
  return markdowns.map(markdown => ({ type: 'text' as const, markdown }))
}

export function applyPhase9ReferenceEnhancements(lessons: Lesson[]): Lesson[] {
  return lessons.map(lesson => {
    const markdowns = phase9Blocks[lesson.id]
    if (!markdowns) return lesson
    return {
      ...lesson,
      content: [...toBlocks(markdowns), ...lesson.content],
    }
  })
}
