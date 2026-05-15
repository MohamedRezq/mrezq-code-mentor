import type { Lesson } from '@/types/lesson'

export const sdScaleLessons: Lesson[] = [
  {
    id: 'sd-load-balancing',
    moduleId: 'system-design',
    phaseId: 'sd-scale',
    phaseNumber: 2,
    order: 1,
    title: 'Load Balancing',
    description: 'L4 vs L7 balancers, health checks, round-robin vs least-connections, and global load balancing.',
    duration: '1 h',
    difficulty: 'intermediate',
    objectives: [
      'Place load balancers in a reference architecture',
      'Configure health checks and draining',
      'Compare algorithms for long-lived connections',
      'Use DNS/geo routing for multi-region',
    ],
    content: [
      {
        type: 'callout',
        tone: 'clarification',
        title: 'L7 can route by path',
        content: 'Application load balancers terminate TLS and route `/api` vs `/static` to different target groups.',
      },
      {
        type: 'exercise',
        title: 'Unhealthy instance',
        description: 'Health check fails on one of four nodes. What should the LB do?',
        language: 'javascript',
        starterCode: `// behavior:
`,
        solution: `// stop sending new traffic; drain existing connections; alert ops`,
      },
    ],
  },
  {
    id: 'sd-db-scaling',
    moduleId: 'system-design',
    phaseId: 'sd-scale',
    phaseNumber: 2,
    order: 2,
    title: 'Database Scaling',
    description: 'Read replicas, sharding keys, federation, and CQRS overview.',
    duration: '1.5 h',
    difficulty: 'advanced',
    objectives: [
      'Offload analytics to read replicas',
      'Choose shard keys to avoid hotspots',
      'Explain CQRS read/write split',
      'Know cross-shard query pain',
    ],
    content: [
      {
        type: 'text',
        markdown: `## Sharding

Split data by **shard key** (user_id, tenant_id). User-scoped queries hit one shard. Global admin reports need scatter-gather or separate OLAP store.`,
      },
      {
        type: 'exercise',
        title: 'Hot shard',
        description: 'Shard by `country` and USA has 80% traffic. Problem and better key?',
        language: 'javascript',
        starterCode: `// problem:
// better key:
`,
        solution: `// hotspot on USA shard
// hash(user_id) or tenant_id for even spread`,
      },
    ],
  },
  {
    id: 'sd-cap',
    moduleId: 'system-design',
    phaseId: 'sd-scale',
    phaseNumber: 2,
    order: 3,
    title: 'CAP Theorem & Consistency',
    description: 'Consistency, availability, partition tolerance — practical trade-offs in distributed systems.',
    duration: '1 h',
    difficulty: 'intermediate',
    objectives: [
      'State CAP applies during network partitions',
      'Compare strong vs eventual consistency',
      'Give examples: CP vs AP systems',
      'Choose consistency per use case',
    ],
    content: [
      {
        type: 'callout',
        tone: 'clarification',
        title: 'PACELC',
        content: 'Even without partition (P), there is latency vs consistency trade-off (e.g. Dynamo-style systems).',
      },
      {
        type: 'exercise',
        title: 'Bank balance',
        description: 'Strong or eventual consistency for account balance reads after transfer?',
        language: 'javascript',
        starterCode: `// choice:
`,
        solution: `// strong consistency (or read-your-writes) — money must not appear lost`,
      },
    ],
  },
  {
    id: 'sd-cdn',
    moduleId: 'system-design',
    phaseId: 'sd-scale',
    phaseNumber: 2,
    order: 4,
    title: 'CDN & Edge',
    description: 'Static asset delivery, edge caching, origin shielding, and DDoS absorption at edge.',
    duration: '1 h',
    difficulty: 'intermediate',
    objectives: [
      'Cache static assets at CDN',
      'Version filenames for cache busting',
      'Reduce origin load with long TTL + invalidation',
      'Place WAF at edge',
    ],
    content: [
      {
        type: 'exercise',
        title: 'Cache busting',
        description: 'Why `app.v2.3.1.js` instead of `app.js` for CDN deployment?',
        language: 'javascript',
        starterCode: `// reason:
`,
        solution: `// immutable filename = infinite TTL; new deploy = new URL, no stale JS for users`,
      },
    ],
  },
]
