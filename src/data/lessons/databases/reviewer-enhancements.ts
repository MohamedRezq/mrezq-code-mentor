import type { LessonEnhancement } from '@/lib/curriculum/reviewer-types'
import { clarify, roadmapIntro } from '@/lib/curriculum/reviewer-merge'

export const DB_REVIEWER: Record<string, LessonEnhancement> = {
  'db-schema-design': { intro: [roadmapIntro('postgresql', 'SQL core', 'normalization, keys, constraints')] },
  'db-joins': {
    intro: [roadmapIntro('postgresql', 'SQL core', 'JOINs, GROUP BY, HAVING')],
    outro: [clarify('COUNT(*) vs COUNT(col)', 'COUNT(*) counts rows; COUNT(col) ignores NULLs in col.')],
  },
  'db-indexes-transactions': { intro: [roadmapIntro('postgresql', 'SQL core', 'indexes, ACID, isolation')] },
  'db-sql-migrations': { intro: [roadmapIntro('postgresql', 'SQL core', 'migrations, expand/contract')] },
  'db-explain-analyze': { intro: [roadmapIntro('postgresql', 'PostgreSQL', 'EXPLAIN, ANALYZE, query plans')] },
  'db-query-optimization': {
    intro: [roadmapIntro('postgresql', 'PostgreSQL', 'indexes, partial indexes, N+1')],
  },
  'db-partitioning': { intro: [roadmapIntro('postgresql', 'PostgreSQL', 'partitioning, archival')] },
  'db-connection-pooling': {
    intro: [roadmapIntro('postgresql', 'PostgreSQL', 'PgBouncer, pool sizing')],
    outro: [clarify('Transaction pooling', 'Session-level features (prepared statements, temp tables) break with transaction pooling — know your ORM settings.')],
  },
  'db-mongodb-basics': { intro: [roadmapIntro('mongodb', 'NoSQL', 'documents, CRUD, indexes')] },
  'db-redis-caching-pubsub': { intro: [roadmapIntro('redis', 'NoSQL', 'cache-aside, TTL, pub/sub')] },
  'db-document-modeling': { intro: [roadmapIntro('mongodb', 'NoSQL', 'embed vs reference, schema versioning')] },
  'db-caching-patterns': { intro: [roadmapIntro('redis', 'NoSQL', 'cache patterns, SWR, CDN')] },
  'db-orm-patterns': { intro: [roadmapIntro('postgresql', 'Advanced', 'ORM, migrations, N+1')] },
  'db-pgvector': { intro: [roadmapIntro('postgresql', 'Advanced', 'pgvector, HNSW, similarity search')] },
  'db-vector-search': { intro: [roadmapIntro('ai-engineer', 'Advanced', 'vector DBs, managed vs self-hosted')] },
  'db-ops-backup': { intro: [roadmapIntro('postgresql', 'Advanced', 'backups, replicas, PITR')] },
}
