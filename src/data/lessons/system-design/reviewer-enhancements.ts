import type { LessonEnhancement } from '@/lib/curriculum/reviewer-types'
import { clarify, roadmapIntro } from '@/lib/curriculum/reviewer-merge'

export const SD_REVIEWER: Record<string, LessonEnhancement> = {
  'sd-requirements': { intro: [roadmapIntro('system-design', 'Foundations', 'NFRs, scale estimates, assumptions')] },
  'sd-api-design': { intro: [roadmapIntro('system-design', 'Foundations', 'REST, pagination, idempotency')] },
  'sd-caching': { intro: [roadmapIntro('system-design', 'Foundations', 'CDN, Redis, cache invalidation')] },
  'sd-stateless': {
    intro: [roadmapIntro('system-design', 'Foundations', 'stateless apps, session externalization')],
    outro: [clarify('12-factor', 'Processes should be disposable — config in env, state in backing services.')],
  },
  'sd-load-balancing': { intro: [roadmapIntro('system-design', 'Scalability', 'L4/L7, health checks')] },
  'sd-db-scaling': { intro: [roadmapIntro('system-design', 'Scalability', 'replicas, sharding, CQRS')] },
  'sd-cap': { intro: [roadmapIntro('system-design', 'Scalability', 'CAP, consistency models')] },
  'sd-cdn': { intro: [roadmapIntro('system-design', 'Scalability', 'CDN, edge caching')] },
  'sd-message-queues': { intro: [roadmapIntro('system-design', 'Distributed', 'Kafka, partitions, consumer groups')] },
  'sd-event-driven': { intro: [roadmapIntro('system-design', 'Distributed', 'events, sagas, choreography')] },
  'sd-rate-limiting': { intro: [roadmapIntro('system-design', 'Distributed', 'token bucket, 429, Redis')] },
  'sd-idempotency': { intro: [roadmapIntro('system-design', 'Distributed', 'dedup, outbox, at-least-once')] },
  'sd-solid': { intro: [roadmapIntro('system-design', 'LLD', 'SOLID, clean boundaries')] },
  'sd-patterns': { intro: [roadmapIntro('system-design', 'LLD', 'strategy, adapter, observer')] },
  'sd-adr': { intro: [roadmapIntro('system-design', 'LLD', 'ADRs, decision log')] },
  'sd-interview': {
    intro: [roadmapIntro('system-design', 'LLD', 'interview structure, trade-offs')],
    outro: [clarify('Breadth then depth', 'Cover end-to-end in 15 min, then zoom one component the interviewer cares about.')],
  },
}
