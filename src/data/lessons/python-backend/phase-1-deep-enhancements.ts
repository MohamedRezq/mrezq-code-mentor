import type { ContentBlock, Lesson } from '@/types/lesson'

// ─── PHASE 1 DEEP ENHANCEMENTS ───────────────────────────────────────────────
// Adds to every lesson (on top of existing enhancements):
//   · Terminology + pronunciation table
//   · Complete method/operator catalog with ALL outputs
//   · Junior mistakes + fix table
//   · Code-reading guide
//   · Production real scenario
// ─────────────────────────────────────────────────────────────────────────────

const deep1Blocks: Record<string, string[]> = {
  // ── Lesson 1: Getting Started ────────────────────────────────────────────
  'py-getting-started': [
    `## Terminology you must be able to spell and say

| Term | Pronunciation | What it means |
|---|---|---|
| Interpreter | in-TER-pret-er | Program that reads and runs Python code line by line |
| REPL | REP-ul | Read-Eval-Print Loop — interactive Python shell |
| Virtual environment | VIR-choo-ul en-VY-run-ment | Isolated Python install for one project |
| pip | pip | Package Installer for Python |
| \`__name__\` | dunder-name | Special attribute; equals \`"__main__"\` when file is run directly |
| CPython | SEE-PY-thon | The official Python interpreter written in C |
| shebang | she-BANG | \`#!/usr/bin/env python3\` — tells OS which interpreter to use |`,

    `## Full reference: Python built-in functions you use constantly

\`\`\`python
# Input/Output
print("hello")                    # → prints hello
print("a", "b", sep="-")          # → a-b
print("x", end="")                # no newline at end
input("Your name: ")              # prompts user, returns str

# Type checks and conversion
type(42)                          # → <class 'int'>
isinstance(42, int)               # → True
isinstance(42, (int, float))      # → True (any of the tuple)
int("42")                         # → 42
float("3.14")                     # → 3.14
str(100)                          # → "100"
bool(0)                           # → False
list("abc")                       # → ['a', 'b', 'c']
tuple([1, 2])                     # → (1, 2)

# Numeric built-ins
abs(-7)                           # → 7
round(3.14159, 2)                 # → 3.14
min(3, 1, 2)                      # → 1
max(3, 1, 2)                      # → 3
sum([1, 2, 3])                    # → 6
divmod(17, 5)                     # → (3, 2)  → (quotient, remainder)
pow(2, 10)                        # → 1024

# Sequence built-ins
len([1, 2, 3])                    # → 3
range(5)                          # → 0,1,2,3,4
range(2, 10, 2)                   # → 2,4,6,8
sorted([3,1,2])                   # → [1, 2, 3]
sorted([3,1,2], reverse=True)     # → [3, 2, 1]
sorted(["b","a"], key=str.upper)  # → ['a', 'b']
reversed([1,2,3])                 # → iterator (wrap in list())
enumerate(["a","b","c"])          # → (0,"a"),(1,"b"),(2,"c")
zip([1,2],[3,4])                  # → (1,3),(2,4)
map(str, [1,2,3])                 # → iterator of strings
filter(None, [0,1,2,None])        # → [1, 2]
any([False, True, False])         # → True
all([True, True, False])          # → False

# Objects
id(obj)                           # → memory address (unique id)
dir(obj)                          # → list of attributes/methods
vars(obj)                         # → __dict__ of object
hash("hello")                     # → integer hash
repr("abc")                       # → "'abc'" (unambiguous string)
\`\`\``,

    `## Junior mistakes + fix

| Mistake | What happens | Fix |
|---|---|---|
| \`if __name__ == "main":\` (missing underscores) | Guard never activates | Use \`if __name__ == "__main__":\` |
| \`print\` without parentheses | SyntaxError in Python 3 | Always \`print("...")\` |
| Running script in wrong virtualenv | Import errors, wrong package versions | Confirm with \`which python\` or \`python -V\` |
| Naming file \`random.py\` or \`json.py\` | Shadows the stdlib module | Never name files after stdlib modules |
| \`input()\` in a loop without strip | Whitespace causes unexpected comparisons | \`input().strip()\` always |`,
  ],

  // ── Lesson 2: Types & Strings ────────────────────────────────────────────
  'py-types-and-strings': [
    `## Terminology

| Term | Pronunciation | Meaning |
|---|---|---|
| Immutable | im-MYOO-ta-bul | Cannot be changed after creation (str, int, tuple) |
| Mutable | MYOO-ta-bul | Can be changed (list, dict, set) |
| String literal | — | A string written directly in source code: \`"hello"\` |
| f-string | EFF-string | Formatted string literal with embedded expressions: \`f"Hello {name}"\` |
| Unicode | YOO-ni-kode | International text standard; Python 3 strings are Unicode by default |
| Encoding | en-KOH-ding | How characters are stored as bytes (UTF-8, ASCII) |
| Slice | slys | Extracting a portion of a sequence: \`s[1:4]\` |`,

    `## Complete string method catalog with outputs

\`\`\`python
s = "  Hello, World!  "

# ── Case ─────────────────────────────────────────────────────
s.upper()           # → "  HELLO, WORLD!  "
s.lower()           # → "  hello, world!  "
s.title()           # → "  Hello, World!  " (each word capitalised)
s.capitalize()      # → "  hello, world!  " (only first char of string)
s.swapcase()        # → "  hELLO, wORLD!  "

# ── Strip / trim ──────────────────────────────────────────────
s.strip()           # → "Hello, World!"
s.lstrip()          # → "Hello, World!  "
s.rstrip()          # → "  Hello, World!"
"xxhelloxx".strip("x")  # → "hello"

# ── Search ────────────────────────────────────────────────────
s.find("World")     # → 9  (index of first match, or -1)
s.rfind("l")        # → 12 (last occurrence)
s.index("World")    # → 9  (like find but raises ValueError if missing)
s.startswith("  ")  # → True
s.endswith("!  ")   # → True
s.count("l")        # → 3

# ── Test / check ──────────────────────────────────────────────
"hello123".isalnum()  # → True (all alphanum)
"hello".isalpha()     # → True (all letters)
"123".isdigit()       # → True (all digits)
"  ".isspace()        # → True
"Hello".istitle()     # → True
"hello".islower()     # → True
"HELLO".isupper()     # → True

# ── Replace / transform ───────────────────────────────────────
"hello".replace("l", "r")         # → "herro"
"hello".replace("l", "r", 1)      # → "herlo" (max 1 replacement)

# ── Split / join ──────────────────────────────────────────────
"a,b,c".split(",")                 # → ["a", "b", "c"]
"a  b  c".split()                  # → ["a", "b", "c"] (any whitespace)
"a,b,c".split(",", 1)              # → ["a", "b,c"] (max 1 split)
"hello".partition("l")             # → ("he", "l", "lo")
"-".join(["a", "b", "c"])          # → "a-b-c"

# ── Padding ───────────────────────────────────────────────────
"hi".center(10)        # → "    hi    "
"hi".ljust(10)         # → "hi        "
"hi".rjust(10)         # → "        hi"
"hi".ljust(10, "*")    # → "hi********"
"7".zfill(5)           # → "00007"

# ── Format ───────────────────────────────────────────────────
f"{'hello':>10}"       # → "     hello" (right-align width 10)
f"{'hello':<10}"       # → "hello     " (left-align)
f"{'hello':^10}"       # → "  hello   " (centre)
f"{3.14159:.2f}"       # → "3.14"
f"{1000000:,}"         # → "1,000,000"
f"{255:#x}"            # → "0xff" (hex with prefix)
f"{0.256:.1%}"         # → "25.6%"

# ── Encode / decode ───────────────────────────────────────────
"hello".encode("utf-8")       # → b'hello'
b"hello".decode("utf-8")      # → "hello"
\`\`\``,

    `## Junior mistakes + fix

| Mistake | What happens | Fix |
|---|---|---|
| \`"hello" + 42\` | TypeError — can't concatenate str + int | \`"hello" + str(42)\` |
| \`s.replace()\` not assigned | Original string unchanged (strings are immutable) | \`s = s.replace(...)\` |
| \`s.split()\` vs \`s.split(" ")\` | Empty-string split collapses whitespace; " " doesn't | Use \`s.split()\` for natural word splitting |
| f-string with \`=\` sign prints nothing | Must include the value: \`f"{x=}"\` prints \`x=value\` | Use \`f"{x=}"\` for debug; \`f"{x}"\` for production |
| \`s.find()\` vs \`s.index()\` | \`find\` returns -1 on miss; \`index\` raises ValueError | Use \`find\` when miss is expected, \`index\` when it should never miss |`,
  ],

  // ── Lesson 3: Operators & Truthiness ────────────────────────────────────
  'py-operators-truthiness': [
    `## Terminology

| Term | Pronunciation | Meaning |
|---|---|---|
| Truthy | TROO-thee | Any value Python treats as True in boolean context |
| Falsy | FAWL-zee | Values treated as False: \`0, 0.0, "", [], {}, set(), None, False\` |
| Short-circuit | SHORT-SIR-kit | \`and\`/\`or\` stop evaluating as soon as result is determined |
| Augmented assignment | AWG-ment-ed | \`+=\`, \`-=\`, \`*=\` etc — modify and reassign in one step |
| Walrus operator | WAL-rus | \`:=\` — assign inside an expression (Python 3.8+) |
| Identity operator | eye-DEN-ti-tee | \`is\` / \`is not\` — checks if two names point to the same object |
| Membership operator | MEM-ber-ship | \`in\` / \`not in\` — checks if value is in a container |`,

    `## Complete operator reference with outputs

\`\`\`python
# ── Arithmetic ────────────────────────────────────────────────
5 + 2    # → 7
5 - 2    # → 3
5 * 2    # → 10
5 / 2    # → 2.5  (always float)
5 // 2   # → 2    (floor division — always int if both ints)
5 % 2    # → 1    (modulo — remainder)
5 ** 2   # → 25   (power)
-5 // 2  # → -3   (floors toward -∞, not 0)
-5 % 2   # → 1    (follows floor division)

# ── Comparison — all return bool ──────────────────────────────
3 == 3    # → True
3 != 4    # → True
3 < 4     # → True
3 <= 3    # → True
3 > 2     # → True
3 >= 3    # → True
1 < 2 < 3 # → True (chained comparison — Python-specific)

# ── Logical ───────────────────────────────────────────────────
True and False    # → False
True or False     # → True
not True          # → False

# Short-circuit — returns the deciding value, not True/False
0 or "default"    # → "default"   (0 is falsy → tries right)
1 or "default"    # → 1           (1 is truthy → stops here)
None and action() # → None        (None is falsy → action never called)

# ── Identity vs equality ──────────────────────────────────────
a = [1, 2, 3]
b = [1, 2, 3]
a == b   # → True   (same value)
a is b   # → False  (different objects in memory)
a is not b  # → True

x = None
x is None    # → True   ← CORRECT way to check for None
x == None    # → True   ← works but not idiomatic

# ── Membership ────────────────────────────────────────────────
"py" in "python"     # → True
3 in [1, 2, 3]       # → True
"x" not in {"a", "b"} # → True

# ── Bitwise ───────────────────────────────────────────────────
5 & 3    # → 1   (AND bits:  101 & 011 = 001)
5 | 3    # → 7   (OR bits:   101 | 011 = 111)
5 ^ 3    # → 6   (XOR bits:  101 ^ 011 = 110)
~5       # → -6  (NOT bits)
2 << 3   # → 16  (left shift = multiply by 2^3)
16 >> 2  # → 4   (right shift = divide by 2^2)

# ── Walrus operator := ────────────────────────────────────────
# Assign AND use in one expression
if (n := len(data)) > 10:
    print(f"Processing {n} items")
# Without walrus: n = len(data) then if n > 10

# In while loop (common pattern)
while chunk := file.read(8192):
    process(chunk)
\`\`\``,

    `## Falsy values — complete list

\`\`\`python
# All of these are falsy — bool() returns False:
bool(None)      # → False
bool(False)     # → False
bool(0)         # → False
bool(0.0)       # → False
bool(0j)        # → False  (complex zero)
bool("")        # → False
bool(b"")       # → False  (empty bytes)
bool([])        # → False
bool(())        # → False
bool({})        # → False
bool(set())     # → False

# Everything else is truthy:
bool("0")       # → True   (non-empty string)
bool([0])       # → True   (non-empty list)
bool(-1)        # → True   (non-zero number)
\`\`\``,

    `## Junior mistakes + fix

| Mistake | What happens | Fix |
|---|---|---|
| \`x == None\` | Works but not idiomatic | Use \`x is None\` |
| \`x == True\` | Matches \`1\` too (1 == True) | Use \`if x:\` or \`if x is True:\` |
| Using \`and\`/\`or\` expecting bool return | Returns the deciding *value* not always True/False | Cast: \`bool(x or y)\` if you need bool |
| \`not x == y\` vs \`x != y\` | Operator precedence — \`not x\` evaluates first | Use \`x != y\` always |
| Mutable default \`def f(x=[]):\` | List persists between calls | Use \`def f(x=None): if x is None: x = []\` |`,
  ],

  // ── Lesson 4: Control Flow ───────────────────────────────────────────────
  'py-control-flow': [
    `## Terminology

| Term | Pronunciation | Meaning |
|---|---|---|
| Conditional | kon-DISH-un-ul | An \`if\` statement that chooses between branches |
| Branch | branch | One execution path in an if/elif/else |
| Guard clause | GARD | Early \`return\`/\`raise\` at the top of a function to handle edge cases |
| Match statement | — | Python 3.10+ structural pattern matching (like switch/case) |
| Structural pattern matching | — | Matching on the *shape* of data, not just equality |
| Early return | — | Returning from a function before the end to avoid deep nesting |`,

    `## Full reference: if / elif / else patterns

\`\`\`python
# ── Basic ─────────────────────────────────────────────────────
x = 10
if x > 0:
    print("positive")          # → positive
elif x == 0:
    print("zero")
else:
    print("negative")

# ── Ternary (one-liner) ───────────────────────────────────────
label = "positive" if x > 0 else "non-positive"

# ── Guard clause pattern (preferred over deep nesting) ────────
# BAD — deep nesting:
def process(user):
    if user is not None:
        if user.is_active:
            if user.has_permission:
                do_work(user)

# GOOD — guard clauses:
def process(user):
    if user is None:
        raise ValueError("user required")
    if not user.is_active:
        raise PermissionError("inactive user")
    if not user.has_permission:
        raise PermissionError("no permission")
    do_work(user)   # ← only reached if all guards pass

# ── match / case (Python 3.10+) ───────────────────────────────
match status_code:
    case 200: result = "OK"
    case 201: result = "Created"
    case 404: result = "Not Found"
    case 422: result = "Validation Error"
    case _:   result = f"Unknown {status_code}"

# Match on structure (structural pattern matching)
match point:
    case {"x": x, "y": y}:        # dict with those keys
        print(f"Point at {x},{y}")
    case [x, y]:                   # two-element list
        print(f"Coords {x},{y}")
    case None:
        print("No point")
\`\`\``,

    `## Junior mistakes + fix

| Mistake | What happens | Fix |
|---|---|---|
| Deep nesting (if inside if inside if) | Hard to read, hard to test | Use guard clauses / early returns |
| \`if x == True:\` | Matches \`1\` as well | Use \`if x:\` |
| \`if x == None:\` | Works but not idiomatic | Use \`if x is None:\` |
| Comparing strings with \`is\` | May work by accident (interning), but not guaranteed | Always use \`==\` to compare values |
| Missing \`_\` default case in match | Unmatched value silently skipped | Always add \`case _:\` |`,
  ],

  // ── Lesson 5: Loops & Iterations ────────────────────────────────────────
  'py-loops-iterations': [
    `## Terminology

| Term | Pronunciation | Meaning |
|---|---|---|
| Iterable | IT-er-uh-bul | Anything you can loop over: list, str, dict, file, range... |
| Iterator | IT-er-ay-ter | Object that produces next value on demand (via \`__next__\`) |
| Generator | JEN-er-ay-ter | Function that yields values lazily using \`yield\` |
| Comprehension | kom-pre-HEN-shun | Compact loop syntax to build a list/dict/set |
| \`break\` | — | Exit the loop immediately |
| \`continue\` | — | Skip to next iteration |
| \`else\` on loop | — | Runs if loop finished without \`break\` |
| \`enumerate\` | e-NOO-mer-ayt | Built-in to get index + value together |`,

    `## Complete loop pattern reference

\`\`\`python
items = ["a", "b", "c"]

# ── for loop ──────────────────────────────────────────────────
for item in items:
    print(item)            # → a  b  c

# With index
for i, item in enumerate(items):
    print(i, item)         # → 0 a  1 b  2 c

for i, item in enumerate(items, start=1):
    print(i, item)         # → 1 a  2 b  3 c

# ── while loop ────────────────────────────────────────────────
count = 0
while count < 3:
    print(count)           # → 0 1 2
    count += 1

# ── break / continue ─────────────────────────────────────────
for n in range(10):
    if n == 3: continue    # skip 3
    if n == 6: break       # stop at 6
    print(n)               # → 0 1 2 4 5

# ── for/else (runs if no break) ───────────────────────────────
for item in items:
    if item == "x":
        break
else:
    print("'x' not found")   # → prints because loop completed

# ── zip: iterate two lists together ─────────────────────────
names  = ["Alice", "Bob"]
scores = [95, 87]
for name, score in zip(names, scores):
    print(f"{name}: {score}")   # → Alice: 95  Bob: 87

# ── zip_longest (fill missing values) ────────────────────────
from itertools import zip_longest
for a, b in zip_longest([1,2,3], [10,20], fillvalue=0):
    print(a, b)    # → 1 10  2 20  3 0

# ── reversed / sorted ─────────────────────────────────────────
for item in reversed(items):
    print(item)             # → c  b  a

for item in sorted(items, reverse=True):
    print(item)             # → c  b  a

# ── Iterating dicts ───────────────────────────────────────────
d = {"a": 1, "b": 2}
for key in d:                    # → a  b
for key in d.keys():             # → a  b
for val in d.values():           # → 1  2
for key, val in d.items():       # → a 1  b 2

# ── Generator function ────────────────────────────────────────
def count_up(n):
    for i in range(n):
        yield i                  # pauses here, resumes on next()

gen = count_up(3)
next(gen)    # → 0
next(gen)    # → 1
next(gen)    # → 2
next(gen)    # → StopIteration

# Memory benefit: generator produces ONE item at a time
sum(x**2 for x in range(10_000_000))   # → no 10M list in memory
\`\`\``,

    `## Junior mistakes + fix

| Mistake | What happens | Fix |
|---|---|---|
| Modify list while iterating it | Skipped items / IndexError | Iterate a copy: \`for x in list(items):\` |
| Use \`range(len(lst))\` instead of \`enumerate\` | Verbose anti-pattern | \`for i, x in enumerate(lst):\` |
| Forget \`list()\` around \`zip\`/\`map\`/\`filter\` | Get iterator object, not values | Wrap in \`list()\` if you need a list |
| Infinite \`while True\` without \`break\` | Hangs process | Always have a clear exit condition |
| Build list with \`append\` in loop instead of comprehension | Slower and more verbose | Use list comprehension when possible |`,
  ],

  // ── Lesson 6: Functions Deep ─────────────────────────────────────────────
  'py-functions-deep': [
    `## Terminology

| Term | Pronunciation | Meaning |
|---|---|---|
| Parameter | pa-RAM-e-ter | Variable name in function definition |
| Argument | AR-gyoo-ment | Value passed when calling the function |
| Positional argument | po-ZI-shun-ul | Matched by order |
| Keyword argument | KEY-word | Matched by name: \`func(name="Alice")\` |
| \`*args\` | star-args | Collects extra positional args into a tuple |
| \`**kwargs\` | star-star-kwargs | Collects extra keyword args into a dict |
| Closure | KLO-zher | Inner function that "closes over" variables from outer scope |
| Decorator | DEK-o-ray-ter | Function that wraps another function to add behaviour |
| First-class function | — | Functions are objects — can be passed, stored, returned |
| Lambda | LAM-duh | Anonymous one-expression function |`,

    `## Complete function signature reference

\`\`\`python
# ── Parameter types ────────────────────────────────────────────
def demo(
    pos_only,          # positional only (before /)
    /,
    normal,            # positional OR keyword
    *,
    kw_only,           # keyword only (after *)
    **kwargs           # extra keyword args → dict
):
    pass

demo(1, 2, kw_only=3)       # pos_only=1, normal=2, kw_only=3

# ── *args: variable positional args ──────────────────────────
def add(*numbers):
    return sum(numbers)

add(1, 2, 3)     # → 6
add(1)           # → 1
add()            # → 0

# ── **kwargs: variable keyword args ──────────────────────────
def build_url(base, **params):
    query = "&".join(f"{k}={v}" for k, v in params.items())
    return f"{base}?{query}" if query else base

build_url("https://api.example.com", page=2, limit=20)
# → "https://api.example.com?page=2&limit=20"

# ── Unpacking when calling ────────────────────────────────────
args   = [1, 2, 3]
kwargs = {"sep": "-", "end": "\\n"}
print(*args, **kwargs)   # same as: print(1, 2, 3, sep="-", end="\\n")

# ── Type hints ────────────────────────────────────────────────
def greet(name: str, times: int = 1) -> str:
    return (name + " ") * times

# ── Lambda ────────────────────────────────────────────────────
square = lambda x: x ** 2
square(5)                        # → 25
sorted(["banana","apple"], key=lambda s: len(s))  # → ["apple","banana"]

# ── Closure ───────────────────────────────────────────────────
def make_multiplier(factor):
    def multiply(x):
        return x * factor       # "closes over" factor
    return multiply

double = make_multiplier(2)
triple = make_multiplier(3)
double(5)    # → 10
triple(5)    # → 15

# ── Decorator ─────────────────────────────────────────────────
import functools, time

def timer(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        start  = time.perf_counter()
        result = func(*args, **kwargs)
        elapsed = time.perf_counter() - start
        print(f"{func.__name__} took {elapsed:.4f}s")
        return result
    return wrapper

@timer
def slow_add(a, b):
    time.sleep(0.1)
    return a + b

slow_add(1, 2)
# → slow_add took 0.1003s
# → 3
\`\`\``,

    `## Junior mistakes + fix

| Mistake | What happens | Fix |
|---|---|---|
| Mutable default argument \`def f(x=[]):\` | List persists across calls — classic bug | Use \`None\` default, create inside function |
| Forget \`@functools.wraps(func)\` on decorator | \`func.__name__\` becomes \`"wrapper"\`, docstring lost | Always add \`@functools.wraps(func)\` |
| \`return\` missing in function | Returns \`None\` silently | Add explicit \`return\` |
| Lambda with side effects | Hard to debug, no name in tracebacks | Use named functions for anything non-trivial |
| Call function in default arg: \`def f(t=time.time())\` | Evaluated ONCE at definition, not per call | Use \`None\` and compute inside |`,
  ],

  // ── Lesson 7: Modules & Stdlib ───────────────────────────────────────────
  'py-modules-stdlib': [
    `## Terminology

| Term | Pronunciation | Meaning |
|---|---|---|
| Module | MOD-yool | A \`.py\` file that can be imported |
| Package | PAK-ij | A directory containing \`__init__.py\` and modules |
| \`__init__.py\` | dunder-init | File that makes a directory a Python package |
| Namespace | NAYM-space | The scope in which names live (module, local, global) |
| Stdlib | STD-lib | Standard library — modules shipped with Python |
| \`sys.path\` | sis-path | List of directories Python searches when importing |
| Absolute import | AB-so-loot | \`from app.utils import helper\` — from project root |
| Relative import | REL-a-tiv | \`from .utils import helper\` — relative to current package |`,

    `## Full reference: essential stdlib modules

\`\`\`python
# ── os: file system and OS interaction ────────────────────────
import os
os.getcwd()                          # → "/Users/me/project"
os.listdir(".")                      # → ["file.py", "dir"]
os.path.join("dir", "sub", "f.txt") # → "dir/sub/f.txt" (OS-safe)
os.path.exists("/some/path")         # → True/False
os.path.isfile("/some/file.txt")     # → True/False
os.path.isdir("/some/dir")           # → True/False
os.makedirs("new/dir", exist_ok=True)# create nested dirs
os.environ.get("HOME")               # → "/Users/me"

# ── pathlib: modern file paths (prefer over os.path) ─────────
from pathlib import Path
p = Path("data") / "output.csv"      # → Path("data/output.csv")
p.exists()                           # → True/False
p.read_text()                        # → file contents as string
p.write_text("hello")
p.read_bytes()                       # → file contents as bytes
p.parent                             # → Path("data")
p.name                               # → "output.csv"
p.stem                               # → "output"
p.suffix                             # → ".csv"
p.with_suffix(".json")               # → Path("data/output.json")
list(Path(".").glob("**/*.py"))      # → all .py files recursively

# ── sys ────────────────────────────────────────────────────────
import sys
sys.argv                             # → ["script.py", "arg1", "arg2"]
sys.exit(0)                          # exit with code 0 (success)
sys.exit(1)                          # exit with code 1 (error)
sys.version                          # → "3.12.0 ..."
sys.platform                         # → "linux", "darwin", "win32"
sys.path                             # → list of import search dirs

# ── json ───────────────────────────────────────────────────────
import json
json.dumps({"key": [1, 2, 3]})              # → '{"key": [1, 2, 3]}'
json.dumps(data, indent=2, sort_keys=True)  # pretty-print
json.loads('{"key": "value"}')             # → {"key": "value"}
json.dump(data, open("f.json","w"))        # write to file
json.load(open("f.json"))                  # read from file

# ── datetime ───────────────────────────────────────────────────
from datetime import datetime, date, timedelta, timezone
now = datetime.now(timezone.utc)
now.isoformat()                            # → "2025-01-15T12:00:00+00:00"
datetime.fromisoformat("2025-01-15")       # parse ISO string
now + timedelta(days=30)                   # → 30 days from now
(now - datetime(2025,1,1,tzinfo=timezone.utc)).days  # days since Jan 1

# ── urllib.parse ──────────────────────────────────────────────
from urllib.parse import urlencode, urlparse, quote
urlencode({"page": 2, "q": "python basics"})
# → "page=2&q=python+basics"
urlparse("https://example.com/path?q=1")
# → ParseResult(scheme='https', netloc='example.com', path='/path', ...)
quote("hello world")     # → "hello%20world"

# ── hashlib ────────────────────────────────────────────────────
import hashlib
hashlib.sha256(b"hello").hexdigest()   # → 64-char hex string
\`\`\``,

    `## Junior mistakes + fix

| Mistake | What happens | Fix |
|---|---|---|
| \`import *\` from a module | Pollutes namespace, hard to trace where names come from | Always import by name: \`from os import getcwd\` |
| Circular imports (A imports B, B imports A) | ImportError or partial import | Restructure — move shared code to a third module |
| \`open()\` without \`with\` | File handle stays open (resource leak) | Always \`with open(...) as f:\` |
| Build file paths with \`+\` string concat | Breaks on Windows (backslash) | Use \`Path\` or \`os.path.join\` |
| Forget timezone-aware datetimes | Midnight comparison bugs across DST | Always use \`datetime.now(timezone.utc)\` |`,
  ],

  // ── Lesson 8: Collections Pro ────────────────────────────────────────────
  'py-collections-pro': [
    `## Terminology

| Term | Pronunciation | Meaning |
|---|---|---|
| \`defaultdict\` | DEFAULT-dict | Dict that creates a default value for missing keys |
| \`Counter\` | KOWN-ter | Dict subclass that counts hashable objects |
| \`deque\` | DEK (rhymes with "deck") | Double-ended queue — O(1) append and pop from both ends |
| \`namedtuple\` | NAMED-too-pul | Tuple subclass with named fields |
| \`OrderedDict\` | OR-dered-dict | Dict that remembers insertion order (redundant in Python 3.7+) |
| \`ChainMap\` | CHAYN-map | Combines multiple dicts for lookup without copying |
| Hashable | HASH-uh-bul | Object that has a fixed hash (can be used as dict key or set element) |`,

    `## Complete collections module reference

\`\`\`python
from collections import defaultdict, Counter, deque, namedtuple, ChainMap

# ── defaultdict ────────────────────────────────────────────────
dd = defaultdict(list)
dd["fruits"].append("apple")
dd["fruits"].append("banana")
dd["vegs"].append("carrot")
dict(dd)   # → {"fruits": ["apple","banana"], "vegs": ["carrot"]}

dd_int = defaultdict(int)   # default is 0
dd_int["a"] += 1
dd_int["a"] += 1
dd_int["b"] += 1
dict(dd_int)  # → {"a": 2, "b": 1}

# ── Counter ────────────────────────────────────────────────────
c = Counter("mississippi")
# → Counter({'i':4,'s':4,'p':2,'m':1})
c.most_common(3)      # → [('i',4),('s',4),('p',2)]
c["i"]                # → 4
c["z"]                # → 0 (no KeyError)
c.total()             # → 11 (sum of all counts)
c.elements()          # → iterator of each element repeated by count

c2 = Counter("abbc")
c + c2                # combine counts
c - c2                # subtract (remove negatives)

# ── deque ──────────────────────────────────────────────────────
dq = deque([1, 2, 3])
dq.append(4)          # right: [1,2,3,4]
dq.appendleft(0)      # left:  [0,1,2,3,4]
dq.pop()              # → 4   right pop
dq.popleft()          # → 0   left pop
dq.rotate(1)          # rotate right 1: [3,1,2]
dq.rotate(-1)         # rotate left  1: [1,2,3]

# Fixed-size sliding window (drops oldest automatically)
log = deque(maxlen=100)
for line in all_lines:
    log.append(line)   # oldest line auto-dropped when full

# ── namedtuple ────────────────────────────────────────────────
Point = namedtuple("Point", ["x", "y"])
p = Point(10, 20)
p.x       # → 10
p.y       # → 20
p[0]      # → 10  (also works as regular tuple)
p._asdict()  # → {"x": 10, "y": 20}
p._replace(x=99)  # → Point(x=99, y=20) (immutable — returns new)

# ── ChainMap ──────────────────────────────────────────────────
defaults = {"color": "red",  "size": "M"}
overrides = {"color": "blue"}
config   = ChainMap(overrides, defaults)
config["color"]  # → "blue"  (overrides wins)
config["size"]   # → "M"     (falls through to defaults)
\`\`\``,

    `## Junior mistakes + fix

| Mistake | What happens | Fix |
|---|---|---|
| \`list.pop(0)\` in a loop | O(n) per pop — O(n²) total | Use \`deque.popleft()\` — O(1) |
| \`dict[key]\` on possibly missing key | KeyError | \`dict.get(key, default)\` or \`defaultdict\` |
| \`Counter\` on non-iterable | TypeError | Only pass iterables to Counter: strings, lists, etc. |
| Mutate namedtuple | AttributeError — it's immutable | Use \`_replace()\` to get new tuple with changed field |
| Use dict for frequency count manually | Verbose, error-prone | Use \`Counter\` — it handles missing keys |`,
  ],

  // ── Lesson 9: Exceptions & Files ────────────────────────────────────────
  'py-exceptions-files': [
    `## Terminology

| Term | Pronunciation | Meaning |
|---|---|---|
| Exception | ek-SEP-shun | Runtime error object |
| Traceback | TRAYS-bak | Stack trace printed when exception is unhandled |
| Raise | rayz | Intentionally create and throw an exception |
| Propagate | PROP-uh-gayt | Exception travels up the call stack looking for a handler |
| Chain exception | chayn | Link exceptions with \`raise X from Y\` |
| Context manager | KON-tekst | Object that sets up and tears down a resource (\`with\` statement) |
| \`__enter__\`/\`__exit__\` | dunder-enter/exit | Protocol methods for context managers |`,

    `## Complete exception hierarchy (what you encounter in backend work)

\`\`\`
BaseException
├── SystemExit           → sys.exit() was called
├── KeyboardInterrupt    → Ctrl+C pressed
└── Exception            ← catch this, not BaseException
    ├── ArithmeticError
    │   ├── ZeroDivisionError    → 1/0
    │   └── OverflowError        → number too large
    ├── LookupError
    │   ├── IndexError           → list[99] out of range
    │   └── KeyError             → dict["missing_key"]
    ├── TypeError                → wrong type passed to operation
    ├── ValueError               → right type, wrong value: int("abc")
    ├── AttributeError           → obj.no_such_attr
    ├── NameError                → undefined variable
    ├── OSError                  → file/network I/O
    │   ├── FileNotFoundError    → open("missing.txt")
    │   ├── PermissionError      → no read/write access
    │   └── TimeoutError         → operation timed out
    ├── RuntimeError             → generic runtime failure
    ├── StopIteration            → iterator exhausted
    ├── ImportError              → module not found
    └── NotImplementedError      → abstract method not overridden
\`\`\``,

    `## Full reference: exception attributes and introspection

\`\`\`python
try:
    raise ValueError("price must be positive") from None
except ValueError as e:
    print(type(e).__name__)     # → "ValueError"
    print(e.args)               # → ("price must be positive",)
    print(str(e))               # → "price must be positive"
    print(repr(e))              # → "ValueError('price must be positive')"
    print(e.__traceback__)      # → traceback object

# Exception chaining
try:
    result = int("bad")
except ValueError as e:
    raise RuntimeError("Parsing failed") from e
    # Raises RuntimeError and shows: "The above exception was the direct cause..."

# Suppress chaining
try:
    result = int("bad")
except ValueError:
    raise RuntimeError("Parsing failed") from None
    # Hides the original ValueError from user-facing messages
\`\`\``,

    `## Full reference: file I/O modes and operations

\`\`\`python
# ── Text mode ─────────────────────────────────────────────────
with open("file.txt", "r") as f:          # read (default)
    content = f.read()                     # entire file as string
    f.seek(0)
    lines = f.readlines()                  # list of lines with \\n
    f.seek(0)
    for line in f:                         # lazy line iteration (memory-safe)
        print(line.rstrip())

with open("file.txt", "w") as f:          # write (truncates existing)
    f.write("hello\\n")
    f.writelines(["line1\\n", "line2\\n"])

with open("file.txt", "a") as f:          # append
    f.write("appended\\n")

with open("file.txt", "r+") as f:         # read+write without truncate

# ── Binary mode ───────────────────────────────────────────────
with open("image.png", "rb") as f:        # read binary
    data = f.read()                        # → bytes

with open("output.bin", "wb") as f:       # write binary
    f.write(b"\\x00\\x01\\x02")

# ── Encoding (always specify in production) ────────────────────
with open("file.txt", encoding="utf-8") as f:
    content = f.read()

# ── pathlib equivalents (modern — prefer these) ───────────────
from pathlib import Path
p = Path("file.txt")
content = p.read_text(encoding="utf-8")   # all at once
p.write_text("hello", encoding="utf-8")
data    = p.read_bytes()                  # binary
p.write_bytes(b"\\x00")

# ── CSV ────────────────────────────────────────────────────────
import csv
with open("data.csv", newline="", encoding="utf-8") as f:
    reader = csv.DictReader(f)
    for row in reader:
        print(row["name"], row["price"])   # each row is a dict

with open("out.csv", "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=["name","price"])
    writer.writeheader()
    writer.writerow({"name": "Course", "price": 49})
\`\`\``,

    `## Junior mistakes + fix

| Mistake | What happens | Fix |
|---|---|---|
| Catch \`Exception\` and do nothing (bare except) | Errors silently swallowed | Always log or re-raise in except blocks |
| Catch \`BaseException\` | Catches \`SystemExit\` and \`KeyboardInterrupt\` too | Catch \`Exception\` unless you specifically need the others |
| \`open()\` without \`with\` | File not closed on exception | Always use \`with open(...) as f:\` |
| No encoding specified | Platform-dependent default — different results on Windows/Linux | Always pass \`encoding="utf-8"\` |
| Raise inside \`finally\` | Discards original exception | Never raise in \`finally\` blocks |`,
  ],

  // ── Lesson 10: JSON & Datetime ────────────────────────────────────────────
  'py-json-datetime': [
    `## Terminology

| Term | Pronunciation | Meaning |
|---|---|---|
| Serialise | SEER-ee-uh-lyze | Convert Python object → JSON string |
| Deserialise | dee-SEER-ee-uh-lyze | Convert JSON string → Python object |
| ISO 8601 | eye-so-eight-six-oh-one | International date/time format: \`2025-01-15T12:00:00Z\` |
| Timezone-aware | — | datetime that knows its UTC offset |
| Timezone-naive | — | datetime with no timezone info — avoid in production |
| UTC | U-T-C | Universal Coordinated Time — the reference timezone |
| Unix timestamp | — | Seconds since Jan 1 1970 00:00:00 UTC |
| Epoch | EE-pok | The Unix epoch = Jan 1 1970 |`,

    `## Complete datetime reference with outputs

\`\`\`python
from datetime import datetime, date, time, timedelta, timezone
import time as time_module

# ── Create ────────────────────────────────────────────────────
now_utc   = datetime.now(timezone.utc)   # ← always use UTC in backend
today     = date.today()                 # → date(2025, 1, 15)
specific  = datetime(2025, 1, 15, 12, 30, 0, tzinfo=timezone.utc)

# ── Format → string ───────────────────────────────────────────
now_utc.isoformat()              # → "2025-01-15T12:00:00+00:00"
now_utc.strftime("%Y-%m-%d")     # → "2025-01-15"
now_utc.strftime("%d/%m/%Y %H:%M")  # → "15/01/2025 12:00"
now_utc.strftime("%A, %B %d")    # → "Wednesday, January 15"

# ── Parse string → datetime ───────────────────────────────────
datetime.fromisoformat("2025-01-15T12:00:00+00:00")
datetime.strptime("15/01/2025", "%d/%m/%Y")  # → datetime(2025,1,15,0,0)

# ── Arithmetic ────────────────────────────────────────────────
deadline  = now_utc + timedelta(days=30)
yesterday = now_utc - timedelta(days=1)
diff      = deadline - now_utc
diff.days          # → 30
diff.total_seconds()  # → 2592000.0

# ── Unix timestamp ────────────────────────────────────────────
ts = now_utc.timestamp()          # → 1736938800.0
datetime.fromtimestamp(ts, tz=timezone.utc)  # back to datetime

# ── Date components ───────────────────────────────────────────
now_utc.year          # → 2025
now_utc.month         # → 1
now_utc.day           # → 15
now_utc.hour          # → 12
now_utc.minute        # → 0
now_utc.weekday()     # → 0=Mon … 6=Sun
now_utc.strftime("%A") # → "Wednesday"

# ── Replace / combine ─────────────────────────────────────────
noon = now_utc.replace(hour=12, minute=0, second=0, microsecond=0)
dt   = datetime.combine(today, time(9, 30))  # date + time → datetime

# ── Timezone conversion ───────────────────────────────────────
from zoneinfo import ZoneInfo           # Python 3.9+
riyadh = ZoneInfo("Asia/Riyadh")
riyadh_time = now_utc.astimezone(riyadh)
riyadh_time.strftime("%H:%M %Z")        # → "15:00 +03"
\`\`\``,

    `## Complete JSON reference

\`\`\`python
import json
from datetime import datetime

# ── Basic serialise / deserialise ────────────────────────────
json.dumps({"name": "Alice", "age": 30})
# → '{"name": "Alice", "age": 30}'

json.loads('{"name": "Alice", "age": 30}')
# → {"name": "Alice", "age": 30}

# ── Options ───────────────────────────────────────────────────
json.dumps(data, indent=2)               # pretty-print
json.dumps(data, sort_keys=True)         # alphabetical keys
json.dumps(data, ensure_ascii=False)     # allow non-ASCII (Arabic, etc.)
json.dumps(data, separators=(",",":"))   # compact (no spaces)

# ── File operations ──────────────────────────────────────────
with open("data.json", "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

with open("data.json", encoding="utf-8") as f:
    data = json.load(f)

# ── Custom serialiser for non-serialisable types ─────────────
class AppEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, datetime):
            return obj.isoformat()
        if hasattr(obj, "__dict__"):
            return obj.__dict__
        return super().default(obj)

json.dumps({"ts": datetime.now()}, cls=AppEncoder)
# → '{"ts": "2025-01-15T12:00:00"}'
\`\`\``,

    `## Junior mistakes + fix

| Mistake | What happens | Fix |
|---|---|---|
| Naive datetime (no timezone) | Comparisons break across DST boundaries | Always use \`datetime.now(timezone.utc)\` |
| \`datetime.now()\` without timezone | Returns local time, not UTC | Pass \`timezone.utc\` explicitly |
| Store datetime as string in DB | Can't range-query or sort properly | Store as \`TIMESTAMP WITH TIME ZONE\` |
| \`json.dumps(datetime_obj)\` | TypeError: Object not serialisable | Use custom encoder or \`.isoformat()\` |
| Parse date without format string | Fragile — relies on strptime guessing | Always pass explicit format: \`strptime(s, "%Y-%m-%d")\` |`,
  ],

  // ── Lesson 11: Regex ─────────────────────────────────────────────────────
  'py-regex': [
    `## Terminology

| Term | Pronunciation | Meaning |
|---|---|---|
| Regex | REG-ex | Regular Expression — a pattern string for matching text |
| Pattern | PAT-ern | The regex string, e.g. \`r"\\d+"\` |
| Raw string | — | String prefixed with \`r\` — backslashes are not escape sequences |
| Match object | — | Object returned by \`re.match\`/\`re.search\` containing groups and positions |
| Group | — | Parenthesised sub-pattern \`(pattern)\` that captures a sub-match |
| Named group | — | \`(?P<name>pattern)\` — group accessible by name |
| Greedy | GREE-dee | Matches as much as possible (default) |
| Non-greedy | non-GREE-dee | \`+?\` \`*?\` — matches as little as possible |
| Lookahead | LOOK-ah-hed | \`(?=...)\` — asserts pattern ahead without consuming |`,

    `## Complete regex reference

\`\`\`python
import re

# ── Special characters ────────────────────────────────────────
# .     any character except newline
# \\d    digit [0-9]
# \\D    non-digit
# \\w    word character [a-zA-Z0-9_]
# \\W    non-word
# \\s    whitespace (space, tab, newline)
# \\S    non-whitespace
# ^     start of string (or line with MULTILINE)
# \$     end of string (or line with MULTILINE)
# [ ]   character class  [aeiou]  [a-z]  [^0-9] (^ negates)
# |     alternation  cat|dog
# ( )   group — captures
# (?:)  non-capturing group
# (?P<name>) named group

# ── Quantifiers ───────────────────────────────────────────────
# *     0 or more
# +     1 or more
# ?     0 or 1 (optional)
# {3}   exactly 3
# {2,5} 2 to 5
# *?    non-greedy 0 or more

# ── Functions ─────────────────────────────────────────────────
re.search(r"\\d+", "abc123def")        # → Match at position 3
re.match(r"\\d+", "123abc")           # → Match (must match at START)
re.match(r"\\d+", "abc123")           # → None (no match at start)
re.fullmatch(r"\\d+", "123")          # → Match (must match ENTIRE string)
re.fullmatch(r"\\d+", "123abc")       # → None

re.findall(r"\\d+", "a1 b22 c333")    # → ["1", "22", "333"]
re.finditer(r"\\d+", "a1 b22")        # → iterator of Match objects
re.sub(r"\\d+", "NUM", "a1 b22")      # → "a NUM b NUM"
re.sub(r"\\d+", "NUM", "a1 b22", count=1)  # → "a NUM b22"
re.split(r"\\s+", "a  b   c")          # → ["a", "b", "c"]

# ── Match object methods ─────────────────────────────────────
m = re.search(r"(\\d{4})-(\\d{2})-(\\d{2})", "Date: 2025-01-15")
m.group(0)     # → "2025-01-15"  (entire match)
m.group(1)     # → "2025"        (first group)
m.group(2)     # → "01"
m.group(3)     # → "15"
m.start()      # → 6  (start position in original string)
m.end()        # → 16

# Named groups
m = re.search(r"(?P<year>\\d{4})-(?P<month>\\d{2})-(?P<day>\\d{2})", "2025-01-15")
m.group("year")    # → "2025"
m.groupdict()      # → {"year": "2025", "month": "01", "day": "15"}

# ── Compile for reuse ────────────────────────────────────────
EMAIL = re.compile(r"[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}")
EMAIL.match("user@example.com")   # → Match object
EMAIL.findall("contact a@b.com and c@d.org")
# → ["a@b.com", "c@d.org"]

# ── Flags ─────────────────────────────────────────────────────
re.search(r"hello", "HELLO WORLD", re.IGNORECASE)   # case-insensitive
re.findall(r"^\\w+", "line1\\nline2", re.MULTILINE)  # ^ per line
re.search(r".", "a\\nb", re.DOTALL)                 # . matches newline too
\`\`\``,

    `## Junior mistakes + fix

| Mistake | What happens | Fix |
|---|---|---|
| Forget \`r""\` prefix | Backslashes interpreted as Python escapes, pattern broken | Always use raw strings: \`r"\\d+"\` |
| Use \`re.match\` when wanting search | Only checks start of string, misses matches | Use \`re.search\` or \`re.fullmatch\` |
| Regex for email without compile | Recompiles every call — slow in loops | \`EMAIL = re.compile(...)\` once at module level |
| Greedy quantifier catches too much | \`<.+>\` matches from first \`<\` to last \`>\` | Use \`<.+?>\` (non-greedy) |
| No groups in \`re.sub\` replacement | Can't reference captured content | Use \`r"\\1"\` or \`r"\\g<name>"\` in replacement |`,
  ],

  // ── Lesson 12: OOP & SOLID ───────────────────────────────────────────────
  'py-oop-solid': [
    `## Terminology

| Term | Pronunciation | Meaning |
|---|---|---|
| Class | klas | Blueprint for objects |
| Instance | IN-stunce | A specific object created from a class |
| Attribute | AT-rib-yoot | Data stored on an object |
| Method | METH-ud | Function defined inside a class |
| \`__init__\` | dunder-init | Constructor — runs when object is created |
| \`__repr__\` | dunder-REPR | String for developers: \`repr(obj)\` |
| \`__str__\` | dunder-STR | String for users: \`str(obj)\` and \`print(obj)\` |
| Inheritance | in-HAIR-it-unce | Class inherits attributes/methods from parent |
| Polymorphism | pol-ee-MOR-fizm | Different classes respond to the same method name |
| Encapsulation | en-KAP-syoo-LAY-shun | Hiding internal state; exposing only what's needed |
| Abstract class | AB-strakt | Class that can't be instantiated — defines interface |
| Dunder method | DUN-der | Double underscore method (\`__init__\`, \`__len__\`) |
| \`@property\` | — | Decorator to make a method look like an attribute |
| \`@classmethod\` | — | Method that receives the class as first argument |
| \`@staticmethod\` | — | Method that doesn't receive class or instance |`,

    `## Full reference: class features with outputs

\`\`\`python
from abc import ABC, abstractmethod
from dataclasses import dataclass, field

# ── Full class anatomy ────────────────────────────────────────
class Course:
    # Class variable — shared by all instances
    platform = "SeniorPath"

    def __init__(self, title: str, price: float):
        self.title  = title      # instance variable
        self.price  = price
        self._views = 0          # convention: "private" (not enforced)

    # Instance method
    def discount(self, pct: float) -> float:
        return self.price * (1 - pct)

    # Property — accessed like an attribute
    @property
    def is_free(self) -> bool:
        return self.price == 0

    @property
    def views(self) -> int:
        return self._views

    @views.setter
    def views(self, value: int):
        if value < 0:
            raise ValueError("views cannot be negative")
        self._views = value

    # Class method — receives class, not instance
    @classmethod
    def free(cls, title: str) -> "Course":
        return cls(title, price=0)

    # Static method — no class or instance
    @staticmethod
    def is_valid_price(price: float) -> bool:
        return isinstance(price, (int, float)) and price >= 0

    # Dunder methods
    def __repr__(self):
        return f"Course(title={self.title!r}, price={self.price})"

    def __str__(self):
        return f"{self.title} ({'Free' if self.is_free else f'\${self.price}'})"

    def __len__(self):
        return len(self.title)

    def __eq__(self, other):
        if not isinstance(other, Course): return NotImplemented
        return self.title == other.title and self.price == other.price

# Usage
c = Course("Python Basics", 49.99)
print(c.is_free)        # → False
print(c.views)          # → 0
c.views = 100           # setter validates
print(repr(c))          # → Course(title='Python Basics', price=49.99)
print(str(c))           # → Python Basics (\$49.99)
print(len(c))           # → 12
free = Course.free("Intro")  # → Course(title='Intro', price=0)

# ── Inheritance ───────────────────────────────────────────────
class PremiumCourse(Course):
    def __init__(self, title, price, mentor):
        super().__init__(title, price)
        self.mentor = mentor

    def __str__(self):
        return f"[PREMIUM] {super().__str__()} with {self.mentor}"

p = PremiumCourse("Django", 99, "Alice")
isinstance(p, Course)          # → True
isinstance(p, PremiumCourse)   # → True

# ── Abstract class ────────────────────────────────────────────
class Notifier(ABC):
    @abstractmethod
    def send(self, message: str) -> bool: ...

class EmailNotifier(Notifier):
    def send(self, message: str) -> bool:
        print(f"Email: {message}")
        return True

# ── Dataclass ─────────────────────────────────────────────────
@dataclass
class Point:
    x: float
    y: float
    label: str = ""
    tags: list = field(default_factory=list)  # mutable default

p = Point(1.0, 2.0)
print(p)       # → Point(x=1.0, y=2.0, label='', tags=[])
p == Point(1.0, 2.0)   # → True (auto-generated __eq__)
\`\`\``,

    `## Junior mistakes + fix

| Mistake | What happens | Fix |
|---|---|---|
| Mutable class variable | All instances share the same list — mutations affect all | Declare mutable defaults in \`__init__\` as instance variables |
| \`__str__\` returns non-string | TypeError | Always return \`str\` from \`__str__\` |
| Forget \`super().__init__()\` in subclass | Parent initialisation skipped | Always call \`super().__init__(...)\` first |
| Override method but break signature | Violates Liskov substitution | Overriding methods must accept same arguments |
| Instantiate abstract class | TypeError | Implement all \`@abstractmethod\` in subclass |`,
  ],

  // ── Lesson 13: Advanced Patterns ─────────────────────────────────────────
  'py-patterns-advanced': [
    `## Terminology

| Term | Pronunciation | Meaning |
|---|---|---|
| Context manager | — | Object used with \`with\` — guarantees cleanup |
| Protocol | PRO-to-kol | Duck-typing interface in Python — defines methods a class must have |
| Type alias | — | \`UserId = int\` — give a type a readable name |
| Generic | je-NER-ik | Parameterised type: \`list[int]\`, \`dict[str, float]\` |
| \`TypeVar\` | TYPE-var | Placeholder for a generic type |
| \`Callable\` | KAW-luh-bul | Type annotation for functions |
| \`Any\` | — | Opt out of type checking for this value |
| \`cast\` | kast | Tell mypy "trust me, this is this type" without runtime check |`,

    `## Full reference: advanced typing with outputs

\`\`\`python
from typing import TypeVar, Generic, Protocol, Callable, Any, cast
from collections.abc import Iterator, Generator

# ── Type aliases ─────────────────────────────────────────────
UserId    = int
CourseId  = int
JSONValue = dict[str, Any] | list | str | int | float | bool | None

# ── Protocol (structural typing — duck typing with types) ─────
class Sendable(Protocol):
    def send(self, message: str) -> bool: ...

def notify_all(notifiers: list[Sendable], msg: str):
    for n in notifiers:
        n.send(msg)    # works for any class with .send() — no inheritance needed

# ── Generic class ────────────────────────────────────────────
T = TypeVar("T")

class Stack(Generic[T]):
    def __init__(self): self._items: list[T] = []
    def push(self, item: T): self._items.append(item)
    def pop(self) -> T: return self._items.pop()
    def __len__(self): return len(self._items)

s: Stack[int] = Stack()
s.push(1)
s.push(2)
s.pop()    # → 2

# ── Callable type hints ───────────────────────────────────────
# Callable[[arg1_type, arg2_type], return_type]
Transform = Callable[[str], str]

def apply(text: str, fn: Transform) -> str:
    return fn(text)

apply("hello", str.upper)  # → "HELLO"

# ── Context manager with contextlib ──────────────────────────
from contextlib import contextmanager

@contextmanager
def timer(label: str):
    import time
    start = time.perf_counter()
    try:
        yield                              # code in the with block runs here
    finally:
        elapsed = time.perf_counter() - start
        print(f"{label}: {elapsed:.4f}s")

with timer("database query"):
    # ... your code
    pass
# → database query: 0.0123s

# ── Generator with type hints ─────────────────────────────────
def count_up(n: int) -> Generator[int, None, None]:
    for i in range(n):
        yield i

# ── dataclasses.field advanced usage ─────────────────────────
from dataclasses import dataclass, field
from datetime import datetime, timezone

@dataclass
class Event:
    name:       str
    created_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))
    tags:       list[str] = field(default_factory=list)
    _id:        int = field(default=0, repr=False)   # excluded from repr
\`\`\``,

    `## Junior mistakes + fix

| Mistake | What happens | Fix |
|---|---|---|
| \`from typing import List, Dict\` (capital) | Deprecated in Python 3.9+ | Use \`list[int]\`, \`dict[str, int]\` directly |
| Use \`Any\` everywhere | Defeats the purpose of type hints | Only use \`Any\` at boundary with untyped libraries |
| Forget \`@classmethod\` signature \`cls\` → \`self\` | Wrong: mypy and runtime errors | \`def create(cls, ...)\` not \`def create(self, ...)\` |
| \`cast()\` at runtime to validate | \`cast\` is mypy-only — does nothing at runtime | Use Pydantic or \`isinstance\` for runtime validation |
| Inherit from Protocol | Wrong pattern — Protocol is for structural typing | Never inherit from Protocol in user code |`,
  ],
}

function toBlocks(markdowns: string[]): ContentBlock[] {
  return markdowns.map(markdown => ({ type: 'text' as const, markdown }))
}

export function applyPhase1DeepEnhancements(lessons: Lesson[]): Lesson[] {
  return lessons.map(lesson => {
    const markdowns = deep1Blocks[lesson.id]
    if (!markdowns) return lesson
    return {
      ...lesson,
      content: [...toBlocks(markdowns), ...lesson.content],
    }
  })
}
