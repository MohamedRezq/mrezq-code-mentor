import type { ContentBlock, Lesson } from '@/types/lesson'

/** Round to nearest 0.5 hour increment (minimum 0.5h). */
export function roundToHalfHour(hours: number): number {
  const rounded = Math.round(hours * 2) / 2
  return Math.max(0.5, rounded)
}

/** Format minutes as roadmap-style duration: 0.5h, 1h, 1.5h, 2h, … */
export function formatDurationHours(totalMinutes: number): string {
  const hours = roundToHalfHour(totalMinutes / 60)
  return Number.isInteger(hours) ? `${hours}h` : `${hours}h`
}

function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length
}

function blockMinutes(block: ContentBlock): number {
  switch (block.type) {
    case 'text':
      return Math.max(2, Math.ceil(wordCount(block.markdown) / 180))
    case 'code':
      return 4 + Math.ceil(block.code.split('\n').length / 12)
    case 'callout':
      return 2
    case 'exercise':
      return 20
    default:
      return 2
  }
}

/** Estimate reading + practice time from lesson blocks (conservative for beginners). */
export function estimateLessonDurationMinutes(lesson: Pick<Lesson, 'content' | 'objectives'>): number {
  const contentMinutes = lesson.content.reduce((sum, b) => sum + blockMinutes(b), 0)
  const objectivesMinutes = lesson.objectives.length * 3
  const buffer = 8
  return Math.max(25, contentMinutes + objectivesMinutes + buffer)
}

export function withEstimatedDuration<T extends Lesson>(lesson: T): T {
  const minutes = estimateLessonDurationMinutes(lesson)
  return {
    ...lesson,
    duration: formatDurationHours(minutes),
    durationMinutes: minutes,
  }
}

export function sumModuleDurationHours(lessons: Lesson[]): string {
  const totalMinutes = lessons.reduce(
    (sum, l) => sum + (l.durationMinutes ?? estimateLessonDurationMinutes(l)),
    0
  )
  return formatDurationHours(totalMinutes)
}
