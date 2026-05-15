export interface CheatSheetSection {
  title: string
  body: string
  type?: 'pre' | 'list'
}

/** Dense reference — no long explanations; covers Module 09 end-to-end. */
export const PYTHON_FULLSTACK_CHEAT_SHEET: CheatSheetSection[] = [
  {
    title: 'Basics & types',
    type: 'pre',
    body: `# int float str bool None  list tuple set dict
x, y = 1, 2          # parallel assign
a, *mid, z = 1,2,3,4 # unpack
int("42")  float("3.14")  str(42)
type(x)  isinstance(x, str)
# truthy: non-zero, non-empty; falsy: None 0 "" [] {} set()`,
  },
  {
    title: 'Strings & numbers',
    type: 'pre',
    body: `s.strip().lower().upper().split(",").join("-")
s.startswith("x")  s.endswith("x")  s.replace("a","b")
f"{name} {n:.2f} {pct:.1%}"   # preferred formatting
ord("A")  chr(65)
# / true div  // floor  % mod  ** pow
divmod(7, 3)  # (2, 1)
round(3.14159, 2)`,
  },
  {
    title: 'Operators & short-circuit',
    type: 'list',
    body: `== value equality · is identity (use is None)
and / or return last evaluated operand, not bool
"" or "fallback"  → "fallback"
"ok" or "fallback" → "ok"
not x · in / not in · chained: 1 < x < 10
walrus: if (n := len(xs)) > 10:`,
  },
  {
    title: 'Control flow',
    type: 'pre',
    body: `if/elif/else · ternary: a if cond else b
for i in range(n): ...
for i, v in enumerate(xs): ...
while cond: ... else: ...  # else if no break
break · continue
match x:
    case {"id": int(i)}: ...
    case [a, b]: ...
    case _: ...`,
  },
  {
    title: 'Comprehensions & functions',
    type: 'pre',
    body: `[f(x) for x in xs if ok(x)]
{k: v for k, v in d.items()}
{x for x in xs}
def fn(a, b=0, *args, kw=1, **kwargs): ...
lambda x: x + 1
# NEVER: def bad(acc=[]): use acc=None
*args **kwargs · @functools.wraps · docstrings`,
  },
  {
    title: 'Collections',
    type: 'pre',
    body: `lst.append(x)  lst.extend(iter)  lst.pop()  lst[i]
d.get(k, default)  d.setdefault(k, [])  d | other  # merge 3.9+
s.add(x)  s.discard(x)  s1 & s2 | s1 - s2
from collections import Counter, defaultdict, deque
sorted(xs, key=fn, reverse=True)  reversed(xs)  zip(a,b)`,
  },
  {
    title: 'Modules & pathlib',
    type: 'pre',
    body: `import os, sys, json, re, asyncio
from pathlib import Path
p = Path(__file__).resolve().parent / "data.json"
p.read_text(encoding="utf-8")  p.write_text(s, encoding="utf-8")
if __name__ == "__main__": main()
__name__  __file__  dir(mod)  help(fn)`,
  },
  {
    title: 'Exceptions & files',
    type: 'pre',
    body: `try: ...
except ValueError as e: ...
except* ExceptionGroup: ...  # 3.11+
else: ...  # no exception
finally: ...
raise CustomError("msg") from e
with open(path, "r", encoding="utf-8") as f:
    for line in f: ...`,
  },
  {
    title: 'JSON & datetime',
    type: 'pre',
    body: `json.loads(s)  json.dumps(obj, indent=2, default=str)
from datetime import datetime, date, timedelta, timezone
now = datetime.now(timezone.utc)
dt.isoformat()  datetime.fromisoformat(s.replace("Z","+00:00"))
timedelta(days=1, hours=2)`,
  },
  {
    title: 'Regex',
    type: 'pre',
    body: `import re
re.search(r"\\d+", s)  re.match  re.findall  re.sub
re.compile(p).finditer(s)
# \\d \\w \\s  + * ?  {n,m}  () groups  (?P<name>)`,
  },
  {
    title: 'OOP & typing',
    type: 'pre',
    body: `@dataclass(slots=True, frozen=False)
class User: id: int; email: str
class Child(Parent): super().__init__()
@property · @classmethod · @staticmethod
from typing import Protocol, TypeVar, Generic
class HasId(Protocol): id: int
list[str]  dict[str, int]  X | None  # 3.10+`,
  },
  {
    title: 'Iterators, generators, decorators',
    type: 'pre',
    body: `iter(xs)  next(it)  yield in generator
@decorator
def f(): ...
from contextlib import contextmanager
with contextlib.suppress(ValueError): ...
from functools import lru_cache, partial`,
  },
  {
    title: 'DSA quick ref',
    type: 'list',
    body: `O(1) hash get · O(log n) binary search · O(n) scan
O(n log n) sort · O(n²) naive nested loops
stack: list append/pop end · queue: deque
heapq.heappush/pop · bisect.insort`,
  },
  {
    title: 'Tooling',
    type: 'list',
    body: `uv venv · .venv\\Scripts\\activate (Win)
pip install -r requirements.txt · poetry add
ruff check . && ruff format .
mypy . · pyright · pytest -q --cov
python -m pip install -e .`,
  },
  {
    title: 'HTTP scripts',
    type: 'pre',
    body: `import httpx, os
from dotenv import load_dotenv
load_dotenv()
r = httpx.get(url, params={}, headers={}, timeout=30.0)
r.raise_for_status()  r.json()`,
  },
  {
    title: 'asyncio',
    type: 'pre',
    body: `async def work(): await asyncio.sleep(0.1)
async with httpx.AsyncClient() as client:
    r = await client.get(url)
asyncio.run(main())
asyncio.gather(t1(), t2())`,
  },
  {
    title: 'Django',
    type: 'pre',
    body: `django-admin startproject cfg .
python manage.py startapp app
models.Model · Meta · ForeignKey · migrations
makemigrations · migrate
path("api/", include(router.urls))
View / ListView / APIView / ViewSet
AUTH_USER_MODEL before first migrate`,
  },
  {
    title: 'Flask',
    type: 'pre',
    body: `def create_app():
    app = Flask(__name__)
    @app.get("/health")
    def health(): return {"ok": True}
    return app
Blueprint · flask-sqlalchemy · flask-jwt-extended`,
  },
  {
    title: 'FastAPI',
    type: 'pre',
    body: `app = FastAPI()
@app.get("/items/{id}")
async def item(id: int, q: str | None = None): ...
class Item(BaseModel): name: str
Depends(get_db) · HTTPException(404)
APIRouter(prefix="/v1") · middleware`,
  },
  {
    title: 'SQLAlchemy & DB',
    type: 'pre',
    body: `select(Model).where(Model.id == id)
session.add(obj)  await session.commit()
alembic revision --autogenerate -m "msg"
alembic upgrade head
redis.set(key, val, ex=3600)`,
  },
  {
    title: 'Testing',
    type: 'pre',
    body: `def test_add(): assert add(1,2)==3
@pytest.fixture
def client(): ...
@pytest.mark.asyncio
async def test_api(): ...
TestClient(app)  monkeypatch  unittest.mock`,
  },
  {
    title: 'Production',
    type: 'list',
    body: `Dockerfile multi-stage · uvicorn app:app --host 0.0.0.0
Celery worker · Redis broker
structlog / logging JSON · OpenTelemetry traces
health /ready /live · 12-factor env config`,
  },
]
