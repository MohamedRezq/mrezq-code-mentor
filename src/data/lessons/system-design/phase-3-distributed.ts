import type { Lesson } from '@/types/lesson'

export const sdDistributedLessons: Lesson[] = [
  {
    id: 'sd-message-queues',
    moduleId: 'system-design',
    phaseId: 'sd-distributed',
    phaseNumber: 3,
    order: 1,
    title: 'Message Queues & Kafka',
    description: 'Topics, partitions, consumer groups, ordering guarantees, and retention.',
    duration: '1.5 h',
    difficulty: 'advanced',
    objectives: [
      'Explain partitions for parallelism',
      'Use consumer groups for scale-out processing',
      'Choose retention vs compaction',
      'Design for at-least-once delivery',
    ],
    content: [
      {
        type: 'code',
        language: 'javascript',
        filename: 'kafka-model.txt',
        code: `// Topic: orders — 12 partitions
// Key = order_id → all events for one order stay ordered in one partition
// Consumer group: 12 consumers max useful parallelism`,
      },
      {
        type: 'exercise',
        title: 'Ordering',
        description: 'Must process order created before order paid for same order_id. How to partition?',
        language: 'javascript',
        starterCode: `// key:
`,
        solution: `// partition by order_id — single partition preserves order per order`,
      },
    ],
  },
  {
    id: 'sd-event-driven',
    moduleId: 'system-design',
    phaseId: 'sd-distributed',
    phaseNumber: 3,
    order: 2,
    title: 'Event-Driven Architecture',
    description: 'Event notification vs event-carried state, choreography vs orchestration, sagas.',
    duration: '1.5 h',
    difficulty: 'advanced',
    objectives: [
      'Design events as past-tense facts',
      'Compare choreography vs orchestrator saga',
      'Plan compensating transactions',
      'Avoid event explosion without schema registry',
    ],
    content: [
      {
        type: 'exercise',
        title: 'Choreography vs orchestration',
        description: 'Three services: Order, Payment, Shipping. One benefit of orchestrator saga.',
        language: 'javascript',
        starterCode: `// benefit:
`,
        solution: `// central visibility of saga state; easier timeout/compensation logic in one place`,
      },
    ],
  },
  {
    id: 'sd-rate-limiting',
    moduleId: 'system-design',
    phaseId: 'sd-distributed',
    phaseNumber: 3,
    order: 3,
    title: 'Rate Limiting & Throttling',
    description: 'Token bucket, sliding window, distributed limits with Redis, and graceful 429 responses.',
    duration: '1 h',
    difficulty: 'intermediate',
    objectives: [
      'Implement token bucket mentally',
      'Return Retry-After headers',
      'Rate limit per API key and per IP',
      'Protect shared dependencies',
    ],
    content: [
      {
        type: 'code',
        language: 'javascript',
        filename: 'rate-limit.js',
        code: `// Redis INCR with EXPIRE — fixed window per minute
const key = \`rl:\${userId}:\${Math.floor(Date.now() / 60000)}\`
const count = await redis.incr(key)
if (count === 1) await redis.expire(key, 60)
if (count > 100) return res.status(429).json({ error: 'RATE_LIMIT' })`,
      },
      {
        type: 'exercise',
        title: '429 response',
        description: 'What headers help clients back off?',
        language: 'javascript',
        starterCode: `// headers:
`,
        solution: `// Retry-After (seconds), optional X-RateLimit-Remaining / Reset`,
      },
    ],
  },
  {
    id: 'sd-idempotency',
    moduleId: 'system-design',
    phaseId: 'sd-distributed',
    phaseNumber: 3,
    order: 4,
    title: 'Idempotency & Exactly-Once Illusion',
    description: 'Idempotent consumers, deduplication tables, and outbox pattern for reliable publish.',
    duration: '1 h',
    difficulty: 'advanced',
    objectives: [
      'Make handlers safe to retry',
      'Store processed event IDs',
      'Combine outbox with transactional writes',
      'Explain why exactly-once is hard',
    ],
    content: [
      {
        type: 'callout',
        tone: 'production',
        title: 'At-least-once + idempotent = effective exactly-once',
        content: 'Kafka delivers at-least-once. Your consumer dedupes by event id → business effect happens once.',
      },
      {
        type: 'exercise',
        title: 'Dedup table',
        description: 'Sketch columns for `processed_events` table.',
        language: 'sql',
        starterCode: `-- columns:
`,
        solution: `-- event_id PK, processed_at, handler_name — INSERT only if new`,
      },
    ],
  },
]
