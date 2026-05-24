import type { ContentBlock, Lesson } from '@/types/lesson'

const scenarioMarkdownByLessonId: Record<string, string> = {
  'py-getting-started': `## Real scenario: environment diagnostics script

You join a new team and need to confirm runtime consistency before debugging.

\`\`\`python
import sys
import platform

print("Python:", sys.version.split()[0])
print("OS:", platform.system())
print("Executable:", sys.executable)
\`\`\`

**Expected output (example):**
\`\`\`
Python: 3.12.7
OS: Windows
Executable: C:\\\\Python312\\\\python.exe
\`\`\``,
  'py-types-and-strings': `## Real scenario: normalize user signup payload

\`\`\`python
raw_name = "  aLiCe  "
raw_age = "29"
raw_newsletter = ""

name = raw_name.strip().title()
age = int(raw_age)
newsletter = bool(raw_newsletter)

print(name, age, newsletter)
\`\`\`

**Expected output:**
\`\`\`
Alice 29 False
\`\`\``,
  'py-operators-truthiness': `## Real scenario: API timeout fallback

\`\`\`python
def resolve_timeout(env_value: str | None) -> int:
    return int(env_value) if env_value and env_value.isdigit() else 30

print(resolve_timeout(None))
print(resolve_timeout(""))
print(resolve_timeout("45"))
\`\`\`

**Expected output:**
\`\`\`
30
30
45
\`\`\``,
  'py-control-flow': `## Real scenario: route incoming webhook events

\`\`\`python
def route(event: dict) -> str:
    match event:
        case {"type": "invoice.paid", "id": eid}:
            return f"record-payment:{eid}"
        case {"type": "invoice.failed", "id": eid}:
            return f"notify-failure:{eid}"
        case _:
            return "ignore"

print(route({"type": "invoice.paid", "id": "inv_1"}))
print(route({"type": "unknown"}))
\`\`\`

**Expected output:**
\`\`\`
record-payment:inv_1
ignore
\`\`\``,
  'py-loops-iterations': `## Real scenario: aggregate daily requests

\`\`\`python
requests = [120, 98, 140, 132]
total = 0
for n in requests:
    total += n

avg = total / len(requests)
print("total:", total)
print("avg:", round(avg, 2))
\`\`\`

**Expected output:**
\`\`\`
total: 490
avg: 122.5
\`\`\``,
  'py-functions-deep': `## Real scenario: build query options safely

\`\`\`python
def build_query(term: str, *, page: int = 1, limit: int = 20) -> dict[str, str]:
    return {"q": term, "page": str(page), "limit": str(limit)}

print(build_query("python"))
print(build_query("python", page=2, limit=50))
\`\`\`

**Expected output:**
\`\`\`
{'q': 'python', 'page': '1', 'limit': '20'}
{'q': 'python', 'page': '2', 'limit': '50'}
\`\`\``,
  'py-modules-stdlib': `## Real scenario: build tracking URL for analytics

\`\`\`python
from urllib.parse import urlencode

base = "https://app.example.com/learn"
qs = urlencode({"module": "python-backend", "lesson": "py-json-datetime"})
url = f"{base}?{qs}"
print(url)
\`\`\`

**Expected output:**
\`\`\`
https://app.example.com/learn?module=python-backend&lesson=py-json-datetime
\`\`\``,
  'py-collections-pro': `## Real scenario: count endpoint hits

\`\`\`python
from collections import Counter

hits = ["/login", "/learn", "/learn", "/api/chat", "/learn"]
counts = Counter(hits)
print(counts["/learn"])
print(counts.most_common(2))
\`\`\`

**Expected output:**
\`\`\`
3
[('/learn', 3), ('/login', 1)]
\`\`\``,
  'py-exceptions-files': `## Real scenario: robust config read with fallback

\`\`\`python
from pathlib import Path

def read_port(path: Path) -> int:
    try:
        return int(path.read_text(encoding="utf-8").strip())
    except FileNotFoundError:
        return 8000
    except ValueError:
        return 8000

print(read_port(Path("missing-port.txt")))
\`\`\`

**Expected output:**
\`\`\`
8000
\`\`\``,
  'py-json-datetime': `## Real scenario: schedule token expiry safely

\`\`\`python
from datetime import datetime, timezone, timedelta

issued_at = datetime.now(timezone.utc)
expires_at = issued_at + timedelta(minutes=15)

print("issued:", issued_at.isoformat())
print("expires:", expires_at.isoformat())
print("remaining_seconds:", int((expires_at - issued_at).total_seconds()))
\`\`\`

**Expected output (shape):**
\`\`\`
issued: 2026-...+00:00
expires: 2026-...+00:00
remaining_seconds: 900
\`\`\``,
  'py-regex': `## Real scenario: parse request log line

\`\`\`python
import re

line = "GET /api/progress status=200 latency_ms=18"
m = re.search(r"status=(\\d+)\\s+latency_ms=(\\d+)", line)
if m:
    status = int(m.group(1))
    latency = int(m.group(2))
    print(status, latency)
\`\`\`

**Expected output:**
\`\`\`
200 18
\`\`\``,
  'py-oop-solid': `## Real scenario: account domain model

\`\`\`python
class Account:
    def __init__(self, owner: str, balance_cents: int = 0) -> None:
        self.owner = owner
        self.balance_cents = balance_cents

    def deposit(self, cents: int) -> None:
        if cents <= 0:
            raise ValueError("deposit must be positive")
        self.balance_cents += cents

acc = Account("alice")
acc.deposit(2500)
print(acc.owner, acc.balance_cents)
\`\`\`

**Expected output:**
\`\`\`
alice 2500
\`\`\``,
  'py-patterns-advanced': `## Real scenario: timed operation decorator

\`\`\`python
import time

def timed(fn):
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = fn(*args, **kwargs)
        elapsed = time.perf_counter() - start
        print(fn.__name__, "took", round(elapsed, 4), "s")
        return result
    return wrapper

@timed
def compute():
    return sum(range(10000))

print(compute())
\`\`\`

**Expected output (shape):**
\`\`\`
compute took 0.00.. s
49995000
\`\`\``,
}

function asTextBlock(markdown: string): ContentBlock {
  return { type: 'text', markdown }
}

export function applyPhase1ScenarioEnhancements(lessons: Lesson[]): Lesson[] {
  return lessons.map(lesson => {
    const markdown = scenarioMarkdownByLessonId[lesson.id]
    if (!markdown) return lesson
    return {
      ...lesson,
      content: [...lesson.content, asTextBlock(markdown)],
    }
  })
}
