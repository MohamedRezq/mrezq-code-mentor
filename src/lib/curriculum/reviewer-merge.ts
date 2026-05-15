import type { ContentBlock } from '@/types/lesson'
import type { LessonEnhancement } from '@/lib/curriculum/reviewer-types'

export function roadmapIntro(roadmapPath: string, phase: string, topics: string): ContentBlock {
  return {
    type: 'callout',
    tone: 'tip',
    title: `Reviewer note · ${phase} ([roadmap.sh](https://roadmap.sh/${roadmapPath}))`,
    content: `Aligned with the official ${roadmapPath} roadmap. Read every block and complete every exercise — no external tutorial required if you master this page. Topics: ${topics}.`,
  }
}

export function clarify(title: string, content: string): ContentBlock {
  return { type: 'callout', tone: 'clarification', title, content }
}

function standardOutroReminder(): ContentBlock {
  return {
    type: 'callout',
    tone: 'production',
    title: 'Before you leave this lesson',
    content:
      'Complete every exercise without hints first. Re-type solutions tomorrow. Explain each clarification callout in your own words before moving on.',
  }
}

export function mergeReviewerEnhancements(
  content: ContentBlock[],
  enhancement?: LessonEnhancement
): ContentBlock[] {
  const intro = enhancement?.intro ?? []
  const outro = [...(enhancement?.outro ?? []), standardOutroReminder()]

  if (intro.length === 0 && content.length === 0) return outro
  if (intro.length === 0) return [...content, ...outro]
  if (content.length === 0) return [...intro, ...outro]

  return [content[0], ...intro, ...content.slice(1), ...outro]
}
