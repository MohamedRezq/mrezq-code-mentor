import type { Lesson } from '@/types/lesson'
import { withEstimatedDuration } from '@/lib/lesson-duration'
import { mergeReviewerEnhancements } from '@/lib/curriculum/reviewer-merge'
import { SD_REVIEWER } from './reviewer-enhancements'
import { sdFoundationLessons } from './phase-1-foundations'
import { sdScaleLessons } from './phase-2-scale'
import { sdDistributedLessons } from './phase-3-distributed'
import { sdLldLessons } from './phase-4-lld'

const rawSdLessons: Lesson[] = [
  ...sdFoundationLessons,
  ...sdScaleLessons,
  ...sdDistributedLessons,
  ...sdLldLessons,
]

function applyReviewerPass(lesson: Lesson): Lesson {
  return withEstimatedDuration({
    ...lesson,
    content: mergeReviewerEnhancements(lesson.content, SD_REVIEWER[lesson.id]),
  })
}

export const systemDesignLessons: Lesson[] = rawSdLessons.map(applyReviewerPass)

export function getLessonById(id: string): Lesson | undefined {
  return systemDesignLessons.find((l) => l.id === id)
}

export function getLessonsByPhase(phaseId: string): Lesson[] {
  return systemDesignLessons.filter((l) => l.phaseId === phaseId).sort((a, b) => a.order - b.order)
}
