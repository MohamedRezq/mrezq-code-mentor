import type { Lesson } from '@/types/lesson'

export const pythonCoreLessons: Lesson[] = [
  // ─── Lesson 1: Syntax, Variables & Data Types ───────────────────────────
  {
    id: 'py-basics',
    moduleId: 'python-backend',
    phaseId: 'py-core',
    phaseNumber: 1,
    order: 1,
    title: 'Syntax, Variables & Data Types',
    description: 'Learn Python\'s syntax rules, how variables work, every built-in data type, type casting, and f-strings — the foundation everything else builds on.',
    duration: '45 min',
    difficulty: 'beginner',
    objectives: [
      'Understand Python\'s indentation-based syntax and code blocks',
      'Declare and use variables with dynamic typing',
      'Know every built-in type: int, float, str, bool, bytes, None',
      'Cast between types safely and understand when casting fails',
      'Format strings with f-strings and understand string operations',
    ],
    content: [
      {
        type: 'text',
        markdown: `## Python Syntax: The Rules

Python uses **indentation** (spaces/tabs) to define code blocks — not curly braces. 4 spaces per level is the universal standard.

\`\`\`python
# This is a comment
if True:
    print("inside block")  # 4-space indent
    print("still inside")
print("outside block")     # back to column 0
\`\`\`

Python executes top-to-bottom. Statements don't need semicolons. A **colon** (\`:\`) always starts a new block.`,
      },
      {
        type: 'code',
        language: 'python',
        filename: 'variables.py',
        code: `# Variables — no declaration keyword needed
name = "Alice"          # str
age = 30                # int
height = 1.75           # float
is_active = True        # bool
score = None            # NoneType (absence of value)

# Python is dynamically typed — the variable holds a reference
x = 10
x = "hello"  # perfectly legal — x now points to a str

# Type annotations (optional but recommended)
user_id: int = 42
username: str = "bob"

# Check the type at runtime
print(type(name))       # <class 'str'>
print(type(age))        # <class 'int'>
print(isinstance(age, int))  # True`,
        explanation: 'Variables are just names bound to objects. The type lives on the object, not the variable.',
      },
      {
        type: 'text',
        markdown: `## Every Built-in Type

| Type | Example | Notes |
|------|---------|-------|
| \`int\` | \`42\`, \`-7\`, \`0\` | Unlimited precision |
| \`float\` | \`3.14\`, \`-0.5\` | 64-bit IEEE 754 |
| \`complex\` | \`2+3j\` | Real + imaginary |
| \`str\` | \`"hello"\` | Immutable sequence of chars |
| \`bool\` | \`True\`, \`False\` | Subclass of int (True==1) |
| \`bytes\` | \`b"data"\` | Immutable byte sequence |
| \`NoneType\` | \`None\` | Singleton — represents "nothing" |`,
      },
      {
        type: 'code',
        language: 'python',
        filename: 'type_casting.py',
        code: `# Type casting — explicit conversion between types
x = "42"
n = int(x)          # "42" → 42
f = float(x)        # "42" → 42.0
b = bool(0)         # 0 → False  (0, "", None, [], {} are all falsy)
s = str(100)        # 100 → "100"

# Casting can fail — always handle it
user_input = "abc"
try:
    value = int(user_input)
except ValueError as e:
    print(f"Cannot convert: {e}")

# Numeric conversions
print(int(3.9))     # 3  (truncates, does NOT round)
print(round(3.9))   # 4  (rounds)
print(float(5))     # 5.0

# Truthiness — what evaluates to False
falsy = [0, 0.0, "", [], {}, set(), None, False]
for val in falsy:
    print(f"{repr(val):10} → {bool(val)}")`,
      },
      {
        type: 'code',
        language: 'python',
        filename: 'strings.py',
        code: `# Strings — immutable sequences of Unicode characters
greeting = "Hello, World!"

# Indexing and slicing
print(greeting[0])      # H
print(greeting[-1])     # !
print(greeting[0:5])    # Hello
print(greeting[::2])    # Hlo ol!  (every 2nd char)

# Common methods
print("  hello  ".strip())         # "hello"
print("hello".upper())             # "HELLO"
print("Hello World".split())       # ["Hello", "World"]
print(",".join(["a", "b", "c"]))   # "a,b,c"
print("hello".replace("l", "r"))   # "herro"
print("hello world".startswith("hello"))  # True
print("hello".count("l"))          # 2

# f-strings (Python 3.6+) — the preferred way to format
name = "Alice"
age = 30
score = 98.5

print(f"Name: {name}, Age: {age}")
print(f"Score: {score:.1f}%")           # 1 decimal place
print(f"{'left':<10}|{'right':>10}")    # alignment
print(f"{1_000_000:,}")                 # 1,000,000 (readable numbers)
print(f"{42:08b}")                      # 00101010 (binary)

# Multi-line strings
sql = """
    SELECT *
    FROM users
    WHERE active = true
"""`,
      },
      {
        type: 'callout',
        tone: 'tip',
        title: 'Single vs Double Quotes',
        content: 'Python treats them identically. Convention: use double quotes for strings that contain text, single quotes for short strings like dict keys or SQL. Be consistent within a project.',
      },
      {
        type: 'exercise',
        title: 'Type Inspector',
        description: 'Write a function `describe(value)` that returns a string describing any value: its type name, its truthiness (truthy/falsy), and for numbers, whether it\'s positive/negative/zero.',
        language: 'python',
        starterCode: `def describe(value) -> str:
    # Your implementation here
    pass

# Expected output examples:
# describe(42)      → "int, truthy, positive"
# describe(-3.5)    → "float, truthy, negative"
# describe(0)       → "int, falsy, zero"
# describe("")      → "str, falsy"
# describe("hello") → "str, truthy"
# describe(None)    → "NoneType, falsy"`,
        solution: `def describe(value) -> str:
    type_name = type(value).__name__
    truthiness = "truthy" if value else "falsy"
    parts = [type_name, truthiness]
    if isinstance(value, (int, float)) and not isinstance(value, bool):
        if value > 0:
            parts.append("positive")
        elif value < 0:
            parts.append("negative")
        else:
            parts.append("zero")
    return ", ".join(parts)`,
        hints: ['Use type(value).__name__ to get the type name as a string', 'isinstance(value, bool) is needed because bool is a subclass of int', 'Join the parts list with ", " at the end'],
      },
    ],
  },

  // ─── Lesson 2: Control Flow & Exceptions ────────────────────────────────
  {
    id: 'py-control-flow',
    moduleId: 'python-backend',
    phaseId: 'py-core',
    phaseNumber: 1,
    order: 2,
    title: 'Control Flow & Exceptions',
    description: 'Master if/elif/else, every loop pattern, loop control with break/continue/else, and professional exception handling that actually communicates errors.',
    duration: '40 min',
    difficulty: 'beginner',
    objectives: [
      'Write conditional logic with if/elif/else and ternary expressions',
      'Use for loops with any iterable, and while loops for condition-based repetition',
      'Control loop flow with break, continue, and the loop else clause',
      'Raise, catch, and chain exceptions correctly',
      'Create custom exceptions that carry useful context',
    ],
    content: [
      {
        type: 'code',
        language: 'python',
        filename: 'conditionals.py',
        code: `# if / elif / else
score = 85

if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
elif score >= 70:
    grade = "C"
else:
    grade = "F"

# Ternary (one-liner)
status = "pass" if score >= 60 else "fail"

# Chained comparisons (Pythonic, not available in most languages)
x = 5
if 0 < x < 10:
    print("single digit positive")

# Walrus operator := (Python 3.8+) — assign AND test in one expression
import re
text = "Order #12345 confirmed"
if match := re.search(r"#(\d+)", text):
    print(f"Order ID: {match.group(1)}")  # "12345"

# match statement (Python 3.10+) — structural pattern matching
command = ("move", 10, 20)
match command:
    case ("move", x, y):
        print(f"Moving to {x}, {y}")
    case ("quit",):
        print("Quitting")
    case _:
        print("Unknown command")`,
      },
      {
        type: 'code',
        language: 'python',
        filename: 'loops.py',
        code: `# for loop — iterates over any iterable
fruits = ["apple", "banana", "cherry"]

for fruit in fruits:
    print(fruit)

# enumerate — get index AND value together
for i, fruit in enumerate(fruits, start=1):
    print(f"{i}. {fruit}")

# range — generates numbers on demand (memory efficient)
for n in range(0, 10, 2):   # 0, 2, 4, 6, 8
    print(n)

# zip — iterate multiple iterables in parallel
names = ["Alice", "Bob"]
scores = [92, 78]
for name, score in zip(names, scores):
    print(f"{name}: {score}")

# while loop — runs while condition is True
count = 0
while count < 5:
    print(count)
    count += 1

# break — exit loop immediately
for n in range(100):
    if n == 5:
        break       # exits when n reaches 5

# continue — skip to next iteration
for n in range(10):
    if n % 2 == 0:
        continue    # skip even numbers
    print(n)        # prints 1, 3, 5, 7, 9

# Loop else — runs if loop completed WITHOUT hitting break
for n in range(2, 10):
    for factor in range(2, n):
        if n % factor == 0:
            break
    else:
        print(f"{n} is prime")  # only prints when no break hit`,
      },
      {
        type: 'text',
        markdown: `## Exception Handling

Exceptions are objects. They form a hierarchy — catching \`Exception\` catches almost everything; catching \`BaseException\` also catches \`KeyboardInterrupt\` and \`SystemExit\` (avoid that).

**Common built-in exceptions:**
| Exception | When it occurs |
|-----------|---------------|
| \`ValueError\` | Right type, wrong value (\`int("abc")\`) |
| \`TypeError\` | Wrong type for operation (\`"a" + 1\`) |
| \`KeyError\` | Dict key doesn't exist |
| \`IndexError\` | List index out of range |
| \`AttributeError\` | Object doesn't have that attribute |
| \`FileNotFoundError\` | File path doesn't exist |
| \`ZeroDivisionError\` | Dividing by zero |`,
      },
      {
        type: 'code',
        language: 'python',
        filename: 'exceptions.py',
        code: `# Basic try/except/else/finally
def read_number(text: str) -> int:
    try:
        return int(text)
    except ValueError:
        print(f"'{text}' is not a number")
        return 0

# Catch multiple exception types
def safe_divide(a, b):
    try:
        return a / b
    except (TypeError, ZeroDivisionError) as e:
        print(f"Cannot divide: {e}")
        return None

# else — runs if NO exception occurred
# finally — ALWAYS runs (cleanup code)
def process_file(path: str):
    f = None
    try:
        f = open(path)
        data = f.read()
    except FileNotFoundError:
        print(f"File not found: {path}")
        return None
    else:
        print("File read successfully")
        return data
    finally:
        if f:
            f.close()  # always closes, even if exception occurred

# Custom exceptions — carry context
class InsufficientFundsError(Exception):
    def __init__(self, balance: float, amount: float):
        self.balance = balance
        self.amount = amount
        super().__init__(
            f"Cannot withdraw {amount:.2f}: balance is only {balance:.2f}"
        )

class BankAccount:
    def __init__(self, balance: float):
        self.balance = balance

    def withdraw(self, amount: float) -> None:
        if amount > self.balance:
            raise InsufficientFundsError(self.balance, amount)
        self.balance -= amount

# Exception chaining — preserve the original cause
def fetch_user(user_id: int):
    try:
        data = {"1": "Alice"}[str(user_id)]
        return data
    except KeyError as e:
        raise ValueError(f"User {user_id} not found") from e
        # The original KeyError is preserved in __cause__`,
      },
      {
        type: 'callout',
        tone: 'production',
        title: 'Exception Design in APIs',
        content: 'In production code: be specific (catch `ValueError`, not bare `Exception`), always add context when re-raising (`raise X from original`), use custom exceptions for domain errors (not strings), and log the traceback at the boundary where it\'s caught — not everywhere.',
      },
      {
        type: 'exercise',
        title: 'Safe Data Parser',
        description: 'Write a function `parse_config(data: dict) -> dict` that validates a config dict. It must have "host" (str), "port" (int, 1–65535), and optionally "timeout" (float, default 30.0). Raise a descriptive ValueError for any invalid field.',
        language: 'python',
        starterCode: `def parse_config(data: dict) -> dict:
    """
    Returns: {"host": str, "port": int, "timeout": float}
    Raises: ValueError with a clear message for any invalid input
    """
    pass

# Tests
print(parse_config({"host": "localhost", "port": 8080}))
# → {"host": "localhost", "port": 8080, "timeout": 30.0}

print(parse_config({"host": "example.com", "port": 99999}))
# → ValueError: port must be between 1 and 65535, got 99999`,
        solution: `def parse_config(data: dict) -> dict:
    if "host" not in data:
        raise ValueError("Missing required field: host")
    if not isinstance(data["host"], str) or not data["host"]:
        raise ValueError("host must be a non-empty string")

    if "port" not in data:
        raise ValueError("Missing required field: port")
    try:
        port = int(data["port"])
    except (TypeError, ValueError):
        raise ValueError(f"port must be an integer, got {type(data['port']).__name__}")
    if not 1 <= port <= 65535:
        raise ValueError(f"port must be between 1 and 65535, got {port}")

    timeout = data.get("timeout", 30.0)
    try:
        timeout = float(timeout)
    except (TypeError, ValueError):
        raise ValueError(f"timeout must be a number, got {type(data['timeout']).__name__}")
    if timeout <= 0:
        raise ValueError(f"timeout must be positive, got {timeout}")

    return {"host": data["host"], "port": port, "timeout": timeout}`,
        hints: ['Check for missing keys with "in" operator before accessing them', 'Use data.get("timeout", 30.0) for optional fields', 'Wrap int()/float() conversions in try/except'],
      },
    ],
  },

  // ─── Lesson 3: Functions, Builtins & Lambdas ────────────────────────────
  {
    id: 'py-functions',
    moduleId: 'python-backend',
    phaseId: 'py-core',
    phaseNumber: 1,
    order: 3,
    title: 'Functions, Builtins & Lambdas',
    description: 'Write expressive functions with default args, *args/**kwargs, keyword-only parameters, and closures. Master Python\'s built-in functions and use lambdas where appropriate.',
    duration: '45 min',
    difficulty: 'beginner',
    objectives: [
      'Define functions with all parameter types: positional, default, *args, **kwargs, keyword-only',
      'Understand scope: local, enclosing, global, built-in (LEGB)',
      'Write closures and understand what they capture',
      'Use key built-in functions: map, filter, sorted, zip, enumerate, any, all, min, max',
      'Use lambda functions appropriately (and know when NOT to)',
    ],
    content: [
      {
        type: 'code',
        language: 'python',
        filename: 'functions.py',
        code: `# Basic function — docstring is standard practice
def greet(name: str, greeting: str = "Hello") -> str:
    """Return a greeting string for the given name."""
    return f"{greeting}, {name}!"

print(greet("Alice"))             # "Hello, Alice!"
print(greet("Bob", "Hi"))         # "Hi, Bob!"
print(greet(greeting="Hey", name="Carol"))  # keyword args

# *args — variable number of positional arguments (tuple)
def total(*amounts: float) -> float:
    return sum(amounts)

print(total(10, 20, 30))   # 60.0
print(total(5))             # 5.0

# **kwargs — variable number of keyword arguments (dict)
def create_user(name: str, **profile) -> dict:
    return {"name": name, **profile}

user = create_user("Alice", age=30, city="NYC", role="admin")
# {"name": "Alice", "age": 30, "city": "NYC", "role": "admin"}

# Keyword-only parameters (after *)
def connect(host: str, port: int, *, timeout: float = 30.0, ssl: bool = True):
    """timeout and ssl MUST be passed as keyword arguments."""
    return f"{host}:{port} (timeout={timeout}, ssl={ssl})"

connect("localhost", 5432, timeout=60.0)  # works
# connect("localhost", 5432, 60.0)  # TypeError — timeout is keyword-only

# Unpacking when calling
args = ("localhost", 5432)
kwargs = {"timeout": 60.0}
connect(*args, **kwargs)  # same as connect("localhost", 5432, timeout=60.0)`,
      },
      {
        type: 'code',
        language: 'python',
        filename: 'closures.py',
        code: `# Closures — inner function captures variables from outer scope
def make_multiplier(factor: int):
    def multiply(n: int) -> int:
        return n * factor   # 'factor' is captured from outer scope
    return multiply

double = make_multiplier(2)
triple = make_multiplier(3)
print(double(5))   # 10
print(triple(5))   # 15

# Practical closure: a configurable logger prefix
def make_logger(prefix: str):
    def log(message: str) -> None:
        print(f"[{prefix}] {message}")
    return log

api_log = make_logger("API")
db_log = make_logger("DB")
api_log("Request received")    # [API] Request received
db_log("Query executed")       # [DB] Query executed

# LEGB rule — Python looks up names in this order:
# Local → Enclosing → Global → Built-in
x = "global"

def outer():
    x = "enclosing"
    def inner():
        x = "local"
        print(x)  # "local"
    inner()
    print(x)  # "enclosing"

outer()
print(x)  # "global"`,
      },
      {
        type: 'code',
        language: 'python',
        filename: 'builtins_and_lambdas.py',
        code: `users = [
    {"name": "Alice", "age": 30, "score": 92},
    {"name": "Bob",   "age": 25, "score": 78},
    {"name": "Carol", "age": 35, "score": 85},
]

# sorted — returns a new sorted list (does not modify original)
by_score = sorted(users, key=lambda u: u["score"], reverse=True)
by_age   = sorted(users, key=lambda u: u["age"])

# min / max with a key function
youngest = min(users, key=lambda u: u["age"])   # Bob
top      = max(users, key=lambda u: u["score"]) # Alice

# map — apply a function to every item, returns an iterator
names = list(map(lambda u: u["name"], users))   # ["Alice", "Bob", "Carol"]

# filter — keep items where function returns True
adults = list(filter(lambda u: u["age"] >= 30, users))

# any / all — test conditions across a collection
has_expert = any(u["score"] >= 90 for u in users)  # True
all_adults = all(u["age"] >= 18 for u in users)     # True

# zip — combine iterables element-by-element
keys = ["name", "age"]
vals = ["Alice", 30]
record = dict(zip(keys, vals))  # {"name": "Alice", "age": 30}

# enumerate — (index, value) pairs
for i, user in enumerate(users, start=1):
    print(f"{i}. {user['name']}")

# sum / len / abs / round / divmod
print(sum(u["score"] for u in users) / len(users))  # average score
print(divmod(17, 5))   # (3, 2) — quotient and remainder`,
        explanation: 'Lambda functions are anonymous single-expression functions. Use them only for short transformations passed to map/sorted/filter. If the logic is more than one expression, write a named function.',
      },
      {
        type: 'callout',
        tone: 'tip',
        title: 'List comprehension vs map/filter',
        content: 'Prefer list comprehensions over map/filter for readability. `[u["name"] for u in users]` is clearer than `list(map(lambda u: u["name"], users))`. Use map/filter when working with existing named functions.',
      },
      {
        type: 'exercise',
        title: 'Pipeline Builder',
        description: 'Write a function `pipeline(*fns)` that returns a new function applying each function in sequence. Then write `compose(*fns)` that applies them in reverse order (right to left, like math).',
        language: 'python',
        starterCode: `from typing import Callable, TypeVar

T = TypeVar("T")

def pipeline(*fns: Callable) -> Callable:
    """Apply fns left to right: pipeline(f, g, h)(x) == h(g(f(x)))"""
    pass

def compose(*fns: Callable) -> Callable:
    """Apply fns right to left: compose(f, g, h)(x) == f(g(h(x)))"""
    pass

# Test
double = lambda x: x * 2
add_one = lambda x: x + 1
square = lambda x: x ** 2

process = pipeline(double, add_one, square)
print(process(3))  # ((3*2)+1)^2 = 49`,
        solution: `from typing import Callable

def pipeline(*fns: Callable) -> Callable:
    def apply(value):
        for fn in fns:
            value = fn(value)
        return value
    return apply

def compose(*fns: Callable) -> Callable:
    return pipeline(*reversed(fns))`,
        hints: ['pipeline reduces with each function applied left to right', 'compose is just pipeline with fns reversed', 'Use a simple for loop inside the inner function'],
      },
    ],
  },

  // ─── Lesson 4: Collections — Lists, Tuples, Sets, Dicts ─────────────────
  {
    id: 'py-collections',
    moduleId: 'python-backend',
    phaseId: 'py-core',
    phaseNumber: 1,
    order: 4,
    title: 'Collections: Lists, Tuples, Sets & Dicts',
    description: 'Deep-dive into Python\'s four core data structures — when to use each, how they work internally, comprehensions, and common patterns from real codebases.',
    duration: '50 min',
    difficulty: 'beginner',
    objectives: [
      'Use lists as dynamic arrays and know their O(n) vs O(1) operations',
      'Use tuples for immutable sequences and named tuples for clarity',
      'Use sets for O(1) membership testing and set operations',
      'Use dicts for key-value storage and understand hash-based lookup',
      'Write list, dict, and set comprehensions fluently',
    ],
    content: [
      {
        type: 'code',
        language: 'python',
        filename: 'lists.py',
        code: `# Lists — ordered, mutable, allow duplicates, O(1) index access
numbers = [3, 1, 4, 1, 5, 9, 2, 6]

# Core operations
numbers.append(7)          # add to end — O(1)
numbers.insert(0, 0)       # insert at index — O(n)
numbers.pop()              # remove & return last — O(1)
numbers.pop(0)             # remove & return at index — O(n)
numbers.remove(1)          # remove first occurrence — O(n)

# Slicing — creates a new list (does not modify original)
first_three = numbers[:3]
reversed_copy = numbers[::-1]
every_other = numbers[::2]

# Sorting
numbers.sort()                          # in-place, stable
numbers.sort(reverse=True)
sorted_copy = sorted(numbers)           # new list, original unchanged

# Stack (LIFO): use append() + pop()
stack = []
stack.append("first")
stack.append("second")
stack.pop()    # "second"

# Queue (FIFO): use collections.deque (not a list — O(1) both ends)
from collections import deque
queue = deque()
queue.append("first")
queue.append("second")
queue.popleft()    # "first" — O(1)

# List comprehension — concise and fast
squares = [x**2 for x in range(10)]
evens   = [x for x in range(20) if x % 2 == 0]
matrix  = [[i*j for j in range(1, 4)] for i in range(1, 4)]
flat    = [x for row in matrix for x in row]  # flatten`,
      },
      {
        type: 'code',
        language: 'python',
        filename: 'tuples_sets.py',
        code: `# Tuples — ordered, immutable, allow duplicates, hashable
point = (3, 4)
rgb = (255, 128, 0)

# Tuple unpacking
x, y = point
r, g, b = rgb
first, *rest = [1, 2, 3, 4, 5]   # first=1, rest=[2,3,4,5]

# Named tuples — tuples with field names (readable, no overhead)
from collections import namedtuple
Point = namedtuple("Point", ["x", "y"])
p = Point(3, 4)
print(p.x, p.y)    # 3, 4
print(p[0])        # 3 (still indexable)

# When to use tuple vs list:
# - tuple: coordinates, RGB, database rows, dict keys (tuples are hashable)
# - list: items that will change, order-dependent sequences

# ─── Sets ───────────────────────────────────────────────
# Sets — unordered, mutable, NO duplicates, O(1) lookup
tags = {"python", "backend", "api"}
tags.add("docker")
tags.discard("missing")   # safe remove — no error if not present

# Membership testing — O(1) vs O(n) for lists
big_list = list(range(1_000_000))
big_set = set(big_list)

import timeit
# list: linear scan   set: hash lookup
# set is ~100x faster for "in" checks on large collections

# Set operations
a = {1, 2, 3, 4}
b = {3, 4, 5, 6}
print(a | b)   # union       {1, 2, 3, 4, 5, 6}
print(a & b)   # intersection {3, 4}
print(a - b)   # difference  {1, 2}
print(a ^ b)   # symmetric difference {1, 2, 5, 6}

# Deduplicate a list (order NOT preserved)
dupes = [3, 1, 4, 1, 5, 9, 2, 6, 5]
unique = list(set(dupes))

# Set comprehension
unique_lengths = {len(word) for word in ["hello", "world", "hi", "hey"]}`,
      },
      {
        type: 'code',
        language: 'python',
        filename: 'dicts.py',
        code: `# Dicts — key→value mapping, ordered (insertion order, Python 3.7+), O(1) lookup
user = {
    "id": 1,
    "name": "Alice",
    "email": "alice@example.com",
    "roles": ["admin", "user"],
}

# Access
print(user["name"])                   # KeyError if missing
print(user.get("phone", "N/A"))       # safe — returns default if missing

# Modify
user["age"] = 30                      # add or update
user.update({"city": "NYC", "age": 31})  # merge multiple keys

# Remove
del user["age"]                       # KeyError if missing
removed = user.pop("city", None)      # safe — returns default if missing

# Iteration
for key in user:                      # iterates keys
    print(key, user[key])
for key, val in user.items():         # iterates (key, value) pairs
    print(f"{key}: {val}")
keys = list(user.keys())
vals = list(user.values())

# Dict comprehension
squared = {x: x**2 for x in range(5)}          # {0:0, 1:1, 2:4, 3:9, 4:16}
filtered = {k: v for k, v in user.items() if k != "email"}

# Merging dicts (Python 3.9+)
defaults = {"timeout": 30, "retries": 3}
config = {"host": "localhost", "timeout": 60}
merged = defaults | config   # config values win: {"timeout": 60, "retries": 3, "host": "localhost"}

# defaultdict — auto-creates missing keys
from collections import defaultdict
word_count: defaultdict[str, int] = defaultdict(int)
for word in "the cat sat on the mat".split():
    word_count[word] += 1   # no KeyError on first access

# Counter — count hashable items
from collections import Counter
counts = Counter("abracadabra")  # Counter({'a': 5, 'b': 2, 'r': 2, 'c': 1, 'd': 1})
most_common = counts.most_common(3)`,
      },
      {
        type: 'exercise',
        title: 'Student Grade Analyzer',
        description: 'Given a list of student dicts with `name` and `scores` (a list of ints), write `analyze(students)` that returns a dict with: `top_student` (name with highest average), `class_average` (float), `grade_distribution` (dict mapping "A"/"B"/"C"/"F" to count of students), and `unique_score_count` (how many distinct scores exist across all students).',
        language: 'python',
        starterCode: `def analyze(students: list[dict]) -> dict:
    pass

students = [
    {"name": "Alice", "scores": [95, 88, 92]},
    {"name": "Bob",   "scores": [72, 68, 75]},
    {"name": "Carol", "scores": [85, 90, 88]},
    {"name": "Dave",  "scores": [60, 55, 58]},
]

result = analyze(students)
print(result["top_student"])        # "Alice"
print(result["class_average"])      # ~77.3
print(result["grade_distribution"]) # {"A": 1, "B": 2, "F": 1} (C:0 omitted or 0)
print(result["unique_score_count"]) # 11 (all distinct values)`,
        solution: `def analyze(students: list[dict]) -> dict:
    def letter_grade(avg: float) -> str:
        if avg >= 90: return "A"
        if avg >= 80: return "B"
        if avg >= 70: return "C"
        return "F"

    averages = {s["name"]: sum(s["scores"]) / len(s["scores"]) for s in students}
    top_student = max(averages, key=averages.get)
    class_average = sum(averages.values()) / len(averages)

    grade_dist: dict[str, int] = {}
    for avg in averages.values():
        g = letter_grade(avg)
        grade_dist[g] = grade_dist.get(g, 0) + 1

    all_scores = {score for s in students for score in s["scores"]}

    return {
        "top_student": top_student,
        "class_average": round(class_average, 1),
        "grade_distribution": grade_dist,
        "unique_score_count": len(all_scores),
    }`,
        hints: ['Use a dict comprehension to compute per-student averages', 'max() with a key function finds the top student', 'Use a set comprehension to collect all unique scores'],
      },
    ],
  },

  // ─── Lesson 5: Object-Oriented Programming ──────────────────────────────
  {
    id: 'py-oop',
    moduleId: 'python-backend',
    phaseId: 'py-core',
    phaseNumber: 1,
    order: 5,
    title: 'Object-Oriented Programming',
    description: 'Classes, inheritance, dunder methods, properties, class methods, and static methods — OOP as Python professionals actually use it.',
    duration: '55 min',
    difficulty: 'intermediate',
    objectives: [
      'Define classes with __init__, instance methods, and proper encapsulation',
      'Use @property for computed attributes and controlled setters',
      'Implement dunder methods: __str__, __repr__, __eq__, __hash__, __len__',
      'Apply inheritance, super(), and multiple inheritance with MRO',
      'Use @classmethod and @staticmethod correctly',
    ],
    content: [
      {
        type: 'code',
        language: 'python',
        filename: 'classes.py',
        code: `from datetime import datetime, date

class BankAccount:
    """A simple bank account with deposit, withdraw, and history."""

    # Class variable — shared across ALL instances
    interest_rate: float = 0.05

    def __init__(self, owner: str, initial_balance: float = 0.0) -> None:
        # Instance variables — unique per instance
        self.owner = owner
        self._balance = initial_balance     # _prefix = "private by convention"
        self._transactions: list[dict] = []
        self._created_at = datetime.now()

    # ── Properties — controlled access ──
    @property
    def balance(self) -> float:
        """Read-only balance."""
        return self._balance

    @property
    def created_at(self) -> datetime:
        return self._created_at

    # ── Instance methods ──
    def deposit(self, amount: float) -> None:
        if amount <= 0:
            raise ValueError(f"Deposit amount must be positive, got {amount}")
        self._balance += amount
        self._transactions.append({"type": "deposit", "amount": amount})

    def withdraw(self, amount: float) -> None:
        if amount <= 0:
            raise ValueError("Withdrawal amount must be positive")
        if amount > self._balance:
            raise ValueError(f"Insufficient funds: {self._balance:.2f} < {amount:.2f}")
        self._balance -= amount
        self._transactions.append({"type": "withdrawal", "amount": amount})

    def apply_interest(self) -> float:
        """Apply annual interest and return the amount added."""
        interest = self._balance * self.interest_rate
        self._balance += interest
        return interest

    # ── Class method — alternative constructor ──
    @classmethod
    def from_dict(cls, data: dict) -> "BankAccount":
        account = cls(data["owner"], data.get("balance", 0.0))
        return account

    # ── Static method — utility, no self/cls needed ──
    @staticmethod
    def validate_amount(amount: float) -> bool:
        return isinstance(amount, (int, float)) and amount > 0

    # ── Dunder methods ──
    def __repr__(self) -> str:
        return f"BankAccount(owner={repr(self.owner)}, balance={self._balance:.2f})"

    def __str__(self) -> str:
        return f"{self.owner}'s account: \${self._balance:.2f}"

    def __eq__(self, other: object) -> bool:
        if not isinstance(other, BankAccount):
            return NotImplemented
        return self.owner == other.owner and self._balance == other._balance

    def __len__(self) -> int:
        return len(self._transactions)`,
      },
      {
        type: 'code',
        language: 'python',
        filename: 'inheritance.py',
        code: `class Animal:
    def __init__(self, name: str, species: str) -> None:
        self.name = name
        self.species = species

    def speak(self) -> str:
        raise NotImplementedError("Subclasses must implement speak()")

    def __repr__(self) -> str:
        return f"{self.__class__.__name__}(name={self.name!r})"

class Dog(Animal):
    def __init__(self, name: str, breed: str) -> None:
        super().__init__(name, species="Canis lupus familiaris")
        self.breed = breed

    def speak(self) -> str:
        return f"{self.name} says: Woof!"

    def fetch(self, item: str) -> str:
        return f"{self.name} fetches the {item}!"

class Cat(Animal):
    def speak(self) -> str:
        return f"{self.name} says: Meow."

# isinstance / issubclass
dog = Dog("Rex", "German Shepherd")
print(isinstance(dog, Dog))     # True
print(isinstance(dog, Animal))  # True — Dog IS-A Animal
print(issubclass(Dog, Animal))  # True

# Polymorphism — same interface, different behaviour
animals: list[Animal] = [Dog("Rex", "Lab"), Cat("Whiskers"), Dog("Buddy", "Poodle")]
for animal in animals:
    print(animal.speak())   # each responds differently

# Multiple inheritance — MRO (Method Resolution Order)
class Flyable:
    def move(self) -> str:
        return "flying"

class Swimmable:
    def move(self) -> str:
        return "swimming"

class Duck(Flyable, Swimmable, Animal):
    def __init__(self, name: str):
        Animal.__init__(self, name, "Anas platyrhynchos")

    def speak(self) -> str:
        return "Quack!"

duck = Duck("Donald")
print(duck.move())        # "flying" — Flyable comes first in MRO
print(Duck.__mro__)       # shows the resolution order`,
      },
      {
        type: 'callout',
        tone: 'production',
        title: 'Dataclasses — OOP without boilerplate',
        content: 'For data-holding classes, use `@dataclass` from the standard library. It auto-generates `__init__`, `__repr__`, and `__eq__`. Add `frozen=True` for immutability (and hashability). For validation logic, use Pydantic instead.',
      },
      {
        type: 'code',
        language: 'python',
        filename: 'dataclasses_example.py',
        code: `from dataclasses import dataclass, field
from datetime import datetime

@dataclass
class Product:
    name: str
    price: float
    tags: list[str] = field(default_factory=list)  # mutable default
    created_at: datetime = field(default_factory=datetime.now)

    def discounted_price(self, percent: float) -> float:
        return self.price * (1 - percent / 100)

@dataclass(frozen=True)   # immutable — usable as dict key
class Point:
    x: float
    y: float

    def distance_to(self, other: "Point") -> float:
        return ((self.x - other.x)**2 + (self.y - other.y)**2) ** 0.5

p = Product("Widget", 29.99, tags=["sale", "new"])
print(p)  # Product(name='Widget', price=29.99, ...)

origin = Point(0, 0)
target = Point(3, 4)
print(origin.distance_to(target))  # 5.0`,
      },
      {
        type: 'exercise',
        title: 'Inventory System',
        description: 'Build an `Inventory` class that holds a list of `Product` dataclasses (name: str, quantity: int, price: float). Implement: `add(product)`, `remove(name)`, `total_value()` (sum of qty*price), `low_stock(threshold)` returning products with qty below threshold, and `__contains__` to support `"name" in inventory`.',
        language: 'python',
        starterCode: `from dataclasses import dataclass

@dataclass
class Product:
    name: str
    quantity: int
    price: float

class Inventory:
    def __init__(self):
        self._products: dict[str, Product] = {}

    def add(self, product: Product) -> None: ...
    def remove(self, name: str) -> None: ...
    def total_value(self) -> float: ...
    def low_stock(self, threshold: int = 5) -> list[Product]: ...
    def __contains__(self, name: str) -> bool: ...`,
        solution: `from dataclasses import dataclass

@dataclass
class Product:
    name: str
    quantity: int
    price: float

class Inventory:
    def __init__(self):
        self._products: dict[str, Product] = {}

    def add(self, product: Product) -> None:
        if product.name in self._products:
            self._products[product.name].quantity += product.quantity
        else:
            self._products[product.name] = product

    def remove(self, name: str) -> None:
        if name not in self._products:
            raise KeyError(f"Product '{name}' not in inventory")
        del self._products[name]

    def total_value(self) -> float:
        return sum(p.quantity * p.price for p in self._products.values())

    def low_stock(self, threshold: int = 5) -> list[Product]:
        return [p for p in self._products.values() if p.quantity < threshold]

    def __contains__(self, name: str) -> bool:
        return name in self._products`,
        hints: ['Use a dict keyed by name for O(1) lookup', 'add() should merge quantity if product already exists', '__contains__ just checks if name is in self._products'],
      },
    ],
  },

  // ─── Lesson 6: Advanced Python — Decorators, Iterators, Context Managers ─
  {
    id: 'py-advanced',
    moduleId: 'python-backend',
    phaseId: 'py-core',
    phaseNumber: 1,
    order: 6,
    title: 'Advanced Python: Decorators, Iterators & Context Managers',
    description: 'The features that separate Python beginners from proficient engineers — decorators for cross-cutting concerns, generators for memory-efficient processing, and context managers for safe resource handling.',
    duration: '55 min',
    difficulty: 'intermediate',
    objectives: [
      'Write decorators that wrap functions and preserve their metadata',
      'Write parameterized decorators (factory pattern)',
      'Build generators with yield for lazy, memory-efficient iteration',
      'Create context managers with __enter__/__exit__ and contextlib',
      'Combine these patterns in real-world scenarios',
    ],
    content: [
      {
        type: 'code',
        language: 'python',
        filename: 'decorators.py',
        code: `import functools
import time
from typing import Callable, TypeVar, Any

F = TypeVar("F", bound=Callable[..., Any])

# Basic decorator — wraps a function
def timer(fn: F) -> F:
    @functools.wraps(fn)   # preserves __name__, __doc__, __annotations__
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = fn(*args, **kwargs)
        elapsed = time.perf_counter() - start
        print(f"{fn.__name__} took {elapsed:.4f}s")
        return result
    return wrapper  # type: ignore[return-value]

@timer
def slow_computation(n: int) -> int:
    return sum(i**2 for i in range(n))

# Parameterized decorator — decorator factory
def retry(max_attempts: int = 3, delay: float = 1.0):
    def decorator(fn: F) -> F:
        @functools.wraps(fn)
        def wrapper(*args, **kwargs):
            last_error = None
            for attempt in range(1, max_attempts + 1):
                try:
                    return fn(*args, **kwargs)
                except Exception as e:
                    last_error = e
                    print(f"Attempt {attempt}/{max_attempts} failed: {e}")
                    if attempt < max_attempts:
                        time.sleep(delay)
            raise RuntimeError(f"All {max_attempts} attempts failed") from last_error
        return wrapper  # type: ignore[return-value]
    return decorator

@retry(max_attempts=3, delay=0.5)
def fetch_data(url: str) -> dict:
    # Simulates a flaky network call
    import random
    if random.random() < 0.7:
        raise ConnectionError("Network error")
    return {"data": "..."}

# Class-based decorator (stateful)
class RateLimit:
    def __init__(self, max_calls: int, period: float):
        self.max_calls = max_calls
        self.period = period
        self.calls: list[float] = []

    def __call__(self, fn: F) -> F:
        @functools.wraps(fn)
        def wrapper(*args, **kwargs):
            now = time.time()
            self.calls = [t for t in self.calls if now - t < self.period]
            if len(self.calls) >= self.max_calls:
                raise RuntimeError(f"Rate limit exceeded: {self.max_calls} calls per {self.period}s")
            self.calls.append(now)
            return fn(*args, **kwargs)
        return wrapper  # type: ignore[return-value]

@RateLimit(max_calls=5, period=1.0)
def api_call(endpoint: str) -> str:
    return f"Response from {endpoint}"`,
      },
      {
        type: 'code',
        language: 'python',
        filename: 'generators.py',
        code: `# Generator — produces values lazily with yield
def count_up(start: int, step: int = 1):
    """Infinite counter — generates numbers on demand."""
    current = start
    while True:
        yield current
        current += step

counter = count_up(1)
print(next(counter))  # 1
print(next(counter))  # 2

# Generator expressions — like list comprehensions but lazy
million_squares = (x**2 for x in range(1_000_000))
# No memory used yet — computed one at a time
first_ten = [next(million_squares) for _ in range(10)]

# Practical generator: reading large files line by line
def read_csv_rows(filepath: str):
    """Yields one row at a time — never loads full file into memory."""
    with open(filepath) as f:
        header = f.readline().strip().split(",")
        for line in f:
            values = line.strip().split(",")
            yield dict(zip(header, values))

# Generator pipeline — chain generators without intermediate lists
def parse_numbers(rows):
    for row in rows:
        try:
            yield {k: float(v) if v.replace('.','').isdigit() else v
                   for k, v in row.items()}
        except ValueError:
            pass

def filter_active(rows):
    yield from (row for row in rows if row.get("status") == "active")

# yield from — delegate to another iterable
def flatten(nested):
    for item in nested:
        if isinstance(item, list):
            yield from flatten(item)   # recurse
        else:
            yield item

print(list(flatten([1, [2, [3, 4]], 5])))  # [1, 2, 3, 4, 5]`,
      },
      {
        type: 'code',
        language: 'python',
        filename: 'context_managers.py',
        code: `# Context managers — safe resource handling with with statement
# Any object with __enter__ and __exit__ works

class DatabaseConnection:
    def __init__(self, url: str) -> None:
        self.url = url
        self.connection = None

    def __enter__(self):
        print(f"Connecting to {self.url}")
        self.connection = {"status": "connected"}  # simulate
        return self.connection   # the value assigned after 'as'

    def __exit__(self, exc_type, exc_val, exc_tb) -> bool:
        print("Closing connection")
        self.connection = None
        # Return True to suppress exceptions, False to re-raise
        return False

with DatabaseConnection("postgresql://localhost/mydb") as conn:
    print(f"Working with connection: {conn}")
# Always closes, even if an exception occurs inside

# ── contextlib — decorators for context managers ──
from contextlib import contextmanager, suppress

@contextmanager
def timer_context(label: str):
    import time
    start = time.perf_counter()
    try:
        yield                    # code inside the with block runs here
    finally:
        elapsed = time.perf_counter() - start
        print(f"{label}: {elapsed:.4f}s")

with timer_context("data processing"):
    total = sum(range(1_000_000))

# suppress — silently ignore specific exceptions
with suppress(FileNotFoundError):
    import os
    os.remove("nonexistent.tmp")   # no error raised

# Multiple context managers in one with statement
# with open("input.txt") as src, open("output.txt", "w") as dst:
#     dst.write(src.read())`,
      },
      {
        type: 'callout',
        tone: 'production',
        title: 'Decorators in Web Frameworks',
        content: 'Every web framework in Python uses decorators heavily: `@app.get("/users")` in FastAPI, `@login_required` in Django, `@cache` for memoization. Understanding how decorators work lets you write your own middleware, auth guards, and rate limiters without depending on framework internals.',
      },
      {
        type: 'exercise',
        title: 'Memoization Decorator',
        description: 'Write a `@memoize` decorator that caches function results by arguments. It should support an optional `maxsize` parameter. Also write a `cache_info()` method on the decorated function that returns `{"hits": int, "misses": int, "size": int}`.',
        language: 'python',
        starterCode: `import functools

def memoize(maxsize: int = 128):
    """Cache function results. Evict oldest entry when maxsize is reached."""
    def decorator(fn):
        @functools.wraps(fn)
        def wrapper(*args):
            ...
        wrapper.cache_info = lambda: {...}
        return wrapper
    return decorator

@memoize(maxsize=10)
def fibonacci(n: int) -> int:
    if n < 2:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

print(fibonacci(30))
print(fibonacci.cache_info())  # {"hits": ..., "misses": 31, "size": 10}`,
        solution: `import functools
from collections import OrderedDict

def memoize(maxsize: int = 128):
    def decorator(fn):
        cache: OrderedDict = OrderedDict()
        hits = 0
        misses = 0

        @functools.wraps(fn)
        def wrapper(*args):
            nonlocal hits, misses
            if args in cache:
                hits += 1
                cache.move_to_end(args)
                return cache[args]
            misses += 1
            result = fn(*args)
            cache[args] = result
            if len(cache) > maxsize:
                cache.popitem(last=False)  # evict oldest
            return result

        def cache_info():
            return {"hits": hits, "misses": misses, "size": len(cache)}

        wrapper.cache_info = cache_info
        return wrapper
    return decorator`,
        hints: ['Use OrderedDict for LRU eviction (move recently used to end)', 'Use nonlocal to modify hits/misses from inside wrapper', 'cache.popitem(last=False) removes the oldest (first) entry'],
      },
    ],
  },
]
