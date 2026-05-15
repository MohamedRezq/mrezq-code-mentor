import type { Lesson } from '@/types/lesson'

export const dbNosqlLessons: Lesson[] = [
  {
    id: 'db-mongodb-basics',
    moduleId: 'databases',
    phaseId: 'db-nosql',
    phaseNumber: 3,
    order: 1,
    title: 'MongoDB & Document Model',
    description: 'Collections, documents, ObjectId, CRUD, and when document stores beat relational schemas.',
    duration: '1.5 h',
    difficulty: 'intermediate',
    objectives: [
      'Model embedded vs referenced documents',
      'Run find, insert, update with filters',
      'Create indexes on query fields',
      'Know when MongoDB is a poor fit (heavy joins)',
    ],
    content: [
      {
        type: 'code',
        language: 'javascript',
        filename: 'mongo-crud.js',
        code: `// Node driver sketch
await db.collection('users').insertOne({
  email: 'ada@example.com',
  profile: { name: 'Ada', tags: ['admin'] },
})

await db.collection('users').findOne({ email: 'ada@example.com' })
await db.collection('users').createIndex({ email: 1 }, { unique: true })`,
      },
      {
        type: 'exercise',
        title: 'Embed vs reference',
        description: 'Order has 50 line items, each rarely queried alone. Embed or separate collection?',
        language: 'javascript',
        starterCode: `// choice:
`,
        solution: `// embed line items in order document — atomic read, one query for checkout view`,
      },
    ],
  },
  {
    id: 'db-redis-caching-pubsub',
    moduleId: 'databases',
    phaseId: 'db-nosql',
    phaseNumber: 3,
    order: 2,
    title: 'Redis: Cache, Sessions & Pub/Sub',
    description: 'Strings, hashes, TTL, cache-aside, session storage, and lightweight messaging.',
    duration: '1.5 h',
    difficulty: 'intermediate',
    objectives: [
      'Implement cache-aside with TTL',
      'Store sessions in Redis with expiry',
      'Use pub/sub for notifications (not durable queues)',
      'Handle cache stampede basics',
    ],
    content: [
      {
        type: 'code',
        language: 'javascript',
        filename: 'cache-aside.js',
        code: `async function getUser(id) {
  const key = \`user:\${id}\`
  const cached = await redis.get(key)
  if (cached) return JSON.parse(cached)

  const user = await db.users.findById(id)
  await redis.setex(key, 300, JSON.stringify(user)) // 5 min TTL
  return user
}`,
      },
      {
        type: 'callout',
        tone: 'clarification',
        title: 'Pub/Sub vs queue',
        content:
          'Redis pub/sub is fire-and-forget — subscribers offline miss messages. Use BullMQ/Kafka for durable work queues.',
      },
      {
        type: 'exercise',
        title: 'Cache invalidation',
        description: 'User profile updated. Which keys do you delete?',
        language: 'javascript',
        starterCode: `// after UPDATE users SET ... WHERE id = ?
`,
        solution: `// DEL user:{id} and any list keys like users:leaderboard if denormalized`,
      },
    ],
  },
  {
    id: 'db-document-modeling',
    moduleId: 'databases',
    phaseId: 'db-nosql',
    phaseNumber: 3,
    order: 3,
    title: 'Document Schema Design',
    description: 'Denormalization, atomic updates, schema versioning, and migration in document DBs.',
    duration: '1 h',
    difficulty: 'intermediate',
    objectives: [
      'Design for read patterns first',
      'Version documents for backward compatibility',
      'Use multi-document transactions when needed',
      'Avoid unbounded arrays in documents',
    ],
    content: [
      {
        type: 'exercise',
        title: 'Bounded arrays',
        description: 'Comments array grows without limit on a post document. Two risks and one fix.',
        language: 'javascript',
        starterCode: `// risks:
// fix:
`,
        solution: `// risks: 16MB doc limit, slow reads/writes
// fix: separate comments collection with post_id index, paginate`,
      },
    ],
  },
  {
    id: 'db-caching-patterns',
    moduleId: 'databases',
    phaseId: 'db-nosql',
    phaseNumber: 3,
    order: 4,
    title: 'Caching Patterns in Production',
    description: 'Write-through, write-behind, stale-while-revalidate, and CDN edge caching overview.',
    duration: '1 h',
    difficulty: 'intermediate',
    objectives: [
      'Compare cache-aside vs write-through',
      'Set TTL + jitter to prevent thundering herd',
      'Layer browser CDN → Redis → database',
      'Measure hit rate and staleness SLOs',
    ],
    content: [
      {
        type: 'callout',
        tone: 'production',
        title: 'Stale-while-revalidate',
        content:
          'Serve slightly stale cache immediately while refreshing in background — great for catalog pages where 30s staleness is acceptable.',
      },
      {
        type: 'exercise',
        title: 'TTL jitter',
        description: 'Why add random jitter to TTL instead of identical expiry for all keys?',
        language: 'javascript',
        starterCode: `// reason:
`,
        solution: `// prevents all keys expiring at once → DB spike (thundering herd)`,
      },
    ],
  },
]
