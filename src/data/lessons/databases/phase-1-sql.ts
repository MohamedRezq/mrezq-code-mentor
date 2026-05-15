import type { Lesson } from '@/types/lesson'

/** Phase db-sql — [roadmap.sh/postgresql](https://roadmap.sh/postgresql) SQL foundations */
export const dbSqlLessons: Lesson[] = [
  {
    id: 'db-schema-design',
    moduleId: 'databases',
    phaseId: 'db-sql',
    phaseNumber: 1,
    order: 1,
    title: 'Schema Design & Normalization',
    description:
      'Tables, primary keys, foreign keys, 1NF–3NF, and when denormalization is intentional for read performance.',
    duration: '1.5 h',
    difficulty: 'beginner',
    objectives: [
      'Model entities and relationships in ER terms',
      'Apply normalization to reduce update anomalies',
      'Choose surrogate vs natural keys',
      'Document schema with constraints',
    ],
    content: [
      {
        type: 'code',
        language: 'sql',
        filename: 'schema.sql',
        code: `CREATE TABLE users (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email      TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE orders (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  total_cents INTEGER NOT NULL CHECK (total_cents >= 0),
  status     TEXT NOT NULL DEFAULT 'pending'
);`,
        explanation: 'Foreign keys enforce referential integrity. ON DELETE CASCADE removes child rows when parent is deleted — choose policy deliberately.',
      },
      {
        type: 'exercise',
        title: 'Normalize this',
        description:
          'A table `orders(user_email, user_name, product_name, qty)` repeats user and product data. Name two tables you would split into.',
        language: 'sql',
        starterCode: `-- tables:
`,
        solution: `-- users (email, name), products (name), order_items (order_id, product_id, qty)`,
      },
    ],
  },
  {
    id: 'db-joins',
    moduleId: 'databases',
    phaseId: 'db-sql',
    phaseNumber: 1,
    order: 2,
    title: 'JOINs & Aggregations',
    description:
      'INNER/LEFT JOIN, GROUP BY, HAVING, and writing readable multi-table queries.',
    duration: '1.5 h',
    difficulty: 'beginner',
    objectives: [
      'Write INNER and LEFT JOIN queries',
      'Aggregate with COUNT/SUM and GROUP BY',
      'Filter groups with HAVING',
      'Avoid accidental row multiplication from joins',
    ],
    content: [
      {
        type: 'code',
        language: 'sql',
        filename: 'joins.sql',
        code: `SELECT u.email, COUNT(o.id) AS order_count
FROM users u
LEFT JOIN orders o ON o.user_id = u.id
GROUP BY u.id, u.email
HAVING COUNT(o.id) > 0
ORDER BY order_count DESC;`,
      },
      {
        type: 'callout',
        tone: 'clarification',
        title: 'LEFT vs INNER',
        content:
          '**INNER JOIN** — only matching rows. **LEFT JOIN** — all left rows, NULLs where no match. Use LEFT when you need users with zero orders.',
      },
      {
        type: 'exercise',
        title: 'Revenue per user',
        description: 'Write SQL: total `total_cents` per user email for completed orders (`status = \'paid\'`).',
        language: 'sql',
        starterCode: `SELECT
`,
        solution: `SELECT u.email, SUM(o.total_cents) AS revenue
FROM users u
JOIN orders o ON o.user_id = u.id
WHERE o.status = 'paid'
GROUP BY u.id, u.email;`,
      },
    ],
  },
  {
    id: 'db-indexes-transactions',
    moduleId: 'databases',
    phaseId: 'db-sql',
    phaseNumber: 1,
    order: 3,
    title: 'Indexes & Transactions',
    description:
      'B-tree indexes, composite indexes, ACID transactions, isolation levels at a practical level.',
    duration: '1.5 h',
    difficulty: 'intermediate',
    objectives: [
      'Create indexes that match query predicates',
      'Wrap multi-step changes in transactions',
      'Explain READ COMMITTED vs SERIALIZABLE trade-offs',
      'Recognize when indexes hurt writes',
    ],
    content: [
      {
        type: 'code',
        language: 'sql',
        filename: 'transaction.sql',
        code: `BEGIN;
  UPDATE accounts SET balance = balance - 100 WHERE id = 'a1';
  UPDATE accounts SET balance = balance + 100 WHERE id = 'a2';
COMMIT;

CREATE INDEX idx_orders_user_status ON orders (user_id, status);`,
        explanation: 'Composite index (user_id, status) helps `WHERE user_id = ? AND status = ?`. Column order matters.',
      },
      {
        type: 'exercise',
        title: 'Index choice',
        description: 'Queries filter `WHERE email = ?` on users. What index do you add? Why not index every column?',
        language: 'sql',
        starterCode: `-- index:
-- why not index everything:
`,
        solution: `-- CREATE INDEX idx_users_email ON users (email);
-- too many indexes slow INSERT/UPDATE and use disk`,
      },
    ],
  },
  {
    id: 'db-sql-migrations',
    moduleId: 'databases',
    phaseId: 'db-sql',
    phaseNumber: 1,
    order: 4,
    title: 'Migrations & Safe Schema Changes',
    description:
      'Versioned migrations, expand/contract pattern, zero-downtime column adds, and rollback discipline.',
    duration: '1 h',
    difficulty: 'intermediate',
    objectives: [
      'Treat migrations as immutable history',
      'Add nullable columns before backfill',
      'Use expand/contract for breaking changes',
      'Never edit applied migrations in shared repos',
    ],
    content: [
      {
        type: 'callout',
        tone: 'production',
        title: 'Expand / contract',
        content:
          '**Expand:** add new column/table, dual-write. **Migrate data.** **Contract:** remove old column after code no longer reads it. Avoid `DROP COLUMN` the same deploy you stop using it.',
      },
      {
        type: 'exercise',
        title: 'Rename column safely',
        description: 'List three steps to rename `users.name` to `users.full_name` with zero downtime.',
        language: 'sql',
        starterCode: `-- 1.
-- 2.
-- 3.
`,
        solution: `-- 1. ADD full_name, backfill from name
-- 2. Deploy app reading/writing full_name
-- 3. DROP name after traffic on old column is gone`,
      },
    ],
  },
]
