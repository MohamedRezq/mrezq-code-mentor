import type { Lesson } from '@/types/lesson'
import { fastapiLessons } from './phase-1-fastapi'
import { databaseLessons } from './phase-2-databases'
import { testingLessons } from './phase-3-testing'
import { productionLessons } from './phase-4-production'

export const pythonBackendLessons: Lesson[] = [
  ...fastapiLessons,
  ...databaseLessons,
  ...testingLessons,
  ...productionLessons,
]

export function getLessonById(id: string): Lesson | undefined {
  return pythonBackendLessons.find(l => l.id === id)
}

export function getLessonsByPhase(phaseId: string): Lesson[] {
  return pythonBackendLessons.filter(l => l.phaseId === phaseId).sort((a, b) => a.order - b.order)
}
