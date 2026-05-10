import type { Lesson } from '@/types/lesson'

export const pythonToolingLessons: Lesson[] = [
  // ─── Lesson 1: Environments & Version Management ─────────────────────────
  {
    id: 'py-env',
    moduleId: 'python-backend',
    phaseId: 'py-tooling',
    phaseNumber: 3,
    order: 1,
    title: 'Environments & Version Management',
    description: 'Set up isolated Python environments with venv, pyenv, and virtualenv so your projects never conflict — the foundation of any professional Python workflow.',
    duration: '35 min',
    difficulty: 'beginner',
    objectives: [
      'Understand why isolated environments are non-negotiable',
      'Install and switch Python versions with pyenv',
      'Create and activate virtual environments with venv',
      'Know when to use venv vs virtualenv vs conda',
      'Set up a project from scratch following current best practices',
    ],
    content: [
      {
        type: 'text',
        markdown: `## The Problem: Global Package Hell

Without environments, every project shares one Python installation. Install \`requests==2.28\` for project A, then \`requests==2.31\` for project B — one of them breaks. This is why **every Python project must have its own isolated environment.**`,
      },
      {
        type: 'code',
        language: 'bash',
        filename: 'pyenv_setup.sh',
        code: `# ── pyenv — manage multiple Python versions ──────────
# Install pyenv (macOS/Linux)
curl https://pyenv.run | bash

# List available Python versions
pyenv install --list | grep "3\."

# Install a specific version
pyenv install 3.12.3

# Set global default version
pyenv global 3.12.3

# Set version just for this directory (creates .python-version file)
pyenv local 3.11.9

# Check which Python is active
pyenv version        # shows current + source
python --version

# ── venv — built-in virtual environments (Python 3.3+) ──
# Create environment in .venv directory (standard name)
python -m venv .venv

# Activate (Linux/macOS)
source .venv/bin/activate

# Activate (Windows PowerShell)
.venv\\Scripts\\Activate.ps1

# Your prompt now shows (.venv) — you're isolated
python -m pip install requests fastapi

# Deactivate
deactivate

# Never commit .venv — add to .gitignore
echo ".venv/" >> .gitignore`,
      },
      {
        type: 'callout',
        tone: 'production',
        title: 'Modern Recommendation: uv',
        content: '`uv` (from Astral, the makers of ruff) is a Rust-based Python package manager that replaces pip, venv, and pyenv in one tool. It\'s 10-100x faster than pip and is rapidly becoming the industry standard. For new projects in 2025+, use uv.',
      },
      {
        type: 'code',
        language: 'bash',
        filename: 'uv_workflow.sh',
        code: `# ── uv — the modern Python package manager ───────────
# Install uv
curl -LsSf https://astral.sh/uv/install.sh | sh

# Create a new project (auto-creates venv + pyproject.toml)
uv init my-project
cd my-project

# Add dependencies (resolves, downloads, installs — all at once)
uv add fastapi
uv add --dev pytest ruff mypy   # dev-only dependencies

# Run commands in the project environment (no need to activate)
uv run python main.py
uv run pytest
uv run ruff check .

# Sync environment with pyproject.toml (like npm install)
uv sync

# Generate a lockfile
uv lock

# Install a specific Python version
uv python install 3.12

# Run a one-off tool without installing
uvx ruff check .    # like npx`,
      },
      {
        type: 'code',
        language: 'bash',
        filename: 'conda_when.sh',
        code: `# ── conda — use for data science / scientific computing ──
# conda handles non-Python dependencies (C libs, CUDA, etc.)
# For pure backend/web work, stick with venv or uv

# Create a conda environment
conda create -n myproject python=3.12
conda activate myproject

# Install packages (conda-forge has more scientific packages)
conda install -c conda-forge numpy scipy pandas

# When to choose conda:
# ✓ Machine learning / data science projects
# ✓ Need specific CUDA / GPU versions
# ✓ Complex C/Fortran library dependencies (numpy, scipy)
# ✗ Web backends, APIs, CLIs — use uv/venv instead`,
      },
      {
        type: 'exercise',
        title: 'Project Bootstrap Script',
        description: 'Write a shell script `bootstrap.sh` that: (1) verifies Python 3.11+ is available, (2) creates a .venv environment, (3) installs from requirements.txt if it exists, (4) prints the Python version and pip version, (5) prints instructions to activate.',
        language: 'bash',
        starterCode: `#!/usr/bin/env bash
set -e   # exit on first error

# Check Python version
# Create .venv
# Install requirements if they exist
# Print summary`,
        solution: `#!/usr/bin/env bash
set -e

# Check Python version (need 3.11+)
PYTHON=$(python3 --version 2>&1 | awk '{print $2}')
MAJOR=$(echo $PYTHON | cut -d. -f1)
MINOR=$(echo $PYTHON | cut -d. -f2)

if [ "$MAJOR" -lt 3 ] || ([ "$MAJOR" -eq 3 ] && [ "$MINOR" -lt 11 ]); then
    echo "Error: Python 3.11+ required, found $PYTHON"
    exit 1
fi

echo "✓ Python $PYTHON detected"

# Create virtual environment
if [ ! -d ".venv" ]; then
    python3 -m venv .venv
    echo "✓ Created .venv"
else
    echo "✓ .venv already exists"
fi

# Install requirements if they exist
if [ -f "requirements.txt" ]; then
    .venv/bin/pip install -r requirements.txt --quiet
    echo "✓ Installed requirements.txt"
fi

echo ""
echo "Activate with: source .venv/bin/activate"`,
        hints: ['Use python3 --version and parse the output with awk/cut', 'Check for .venv directory before creating', 'Reference pip as .venv/bin/pip to use the venv pip without activating'],
      },
    ],
  },

  // ─── Lesson 2: Package Management & pyproject.toml ───────────────────────
  {
    id: 'py-packaging',
    moduleId: 'python-backend',
    phaseId: 'py-tooling',
    phaseNumber: 3,
    order: 2,
    title: 'Package Management & pyproject.toml',
    description: 'Master pip, Poetry, and uv — understand pyproject.toml, lockfiles, dependency groups, and how to publish your own package to PyPI.',
    duration: '40 min',
    difficulty: 'intermediate',
    objectives: [
      'Use pip confidently: install, freeze, requirements.txt, extras',
      'Understand pyproject.toml as the single source of project metadata',
      'Use Poetry for dependency management with lockfiles',
      'Separate dev, test, and production dependencies correctly',
      'Know how PyPI packaging works at a high level',
    ],
    content: [
      {
        type: 'code',
        language: 'bash',
        filename: 'pip_essentials.sh',
        code: `# ── pip — the standard Python package installer ──────
pip install requests                   # latest version
pip install "requests==2.31.0"        # exact version
pip install "requests>=2.28,<3.0"     # version range
pip install "fastapi[all]"            # with extras (uvicorn, etc.)

# Install from requirements file
pip install -r requirements.txt
pip install -r requirements-dev.txt

# Generate requirements.txt (snapshot of current env)
pip freeze > requirements.txt

# Upgrade a package
pip install --upgrade requests

# List installed packages
pip list
pip show requests     # detailed info about one package

# Uninstall
pip uninstall requests

# ── requirements.txt: two files pattern ─────────────
# requirements.txt (production only)
# requests>=2.31.0
# fastapi>=0.104.0
# sqlalchemy>=2.0.0

# requirements-dev.txt (extends prod)
# -r requirements.txt
# pytest>=7.4.0
# ruff>=0.1.0
# mypy>=1.7.0`,
      },
      {
        type: 'code',
        language: 'toml',
        filename: 'pyproject.toml',
        code: `# pyproject.toml — the modern project standard (PEP 517/518/621)
# One file for ALL project metadata and tool configuration

[project]
name = "seniorpath-api"
version = "0.1.0"
description = "SeniorPath learning platform API"
requires-python = ">=3.11"
license = {text = "MIT"}
authors = [{name = "Your Name", email = "you@example.com"}]

# Runtime dependencies
dependencies = [
    "fastapi>=0.104.0",
    "uvicorn[standard]>=0.24.0",
    "sqlalchemy>=2.0.0",
    "pydantic>=2.4.0",
    "httpx>=0.25.0",
]

[project.optional-dependencies]
# pip install ".[dev]" installs both main + dev deps
dev = [
    "pytest>=7.4.0",
    "pytest-asyncio>=0.21.0",
    "ruff>=0.1.0",
    "mypy>=1.7.0",
    "httpx>=0.25.0",
]

# ── Tool configuration (replaces setup.cfg, .flake8, etc.) ──
[tool.ruff]
line-length = 88
target-version = "py311"

[tool.ruff.lint]
select = ["E", "F", "I", "UP", "B"]   # pycodestyle, pyflakes, isort, pyupgrade, bugbear

[tool.mypy]
python_version = "3.11"
strict = true
ignore_missing_imports = true

[tool.pytest.ini_options]
testpaths = ["tests"]
asyncio_mode = "auto"`,
      },
      {
        type: 'code',
        language: 'bash',
        filename: 'poetry_workflow.sh',
        code: `# ── Poetry — dependency management with lockfiles ─────
pip install poetry   # or use pipx: pipx install poetry

# New project
poetry new my-project
cd my-project

# Add dependencies (updates pyproject.toml + poetry.lock)
poetry add fastapi sqlalchemy
poetry add --group dev pytest ruff mypy

# Install all dependencies (respects poetry.lock)
poetry install

# Install without dev dependencies (production)
poetry install --without dev

# Update packages
poetry update             # all packages
poetry update requests    # one package

# Run commands in the poetry virtual environment
poetry run pytest
poetry run python main.py

# Enter the shell
poetry shell

# poetry.lock — COMMIT this file!
# It pins exact versions of every dependency (and their dependencies)
# This ensures "works on my machine" = "works in production"`,
      },
      {
        type: 'callout',
        tone: 'production',
        title: 'The Lockfile Rule',
        content: 'Always commit your lockfile (`poetry.lock`, `uv.lock`, or `requirements.txt` with pinned versions). Without it, `pip install` installs different versions at different times. The lockfile is what makes "it works on my machine" true for everyone on the team.',
      },
      {
        type: 'exercise',
        title: 'Dependency Audit Script',
        description: 'Write a Python script `audit_deps.py` that reads a `requirements.txt` file and: (1) checks if each package is pinned to an exact version, (2) identifies unpinned packages, (3) prints a report. Bonus: check the PyPI JSON API to see if there\'s a newer version available.',
        language: 'python',
        starterCode: `import sys
import urllib.request
import json

def audit_requirements(filepath: str) -> None:
    """Read requirements.txt and report on pinning status."""
    pass

if __name__ == "__main__":
    audit_requirements(sys.argv[1] if len(sys.argv) > 1 else "requirements.txt")`,
        solution: `import sys
import urllib.request
import json
import re

def check_latest_version(package: str) -> str | None:
    try:
        url = f"https://pypi.org/pypi/{package}/json"
        with urllib.request.urlopen(url, timeout=3) as r:
            data = json.loads(r.read())
            return data["info"]["version"]
    except Exception:
        return None

def audit_requirements(filepath: str) -> None:
    try:
        with open(filepath) as f:
            lines = [l.strip() for l in f if l.strip() and not l.startswith("#")]
    except FileNotFoundError:
        print(f"File not found: {filepath}")
        return

    pinned, unpinned = [], []
    for line in lines:
        if line.startswith("-"):
            continue
        pkg = re.split(r"[>=<!]", line)[0].strip()
        if "==" in line:
            pinned.append((pkg, line))
        else:
            unpinned.append((pkg, line))

    print(f"\\n{'='*40}")
    print(f"Dependency Audit: {filepath}")
    print(f"{'='*40}")
    print(f"✓ Pinned: {len(pinned)}")
    print(f"✗ Unpinned: {len(unpinned)}")

    if unpinned:
        print("\\n⚠ Unpinned packages (not reproducible):")
        for pkg, spec in unpinned:
            latest = check_latest_version(pkg)
            print(f"  {spec}  →  latest: {latest or 'unknown'}")`,
        hints: ['re.split on [>=<!] extracts the package name', 'Use urllib.request (stdlib) to call the PyPI JSON API', 'The PyPI JSON API is at https://pypi.org/pypi/{package}/json'],
      },
    ],
  },

  // ─── Lesson 3: Static Typing, mypy & Pydantic ───────────────────────────
  {
    id: 'py-typing',
    moduleId: 'python-backend',
    phaseId: 'py-tooling',
    phaseNumber: 3,
    order: 3,
    title: 'Static Typing: Type Hints, mypy & Pydantic',
    description: 'Add type safety to Python code without losing its flexibility. Use mypy to catch bugs before runtime, and Pydantic v2 for validated data models at API boundaries.',
    duration: '50 min',
    difficulty: 'intermediate',
    objectives: [
      'Write type annotations for functions, variables, and complex types',
      'Use Union, Optional, Literal, TypeVar, Protocol, and TypedDict',
      'Run mypy and interpret its error messages',
      'Define Pydantic v2 models with validators and computed fields',
      'Know when runtime validation (Pydantic) vs static checking (mypy) is appropriate',
    ],
    content: [
      {
        type: 'code',
        language: 'python',
        filename: 'type_hints.py',
        code: `from __future__ import annotations  # PEP 563 — allows forward references

from typing import (
    Optional, Union, Literal, Any,
    Callable, TypeVar, Generic,
    TypedDict, Protocol, overload,
    Final, ClassVar,
)
from collections.abc import Sequence, Mapping, Iterator

# ── Basic annotations ──────────────────────────────
def greet(name: str, times: int = 1) -> str:
    return f"Hello, {name}! " * times

# ── Container types ────────────────────────────────
names: list[str] = ["Alice", "Bob"]
scores: dict[str, int] = {"Alice": 95}
coords: tuple[float, float] = (1.5, 2.7)
tags: set[str] = {"python", "backend"}

# ── Optional and Union ─────────────────────────────
# Optional[X] == X | None
def find_user(user_id: int) -> Optional[str]:
    return "Alice" if user_id == 1 else None

# Union (Python 3.10+ use X | Y directly)
def process(value: int | str | None) -> str:
    if isinstance(value, int):
        return str(value)
    return value or ""

# ── Literal — restrict to specific values ──────────
Direction = Literal["north", "south", "east", "west"]
LogLevel  = Literal["DEBUG", "INFO", "WARNING", "ERROR"]

def move(direction: Direction, steps: int) -> None:
    ...

# ── TypedDict — dicts with known keys ─────────────
class UserRecord(TypedDict):
    id: int
    name: str
    email: str
    age: int | None   # optional field

def get_user() -> UserRecord:
    return {"id": 1, "name": "Alice", "email": "a@b.com", "age": None}

# ── Protocol — structural subtyping (duck typing) ──
class Drawable(Protocol):
    def draw(self) -> None: ...

class Circle:
    def draw(self) -> None:
        print("Drawing circle")

def render(shape: Drawable) -> None:  # any object with draw() works
    shape.draw()

render(Circle())   # works — Circle has draw()

# ── TypeVar — generic functions ────────────────────
T = TypeVar("T")

def first(items: Sequence[T]) -> T | None:
    return items[0] if items else None

result: str | None = first(["a", "b"])   # mypy knows it's str | None`,
      },
      {
        type: 'code',
        language: 'python',
        filename: 'pydantic_v2.py',
        code: `from pydantic import (
    BaseModel, Field, field_validator,
    model_validator, computed_field,
    EmailStr, HttpUrl,
)
from datetime import datetime
from typing import Annotated

# ── Pydantic v2 model — validation at runtime ──────
class UserCreate(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    email: EmailStr              # validates email format
    age: int = Field(ge=0, le=150)
    password: str = Field(min_length=8)

    @field_validator("name")
    @classmethod
    def strip_name(cls, v: str) -> str:
        return v.strip()

    @field_validator("password")
    @classmethod
    def validate_password(cls, v: str) -> str:
        if not any(c.isupper() for c in v):
            raise ValueError("Password must contain at least one uppercase letter")
        return v

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    created_at: datetime

    # computed_field — derived value, not stored
    @computed_field
    @property
    def display_name(self) -> str:
        return self.name.title()

    model_config = {"from_attributes": True}  # allow ORM models as input

# ── Cross-field validation ─────────────────────────
class DateRange(BaseModel):
    start: datetime
    end: datetime

    @model_validator(mode="after")
    def check_range(self) -> "DateRange":
        if self.end <= self.start:
            raise ValueError("end must be after start")
        return self

# ── Using models ───────────────────────────────────
try:
    user = UserCreate(
        name="  Alice  ",
        email="alice@example.com",
        age=30,
        password="Secret123",
    )
    print(user.name)      # "Alice" (stripped)
    print(user.model_dump())  # dict representation
    print(user.model_dump_json())  # JSON string
except Exception as e:
    print(e)

# Validation errors have full detail
from pydantic import ValidationError
try:
    bad = UserCreate(name="", email="not-an-email", age=-1, password="weak")
except ValidationError as e:
    print(e.error_count(), "errors")
    for err in e.errors():
        print(f"  {err['loc']}: {err['msg']}")`,
      },
      {
        type: 'callout',
        tone: 'tip',
        title: 'mypy quick start',
        content: 'Run `mypy src/ --strict` to catch type errors before tests. Add to your CI. Start with `--ignore-missing-imports` to onboard gradually. The most valuable mypy checks: `None`-safety (forgetting to handle `Optional`), wrong return types, and calling methods that don\'t exist.',
      },
      {
        type: 'exercise',
        title: 'Typed Config Loader',
        description: 'Create a `Settings` Pydantic model that reads from environment variables (use `model_config = ConfigDict(env_file=".env")`). Fields: `DATABASE_URL` (str), `API_KEY` (str, min 32 chars), `DEBUG` (bool, default False), `MAX_CONNECTIONS` (int, 1-100, default 10), `ALLOWED_HOSTS` (list[str], parsed from comma-separated string).',
        language: 'python',
        starterCode: `from pydantic import BaseModel, Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Any

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", case_sensitive=False)

    DATABASE_URL: str
    API_KEY: str
    DEBUG: bool = False
    MAX_CONNECTIONS: int
    ALLOWED_HOSTS: list[str]

    # Add validators here`,
        solution: `from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", case_sensitive=False)

    DATABASE_URL: str
    API_KEY: str = Field(min_length=32)
    DEBUG: bool = False
    MAX_CONNECTIONS: int = Field(default=10, ge=1, le=100)
    ALLOWED_HOSTS: list[str] = ["localhost"]

    @field_validator("ALLOWED_HOSTS", mode="before")
    @classmethod
    def parse_hosts(cls, v: str | list[str]) -> list[str]:
        if isinstance(v, str):
            return [h.strip() for h in v.split(",") if h.strip()]
        return v

# Usage — reads from environment or .env file
settings = Settings()`,
        hints: ['pydantic-settings is a separate package: pip install pydantic-settings', 'Use mode="before" to intercept the raw string before Pydantic processes it', 'list[str] fields come from env as comma-separated strings by default with pydantic-settings'],
      },
    ],
  },

  // ─── Lesson 4: Code Quality — ruff, black & Testing ─────────────────────
  {
    id: 'py-quality',
    moduleId: 'python-backend',
    phaseId: 'py-tooling',
    phaseNumber: 3,
    order: 4,
    title: 'Code Quality: ruff, black & pytest Basics',
    description: 'Set up a professional Python quality pipeline: ruff for linting and import sorting, black for formatting, and pytest for testing — configured once and running everywhere.',
    duration: '40 min',
    difficulty: 'intermediate',
    objectives: [
      'Configure ruff to enforce style and catch bugs automatically',
      'Use black for deterministic, zero-config code formatting',
      'Write and run pytest tests with fixtures and parametrize',
      'Set up pre-commit hooks so quality gates run before every commit',
      'Integrate everything into a Makefile or taskfile for team consistency',
    ],
    content: [
      {
        type: 'code',
        language: 'bash',
        filename: 'ruff_usage.sh',
        code: `# ── ruff — extremely fast Python linter (replaces flake8, isort, etc.) ──
pip install ruff   # or: uv add --dev ruff

# Check for issues
ruff check .

# Fix auto-fixable issues
ruff check . --fix

# Format code (also replaces black)
ruff format .

# Check format without changing files (for CI)
ruff format --check .

# Watch mode during development
ruff check . --watch`,
      },
      {
        type: 'code',
        language: 'toml',
        filename: 'pyproject.toml (ruff section)',
        code: `[tool.ruff]
line-length = 88
target-version = "py311"
exclude = [".venv", "migrations", "__pycache__"]

[tool.ruff.lint]
# Rule sets to enable
select = [
    "E",    # pycodestyle errors
    "W",    # pycodestyle warnings
    "F",    # pyflakes (undefined names, unused imports)
    "I",    # isort (import ordering)
    "UP",   # pyupgrade (use modern Python syntax)
    "B",    # flake8-bugbear (common bugs)
    "C4",   # flake8-comprehensions (simplify comprehensions)
    "SIM",  # flake8-simplify
    "N",    # pep8-naming
]
ignore = ["E501"]   # line length handled by formatter

[tool.ruff.lint.isort]
known-first-party = ["app", "src"]   # treat as first-party imports

[tool.ruff.format]
quote-style = "double"
indent-style = "space"`,
      },
      {
        type: 'code',
        language: 'python',
        filename: 'test_example.py',
        code: `# pytest — the standard Python testing framework
# File naming: test_*.py or *_test.py
# Function naming: test_*

import pytest

# ── Basic tests ────────────────────────────────────
def add(a: int, b: int) -> int:
    return a + b

def test_add_basic():
    assert add(1, 2) == 3

def test_add_negative():
    assert add(-1, -1) == -2

# ── Testing exceptions ─────────────────────────────
def divide(a: float, b: float) -> float:
    if b == 0:
        raise ValueError("Cannot divide by zero")
    return a / b

def test_divide_by_zero():
    with pytest.raises(ValueError, match="Cannot divide by zero"):
        divide(10, 0)

# ── Fixtures — reusable test setup ────────────────
@pytest.fixture
def sample_users() -> list[dict]:
    return [
        {"id": 1, "name": "Alice", "age": 30},
        {"id": 2, "name": "Bob",   "age": 25},
    ]

def test_user_count(sample_users):
    assert len(sample_users) == 2

def test_user_names(sample_users):
    names = [u["name"] for u in sample_users]
    assert "Alice" in names

# ── Parametrize — test multiple inputs at once ─────
@pytest.mark.parametrize("a,b,expected", [
    (1, 2, 3),
    (0, 0, 0),
    (-1, 1, 0),
    (100, -50, 50),
])
def test_add_parametrized(a, b, expected):
    assert add(a, b) == expected

# ── Marks — categorise tests ───────────────────────
@pytest.mark.slow
def test_heavy_computation():
    result = sum(range(1_000_000))
    assert result == 499_999_500_000

# Run: pytest -m "not slow"  to skip slow tests`,
      },
      {
        type: 'code',
        language: 'yaml',
        filename: '.pre-commit-config.yaml',
        code: `# Pre-commit hooks — run quality checks before every git commit
# Install: pip install pre-commit && pre-commit install

repos:
  - repo: https://github.com/astral-sh/ruff-pre-commit
    rev: v0.1.9
    hooks:
      - id: ruff
        args: [--fix]
      - id: ruff-format

  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v4.5.0
    hooks:
      - id: trailing-whitespace
      - id: end-of-file-fixer
      - id: check-yaml
      - id: check-toml
      - id: check-merge-conflict
      - id: debug-statements   # catches forgotten breakpoint() calls

  - repo: https://github.com/pre-commit/mirrors-mypy
    rev: v1.7.1
    hooks:
      - id: mypy
        additional_dependencies: [pydantic, types-requests]`,
      },
      {
        type: 'exercise',
        title: 'Statistics Module with Tests',
        description: 'Write a `stats.py` module with `mean(nums)`, `median(nums)`, `mode(nums)`, and `std_dev(nums)`. Then write comprehensive tests in `test_stats.py` using fixtures, parametrize, and exception testing. All edge cases: empty list, single element, all same values.',
        language: 'python',
        starterCode: `# stats.py
def mean(nums: list[float]) -> float: ...
def median(nums: list[float]) -> float: ...
def mode(nums: list[float]) -> float: ...
def std_dev(nums: list[float]) -> float: ...

# test_stats.py
import pytest
from stats import mean, median, mode, std_dev`,
        solution: `# stats.py
import math
from collections import Counter

def mean(nums: list[float]) -> float:
    if not nums:
        raise ValueError("Cannot compute mean of empty list")
    return sum(nums) / len(nums)

def median(nums: list[float]) -> float:
    if not nums:
        raise ValueError("Cannot compute median of empty list")
    sorted_nums = sorted(nums)
    n = len(sorted_nums)
    mid = n // 2
    return sorted_nums[mid] if n % 2 else (sorted_nums[mid-1] + sorted_nums[mid]) / 2

def mode(nums: list[float]) -> float:
    if not nums:
        raise ValueError("Cannot compute mode of empty list")
    return Counter(nums).most_common(1)[0][0]

def std_dev(nums: list[float]) -> float:
    if not nums:
        raise ValueError("Cannot compute std_dev of empty list")
    avg = mean(nums)
    return math.sqrt(sum((x - avg) ** 2 for x in nums) / len(nums))

# test_stats.py
import pytest
from stats import mean, median, mode, std_dev

@pytest.fixture
def sample():
    return [1.0, 2.0, 2.0, 3.0, 4.0]

def test_mean(sample): assert mean(sample) == pytest.approx(2.4)
def test_median_odd(): assert median([1, 3, 5]) == 3
def test_median_even(): assert median([1, 2, 3, 4]) == 2.5
def test_mode(sample): assert mode(sample) == 2.0
def test_std_dev(): assert std_dev([2, 4, 4, 4, 5, 5, 7, 9]) == pytest.approx(2.0)

@pytest.mark.parametrize("fn", [mean, median, mode, std_dev])
def test_empty_raises(fn): pytest.raises(ValueError, fn, [])`,
        hints: ['Use pytest.approx for floating point comparisons', 'parametrize can take a list of functions to test the same property across all', 'Counter.most_common(1)[0][0] gives the most frequent element'],
      },
    ],
  },

  // ─── Lesson 5: Scripts, env & HTTP (full-stack bridge) ─────────────────
  {
    id: 'py-fullstack-scripts',
    moduleId: 'python-backend',
    phaseId: 'py-tooling',
    phaseNumber: 3,
    order: 5,
    title: 'Scripts, Environment Variables & HTTP Clients',
    description:
      'Write small automation and integration scripts like a full-stack engineer: load `.env`, parse CLI flags, and call HTTP APIs with `httpx` (sync and async overview).',
    duration: '50 min',
    difficulty: 'intermediate',
    objectives: [
      'Load secrets and config with `python-dotenv` without committing them',
      'Expose flags with `argparse` for reproducible one-off tools',
      'Perform typed GET/POST calls with timeouts and error handling',
      'Know when to reuse the same patterns your frontend uses (JSON, headers, bearer tokens)',
    ],
    content: [
      {
        type: 'text',
        markdown: `## Same contracts as the browser

Your React app sends JSON and bearer tokens. Python tooling should speak the same shapes — it makes debugging production issues much faster.`,
      },
      {
        type: 'code',
        language: 'bash',
        filename: 'deps.sh',
        code: `pip install httpx python-dotenv`,
      },
      {
        type: 'code',
        language: 'python',
        filename: 'env_cli.py',
        code: `import argparse
import os

from dotenv import load_dotenv

load_dotenv()  # reads .env beside cwd

API_URL = os.environ.get("API_URL", "http://127.0.0.1:8000")

parser = argparse.ArgumentParser(description="Ping backend health endpoint")
parser.add_argument("--path", default="/health", help="Path to GET")
args = parser.parse_args()

import httpx

url = API_URL.rstrip("/") + args.path
resp = httpx.get(url, timeout=10.0)
resp.raise_for_status()
print(resp.json())`,
      },
      {
        type: 'code',
        language: 'python',
        filename: 'httpx_post.py',
        code: `import httpx

payload = {"email": "user@example.com", "name": "Ada"}

with httpx.Client(base_url="https://api.example.com", timeout=15.0) as client:
    r = client.post("/v1/users", json=payload, headers={"Authorization": "Bearer TOKEN"})
    r.raise_for_status()
    user = r.json()
    print(user.get("id"))`,
      },
      {
        type: 'callout',
        tone: 'warning',
        title: 'Never print secrets',
        content:
          'Log request ids, not access tokens. In real services, read tokens from env or a vault — the snippets use placeholders.',
      },
      {
        type: 'exercise',
        title: 'CLI status checker',
        description:
          'Using `argparse`, accept `--url` (required). `GET` the URL with httpx, print status code; on 4xx/5xx print body text (first 500 chars). Exit with code 1 if request fails.',
        language: 'python',
        starterCode: `import argparse
import sys

import httpx


def main() -> None:
    ...


if __name__ == "__main__":
    main()
`,
        solution: `import argparse
import sys

import httpx


def main() -> None:
    p = argparse.ArgumentParser()
    p.add_argument("--url", required=True)
    args = p.parse_args()
    try:
        r = httpx.get(args.url, timeout=15.0)
    except httpx.HTTPError as exc:
        print("request failed:", exc)
        sys.exit(1)
    print("status", r.status_code)
    if r.status_code >= 400:
        print(r.text[:500])
        sys.exit(1)


if __name__ == "__main__":
    main()`,
        hints: ['httpx.get can raise for transport errors; status codes you check manually unless using raise_for_status()', 'Slice text to avoid dumping HTML megabytes'],
      },
      {
        type: 'exercise',
        title: 'Parse Link header',
        description:
          'Function `next_page_url(response: httpx.Response) -> str | None` parses RFC 5988-style `Link` header for `rel="next"` URI if present; else None. Use `re` or string split — keep it pragmatic.',
        language: 'python',
        starterCode: `import re

import httpx


def next_page_url(response: httpx.Response) -> str | None:
    ...
`,
        solution: `import re

import httpx

_LINK = re.compile(r'<([^>]+)>;\\s*rel="next"', re.IGNORECASE)


def next_page_url(response: httpx.Response) -> str | None:
    link = response.headers.get("link")
    if not link:
        return None
    m = _LINK.search(link)
    return m.group(1) if m else None`,
        hints: ['Headers are case-insensitive but httpx normalizes to lower keys in .headers.get — actually it is lower-cased', 'Use response.headers.get("link") — httpx lowercases header keys'],
      },
    ],
  },

  // ─── Lesson 6: Concurrency — GIL, Threading, Multiprocessing & asyncio ──
  {
    id: 'py-concurrency',
    moduleId: 'python-backend',
    phaseId: 'py-tooling',
    phaseNumber: 3,
    order: 6,
    title: 'Concurrency: GIL, Threading, Multiprocessing & asyncio',
    description: 'Understand Python\'s concurrency model from first principles — the GIL, what it blocks and what it doesn\'t, when to use threads vs processes vs async, and how asyncio works under the hood.',
    duration: '60 min',
    difficulty: 'intermediate',
    objectives: [
      'Explain the GIL and why it limits CPU-bound parallelism',
      'Use threading for I/O-bound concurrency',
      'Use multiprocessing to bypass the GIL for CPU-bound work',
      'Use asyncio/await for high-throughput I/O without threads',
      'Choose the right tool: threading vs multiprocessing vs asyncio',
    ],
    content: [
      {
        type: 'text',
        markdown: `## The GIL — Python's Big Trade-off

The **Global Interpreter Lock (GIL)** is a mutex that prevents multiple Python threads from executing Python bytecode simultaneously in the same process. Only one thread runs at a time.

**What this means:**
- CPU-bound work (computation, encryption, sorting): threads do NOT run in parallel — they take turns, so 4 threads ≈ 1 thread
- I/O-bound work (network, disk, database): threads DO run "in parallel" — while one thread waits for I/O, the GIL is released and another thread runs

**Solutions:**
- I/O-bound: **threading** or **asyncio**
- CPU-bound: **multiprocessing** (separate processes, separate GIL) or C extensions (numpy bypasses GIL)

> Python 3.13 introduces "free-threaded mode" (no GIL) as an experimental option.`,
      },
      {
        type: 'code',
        language: 'python',
        filename: 'threading_example.py',
        code: `import threading
import time
import queue

# ── Threading — good for I/O-bound work ─────────────
def fetch_url(url: str, results: list, index: int) -> None:
    """Simulates an HTTP request."""
    time.sleep(0.5)   # I/O wait — GIL released here
    results[index] = f"Response from {url}"

urls = [f"https://api.example.com/item/{i}" for i in range(5)]
results = [None] * len(urls)

threads = [
    threading.Thread(target=fetch_url, args=(url, results, i))
    for i, url in enumerate(urls)
]

start = time.perf_counter()
for t in threads: t.start()
for t in threads: t.join()   # wait for all to finish
elapsed = time.perf_counter() - start

print(f"Fetched {len(urls)} URLs in {elapsed:.2f}s")   # ~0.5s, not 2.5s!

# ── Thread safety — use locks for shared state ───────
class ThreadSafeCounter:
    def __init__(self):
        self._value = 0
        self._lock = threading.Lock()

    def increment(self) -> None:
        with self._lock:       # only one thread at a time
            self._value += 1

    @property
    def value(self) -> int:
        return self._value

# ── ThreadPoolExecutor — higher-level API ──────────
from concurrent.futures import ThreadPoolExecutor, as_completed

def download(url: str) -> str:
    time.sleep(0.1)
    return f"data from {url}"

with ThreadPoolExecutor(max_workers=10) as executor:
    futures = {executor.submit(download, url): url for url in urls}
    for future in as_completed(futures):
        result = future.result()
        print(result)`,
      },
      {
        type: 'code',
        language: 'python',
        filename: 'multiprocessing_example.py',
        code: `import multiprocessing
from concurrent.futures import ProcessPoolExecutor
import time

# ── Multiprocessing — bypass GIL for CPU-bound work ──
def cpu_heavy(n: int) -> int:
    """Pure computation — benefits from separate processes."""
    return sum(i * i for i in range(n))

if __name__ == "__main__":   # REQUIRED on Windows/macOS
    numbers = [1_000_000] * 4

    # Sequential
    start = time.perf_counter()
    results = [cpu_heavy(n) for n in numbers]
    seq_time = time.perf_counter() - start

    # Parallel — 4 processes, 4 CPU cores
    start = time.perf_counter()
    with ProcessPoolExecutor(max_workers=4) as executor:
        results = list(executor.map(cpu_heavy, numbers))
    par_time = time.perf_counter() - start

    print(f"Sequential: {seq_time:.2f}s")
    print(f"Parallel:   {par_time:.2f}s")
    print(f"Speedup:    {seq_time/par_time:.1f}x")`,
      },
      {
        type: 'code',
        language: 'python',
        filename: 'asyncio_example.py',
        code: `import asyncio
import time

# ── asyncio — cooperative concurrency without threads ─
# Single thread, event loop switches between coroutines at await points

async def fetch(url: str) -> str:
    """Coroutine — runs until it hits await, then yields control."""
    print(f"Starting fetch: {url}")
    await asyncio.sleep(0.5)   # yields control — other coroutines run here
    print(f"Finished fetch: {url}")
    return f"Response from {url}"

async def main() -> None:
    urls = [f"https://api.example.com/{i}" for i in range(5)]

    # Sequential — one at a time
    for url in urls:
        await fetch(url)   # waits for each before starting next

    # Concurrent — all start immediately, complete when done
    tasks = [asyncio.create_task(fetch(url)) for url in urls]
    results = await asyncio.gather(*tasks)   # ~0.5s total instead of 2.5s

    # asyncio.gather with error handling
    results = await asyncio.gather(*tasks, return_exceptions=True)
    for r in results:
        if isinstance(r, Exception):
            print(f"Error: {r}")

# ── Real pattern: async HTTP with httpx ─────────────
# import httpx
# async def fetch_real(url: str) -> dict:
#     async with httpx.AsyncClient() as client:
#         response = await client.get(url)
#         return response.json()

# ── Run the event loop ─────────────────────────────
asyncio.run(main())

# ── asyncio + FastAPI ──────────────────────────────
# FastAPI runs on an async event loop — every endpoint is a coroutine
# from fastapi import FastAPI
# app = FastAPI()
#
# @app.get("/users/{user_id}")
# async def get_user(user_id: int):
#     user = await db.fetch_one("SELECT * FROM users WHERE id = ?", user_id)
#     return user`,
      },
      {
        type: 'callout',
        tone: 'production',
        title: 'Which to Use When',
        content: '**asyncio**: web servers, APIs, crawlers, chatbots — anything with lots of I/O. **threading**: calling blocking libraries that don\'t support async (old DB drivers, legacy code). **multiprocessing**: image processing, ML inference, data transformation, anything CPU-heavy. Most modern Python web backends use asyncio. Never use threading + asyncio together unless you explicitly know what you\'re doing.',
      },
      {
        type: 'exercise',
        title: 'Async URL Checker',
        description: 'Write an `async def check_urls(urls: list[str]) -> list[dict]` function that checks each URL concurrently (simulate with asyncio.sleep of random 0.1-0.5s), returning a list of `{"url": str, "status": "ok"|"error", "time_ms": int}` dicts. Print a summary when done.',
        language: 'python',
        starterCode: `import asyncio
import random
import time

async def check_url(url: str) -> dict:
    """Simulate checking a URL. Returns status dict."""
    pass

async def check_urls(urls: list[str]) -> list[dict]:
    """Check all URLs concurrently."""
    pass

urls = [f"https://example.com/page/{i}" for i in range(10)]
results = asyncio.run(check_urls(urls))
print(f"Checked {len(results)} URLs")`,
        solution: `import asyncio
import random
import time

async def check_url(url: str) -> dict:
    start = time.perf_counter()
    delay = random.uniform(0.1, 0.5)
    await asyncio.sleep(delay)
    status = "error" if random.random() < 0.1 else "ok"
    elapsed_ms = int((time.perf_counter() - start) * 1000)
    return {"url": url, "status": status, "time_ms": elapsed_ms}

async def check_urls(urls: list[str]) -> list[dict]:
    tasks = [asyncio.create_task(check_url(url)) for url in urls]
    results = await asyncio.gather(*tasks, return_exceptions=True)

    output = []
    for r in results:
        if isinstance(r, Exception):
            output.append({"url": "unknown", "status": "error", "time_ms": 0})
        else:
            output.append(r)

    ok = sum(1 for r in output if r["status"] == "ok")
    avg_ms = sum(r["time_ms"] for r in output) / len(output)
    print(f"OK: {ok}/{len(output)}, avg: {avg_ms:.0f}ms")
    return output`,
        hints: ['Use asyncio.create_task() to start all coroutines before awaiting any', 'asyncio.gather(*tasks) runs them all concurrently', 'return_exceptions=True prevents one error from cancelling the rest'],
      },
    ],
  },
]
