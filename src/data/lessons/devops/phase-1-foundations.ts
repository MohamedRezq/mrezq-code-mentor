import type { Lesson } from '@/types/lesson'

export const devopsFoundationLessons: Lesson[] = [
  {
    id: 'do-linux-shell',
    moduleId: 'devops',
    phaseId: 'do-foundations',
    phaseNumber: 1,
    order: 1,
    title: 'Linux & Shell Essentials',
    description: 'Processes, permissions, pipes, grep/journalctl, and debugging production servers.',
    duration: '1.5 h',
    difficulty: 'beginner',
    objectives: [
      'Navigate filesystem and read logs',
      'Use chmod/chown safely',
      'Chain commands with pipes',
      'Inspect running processes and ports',
    ],
    content: [
      {
        type: 'code',
        language: 'shell',
        filename: 'debug.sh',
        code: `# What is listening on 3000?
ss -tlnp | grep 3000

# Recent service logs
journalctl -u myapp -n 100 --no-pager

# Disk space
df -h`,
      },
      {
        type: 'exercise',
        title: 'Find large files',
        description: 'One command to find files over 100MB under /var (conceptually).',
        language: 'shell',
        starterCode: `# command:
`,
        solution: `# find /var -type f -size +100M 2>/dev/null | head`,
      },
    ],
  },
  {
    id: 'do-docker-basics',
    moduleId: 'devops',
    phaseId: 'do-foundations',
    phaseNumber: 1,
    order: 2,
    title: 'Docker Images & Containers',
    description: 'Dockerfile layers, build context, run, exec, volumes, and multi-stage builds.',
    duration: '1.5 h',
    difficulty: 'beginner',
    objectives: [
      'Write a minimal Dockerfile for Node/Python app',
      'Understand image layers and cache',
      'Mount volumes for persistent data',
      'Run containers with env and ports',
    ],
    content: [
      {
        type: 'code',
        language: 'dockerfile',
        filename: 'Dockerfile',
        code: `FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:22-alpine
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "server.js"]`,
      },
      {
        type: 'exercise',
        title: 'Layer caching',
        description: 'Why copy package.json before source code in Dockerfile?',
        language: 'dockerfile',
        starterCode: `# reason:
`,
        solution: `# npm ci layer caches until dependencies change — faster rebuilds`,
      },
    ],
  },
  {
    id: 'do-docker-compose',
    moduleId: 'devops',
    phaseId: 'do-foundations',
    phaseNumber: 1,
    order: 3,
    title: 'Docker Compose for Local Dev',
    description: 'Multi-service stacks: app + Postgres + Redis with networks and healthchecks.',
    duration: '1 h',
    difficulty: 'intermediate',
    objectives: [
      'Define services in compose.yaml',
      'Wire depends_on and healthchecks',
      'Use named volumes for DB data',
      'Share env files across services',
    ],
    content: [
      {
        type: 'code',
        language: 'yaml',
        filename: 'compose.yaml',
        code: `services:
  app:
    build: .
    ports: ["3000:3000"]
    environment:
      DATABASE_URL: postgres://app:secret@db:5432/app
    depends_on:
      db:
        condition: service_healthy
  db:
    image: postgres:16
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U app"]
      interval: 5s
      retries: 5`,
      },
      {
        type: 'exercise',
        title: 'depends_on',
        description: 'Why healthcheck condition beats plain depends_on for app startup?',
        language: 'yaml',
        starterCode: `# reason:
`,
        solution: `# Postgres container up ≠ ready for connections — healthcheck waits for pg_isready`,
      },
    ],
  },
  {
    id: 'do-networking',
    moduleId: 'devops',
    phaseId: 'do-foundations',
    phaseNumber: 1,
    order: 4,
    title: 'Networking for Developers',
    description: 'TCP/IP basics, DNS, TLS, ports, firewalls, and how traffic reaches your container.',
    duration: '1 h',
    difficulty: 'intermediate',
    objectives: [
      'Explain DNS resolution A/AAAA/CNAME',
      'Understand TLS termination at LB vs app',
      'Debug connection refused vs timeout',
      'Map ports in Docker/K8s',
    ],
    content: [
      {
        type: 'callout',
        tone: 'clarification',
        title: 'Connection refused vs timeout',
        content:
          '**Refused** — nothing listening on port (wrong port, app down). **Timeout** — firewall/security group drops packets or routing issue.',
      },
      {
        type: 'exercise',
        title: 'TLS where',
        description: 'Terminate TLS at load balancer vs app container — one pro and one con each.',
        language: 'javascript',
        starterCode: `// at LB pro:
// at LB con:
// at app pro:
// at app con:
`,
        solution: `// LB pro: central cert management; con: encrypted traffic inside VPC only if not re-encrypt
// app pro: end-to-end encryption to app; con: cert rotation per service`,
      },
    ],
  },
]
