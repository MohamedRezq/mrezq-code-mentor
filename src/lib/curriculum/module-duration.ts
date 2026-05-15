import { MODULES, getModule } from '@/data/modules'
import { getLessonsByModule, getLessonsByPhase } from '@/data/lessons'
import { estimateLessonDurationMinutes, sumModuleDurationHours } from '@/lib/lesson-duration'

/** Total estimated hours for a module from its lessons (e.g. "42h"). */
export function getModuleTotalDuration(moduleId: string): string {
  const lessons = getLessonsByModule(moduleId)
  if (lessons.length > 0) {
    return sumModuleDurationHours(lessons)
  }
  return getModule(moduleId)?.duration ?? '—'
}

/** Total estimated hours for a phase from its lessons. */
export function getPhaseTotalDuration(phaseId: string): string {
  const lessons = getLessonsByPhase(phaseId)
  if (lessons.length > 0) {
    return sumModuleDurationHours(lessons)
  }
  for (const mod of MODULES) {
    const phase = mod.phases.find((p) => p.id === phaseId)
    if (phase) return phase.duration
  }
  return '—'
}

/** Numeric hours for sorting or analytics. */
export function getModuleTotalDurationHours(moduleId: string): number {
  const lessons = getLessonsByModule(moduleId)
  if (lessons.length === 0) return 0
  const totalMinutes = lessons.reduce(
    (sum, l) => sum + (l.durationMinutes ?? estimateLessonDurationMinutes(l)),
    0
  )
  return totalMinutes / 60
}
