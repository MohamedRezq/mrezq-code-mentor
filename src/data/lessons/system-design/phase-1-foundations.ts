import type { Lesson } from '@/types/lesson'

export const sdFoundationLessons: Lesson[] = [
  {
    id: 'sd-requirements',
    moduleId: 'system-design',
    phaseId: 'sd-foundations',
    phaseNumber: 1,
    order: 1,
    title: 'Requirements & Non-Functional Goals',
    description: 'Functional vs non-functional requirements, SLAs, and the questions to ask before drawing boxes.',
    duration: '1 h',
    difficulty: 'beginner',
    objectives: [
      'Clarify users, scale, latency, and consistency needs',
      'Estimate QPS and storage from DAU',
      'Identify read-heavy vs write-heavy workloads',
      'Document assumptions explicitly',
    ],
    content: [
      {
        type: 'text',
        markdown: `## Interview opening (5 minutes)

- **Who** uses it? (consumers, admins, machines)
- **How many**? (DAU, peak QPS, data retention)
- **How fast**? (p99 latency target)
- **How correct**? (strong consistency vs eventual)
- **How available**? (99.9% vs 99.99%)`,
      },
      {
        type: 'exercise',
        title: 'Back-of-envelope',
        description: '10M DAU, each user 20 reads/day, 2 writes/day. Approximate average read QPS.',
        language: 'javascript',
        starterCode: `// reads/day =
// avg QPS =
`,
        solution: `// 200M reads/day → 200e6 / 86400 ≈ 2300 read QPS average (higher at peak)`,
      },
    ],
  },
  {
    id: 'sd-api-design',
    moduleId: 'system-design',
    phaseId: 'sd-foundations',
    phaseNumber: 1,
    order: 2,
    title: 'API Design at Scale',
    description: 'REST resources, pagination, idempotency keys, versioning, and GraphQL trade-offs.',
    duration: '1 h',
    difficulty: 'intermediate',
    objectives: [
      'Design resource-oriented REST APIs',
      'Use cursor pagination for large feeds',
      'Apply idempotency for payment-like POSTs',
      'Know when GraphQL helps vs hurts',
    ],
    content: [
      {
        type: 'code',
        language: 'javascript',
        filename: 'pagination.js',
        code: `// Cursor pagination — stable under concurrent inserts
GET /posts?cursor=eyJpZCI6MTIzfQ&limit=20

// Response
{ "data": [...], "next_cursor": "eyJ..." }`,
      },
      {
        type: 'exercise',
        title: 'Idempotency',
        description: 'Why send `Idempotency-Key` header on POST /payments?',
        language: 'javascript',
        starterCode: `// reason:
`,
        solution: `// retries after timeout must not double-charge — server returns same result for same key`,
      },
    ],
  },
  {
    id: 'sd-caching',
    moduleId: 'system-design',
    phaseId: 'sd-foundations',
    phaseNumber: 1,
    order: 3,
    title: 'Caching Layers',
    description: 'Browser, CDN, application cache, database — what to cache and invalidation strategies.',
    duration: '1.5 h',
    difficulty: 'intermediate',
    objectives: [
      'Place cache at the right tier',
      'Set TTL and invalidation policies',
      'Avoid caching personalized secrets',
      'Measure hit ratio',
    ],
    content: [
      {
        type: 'callout',
        tone: 'tip',
        title: 'Cache key design',
        content: 'Include tenant/version in keys: `product:v3:{id}`. Bump version on schema change instead of flushing entire cache.',
      },
      {
        type: 'exercise',
        title: 'What not to cache',
        description: 'List three response types you should never cache at CDN edge.',
        language: 'javascript',
        starterCode: `// 1.
// 2.
// 3.
`,
        solution: `// 1. authenticated user-specific data without private cache
// 2. Set-Cookie auth responses
// 3. highly dynamic stock/auction prices unless micro-TTL`,
      },
    ],
  },
  {
    id: 'sd-stateless',
    moduleId: 'system-design',
    phaseId: 'sd-foundations',
    phaseNumber: 1,
    order: 4,
    title: 'Stateless vs Stateful Services',
    description: 'Horizontal scaling of app servers, sticky sessions, WebSocket affinity, and externalized state.',
    duration: '1 h',
    difficulty: 'intermediate',
    objectives: [
      'Store session state in Redis/DB not local memory',
      'Scale stateless API tier behind load balancer',
      'Recognize when sticky sessions are required',
      'Separate compute from data nodes',
    ],
    content: [
      {
        type: 'exercise',
        title: 'Shopping cart',
        description: 'Stateful in-memory cart on one server vs Redis cart. Which scales horizontally?',
        language: 'javascript',
        starterCode: `// choice:
`,
        solution: `// Redis/DB cart — any app instance can serve next request`,
      },
    ],
  },
]
