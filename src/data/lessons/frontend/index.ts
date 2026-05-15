import type { Lesson } from '@/types/lesson'
import { withEstimatedDuration } from '@/lib/lesson-duration'
import { mergeReviewerEnhancements } from '@/lib/curriculum/reviewer-merge'
import { FRONTEND_REVIEWER } from './reviewer-enhancements'
import { webCoreLessons } from './phase-1-web-core'
import { reactLessons } from './phase-2-react'
import { nextjsLessons } from './phase-3-nextjs'
import { qualityLessons } from './phase-4-quality'

const rawFrontendLessons: Lesson[] = [...webCoreLessons, ...reactLessons, ...nextjsLessons, ...qualityLessons]

function applyReviewerPass(lesson: Lesson): Lesson {
  return withEstimatedDuration({
    ...lesson,
    content: mergeReviewerEnhancements(lesson.content, FRONTEND_REVIEWER[lesson.id]),
  })
}

export const frontendLessons: Lesson[] = rawFrontendLessons.map(applyReviewerPass)

export function getLessonById(id: string): Lesson | undefined {
  return frontendLessons.find((l) => l.id === id)
}

export function getLessonsByPhase(phaseId: string): Lesson[] {
  return frontendLessons.filter((l) => l.phaseId === phaseId).sort((a, b) => a.order - b.order)
}
