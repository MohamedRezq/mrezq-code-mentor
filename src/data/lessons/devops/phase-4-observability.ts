import type { Lesson } from '@/types/lesson'

export const devopsObservabilityLessons: Lesson[] = [
  {
    id: 'do-metrics',
    moduleId: 'devops',
    phaseId: 'do-observability',
    phaseNumber: 4,
    order: 1,
    title: 'Metrics with Prometheus',
    description: 'Counters, gauges, histograms, PromQL basics, and alerting rules.',
    duration: '1.5 h',
    difficulty: 'intermediate',
    objectives: ['Instrument RED metrics (rate, errors, duration)', 'Write basic PromQL', 'Set alert on SLO burn', 'Avoid high-cardinality labels'],
    content: [
      {
        type: 'callout',
        tone: 'clarification',
        title: 'Cardinality',
        content: 'Never label metrics with `user_id` on high-traffic paths — explodes time series count and cost.',
      },
      {
        type: 'exercise',
        title: 'Alert',
        description: 'Alert when error rate > 5% for 5 minutes. Metric types involved?',
        language: 'yaml',
        starterCode: `// metrics:
`,
        solution: `// counter http_requests_total{status} — ratio of 5xx to total over 5m window`,
      },
    ],
  },
  {
    id: 'do-logging',
    moduleId: 'devops',
    phaseId: 'do-observability',
    phaseNumber: 4,
    order: 2,
    title: 'Centralized Logging',
    description: 'Structured JSON logs, aggregation (ELK/Loki), correlation IDs.',
    duration: '1 h',
    difficulty: 'intermediate',
    objectives: ['Log JSON with request_id', 'Ship logs off-node', 'Search by trace id', 'Set retention policies'],
    content: [
      {
        type: 'code',
        language: 'javascript',
        filename: 'log.js',
        code: `logger.info({ request_id, user_id, msg: 'order_created', order_id })`,
      },
      {
        type: 'exercise',
        title: 'Correlation',
        description: 'How does request_id help during an incident?',
        language: 'javascript',
        starterCode: `// help:
`,
        solution: `// filter all log lines across services for one user request path`,
      },
    ],
  },
  {
    id: 'do-tracing',
    moduleId: 'devops',
    phaseId: 'do-observability',
    phaseNumber: 4,
    order: 3,
    title: 'Distributed Tracing',
    description: 'OpenTelemetry spans, context propagation, and finding slow hops.',
    duration: '1 h',
    difficulty: 'advanced',
    objectives: ['Create parent/child spans', 'Propagate trace context over HTTP', 'Find p99 bottleneck service', 'Sample traces in high traffic'],
    content: [
      {
        type: 'exercise',
        title: 'Slow trace',
        description: 'Trace shows 2s in payment service, 50ms elsewhere. Next step?',
        language: 'javascript',
        starterCode: `// step:
`,
        solution: `// drill into payment spans / DB queries / external API calls in that service`,
      },
    ],
  },
  {
    id: 'do-oncall',
    moduleId: 'devops',
    phaseId: 'do-observability',
    phaseNumber: 4,
    order: 4,
    title: 'On-Call & Incident Response',
    description: 'Runbooks, severity levels, postmortems, and blameless culture.',
    duration: '1 h',
    difficulty: 'intermediate',
    objectives: ['Define SEV1–SEV3', 'Write a one-page runbook', 'Conduct blameless postmortem', 'Track action items to completion'],
    content: [
      {
        type: 'callout',
        tone: 'production',
        title: 'Blameless postmortem',
        content: 'Focus on systems and process: what failed, how detected, how to prevent — not who to blame.',
      },
      {
        type: 'exercise',
        title: 'Runbook',
        description: 'List three sections every runbook for "API 5xx spike" should have.',
        language: 'markdown',
        starterCode: `// 1.
// 2.
// 3.
`,
        solution: `// 1. symptoms & dashboards
// 2. mitigation steps (scale, rollback, feature flag)
// 3. escalation contacts & comms template`,
      },
    ],
  },
]
