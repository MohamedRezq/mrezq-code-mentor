import type { Lesson } from '@/types/lesson'
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

export const pythonBackendLessons: Lesson[] = [
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

export function getLessonById(id: string): Lesson | undefined {
  return pythonBackendLessons.find(l => l.id === id)
}

export function getLessonsByPhase(phaseId: string): Lesson[] {
  return pythonBackendLessons.filter(l => l.phaseId === phaseId).sort((a, b) => a.order - b.order)
}
