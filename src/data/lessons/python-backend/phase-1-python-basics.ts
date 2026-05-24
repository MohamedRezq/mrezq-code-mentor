import type { Lesson } from '@/types/lesson'

/** Phase py-core · Part 1 — aligned with classic Python tutorials (e.g. W3Schools structure) + 2026 practices (3.12+, match, pathlib). */
export const pythonBasicsLessons: Lesson[] = [
  {
    id: 'py-getting-started',
    moduleId: 'python-backend',
    phaseId: 'py-core',
    phaseNumber: 1,
    order: 1,
    title: 'Getting Started: Python 3, Tools & First Programs',
    description:
      'Install Python 3.12+, use the REPL and scripts, understand indentation and comments, work with variables and basic types, and follow conventions full-stack teams expect.',
    duration: '55 min',
    difficulty: 'beginner',
    objectives: [
      'Explain why Python 3 is the only supported line for new projects',
      'Run code in the REPL vs. a `.py` file',
      'Use meaningful variable names and assignment (including unpacking)',
      'Identify `int`, `float`, `str`, `bool`, and `None`',
      'Describe PEP 8 basics and formatter/linter role (ruff/black)',
    ],
    content: [
      {
        type: 'text',
        markdown: `## Why this track is “full-stack ready”

You will use Python on servers (APIs, workers, automation), in data scripts that feed dashboards, and beside TypeScript front ends. The same language skills apply: readable code, solid tests, and predictable I/O.`,
      },
      {
        type: 'code',
        language: 'bash',
        filename: 'terminal.sh',
        code: `# Check version (use 3.11+; 3.12 is common in 2026)
python --version

# One-off command
python -c "print('Hello, SeniorPath')"

# REPL: type python, then exit with exit() or Ctrl+Z Enter (Windows) / Ctrl+D (Unix)

# Run a file
python main.py`,
      },
      {
        type: 'code',
        language: 'python',
        filename: 'main.py',
        code: `"""Module docstring — first line is a short summary."""

# Single-line comment

user = "dev"           # snake_case for variables
MAX_RETRIES = 3        # SCREAMING_SNAKE for constants

# Multiple assignment / unpacking
x, y, z = 1, 2, 3
first, *middle, last = [1, 2, 3, 4, 5]

# Swap without a temp
a, b = 10, 20
a, b = b, a

# Basic printing (later you will prefer logging in apps)
print("User:", user, "retries:", MAX_RETRIES, sep=" | ")
`,
      },
      {
        type: 'callout',
        tone: 'clarification',
        title: 'REPL vs running a file',
        content:
          'REPL (`python` with no file): each line runs immediately — great for experiments; nothing is saved unless you copy it out. A `.py` file runs top to bottom once; that is what you ship, test, and deploy. Use the REPL to probe APIs; use files for anything you need tomorrow.',
      },
      {
        type: 'callout',
        tone: 'production',
        title: 'Indentation is syntax',
        content:
          'Python uses 4 spaces per level (never tabs mixed with spaces). Wrong indentation is a SyntaxError or changes control flow — the interpreter does not “guess” like some languages.',
      },
      {
        type: 'callout',
        tone: 'tip',
        title: 'Python 2 is dead',
        content: 'Do not learn `print` statements, `xrange`, or `unicode` types. Everything here is Python 3 only.',
      },
      {
        type: 'exercise',
        title: 'Version banner',
        description:
          'Write `banner.py` that prints one line: your name, Python version (`import sys` → `sys.version`), and platform (`import platform` → `platform.system()`). No external libs.',
        language: 'python',
        starterCode: `# banner.py
import sys
import platform

# Build one f-string line with name + version + OS
`,
        solution: `import sys
import platform

name = "Your Name"
print(f"{name} | Python {sys.version.split()[0]} | {platform.system()}")`,
        hints: ['sys.version is a long string; splitting on spaces and taking index 0 gives “3.12.x”', 'platform.system() returns e.g. Windows or Linux'],
      },
      {
        type: 'exercise',
        title: 'Unpack a CSV row',
        description:
          'Given `row = "alice,engineer,3"` split by comma into `name`, `role`, `years` (years as int). Print a human-readable line.',
        language: 'python',
        starterCode: `row = "alice,engineer,3"

# split, unpack, int(...)
`,
        solution: `row = "alice,engineer,3"
name, role, years_raw = row.split(",")
years = int(years_raw)
print(f"{name.title()} — {role} ({years}y)")`,
        hints: ['str.split(",") returns a list of three strings', 'int() casts the years field'],
      },
    ],
  },
  {
    id: 'py-types-and-strings',
    moduleId: 'python-backend',
    phaseId: 'py-core',
    phaseNumber: 1,
    order: 2,
    title: 'Types, Casting & Strings',
    description:
      'Master numeric types, casting, string operations, formatting with f-strings, and common pitfalls (float precision, immutability).',
    duration: '60 min',
    difficulty: 'beginner',
    objectives: [
      'Use `type()` and `isinstance()` correctly',
      'Cast between `int`, `float`, and `str` safely',
      'Slice and format strings; choose f-strings for readability',
      'Know that strings are immutable sequences',
      'Use `decimal.Decimal` when money requires exact arithmetic',
    ],
    content: [
      {
        type: 'code',
        language: 'python',
        filename: 'types.py',
        code: `n = 42
pi = 3.14159
flag = True
label: str | None = None  # optional str (3.10+ union syntax)

type(n)            # <class 'int'>
isinstance(n, int) # True

# Casting
int("10")          # 10
float("3.5")       # 3.5
str(99)            # "99"
bool("")           # False — empty string is falsy
bool("no")         # True — non-empty string is truthy`,
      },
      {
        type: 'callout',
        tone: 'clarification',
        title: '`isinstance` vs `type()`',
        content:
          'Prefer `isinstance(x, int)` over `type(x) is int`. The former is True for subclasses (e.g. `bool` is a subclass of `int` — usually you still want separate branches for bool). `type(x) is int` rejects subclasses and is rarely what you want.',
      },
      {
        type: 'callout',
        tone: 'clarification',
        title: 'Strings never change in place',
        content:
          'Every method like `.strip()` or `.lower()` returns a new `str`. Assign back: `s = s.strip()`. Slicing `s[1:4]` also builds a new string. That is why building huge strings in a loop with `+=` is slow — use `list` + `join` or `io.StringIO`.',
      },
      {
        type: 'code',
        language: 'python',
        filename: 'strings.py',
        code: `s = "  Python Full-Stack  "

s.lower()          # "  python full-stack  "
s.strip()          # "Python Full-Stack"
"A,B,C".split(",") # ["A", "B", "C"]
"-".join(["a", "b"])  # "a-b"

path = "learn/python"
path.split("/")    # ["learn", "python"]

# Indexing & slicing (end exclusive)
t = "SeniorPath"
t[0]               # "S"
t[-1]              # "h"
t[0:6]             # "Senior"
t[::-1]            # reversed

# f-strings (preferred)
price = 19.99
f"Total: {price:.2f} USD"   # two decimal places

# Legacy but still seen in older codebases
"Total: {:.2f}".format(price)

# Multi-line
query = """
SELECT id, title
FROM courses WHERE published = true
""".strip()`,
      },
      {
        type: 'callout',
        tone: 'warning',
        title: 'Floats and money',
        content:
          '0.1 + 0.2 != 0.3 in binary floating point. For currency in production use `decimal.Decimal` or store integer cents — not raw `float`.',
      },
      {
        type: 'exercise',
        title: 'Slug builder',
        description:
          'Implement `slugify(title: str) -> str`: lowercase, strip, replace spaces with `-`, remove characters that are not `a-z`, `0-9`, or `-`. Hint: iterate or build with list + join.',
        language: 'python',
        starterCode: `def slugify(title: str) -> str:
    ...


assert slugify("  Hello World!  ") == "hello-world"
`,
        solution: `def slugify(title: str) -> str:
    s = title.lower().strip().replace(" ", "-")
    allowed = set("abcdefghijklmnopqrstuvwxyz0123456789-")
    return "".join(ch for ch in s if ch in allowed)


assert slugify("  Hello World!  ") == "hello-world"`,
        hints: ['Normalize case first', 'A set of allowed chars makes the filter one line'],
      },
      {
        type: 'exercise',
        title: 'Receipt line',
        description:
          'Given `item = "Mug"`, `qty = 2`, `unit = 8.50`, print one f-string line: name, quantity, line total with two decimals (quantity × unit).',
        language: 'python',
        starterCode: `item = "Mug"
qty = 2
unit = 8.50

# one print(...)
`,
        solution: `item = "Mug"
qty = 2
unit = 8.50
total = qty * unit
print(f"{item} x{qty} @ {unit:.2f} = {total:.2f}")`,
        hints: ['Compute total before the f-string', 'Use :.2f inside braces'],
      },
    ],
  },
  {
    id: 'py-operators-truthiness',
    moduleId: 'python-backend',
    phaseId: 'py-core',
    phaseNumber: 1,
    order: 3,
    title: 'Operators, Truthiness & the Walrus',
    description:
      'Arithmetic, comparison, logical, identity, membership, and assignment operators — plus truthiness rules and `:=` when it helps readability.',
    duration: '45 min',
    difficulty: 'beginner',
    objectives: [
      'Predict results of `and`, `or`, and `not` with non-boolean operands',
      'Use `is` vs `==` correctly (especially with `None`)',
      'Apply `in` for substring and membership',
      'Use `:=` in limited cases (while/read patterns)',
      'Read chained comparisons like `0 < x < 10`',
    ],
    content: [
      {
        type: 'code',
        language: 'python',
        filename: 'operators.py',
        code: `# Arithmetic: + - * / // % **
7 // 3    # 2 floor division
7 % 3     # 1 remainder
2 ** 10   # 1024 power

# Comparison: == != < > <= >=
# Chained
0 < 5 < 10   # True

# Logical
True and False
True or False
not True

# Short-circuit returns last evaluated value
"ok" or "fallback"   # "ok"
"" or "fallback"     # "fallback"

# Identity — same object?
a = [1, 2]
b = a
a is b               # True
a == [1, 2]          # True (equal values)
a is [1, 2]          # False different list objects

# Always compare None with is (not ==)
x = None
if x is None:
    ...

# Membership
"v" in "dev"         # True
2 in {1, 2, 3}       # True

# Assignment operators += *= etc.
n = 10
n += 5`,
      },
      {
        type: 'callout',
        tone: 'clarification',
        title: 'Python `or` / `and` return values, not only True/False',
        content:
          'For `X or Y`, Python evaluates `X` first. If `X` is truthy, it returns `X` and never evaluates `Y`. If `X` is falsy, it returns `Y`. So `"ok" or "fallback"` → `"ok"`, and `"" or "fallback"` → `"fallback"`. Same idea for `and`: it stops at the first falsy operand and returns that value; if all are truthy, it returns the last one. Common idiom: `label = user_input or "Anonymous"`.',
      },
      {
        type: 'callout',
        tone: 'clarification',
        title: '`is` vs `==` (especially `None`)',
        content:
          '`==` asks “equal values?” (calls `__eq__`). `is` asks “same object in memory?”. Always write `x is None` or `x is not None` — singletons like `None` should use `is`. For lists, `[1] == [1]` is True but `[1] is [1]` is False because two separate list objects were allocated.',
      },
      {
        type: 'code',
        language: 'python',
        filename: 'walrus.py',
        code: `# Walrus := assigns and returns in one expression

# Good: avoid duplicate expensive call
if (n := len(data)) > 100:
    print(f"Big payload: {n} items")

# Good: while with read
# while chunk := f.read(8192):
#     process(chunk)

# Bad: cramming := into every if — hurts readability`,
      },
      {
        type: 'callout',
        tone: 'clarification',
        title: 'Walrus `:=` in one breath',
        content:
          '`:=` assigns a name and produces that value inside an expression — useful when you need the result twice (e.g. `if (m := pattern.search(s)): return m.group(1)`). It is still just assignment: obey scoping rules and do not use it when a plain assignment on the line above reads clearer.',
      },
      {
        type: 'exercise',
        title: 'Valid HTTP method',
        description:
          'Function `normalize_method(raw: str) -> str | None`: strip and uppercase; if result is in `{"GET","POST","PUT","PATCH","DELETE"}` return it, else `None`. Use sets.',
        language: 'python',
        starterCode: `ALLOWED = {"GET", "POST", "PUT", "PATCH", "DELETE"}

def normalize_method(raw: str) -> str | None:
    ...
`,
        solution: `ALLOWED = {"GET", "POST", "PUT", "PATCH", "DELETE"}

def normalize_method(raw: str) -> str | None:
    m = raw.strip().upper()
    return m if m in ALLOWED else None`,
        hints: ['Uppercase after strip', 'Membership test against a set is O(1) average'],
      },
      {
        type: 'exercise',
        title: 'Coalesce config',
        description:
          'Given `timeout_env` may be `None` or a string, produce integer timeout: if env is missing or empty string use default `30`, else `int(env)`.',
        language: 'python',
        starterCode: `def parse_timeout(timeout_env: str | None) -> int:
    ...
`,
        solution: `def parse_timeout(timeout_env: str | None) -> int:
    if not timeout_env:
        return 30
    return int(timeout_env)`,
        hints: ['Empty string is falsy; so is None', 'int("25") works'],
      },
    ],
  },
  {
    id: 'py-control-flow',
    moduleId: 'python-backend',
    phaseId: 'py-core',
    phaseNumber: 1,
    order: 4,
    title: 'Control Flow: if / elif / else & match-case',
    description:
      'Branching with clarity, ternary expressions, and structural pattern matching (`match` / `case`) for APIs and parsed payloads.',
    duration: '50 min',
    difficulty: 'beginner',
    objectives: [
      'Structure `if` chains without deep nesting',
      'Use ternary expressions sparingly',
      'Model HTTP status or event types with `match`',
      'Combine guards (`if` after pattern) safely',
    ],
    content: [
      {
        type: 'code',
        language: 'python',
        filename: 'if_chain.py',
        code: `def rate_limit_tier(rpm: int) -> str:
    if rpm < 60:
        return "free"
    elif rpm < 600:
        return "pro"
    else:
        return "enterprise"

# Ternary
label = "even" if n % 2 == 0 else "odd"`,
      },
      {
        type: 'callout',
        tone: 'clarification',
        title: 'Chained comparisons',
        content:
          '`a < b < c` is evaluated as `(a < b) and (b < c)` with `b` evaluated once. It is both readable and correct for ranges (e.g. `0 <= i < len(xs)`). Do not chain mixed operators in ways that confuse readers — when in doubt, use parentheses or separate `if`s.',
      },
      {
        type: 'code',
        language: 'python',
        filename: 'match_case.py',
        code: `from typing import Any

def handle_event(event: dict[str, Any]) -> str:
    match event:
        case {"type": "signup", "user_id": uid}:
            return f"welcome {uid}"
        case {"type": "purchase", "amount": float() as amt} if amt > 0:
            return f"charge {amt}"
        case {"type": "error", "code": code}:
            return f"err {code}"
        case _:
            return "unknown"`,
      },
      {
        type: 'callout',
        tone: 'info',
        title: 'match is not a drop-in for dict.get',
        content:
          'Use `match` when structure varies and readability wins. For one-key lookups, `if` / `.get()` is fine — avoid cleverness.',
      },
      {
        type: 'exercise',
        title: 'HTTP status bucket',
        description:
          'Write `status_bucket(code: int) -> str`: 2xx → `"success"`, 3xx → `"redirect"`, 4xx → `"client_error"`, 5xx → `"server_error"`, else `"unknown"`.',
        language: 'python',
        starterCode: `def status_bucket(code: int) -> str:
    ...
`,
        solution: `def status_bucket(code: int) -> str:
    if 200 <= code < 300:
        return "success"
    if 300 <= code < 400:
        return "redirect"
    if 400 <= code < 500:
        return "client_error"
    if 500 <= code < 600:
        return "server_error"
    return "unknown"`,
        hints: ['Chained bounds checks mirror how HTTP families are defined'],
      },
      {
        type: 'exercise',
        title: 'Command dispatch with match',
        description:
          'Given `cmd: str` and optional `args: list[str]`, return a string: for `"ping"` return `"pong"`, for `"echo"` join args with space or `"empty"`, else `"noop"`. Use `match` on `(cmd, args)`.',
        language: 'python',
        starterCode: `def dispatch(cmd: str, args: list[str]) -> str:
    match (cmd, args):
        ...
`,
        solution: `def dispatch(cmd: str, args: list[str]) -> str:
    match (cmd, args):
        case ("ping", _):
            return "pong"
        case ("echo", []):
            return "empty"
        case ("echo", parts):
            return " ".join(parts)
        case _:
            return "noop"`,
        hints: ['Tuple of (cmd, args) as subject', 'Capture rest list with a name in case'],
      },
    ],
  },
  {
    id: 'py-loops-iterations',
    moduleId: 'python-backend',
    phaseId: 'py-core',
    phaseNumber: 1,
    order: 5,
    title: 'Loops, range, enumerate & Comprehensions',
    description:
      'for/while, loop `else`, `break`/`continue`, `enumerate`/`zip`, and list/dict/set comprehensions you will see in every codebase.',
    duration: '55 min',
    difficulty: 'beginner',
    objectives: [
      'Choose `iter()` patterns for indexes vs pairs',
      'Avoid mutating a list while iterating it',
      'Write readable comprehensions (two clauses max before splitting)',
      'Use `for ... else` when search completes without break',
    ],
    content: [
      {
        type: 'text',
        markdown: `## \`zip()\` — walk two (or more) sequences in parallel

\`\`\`python
for a, b in zip([1, 2], ["x", "y"]):
    print(a, b)
\`\`\`

**Output:**

\`\`\`
1 x
2 y
\`\`\`

### Step by step

1. \`zip([1, 2], ["x", "y"])\` builds pairs: \`(1, "x")\`, then \`(2, "y")\`.
2. \`for a, b in ...\` **unpacks** each pair into two variables.
3. \`print(a, b)\` runs once per pair.

### Scenarios you must recognize

| Situation | What happens |
|-----------|----------------|
| Same length lists | All pairs produced |
| Left longer | Stops at shorter list — extra items ignored |
| Right longer | Same — stops at shorter |
| Three lists | \`zip(a, b, c)\` → triples \`(a0,b0,c0)\`, … |
| Need index + value | Prefer \`enumerate()\` instead of \`zip(range(len()), items)\` |
| Build a dict | \`dict(zip(keys, values))\` |

\`\`\`python
# Unequal length — stops at 2
list(zip([1, 2, 3], ["x", "y"]))        # [(1, 'x'), (2, 'y')]

# Three sequences
list(zip([1, 2], ["a", "b"], [True, False]))

# Keys + values → dict
keys = ["name", "role"]
vals = ["Ada", "admin"]
dict(zip(keys, vals))   # {"name": "Ada", "role": "admin"}
\`\`\``,
      },
      {
        type: 'code',
        language: 'python',
        filename: 'enumerate_and_while.py',
        code: `names = ["ana", "bo"]
for idx, name in enumerate(names, start=1):
    print(idx, name)   # 1 ana, 2 bo

# while — use when you don't know iterations upfront
n = 0
while n < 3:
    print(n)
    n += 1

# for-else: else runs only if loop did NOT break
items = [1, 3, 5]
target = 4
for item in items:
    if item == target:
        found = item
        break
else:
    found = None   # runs because we never broke`,
      },
      {
        type: 'text',
        markdown: `## Set comprehension — \`{ ... for ... in ... }\`

\`\`\`python
unique_lengths = {len(w) for w in ["aa", "bb", "a"]}
print(unique_lengths)   # {1, 2}
\`\`\`

### What happened

| Word | Length |
|------|--------|
| "aa" | 2 |
| "bb" | 2 |
| "a"  | 1 |

Curly braces \`{ }\` **without** \`key: value\` mean a **set** — duplicates removed. So two length-2 words become one \`2\` in the set.

### Why \`{1, 2}\` and not \`{2, 1}\`?

**They are the same set.** Sets are **unordered**. Python may print either order; equality ignores order:

\`\`\`python
{1, 2} == {2, 1}   # True
\`\`\`

| Type | Order matters? | Example |
|------|----------------|---------|
| **list** \`[...]\` | Yes | \`[1,2] != [2,1]\` |
| **set** \`{...}\` | No | \`{1,2} == {2,1}\` |
| **dict** | Keys unique; insertion order kept (3.7+) | |

If you used a **list** comprehension \`[len(w) for w in ...]\` you would get \`[2, 2, 1]\` — duplicates kept, order preserved.`,
      },
      {
        type: 'code',
        language: 'python',
        filename: 'comprehensions.py',
        code: `# List comprehension — [ ] keeps order and duplicates
squares = [x * x for x in range(5)]           # [0, 1, 4, 9, 16]
evens = [x for x in range(10) if x % 2 == 0]  # filter with if at end

# Dict comprehension — { key_expr: value_expr for ... }
square_map = {x: x * x for x in range(4)}     # {0:0, 1:1, 2:4, 3:9}

# Set comprehension — { expr for ... }  (no colon!)
unique_lengths = {len(w) for w in ["aa", "bb", "a"]}  # {1, 2}

# Nested — readable only when short
pairs = [(x, y) for x in range(3) for y in range(2)]
# (0,0), (0,1), (1,0), (1,1), (2,0), (2,1)`,
      },
      {
        type: 'callout',
        tone: 'clarification',
        title: '`for` … `else` (no `break`)',
        content:
          'The `else` on a `for` runs only if the loop finished without `break`. Use it for “not found” instead of a separate `found = False` flag.',
      },
      {
        type: 'callout',
        tone: 'tip',
        title: 'When a comprehension is too much',
        content:
          'More than two `if` clauses or nested loops? Use a normal `for` loop. Readable beats clever.',
      },
      {
        type: 'exercise',
        title: 'Page batches',
        description:
          'Implement `batched(items: list[str], size: int)` yielding lists of length `size` except possibly the last (use range stepping or slicing in a loop).',
        language: 'python',
        starterCode: `from collections.abc import Iterator

def batched(items: list[str], size: int) -> Iterator[list[str]]:
    ...


print(list(batched(list("abcdefghij"), 4)))`,
        solution: `from collections.abc import Iterator

def batched(items: list[str], size: int) -> Iterator[list[str]]:
    for i in range(0, len(items), size):
        yield items[i : i + size]`,
        hints: ['range(0, len, step)', 'Slicing end index can go past length safely'],
      },
      {
        type: 'exercise',
        title: 'Frequency map',
        description:
          'Build `char_frequency(text: str) -> dict[str, int]` lowercasing letters only (skip non-alpha). Use dict comp or a loop.',
        language: 'python',
        starterCode: `def char_frequency(text: str) -> dict[str, int]:
    ...
`,
        solution: `def char_frequency(text: str) -> dict[str, int]:
    freq: dict[str, int] = {}
    for ch in text.lower():
        if ch.isalpha():
            freq[ch] = freq.get(ch, 0) + 1
    return freq`,
        hints: ['str.isalpha()', 'dict.get for default 0'],
      },
    ],
  },
  {
    id: 'py-functions-deep',
    moduleId: 'python-backend',
    phaseId: 'py-core',
    phaseNumber: 1,
    order: 6,
    title: 'Functions: Arguments, Lambdas & Docstrings',
    description:
      'Define robust functions: defaults, `*args`, `**kwargs`, keyword-only parameters, annotations, and small lambdas for `sorted`/`map` patterns.',
    duration: '55 min',
    difficulty: 'intermediate',
    objectives: [
      'Avoid mutable default arguments',
      'Order parameters: pos-only, normal, *args, kw-only, **kwargs',
      'Write Google- or NumPy-style docstrings your team can parse',
      'Use `lambda` only for tiny throwaway hooks',
    ],
    content: [
      {
        type: 'text',
        markdown: `## Read function signatures like a professional

When you see production Python, decode names and punctuation:

| Piece | Professional name | Meaning |
|-------|-------------------|---------|
| \`host: str\` | Type annotation | Expected type (hint for humans/tools) |
| \`port: int = 5432\` | Default argument | Optional; 5432 if omitted |
| \`*\` alone in params | **Keyword-only separator** | Everything after must be passed by name |
| \`ssl: bool = True\` | Keyword-only parameter | Must write \`ssl=True\`, not a bare positional |
| \`-> str\` | Return annotation | Function returns a string |
| \`*args\` | Variable **positional** arguments | Extra positionals collected in a **tuple** |
| \`**kwargs\` | Variable **keyword** arguments | Extra keywords collected in a **dict** |
| \`def f(*, a, b)\` | All keyword-only | No positional args at all — every param named |

**Abbreviations in real code**

| Abbrev | Stands for | Example |
|--------|------------|---------|
| **ssl** | Secure Sockets Layer (TLS encryption) | \`ssl=True\` → encrypted connection |
| **tcp** | Transmission Control Protocol | \`port\` is usually TCP |
| **uri** / **url** | Resource locator string | \`postgres://host:5432\` |
| **db** | database | \`connect_db\` |
| **cfg** / **config** | configuration | \`load_cfg()\` |
| **ctx** | context | \`with ctx:\` |
| **msg** | message | \`log_msg\` |
| **req** / **resp** | request / response | HTTP handlers |
| **idx** | index | \`enumerate\` loop |
| **acc** | accumulator | list building up results |`,
      },
      {
        type: 'text',
        markdown: `## The bare \`*\` — keyword-only parameters

\`\`\`python
def connect(host: str, port: int = 5432, *, ssl: bool = True) -> str:
\`\`\`

| Parameter | Positional OK? | Keyword OK? |
|-----------|----------------|-------------|
| \`host\` | Yes | Yes |
| \`port\` | Yes | Yes |
| \`ssl\` | **No** | **Yes** (required name) |

**Valid calls:**

\`\`\`python
connect("localhost")
connect("localhost", 5432)
connect("localhost", ssl=False)
connect(host="localhost", port=5432, ssl=True)
\`\`\`

**Invalid — TypeError:**

\`\`\`python
connect("localhost", 5432, True)   # ssl cannot be positional
\`\`\`

**Why teams use this:** Boolean flags are easy to swap by accident. \`ssl=True\` is self-documenting.

### All parameters keyword-only

Put \`*\` first — nothing positional allowed:

\`\`\`python
def connect(*, host: str, port: int = 5432, ssl: bool = True) -> str:
    ...
\`\`\`

\`\`\`python
connect(host="localhost")              # OK
connect("localhost")                   # ERROR
\`\`\`

Same idea as \`print("hi", end="!", flush=True)\` — \`end\` and \`flush\` are keyword-only in the standard library.`,
      },
      {
        type: 'code',
        language: 'python',
        filename: 'connect.py',
        code: `def connect(host: str, port: int = 5432, *, ssl: bool = True) -> str:
    """Build an illustrative DB URI (not a real connection)."""
    scheme = "postgres+ssl" if ssl else "postgres"
    return f"{scheme}://{host}:{port}"

print(connect("db.internal", ssl=True))
# postgres+ssl://db.internal:5432

print(connect(host="localhost", port=5433, ssl=False))
# postgres://localhost:5433`,
        explanation: 'The function body is simple; the signature is what you memorize for interviews and code review.',
      },
      {
        type: 'text',
        markdown: `## \`*args\` and \`**kwargs\` — variadic functions

\`\`\`python
def flex(*args: int, **kwargs: str) -> None:
    print("positional tuple:", args)
    print("keyword mapping:", kwargs)
\`\`\`

| Call | \`args\` | \`kwargs\` |
|------|--------|----------|
| \`flex()\` | \`()\` | \`{}\` |
| \`flex(1, 2, 3)\` | \`(1, 2, 3)\` | \`{}\` |
| \`flex(x="hi")\` | \`()\` | \`{"x": "hi"}\` |
| \`flex(10, 20, name="Bob", country="CA")\` | \`(10, 20)\` | \`{"name": "Bob", "country": "CA"}\` |

**Rules:** positional arguments first, then keyword arguments. \`*args\` is a **tuple**; \`**kwargs\` is a **dict** (string keys).

**Professional terms:** *variadic function*, *argument tuple*, *keyword dictionary*. Used in decorators and wrappers:

\`\`\`python
def log_call(fn):
    def wrapper(*args, **kwargs):
        print("calling", fn.__name__)
        return fn(*args, **kwargs)
    return wrapper
\`\`\``,
      },
      {
        type: 'code',
        language: 'python',
        filename: 'flex_demo.py',
        code: `def flex(*args: int, **kwargs: str) -> None:
    print("positional tuple:", args)
    print("keyword mapping:", kwargs)

flex()
flex(1, 2, 3)
flex(x="hi")
flex(10, 20, name="Bob", country="Canada")`,
      },
      {
        type: 'text',
        markdown: `## Mutable default trap — \`acc=[]\`

\`\`\`python
def bad_acc(item, acc=[]):
    acc.append(item)
    return acc
\`\`\`

Defaults are created **once** when Python **defines** the function — not on each call. Every call shares the **same list object**:

\`\`\`python
bad_acc(1)   # [1]
bad_acc(2)   # [1, 2]  ← surprise!
bad_acc(3)   # [1, 2, 3]
\`\`\`

**Never use mutable defaults:** \`[]\`, \`{}\`, \`set()\`. **Safe defaults:** \`None\`, \`0\`, \`""\`, \`()\`.

### Fix: \`None\` + \`if acc is None:\`

\`\`\`python
def good_acc(item, acc=None):
    if acc is None:
        acc = []      # brand-new list THIS call
    acc.append(item)
    return acc
\`\`\`

**Why the \`if\`?** The default is \`None\`, not a list. You cannot call \`.append()\` on \`None\`. The \`if\` converts \`None\` → fresh \`[]\` before using it.

| Call | \`acc\` at start | Branch |
|------|------------------|--------|
| \`good_acc(1)\` | \`None\` | creates \`[]\`, returns \`[1]\` |
| \`good_acc(2)\` | \`None\` again | new \`[]\`, returns \`[2]\` |
| \`good_acc(3, [10])\` | \`[10]\` | skips \`if\`, returns \`[10, 3]\` |

Linters flag \`def f(x=[])\` as **mutable default argument** (e.g. flake8 B006).`,
      },
      {
        type: 'code',
        language: 'python',
        filename: 'mutable_default.py',
        code: `# BAD — shared list
def bad_acc(item, acc=[]):
    acc.append(item)
    return acc

print(bad_acc(1))  # [1]
print(bad_acc(2))  # [1, 2]  shared!

# GOOD — fresh list when needed
def good_acc(item, acc=None):
    if acc is None:
        acc = []
    acc.append(item)
    return acc

print(good_acc(1))  # [1]
print(good_acc(2))  # [2]`,
      },
      {
        type: 'text',
        markdown: `## Full parameter order (Python 3.8+)

\`\`\`python
def f(a, /, b, c=0, *args, d, **kwargs):
    ...
\`\`\`

| Section | Name |
|---------|------|
| Before \`/\` | Positional-only |
| \`b\`, \`c\` | Positional or keyword |
| \`*args\` | Extra positionals → tuple |
| \`d\` | Keyword-only (after bare \`*\`) |
| \`**kwargs\` | Extra keywords → dict |

Most application code only needs: normal params, \`*, flag=True\`, and occasionally \`*args\`/\`**kwargs\`.`,
      },
      {
        type: 'code',
        language: 'python',
        filename: 'lambda_examples.py',
        code: `# lambda — tiny one-expression functions only
pow2 = lambda x: x * x
print(pow2(4))  # 16

users = [{"name": "Zoe"}, {"name": "Ada"}]
sorted(users, key=lambda u: u["name"])  # by name`,
        explanation: 'Prefer a real `def` if the function needs more than one line or a docstring.',
      },
      {
        type: 'exercise',
        title: 'Safe paginator',
        description:
          '`paginate(skus: list[str], page: int = 1, per_page: int = 20) -> tuple[list[str], int]`: return slice of SKUs for that page and total page count (`math.ceil`). Clamp `page` to at least 1.',
        language: 'python',
        starterCode: `import math

def paginate(skus: list[str], page: int = 1, per_page: int = 20) -> tuple[list[str], int]:
    ...
`,
        solution: `import math

def paginate(skus: list[str], page: int = 1, per_page: int = 20) -> tuple[list[str], int]:
    page = max(1, page)
    start = (page - 1) * per_page
    batch = skus[start : start + per_page]
    total_pages = max(1, math.ceil(len(skus) / per_page)) if skus else 1
    return batch, total_pages`,
        hints: ['max(1, page)', 'Slice handles out-of-range end', 'Empty list still needs sensible total_pages — here 1'],
      },
      {
        type: 'exercise',
        title: 'Merge query dicts',
        description:
          'Function `merge_query(base: dict[str, str], overrides: dict[str, str]) -> dict[str, str]`: copy base, update with overrides, but do not allow empty-string values in the result (skip those keys).',
        language: 'python',
        starterCode: `def merge_query(base: dict[str, str], overrides: dict[str, str]) -> dict[str, str]:
    ...
`,
        solution: `def merge_query(base: dict[str, str], overrides: dict[str, str]) -> dict[str, str]:
    out = dict(base)
    for k, v in overrides.items():
        if v != "":
            out[k] = v
    return out`,
        hints: ['Shallow copy with dict(base)', 'Skip when value == ""'],
      },
    ],
  },
]
