import type { Lesson } from '@/types/lesson'

export const sdLldLessons: Lesson[] = [
  {
    id: 'sd-solid',
    moduleId: 'system-design',
    phaseId: 'sd-lld',
    phaseNumber: 4,
    order: 1,
    title: 'SOLID in System Components',
    description: 'Single responsibility, dependency inversion, and interfaces at service boundaries.',
    duration: '1 h',
    difficulty: 'intermediate',
    objectives: [
      'Apply SRP to modules and services',
      'Depend on interfaces not concrete vendors',
      'Open/closed via extension points',
      'Avoid god classes in domain layer',
    ],
    content: [
      {
        type: 'exercise',
        title: 'DIP example',
        description: 'PaymentService calls Stripe directly everywhere. One refactor using DIP.',
        language: 'typescript',
        starterCode: `// refactor:
`,
        solution: `// interface PaymentGateway { charge(...) }; StripeGateway implements; inject in constructor`,
      },
    ],
  },
  {
    id: 'sd-patterns',
    moduleId: 'system-design',
    phaseId: 'sd-lld',
    phaseNumber: 4,
    order: 2,
    title: 'Design Patterns in Practice',
    description: 'Strategy, factory, observer, and adapter — when they help and when they over-engineer.',
    duration: '1 h',
    difficulty: 'intermediate',
    objectives: [
      'Use strategy for pluggable algorithms',
      'Adapter for third-party APIs',
      'Observer for domain events in-process',
      'Skip patterns until pain is real',
    ],
    content: [
      {
        type: 'exercise',
        title: 'Pick a pattern',
        description: 'Notify email, SMS, push on OrderPlaced. Which pattern fits?',
        language: 'typescript',
        starterCode: `// pattern:
`,
        solution: `// observer or pub/sub list of Notifier implementations — open for new channels`,
      },
    ],
  },
  {
    id: 'sd-adr',
    moduleId: 'system-design',
    phaseId: 'sd-lld',
    phaseNumber: 4,
    order: 3,
    title: 'Architecture Decision Records',
    description: 'Document context, decision, consequences — ADR template for teams.',
    duration: '45 min',
    difficulty: 'beginner',
    objectives: [
      'Write ADR-001 in standard format',
      'Capture rejected alternatives',
      'Link ADRs to RFCs and PRs',
      'Review ADRs when context changes',
    ],
    content: [
      {
        type: 'text',
        markdown: `## ADR template

1. **Title** — short decision name
2. **Status** — proposed | accepted | deprecated
3. **Context** — forces and constraints
4. **Decision** — what we will do
5. **Consequences** — positive, negative, risks`,
      },
      {
        type: 'exercise',
        title: 'ADR draft',
        description: 'Write one-sentence Context and Decision for "Use Postgres instead of Mongo for orders".',
        language: 'markdown',
        starterCode: `// Context:
// Decision:
`,
        solution: `// Context: need ACID transactions and relational reports on orders
// Decision: Postgres primary store; revisit if document flexibility proves critical`,
      },
    ],
  },
  {
    id: 'sd-interview',
    moduleId: 'system-design',
    phaseId: 'sd-lld',
    phaseNumber: 4,
    order: 4,
    title: 'System Design Interview Walkthrough',
    description: 'End-to-end: design URL shortener / rate limiter — structure, depth, and communication tips.',
    duration: '2 h',
    difficulty: 'advanced',
    objectives: [
      'Follow a 45-minute timeline',
      'Draw API, data model, and scaling path',
      'Discuss bottlenecks before deep-diving one area',
      'Summarize trade-offs at the end',
    ],
    content: [
      {
        type: 'text',
        markdown: `## URL shortener sketch (high level)

1. **API** — POST /urls (long → short), GET /:code → 302
2. **Store** — short_code PK, long_url, user_id, created_at
3. **Scale** — cache hot codes in Redis, read replicas, base62 ID generation
4. **Deep dive** — collision handling, analytics click stream to Kafka`,
      },
      {
        type: 'exercise',
        title: 'Your turn',
        description: 'Pick one component to deep-dive for URL shortener: ID generation, redirect path, or analytics. List 3 talking points.',
        language: 'javascript',
        starterCode: `// component:
// 1.
// 2.
// 3.
`,
        solution: `// e.g. redirect: Redis cache, 302 vs 301, geo CDN not needed, rate limit abuse`,
      },
    ],
  },
]
