import type { Lesson } from '@/types/lesson'
import { withEstimatedDuration } from '@/lib/lesson-duration'
import { pythonBasicsLessons } from './phase-1-python-basics'
import { pythonAppliedLessons } from './phase-1-python-applied'
import { applyPhase1QaEnhancements } from './phase-1-qa-enhancements'
import { applyPhase1ScenarioEnhancements } from './phase-1-scenario-enhancements'
import { pythonDSALessons } from './phase-2-dsa'
import { pythonToolingLessons } from './phase-3-tooling'
import { djangoLessons } from './phase-4-django'
import { fastapiLessons } from './phase-1-fastapi'
import { databaseLessons } from './phase-2-databases'
import { testingLessons } from './phase-3-testing'
import { productionLessons } from './phase-4-production'
import { pythonReferenceLessons } from './phase-9-python-reference'

const phase1Lessons = applyPhase1ScenarioEnhancements(
  applyPhase1QaEnhancements([...pythonBasicsLessons, ...pythonAppliedLessons]),
)

const rawPythonLessons: Lesson[] = [
  ...phase1Lessons,
  ...pythonDSALessons,
  ...pythonToolingLessons,
  ...djangoLessons,
  ...fastapiLessons,
  ...databaseLessons,
  ...testingLessons,
  ...productionLessons,
  ...pythonReferenceLessons,
]

/** Accurate 0.5h-step durations from lesson content (beginner pace). */
export const pythonBackendLessons: Lesson[] = rawPythonLessons.map(withEstimatedDuration)

export function getLessonById(id: string): Lesson | undefined {
  return pythonBackendLessons.find(l => l.id === id)
}

export function getLessonsByPhase(phaseId: string): Lesson[] {
  return pythonBackendLessons.filter(l => l.phaseId === phaseId).sort((a, b) => a.order - b.order)
}
