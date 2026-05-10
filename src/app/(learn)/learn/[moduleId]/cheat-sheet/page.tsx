import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronRight } from 'lucide-react'
import { getModule } from '@/data/modules'
import { CheatSheetPrintBar } from '@/components/python/cheat-sheet-print-bar'

/** SeniorPath · Python cheat sheet — print-optimized (browser → Save as PDF). */
export default async function PythonCheatSheetPage({
  params,
}: {
  params: Promise<{ moduleId: string }>
}) {
  const { moduleId } = await params
  if (moduleId !== 'python-backend') notFound()

  const courseModule = getModule(moduleId)
  if (!courseModule) notFound()

  return (
    <div className="min-h-screen bg-background text-foreground">
      <CheatSheetPrintBar title="Python quick reference — SeniorPath" />

      <div className="max-w-3xl mx-auto px-6 py-10 print:max-w-none print:py-6 print:px-8">
        <header className="mb-8 print:mb-6 border-b border-border pb-6 print:pb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3 no-print">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href={`/learn/${moduleId}`} className="hover:text-foreground transition-colors">
              {courseModule.title}
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span>Cheat sheet</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight">Python 3 — cheat sheet</h1>
          <p className="text-sm text-muted-foreground mt-2">
            {courseModule.title} · condensed from module lessons · 3.11+ syntax (match, union types)
          </p>
        </header>

        <article className="space-y-10 text-sm leading-relaxed print:text-xs print:space-y-6">
          <section className="break-inside-avoid">
            <h2 className="text-lg font-bold border-b border-border mb-3 pb-1">Basics</h2>
            <pre className="bg-muted/50 border border-border rounded-lg p-4 overflow-x-auto font-mono text-xs print:p-3 whitespace-pre">
{`# Comments use #
name = "ada"                    # str
count = 3                       # int
price = 9.99                    # float
items = ["a", "b"]              # list
unique = {1, 2}                 # set
point = (10, 20)                # tuple
user = {"id": 1, "email": "x"}  # dict
flag = True                     # bool
missing = None                  # NoneType

x, y = y, x                     # swap
a, *rest, z = 1, 2, 3, 4        # unpacking`}
            </pre>
          </section>

          <section className="break-inside-avoid">
            <h2 className="text-lg font-bold border-b border-border mb-3 pb-1">Strings & formatting</h2>
            <pre className="bg-muted/50 border border-border rounded-lg p-4 overflow-x-auto font-mono text-xs print:p-3 whitespace-pre">
{`s.strip().lower().split(",")
s.startswith("https")
s.replace(" ", "-")

# f-strings (preferred)
f"{user['name']} — {n:.2f}"

# multiline
sql = """SELECT id FROM users WHERE active = true"""

# raw strings for regex
pattern = r"\\d+\\.\\d+"`}
            </pre>
          </section>

          <section className="break-inside-avoid">
            <h2 className="text-lg font-bold border-b border-border mb-3 pb-1">Operators & truthiness</h2>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              <li>
                <code className="text-foreground">==</code> value · <code className="text-foreground">is</code>{' '}
                identity (use <code className="text-foreground">is None</code>)
              </li>
              <li>
                <code className="text-foreground">and</code> / <code className="text-foreground">or</code> short-circuit;
                operands can be non-bool
              </li>
              <li>
                Falsy: <code className="text-foreground">None</code>, <code className="text-foreground">0</code>,{' '}
                <code className="text-foreground">&quot;&quot;</code>, empty <code className="text-foreground">[]</code>{' '}
                / <code className="text-foreground">&#123;&#125;</code> / <code className="text-foreground">set()</code>
              </li>
              <li>
                Walrus (limited): <code className="text-foreground">if (n := len(x)) &gt; 10:</code>
              </li>
            </ul>
          </section>

          <section className="break-inside-avoid">
            <h2 className="text-lg font-bold border-b border-border mb-3 pb-1">Control flow</h2>
            <pre className="bg-muted/50 border border-border rounded-lg p-4 overflow-x-auto font-mono text-xs print:p-3 whitespace-pre">
{`if cond:
    ...
elif other:
    ...
else:
    ...

label = "even" if n % 2 == 0 else "odd"

match value:
    case {"type": "user", "id": uid}:
        ...
    case _:
        ...

for i in range(5):
    ...

for i, v in enumerate(items):
    ...

while cond:
    ...
else:
    ...  # runs if no break`}
            </pre>
          </section>

          <section className="break-inside-avoid">
            <h2 className="text-lg font-bold border-b border-border mb-3 pb-1">Comprehensions & functions</h2>
            <pre className="bg-muted/50 border border-border rounded-lg p-4 overflow-x-auto font-mono text-xs print:p-3 whitespace-pre">
{`[x * x for x in range(10) if x % 2 == 0]
{x: len(x) for x in words}
{len(x) for x in words}

def fn(a: int, b: int = 0, *args: int, kw: int = 1, **kwargs: str) -> str: ...

lambda x: x + 1

# NEVER mutable default
def bad(acc=[]): ...

def good(acc: list | None = None):
    acc = acc or []`}
            </pre>
          </section>

          <section className="break-inside-avoid">
            <h2 className="text-lg font-bold border-b border-border mb-3 pb-1">Collections (quick)</h2>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              <li>
                <strong className="text-foreground">list</strong> — ordered, mutable; O(1) end, O(n) insert front
              </li>
              <li>
                <strong className="text-foreground">dict</strong> — key/value, insertion-ordered; O(1) avg get/set
              </li>
              <li>
                <strong className="text-foreground">set</strong> — unique; fast membership
              </li>
              <li>
                <strong className="text-foreground">tuple</strong> — immutable; hashable if contents hashable
              </li>
              <li>
                <code className="text-foreground">collections.Counter</code>,{' '}
                <code className="text-foreground">defaultdict</code>, <code className="text-foreground">deque</code>
              </li>
            </ul>
          </section>

          <section className="break-inside-avoid">
            <h2 className="text-lg font-bold border-b border-border mb-3 pb-1">Modules & paths</h2>
            <pre className="bg-muted/50 border border-border rounded-lg p-4 overflow-x-auto font-mono text-xs print:p-3 whitespace-pre">
{`from pathlib import Path
p = Path(__file__).resolve().parent / "data" / "a.json"
text = p.read_text(encoding="utf-8")
p.write_text("...", encoding="utf-8")

if __name__ == "__main__":
    main()

from urllib.parse import urlencode, urlparse, urlunparse`}
            </pre>
          </section>

          <section className="break-inside-avoid">
            <h2 className="text-lg font-bold border-b border-border mb-3 pb-1">Errors & files</h2>
            <pre className="bg-muted/50 border border-border rounded-lg p-4 overflow-x-auto font-mono text-xs print:p-3 whitespace-pre">
{`try:
    ...
except ValueError as e:
    ...
except Exception:
    ...
else:
    ...
finally:
    ...

raise CustomError("msg") from original

with path.open("r", encoding="utf-8") as f:
    for line in f:
        ...`}
            </pre>
          </section>

          <section className="break-inside-avoid">
            <h2 className="text-lg font-bold border-b border-border mb-3 pb-1">JSON & datetime</h2>
            <pre className="bg-muted/50 border border-border rounded-lg p-4 overflow-x-auto font-mono text-xs print:p-3 whitespace-pre">
{`import json
obj = json.loads(text)
text = json.dumps(obj, ensure_ascii=False, default=str)

from datetime import datetime, timezone, timedelta
now = datetime.now(timezone.utc)
iso = now.isoformat()
dt = datetime.fromisoformat(iso.replace("Z", "+00:00"))`}
            </pre>
          </section>

          <section className="break-inside-avoid">
            <h2 className="text-lg font-bold border-b border-border mb-3 pb-1">Regex</h2>
            <pre className="bg-muted/50 border border-border rounded-lg p-4 overflow-x-auto font-mono text-xs print:p-3 whitespace-pre">
{`import re
re.search(r"pattern", s)
re.findall(r"\\d+", s)
re.sub(r"old", "new", s)
re.compile(r"...")  # reuse`}
            </pre>
          </section>

          <section className="break-inside-avoid">
            <h2 className="text-lg font-bold border-b border-border mb-3 pb-1">OOP & typing</h2>
            <pre className="bg-muted/50 border border-border rounded-lg p-4 overflow-x-auto font-mono text-xs print:p-3 whitespace-pre">
{`from dataclasses import dataclass

@dataclass(slots=True)
class User:
    id: int
    email: str

from typing import Protocol

class HasId(Protocol):
    id: int

def show(x: HasId) -> int:
    return x.id`}
            </pre>
          </section>

          <section className="break-inside-avoid">
            <h2 className="text-lg font-bold border-b border-border mb-3 pb-1">Iterators & decorators</h2>
            <pre className="bg-muted/50 border border-border rounded-lg p-4 overflow-x-auto font-mono text-xs print:p-3 whitespace-pre">
{`def gen(n: int):
    for i in range(n):
        yield i

from functools import wraps

def logged(fn):
    @wraps(fn)
    def wrapper(*a, **kw):
        print(fn.__name__)
        return fn(*a, **kw)
    return wrapper

from contextlib import contextmanager

@contextmanager
def tx():
    print("begin")
    try:
        yield
    finally:
        print("end")`}
            </pre>
          </section>

          <section className="break-inside-avoid">
            <h2 className="text-lg font-bold border-b border-border mb-3 pb-1">Full-stack scripts</h2>
            <pre className="bg-muted/50 border border-border rounded-lg p-4 overflow-x-auto font-mono text-xs print:p-3 whitespace-pre">
{`import httpx
import os
from dotenv import load_dotenv

load_dotenv()
base = os.environ["API_URL"]
r = httpx.get(base + "/health", timeout=15.0)
r.raise_for_status()`}
            </pre>
          </section>

          <section className="break-inside-avoid">
            <h2 className="text-lg font-bold border-b border-border mb-3 pb-1">Tooling (2026 defaults)</h2>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              <li>
                Env: <code className="text-foreground">uv venv</code> or <code className="text-foreground">python -m venv .venv</code>
              </li>
              <li>
                Lint/format: <code className="text-foreground">ruff check . </code>·{' '}
                <code className="text-foreground">ruff format .</code>
              </li>
              <li>
                Types: <code className="text-foreground">mypy</code> or <code className="text-foreground">pyright</code>
              </li>
              <li>
                Tests: <code className="text-foreground">pytest -q</code>
              </li>
            </ul>
          </section>

          <p className="text-xs text-muted-foreground pt-6 border-t border-border no-print">
            Back to <Link href={`/learn/${moduleId}/py-cheat-sheet`}>lesson hub</Link> ·{' '}
            <Link href={`/learn/${moduleId}`}>module overview</Link>
          </p>
        </article>
      </div>

      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
        }
      `}</style>
    </div>
  )
}
