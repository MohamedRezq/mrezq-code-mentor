import type { Lesson } from '@/types/lesson'
import { withEstimatedDuration } from '@/lib/lesson-duration'
import { mergeReviewerEnhancements } from '@/lib/curriculum/reviewer-merge'
import { DEVOPS_REVIEWER } from './reviewer-enhancements'
import { devopsFoundationLessons } from './phase-1-foundations'
import { devopsAwsLessons } from './phase-2-aws'
import { devopsOrchestrationLessons } from './phase-3-orchestration'
import { devopsObservabilityLessons } from './phase-4-observability'

const rawDevopsLessons: Lesson[] = [
  ...devopsFoundationLessons,
  ...devopsAwsLessons,
  ...devopsOrchestrationLessons,
  ...devopsObservabilityLessons,
]

function applyReviewerPass(lesson: Lesson): Lesson {
  return withEstimatedDuration({
    ...lesson,
    content: mergeReviewerEnhancements(lesson.content, DEVOPS_REVIEWER[lesson.id]),
  })
}

export const devopsLessons: Lesson[] = rawDevopsLessons.map(applyReviewerPass)

export function getLessonById(id: string): Lesson | undefined {
  return devopsLessons.find((l) => l.id === id)
}

export function getLessonsByPhase(phaseId: string): Lesson[] {
  return devopsLessons.filter((l) => l.phaseId === phaseId).sort((a, b) => a.order - b.order)
}
