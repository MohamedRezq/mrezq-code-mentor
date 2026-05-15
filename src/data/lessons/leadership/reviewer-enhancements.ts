import type { LessonEnhancement } from '@/lib/curriculum/reviewer-types'
import { roadmapIntro } from '@/lib/curriculum/reviewer-merge'

const ids = [
  'lead-code-review', 'lead-mentoring', 'lead-rfc', 'lead-adr',
  'lead-architecture', 'lead-planning', 'lead-1on1', 'lead-stakeholders',
  'lead-hiring', 'lead-performance', 'lead-okrs', 'lead-team-health',
  'lead-org-design', 'lead-strategy', 'lead-budget', 'lead-executive-comms',
]

export const LEADERSHIP_REVIEWER: Record<string, LessonEnhancement> = Object.fromEntries(
  ids.map((id) => [id, { intro: [roadmapIntro('engineering-manager', 'Leadership', id.replace('lead-', ''))] }])
)
