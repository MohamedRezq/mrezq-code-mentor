import type { ContentBlock, Lesson } from '@/types/lesson'

const phase6Blocks: Record<string, string[]> = {
  'pb-db-sqlalchemy': [
    `## Beginner TL;DR

SQLAlchemy 2.0 async stack:
- define typed models
- create async engine/session
- inject session in routes
- commit/rollback safely`,
    `## Quick reference: CRUD flow

\`\`\`python
obj = User(name="A", email="a@x.com", password_hash="...")
db.add(obj)
await db.flush()
await db.refresh(obj)
print(obj.id)
\`\`\`

Expected output shape:
\`\`\`
1
\`\`\``,
    `## Common mistakes

- Using sync DB calls inside async routes
- Forgetting transaction rollback on exceptions
- Relying on lazy loading in async code`,
  ],
  'pb-db-alembic': [
    `## Beginner TL;DR

Alembic tracks schema history in versioned migration files.  
Never change applied migration files in team projects.  
Always add a new migration.`,
    `## Quick reference: migration cycle

\`\`\`bash
alembic revision --autogenerate -m "add comments table"
alembic upgrade head
alembic current
\`\`\`

Rollback one step:
\`\`\`bash
alembic downgrade -1
\`\`\``,
    `## Real scenario

You add a new column used by next release.  
Deploy migration first, then deploy app code using that column. This prevents rollout-time crashes.`,
  ],
  'pb-db-queries': [
    `## Beginner TL;DR

Performance comes from query shape:
- avoid N+1
- preload relations
- paginate lists
- aggregate in SQL, not in Python loops`,
    `## Quick reference: eager loading rule

- \`selectinload\` for collections
- \`joinedload\` for single related objects

This removes many hidden query round trips.`,
    `## Output walkthrough

\`\`\`python
stats = {"total_posts": 18, "published_posts": 12, "draft_posts": 6}
print(stats["total_posts"] - stats["published_posts"])
\`\`\`

Expected:
\`\`\`
6
\`\`\``,
  ],
  'pb-db-redis': [
    `## Beginner TL;DR

Redis is for fast ephemeral data:
- cache hot reads
- session-like state
- token blacklist
- counters/rate limits`,
    `## Quick reference: cache-aside pattern

1) read cache key  
2) if miss, read DB  
3) store cache with TTL  
4) return value`,
    `## Real scenario

Leaderboard endpoint is expensive and requested frequently.  
Cache for 5 minutes and invalidate on writes so users see fresh rankings without overloading PostgreSQL.`,
  ],
  'pb-db-postgres-advanced': [
    `## Beginner TL;DR

PostgreSQL power tools:
- targeted indexes
- full-text search
- JSONB queries
- EXPLAIN ANALYZE for tuning`,
    `## Quick reference: when query is slow

Run:
\`\`\`sql
EXPLAIN (ANALYZE, BUFFERS)
SELECT ...
\`\`\`

Look for:
- Seq Scan on large table (index likely needed)
- high disk reads vs buffer hits`,
    `## Common mistakes

- Adding indexes without checking real query patterns
- Using wildcard \`%term%\` search on huge tables without proper search strategy
- Skipping query-plan review after schema growth`,
  ],
}

function toBlocks(markdowns: string[]): ContentBlock[] {
  return markdowns.map(markdown => ({ type: 'text', markdown }))
}

export function applyPhase6DatabaseEnhancements(lessons: Lesson[]): Lesson[] {
  return lessons.map(lesson => {
    const markdowns = phase6Blocks[lesson.id]
    if (!markdowns) return lesson
    return {
      ...lesson,
      content: [...toBlocks(markdowns), ...lesson.content],
    }
  })
}
