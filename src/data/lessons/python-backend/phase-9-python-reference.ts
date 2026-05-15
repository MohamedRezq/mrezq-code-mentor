import type { Lesson } from '@/types/lesson'

/** Phase py-reference — printable cheat sheet companion (also see /learn/python-backend/cheat-sheet) */
export const pythonReferenceLessons: Lesson[] = [
  {
    id: 'py-cheat-sheet',
    moduleId: 'python-backend',
    phaseId: 'py-reference',
    phaseNumber: 9,
    order: 1,
    title: 'Python quick reference & printable cheat sheet',
    description:
      'One-page-style recap of syntax, types, collections, and patterns from this module — optimized for print or Save as PDF from your browser.',
    duration: '25 min',
    difficulty: 'beginner',
    objectives: [
      'Locate any core construct from this curriculum in seconds',
      'Print or export the cheat sheet as PDF for offline review',
      'Use the sheet as a map back into deeper lessons when you forget details',
    ],
    content: [
      {
        type: 'callout',
        tone: 'important',
        title: 'Download as PDF',
        content:
          'Open the dedicated print layout, then use your browser: Print → Destination: Save as PDF. Chrome and Edge produce the cleanest results.',
      },
      {
        type: 'text',
        markdown: `## Open the printable sheet

**[Open full cheat sheet →](/learn/python-backend/cheat-sheet)**

That page includes syntax tables, built-ins, comprehensions, file/JSON/datetime snippets, and tooling reminders — everything in one scroll for print.

## How to practice (every lesson)

1. Complete every **Exercise** without peeking at hints first.
2. Re-type solutions from scratch the next day — active recall beats re-reading.
3. For API lessons later in the module, call real endpoints from the **Scripts & HTTP** lesson patterns.

## Topic map (W3Schools-style coverage + full-stack extras)

| Track | You are here |
|-------|----------------|
| Getting started · syntax · types | Lessons 1–3 |
| Strings · operators · booleans | Lessons 2–3 |
| Control flow · match | Lesson 4 |
| Loops · comprehensions | Lesson 5 |
| Functions · lambdas | Lesson 6 |
| Modules · pathlib · urllib | Lesson 7 |
| List · tuple · set · dict | Lesson 8 |
| try/except · files | Lesson 9 |
| JSON · datetime | Lesson 10 |
| Regex | Lesson 11 |
| OOP · dataclass · Protocol | Lesson 12 |
| Generators · decorators · context | Lesson 13 |
| Big O · lists/stacks · hashes · trees · sort/search | Phase 2 (DSA) |
| uv · ruff · mypy · pytest · asyncio scripts | Phase 3 |
| Django · DRF · Flask | Phase 4 |
| FastAPI · Pydantic v2 · auth · middleware | Phase 5 |
| SQLAlchemy · Alembic · Redis · Postgres tuning | Phase 6 |
| pytest · API tests · patterns | Phase 7 |
| Docker · Celery · observability · deploy | Phase 8 |
`,
      },
      {
        type: 'exercise',
        title: 'Spaced repetition checklist',
        description:
          'Without opening other lessons, write (in comments) one sentence each: when you pick `deque` over `list` for a queue; what `alembic upgrade head` does; what problem `return_exceptions=True` solves in `asyncio.gather`.',
        language: 'python',
        starterCode: `# 1. deque vs list for queue:
#
# 2. alembic upgrade head:
#
# 3. gather return_exceptions:
#
`,
        solution: `# 1. deque gives O(1) pops from the left; list.pop(0) is O(n).
# 2. Applies all pending DB migrations to match the latest schema revision.
# 3. One failing task does not cancel the others; you get exceptions as results to handle per task.
`,
        hints: ['Recall DSA lesson on queues', 'Databases phase on migrations', 'Concurrency lesson on gather'],
      },
    ],
  },
]
