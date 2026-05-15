import type { LessonEnhancement } from '@/lib/curriculum/reviewer-types'
import { roadmapIntro } from '@/lib/curriculum/reviewer-merge'

const ids = [
  'sec-owasp', 'sec-xss', 'sec-csrf', 'sec-injection',
  'sec-iam-cloud', 'sec-network', 'sec-encryption', 'sec-supply-chain',
  'sec-sast', 'sec-dast', 'sec-threat-model', 'sec-secure-sdlc',
  'sec-incident', 'sec-compliance', 'sec-cspm', 'sec-red-team',
]

export const SECURITY_REVIEWER: Record<string, LessonEnhancement> = Object.fromEntries(
  ids.map((id) => [id, { intro: [roadmapIntro('cyber-security', 'Security', id.replace('sec-', ''))] }])
)
