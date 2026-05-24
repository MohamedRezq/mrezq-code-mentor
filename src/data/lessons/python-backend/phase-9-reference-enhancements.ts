import type { ContentBlock, Lesson } from '@/types/lesson'

const phase9Blocks: Record<string, string[]> = {
  'py-cheat-sheet': [
    `## Beginner TL;DR

Use this lesson as your fast recall map:
- syntax memory refresh
- API and tooling command reminders
- pointers back to deep lessons`,
    `## Quick reference: daily 15-minute review loop

1. Read one table from the cheat sheet
2. Re-type one snippet from memory
3. Run it and confirm output
4. Note one concept to revisit in the full lesson`,
    `## Output walkthrough

\`\`\`python
topics = ["syntax", "api", "testing", "deploy"]
print(len(topics))
print(topics[0], topics[-1])
\`\`\`

Expected:
\`\`\`
4
syntax deploy
\`\`\``,
  ],
}

function toBlocks(markdowns: string[]): ContentBlock[] {
  return markdowns.map(markdown => ({ type: 'text', markdown }))
}

export function applyPhase9ReferenceEnhancements(lessons: Lesson[]): Lesson[] {
  return lessons.map(lesson => {
    const markdowns = phase9Blocks[lesson.id]
    if (!markdowns) return lesson
    return {
      ...lesson,
      content: [...toBlocks(markdowns), ...lesson.content],
    }
  })
}
