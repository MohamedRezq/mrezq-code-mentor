import type { Lesson } from '@/types/lesson'
import { withEstimatedDuration } from '@/lib/lesson-duration'
import { mergeReviewerEnhancements } from '@/lib/curriculum/reviewer-merge'
import { SECURITY_REVIEWER } from './reviewer-enhancements'
import { securityAppLessons } from './phase-1-app'
import { securityCloudLessons } from './phase-2-cloud'
import { securityDevsecopsLessons } from './phase-3-devsecops'
import { securityOpsLessons } from './phase-4-ops'

const rawSecurityLessons: Lesson[] = [
  ...securityAppLessons,
  ...securityCloudLessons,
  ...securityDevsecopsLessons,
  ...securityOpsLessons,
]

function applyReviewerPass(lesson: Lesson): Lesson {
  return withEstimatedDuration({
    ...lesson,
    content: mergeReviewerEnhancements(lesson.content, SECURITY_REVIEWER[lesson.id]),
  })
}

export const securityLessons: Lesson[] = rawSecurityLessons.map(applyReviewerPass)
