import type { Lesson } from '@/types/lesson'
import { withEstimatedDuration } from '@/lib/lesson-duration'
import { mergeReviewerEnhancements } from './reviewer-enhancements'
import { pythonBasicsLessons } from './phase-1-python-basics'
import { pythonAppliedLessons } from './phase-1-python-applied'
import { pythonDSALessons } from './phase-2-dsa'
import { pythonToolingLessons } from './phase-3-tooling'
import { djangoLessons } from './phase-4-django'
import { fastapiLessons } from './phase-1-fastapi'
import { databaseLessons } from './phase-2-databases'
import { testingLessons } from './phase-3-testing'
import { productionLessons } from './phase-4-production'
import { pythonReferenceLessons } from './phase-9-python-reference'

const rawPythonLessons: Lesson[] = [
  ...pythonBasicsLessons,
  ...pythonAppliedLessons,
  ...pythonDSALessons,
  ...pythonToolingLessons,
  ...djangoLessons,
  ...fastapiLessons,
  ...databaseLessons,
  ...testingLessons,
  ...productionLessons,
  ...pythonReferenceLessons,
]

function applyReviewerPass(lesson: Lesson): Lesson {
  const withContent = {
    ...lesson,
    content: mergeReviewerEnhancements(lesson.id, lesson.content),
  }
  return withEstimatedDuration(withContent)
}

/** Reviewer pass merged + accurate 0.5h-step durations (beginner pace). */
export const pythonBackendLessons: Lesson[] = rawPythonLessons.map(applyReviewerPass)

export function getLessonById(id: string): Lesson | undefined {
  return pythonBackendLessons.find(l => l.id === id)
}

export function getLessonsByPhase(phaseId: string): Lesson[] {
  return pythonBackendLessons.filter(l => l.phaseId === phaseId).sort((a, b) => a.order - b.order)
}
