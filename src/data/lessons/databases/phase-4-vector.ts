import type { Lesson } from '@/types/lesson'

export const dbAdvancedLessons: Lesson[] = [
  {
    id: 'db-orm-patterns',
    moduleId: 'databases',
    phaseId: 'db-advanced',
    phaseNumber: 4,
    order: 1,
    title: 'ORM Patterns (Prisma / Drizzle / SQLAlchemy)',
    description: 'Migrations owned by ORM, N+1 in ORMs, raw SQL escape hatches, and type-safe queries.',
    duration: '1.5 h',
    difficulty: 'intermediate',
    objectives: [
      'Generate migrations from schema changes',
      'Eager-load relations to avoid N+1',
      'Drop to raw SQL for complex reports',
      'Keep business logic out of migration files',
    ],
    content: [
      {
        type: 'code',
        language: 'typescript',
        filename: 'prisma-include.ts',
        code: `// Prisma — include related rows in one round-trip
const users = await prisma.user.findMany({
  include: { orders: true },
  take: 20,
})`,
        explanation: 'Without `include`, accessing user.orders in a loop triggers N+1 queries.',
      },
      {
        type: 'exercise',
        title: 'When raw SQL',
        description: 'Name two cases where you skip the ORM for raw SQL.',
        language: 'typescript',
        starterCode: `// 1.
// 2.
`,
        solution: `// 1. complex analytics / window functions
// 2. bulk updates where ORM emits inefficient queries`,
      },
    ],
  },
  {
    id: 'db-pgvector',
    moduleId: 'databases',
    phaseId: 'db-advanced',
    phaseNumber: 4,
    order: 2,
    title: 'pgvector in PostgreSQL',
    description: 'Store embeddings, cosine distance operators, indexes (HNSW/IVFFlat), and hybrid with SQL filters.',
    duration: '1.5 h',
    difficulty: 'advanced',
    objectives: [
      'Enable pgvector and choose vector dimensions',
      'Insert and query with ORDER BY distance',
      'Create HNSW index for approximate search',
      'Filter by metadata columns alongside vectors',
    ],
    content: [
      {
        type: 'code',
        language: 'sql',
        filename: 'pgvector.sql',
        code: `CREATE EXTENSION vector;

CREATE TABLE documents (
  id        UUID PRIMARY KEY,
  content   TEXT,
  embedding vector(1536)
);

CREATE INDEX ON documents USING hnsw (embedding vector_cosine_ops);

SELECT id, content
FROM documents
ORDER BY embedding <=> $1::vector
LIMIT 10;`,
        explanation:
          '<=> is cosine distance in pgvector. Combine with WHERE tenant_id = $2 for multi-tenant RAG.',
      },
      {
        type: 'exercise',
        title: 'Dimension mismatch',
        description: 'OpenAI embedding is 1536 dims but column is vector(768). What happens on insert?',
        language: 'sql',
        starterCode: `-- result:
`,
        solution: `-- Postgres error: expected 768 dimensions, not 1536 — alter column or re-embed`,
      },
    ],
  },
  {
    id: 'db-vector-search',
    moduleId: 'databases',
    phaseId: 'db-advanced',
    phaseNumber: 4,
    order: 3,
    title: 'Vector Search & Managed Stores',
    description: 'When to use Pinecone/Weaviate vs pgvector, metadata filters, and recall/latency trade-offs.',
    duration: '1 h',
    difficulty: 'advanced',
    objectives: [
      'Compare self-hosted pgvector vs managed vector DB',
      'Tune top-k and similarity thresholds',
      'Monitor recall@k on golden queries',
      'Plan re-embedding when models change',
    ],
    content: [
      {
        type: 'callout',
        tone: 'tip',
        title: 'Start simple',
        content:
          'pgvector + Postgres you already run is enough for many RAG MVPs. Move to dedicated vector DB when QPS, billion-scale, or advanced hybrid features require it.',
      },
      {
        type: 'exercise',
        title: 'Choose store',
        description: 'Startup: 500k chunks, 20 QPS, already on RDS Postgres. pgvector or Pinecone?',
        language: 'sql',
        starterCode: `-- choice + one reason:
`,
        solution: `-- pgvector — fewer moving parts, SQL filters, good enough at this scale`,
      },
    ],
  },
  {
    id: 'db-ops-backup',
    moduleId: 'databases',
    phaseId: 'db-advanced',
    phaseNumber: 4,
    order: 4,
    title: 'Backups, Replication & Ops',
    description: 'PITR, read replicas, failover basics, and runbooks for restore drills.',
    duration: '1 h',
    difficulty: 'intermediate',
    objectives: [
      'Explain WAL and point-in-time recovery',
      'Use read replicas for analytics load',
      'Test restore procedures quarterly',
      'Document RPO/RTO for your product',
    ],
    content: [
      {
        type: 'callout',
        tone: 'production',
        title: 'Untested backup = no backup',
        content:
          'Run restore drills to a staging cluster. Measure time to recover and whether application migrations match backup snapshot.',
      },
      {
        type: 'exercise',
        title: 'RPO / RTO',
        description: 'Define RPO and RTO for a payment system in one sentence each.',
        language: 'sql',
        starterCode: `// RPO:
// RTO:
`,
        solution: `// RPO: max acceptable data loss (e.g. 5 min of transactions)
// RTO: max downtime to restore service (e.g. 30 min)`,
      },
    ],
  },
]
