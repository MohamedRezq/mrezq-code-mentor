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
        markdown: `## Module vs package — how Python organizes code

| Term | What it is | How you import |
|------|------------|----------------|
| **Module** | One \`.py\` file | \`import utils\` → file \`utils.py\` |
| **Package** | Folder of modules (usually has \`__init__.py\`) | \`import app.users\` → folder \`app/\` with \`users.py\` |

Example layout:

\`\`\`
myproject/
  app/
    __init__.py      # makes app a package (can be empty)
    users.py         # module app.users
    api/
      __init__.py
      routes.py      # module app.api.routes
  scripts/
    seed_db.py       # thin entry script
\`\`\`

**Rule of thumb:** libraries and domain logic live in **packages**; \`scripts/\` only wires CLI and calls into packages.`,
      },
      {
        type: 'text',
        markdown: `## How \`import\` works (mental model)

When you write \`from pathlib import Path\`:

1. Python looks on **sys.path** (folders where it searches — project root, venv \`site-packages\`, etc.).
2. It loads the module **once** and caches it in \`sys.modules\`.
3. A second \`import pathlib\` in the same process is instant (already loaded).

| Statement | Meaning |
|-----------|---------|
| \`import json\` | Load module; use as \`json.loads(...)\` |
| \`from json import loads\` | Load module; bind name \`loads\` in your namespace |
| \`from pathlib import Path as P\` | Import with alias |
| \`from .users import find_user\` | **Relative** import — only inside a package (see below) |

### Absolute vs relative imports

| Style | Example | When |
|-------|---------|------|
| **Absolute** | \`from app.users import find_user\` | Default in application code — clearest |
| **Relative** | \`from .users import find_user\` | Inside package \`app\` — means “sibling module \`users\`” |
| **Parent relative** | \`from ..config import settings\` | One package up, then \`config\` |

\`.\` = current package. \`..\` = parent package. **Only works inside a package**, not in a top-level script.

\`\`\`python
# In app/api/routes.py — relative import
from ..users import find_user   # app.users.find_user

# Same thing, absolute (often preferred)
from app.users import find_user
\`\`\`

**Common errors**

| Error | Cause |
|-------|--------|
| \`ImportError: attempted relative import with no known parent package\` | Ran file directly; not loaded as part of package |
| \`ModuleNotFoundError: No module named 'app'\` | Project root not on \`PYTHONPATH\` / wrong working directory |
| Circular import | Two modules import each other at top level — refactor shared code to a third module |`,
      },
      {
        type: 'code',
        language: 'python',
        filename: 'imports_basics.py',
        code: `# Standard library — ships with Python (no pip install)
import json
from pathlib import Path
from urllib.parse import urlencode, urlunparse, urlparse

# Third-party (installed with pip) — example:
# import httpx

data = json.loads('{"ok": true}')
print(data["ok"])   # True`,
        explanation: '`json` is the module; `loads` parses a JSON string into Python dict/list.',
      },
      {
        type: 'text',
        markdown: `## \`if __name__ == "__main__":\` — two ways to run the same file

Every loaded file gets a variable \`__name__\`.

| How the file is started | Value of \`__name__\` |
|-------------------------|------------------------|
| \`python app/cli.py\` (you ran this file) | \`"__main__"\` |
| \`import app.cli\` from another file | \`"app.cli"\` (the module path) |

So the guard means: **only run this block when this file is the program entrypoint**, not when someone imports it.

\`\`\`python
def main():
    print("CLI starting...")

if __name__ == "__main__":
    main()
\`\`\`

**Without the guard:** \`import app.cli\` would accidentally run \`main()\`, start argparse, hit the network — disasters in tests and libraries.

**With the guard:** importers get functions only; humans run \`python -m app.cli\` or \`python app/cli.py\` to execute CLI.

### \`python file.py\` vs \`python -m package.module\`

| Command | Typical use |
|---------|-------------|
| \`python scripts/seed.py\` | One-off script |
| \`python -m app.cli\` | Run module as \`__main__\` with correct package context (relative imports work) |`,
      },
      {
        type: 'code',
        language: 'python',
        filename: 'main_guard_demo.py',
        code: `# Save as demo.py and try both:
#   python demo.py          -> __name__ is "__main__"
#   python -c "import demo" -> __name__ is "demo"

print("Module loaded, __name__ =", __name__)

def greet():
    print("Hello from greet()")

if __name__ == "__main__":
    print("Running as script — call greet()")
    greet()
else:
    print("Imported as library — greet() NOT called automatically")`,
      },
      {
        type: 'text',
        markdown: `## \`pathlib.Path\` — modern file paths (prefer over \`os.path\`)

**Why pathlib?** Uses \`/\` operator instead of \`os.path.join("a", "b", "c")\`. Returns \`Path\` objects with methods: \`.exists()\`, \`.read_text()\`, \`.parent\`, \`.suffix\`.

### \`__file__\` — “where is this .py file?”

\`__file__\` is the path to the **current source file** (often relative). \`.resolve()\` makes it absolute.

\`\`\`python
from pathlib import Path

# Directory containing THIS .py file
here = Path(__file__).resolve().parent

config = here / "config" / "app.toml"
\`\`\`

| Expression | Meaning |
|------------|---------|
| \`Path(__file__)\` | Path to this module’s file |
| \`.resolve()\` | Absolute path, symlinks resolved |
| \`.parent\` | Parent directory |
| \`.parents\` | Iterator: parent, grandparent, … (walk up tree) |
| \`path / "subdir" / "file.txt"\` | Join paths safely (OS-correct slashes) |
| \`.exists()\` | \`True\` if file or folder exists |
| \`.is_file()\` / \`.is_dir()\` | More specific checks |
| \`.read_text(encoding="utf-8")\` | Read whole file as str |
| \`.suffix\` | \`".toml"\`, \`".py"\` |
| \`.stem\` | filename without suffix |

### Scenarios

\`\`\`python
from pathlib import Path

# 1) Config next to project root
root = Path(__file__).resolve().parent.parent  # up one if file in app/
env_file = root / ".env"

# 2) Walk upward to find .git (repo root)
start = Path.cwd()
for directory in [start, *start.parents]:
    if (directory / ".git").exists():
        print("repo root:", directory)
        break

# 3) List Python files in a folder
for py in Path("src").glob("**/*.py"):
    print(py)
\`\`\`

**When you still see \`os\` / \`sys\`:** \`os.environ\` for environment variables, \`sys.argv\` for CLI args, \`sys.exit(1)\` for exit codes — pathlib handles paths; os/sys handle process/OS interface.`,
      },
      {
        type: 'code',
        language: 'python',
        filename: 'pathlib_demo.py',
        code: `from pathlib import Path

# This file's directory
root = Path(__file__).resolve().parent
config = root / "config" / "app.toml"

print("config path:", config)
print("suffix:", config.suffix)       # .toml
print("stem:", config.stem)           # app
print("exists:", config.exists())

if config.exists():
    text = config.read_text(encoding="utf-8")
else:
    text = ""

# Absolute path join — no "\\" or "//" mistakes on Windows
log_path = Path("/var/log") / "app" / "out.log"
print(log_path)`,
      },
      {
        type: 'text',
        markdown: `## \`urllib.parse\` — URLs and query strings

A URL has parts:

\`\`\`
https://api.example.com:443/v1/users?active=true&page=2#section
\\___/   \\_____________/ \\_/ \\_______/ \\_________________/ \\____/
scheme      netloc       port   path         query            fragment
\`\`\`

| Function | Purpose |
|----------|---------|
| \`urlencode(dict)\` | Dict → query string \`active=true&page=2\` (handles encoding spaces as \`+\` or \`%20\`) |
| \`urlparse(url)\` | Split string into components |
| \`urlunparse(tuple)\` | Build URL from components |
| \`urljoin(base, path)\` | Join base + relative path safely |

\`\`\`python
from urllib.parse import urlencode, urlparse, urlunparse

qs = urlencode({"q": "python web", "page": "2"})
print(qs)   # q=python+web&page=2

# Build full URL from base + path + query
base = "https://api.example.com"
path = "/v1/users"
query = {"active": "true"}

parts = urlparse(base)
full = urlunparse((parts.scheme, parts.netloc, path, "", urlencode(query), ""))
print(full)
# https://api.example.com/v1/users?active=true
\`\`\`

**Professional abbreviations:** **URL** (full string), **URI** (resource identifier — often used interchangeably in APIs), **QS** / **query string** (after \`?\`), **path** (route), **netloc** (host + port).`,
      },
      {
        type: 'code',
        language: 'python',
        filename: 'querystring.py',
        code: `from urllib.parse import urlencode, urlparse, urlunparse

# Query string only
params = {"q": "python web", "page": "2", "sort": "name"}
qs = urlencode(params)
print(qs)
# q=python+web&page=2&sort=name

# Special characters are encoded
print(urlencode({"email": "a+b@c.com"}))
# email=a%2Bb%40c.com

def build_url(base: str, path: str, query: dict[str, str]) -> str:
    p = urlparse(base)
    return urlunparse((p.scheme, p.netloc, path, "", urlencode(query), ""))

print(build_url("https://api.example.com", "/v1/users", {"active": "true"}))`,
      },
      {
        type: 'callout',
        tone: 'tip',
        title: 'Stdlib map for full-stack Python',
        content:
          '`pathlib` paths · `json` serialization · `urllib.parse` URLs · `datetime` timestamps · `logging` logs · `os.environ` config · `sys.argv` CLI · `subprocess` shell commands (use carefully) · `hashlib` checksums · `re` regex. Learn these before reaching for third-party duplicates.',
      },
      {
        type: 'exercise',
        title: 'Find project root marker',
        description:
          'Implement `find_repo_root(start: Path, marker: str = ".git") -> Path | None`. Walk **up** the directory tree from `start`: check `start`, then `start.parent`, then `start.parent.parent`, … until you find a folder that contains a file or directory named `marker` (e.g. `.git`). Return that directory’s `Path`, or `None` if you reach the filesystem root without finding it. Use `start.parents` and `(directory / marker).exists()`.',
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
          'Implement `build_url(base, path, query)` returning a full URL string. Example: base `"https://api.example.com"`, path `"/v1/users"`, query `{"active": "true"}` → `"https://api.example.com/v1/users?active=true"`. Use `urlparse(base)` to keep scheme and host, `urlencode(query)` for the query part, and `urlunparse(...)` to assemble. Do not concatenate strings manually — spaces and `&` must be encoded.',
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
        type: 'text',
        markdown: `### Set comprehension vs list comprehension

\`\`\`python
{len(w) for w in ["aa", "bb", "a"]}   # set → {1, 2}
[len(w) for w in ["aa", "bb", "a"]]   # list → [2, 2, 1]
\`\`\`

- **Set** \`{ expr for ... }\` — unique values, **no guaranteed order** when printing.
- **List** \`[ expr for ... ]\` — keeps duplicates and order.

\`{1, 2}\` and \`{2, 1}\` compare equal. Use a set when uniqueness matters (tags, IDs seen, distinct lengths).`,
      },
      {
        type: 'callout',
        tone: 'clarification',
        title: 'Shallow copy vs deep copy',
        content:
          '`dict.copy()`, slicing `[:]`, and `list(...)` make a **shallow** copy: the outer container is new, but nested mutable objects are still shared. `copy.deepcopy` walks the graph and duplicates nested containers. For immutable innards (ints, strs, tuples of immutables), shallow is enough.',
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
        type: 'callout',
        tone: 'clarification',
        title: '`try` / `except` / `else` / `finally`',
        content:
          '`except` runs only on matching exceptions. `else` runs if no exception escaped the `try`. `finally` always runs (cleanup, closing sockets) — even after `return` inside `try`. Prefer `with open(...) as f:` over manual `try/finally` for files; the context manager closes the handle for you.',
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
        tone: 'clarification',
        title: '`json.loads` vs `json.dumps`',
        content:
          '`loads` = **load string** (JSON text → Python objects). `dumps` = **dump string** (Python → JSON text). For files use `json.load` / `json.dump` with an open file handle. `default=` on `dumps` teaches the encoder how to serialize non-JSON-native types like `datetime`.',
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
        type: 'callout',
        tone: 'clarification',
        title: '`re.match` vs `search` vs `fullmatch`',
        content:
          '`match` anchors at the **start** of the string only (as if the pattern had `\\A`). `search` scans until it finds the first match anywhere. `fullmatch` requires the pattern to cover the **entire** string (common for validators). When unsure, `search` + groups or `fullmatch` for strict inputs.',
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
        type: 'callout',
        tone: 'clarification',
        title: '`Protocol` vs ABC inheritance',
        content:
          'A `Protocol` describes **shape**: “anything with these methods is acceptable.” Type checkers enforce it; at runtime Python does not wrap objects. Inheritance from `ABC` + `@abstractmethod` forces subclasses to opt in explicitly. Protocols shine for adapters (DB backends, HTTP clients) without importing heavy base classes.',
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
        type: 'callout',
        tone: 'clarification',
        title: 'Generators and lazy iteration',
        content:
          'A function with `yield` returns a **generator iterator** — values are computed on demand, not stored in a list. That keeps memory flat when streaming logs or paginating DB rows. Each `for` over a generator advances execution until the next `yield` or `StopIteration`.',
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
