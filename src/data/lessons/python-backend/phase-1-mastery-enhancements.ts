import type { ContentBlock, Lesson } from '@/types/lesson'

const masteryBlocks: Record<string, string[]> = {
  'py-getting-started': [
    `## Common mistakes and how to read them

### Frequent beginner mistakes

1. **Mixed tabs/spaces** -> \`IndentationError\`
2. Running \`python\` from the wrong folder -> file not found/import confusion
3. Naming files \`json.py\` / \`datetime.py\` -> shadows stdlib modules
4. Assuming REPL history is saved automatically

### Error literacy drill

If you see:
\`\`\`
IndentationError: expected an indented block
\`\`\`
Read it as: "Python reached a statement that starts a block (\`if\`, \`for\`, \`def\`) and did not find valid indentation right after."`,
    `## Professional term spellbook

| Term | Correct spelling | Say it like |
|------|------------------|-------------|
| interpreter | interpreter | in-ter-pruh-ter |
| indentation | indentation | in-den-tay-shun |
| variable | variable | vair-ee-uh-bul |
| module | module | mod-yool |
| environment | environment | en-vy-run-ment |

Use these exact words in standups and code reviews.`,
  ],
  'py-types-and-strings': [
    `## Pitfalls that appear in real codebases

- \`isinstance(True, int)\` is \`True\` (bool subclasses int)
- \`float\` rounding surprises in billing paths
- forgetting reassignment after immutable operations (\`s.strip()\` without \`s = ...\`)
- confusing \`repr\` and user-facing display text

### Code review sniff test

If a PR contains money math with float literals (e.g. \`19.99\`), request refactor to integer cents or \`Decimal\` before approval.`,
    `## String parsing mini-playbook

1. Normalize input first: \`strip\` -> \`lower\`
2. Parse second: \`split\` / slicing
3. Validate shape third: expected segments/count
4. Format output last with f-strings

This sequence prevents many "works for happy path only" bugs.`,
  ],
  'py-operators-truthiness': [
    `## Edge cases professionals watch for

- \`x or default\` will replace valid falsy values like \`0\`, \`0.0\`, \`""\`, \`[]\`
- \`a == None\` can be overloaded; \`a is None\` is canonical
- \`and/or\` return operands, not booleans
- chained comparisons are clean, but avoid overly complex expressions

### Safer defaulting pattern

\`\`\`python
value = default if x is None else x
\`\`\`

Use this when \`0\` or empty string should remain valid.`,
    `## Interview-level operator fluency

Explain these in one line each:
- identity
- equality
- membership
- short-circuit
- assignment expression (\`:=\`)

If you can explain each precisely, your operator fundamentals are production-ready.`,
  ],
  'py-control-flow': [
    `## Branching quality checklist

- Conditions are ordered from most specific to most general
- No unreachable branch
- Default branch handles unknown input safely
- Return type is consistent across all branches

### Anti-pattern

Deeply nested ifs for simple validation.

### Preferred pattern

Guard clauses at top, core logic below.`,
    `## Pattern matching gotchas

- \`case {"x": x}\` binds name \`x\` (capture), it does not compare to existing outer variable unless guarded.
- Include \`case _:\` to avoid silent misses.
- Keep match trees shallow; split into helper functions if cases grow.`,
  ],
  'py-loops-iterations': [
    `## Loop correctness checklist

- Loop termination is obvious
- Mutating the iterated collection is avoided (or copied intentionally)
- \`break\` usage is intentional and documented by structure
- Complexity is acceptable (\`O(n)\` vs accidental \`O(n^2)\`)

### Professional reading trick

For each loop, identify:
1) source iterable
2) loop invariant
3) exit condition
4) side effects`,
    `## Comprehension readability threshold

Acceptable:
- one expression + optional one \`if\`
- maybe one nested \`for\` when obvious

Refactor when:
- multiple conditions
- nested ternaries
- business rules hidden inline`,
  ],
  'py-functions-deep': [
    `## Signature design standards

- Required params first
- optional params with defaults after
- \`*\` for keyword-only options that impact behavior
- avoid boolean positional arguments
- mutable defaults are prohibited

### Example (good)
\`\`\`python
def fetch_user(user_id: int, *, include_roles: bool = False) -> dict: ...
\`\`\``,
    `## API ergonomics checklist

When you expose a function used by others:
- Is the name action-oriented?
- Are defaults safe?
- Are errors explicit?
- Does docstring mention units and edge cases?
- Does annotation match real return behavior?`,
  ],
  'py-modules-stdlib': [
    `## Import hygiene in professional projects

- stdlib imports first, then third-party, then local imports
- avoid wildcard imports (\`from x import *\`)
- keep top-level import side effects minimal
- avoid circular dependencies by extracting shared types/helpers

### Package execution rule

Prefer:
\`\`\`bash
python -m app.cli
\`\`\`
over running internal module files directly.`,
    `## Naming collision warning

Never create local files named:
- \`json.py\`
- \`re.py\`
- \`datetime.py\`
- \`typing.py\`

These shadow stdlib and produce confusing runtime errors.`,
  ],
  'py-collections-pro': [
    `## Data-structure choice rubric

Use:
- \`list\` for ordered sequence operations
- \`set\` for membership and dedupe
- \`dict\` for keyed lookup
- \`tuple\` for immutable records / dict keys

### Performance intuition

If code repeatedly does \`if x in big_list\`, consider converting once:
\`\`\`python
allowed_set = set(big_list)
\`\`\`
then use O(1)-average lookups.`,
    `## Mutability danger zones

- shared nested references after shallow copy
- default mutable arguments in constructors/functions
- in-place sort changing callers' view unexpectedly

Practice: if mutation must happen, make that explicit in naming or comments.`,
  ],
  'py-exceptions-files': [
    `## Error-handling quality rubric

- catch narrow exception classes
- preserve context via chaining (\`raise ... from exc\`)
- don't swallow exceptions silently
- messages are actionable
- cleanup guaranteed by context manager or finally

### Logging practice

Log contextual fields (user id, path, operation), not only raw exception text.`,
    `## File I/O production guardrails

- explicit encoding for text (\`utf-8\`)
- binary mode for non-text assets
- append mode for logs/events
- avoid loading huge files entirely into memory
- ensure parent directories exist before write`,
  ],
  'py-json-datetime': [
    `## Date/time must-know edge cases

- naive vs aware datetime comparison raises \`TypeError\`
- daylight-saving transitions create ambiguous local times
- timestamps should be stored in UTC
- parse/format must specify expected schema and timezone

### Safe comparison pattern

\`\`\`python
from datetime import timezone
a_utc = a.astimezone(timezone.utc)
b_utc = b.astimezone(timezone.utc)
print(a_utc < b_utc)
\`\`\``,
    `## Serialization contract checklist

- outbound datetime format is documented (ISO-8601 preferred)
- timezone included or explicitly agreed
- parser validates field existence and type
- fallback/default behavior is explicit

If contract is unclear, bugs appear at service boundaries, not in unit tests.`,
  ],
  'py-regex': [
    `## Regex maintainability rules

- compile frequently-used patterns
- use named groups for extracted fields
- anchor validators
- keep patterns commented when non-trivial
- unit-test valid and invalid examples

### Example test matrix idea

- valid email examples (3)
- invalid email examples (3)
- malformed unicode edge case (1)`,
    `## Catastrophic-backtracking awareness

Avoid overly broad nested quantifiers in complex patterns.

If a regex becomes hard to reason about:
1. simplify
2. split into two passes
3. or replace with parser logic`,
  ],
  'py-oop-solid': [
    `## OOP quality checklist

- class has one clear responsibility
- constructor enforces valid initial state
- method names reflect business intent
- representation methods avoid sensitive data leakage
- composition preferred over deep inheritance chains

### Review question

"Could this be a function + dataclass instead of a heavy class hierarchy?"`,
    `## Protocol-first design habit

When integrating external systems, define a small Protocol for behavior you need.

Benefits:
- easier mocking/testing
- easier swapping implementations
- less coupling to framework internals`,
  ],
  'py-patterns-advanced': [
    `## Advanced pattern review checklist

- generators are consumed exactly once unless recreated
- decorators preserve metadata (\`@wraps\`)
- context managers handle both success and failure paths
- retries/backoff logic has clear maximum attempts

### Generator gotcha

After a generator is exhausted, iterating again yields nothing; recreate it if needed.`,
    `## Decorator literacy drill

When reading a decorator, identify:
1. when pre-logic runs
2. how exceptions are handled
3. whether args/kwargs are forwarded unchanged
4. what value is returned

If any of these is unclear, the decorator is too opaque and should be simplified.`,
  ],
}

function blocksFrom(markdowns: string[]): ContentBlock[] {
  return markdowns.map(markdown => ({ type: 'text', markdown }))
}

export function applyPhase1MasteryEnhancements(lessons: Lesson[]): Lesson[] {
  return lessons.map(lesson => {
    const markdowns = masteryBlocks[lesson.id]
    if (!markdowns) return lesson
    return {
      ...lesson,
      content: [...lesson.content, ...blocksFrom(markdowns)],
    }
  })
}
