import type { Lesson } from '@/types/lesson'

/** Phase py-core · Part 2 — modules, stdlib for web work, collections, errors, I/O, JSON/time, regex, OOP, patterns */
export const pythonAppliedLessons: Lesson[] = [
  {
    id: 'py-modules-stdlib',
    moduleId: 'python-backend',
    phaseId: 'py-core',
    phaseNumber: 1,
    order: 7,
    title: 'Modules, Packages & the Standard Library',
    description:
      'How imports resolve, `__name__` guards, runnable modules, and the stdlib pieces full-stack engineers touch daily (`os`, `sys`, `pathlib`, `urllib.parse`, etc.).',
    duration: '55 min',
    difficulty: 'intermediate',
    objectives: [
      'Choose absolute vs relative imports inside packages',
      'Explain why `if __name__ == "__main__":` exists',
      'Use `pathlib.Path` over `os.path` spaghetti',
      'Build query strings with `urllib.parse`',
    ],
    content: [
      {
        type: 'text',
        markdown: `## Packages vs modules

- **Module**: one file \`foo.py\` → \`import foo\`
- **Package**: directory with \`__init__.py\` (namespace packages can omit it but explicit is clearer for app code)
- Put shared code in packages; keep script entrypoints thin.`,
      },
      {
        type: 'code',
        language: 'python',
        filename: 'imports.py',
        code: `import json
from pathlib import Path
from urllib.parse import urlencode, urlunparse

# package-relative (inside a package only)
# from .users import find_user

if __name__ == "__main__":
    # Runs when executed as script — not when imported
    print("CLI mode")`,
      },
      {
        type: 'code',
        language: 'python',
        filename: 'pathlib_demo.py',
        code: `from pathlib import Path

root = Path(__file__).resolve().parent
config = root / "config" / "app.toml"
print(config.suffix)        # .toml
print(config.exists())

text = config.read_text(encoding="utf-8") if config.exists() else ""

# Safe join — no manual slashes
p = Path("/var/log") / "app" / "out.log"`,
      },
      {
        type: 'code',
        language: 'python',
        filename: 'querystring.py',
        code: `from urllib.parse import urlencode

qs = urlencode({"q": "python web", "page": "2"})
print(qs)  # q=python+web&page=2`,
      },
      {
        type: 'exercise',
        title: 'Find project root marker',
        description:
          '`find_repo_root(start: Path, marker: str = ".git") -> Path | None`: walk `start.parents` (and `start`), return first directory containing `marker`; else None.',
        language: 'python',
        starterCode: `from pathlib import Path

def find_repo_root(start: Path, marker: str = ".git") -> Path | None:
    ...
`,
        solution: `from pathlib import Path

def find_repo_root(start: Path, marker: str = ".git") -> Path | None:
    for directory in [start, *start.parents]:
        if (directory / marker).exists():
            return directory
    return None`,
        hints: ['Path.parents yields ancestors', 'Check start itself first'],
      },
      {
        type: 'exercise',
        title: 'Build API URL',
        description:
          'Given base `"https://api.example.com"` (no trailing slash), path `"/v1/users"`, and query dict `{"active": "true"}`, return full URL string using `urllib.parse`.',
        language: 'python',
        starterCode: `from urllib.parse import urlencode, urlunparse

def build_url(base: str, path: str, query: dict[str, str]) -> str:
    ...
`,
        solution: `from urllib.parse import urlencode, urlunparse, urlparse

def build_url(base: str, path: str, query: dict[str, str]) -> str:
    p = urlparse(base)
    q = urlencode(query)
    return urlunparse((p.scheme, p.netloc, path, "", q, ""))`,
        hints: ['urlparse splits base into components', 'urlunparse reassembles'],
      },
    ],
  },
  {
    id: 'py-collections-pro',
    moduleId: 'python-backend',
    phaseId: 'py-core',
    phaseNumber: 1,
    order: 8,
    title: 'Lists, Tuples, Sets & Dictionaries (Pro Level)',
    description:
      'Big-O intuition, copying, dict ordering, set algebra, `collections.Counter/defaultdict`, and patterns for caching and grouping — essential for APIs and data prep.',
    duration: '60 min',
    difficulty: 'intermediate',
    objectives: [
      'Choose the right collection for membership vs ordering vs uniqueness',
      'Use deep vs shallow copy deliberately',
      'Group records with `defaultdict(list)`',
      'Use `Counter` for tallies',
    ],
    content: [
      {
        type: 'code',
        language: 'python',
        filename: 'collections_demo.py',
        code: `from collections import Counter, defaultdict, deque
import copy

# List — ordered, mutable
nums = [3, 1]
nums.append(2)

# Tuple — ordered, immutable (good dict keys if contents hashable)
point = (10, 20)

# Set — unique, unordered iteration
tags = {"py", "web"}
tags |= {"api"}

# Dict — insertion ordered in Python 3.7+
user = {"name": "AC", "role": "admin"}

# Shallow vs deep
row = {"a": [1]}
clone = row.copy()           # shallow
clone["a"].append(2)         # mutates row["a"] too!
safe = copy.deepcopy(row)

# defaultdict — avoid key checks
by_role: dict[str, list[str]] = defaultdict(list)
by_role["admin"].append("alice")

# Counter
Counter("mississippi")["s"]  # 4

# deque — O(1) ends
q: deque[str] = deque()
q.append("job1")
q.popleft()`,
      },
      {
        type: 'callout',
        tone: 'production',
        title: 'JSON keys must be strings',
        content:
          'Converting nested Python structures to JSON will coerce dict keys to strings. Design models accordingly.',
      },
      {
        type: 'exercise',
        title: 'Invert index',
        description:
          '`invert_unique(d: dict[str, str]) -> dict[str, str]`: swap keys/values. Raise `ValueError` if values are not unique.',
        language: 'python',
        starterCode: `def invert_unique(d: dict[str, str]) -> dict[str, str]:
    ...
`,
        solution: `def invert_unique(d: dict[str, str]) -> dict[str, str]:
    if len(set(d.values())) != len(d):
        raise ValueError("values not unique")
    return {v: k for k, v in d.items()}`,
        hints: ['Set of values length vs dict values length', 'Dict comp for swap'],
      },
      {
        type: 'exercise',
        title: 'Merge SKU stock',
        description:
          'Given `list[tuple[str, int]]` of sku→delta (can repeat sku), return `dict[sku, total]` summing deltas for each.',
        language: 'python',
        starterCode: `def merge_stock(deltas: list[tuple[str, int]]) -> dict[str, int]:
    ...
`,
        solution: `from collections import defaultdict

def merge_stock(deltas: list[tuple[str, int]]) -> dict[str, int]:
    totals: dict[str, int] = defaultdict(int)
    for sku, delta in deltas:
        totals[sku] += delta
    return dict(totals)`,
        hints: ['defaultdict(int)', 'Or use Counter but it is for adding counts the same way'],
      },
    ],
  },
  {
    id: 'py-exceptions-files',
    moduleId: 'python-backend',
    phaseId: 'py-core',
    phaseNumber: 1,
    order: 9,
    title: 'Exceptions & File I/O',
    description:
      '`try`/`except`/`else`/`finally`, exception hierarchy, raising, custom errors, and modern file IO with `pathlib` and context managers.',
    duration: '50 min',
    difficulty: 'intermediate',
    objectives: [
      'Catch specific exceptions; avoid bare `except:`',
      'Chain exceptions with `raise ... from`',
      'Use `Path.read_text` / `write_text` with explicit encoding (`utf-8`)',
      'Know `finally` vs context managers',
    ],
    content: [
      {
        type: 'code',
        language: 'python',
        filename: 'errors.py',
        code: `class PaymentError(Exception):
    """Base for payment failures."""


def charge(amount: float) -> None:
    if amount <= 0:
        raise ValueError("amount must be positive")
    try:
        # simulate gateway
        raise RuntimeError("timeout")
    except RuntimeError as exc:
        raise PaymentError("could not charge") from exc


try:
    charge(-1)
except ValueError as err:
    print("client fix:", err)
except PaymentError as err:
    print("ops alert:", err.__cause__)`,
      },
      {
        type: 'code',
        language: 'python',
        filename: 'files.py',
        code: `from pathlib import Path

path = Path("notes.txt")

# Writing — creates or overwrites
path.write_text("hello\\nworld\\n", encoding="utf-8")

# Reading whole file at once (fine for small files)
content = path.read_text(encoding="utf-8")

# Streaming large files
with path.open("r", encoding="utf-8") as fh:
    for line in fh:
        process(line)  # type: ignore[name-defined]`,
      },
      {
        type: 'exercise',
        title: 'Safe integer parse',
        description:
          '`strict_int(raw: str) -> int` strips input; raises `ValueError("EMPTY")` for blank, or `ValueError("NOT_INT")` if not valid integer (prefer try/except around int()).',
        language: 'python',
        starterCode: `def strict_int(raw: str) -> int:
    ...
`,
        solution: `def strict_int(raw: str) -> int:
    s = raw.strip()
    if s == "":
        raise ValueError("EMPTY")
    try:
        return int(s)
    except ValueError as exc:
        raise ValueError("NOT_INT") from exc`,
        hints: ['Let int() validate', 'Chain with from exc'],
      },
      {
        type: 'exercise',
        title: 'Append JSON line',
        description:
          'Append one JSON object (same line) to `events.jsonl` using `json.dumps`. Create parent dirs if needed (`Path.mkdir(parents=True, exist_ok=True)`).',
        language: 'python',
        starterCode: `import json
from pathlib import Path

def append_event(path: Path, payload: dict) -> None:
    ...
`,
        solution: `import json
from pathlib import Path

def append_event(path: Path, payload: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("a", encoding="utf-8") as fh:
        fh.write(json.dumps(payload, ensure_ascii=False) + "\\n")`,
        hints: ['Open in append mode', 'ensure_ascii=False for unicode'],
      },
    ],
  },
  {
    id: 'py-json-datetime',
    moduleId: 'python-backend',
    phaseId: 'py-core',
    phaseNumber: 1,
    order: 10,
    title: 'JSON & date/time',
    description:
      'Serialize Python to JSON safely, parse API bodies, and work with `datetime`, UTC awareness, and ISO-8601 strings used across the stack.',
    duration: '50 min',
    difficulty: 'intermediate',
    objectives: [
      'Use `json.loads` / `json.dumps` with known types',
      'Implement a `default=` encoder hook for datetime',
      'Produce and parse ISO timestamps with timezone awareness',
    ],
    content: [
      {
        type: 'code',
        language: 'python',
        filename: 'json_dt.py',
        code: `import json
from datetime import datetime, timezone, timedelta

payload = {"label": "ship", "at": datetime.now(timezone.utc)}

def encode(obj):
    if isinstance(obj, datetime):
        return obj.isoformat()
    raise TypeError


text = json.dumps(payload, default=encode)
roundtrip = json.loads(text)

parsed = datetime.fromisoformat(roundtrip["at"].replace("Z", "+00:00"))

# Offsets
utc = timezone.utc
later = datetime.now(utc) + timedelta(hours=2)`,
      },
      {
        type: 'callout',
        tone: 'warning',
        title: 'Naive datetimes',
        content:
          'A datetime without tzinfo is naive — dangerous for scheduling. Prefer UTC at storage boundaries, convert at the edge for display.',
      },
      {
        type: 'exercise',
        title: 'API envelope parse',
        description:
          'Parse JSON string `\'{"data":{"id":1},"error":null}\'`; return `(id, error)` tuple where `error` is None or str. Raise `ValueError` if shape wrong.',
        language: 'python',
        starterCode: `import json

def parse_envelope(raw: str) -> tuple[int, str | None]:
    ...
`,
        solution: `import json

def parse_envelope(raw: str) -> tuple[int, str | None]:
    obj = json.loads(raw)
    if not isinstance(obj, dict):
        raise ValueError("root not object")
    if "data" not in obj or "error" not in obj:
        raise ValueError("missing keys")
    data = obj["data"]
    if not isinstance(data, dict) or "id" not in data:
        raise ValueError("bad data")
    err = obj["error"]
    if err is not None and not isinstance(err, str):
        raise ValueError("bad error")
    return int(data["id"]), err`,
        hints: ['json.loads first', 'Validate types step by step'],
      },
      {
        type: 'exercise',
        title: 'Cookie max-age',
        description:
          'Given `expires_at: datetime` (timezone-aware UTC) return `max-age` seconds from now as int (for `Set-Cookie`). Use `datetime.now(timezone.utc)`.',
        language: 'python',
        starterCode: `from datetime import datetime, timezone

def max_age_seconds(expires_at: datetime) -> int:
    ...
`,
        solution: `from datetime import datetime, timezone

def max_age_seconds(expires_at: datetime) -> int:
    now = datetime.now(timezone.utc)
    return max(0, int((expires_at - now).total_seconds()))`,
        hints: ['timedelta.total_seconds()', 'max with 0 avoids negative cookie'],
      },
    ],
  },
  {
    id: 'py-regex',
    moduleId: 'python-backend',
    phaseId: 'py-core',
    phaseNumber: 1,
    order: 11,
    title: 'Regular Expressions',
    description:
      'Practical `re` usage for logs, validation, and scraping — with raw strings and compiled patterns.',
    duration: '40 min',
    difficulty: 'intermediate',
    objectives: [
      'Use raw strings for patterns',
      'Choose `search` vs `match` vs `fullmatch`',
      'Name groups for structured parsing',
    ],
    content: [
      {
        type: 'code',
        language: 'python',
        filename: 'regex.py',
        code: `import re

pattern = re.compile(r"[\\w.+-]+@[\\w.-]+\\.[A-Za-z]{2,}")

pattern.search("mail me x@y.co ok")
# <re.Match ...>

re.findall(r"\\d+", "a1b2")   # ["1", "2"]

m = re.fullmatch(r"[a-z]{3}", "abc")
m is not None  # True`,
      },
      {
        type: 'exercise',
        title: 'Extract trace id',
        description:
          'From text like `"trace=abc-123 def"` extract id after `trace=` until space or end; return None if missing.',
        language: 'python',
        starterCode: `import re

def trace_id(line: str) -> str | None:
    ...
`,
        solution: `import re

def trace_id(line: str) -> str | None:
    m = re.search(r"trace=([^\\s]+)", line)
    return m.group(1) if m else None`,
        hints: ['Non-greedy stop at whitespace via negated class'],
      },
      {
        type: 'exercise',
        title: 'IPv4 loose check',
        description:
          'Return True if `s` is four dot-separated integers 0-255 (no leading zeroes except single "0"). Use regex or split+validate.',
        language: 'python',
        starterCode: `import re

def ipv4_loose(s: str) -> bool:
    ...
`,
        solution: `import re

_IPV4 = re.compile(
    r"^(?:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)\\.){3}"
    r"(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)$"
)

def ipv4_loose(s: str) -> bool:
    return bool(_IPV4.fullmatch(s))`,
        hints: ['Compile once', 'fullmatch anchors entire string'],
      },
    ],
  },
  {
    id: 'py-oop-solid',
    moduleId: 'python-backend',
    phaseId: 'py-core',
    phaseNumber: 1,
    order: 12,
    title: 'OOP: Classes, Dataclasses & Protocols',
    description:
      'Classes, inheritance, `dataclass` for DTOs, `Protocol` for structural typing, and special methods you see in frameworks.',
    duration: '60 min',
    difficulty: 'intermediate',
    objectives: [
      'Model entities with `@dataclass(slots=True)` (3.10+) when fitting',
      'Use `Protocol` instead of excessive ABCs',
      'Implement `__str__` / `__repr__` meaningfully',
    ],
    content: [
      {
        type: 'code',
        language: 'python',
        filename: 'oop.py',
        code: `from __future__ import annotations

from dataclasses import dataclass, field
from typing import Protocol


@dataclass(slots=True)
class UserDTO:
    id: int
    email: str
    roles: tuple[str, ...] = field(default_factory=tuple)


class Greeter(Protocol):
    def greet(self, name: str) -> str: ...


class EnGreeter:
    def greet(self, name: str) -> str:
        return f"Hello {name}"


def announce(g: Greeter, who: str) -> str:
    return g.greet(who).upper()


class Account:
    def __init__(self, owner_id: str, balance: float = 0) -> None:
        self.owner_id = owner_id
        self._balance = balance

    def __repr__(self) -> str:
        return f"Account(owner_id={repr(self.owner_id)}, balance={self._balance:.2f})"`,
      },
      {
        type: 'exercise',
        title: 'Money value object',
        description:
          'Dataclass `Money` with `currency: str` and `cents: int` (int only). Method `add(other)` returns new Money; raise ValueError if currencies differ.',
        language: 'python',
        starterCode: `from dataclasses import dataclass

@dataclass(slots=True)
class Money:
    currency: str
    cents: int

    def add(self, other: "Money") -> "Money":
        ...
`,
        solution: `from __future__ import annotations

from dataclasses import dataclass

@dataclass(slots=True)
class Money:
    currency: str
    cents: int

    def add(self, other: Money) -> Money:
        if self.currency != other.currency:
            raise ValueError("currency mismatch")
        return Money(self.currency, self.cents + other.cents)`,
        hints: ['Return new instance (immutable style)', 'Compare currency first'],
      },
      {
        type: 'exercise',
        title: 'Repository protocol',
        description:
          'Define `SupportsUserLookup` Protocol with `get_user(self, user_id: int) -> str | None`. Function `display(u, uid)` returns user or `"unknown"`.',
        language: 'python',
        starterCode: `from typing import Protocol


class SupportsUserLookup(Protocol):
    ...


def display(repo: SupportsUserLookup, user_id: int) -> str:
    ...
`,
        solution: `from typing import Protocol


class SupportsUserLookup(Protocol):
    def get_user(self, user_id: int) -> str | None: ...


def display(repo: SupportsUserLookup, user_id: int) -> str:
    name = repo.get_user(user_id)
    return name if name is not None else "unknown"`,
        hints: ['Protocol methods use ... body in typing only', 'Runtime duck typing — no inheritance needed'],
      },
    ],
  },
  {
    id: 'py-patterns-advanced',
    moduleId: 'python-backend',
    phaseId: 'py-core',
    phaseNumber: 1,
    order: 13,
    title: 'Iterators, Generators, Decorators & Context',
    description:
      'Build lazy pipelines, function decorators for cross-cutting concerns, and context managers (`with`) for resources.',
    duration: '55 min',
    difficulty: 'advanced',
    objectives: [
      'Write a generator for streaming lines',
      'Implement a simple `@timed` decorator',
      'Use `contextlib.contextmanager` for quick `with` blocks',
    ],
    content: [
      {
        type: 'callout',
        tone: 'production',
        title: 'Logging beats print in services',
        content:
          'Decorators that `print` are for learning. In FastAPI/Django/Celery use `structlog` or `logging` with correlation ids.',
      },
      {
        type: 'code',
        language: 'python',
        filename: 'patterns.py',
        code: `from __future__ import annotations

import time
from contextlib import contextmanager
from collections.abc import Callable, Iterator
from typing import TypeVar, ParamSpec

P = ParamSpec("P")
R = TypeVar("R")


def timed(fn: Callable[P, R]) -> Callable[P, R]:
    def wrapper(*args: P.args, **kwargs: P.kwargs) -> R:
        start = time.perf_counter()
        try:
            return fn(*args, **kwargs)
        finally:
            print(f"\${fn.__name__} took {time.perf_counter() - start:.4f}s")

    return wrapper


def gen_squares(n: int) -> Iterator[int]:
    for i in range(n):
        yield i * i


@contextmanager
def transaction():
    print("BEGIN")
    try:
        yield
        print("COMMIT")
    except Exception:
        print("ROLLBACK")
        raise`,
      },
      {
        type: 'exercise',
        title: 'Chunked reader',
        description:
          'Generator `read_blocks(lines: list[str], size: int)` yields joined blocks separated by blank lines (paragraphs), each block at most `size` lines (last shorter ok).',
        language: 'python',
        starterCode: `from collections.abc import Iterator

def read_blocks(lines: list[str], size: int) -> Iterator[list[str]]:
    ...
`,
        solution: `from collections.abc import Iterator

def read_blocks(lines: list[str], size: int) -> Iterator[list[str]]:
    buf: list[str] = []
    for line in lines:
        if line.strip() == "":
            if buf:
                for i in range(0, len(buf), size):
                    yield buf[i : i + size]
                buf = []
            continue
        buf.append(line)
    if buf:
        for i in range(0, len(buf), size):
            yield buf[i : i + size]`,
        hints: ['Blank line flushes', 'Yield slices of size'],
      },
      {
        type: 'exercise',
        title: 'retry decorator',
        description:
          '`retry(times: int)` returns decorator that retries function on `TimeoutError` up to `times` attempts total; re-raise last error.',
        language: 'python',
        starterCode: `def retry(times: int):
    ...
`,
        solution: `from collections.abc import Callable, TypeVar
from functools import wraps

T = TypeVar("T")


def retry(times: int) -> Callable[[Callable[..., T]], Callable[..., T]]:
    def deco(fn: Callable[..., T]) -> Callable[..., T]:
        @wraps(fn)
        def wrapper(*args, **kwargs):
            last: TimeoutError | None = None
            for _ in range(times):
                try:
                    return fn(*args, **kwargs)
                except TimeoutError as exc:  # noqa: PERF203
                    last = exc
            assert last is not None
            raise last

        return wrapper

    return deco`,
        hints: ['functools.wraps preserves metadata', 'Loop times attempts', 'Store last exception'],
      },
    ],
  },
]
