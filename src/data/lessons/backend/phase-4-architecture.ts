import type { Lesson } from '@/types/lesson'

/** Phase be-arch — microservices, gRPC, API gateway ([roadmap.sh/backend](https://roadmap.sh/backend)) */
export const backendArchLessons: Lesson[] = [
  {
    id: 'be-monolith-vs-microservices',
    moduleId: 'backend',
    phaseId: 'be-arch',
    phaseNumber: 4,
    order: 1,
    title: 'Monolith vs Microservices',
    description:
      'When to stay monolithic, how to split bounded contexts, and the operational cost of distributed systems.',
    duration: '1 h',
    difficulty: 'intermediate',
    objectives: [
      'Define bounded contexts and service boundaries',
      'List trade-offs: deploy, data, observability, latency',
      'Recognize premature microservice splits',
      'Plan a strangler migration from monolith',
    ],
    content: [
      {
        type: 'text',
        markdown: `## Start with a modular monolith

Most products should ship as **one deployable** with clear internal modules. Split into services when teams, scale, or failure isolation force it — not because diagrams look modern.

| Monolith | Microservices |
|----------|----------------|
| Simple deploy & debug | Independent deploy per service |
| Shared DB transactions easy | Distributed transactions hard |
| One codebase | Many repos / contracts |`,
      },
      {
        type: 'callout',
        tone: 'clarification',
        title: 'Distributed monolith',
        content:
          'Worst of both worlds: many services that must deploy together and share a database. If everything calls everything synchronously, you added latency without autonomy.',
      },
      {
        type: 'exercise',
        title: 'Split decision',
        description:
          'E-commerce: would you split Payments, Catalog, and Notifications into services on day one? Give one reason for and one against.',
        language: 'javascript',
        starterCode: `// for split:
// against split:
`,
        solution: `// for: Payments PCI scope isolation, independent scaling on Black Friday
// against: triple network hops, sagas for checkout, harder local dev`,
      },
    ],
  },
  {
    id: 'be-grpc-basics',
    moduleId: 'backend',
    phaseId: 'be-arch',
    phaseNumber: 4,
    order: 2,
    title: 'gRPC & Protocol Buffers',
    description:
      'Binary RPC with protobuf contracts, when to prefer gRPC over REST, and streaming patterns for internal services.',
    duration: '1.5 h',
    difficulty: 'intermediate',
    objectives: [
      'Explain protobuf schema and code generation',
      'Compare gRPC to JSON REST for internal APIs',
      'Use unary vs server-streaming RPC',
      'Handle versioning in .proto files',
    ],
    content: [
      {
        type: 'text',
        markdown: `## gRPC in one paragraph

**gRPC** runs on HTTP/2 with **Protocol Buffers** — smaller payloads, faster than JSON for service-to-service calls. Browsers need grpc-web; public mobile APIs often stay REST.

\`.proto\` files are the contract — generate client/server stubs and never hand-write JSON shapes.`,
      },
      {
        type: 'code',
        language: 'javascript',
        filename: 'user.proto',
        code: `syntax = "proto3";

package users;

service UserService {
  rpc GetUser (GetUserRequest) returns (User);
}

message GetUserRequest {
  string id = 1;
}

message User {
  string id = 1;
  string email = 2;
}`,
        explanation: 'Field numbers are permanent — never reuse numbers when changing schema. Add new fields; deprecate old ones.',
      },
      {
        type: 'exercise',
        title: 'REST vs gRPC',
        description: 'Name two internal use cases where gRPC wins and one where REST is fine.',
        language: 'javascript',
        starterCode: `// gRPC wins:
// REST fine:
`,
        solution: `// gRPC: high-volume service mesh, streaming logs/metrics
// REST: public CRUD API, browser-first clients, simple webhooks`,
      },
    ],
  },
  {
    id: 'be-api-gateway',
    moduleId: 'backend',
    phaseId: 'be-arch',
    phaseNumber: 4,
    order: 3,
    title: 'API Gateway & BFF',
    description:
      'Single entry point, auth termination, rate limiting, and Backend-for-Frontend patterns for web and mobile.',
    duration: '1 h',
    difficulty: 'intermediate',
    objectives: [
      'List gateway responsibilities vs service responsibilities',
      'Design a BFF for a Next.js app',
      'Apply rate limits and JWT validation at the edge',
      'Avoid god-gateway business logic',
    ],
    content: [
      {
        type: 'callout',
        tone: 'tip',
        title: 'Gateway checklist',
        content:
          'TLS termination · authentication · rate limiting · routing · request logging · CORS for browsers. Business rules stay in domain services.',
      },
      {
        type: 'code',
        language: 'javascript',
        filename: 'gateway-route.js',
        code: `// Conceptual — Kong / AWS API Gateway / custom Express gateway
app.use('/api', authenticateJwt, rateLimit({ windowMs: 60_000, max: 100 }))

app.use('/api/users', proxy('http://users-service:3001'))
app.use('/api/orders', proxy('http://orders-service:3002'))`,
      },
      {
        type: 'exercise',
        title: 'BFF shape',
        description:
          'Mobile needs 3 fields from Users + Orders for a profile screen. Should the mobile app call both services or a BFF? Why?',
        language: 'javascript',
        starterCode: `// answer:
`,
        solution: `// BFF aggregates one round-trip, shapes payload for mobile, hides internal service topology`,
      },
    ],
  },
  {
    id: 'be-event-driven',
    moduleId: 'backend',
    phaseId: 'be-arch',
    phaseNumber: 4,
    order: 4,
    title: 'Event-Driven Architecture',
    description:
      'Events vs commands, Kafka-style topics, idempotent consumers, and eventual consistency patterns.',
    duration: '1.5 h',
    difficulty: 'advanced',
    objectives: [
      'Distinguish events (past tense) from commands',
      'Design idempotent event handlers',
      'Explain at-least-once delivery and deduplication',
      'Draw a saga for order → payment → ship',
    ],
    content: [
      {
        type: 'text',
        markdown: `## Events decouple producers and consumers

\`OrderPlaced\` lets Inventory, Billing, and Email services react without the Order API calling them directly. Consumers must be **idempotent** — the same event may arrive twice.`,
      },
      {
        type: 'code',
        language: 'javascript',
        filename: 'idempotent-handler.js',
        code: `async function onOrderPlaced(event) {
  const processed = await db.processed_events.find(event.id)
  if (processed) return // already handled

  await db.inventory.reserve(event.orderId)
  await db.processed_events.insert({ id: event.id })
}`,
      },
      {
        type: 'exercise',
        title: 'Saga steps',
        description: 'List compensating actions if payment fails after inventory reserved.',
        language: 'javascript',
        starterCode: `// reserve inventory → charge payment → ship
// if payment fails:
`,
        solution: `// publish InventoryRelease or call compensate API to un-reserve stock; mark order failed`,
      },
    ],
  },
]
