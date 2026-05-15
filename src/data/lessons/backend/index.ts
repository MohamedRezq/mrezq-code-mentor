import type { Lesson } from '@/types/lesson'
import { withEstimatedDuration } from '@/lib/lesson-duration'
import { mergeReviewerEnhancements } from '@/lib/curriculum/reviewer-merge'
import { BACKEND_REVIEWER } from './reviewer-enhancements'
import { backendCoreLessons } from './phase-1-core'
import { backendAuthLessons } from './phase-2-auth'
import { backendScaleLessons } from './phase-3-scale'

const rawBackendLessons: Lesson[] = [
  ...backendCoreLessons,
  ...backendAuthLessons,
  ...backendScaleLessons,
]

function applyReviewerPass(lesson: Lesson): Lesson {
  return withEstimatedDuration({
    ...lesson,
    content: mergeReviewerEnhancements(lesson.content, BACKEND_REVIEWER[lesson.id]),
  })
}

export const backendLessons: Lesson[] = rawBackendLessons.map(applyReviewerPass)

export function getLessonById(id: string): Lesson | undefined {
  return backendLessons.find((l) => l.id === id)
}

export function getLessonsByPhase(phaseId: string): Lesson[] {
  return backendLessons.filter((l) => l.phaseId === phaseId).sort((a, b) => a.order - b.order)
}
