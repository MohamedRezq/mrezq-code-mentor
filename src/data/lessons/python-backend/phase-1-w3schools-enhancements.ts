import type { ContentBlock, Lesson } from '@/types/lesson'

const w3schoolsDetailBlocks: Record<string, string[]> = {
  'py-getting-started': [
    `## W3Schools coverage checklist (Getting Started)

- Python install + version check (\`python --version\`)
- Create and run first file (\`python main.py\`)
- REPL usage and quick calculations
- Comments and docstrings
- Basic variables and print output
- Indentation rules (4 spaces)
- Naming conventions (snake_case / constants)

### Quick verification script

\`\`\`python
name = "SeniorPath"
version = 1
print("Hello", name, version)
\`\`\`

If this runs and you can explain each token, you passed the beginner baseline.`,
  ],
  'py-types-and-strings': [
    `## W3Schools coverage checklist (Types & Strings)

- Numeric types: \`int\`, \`float\`, \`complex\`
- Type conversion with \`int()\`, \`float()\`, \`str()\`
- Boolean casting and truthiness
- String indexing, slicing, and length
- String methods: \`lower\`, \`upper\`, \`strip\`, \`replace\`, \`split\`
- String formatting with f-strings
- Escape characters (\`\\n\`, \`\\t\`, \`\\\\\`)

### Method map you should memorize

| Goal | Method |
|------|--------|
| Remove spaces at ends | \`.strip()\` |
| Replace substring | \`.replace(old, new)\` |
| Break text into pieces | \`.split(sep)\` |
| Join list into text | \`sep.join(parts)\` |
| Check prefix/suffix | \`.startswith()\` / \`.endswith()\` |`,
  ],
  'py-operators-truthiness': [
    `## W3Schools coverage checklist (Operators)

- Arithmetic operators (\`+\`, \`-\`, \`*\`, \`/\`, \`//\`, \`%\`, \`**\`)
- Assignment operators (\`+=\`, \`-=\`, \`*=\`)
- Comparison operators
- Logical operators (\`and\`, \`or\`, \`not\`)
- Identity operators (\`is\`, \`is not\`)
- Membership operators (\`in\`, \`not in\`)
- Bitwise operators (awareness level)

### Professional reading note

When reading conditionals, classify each token:
1. comparison (\`==\`, \`<\`)
2. logical glue (\`and\`, \`or\`)
3. identity check (\`is None\`)

This prevents subtle bugs caused by mixing equality and identity.`,
  ],
  'py-control-flow': [
    `## W3Schools coverage checklist (Control Flow)

- \`if\`, \`elif\`, \`else\`
- Nested conditionals and guard clauses
- Ternary expression
- \`pass\` placeholder
- \`match/case\` (modern Python extension)

### Branch design checklist

- Branch order: most specific before general.
- No hidden fallthrough assumptions.
- All branches return compatible types.
- Include default branch for unknown input.

If one branch changes response shape, add a callout comment explaining why.`,
  ],
  'py-loops-iterations': [
    `## W3Schools coverage checklist (Loops)

- \`for\` loops over strings/lists/ranges
- \`while\` loop with termination condition
- \`break\` and \`continue\`
- \`range(start, stop, step)\`
- Nested loops
- Loop \`else\` behavior
- Comprehensions (list/dict/set)

### Readability standard

Prefer:
- \`enumerate(items)\` for index + value
- \`zip(a, b)\` for parallel iteration

Avoid:
- manual index arithmetic unless required for slicing/windows.`,
  ],
  'py-functions-deep': [
    `## W3Schools coverage checklist (Functions)

- Define/call functions
- Parameters vs arguments
- Default parameters
- Return values
- Arbitrary args (\`*args\`)
- Keyword args and \`**kwargs\`
- Recursion awareness
- Lambda basics

### Signature literacy drill

Given:
\`\`\`python
def f(a, b=1, *args, c=2, **kwargs): ...
\`\`\`

You should be able to explain each section aloud in < 20 seconds:
normal -> default -> variadic positional -> keyword-only -> variadic keyword.`,
  ],
  'py-modules-stdlib': [
    `## W3Schools coverage checklist (Modules)

- Create/import module
- Use aliases (\`import x as y\`)
- Built-in modules (\`math\`, \`datetime\`, \`json\`, \`os\`)
- \`dir()\` for discovery
- Packages and folder structure
- \`if __name__ == "__main__"\`

### Must-know stdlib starter set

| Module | Use |
|--------|-----|
| \`math\` | numeric helpers |
| \`datetime\` | timestamps and arithmetic |
| \`json\` | API payloads |
| \`pathlib\` | file paths |
| \`re\` | pattern extraction |
| \`collections\` | Counter/defaultdict/deque |`,
  ],
  'py-collections-pro': [
    `## W3Schools coverage checklist (Collections)

- Lists: create/read/update/delete, slicing, sort
- Tuples: immutable ordered records
- Sets: uniqueness and set operations (\`union\`, \`intersection\`)
- Dicts: key/value access, update, iteration
- Membership checks in each structure
- Common methods: \`append\`, \`pop\`, \`get\`, \`items\`

### Set algebra quick sheet

\`\`\`python
a = {1, 2, 3}
b = {3, 4}
print(a | b)  # union
print(a & b)  # intersection
print(a - b)  # difference
\`\`\``,
  ],
  'py-exceptions-files': [
    `## W3Schools coverage checklist (Exceptions + Files)

- \`try\` / \`except\` / \`finally\`
- Catching specific exceptions
- Raising custom exceptions
- Open/read/write/append files
- Context manager (\`with open(...)\`)
- Remove files/folders safely (awareness)

### File mode cheat sheet

| Mode | Meaning |
|------|---------|
| \`r\` | read (must exist) |
| \`w\` | write (truncate/create) |
| \`a\` | append (create if missing) |
| \`rb\`/\`wb\` | binary modes |

Always include encoding for text files: \`encoding="utf-8"\`.`,
  ],
  'py-json-datetime': [
    `## W3Schools coverage checklist (JSON + Date/Time)

- Parse JSON string (\`loads\`) / serialize (\`dumps\`)
- File variants (\`load\` / \`dump\`)
- Datetime creation (\`now\`, constructor)
- Formatting (\`strftime\`) and parsing (\`strptime\`)
- Date arithmetic with \`timedelta\`
- UTC awareness and timezone-safe comparisons
- ISO-8601 roundtrip patterns

### Date/time format tokens you must know

| Token | Meaning | Example |
|-------|---------|---------|
| \`%Y\` | 4-digit year | 2026 |
| \`%m\` | month | 05 |
| \`%d\` | day | 24 |
| \`%H\` | hour (24h) | 15 |
| \`%M\` | minute | 09 |
| \`%S\` | second | 30 |

\`\`\`python
from datetime import datetime
dt = datetime.strptime("2026-05-24 15:09:30", "%Y-%m-%d %H:%M:%S")
print(dt.strftime("%d/%m/%Y"))
\`\`\`

Professional rule: store UTC, display local.`,
  ],
  'py-regex': [
    `## W3Schools coverage checklist (Regex)

- Character classes (\`[a-z]\`, \`\\d\`, \`\\w\`)
- Quantifiers (\`*\`, \`+\`, \`?\`, \`{m,n}\`)
- Anchors (\`^\`, \`$\`)
- Groups and alternation (\`(...)\`, \`a|b\`)
- \`search\`, \`findall\`, \`sub\`
- Raw string literals for patterns

### Regex safety note

- Keep patterns short and test-driven.
- Anchor validator patterns with \`fullmatch\` or explicit \`^\` + \`$\`.
- Prefer named groups for maintainability in production log parsing.`,
  ],
  'py-oop-solid': [
    `## W3Schools coverage checklist (OOP)

- Class definition and object creation
- \`__init__\` constructor
- Instance attributes and methods
- Inheritance basics (\`class Child(Parent)\`)
- Method override / polymorphism
- Encapsulation conventions (leading underscore)

### Professional naming conventions

- Class names: \`PascalCase\`
- Methods/fields: \`snake_case\`
- Internal attrs: leading underscore (\`_balance\`)

When reviewing classes, ask:
1. Is responsibility single and clear?
2. Are names domain-meaningful?
3. Are invariants protected by methods?`,
  ],
  'py-patterns-advanced': [
    `## W3Schools coverage checklist (Advanced Patterns)

- Iterators and generators
- \`yield\` semantics
- Decorator syntax (\`@name\`)
- Higher-order functions
- Context manager usage with \`with\`
- Functional helpers awareness (\`map\`, \`filter\`, \`sorted(key=...)\`)

### Code-reading micro-rubric

- For generators: identify yield points + termination.
- For decorators: identify wrapper + forwarded args/kwargs.
- For context managers: identify setup, critical section, teardown.

If any of those three is unclear, refactor for explicitness before shipping.`,
  ],
}

function toBlocks(markdowns: string[]): ContentBlock[] {
  return markdowns.map(markdown => ({ type: 'text', markdown }))
}

function appendBlocks(content: ContentBlock[], blocks: ContentBlock[]): ContentBlock[] {
  return [...content, ...blocks]
}

export function applyPhase1W3SchoolsEnhancements(lessons: Lesson[]): Lesson[] {
  return lessons.map(lesson => {
    const detailMarkdowns = w3schoolsDetailBlocks[lesson.id]
    if (!detailMarkdowns) return lesson
    return {
      ...lesson,
      content: appendBlocks(lesson.content, toBlocks(detailMarkdowns)),
    }
  })
}
