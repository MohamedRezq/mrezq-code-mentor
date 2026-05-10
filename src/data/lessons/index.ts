import type { Lesson } from '@/types/lesson'
import { aiEngineeringLessons } from './ai-engineering'
import { pythonBackendLessons } from './python-backend'

export const ALL_LESSONS: Lesson[] = [...aiEngineeringLessons, ...pythonBackendLessons]

export function getLessonById(id: string): Lesson | undefined {
  return ALL_LESSONS.find(l => l.id === id)
}

export function getLessonsByModule(moduleId: string): Lesson[] {
  return ALL_LESSONS.filter(l => l.moduleId === moduleId).sort((a, b) => {
    if (a.phaseNumber !== b.phaseNumber) return a.phaseNumber - b.phaseNumber
    return a.order - b.order
  })
}

export function getLessonsByPhase(phaseId: string): Lesson[] {
  return ALL_LESSONS.filter(l => l.phaseId === phaseId).sort((a, b) => a.order - b.order)
}

export function getAdjacentLessons(lessonId: string): { prev?: Lesson; next?: Lesson } {
  const lesson = getLessonById(lessonId)
  if (!lesson) return {}
  const moduleLessons = getLessonsByModule(lesson.moduleId)
  const idx = moduleLessons.findIndex(l => l.id === lessonId)
  return {
    prev: idx > 0 ? moduleLessons[idx - 1] : undefined,
    next: idx < moduleLessons.length - 1 ? moduleLessons[idx + 1] : undefined,
  }
}
