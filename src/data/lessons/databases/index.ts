import type { Lesson } from '@/types/lesson'
import { withEstimatedDuration } from '@/lib/lesson-duration'
import { mergeReviewerEnhancements } from '@/lib/curriculum/reviewer-merge'
import { DB_REVIEWER } from './reviewer-enhancements'
import { dbSqlLessons } from './phase-1-sql'
import { dbPostgresLessons } from './phase-2-postgres'
import { dbNosqlLessons } from './phase-3-nosql'
import { dbAdvancedLessons } from './phase-4-vector'

const rawDbLessons: Lesson[] = [
  ...dbSqlLessons,
  ...dbPostgresLessons,
  ...dbNosqlLessons,
  ...dbAdvancedLessons,
]

function applyReviewerPass(lesson: Lesson): Lesson {
  return withEstimatedDuration({
    ...lesson,
    content: mergeReviewerEnhancements(lesson.content, DB_REVIEWER[lesson.id]),
  })
}

export const databaseLessons: Lesson[] = rawDbLessons.map(applyReviewerPass)

export function getLessonById(id: string): Lesson | undefined {
  return databaseLessons.find((l) => l.id === id)
}

export function getLessonsByPhase(phaseId: string): Lesson[] {
  return databaseLessons.filter((l) => l.phaseId === phaseId).sort((a, b) => a.order - b.order)
}
