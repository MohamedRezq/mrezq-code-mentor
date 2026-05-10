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
| Tooling: venv, ruff, pytest, asyncio | Phase 3 |
| httpx · dotenv · argparse | \`py-fullstack-scripts\` |
| Django · Flask · FastAPI → Production | Phases 4–8 |
`,
      },
    ],
  },
]
