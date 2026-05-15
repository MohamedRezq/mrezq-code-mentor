import type { ContentBlock } from '@/types/lesson'
import type { LessonEnhancement } from '@/lib/curriculum/reviewer-types'
import { mergeReviewerEnhancements as mergeBlocks } from '@/lib/curriculum/reviewer-merge'

export type { LessonEnhancement }

function roadmapIntro(phase: string, topics: string): ContentBlock {
  return {
    type: 'callout',
    tone: 'tip',
    title: `Reviewer note · ${phase} (roadmap.sh aligned)`,
    content: `This lesson is mapped to [roadmap.sh](https://roadmap.sh/python) and related paths. You should not need external tutorials if you read every block and complete every exercise. Topics here: ${topics}.`,
  }
}

function clarify(title: string, content: string): ContentBlock {
  return { type: 'callout', tone: 'clarification', title, content }
}

function practice(
  title: string,
  description: string,
  starterCode: string,
  solution: string,
  hints?: string[]
): ContentBlock {
  return {
    type: 'exercise',
    title,
    description,
    starterCode,
    language: 'python',
    solution,
    hints,
  }
}

/** Tutor + reviewer additions for Module 09 — merged in python-backend/index.ts */
export const REVIEWER_ENHANCEMENTS: Record<string, LessonEnhancement> = {
  // ── Phase 1: Python core ──
  'py-getting-started': {
    intro: [
      roadmapIntro('Phase 1', 'install Python, REPL, scripts, variables, PEP 8'),
      clarify(
        'REPL vs script file',
        'The **REPL** (interactive `>>>`) is for experiments: type one line, see the result immediately. A **`.py` file** is for programs you run again: `python main.py`. Full-stack work uses both: REPL to test an idea, script or module for anything you ship.'
      ),
    ],
    outro: [
      practice(
        'First script',
        'Create variables for a product name, quantity, and unit price. Print one line with an f-string showing the line total formatted to two decimals.',
        `product = "Notebook"
qty = 3
unit_price = 4.5
# print one formatted line
`,
        `product = "Notebook"
qty = 3
unit_price = 4.5
print(f"{product} x{qty} @ {unit_price:.2f} = {qty * unit_price:.2f}")`,
        ['Use f"{...}" inside the string', 'Multiply qty * unit_price before formatting']
      ),
    ],
  },
  'py-types-and-strings': {
    intro: [roadmapIntro('Phase 1', 'int, float, str, bool, casting, f-strings')],
    outro: [
      clarify(
        'Casting is explicit on purpose',
        '`int("42")` works; `int("3.14")` fails because the whole string must be a valid integer literal. For floats from strings use `float()` first, then `int()` if you need truncation — or `int(float("3.14"))` for truncation toward zero.'
      ),
    ],
  },
  'py-operators-truthiness': {
    intro: [roadmapIntro('Phase 1', 'operators, truthiness, short-circuit, walrus')],
  },
  'py-control-flow': {
    intro: [roadmapIntro('Phase 1', 'if/elif/else, match-case (3.10+)')],
    outro: [
      clarify(
        'When to use match vs if/elif',
        'Use **match** when you branch on the *shape* of a value (dict keys, tuple structure, class types). Use **if/elif** for ranges, booleans, and simple comparisons. Both compile to similar logic — match is clearer for HTTP payloads and AST-like data.'
      ),
    ],
  },
  'py-loops-iterations': {
    intro: [roadmapIntro('Phase 1', 'for, while, range, enumerate, comprehensions')],
    outro: [
      practice(
        'enumerate in a loop',
        'Given `names = ["ada", "linus", "guido"]`, print each line as `0: ada` using enumerate (no manual index variable).',
        `names = ["ada", "linus", "guido"]
# your loop
`,
        `names = ["ada", "linus", "guido"]
for i, name in enumerate(names):
    print(f"{i}: {name}")`,
      ),
    ],
  },
  'py-functions-deep': {
    intro: [roadmapIntro('Phase 1', 'def, *args, **kwargs, lambdas, docstrings')],
    outro: [
      clarify(
        'Mutable default argument trap',
        'Never write `def f(items=[]):` — the same list object is reused across calls. Use `def f(items=None): items = items or []` or `items = [] if items is None else items`. This is one of the most common Python interview questions.'
      ),
    ],
  },
  'py-modules-stdlib': {
    intro: [roadmapIntro('Phase 1', 'import, packages, pathlib, urllib')],
  },
  'py-collections-pro': {
    intro: [roadmapIntro('Phase 1', 'list, tuple, set, dict, Counter, defaultdict, deque')],
    outro: [
      clarify(
        'Pick the right collection',
        '**list** — ordered sequence you mutate. **tuple** — fixed bundle (coordinates, DB row). **set** — unique members, fast `in`. **dict** — key → value map. Choosing wrong costs performance: never use a list as a queue (use `deque`).'
      ),
    ],
  },
  'py-exceptions-files': {
    intro: [roadmapIntro('Phase 1', 'try/except/finally, context managers, file I/O')],
  },
  'py-json-datetime': {
    intro: [roadmapIntro('Phase 1', 'json module, datetime, timezone-aware UTC')],
    outro: [
      clarify(
        'JSON is not Python',
        'JSON only has objects, arrays, strings, numbers, booleans, null. Python `datetime` and `set` are not JSON-native — use `.isoformat()` or `default=str` in `json.dumps` when serializing.'
      ),
    ],
  },
  'py-regex': {
    intro: [roadmapIntro('Phase 1', 're module, raw strings, compile for reuse')],
    outro: [
      practice(
        'Extract emails (simple)',
        'Use `re.findall` with a simple pattern to find substrings like `user@domain.com` in text (pattern can be naive).',
        `import re
text = "Contact ada@example.com or support@acme.io"
# emails = ...
`,
        `import re
text = "Contact ada@example.com or support@acme.io"
emails = re.findall(r"[\\w.+-]+@[\\w.-]+\\.[a-zA-Z]{2,}", text)
print(emails)`,
      ),
    ],
  },
  'py-oop-solid': {
    intro: [roadmapIntro('Phase 1', 'classes, dataclasses, Protocol, encapsulation')],
  },
  'py-patterns-advanced': {
    intro: [roadmapIntro('Phase 1', 'iterators, generators, decorators, context managers')],
    outro: [
      clarify(
        'Generator vs list',
        'A **list comprehension** builds everything in memory. A **generator** (`yield` or `(x for x in ...)`) produces one item at a time — essential for large files and streams.'
      ),
    ],
  },

  // ── Phase 2: DSA ──
  'py-dsa-complexity': {
    intro: [roadmapIntro('Phase 2', 'Big O, time/space complexity')],
    outro: [
      clarify(
        'Big O is upper bound',
        'O(n) means growth is *at most* linear in n for large n — constants are dropped. O(1) is constant time; O(log n) is binary search; O(n log n) is efficient sort. When in doubt, count nested loops over input size.'
      ),
    ],
  },
  'py-dsa-linear': {
    intro: [roadmapIntro('Phase 2', 'arrays, stacks, queues, linked lists')],
  },
  'py-dsa-hash': {
    intro: [roadmapIntro('Phase 2', 'hash tables, dict internals, collisions')],
  },
  'py-dsa-trees': {
    intro: [roadmapIntro('Phase 2', 'trees, BST, heaps, BFS/DFS')],
  },
  'py-dsa-algorithms': {
    intro: [roadmapIntro('Phase 2', 'sorting, searching, two pointers')],
    outro: [
      practice(
        'Binary search sketch',
        'Implement iterative binary search on a sorted list of ints. Return index or -1.',
        `def binary_search(nums: list[int], target: int) -> int:
    lo, hi = 0, len(nums) - 1
    # while lo <= hi: ...
    return -1
`,
        `def binary_search(nums: list[int], target: int) -> int:
    lo, hi = 0, len(nums) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if nums[mid] == target:
            return mid
        if nums[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1`,
      ),
    ],
  },

  // ── Phase 3: Tooling ──
  'py-env': {
    intro: [roadmapIntro('Phase 3', 'venv, uv, pyenv, .env')],
  },
  'py-packaging': {
    intro: [roadmapIntro('Phase 3', 'pip, pyproject.toml, Poetry, uv')],
  },
  'py-typing': {
    intro: [roadmapIntro('Phase 3', 'type hints, mypy, Pydantic models')],
    outro: [
      clarify(
        'Types are for humans and tools',
        'Python does not enforce types at runtime by default. Hints help **mypy/pyright** catch bugs before deploy; **Pydantic** enforces types at API boundaries when data enters your system.'
      ),
    ],
  },
  'py-quality': {
    intro: [roadmapIntro('Phase 3', 'ruff, pytest, formatting')],
  },
  'py-fullstack-scripts': {
    intro: [roadmapIntro('Phase 3', 'httpx, dotenv, argparse CLI scripts')],
  },
  'py-concurrency': {
    intro: [roadmapIntro('Phase 3', 'asyncio, async/await, gather')],
    outro: [
      clarify(
        'async is for waiting, not CPU',
        'Use **asyncio** when your code waits on I/O (HTTP, DB, files). CPU-heavy work still blocks the event loop — offload with `asyncio.to_thread()` or a process pool.'
      ),
    ],
  },

  // ── Phase 4: Django & Flask ──
  'dj-intro': {
    intro: [roadmapIntro('Phase 4', 'Django MTV, startproject, settings')],
    outro: [
      clarify(
        'Django is batteries-included',
        'You get ORM, admin, auth, migrations, and template engine in one framework. Trade-off: more structure and conventions than Flask — faster for CRUD-heavy products.'
      ),
    ],
  },
  'dj-models': {
    intro: [roadmapIntro('Phase 4', 'models, fields, migrations')],
  },
  'dj-views': {
    intro: [roadmapIntro('Phase 4', 'FBV, CBV, templates, URLs')],
  },
  'dj-drf': {
    intro: [roadmapIntro('Phase 4', 'serializers, viewsets, routers, OpenAPI')],
  },
  'dj-auth': {
    intro: [roadmapIntro('Phase 4', 'AUTH_USER_MODEL, permissions, JWT with DRF')],
  },
  'py-flask': {
    intro: [roadmapIntro('Phase 4', 'application factory, blueprints')],
  },
  'py-frameworks-mastery': {
    intro: [roadmapIntro('Phase 4', 'Django vs Flask vs FastAPI trade-offs')],
    outro: [
      practice(
        'Framework choice (written)',
        'In comments, pick Django, Flask, or FastAPI for: (1) internal admin + CRUD app, (2) tiny webhook service, (3) high-concurrency public API. One sentence each.',
        `# 1. admin + CRUD:
# 2. webhook:
# 3. public API:
`,
        `# 1. Django — admin, ORM, auth out of the box
# 2. Flask — minimal surface, full control
# 3. FastAPI — async, Pydantic validation, auto OpenAPI`,
      ),
    ],
  },

  // ── Phase 5: FastAPI ──
  'pb-fastapi-intro': {
    intro: [
      roadmapIntro('Phase 5', 'FastAPI, uvicorn, ASGI, OpenAPI'),
      clarify(
        'Why FastAPI for new APIs',
        'You get automatic request/response validation from type hints, interactive docs at `/docs`, and native async — the default stack for greenfield Python APIs in 2026.'
      ),
    ],
    outro: [
      practice(
        'Health endpoint',
        'Add a GET `/version` route that returns `{"version": "1.0.0"}` (assume `app` exists).',
        `from fastapi import FastAPI
app = FastAPI()

# add GET /version
`,
        `from fastapi import FastAPI
app = FastAPI()

@app.get("/version")
def version():
    return {"version": "1.0.0"}`,
      ),
    ],
  },
  'pb-fastapi-routing': {
    intro: [roadmapIntro('Phase 5', 'path/query params, APIRouter, status codes')],
    outro: [
      clarify(
        'Path vs query vs body',
        '**Path** identifies the resource (`/users/42`). **Query** filters or options (`?limit=10`). **Body** carries create/update payloads (POST/PATCH). FastAPI infers each from function parameters.'
      ),
    ],
  },
  'pb-fastapi-validation': {
    intro: [roadmapIntro('Phase 5', 'Pydantic v2, BaseModel, Field validators')],
    outro: [
      clarify(
        'Validation happens before your code',
        'If the client sends invalid JSON or wrong types, FastAPI returns **422 Unprocessable Entity** with field errors — your route handler never runs. That is your first line of defense.'
      ),
    ],
  },
  'pb-fastapi-auth': {
    intro: [roadmapIntro('Phase 5', 'JWT, OAuth2 password flow, Depends')],
    outro: [
      practice(
        'Depends mental model',
        'In one comment each: what `Depends(get_db)` and `Depends(get_current_user)` typically provide to a route.',
        `# get_db:
# get_current_user:
`,
        `# get_db: yields an async DB session, closed after the request
# get_current_user: validates JWT/cookie and returns the authenticated user or 401`,
      ),
    ],
  },
  'pb-fastapi-async': {
    intro: [roadmapIntro('Phase 5', 'async def routes, AsyncSession, httpx')],
    outro: [
      clarify(
        'async def on routes',
        'Declare `async def` when the handler awaits DB or HTTP. Use plain `def` only for quick CPU-only work — FastAPI runs sync handlers in a thread pool so they do not block the event loop forever, but async I/O should be async all the way down.'
      ),
    ],
  },
  'pb-fastapi-middleware': {
    intro: [roadmapIntro('Phase 5', 'CORS, GZip, custom middleware, lifespan')],
    outro: [
      clarify(
        'Middleware order',
        'Middleware wraps the app like an onion — **first added runs last on the way in** (Starlette order). Put CORS and security headers early in the stack; logging often outermost.'
      ),
    ],
  },

  // ── Phase 6: Databases ──
  'pb-db-sqlalchemy': {
    intro: [
      roadmapIntro('Phase 6', 'SQLAlchemy 2.0, Mapped, async engine'),
      clarify(
        'ORM vs raw SQL',
        'The ORM maps Python classes to tables — great for app logic and migrations. Raw SQL (`text("SELECT ...")`) is fine for reports and complex analytics. Use 2.0 `select()` style everywhere new.'
      ),
    ],
  },
  'pb-db-alembic': {
    intro: [roadmapIntro('Phase 6', 'Alembic revisions, upgrade/downgrade')],
    outro: [
      clarify(
        'Migrations are the schema contract',
        '`alembic revision --autogenerate` drafts changes from models; `alembic upgrade head` applies them. Never edit applied migration files in a shared repo — add a new revision instead.'
      ),
    ],
  },
  'pb-db-queries': {
    intro: [roadmapIntro('Phase 6', 'select/join, eager loading, N+1')],
    outro: [
      clarify(
        'N+1 query problem',
        'Loading 100 posts then 100 separate queries for each author is **N+1**. Fix with `selectinload()` or `joinedload()` in the same query — one of the most common production ORM bugs.'
      ),
    ],
  },
  'pb-db-redis': {
    intro: [roadmapIntro('Phase 6', 'Redis cache, TTL, pub/sub')],
  },
  'pb-db-postgres-advanced': {
    intro: [roadmapIntro('Phase 6', 'indexes, EXPLAIN, connection pooling')],
    outro: [
      practice(
        'Index intuition',
        'In comments: why put an index on `email` for login lookups? Why might too many indexes hurt writes?',
        `# email index:
# too many indexes:
`,
        `# email index: speeds WHERE email = ? from O(n) scan to O(log n) lookup
# too many indexes: every INSERT/UPDATE must update each index — slower writes, more disk`,
      ),
    ],
  },

  // ── Phase 7: Testing ──
  'pb-test-pytest': {
    intro: [
      roadmapIntro('Phase 7', 'pytest, fixtures, parametrize'),
      clarify(
        'Arrange–Act–Assert',
        'Every test: **Arrange** setup data, **Act** call the function/API, **Assert** one clear outcome. Multiple asserts are fine if they describe one behavior.'
      ),
    ],
    outro: [
      practice(
        'Tiny pytest',
        'Write `test_double` that asserts `double(3) == 6` (define `double` in the same file).',
        `def double(n: int) -> int:
    return n * 2

def test_double():
    # assert ...
`,
        `def double(n: int) -> int:
    return n * 2

def test_double():
    assert double(3) == 6`,
      ),
    ],
  },
  'pb-test-api': {
    intro: [roadmapIntro('Phase 7', 'TestClient, async tests, httpx')],
    outro: [
      clarify(
        'Test the HTTP contract',
        'API tests should check status code, response JSON shape, and auth failures — not internal private functions. Use FastAPI `TestClient` or `httpx.AsyncClient` with `ASGITransport`.'
      ),
    ],
  },
  'pb-test-patterns': {
    intro: [roadmapIntro('Phase 7', 'mocking, factories, CI gates')],
    outro: [
      practice(
        'What to mock',
        'List two things you *should* mock in unit tests and two you should *not* mock in integration tests.',
        `# unit — mock:
# unit — do not mock:
# integration — real:
`,
        `# unit mock: external APIs, clock, random
# unit do not mock: the function you are testing
# integration real: DB (test container), HTTP app via TestClient`,
      ),
    ],
  },

  // ── Phase 8: Production ──
  'pb-prod-docker': {
    intro: [
      roadmapIntro('Phase 8', 'Dockerfile, multi-stage, compose'),
      clarify(
        'Multi-stage builds',
        'Builder stage installs compile deps and builds wheels; final stage copies only runtime artifacts — smaller image, fewer attack surfaces.'
      ),
    ],
  },
  'pb-prod-celery': {
    intro: [roadmapIntro('Phase 8', 'Celery workers, Redis broker, tasks')],
    outro: [
      clarify(
        'Sync API vs background task',
        'Return HTTP 202 quickly and process email/PDF/report in a **Celery** task. Never block a request for minutes — users timeout, and you waste web workers.'
      ),
    ],
  },
  'pb-prod-observability': {
    intro: [roadmapIntro('Phase 8', 'structured logs, metrics, OpenTelemetry')],
  },
  'pb-prod-deployment': {
    intro: [roadmapIntro('Phase 8', '12-factor, env config, health checks')],
    outro: [
      practice(
        'Production checklist',
        'In comments, list three checks you run before promoting a release (any three from this lesson).',
        `# 1.
# 2.
# 3.
`,
        `# 1. migrations applied (alembic upgrade head)
# 2. /health and /ready return 200
# 3. secrets from env, not in image; smoke test critical API paths`,
      ),
    ],
  },

  // ── Phase 9: Reference ──
  'py-cheat-sheet': {
    intro: [
      roadmapIntro('Phase 9', 'full module recap, printable PDF'),
      clarify(
        'How to use the cheat sheet',
        'The printable page is **dense reference**, not a substitute for exercises. When stuck, find the snippet here, then return to the lesson for why it works.'
      ),
    ],
    outro: [
      {
        type: 'callout',
        tone: 'tip',
        title: 'Full printable reference',
        content:
          'Open [/learn/python-backend/cheat-sheet](/learn/python-backend/cheat-sheet) — 21 sections from syntax through deployment. Print → Save as PDF for offline use.',
      },
    ],
  },
}

export function mergeReviewerEnhancements(lessonId: string, content: ContentBlock[]): ContentBlock[] {
  return mergeBlocks(content, REVIEWER_ENHANCEMENTS[lessonId])
}
