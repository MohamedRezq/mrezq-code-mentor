import type { Lesson } from '@/types/lesson'

export const backendCoreLessons: Lesson[] = [
  {
    id: 'be-node-runtime',
    moduleId: 'backend',
    phaseId: 'be-core',
    phaseNumber: 1,
    order: 1,
    title: 'Node.js Runtime and Event Loop',
    description: 'Understand how Node.js executes JavaScript on the server, including the event loop, async I/O, and non-blocking design.',
    duration: '45 min',
    difficulty: 'beginner',
    objectives: [
      'Explain Node.js runtime architecture and event loop phases',
      'Differentiate CPU-bound and I/O-bound workloads',
      'Avoid blocking the event loop in backend code',
      'Apply practical async patterns for scalable APIs',
    ],
    content: [
      {
        type: 'text',
        markdown: `## Node.js Core Model

Node.js uses a single-threaded event loop for JavaScript execution and a worker pool for certain background operations. It scales well for I/O-heavy systems because it does not block on network and file operations.

Rule of thumb:
- great for APIs, real-time apps, webhooks, queue workers
- dangerous if heavy CPU work runs directly on the event loop`,
      },
      {
        type: 'code',
        language: 'javascript',
        filename: 'event-loop-demo.js',
        code: `console.log('1) start')

setTimeout(() => {
  console.log('4) timeout callback')
}, 0)

Promise.resolve().then(() => {
  console.log('3) microtask callback')
})

console.log('2) end')

// Output:
// 1) start
// 2) end
// 3) microtask callback
// 4) timeout callback`,
        explanation:
          'Microtasks (Promise callbacks) run before timer callbacks once current synchronous execution completes.',
      },
      {
        type: 'callout',
        tone: 'warning',
        title: 'Blocking Event Loop Example',
        content:
          'A tight CPU loop (for example hashing millions of records synchronously) blocks every request. Move CPU-intensive tasks to worker threads or background job processors.',
      },
      {
        type: 'exercise',
        title: 'Diagnose Event Loop Blocking',
        description:
          'Write a script with one blocking CPU function and one async I/O simulation. Measure response latency and refactor to avoid blocking (using worker_threads or chunked processing).',
        language: 'javascript',
        starterCode: `// TODO:
// 1) create blocking function (large loop)
// 2) create simulated API request handler
// 3) measure latency before
// 4) refactor with non-blocking strategy
// 5) measure latency after`,
        solution: `// Expected result:
// before: requests stall while CPU loop runs
// after: requests continue while CPU work is offloaded
//
// Typical fix options:
// - worker_threads for CPU tasks
// - external queue worker process
// - chunked processing with yielding`,
        hints: [
          'Use `console.time` and `console.timeEnd` for baseline timing',
          'Keep event loop paths focused on I/O orchestration',
          'Benchmark before and after refactor',
        ],
      },
    ],
  },
  {
    id: 'be-express-api-basics',
    moduleId: 'backend',
    phaseId: 'be-core',
    phaseNumber: 1,
    order: 2,
    title: 'Express API Fundamentals',
    description: 'Build REST APIs with Express, routing structure, middleware, validation basics, and consistent responses.',
    duration: '55 min',
    difficulty: 'beginner',
    objectives: [
      'Create structured Express routes and middleware',
      'Use request validation and consistent response formats',
      'Handle HTTP status codes correctly',
      'Design maintainable API folder structure',
    ],
    content: [
      {
        type: 'code',
        language: 'javascript',
        filename: 'src/app.js',
        code: `import express from 'express'

const app = express()
app.use(express.json())

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', service: 'backend-core' })
})

app.get('/users', (_req, res) => {
  res.json({ data: [], count: 0 })
})

app.post('/users', (req, res) => {
  const { name, email } = req.body ?? {}
  if (!name || !email) {
    return res.status(400).json({
      error: { code: 'VALIDATION_ERROR', message: 'name and email are required' },
    })
  }
  return res.status(201).json({
    data: { id: 'u_1', name, email },
  })
})

export default app`,
      },
      {
        type: 'code',
        language: 'javascript',
        filename: 'src/server.js',
        code: `import app from './app.js'

const PORT = process.env.PORT ?? 3001
app.listen(PORT, () => {
  console.log(\`API listening on http://localhost:\${PORT}\`)
})`,
        explanation:
          'Separating app creation from server startup makes testing easier because tests can import `app` directly.',
      },
      {
        type: 'exercise',
        title: 'Implement Tasks CRUD API',
        description:
          'Create `/tasks` endpoints: list, create, get by id, update status, delete. Return consistent JSON with proper status codes and validation errors.',
        language: 'javascript',
        starterCode: `// TODO:
// GET /tasks
// POST /tasks
// GET /tasks/:id
// PATCH /tasks/:id
// DELETE /tasks/:id`,
        solution: `// Expected API behavior:
// GET /tasks -> 200 + { data: [...], count }
// POST /tasks -> 201 + created task
// GET /tasks/:id -> 200 or 404
// PATCH /tasks/:id -> 200 or 404
// DELETE /tasks/:id -> 204`,
        hints: [
          'Use in-memory array/object store first',
          'Validate required fields for create/update',
          'Keep response shape consistent across endpoints',
        ],
      },
    ],
  },
  {
    id: 'be-fastify-and-performance',
    moduleId: 'backend',
    phaseId: 'be-core',
    phaseNumber: 1,
    order: 3,
    title: 'Fastify and High-Performance API Patterns',
    description: 'Compare Express and Fastify, use schema-driven routes, and apply performance-oriented backend practices.',
    duration: '50 min',
    difficulty: 'intermediate',
    objectives: [
      'Understand why Fastify is often faster than Express',
      'Use JSON schema for runtime validation',
      'Design routes with typed contracts',
      'Benchmark and profile basic API performance',
    ],
    content: [
      {
        type: 'code',
        language: 'javascript',
        filename: 'fastify-server.js',
        code: `import Fastify from 'fastify'

const fastify = Fastify({ logger: true })

fastify.get('/health', async () => {
  return { status: 'ok', framework: 'fastify' }
})

fastify.post(
  '/users',
  {
    schema: {
      body: {
        type: 'object',
        required: ['name', 'email'],
        properties: {
          name: { type: 'string', minLength: 1 },
          email: { type: 'string', format: 'email' },
        },
      },
      response: {
        201: {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                name: { type: 'string' },
                email: { type: 'string' },
              },
            },
          },
        },
      },
    },
  },
  async request => {
    const { name, email } = request.body
    return { data: { id: 'u_fastify_1', name, email } }
  },
)

fastify.listen({ port: 3002 })`,
        explanation:
          'Fastify compiles schemas and serializers for high throughput while keeping route contracts explicit.',
      },
      {
        type: 'callout',
        tone: 'tip',
        title: 'Framework Selection Rule',
        content:
          'Express has larger ecosystem familiarity; Fastify offers stronger performance defaults and schema tooling. Choose based on team constraints, not benchmarks alone.',
      },
      {
        type: 'exercise',
        title: 'Express vs Fastify Micro-Benchmark',
        description:
          'Create equivalent `/health` and `/users` endpoints in Express and Fastify. Run `autocannon` for each and compare latency and requests/sec. Summarize trade-offs.',
        language: 'bash',
        starterCode: `# TODO:
# 1) start express app
# 2) run: npx autocannon -c 50 -d 15 http://localhost:3001/health
# 3) start fastify app
# 4) run: npx autocannon -c 50 -d 15 http://localhost:3002/health
# 5) compare metrics`,
        solution: `# Example output summary:
# Express: 18k req/s, p95 12ms
# Fastify: 24k req/s, p95 8ms
#
# Decision:
# - choose Fastify for performance-sensitive high-throughput APIs
# - choose Express when team familiarity and middleware ecosystem dominates`,
        hints: [
          'Benchmark on the same machine and settings',
          'Compare p95 latency, not only average',
          'Run multiple rounds to reduce noise',
        ],
      },
    ],
  },
  {
    id: 'be-api-design-and-errors',
    moduleId: 'backend',
    phaseId: 'be-core',
    phaseNumber: 1,
    order: 4,
    title: 'API Design, Error Handling, and Versioning',
    description: 'Design maintainable API contracts with consistent errors, pagination, idempotency, and versioning strategy.',
    duration: '60 min',
    difficulty: 'intermediate',
    objectives: [
      'Design stable REST endpoint conventions',
      'Implement a global error handling strategy',
      'Use pagination/filtering patterns consistently',
      'Plan safe API evolution with versioning',
    ],
    content: [
      {
        type: 'code',
        language: 'javascript',
        filename: 'error-middleware.js',
        code: `export class ApiError extends Error {
  constructor(statusCode, code, message, details = null) {
    super(message)
    this.statusCode = statusCode
    this.code = code
    this.details = details
  }
}

export function errorHandler(err, _req, res, _next) {
  const status = err.statusCode ?? 500
  const code = err.code ?? 'INTERNAL_ERROR'
  const message = status === 500 ? 'Unexpected server error' : err.message

  res.status(status).json({
    error: {
      code,
      message,
      details: err.details ?? null,
    },
  })
}`,
      },
      {
        type: 'code',
        language: 'javascript',
        filename: 'pagination-example.js',
        code: `app.get('/v1/lessons', (req, res) => {
  const page = Math.max(1, Number(req.query.page ?? 1))
  const pageSize = Math.min(100, Math.max(1, Number(req.query.pageSize ?? 20)))

  // Replace with real DB query
  const total = 250
  const data = []

  res.json({
    data,
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    },
  })
})`,
        explanation:
          'Consistent pagination format across endpoints makes frontend integration and SDK generation much simpler.',
      },
      {
        type: 'callout',
        tone: 'production',
        title: 'Versioning Strategy',
        content:
          'Start with `/v1` prefix and only introduce `/v2` for breaking changes. Prefer additive changes (new fields/endpoints) to reduce migration risk.',
      },
      {
        type: 'exercise',
        title: 'Design API Contract for Learning Progress',
        description:
          'Design endpoints for learning progress (`GET /progress`, `POST /progress`, `PATCH /progress/:id`) with standardized errors, pagination for history, and idempotent completion updates.',
        language: 'markdown',
        starterCode: `# API Contract

## Endpoints
- 

## Request/Response examples
- 

## Error format
- 

## Versioning and compatibility notes
- `,
        solution: `# API Contract (example)

## Endpoints
- GET /v1/progress?page=1&pageSize=20
- POST /v1/progress
- PATCH /v1/progress/:id

## Error format
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "lessonId is required",
    "details": null
  }
}

## Compatibility
- additive fields are non-breaking
- breaking changes require /v2`,
        hints: [
          'Keep error envelope identical across all endpoints',
          'Use idempotency keys for retry-safe POSTs in critical flows',
          'Document field behavior clearly (required vs optional)',
        ],
      },
    ],
  },
]
