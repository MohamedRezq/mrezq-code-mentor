import type { Lesson } from '@/types/lesson'

/** Phase be-scale — Redis, queues, WebSockets ([roadmap.sh/backend](https://roadmap.sh/backend)) */
export const backendScaleLessons: Lesson[] = [
  {
    id: 'be-redis-caching',
    moduleId: 'backend',
    phaseId: 'be-scale',
    phaseNumber: 3,
    order: 1,
    title: 'Redis Caching & Session Store',
    description: 'Use Redis for cache-aside patterns, TTL keys, and distributed session storage in Node.js APIs.',
    duration: '50 min',
    difficulty: 'intermediate',
    objectives: [
      'Connect to Redis from Node with ioredis',
      'Implement cache-aside for hot reads',
      'Set TTL and invalidate cache on writes',
      'Store sessions in Redis for horizontal scale',
    ],
    content: [
      {
        type: 'text',
        markdown: `## Cache-aside pattern

1. Read: check Redis → on miss, read DB → set Redis with TTL
2. Write: update DB → delete cache key (or update)

Never cache without TTL unless you have invalidation. Start with 60–300 seconds for list endpoints.`,
      },
      {
        type: 'code',
        language: 'javascript',
        filename: 'cache/redis.js',
        code: `import Redis from 'ioredis'
const redis = new Redis(process.env.REDIS_URL)

export async function getCachedUser(id) {
  const key = \`user:\${id}\`
  const hit = await redis.get(key)
  if (hit) return JSON.parse(hit)

  const user = await db.users.findById(id)
  await redis.set(key, JSON.stringify(user), 'EX', 120)
  return user
}`,
      },
      {
        type: 'exercise',
        title: 'Invalidate on update',
        description: 'After PATCH /users/:id, which Redis key should you delete? Write one line in comments.',
        language: 'javascript',
        starterCode: `// after update user id=42:
`,
        solution: `// await redis.del('user:42')`,
      },
    ],
  },
  {
    id: 'be-queues-jobs',
    moduleId: 'backend',
    phaseId: 'be-scale',
    phaseNumber: 3,
    order: 2,
    title: 'Message Queues & Background Jobs (BullMQ)',
    description: 'Offload email, webhooks, and reports to workers using BullMQ and Redis — keep HTTP responses fast.',
    duration: '55 min',
    difficulty: 'intermediate',
    objectives: [
      'Explain why long work must not run in request handlers',
      'Enqueue jobs from API routes',
      'Process jobs in a separate worker process',
      'Handle retries and failed job dashboards',
    ],
    content: [
      {
        type: 'code',
        language: 'javascript',
        filename: 'queues/email.js',
        code: `import { Queue, Worker } from 'bullmq'

const connection = { host: 'localhost', port: 6379 }
export const emailQueue = new Queue('email', { connection })

// API route — return 202 quickly
app.post('/newsletter/subscribe', async (req, res) => {
  await emailQueue.add('welcome', { email: req.body.email })
  res.status(202).json({ data: { queued: true } })
})

// worker.js — separate process
new Worker('email', async job => {
  await sendWelcomeEmail(job.data.email)
}, { connection })`,
      },
      {
        type: 'callout',
        tone: 'clarification',
        title: 'API vs worker process',
        content: 'Run at least two processes in production: web servers (stateless) and workers (CPU/I/O heavy). Scale them independently.',
      },
      {
        type: 'exercise',
        title: 'When to queue',
        description: 'List three tasks that belong in a queue vs three that should stay synchronous in the request.',
        language: 'javascript',
        starterCode: `// queue:
// sync:
`,
        solution: `// queue: send email, generate PDF, resize images
// sync: validate input, read own DB row, return 201`,
      },
    ],
  },
  {
    id: 'be-websockets',
    moduleId: 'backend',
    phaseId: 'be-scale',
    phaseNumber: 3,
    order: 3,
    title: 'WebSockets & Real-Time APIs',
    description: 'Add bidirectional communication with Socket.IO or ws — rooms, auth, and scaling considerations.',
    duration: '50 min',
    difficulty: 'intermediate',
    objectives: [
      'Differentiate HTTP polling vs WebSockets',
      'Authenticate socket connections',
      'Broadcast to rooms/channels',
      'Know when to use managed real-time (Ably, Pusher) instead',
    ],
    content: [
      {
        type: 'code',
        language: 'javascript',
        filename: 'socket/server.js',
        code: `import { Server } from 'socket.io'

const io = new Server(httpServer, { cors: { origin: process.env.CLIENT_URL } })

io.use((socket, next) => {
  const token = socket.handshake.auth.token
  try {
    socket.user = verifyToken(token)
    next()
  } catch {
    next(new Error('unauthorized'))
  }
})

io.on('connection', socket => {
  socket.join(\`user:\${socket.user.sub}\`)
  socket.on('chat:message', payload => {
    io.to(\`room:\${payload.roomId}\`).emit('chat:message', payload)
  })
})`,
      },
      {
        type: 'exercise',
        title: 'Pick transport',
        description: 'Comment: use WebSocket vs REST polling for live chat, for monthly report export, for health check.',
        language: 'javascript',
        starterCode: `// chat:
// report export:
// health:
`,
        solution: `// chat: WebSocket
// report: queue + poll status endpoint
// health: REST GET /health`,
      },
    ],
  },
  {
    id: 'be-scaling-patterns',
    moduleId: 'backend',
    phaseId: 'be-scale',
    phaseNumber: 3,
    order: 4,
    title: 'Scaling Node.js APIs Horizontally',
    description: 'Stateless services, load balancers, sticky sessions, health checks, and graceful shutdown.',
    duration: '55 min',
    difficulty: 'advanced',
    objectives: [
      'Design stateless API instances behind a load balancer',
      'Implement /health and /ready probes',
      'Gracefully drain connections on deploy',
      'Identify state that breaks horizontal scale',
    ],
    content: [
      {
        type: 'callout',
        tone: 'production',
        title: 'Stateless rule',
        content: 'No in-memory user sessions on a single box unless sticky sessions — prefer Redis sessions or JWT. Uploads go to S3, not local disk.',
      },
      {
        type: 'code',
        language: 'javascript',
        filename: 'health.js',
        code: `app.get('/health', (_req, res) => res.json({ status: 'ok' }))

app.get('/ready', async (_req, res) => {
  try {
    await db.ping()
    await redis.ping()
    res.json({ status: 'ready' })
  } catch {
    res.status(503).json({ status: 'not_ready' })
  }
})`,
      },
      {
        type: 'exercise',
        title: 'Scaling audit',
        description: 'Name two things in a naive Express app that prevent running 3 instances behind a load balancer.',
        language: 'javascript',
        starterCode: `// 1.
// 2.
`,
        solution: `// 1. in-memory session store
// 2. local filesystem uploads or in-memory rate limit counters`,
      },
    ],
  },
]
