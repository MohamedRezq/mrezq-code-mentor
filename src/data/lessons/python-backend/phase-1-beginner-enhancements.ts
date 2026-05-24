import type { ContentBlock, Lesson } from '@/types/lesson'

const phase1BeginnerBlocks: Record<string, string[]> = {
  'py-getting-started': [
    `## Beginner TL;DR

Python is a language where indentation matters. Start by running a tiny file, then read output in terminal.

\`\`\`python
print("Hello, world!")
\`\`\`

Output:
\`\`\`
Hello, world!
\`\`\``,
    `## Quick reference: print/input/variables

\`\`\`python
name = "Alice"
age = 24
print("Name:", name)
print("Age:", age)

# input always returns string
# city = input("City: ")
# print(city)
\`\`\`

Expected output:
\`\`\`
Name: Alice
Age: 24
\`\`\``,
  ],
  'py-types-and-strings': [
    `## Beginner TL;DR

Type = kind of value (\`int\`, \`str\`, \`bool\`). String methods create new strings, they do not modify original text in place.`,
    `## Quick reference: common string + casting operations

\`\`\`python
s = "  Python  "
print(s.strip())            # Python
print(s.lower())            #   python  
print("a,b,c".split(","))   # ['a', 'b', 'c']
print("-".join(["a", "b"])) # a-b

print(int("12") + 3)        # 15
print(float("2.5"))         # 2.5
print(str(99))              # 99
\`\`\``,
  ],
  'py-operators-truthiness': [
    `## Beginner TL;DR

\`==\` checks equal value. \`is\` checks same object. For \`None\`, always use \`is None\`.`,
    `## Quick reference: operators with outputs

\`\`\`python
print(7 // 3)           # 2
print(7 % 3)            # 1
print(2 ** 4)           # 16

print("" or "fallback") # fallback
print("ok" and 10)      # 10

x = None
print(x is None)        # True
\`\`\``,
  ],
  'py-control-flow': [
    `## Beginner TL;DR

Use \`if/elif/else\` for decisions. Use \`match/case\` when input has multiple structured shapes (like event payloads).`,
    `## Quick reference: if + match examples

\`\`\`python
score = 82
if score >= 90:
    print("A")
elif score >= 80:
    print("B")
else:
    print("C")

cmd = "ping"
match cmd:
    case "ping":
        print("pong")
    case _:
        print("noop")
\`\`\`

Expected output:
\`\`\`
B
pong
\`\`\``,
  ],
  'py-loops-iterations': [
    `## Beginner TL;DR

Use \`for\` when iterating a known sequence. Use \`while\` when repeating until a condition changes.`,
    `## Quick reference: loops + enumerate + zip

\`\`\`python
for i, name in enumerate(["ana", "bo"], start=1):
    print(i, name)

for a, b in zip([1, 2], ["x", "y"]):
    print(a, b)

n = 0
while n < 3:
    print("n=", n)
    n += 1
\`\`\``,
  ],
  'py-functions-deep': [
    `## Beginner TL;DR

Functions package reusable logic. Use parameters for input, \`return\` for output, and keep each function focused on one clear task.`,
    `## Quick reference: defaults, *args, **kwargs

\`\`\`python
def greet(name: str, loud: bool = False) -> str:
    msg = f"Hello {name}"
    return msg.upper() if loud else msg

def total(*nums: int) -> int:
    return sum(nums)

def show(**kwargs):
    print(kwargs)

print(greet("alice"))          # Hello alice
print(total(1, 2, 3))          # 6
show(role="admin", active=True) # {'role': 'admin', 'active': True}
\`\`\``,
  ],
  'py-modules-stdlib': [
    `## Beginner TL;DR

Modules split code into files. Import tools from Python standard library before adding external packages.`,
    `## Quick reference: imports, pathlib, urllib

\`\`\`python
from pathlib import Path
from urllib.parse import urlencode

p = Path("logs") / "app.txt"
print(p)  # logs/app.txt (slashes vary by OS)

qs = urlencode({"q": "python web", "page": "2"})
print(qs)  # q=python+web&page=2
\`\`\``,
  ],
  'py-collections-pro': [
    `## Beginner TL;DR

Pick by need:
- \`list\`: ordered items
- \`dict\`: key-value lookup
- \`set\`: unique values, fast membership
- \`tuple\`: fixed immutable record`,
    `## Lists reference (functions + examples + outputs)

\`\`\`python
nums = [3, 1, 4]

# append(x): add item at end
nums.append(1)
print(nums)                 # [3, 1, 4, 1]

# extend(iterable): add multiple items
nums.extend([5, 9])
print(nums)                 # [3, 1, 4, 1, 5, 9]

# insert(i, x): insert at index
nums.insert(1, 99)
print(nums)                 # [3, 99, 1, 4, 1, 5, 9]

# pop(): remove and return last item
last = nums.pop()
print(last)                 # 9
print(nums)                 # [3, 99, 1, 4, 1, 5]

# pop(i): remove item at index i
first = nums.pop(0)
print(first)                # 3
print(nums)                 # [99, 1, 4, 1, 5]

# remove(x): remove first matching value
nums.remove(1)
print(nums)                 # [99, 4, 1, 5]

# index(x): find first index of value
print(nums.index(4))        # 1

# count(x): count occurrences
print(nums.count(1))        # 1

# sort(): in-place ascending
nums.sort()
print(nums)                 # [1, 4, 5, 99]

# sort(reverse=True): descending
nums.sort(reverse=True)
print(nums)                 # [99, 5, 4, 1]

# reverse(): reverse current order in-place
nums.reverse()
print(nums)                 # [1, 4, 5, 99]

# copy(): shallow copy
nums2 = nums.copy()
print(nums2)                # [1, 4, 5, 99]
\`\`\`

Tip: \`append\`/ \`pop()\` at end are fast; \`insert(0, x)\` and \`pop(0)\` are slower on long lists.`,
    `## Dict reference (core operations + outputs)

\`\`\`python
user = {"name": "alice", "role": "admin"}

# get(key, default)
print(user.get("name"))             # alice
print(user.get("email", "n/a"))     # n/a

# keys / values / items
print(list(user.keys()))            # ['name', 'role']
print(list(user.values()))          # ['alice', 'admin']
print(list(user.items()))           # [('name', 'alice'), ('role', 'admin')]

# set/update values
user["role"] = "owner"
user.update({"active": True})
print(user)                         # {'name': 'alice', 'role': 'owner', 'active': True}

# setdefault(key, default)
user.setdefault("country", "EG")
print(user["country"])              # EG

# pop(key) / popitem()
removed = user.pop("active")
print(removed)                      # True
last_pair = user.popitem()
print(last_pair)                    # e.g. ('country', 'EG')

# copy()
clone = user.copy()
print(clone)                        # {'name': 'alice', 'role': 'owner'}
\`\`\``,
    `## Set reference (core operations + outputs)

\`\`\`python
tags = {"py", "api"}

# add / update
tags.add("web")
tags.update({"db", "ml"})
print(tags)                         # order may vary

# membership
print("py" in tags)                 # True
print("ops" in tags)                # False

# remove / discard
tags.remove("db")                   # raises KeyError if missing
tags.discard("missing")             # safe if missing

a = {1, 2, 3}
b = {3, 4, 5}
print(a | b)                        # union -> {1, 2, 3, 4, 5}
print(a & b)                        # intersection -> {3}
print(a - b)                        # difference -> {1, 2}
print(a ^ b)                        # symmetric diff -> {1, 2, 4, 5}

print({1, 2}.issubset({1, 2, 3}))   # True
print({1, 2, 3}.issuperset({2}))    # True
\`\`\``,
    `## Tuple reference (core operations + outputs)

\`\`\`python
point = (10, 20)

# indexing / slicing
print(point[0])                     # 10
print(point[-1])                    # 20
print(point[:1])                    # (10,)

# unpacking
x, y = point
print(x, y)                         # 10 20

# count / index
vals = (1, 2, 2, 3)
print(vals.count(2))                # 2
print(vals.index(3))                # 3

# immutability
# point[0] = 99   -> TypeError

# tuple as dict key (hashable if contents hashable)
locations = {("cairo", "eg"): 1}
print(locations[("cairo", "eg")])   # 1
\`\`\``,
  ],
  'py-exceptions-files': [
    `## Beginner TL;DR

Put risky code in \`try\`. Handle known errors in \`except\`. Use \`with open(...)\` so files close automatically.`,
    `## Quick reference: try/except and file modes

\`\`\`python
from pathlib import Path

path = Path("demo.txt")
path.write_text("hello\\n", encoding="utf-8")

try:
    text = path.read_text(encoding="utf-8")
    print(text.strip())            # hello
except FileNotFoundError:
    print("missing file")
\`\`\``,
  ],
  'py-json-datetime': [
    `## Beginner TL;DR

\`json.loads\` converts JSON text to Python objects. \`json.dumps\` converts Python objects to JSON text. Store datetime in UTC.`,
    `## Quick reference: JSON + datetime parse/format

\`\`\`python
import json
from datetime import datetime, timezone

obj = json.loads('{"id": 1, "ok": true}')
print(obj["id"])                   # 1

now = datetime.now(timezone.utc)
iso = now.isoformat()
print(iso)                         # 2026-...+00:00

parsed = datetime.fromisoformat(iso)
print(parsed.tzinfo is not None)   # True
\`\`\``,
  ],
  'py-regex': [
    `## Beginner TL;DR

Regex is pattern matching for text. Use raw strings (\`r"..."\`) and start simple with \`search\` or \`fullmatch\`.`,
    `## Quick reference: search/findall/sub

\`\`\`python
import re

print(bool(re.fullmatch(r"\\d+", "123")))    # True
print(re.findall(r"\\d+", "a1b22c333"))      # ['1', '22', '333']
print(re.sub(r"\\s+", "-", "hello   world")) # hello-world
\`\`\``,
  ],
  'py-oop-solid': [
    `## Beginner TL;DR

Class = blueprint for objects. Use dataclass for plain data containers; use normal class when behavior/state rules matter.`,
    `## Quick reference: class + dataclass

\`\`\`python
from dataclasses import dataclass

class Counter:
    def __init__(self) -> None:
        self.value = 0
    def inc(self) -> None:
        self.value += 1

@dataclass
class UserDTO:
    id: int
    email: str

c = Counter()
c.inc()
print(c.value)                  # 1
print(UserDTO(1, "a@b.com"))    # UserDTO(id=1, email='a@b.com')
\`\`\``,
  ],
  'py-patterns-advanced': [
    `## Beginner TL;DR

Generator (\`yield\`) gives values one-by-one. Decorator wraps function behavior. Context manager (\`with\`) handles setup/cleanup safely.`,
    `## Quick reference: yield/decorator/context manager

\`\`\`python
from contextlib import contextmanager

def gen():
    for i in range(3):
        yield i

def double(fn):
    def wrapper(x):
        return fn(x) * 2
    return wrapper

@double
def value(x):
    return x + 1

@contextmanager
def marker():
    print("begin")
    yield
    print("end")

print(list(gen()))   # [0, 1, 2]
print(value(3))      # 8
with marker():
    print("inside")
\`\`\``,
  ],
}

function toTextBlocks(markdowns: string[]): ContentBlock[] {
  return markdowns.map(markdown => ({ type: 'text', markdown }))
}

export function applyPhase1BeginnerEnhancements(lessons: Lesson[]): Lesson[] {
  return lessons.map(lesson => {
    const markdowns = phase1BeginnerBlocks[lesson.id]
    if (!markdowns) return lesson
    return {
      ...lesson,
      content: [...toTextBlocks(markdowns), ...lesson.content],
    }
  })
}
