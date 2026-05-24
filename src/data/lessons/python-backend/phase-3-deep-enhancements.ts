import type { ContentBlock, Lesson } from '@/types/lesson'

// ─── PHASE 3 TOOLING DEEP ENHANCEMENTS ───────────────────────────────────────
// Adds to every lesson:
//   · Terminology + pronunciation table
//   · Complete command/API reference with outputs
//   · Junior mistakes + fix table
//   · Production real scenario
// ─────────────────────────────────────────────────────────────────────────────

const deep3Blocks: Record<string, string[]> = {
  // ── Lesson 1: Environments ────────────────────────────────────────────────
  'py-env': [
    `## Terminology

| Term | Pronunciation | Meaning |
|---|---|---|
| Virtual environment | VIR-choo-ul | Isolated Python install for one project |
| venv | V-ENV | Python's built-in virtual environment tool |
| uv | U-V | Ultra-fast Rust-based Python package manager |
| pyenv | PY-env | Manage multiple Python versions on one machine |
| conda | KON-duh | Package manager popular in data science |
| Activation | ak-tih-VAY-shun | Making a virtualenv's Python the active one |
| \`PYTHONPATH\` | — | Env var that adds dirs to Python's import search path |
| Site packages | — | Where pip installs packages inside a venv |`,

    `## Full reference: all environment commands

\`\`\`bash
# ── venv (built-in, no extra install) ────────────────────────
python -m venv .venv                        # create
source .venv/bin/activate                   # activate (Linux/Mac)
.venv\\Scripts\\Activate.ps1                 # activate (Windows PS)
deactivate                                  # deactivate
which python                                # confirm: shows venv path
python -V                                   # Python 3.12.x

# ── uv (recommended — 10-100× faster than pip) ────────────────
pip install uv                              # install uv itself
uv venv                                     # create .venv
uv sync                                     # install from uv.lock (exact versions)
uv add fastapi                              # add + update pyproject.toml + lock
uv add "fastapi>=0.100"                     # with constraint
uv add --dev pytest ruff mypy               # dev-only dependency
uv remove fastapi                           # remove package
uv run python script.py                     # run in the venv without activating
uv run pytest                               # run tests in venv
uv lock                                     # regenerate lockfile without installing
uv pip list                                 # show installed packages

# ── pyenv (manage Python versions) ───────────────────────────
pyenv install 3.12.0                        # install a Python version
pyenv global 3.12.0                         # set default system version
pyenv local 3.11.0                          # set per-directory (creates .python-version)
pyenv versions                              # list installed versions
pyenv which python                          # which python is active

# ── pip (fallback when not using uv) ──────────────────────────
pip install fastapi                         # install
pip install -r requirements.txt             # install from file
pip install -e .                            # install current package in editable mode
pip freeze > requirements.txt              # capture current state
pip list                                    # show installed
pip show fastapi                            # show version and details
pip uninstall fastapi                       # remove
\`\`\``,

    `## Junior mistakes + fix

| Mistake | What happens | Fix |
|---|---|---|
| Install packages globally (no venv) | Version conflicts across projects | Always create and activate a venv first |
| Commit \`.venv/\` to git | Thousands of binary files in repo | Add \`.venv/\` to \`.gitignore\` |
| \`pip freeze\` includes dev tools | requirements.txt has test/lint tools | Use \`pyproject.toml\` with separate dev dependencies |
| Different Python version on dev vs prod | Works locally, fails in CI/cloud | Pin Python version in \`.python-version\` or Dockerfile |
| No lockfile | \`pip install\` installs different versions over time | Use \`uv\` — generates \`uv.lock\` automatically |`,
  ],

  // ── Lesson 2: Packaging ────────────────────────────────────────────────────
  'py-packaging': [
    `## Terminology

| Term | Pronunciation | Meaning |
|---|---|---|
| \`pyproject.toml\` | — | Modern Python project config file (PEP 517/518) |
| Lockfile | — | Exact pinned versions of all dependencies |
| \`uv.lock\` / \`poetry.lock\` | — | The lockfile — always commit this |
| Dependency group | — | Separate deps for dev, test, docs |
| Editable install | — | \`pip install -e .\` — code changes reflected immediately |
| Distribution | — | \`.whl\` or \`.tar.gz\` file for sharing a package |
| PyPI | PY-pee-eye | Python Package Index — the main package registry |
| Semantic versioning | se-MAN-tik | MAJOR.MINOR.PATCH: 1.2.3 |`,

    `## Full reference: pyproject.toml structure

\`\`\`toml
# pyproject.toml — the single config file for a modern Python project

[project]
name        = "my-api"
version     = "0.1.0"
description = "FastAPI backend"
requires-python = ">=3.12"

# Runtime dependencies (always needed)
dependencies = [
    "fastapi>=0.111",
    "uvicorn[standard]>=0.29",
    "pydantic[email]>=2.7",
    "sqlalchemy>=2.0",
    "asyncpg>=0.29",
    "redis>=5.0",
    "python-jose[cryptography]>=3.3",
    "passlib[bcrypt]>=1.7",
    "python-dotenv>=1.0",
]

[project.optional-dependencies]
# Install with: uv add --dev pytest ruff mypy
dev = [
    "pytest>=8.0",
    "pytest-asyncio>=0.23",
    "httpx>=0.27",
    "pytest-cov>=5.0",
    "ruff>=0.4",
    "mypy>=1.10",
]

[build-system]
requires      = ["hatchling"]
build-backend = "hatchling.build"

# ── Tool configuration in the same file ──────────────────────
[tool.ruff]
line-length = 100
target-version = "py312"
[tool.ruff.lint]
select = ["E", "F", "I", "N", "W", "UP"]

[tool.mypy]
python_version = "3.12"
strict = true
ignore_missing_imports = true

[tool.pytest.ini_options]
asyncio_mode     = "auto"
testpaths        = ["tests"]
addopts          = "-v --cov=app --cov-report=term-missing"

[tool.coverage.run]
omit = ["tests/*", "alembic/*"]
\`\`\``,

    `## Real scenario: adding a dependency the right way

\`\`\`bash
# ✅ Correct workflow with uv:
uv add httpx                    # adds to pyproject.toml, updates uv.lock
git add pyproject.toml uv.lock  # commit BOTH files
git commit -m "add httpx for async HTTP client"
# Team members run: uv sync      → exact same version installed everywhere

# ❌ Wrong workflow:
pip install httpx               # not tracked in pyproject.toml
# Team member's machine → missing httpx → ImportError
\`\`\``,

    `## Junior mistakes + fix

| Mistake | What happens | Fix |
|---|---|---|
| \`pip install\` without adding to pyproject.toml | Team gets different packages | Always use \`uv add\` |
| Don't commit uv.lock | Different versions across environments | Always commit the lockfile |
| Use very broad version constraints \`>=1.0\` | Future major version can break | Use \`>=1.5,<2.0\` or let uv lock manage it |
| Mix runtime and dev deps in one group | Dev tools shipped to production | Separate into \`[project.optional-dependencies] dev\` |
| No \`requires-python\` | Installs on wrong Python version silently | Always set \`requires-python = ">=3.12"\` |`,
  ],

  // ── Lesson 3: Type Hints ─────────────────────────────────────────────────
  'py-typing': [
    `## Terminology

| Term | Pronunciation | Meaning |
|---|---|---|
| Type hint | — | Annotation for what type a variable/parameter/return should be |
| Mypy | MY-pee | The standard Python type checker |
| \`Optional[X]\` | — | Legacy: either X or None — use \`X | None\` in 3.10+ |
| \`Union[X, Y]\` | — | Legacy: either X or Y — use \`X | Y\` in 3.10+ |
| \`TypeVar\` | — | Placeholder for a generic type |
| \`Protocol\` | — | Structural interface — duck-typing with type safety |
| \`TypedDict\` | — | Dict with known string keys and typed values |
| \`Annotated\` | — | Attach extra metadata to a type: \`Annotated[int, Field(gt=0)]\` |
| Structural subtyping | struk-CHUR-ul | Compatibility based on shape (methods), not inheritance |`,

    `## Full reference: type hints with outputs

\`\`\`python
# ── Basic types ───────────────────────────────────────────────
def greet(name: str, times: int = 1) -> str:
    return (name + " ") * times

greet("Hello", 2)   # → "Hello Hello "
# mypy: no issues

# ── Union / Optional (Python 3.10+ pipe syntax) ───────────────
def parse_int(s: str | None) -> int | None:
    if s is None: return None
    try: return int(s)
    except ValueError: return None

parse_int("42")    # → 42
parse_int(None)    # → None
parse_int("bad")   # → None

# ── Collections ───────────────────────────────────────────────
def process(items: list[int]) -> dict[str, int]:
    return {"sum": sum(items), "count": len(items)}

process([1, 2, 3])   # → {"sum": 6, "count": 3}

# ── TypedDict ────────────────────────────────────────────────
from typing import TypedDict

class CourseDict(TypedDict):
    id:    int
    title: str
    price: float

def format_course(c: CourseDict) -> str:
    return f"{c['title']} (\${c['price']})"

# ── Callable ─────────────────────────────────────────────────
from collections.abc import Callable

def apply(f: Callable[[str], str], text: str) -> str:
    return f(text)

apply(str.upper, "hello")   # → "HELLO"

# ── Protocol (duck typing + type safety) ─────────────────────
from typing import Protocol

class Printable(Protocol):
    def __str__(self) -> str: ...

def display(obj: Printable) -> None:
    print(str(obj))   # any object with __str__ works

# ── Overload (different signatures same function) ────────────
from typing import overload

@overload
def process_input(x: int) -> int: ...
@overload
def process_input(x: str) -> str: ...
def process_input(x):
    if isinstance(x, int): return x * 2
    return x.upper()

process_input(5)      # → 10   (mypy knows return is int)
process_input("hi")   # → "HI" (mypy knows return is str)
\`\`\``,

    `## Running mypy

\`\`\`bash
# Install
uv add --dev mypy

# Run
mypy app/

# Example output:
# app/routes/courses.py:45: error: Argument 1 to "create_course"
#   has incompatible type "str | None"; expected "str"
# Found 1 error in 1 file (checked 12 source files)

# Useful options
mypy --strict app/                  # strict mode (recommended for new projects)
mypy --ignore-missing-imports app/  # skip untyped third-party packages
mypy --show-error-codes app/        # show error codes for suppression
mypy --no-error-summary app/        # less noise in CI output

# Suppress a single error
x = some_legacy_func()  # type: ignore[assignment]
\`\`\``,

    `## Junior mistakes + fix

| Mistake | What happens | Fix |
|---|---|---|
| \`from typing import List, Dict\` (capital) | Deprecated; removed in future Python | Use \`list[int]\`, \`dict[str, int]\` directly (Python 3.9+) |
| No type hints at all | mypy can't help you; bugs at runtime | Add hints at least to function signatures |
| \`Any\` everywhere | Defeats purpose of type hints | Only \`Any\` at boundaries with untyped code |
| Annotate but never run mypy | False sense of safety | Run \`mypy app/\` in CI |
| \`Optional[X]\` not checked for None | mypy warns; runtime AttributeError | Always guard: \`if value is not None:\` |`,
  ],

  // ── Lesson 4: Code Quality ───────────────────────────────────────────────
  'py-quality': [
    `## Terminology

| Term | Pronunciation | Meaning |
|---|---|---|
| Linter | LIN-ter | Tool that finds code style and logic problems |
| Formatter | FOR-mat-er | Tool that automatically rewrites code to a style standard |
| Ruff | ruf | Ultra-fast Python linter+formatter (replaces flake8+black+isort) |
| Black | blak | The opinionated Python formatter (now superseded by ruff format) |
| isort | EYE-sort | Import sorter (now built into ruff) |
| Pre-commit | pree-KOM-it | Git hooks that run checks before every commit |
| CI | C-I | Continuous Integration — automated checks on every push |
| PEP 8 | PEP-8 | Python's official style guide |`,

    `## Full reference: ruff configuration and commands

\`\`\`bash
# Install
uv add --dev ruff

# ── Lint ──────────────────────────────────────────────────────
ruff check .                      # check all files
ruff check app/                   # check one directory
ruff check app/main.py            # check one file
ruff check . --fix                # auto-fix safe issues
ruff check . --fix --unsafe-fixes # fix more (review changes first)
ruff check . --select E501        # check only one rule

# ── Format ────────────────────────────────────────────────────
ruff format .                     # format all files
ruff format . --check             # check only (exit 1 if changes needed) — for CI
ruff format --diff app/main.py    # show what would change

# ── Config in pyproject.toml ──────────────────────────────────
# [tool.ruff]
# line-length = 100
# target-version = "py312"
# [tool.ruff.lint]
# select = ["E","F","I","N","W","UP","B","SIM"]
# ignore = ["E501"]  # ignore long lines

# ── Common rule codes ─────────────────────────────────────────
# E: pycodestyle errors     F: pyflakes      I: isort
# N: naming conventions     W: warnings      UP: pyupgrade (modernise)
# B: bugbear (logic bugs)   SIM: simplify    ANN: annotations
\`\`\``,

    `## Full reference: pre-commit hooks

\`\`\`yaml
# .pre-commit-config.yaml — runs before every git commit
repos:
  - repo: https://github.com/astral-sh/ruff-pre-commit
    rev: v0.4.0
    hooks:
      - id: ruff           # lint
        args: [--fix]
      - id: ruff-format    # format

  - repo: https://github.com/pre-commit/mirrors-mypy
    rev: v1.10.0
    hooks:
      - id: mypy
        additional_dependencies: ["pydantic>=2.0"]

  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v4.6.0
    hooks:
      - id: trailing-whitespace
      - id: end-of-file-fixer
      - id: check-merge-conflict
      - id: check-yaml
      - id: debug-statements    # catch leftover print()/breakpoint()
\`\`\`

\`\`\`bash
uv add --dev pre-commit
pre-commit install          # install hooks into .git/hooks/
pre-commit run --all-files  # run manually on all files
\`\`\``,

    `## Real scenario: catching a bug before it ships

\`\`\`python
# ❌ This code passes tests but ruff B006 catches it:
def add_item(name: str, items: list = []):   # mutable default!
    items.append(name)
    return items

# ruff output:
# B006 Do not use mutable data structures for argument defaults

# ✅ Fixed:
def add_item(name: str, items: list | None = None):
    if items is None:
        items = []
    items.append(name)
    return items
\`\`\`

This is the kind of bug that's silent in production — first call returns \`["item"]\`, second call returns \`["item", "item"]\`. Ruff catches it before commit.`,

    `## Junior mistakes + fix

| Mistake | What happens | Fix |
|---|---|---|
| Run ruff only locally, not in CI | Different code quality on each machine | Add \`ruff check . && ruff format . --check\` to CI |
| Ignore all ruff warnings | Miss real bugs | Only ignore with \`# noqa: CODE\` for valid reasons |
| Never run mypy | Type errors only found at runtime | Add \`mypy app/\` to CI and pre-commit |
| Fix formatting manually | Time wasted; inconsistent | Let \`ruff format\` do it automatically |
| Skip pre-commit on urgent commits \`--no-verify\` | Bad code sneaks in | Only \`--no-verify\` in true emergencies; always fix immediately after |`,
  ],

  // ── Lesson 5: Full-Stack Scripts ──────────────────────────────────────────
  'py-fullstack-scripts': [
    `## Terminology

| Term | Pronunciation | Meaning |
|---|---|---|
| CLI | C-L-I | Command Line Interface |
| \`argparse\` | ARG-parse | Python stdlib module for parsing CLI arguments |
| \`click\` | klik | Popular third-party CLI framework |
| Script | skrip-t | Python file intended to be run directly |
| Shebang | she-BANG | \`#!/usr/bin/env python3\` — tells the OS which interpreter |
| Exit code | — | Integer a program returns to the OS (0=success, non-zero=error) |
| \`__main__\` | dunder-main | Guard that runs code only when file is executed directly |
| \`dotenv\` | dot-ENV | Load environment variables from a \`.env\` file |`,

    `## Full reference: argparse for CLI tools

\`\`\`python
import argparse
import sys

def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        prog="migrate-data",
        description="Migrate course data from CSV to the database",
    )

    # Positional argument (required)
    parser.add_argument("input_file", help="Path to input CSV")

    # Optional argument with default
    parser.add_argument("-o", "--output", default="output.json",
                        help="Output JSON file (default: output.json)")

    # Flag (boolean)
    parser.add_argument("-v", "--verbose", action="store_true",
                        help="Enable verbose logging")

    # Choices
    parser.add_argument("--env", choices=["dev", "staging", "prod"],
                        default="dev", help="Target environment")

    # Multiple values
    parser.add_argument("--tags", nargs="+", help="Tags to apply")

    return parser.parse_args()

def main() -> int:
    args = parse_args()
    if args.verbose:
        print(f"Processing {args.input_file} → {args.output}")
    # ... do work ...
    return 0   # exit code 0 = success

if __name__ == "__main__":
    sys.exit(main())

# CLI usage:
# python migrate.py data.csv --env prod --verbose
# python migrate.py data.csv --tags python backend --output out.json
\`\`\``,

    `## Full reference: environment variables with python-dotenv

\`\`\`python
# .env file (never commit this):
DATABASE_URL=postgresql://user:pass@localhost/mydb
SECRET_KEY=super-secret-123
DEBUG=true
LOG_LEVEL=INFO

# app/config.py
from dotenv import load_dotenv
import os

load_dotenv()   # loads .env into os.environ (skips if already set)

DATABASE_URL = os.environ["DATABASE_URL"]           # raises if missing
SECRET_KEY   = os.environ["SECRET_KEY"]             # raises if missing
DEBUG        = os.environ.get("DEBUG", "false").lower() == "true"
LOG_LEVEL    = os.environ.get("LOG_LEVEL", "INFO")

# Production pattern with pydantic-settings:
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    database_url: str
    secret_key:   str
    debug:        bool = False
    log_level:    str  = "INFO"

    model_config = {"env_file": ".env"}

settings = Settings()   # raises ValidationError immediately if required vars missing
\`\`\``,

    `## Junior mistakes + fix

| Mistake | What happens | Fix |
|---|---|---|
| Hardcode config values in code | Different config for dev/prod requires code changes | Use \`.env\` + \`os.environ\` or pydantic-settings |
| Commit \`.env\` to git | Credentials exposed publicly | Add \`.env\` to \`.gitignore\`; use \`.env.example\` as template |
| \`os.environ["KEY"]\` on optional var | KeyError if var not set | Use \`os.environ.get("KEY", "default")\` for optional vars |
| No \`sys.exit()\` on error | Script returns 0 even on failure | Return non-zero exit code on error |
| Script with no \`if __name__ == "__main__":\` | Runs on import — breaks any module that imports it | Always use the guard |`,
  ],

  // ── Lesson 6: Concurrency ────────────────────────────────────────────────
  'py-concurrency': [
    `## Terminology

| Term | Pronunciation | Meaning |
|---|---|---|
| GIL | G-I-L | Global Interpreter Lock — only one Python thread runs Python bytecode at once |
| Concurrency | kon-KUR-un-see | Handling multiple tasks by interleaving them |
| Parallelism | PAIR-uh-lel-izm | True simultaneous execution on multiple CPU cores |
| Thread | thred | Lightweight unit of execution within one process |
| Process | PROH-ses | Independent OS-level execution unit with its own memory |
| Event loop | ih-VENT | asyncio's scheduler that runs coroutines |
| Coroutine | KOR-oh-teen | Function defined with \`async def\` that can pause and resume |
| Awaitable | uh-WAYT-uh-bul | Object that can be used with \`await\` |
| \`asyncio\` | a-SING-ee-oh | Python's async I/O framework |
| I/O bound | — | Task that spends most time waiting for I/O (network, disk) |
| CPU bound | — | Task that spends most time computing |`,

    `## Full reference: choosing the right concurrency tool

\`\`\`
Task type               Tool                    Why
─────────────────────────────────────────────────────────────────
DB queries, HTTP calls  async/await (asyncio)   I/O bound; event loop handles thousands
                        OR threading            threading also works for I/O bound
File I/O                async/await             non-blocking file reads
CPU-heavy computation   multiprocessing         bypasses GIL; true parallelism
Mix of I/O + CPU        asyncio + ProcessPool   I/O in async, CPU in process pool
Background queue jobs   Celery                  durable, retryable, distributed
\`\`\``,

    `## Full reference: asyncio patterns

\`\`\`python
import asyncio
import httpx

# ── Basic async function ──────────────────────────────────────
async def fetch_course(url: str) -> dict:
    async with httpx.AsyncClient(timeout=10.0) as client:
        resp = await client.get(url)
        resp.raise_for_status()
        return resp.json()

# ── Run from synchronous code ────────────────────────────────
result = asyncio.run(fetch_course("https://api.example.com/courses/1"))

# ── Concurrent tasks: gather (all at once) ────────────────────
async def fetch_all(urls: list[str]) -> list[dict]:
    async with httpx.AsyncClient(timeout=10.0) as client:
        tasks = [client.get(url) for url in urls]
        responses = await asyncio.gather(*tasks)   # concurrent, not sequential
        return [r.json() for r in responses]

# Sequential: 5 × 200ms = 1000ms total
# Concurrent: max(200ms) = ~200ms total

# ── With error handling ────────────────────────────────────────
results = await asyncio.gather(*tasks, return_exceptions=True)
for r in results:
    if isinstance(r, Exception):
        print(f"Failed: {r}")
    else:
        process(r)

# ── asyncio.sleep (non-blocking wait) ─────────────────────────
async def poll_status(job_id: str):
    for _ in range(30):
        status = await get_job_status(job_id)
        if status == "complete": return status
        await asyncio.sleep(2)    # pause 2s without blocking event loop
    raise TimeoutError("Job timed out")

# ── Queue for producer/consumer ──────────────────────────────
async def producer(queue: asyncio.Queue):
    for i in range(5):
        await queue.put(i)
        await asyncio.sleep(0.1)

async def consumer(queue: asyncio.Queue):
    while True:
        item = await queue.get()
        print(f"Processing {item}")
        queue.task_done()

async def main():
    q = asyncio.Queue()
    await asyncio.gather(producer(q), consumer(q))
\`\`\``,

    `## Full reference: threading for I/O bound work

\`\`\`python
import threading
import concurrent.futures

# ── Thread for background work ────────────────────────────────
def send_email(recipient: str):
    # runs in background thread — doesn't block main thread
    import time; time.sleep(2)
    print(f"Email sent to {recipient}")

thread = threading.Thread(target=send_email, args=("user@example.com",))
thread.start()
# main thread continues here immediately
thread.join()   # wait for thread to finish (optional)

# ── ThreadPoolExecutor — manage multiple threads ──────────────
from concurrent.futures import ThreadPoolExecutor, as_completed

def fetch_url(url: str) -> str:
    import urllib.request
    with urllib.request.urlopen(url) as resp:
        return resp.read().decode()

urls = ["https://example.com/1", "https://example.com/2", "https://example.com/3"]
with ThreadPoolExecutor(max_workers=5) as pool:
    futures = {pool.submit(fetch_url, url): url for url in urls}
    for future in as_completed(futures):
        url = futures[future]
        try:
            result = future.result()
            print(f"{url}: {len(result)} chars")
        except Exception as e:
            print(f"{url}: ERROR {e}")
\`\`\``,

    `## Full reference: multiprocessing for CPU-bound work

\`\`\`python
import multiprocessing
from concurrent.futures import ProcessPoolExecutor

def compute_intensive(n: int) -> int:
    """CPU-heavy task — runs in separate process to bypass GIL."""
    return sum(i * i for i in range(n))

# ── ProcessPoolExecutor (recommended) ────────────────────────
with ProcessPoolExecutor(max_workers=4) as pool:  # 4 CPU cores
    results = list(pool.map(compute_intensive, [100_000, 200_000, 300_000]))
    print(results)   # → [333328333350000, ...]

# Sequential: 3 tasks × 2s each = 6s
# Parallel on 4 cores: ~2s total

# ── asyncio + ProcessPool for I/O + CPU ───────────────────────
async def run_cpu_task(n: int) -> int:
    loop = asyncio.get_event_loop()
    with ProcessPoolExecutor() as pool:
        return await loop.run_in_executor(pool, compute_intensive, n)
\`\`\``,

    `## Junior mistakes + fix

| Mistake | What happens | Fix |
|---|---|---|
| \`time.sleep()\` inside \`async def\` | Blocks entire event loop | Use \`await asyncio.sleep()\` |
| \`requests.get()\` inside \`async def\` | Sync call blocks event loop | Use \`httpx.AsyncClient\` with \`await\` |
| Threads for CPU-heavy work | GIL prevents real parallelism | Use \`multiprocessing\` or \`ProcessPoolExecutor\` |
| Shared mutable state between threads without lock | Race condition — data corruption | Use \`threading.Lock()\` or \`asyncio.Lock()\` |
| Create new \`AsyncClient\` per request | Connection pool thrashing, slow | Create client once in lifespan, reuse |`,
  ],
}

function toBlocks(markdowns: string[]): ContentBlock[] {
  return markdowns.map(markdown => ({ type: 'text' as const, markdown }))
}

export function applyPhase3DeepEnhancements(lessons: Lesson[]): Lesson[] {
  return lessons.map(lesson => {
    const markdowns = deep3Blocks[lesson.id]
    if (!markdowns) return lesson
    return {
      ...lesson,
      content: [...toBlocks(markdowns), ...lesson.content],
    }
  })
}
