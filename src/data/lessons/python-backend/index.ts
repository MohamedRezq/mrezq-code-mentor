import type { Lesson } from '@/types/lesson'
import { withEstimatedDuration } from '@/lib/lesson-duration'
import { pythonBasicsLessons } from './phase-1-python-basics'
import { pythonAppliedLessons } from './phase-1-python-applied'
import { applyPhase1BeginnerEnhancements } from './phase-1-beginner-enhancements'
import { applyPhase1QaEnhancements } from './phase-1-qa-enhancements'
import { applyPhase1ScenarioEnhancements } from './phase-1-scenario-enhancements'
import { applyPhase1DeepEnhancements } from './phase-1-deep-enhancements'
import { pythonDSALessons } from './phase-2-dsa'
import { applyPhase2BeginnerEnhancements } from './phase-2-beginner-enhancements'
import { applyPhase2DsaEnhancements } from './phase-2-dsa-enhancements'
import { applyPhase2DeepEnhancements } from './phase-2-deep-enhancements'
import { applyPhase12OutputEnhancements } from './phase-1-2-output-enhancements'
import { pythonToolingLessons } from './phase-3-tooling'
import { applyPhase3ToolingEnhancements } from './phase-3-tooling-enhancements'
import { applyPhase3DeepEnhancements } from './phase-3-deep-enhancements'
import { djangoLessons } from './phase-4-django'
import { applyPhase4FrameworkEnhancements } from './phase-4-framework-enhancements'
import { fastapiLessons } from './phase-1-fastapi'
import { applyPhase5FastapiEnhancements } from './phase-5-fastapi-enhancements'
import { databaseLessons } from './phase-2-databases'
import { applyPhase6DatabaseEnhancements } from './phase-6-database-enhancements'
import { testingLessons } from './phase-3-testing'
import { applyPhase7TestingEnhancements } from './phase-7-testing-enhancements'
import { productionLessons } from './phase-4-production'
import { applyPhase8ProductionEnhancements } from './phase-8-production-enhancements'
import { pythonReferenceLessons } from './phase-9-python-reference'
import { applyPhase9ReferenceEnhancements } from './phase-9-reference-enhancements'

const phase1Lessons = applyPhase1DeepEnhancements(
  applyPhase1ScenarioEnhancements(
    applyPhase1QaEnhancements(applyPhase1BeginnerEnhancements([...pythonBasicsLessons, ...pythonAppliedLessons])),
  ),
)
const phase2Lessons = applyPhase2DeepEnhancements(
  applyPhase2DsaEnhancements(applyPhase2BeginnerEnhancements([...pythonDSALessons])),
)
const phase12Lessons = applyPhase12OutputEnhancements([...phase1Lessons, ...phase2Lessons])
const phase3Lessons = applyPhase3DeepEnhancements(applyPhase3ToolingEnhancements([...pythonToolingLessons]))
const phase4Lessons = applyPhase4FrameworkEnhancements([...djangoLessons])
const phase5Lessons = applyPhase5FastapiEnhancements([...fastapiLessons])
const phase6Lessons = applyPhase6DatabaseEnhancements([...databaseLessons])
const phase7Lessons = applyPhase7TestingEnhancements([...testingLessons])
const phase8Lessons = applyPhase8ProductionEnhancements([...productionLessons])
const phase9Lessons = applyPhase9ReferenceEnhancements([...pythonReferenceLessons])

const rawPythonLessons: Lesson[] = [
  ...phase12Lessons,
  ...phase3Lessons,
  ...phase4Lessons,
  ...phase5Lessons,
  ...phase6Lessons,
  ...phase7Lessons,
  ...phase8Lessons,
  ...phase9Lessons,
]

/** Accurate 0.5h-step durations from lesson content (beginner pace). */
export const pythonBackendLessons: Lesson[] = rawPythonLessons.map(withEstimatedDuration)

export function getLessonById(id: string): Lesson | undefined {
  return pythonBackendLessons.find(l => l.id === id)
}

export function getLessonsByPhase(phaseId: string): Lesson[] {
  return pythonBackendLessons.filter(l => l.phaseId === phaseId).sort((a, b) => a.order - b.order)
}
