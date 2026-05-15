import type { Lesson } from '@/types/lesson'
import { withEstimatedDuration } from '@/lib/lesson-duration'
import { mergeReviewerEnhancements } from '@/lib/curriculum/reviewer-merge'
import { CS_REVIEWER } from './reviewer-enhancements'
import { csBasicsLessons } from './phase-1-foundations'
import { csCoreLessons } from './phase-2-core'
import { csAdvancedLessons } from './phase-3-advanced'

const rawCsLessons: Lesson[] = [...csBasicsLessons, ...csCoreLessons, ...csAdvancedLessons]

function applyReviewerPass(lesson: Lesson): Lesson {
  return withEstimatedDuration({
    ...lesson,
    content: mergeReviewerEnhancements(lesson.content, CS_REVIEWER[lesson.id]),
  })
}

export const csFundamentalsLessons: Lesson[] = rawCsLessons.map(applyReviewerPass)

export function getLessonById(id: string): Lesson | undefined {
  return csFundamentalsLessons.find((l) => l.id === id)
}

export function getLessonsByPhase(phaseId: string): Lesson[] {
  return csFundamentalsLessons.filter((l) => l.phaseId === phaseId).sort((a, b) => a.order - b.order)
}
