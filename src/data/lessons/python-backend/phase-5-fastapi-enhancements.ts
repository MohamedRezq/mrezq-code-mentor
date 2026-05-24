import type { ContentBlock, Lesson } from '@/types/lesson'

const phase5Blocks: Record<string, string[]> = {
  'pb-fastapi-intro': [
    `## Beginner TL;DR

FastAPI gives you:
- typed request validation
- automatic docs
- async-ready request handling

For modern Python APIs, this is usually the fastest path to a production baseline.`,
    `## Quick reference: first run

\`\`\`bash
uv add fastapi uvicorn
uv run uvicorn main:app --reload
\`\`\`

Open:
- /docs for Swagger UI
- /redoc for API reference
- /openapi.json for raw schema`,
    `## Output walkthrough

\`\`\`python
from fastapi import FastAPI
app = FastAPI()

@app.get("/health")
def health():
    return {"status": "healthy"}
\`\`\`

HTTP response:
\`\`\`json
{"status":"healthy"}
\`\`\``,
  ],
  'pb-fastapi-routing': [
    `## Beginner TL;DR

REST basics:
- path params identify a resource
- query params filter/search/sort
- status codes communicate result clearly`,
    `## Quick reference: status code conventions

| Operation | Status |
|---|---|
| Create | 201 |
| Read | 200 |
| Delete success (no body) | 204 |
| Validation error | 422 |
| Not found | 404 |`,
    `## Real scenario

Mobile app sends \`GET /tasks?status=done&page=2\`.  
Use query params with validation (\`Query(ge=1)\`) to enforce stable API behavior for all clients.`,
  ],
  'pb-fastapi-validation': [
    `## Beginner TL;DR

Pydantic models protect your API boundary.  
Invalid data is rejected before business logic runs.`,
    `## Quick reference: create vs update schemas

\`\`\`python
class UserCreate(BaseModel):
    email: EmailStr
    age: int

class UserUpdate(BaseModel):
    email: EmailStr | None = None
    age: int | None = None
\`\`\`

Use \`exclude_unset=True\` in PATCH routes.`,
    `## Common mistakes

- Reusing the response schema for request input (leaks internal fields)
- Forgetting \`exclude_unset=True\` in PATCH
- Trusting raw dict input instead of validated Pydantic model`,
  ],
  'pb-fastapi-auth': [
    `## Beginner TL;DR

JWT auth workflow:
1) verify password hash
2) create signed token
3) send \`Authorization: Bearer <token>\`
4) protect routes with dependencies`,
    `## Quick reference: auth failure mapping

| Failure | Status |
|---|---|
| Bad login credentials | 401 |
| Missing token | 401 |
| Expired or invalid token | 401 |
| Authenticated but wrong role | 403 |`,
    `## Output walkthrough

\`\`\`python
token_payload = {"sub": 7, "role": "admin"}
print(token_payload["sub"])
print(token_payload["role"])
\`\`\`

Expected:
\`\`\`
7
admin
\`\`\``,
  ],
  'pb-fastapi-async': [
    `## Beginner TL;DR

Use \`async def\` for I/O-bound operations (HTTP, async DB).  
Use \`def\` for blocking or CPU-heavy work unless explicitly offloading.`,
    `## Quick reference: concurrent calls

\`\`\`python
import asyncio
import httpx

async def fetch_two():
    async with httpx.AsyncClient(timeout=10) as c:
        a, b = await asyncio.gather(
            c.get("https://example.com/a"),
            c.get("https://example.com/b"),
        )
        return a.status_code, b.status_code
\`\`\``,
    `## Real scenario

Dashboard endpoint needs profile + billing + notifications from three services.  
Fetch concurrently with \`asyncio.gather\` to cut total latency from sum-of-delays to near max-of-delays.`,
  ],
  'pb-fastapi-middleware': [
    `## Beginner TL;DR

Middleware handles cross-cutting concerns:
- CORS
- request IDs
- timing
- common error formatting`,
    `## Quick reference: production CORS

- allow exact frontend origins
- avoid wildcard origins in production
- include auth headers and methods used by clients`,
    `## Output walkthrough

\`\`\`python
headers = {"X-Request-ID": "abc123", "X-Response-Time": "24.10ms"}
print("X-Request-ID" in headers)
\`\`\`

Expected:
\`\`\`
True
\`\`\``,
  ],
}

function toBlocks(markdowns: string[]): ContentBlock[] {
  return markdowns.map(markdown => ({ type: 'text', markdown }))
}

export function applyPhase5FastapiEnhancements(lessons: Lesson[]): Lesson[] {
  return lessons.map(lesson => {
    const markdowns = phase5Blocks[lesson.id]
    if (!markdowns) return lesson
    return {
      ...lesson,
      content: [...toBlocks(markdowns), ...lesson.content],
    }
  })
}
