import type { Lesson } from '@/types/lesson'
import { withEstimatedDuration } from '@/lib/lesson-duration'
import { mergeReviewerEnhancements } from '@/lib/curriculum/reviewer-merge'
import { AI_REVIEWER } from './reviewer-enhancements'
import { pythonLessons } from './phase-0-python'
import { llmApiLessons } from './phase-1-llm-apis'
import { ragLessons } from './phase-2-rag'
import { agentLessons, productionLessons } from './phase-3-agents-and-production'

const rawAiLessons: Lesson[] = [
  ...pythonLessons,
  ...llmApiLessons,
  ...ragLessons,
  ...agentLessons,
  ...productionLessons,
]

function applyReviewerPass(lesson: Lesson): Lesson {
  return withEstimatedDuration({
    ...lesson,
    content: mergeReviewerEnhancements(lesson.content, AI_REVIEWER[lesson.id]),
  })
}

export const aiEngineeringLessons: Lesson[] = rawAiLessons.map(applyReviewerPass)

export function getLessonById(id: string): Lesson | undefined {
  return aiEngineeringLessons.find((l) => l.id === id)
}

export function getLessonsByPhase(phaseId: string): Lesson[] {
  return aiEngineeringLessons.filter((l) => l.phaseId === phaseId).sort((a, b) => a.order - b.order)
}
