import type { Lesson } from '@/types/lesson'
import { pythonLessons } from './phase-0-python'
import { llmApiLessons } from './phase-1-llm-apis'
import { ragLessons } from './phase-2-rag'
import { agentLessons, productionLessons } from './phase-3-agents-and-production'

export const aiEngineeringLessons: Lesson[] = [
  ...pythonLessons,
  ...llmApiLessons,
  ...ragLessons,
  ...agentLessons,
  ...productionLessons,
]

export function getLessonById(id: string): Lesson | undefined {
  return aiEngineeringLessons.find(l => l.id === id)
}

export function getLessonsByPhase(phaseId: string): Lesson[] {
  return aiEngineeringLessons.filter(l => l.phaseId === phaseId).sort((a, b) => a.order - b.order)
}
