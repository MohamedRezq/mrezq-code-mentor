import type { Lesson } from '@/types/lesson'
import { withEstimatedDuration } from '@/lib/lesson-duration'
import { mergeReviewerEnhancements } from '@/lib/curriculum/reviewer-merge'
import { LEADERSHIP_REVIEWER } from './reviewer-enhancements'
import { leadershipSeniorLessons } from './phase-1-senior'
import { leadershipTechLeadLessons } from './phase-2-techlead'
import { leadershipEmLessons } from './phase-3-em'
import { leadershipDirectorLessons } from './phase-4-director'

const rawLeadershipLessons: Lesson[] = [
  ...leadershipSeniorLessons,
  ...leadershipTechLeadLessons,
  ...leadershipEmLessons,
  ...leadershipDirectorLessons,
]

function applyReviewerPass(lesson: Lesson): Lesson {
  return withEstimatedDuration({
    ...lesson,
    content: mergeReviewerEnhancements(lesson.content, LEADERSHIP_REVIEWER[lesson.id]),
  })
}

export const leadershipLessons: Lesson[] = rawLeadershipLessons.map(applyReviewerPass)
