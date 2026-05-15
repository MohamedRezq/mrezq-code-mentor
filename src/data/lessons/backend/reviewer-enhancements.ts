import type { LessonEnhancement } from '@/lib/curriculum/reviewer-types'
import { clarify, roadmapIntro } from '@/lib/curriculum/reviewer-merge'

export const BACKEND_REVIEWER: Record<string, LessonEnhancement> = {
  'be-node-runtime': {
    intro: [roadmapIntro('nodejs', 'Phase 1', 'event loop, async I/O, non-blocking')],
    outro: [
      clarify(
        'Single thread ≠ single core',
        'Node runs your JavaScript on one thread but uses libuv thread pool + OS async for I/O. CPU work on that thread still blocks everything.'
      ),
    ],
  },
  'be-express-api-basics': {
    intro: [roadmapIntro('backend', 'Phase 1', 'Express REST, middleware, validation')],
  },
  'be-fastify-and-performance': {
    intro: [roadmapIntro('nodejs', 'Phase 1', 'Fastify schemas, throughput')],
  },
  'be-api-design-and-errors': {
    intro: [roadmapIntro('backend', 'Phase 1', 'REST design, errors, versioning, pagination')],
  },
  'be-auth-fundamentals': {
    intro: [roadmapIntro('backend', 'Phase 2', 'authn vs authz, bcrypt, register/login')],
  },
  'be-jwt-tokens': {
    intro: [roadmapIntro('backend', 'Phase 2', 'JWT access/refresh, Bearer middleware')],
  },
  'be-oauth-oidc': {
    intro: [roadmapIntro('backend', 'Phase 2', 'OAuth2 code flow, OIDC, social login')],
  },
  'be-rbac-middleware': {
    intro: [roadmapIntro('backend', 'Phase 2', 'RBAC, roles, permission middleware')],
  },
  'be-session-security': {
    intro: [roadmapIntro('backend', 'Phase 2', 'sessions, cookies, CSRF, rate limits')],
  },
  'be-redis-caching': {
    intro: [roadmapIntro('redis', 'Phase 3', 'cache-aside, TTL, session store')],
  },
  'be-queues-jobs': {
    intro: [roadmapIntro('backend', 'Phase 3', 'BullMQ, background workers')],
  },
  'be-websockets': {
    intro: [roadmapIntro('backend', 'Phase 3', 'WebSockets, Socket.IO, rooms')],
  },
  'be-scaling-patterns': {
    intro: [roadmapIntro('backend', 'Phase 3', 'horizontal scale, health checks')],
  },
  'be-monolith-vs-microservices': {
    intro: [roadmapIntro('backend', 'Architecture', 'monolith, bounded contexts, strangler')],
  },
  'be-grpc-basics': {
    intro: [roadmapIntro('backend', 'Architecture', 'gRPC, protobuf, internal RPC')],
  },
  'be-api-gateway': {
    intro: [roadmapIntro('backend', 'Architecture', 'API gateway, BFF, edge auth')],
  },
  'be-event-driven': {
    intro: [roadmapIntro('backend', 'Architecture', 'events, Kafka, idempotent consumers')],
    outro: [clarify('Outbox pattern', 'Write event to DB outbox in same transaction as domain change — worker publishes to broker. Avoids “DB committed, message lost”.')],
  },
}
