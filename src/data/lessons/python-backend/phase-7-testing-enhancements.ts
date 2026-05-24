import type { ContentBlock, Lesson } from '@/types/lesson'

const phase7Blocks: Record<string, string[]> = {
  'pb-test-pytest': [
    `## Beginner TL;DR

pytest essentials:
- test files named \`test_*.py\`
- reusable fixtures in \`conftest.py\`
- parametrize for many cases
- clear assertions with one expected behavior per test`,
    `## Quick reference: useful commands

\`\`\`bash
uv run pytest
uv run pytest tests/unit/ -v
uv run pytest -k "auth"
uv run pytest --lf
\`\`\``,
    `## Real scenario

Bug appears only with one edge input.  
Convert the bug into a regression test first, then fix code, then keep the test permanently.`,
  ],
  'pb-test-api': [
    `## Beginner TL;DR

Integration tests validate full request flow:
client -> route -> dependencies -> DB -> response`,
    `## Quick reference: what to assert

- status code
- response schema keys
- critical business conditions
- access control behavior (401/403 cases)`,
    `## Output walkthrough

\`\`\`python
result = {"status_code": 201, "body_has_token": True}
print(result["status_code"] == 201 and result["body_has_token"])
\`\`\`

Expected:
\`\`\`
True
\`\`\``,
  ],
  'pb-test-patterns': [
    `## Beginner TL;DR

Scale test suites with:
- factories for setup reuse
- mocks for external services
- coverage thresholds in CI`,
    `## Quick reference: quality gate

Set CI to fail when:
- tests fail
- coverage drops below target
- slow tests exceed budget`,
    `## Common mistakes

- Mocking too much (tests no longer represent behavior)
- Depending on live external APIs in CI
- Large test setup duplicated in many files instead of shared factories`,
  ],
}

function toBlocks(markdowns: string[]): ContentBlock[] {
  return markdowns.map(markdown => ({ type: 'text', markdown }))
}

export function applyPhase7TestingEnhancements(lessons: Lesson[]): Lesson[] {
  return lessons.map(lesson => {
    const markdowns = phase7Blocks[lesson.id]
    if (!markdowns) return lesson
    return {
      ...lesson,
      content: [...toBlocks(markdowns), ...lesson.content],
    }
  })
}
