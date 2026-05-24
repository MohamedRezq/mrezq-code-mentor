import type { ContentBlock, Lesson } from '@/types/lesson'

const phase8Blocks: Record<string, string[]> = {
  'pb-prod-docker': [
    `## Beginner TL;DR

Container goals:
- same runtime in every environment
- smaller and safer image
- reproducible deploy artifact`,
    `## Quick reference: local container loop

\`\`\`bash
docker compose up --build
docker compose logs -f api
docker compose down
\`\`\`

Use a separate migration step before serving traffic.`,
    `## Real scenario

Your teammate cannot run the app locally due to host differences.  
With Docker Compose, API + DB + Redis start the same way on every machine.`,
  ],
  'pb-prod-celery': [
    `## Beginner TL;DR

Use Celery for durable async jobs:
- queue long-running work
- retry failures
- monitor task status
- schedule recurring jobs`,
    `## Quick reference: task lifecycle

Common statuses:
- PENDING
- STARTED
- RETRY
- SUCCESS
- FAILURE`,
    `## Output walkthrough

\`\`\`python
task_state = "SUCCESS"
print(task_state in {"SUCCESS", "FAILURE"})
\`\`\`

Expected:
\`\`\`
True
\`\`\``,
  ],
  'pb-prod-observability': [
    `## Beginner TL;DR

Observability stack:
- structured logs for events and errors
- metrics for trends and alerts
- traces for cross-service latency analysis`,
    `## Quick reference: must-log fields

- event name
- request_id
- user_id (if authenticated)
- status_code
- duration_ms
- error message and type (when failed)`,
    `## Real scenario

User says "request failed at 2:13 PM".  
Find by request_id in logs, correlate with latency spike in metrics, then inspect trace span to isolate the slow dependency.`,
  ],
  'pb-prod-deployment': [
    `## Beginner TL;DR

Production reliability depends on process:
1) test
2) migrate safely
3) deploy
4) verify health
5) keep rollback ready`,
    `## Quick reference: deploy safety checks

- DEBUG is false
- secrets loaded from env
- readiness endpoint works
- backward-compatible migration order respected`,
    `## Common mistakes

- Running destructive migrations before code is compatible
- Missing rollback plan
- Shipping without monitoring and health checks`,
  ],
}

function toBlocks(markdowns: string[]): ContentBlock[] {
  return markdowns.map(markdown => ({ type: 'text', markdown }))
}

export function applyPhase8ProductionEnhancements(lessons: Lesson[]): Lesson[] {
  return lessons.map(lesson => {
    const markdowns = phase8Blocks[lesson.id]
    if (!markdowns) return lesson
    return {
      ...lesson,
      content: [...toBlocks(markdowns), ...lesson.content],
    }
  })
}
