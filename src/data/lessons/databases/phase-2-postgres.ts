import type { Lesson } from '@/types/lesson'

export const dbPostgresLessons: Lesson[] = [
  {
    id: 'db-explain-analyze',
    moduleId: 'databases',
    phaseId: 'db-postgres',
    phaseNumber: 2,
    order: 1,
    title: 'EXPLAIN & ANALYZE',
    description: 'Read query plans, spot sequential scans, and measure real execution cost in PostgreSQL.',
    duration: '1.5 h',
    difficulty: 'intermediate',
    objectives: [
      'Run EXPLAIN and EXPLAIN ANALYZE safely',
      'Interpret Seq Scan vs Index Scan vs Bitmap',
      'Use actual vs estimated rows to find stats drift',
      'Avoid EXPLAIN ANALYZE on destructive writes in prod',
    ],
    content: [
      {
        type: 'code',
        language: 'sql',
        filename: 'explain.sql',
        code: `EXPLAIN ANALYZE
SELECT * FROM orders WHERE user_id = '550e8400-e29b-41d4-a716-446655440000';

-- Look for: Seq Scan on large tables, high "rows removed by filter"
-- Index Scan / Bitmap Index Scan on indexed columns`,
        explanation: 'ANALYZE runs the query — use on SELECT in staging, not on DELETE/UPDATE in production.',
      },
      {
        type: 'exercise',
        title: 'Plan reading',
        description: 'A plan shows `Seq Scan on orders` with `rows=2M`. What is the first optimization to try?',
        language: 'sql',
        starterCode: `-- answer:
`,
        solution: `-- Add index on filtered/sorted columns (e.g. user_id) and verify with EXPLAIN again`,
      },
    ],
  },
  {
    id: 'db-query-optimization',
    moduleId: 'databases',
    phaseId: 'db-postgres',
    phaseNumber: 2,
    order: 2,
    title: 'Query Optimization',
    description: 'Covering indexes, partial indexes, query rewriting, and N+1 elimination at the SQL layer.',
    duration: '1.5 h',
    difficulty: 'intermediate',
    objectives: [
      'Design composite indexes for common WHERE + ORDER BY',
      'Use partial indexes for hot subsets',
      'Rewrite subqueries to JOINs when beneficial',
      'Batch queries instead of N+1 loops',
    ],
    content: [
      {
        type: 'code',
        language: 'sql',
        filename: 'partial-index.sql',
        code: `-- Only index active orders — smaller, faster
CREATE INDEX idx_orders_active_user
ON orders (user_id, created_at DESC)
WHERE status IN ('pending', 'paid');`,
      },
      {
        type: 'callout',
        tone: 'clarification',
        title: 'SELECT * hurts',
        content:
          'Wide rows prevent index-only scans. Select only columns you need — especially on tables with JSONB or large text columns.',
      },
      {
        type: 'exercise',
        title: 'Fix N+1',
        description: 'App loads 100 users then runs 100 queries for orders. One SQL pattern to fix it?',
        language: 'sql',
        starterCode: `-- pattern:
`,
        solution: `-- SELECT * FROM orders WHERE user_id IN (...100 ids...) — one query with JOIN or IN clause`,
      },
    ],
  },
  {
    id: 'db-partitioning',
    moduleId: 'databases',
    phaseId: 'db-postgres',
    phaseNumber: 2,
    order: 3,
    title: 'Partitioning & Archival',
    description: 'Range/list partitioning, pruning, and moving cold data without blocking writes.',
    duration: '1 h',
    difficulty: 'advanced',
    objectives: [
      'Explain when partitioning helps (time-series, multi-tenant)',
      'Use partition pruning in queries',
      'Plan detach/drop old partitions for archival',
      'Avoid over-partitioning small tables',
    ],
    content: [
      {
        type: 'text',
        markdown: `## When to partition

Partition **large** tables (millions+ rows) where queries almost always filter by partition key (e.g. \`created_at\` month). Wrong key → no pruning, only operational pain.`,
      },
      {
        type: 'code',
        language: 'sql',
        filename: 'partition.sql',
        code: `CREATE TABLE events (
  id         BIGSERIAL,
  created_at TIMESTAMPTZ NOT NULL,
  payload    JSONB
) PARTITION BY RANGE (created_at);

CREATE TABLE events_2025_01 PARTITION OF events
  FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');`,
      },
      {
        type: 'exercise',
        title: 'Partition key',
        description: 'Logs table queried by `tenant_id` and `date`. Which partition key fits most queries?',
        language: 'sql',
        starterCode: `-- key:
`,
        solution: `-- Often (tenant_id, date) or date range if queries are time-bounded per tenant`,
      },
    ],
  },
  {
    id: 'db-connection-pooling',
    moduleId: 'databases',
    phaseId: 'db-postgres',
    phaseNumber: 2,
    order: 4,
    title: 'Connection Pooling & PgBouncer',
    description: 'Why pools exist, transaction vs session pooling, and sizing for serverless vs long-lived apps.',
    duration: '1 h',
    difficulty: 'intermediate',
    objectives: [
      'Explain Postgres connection limits',
      'Configure PgBouncer for many app instances',
      'Choose pool size from CPU and workload',
      'Use transaction pooling with ORMs carefully',
    ],
    content: [
      {
        type: 'callout',
        tone: 'tip',
        title: 'Rule of thumb',
        content:
          'Postgres handles ~few hundred direct connections well. Hundreds of Node/Python workers × connections each → use PgBouncer or RDS Proxy.',
      },
      {
        type: 'exercise',
        title: 'Pool sizing',
        description: '20 API pods each open 10 DB connections. Postgres max_connections=100. What breaks and what fixes it?',
        language: 'sql',
        starterCode: `// problem:
// fix:
`,
        solution: `// 200 connections needed > 100 max — connection errors
// fix: PgBouncer with pool_size ~30-50, app uses smaller per-pod pool`,
      },
    ],
  },
]
