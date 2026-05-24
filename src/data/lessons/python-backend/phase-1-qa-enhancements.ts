import type { ContentBlock, Lesson } from '@/types/lesson'

const phase1ProfessionalGlossary: Record<string, string> = {
  'py-getting-started': `## Professional reading guide + spelling

When reading code reviews, say and spell these terms correctly:

- **REPL** ("reh-pul"): Read-Eval-Print Loop
- **venv** ("venv"): virtual environment
- **PEP 8** ("pep eight"): Python style guide
- **shebang** ("sheh-bang"): first line like \`#!/usr/bin/env python3\`
- **docstring** ("dock-string"): triple-quoted API description

Code reading habit:
1. Read filename + module docstring first.
2. Scan constants (\`SCREAMING_SNAKE\`) and what they configure.
3. Trace variable names from assignment to first use.
4. Verify units in names (\`timeout_ms\`, \`size_mb\`).`,
  'py-types-and-strings': `## Professional vocabulary for this lesson

- **immutable** ("ih-myoo-tuh-bul"): object cannot change in place
- **coercion / casting**: converting one type to another
- **sentinel**: special value with meaning (often \`None\`)
- **repr** ("reh-pr"): developer-facing representation
- **format specifier**: part after colon in f-string, e.g. \`:.2f\`

Code reading habit:
- If you see \`bool(value)\`, check truthiness rules first.
- If you see money in \`float\`, flag it and suggest \`Decimal\` or integer cents.
- If you see repeated \`+\\\` string concatenation in loops, suggest \`join\`.`,
  'py-operators-truthiness': `## Professional vocabulary for this lesson

- **short-circuit evaluation**: stop early once result is known
- **identity** vs **equality**: \`is\` vs \`==\`
- **coalescing default**: \`x or fallback\`
- **truthy/falsy**: values that behave like True/False in conditions
- **walrus operator**: \`:=\` (assignment expression)

Code review checklist:
- For \`None\`, enforce \`is None\` / \`is not None\`.
- For defaulting, verify \`0\` or \`""\` are not accidentally overridden by \`or\`.
- For walrus usage, ask: "Does this improve readability, or hide intent?"`,
  'py-control-flow': `## Professional vocabulary for this lesson

- **guard clause**: early return to reduce nesting
- **branch**: one path in conditional logic
- **fallthrough** (conceptual): unmatched cases continue checking
- **pattern matching**: \`match/case\` structural checks
- **wildcard case**: \`case _:\` default branch

Code reading habit:
- Read condition order top-to-bottom and ask "most specific first?"
- Verify every branch returns the same data shape/type.
- In \`match\`, check whether unknown payloads are handled safely.`,
  'py-loops-iterations': `## Professional vocabulary for this lesson

- **iterator protocol**: objects consumed by \`for\`
- **enumerate**: index + value iteration
- **comprehension**: expression-based collection builder
- **loop invariant**: statement that stays true each iteration
- **loop-else**: \`else\` runs when no \`break\` occurs

Code reading habit:
- Look for accidental in-loop mutation of the iterated list.
- Confirm complexity of nested loops.
- If comprehension is hard to explain in one sentence, rewrite as loop.`,
  'py-functions-deep': `## Professional vocabulary for this lesson

- **signature**: function header shape
- **variadic**: accepts variable argument counts
- **keyword-only**: arguments required by name
- **positional-only**: arguments allowed by position only
- **idempotent helper**: repeated calls with same input yield same result

Code reading habit:
- Parse \`/\`, \`*\`, \`*args\`, \`**kwargs\` before reading body.
- Flag mutable defaults immediately.
- Verify return type consistency against annotation.`,
  'py-modules-stdlib': `## Professional vocabulary for this lesson

- **import resolution**: how Python locates modules
- **module cache**: \`sys.modules\`
- **entrypoint**: executed start module (\`__main__\`)
- **absolute import** / **relative import**
- **stdlib**: standard library shipped with Python

Code reading habit:
- Start with import block and identify local vs stdlib vs third-party.
- For import errors, verify working directory and package context first.
- For CLI modules, confirm \`if __name__ == "__main__":\` exists.`,
  'py-collections-pro': `## Professional vocabulary for this lesson

- **amortized O(1)**: average constant-time operations (e.g. dict/set lookup)
- **hashable**: can be used as dict key/set member
- **shallow copy** vs **deep copy**
- **deduplication**: removing duplicates
- **multiset** behavior via \`Counter\`

Code reading habit:
- Confirm collection type fits access pattern (lookup/order/uniqueness).
- Watch for shared nested references after copy operations.
- Ensure JSON boundary keys are strings.`,
  'py-exceptions-files': `## Professional vocabulary for this lesson

- **exception chaining**: \`raise ... from exc\`
- **traceback**: call stack at failure point
- **fail fast**: reject invalid input early
- **cleanup guarantee**: \`finally\` or context manager
- **JSONL**: one JSON object per line

Code reading habit:
- Reject bare \`except:\`; require specific error classes.
- Ensure file operations include explicit encoding.
- Verify error messages are actionable for caller logs.`,
  'py-json-datetime': `## Professional vocabulary for this lesson

- **serialization** / **deserialization**
- **naive datetime** vs **aware datetime**
- **UTC normalization**: storage in UTC
- **ISO-8601** timestamp format
- **schema drift**: shape changed from expected contract

Code reading habit:
- Validate JSON shape before field access.
- Normalize timezones before comparing datetimes.
- Confirm custom \`default=\` encoders only emit JSON-safe values.`,
  'py-regex': `## Professional vocabulary for this lesson

- **character class**: \`[A-Z]\`, \`\\d\`, \`\\w\`
- **capturing group**: \`(...)\`
- **named group**: \`(?P<name>...)\`
- **anchor**: start/end boundary checks
- **greedy** vs **non-greedy** matching

Code reading habit:
- Prefer raw strings for every regex literal.
- Use \`fullmatch\` for validators, \`search\` for extraction.
- Compile once for repeated use in hot paths.`,
  'py-oop-solid': `## Professional vocabulary for this lesson

- **encapsulation**: internal state protected behind methods
- **DTO**: Data Transfer Object
- **structural typing**: behavior-based compatibility (\`Protocol\`)
- **special methods**: \`__repr__\`, \`__str__\`, etc.
- **composition over inheritance**: prefer combining objects

Code reading habit:
- Check class responsibilities are focused and small.
- Ensure public API is obvious from method names.
- Verify \`__repr__\` helps debugging without leaking secrets.`,
  'py-patterns-advanced': `## Professional vocabulary for this lesson

- **lazy evaluation**: compute only when needed
- **decorator**: function that wraps another function
- **higher-order function**: function receiving/returning functions
- **context manager**: deterministic setup/teardown with \`with\`
- **cross-cutting concern**: timing/logging/auth around core logic

Code reading habit:
- For decorators, confirm metadata preservation (\`functools.wraps\`).
- For generators, verify termination conditions clearly.
- For context managers, confirm rollback/cleanup on exceptions.`,
}

function makeGlossaryBlock(markdown: string): ContentBlock {
  return {
    type: 'text',
    markdown,
  }
}

function insertAfterFirstText(content: ContentBlock[], block: ContentBlock): ContentBlock[] {
  const firstTextIndex = content.findIndex(item => item.type === 'text')
  if (firstTextIndex === -1) return [block, ...content]
  return [...content.slice(0, firstTextIndex + 1), block, ...content.slice(firstTextIndex + 1)]
}

/**
 * Phase 1 QA pass:
 * - adds explicit professional vocabulary and spelling/pronunciation notes
 * - adds code-reading checklists for review-quality literacy
 */
export function applyPhase1QaEnhancements(lessons: Lesson[]): Lesson[] {
  return lessons.map(lesson => {
    const glossaryMarkdown = phase1ProfessionalGlossary[lesson.id]
    if (!glossaryMarkdown) return lesson
    return {
      ...lesson,
      content: insertAfterFirstText(lesson.content, makeGlossaryBlock(glossaryMarkdown)),
    }
  })
}
