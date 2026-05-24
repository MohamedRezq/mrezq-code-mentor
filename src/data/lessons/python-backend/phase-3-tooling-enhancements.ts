import type { ContentBlock, Lesson } from '@/types/lesson'

const phase3ToolingBlocks: Record<string, string[]> = {
  'py-env': [
    `## Beginner TL;DR

Each project must use its own environment.  
Use:
- \`pyenv\` for Python versions
- \`venv\` or \`uv\` for project isolation`,
    `## Quick reference: environment commands with outputs

\`\`\`bash
python --version
# Python 3.12.3

python -m venv .venv
source .venv/bin/activate    # Windows: .venv\\Scripts\\Activate.ps1
python -m pip --version
# pip ... (from .venv)

deactivate
\`\`\``,
    `## Real scenario: two projects need different versions

Project A needs 3.11, Project B needs 3.12.  
Use \`pyenv local\` in each folder so both work on one machine without conflict.`,
  ],
  'py-packaging': [
    `## Beginner TL;DR

\`pyproject.toml\` is the single source of project dependencies and tool config.  
Commit lockfiles for reproducibility.`,
    `## Quick reference: package manager workflow

\`\`\`bash
# uv
uv init my-api
uv add fastapi
uv add --dev pytest ruff
uv run pytest

# poetry
poetry add fastapi
poetry add --group dev pytest ruff
poetry install
poetry run pytest
\`\`\``,
    `## Output walkthrough

\`\`\`python
spec = {"project": {"dependencies": ["fastapi>=0.110"]}}
print("dependencies" in spec["project"])
\`\`\`

Expected:
\`\`\`
True
\`\`\``,
  ],
  'py-typing': [
    `## Beginner TL;DR

Type hints help before runtime.  
- mypy: static checks (before running app)  
- Pydantic: runtime validation (when real input arrives)`,
    `## Quick reference: type + validation examples

\`\`\`python
from pydantic import BaseModel

def add(a: int, b: int) -> int:
    return a + b

class User(BaseModel):
    id: int
    email: str

print(add(2, 3))                 # 5
print(User(id=1, email="a@b.c")) # id=1 email='a@b.c'
\`\`\``,
    `## Common confusion

mypy does not run in production requests.  
It checks source code in editor/CI.  
Pydantic validates actual runtime data crossing API boundaries.`,
  ],
  'py-quality': [
    `## Beginner TL;DR

Quality pipeline:
1. format (\`ruff format\`)
2. lint (\`ruff check\`)
3. test (\`pytest\`)

Run all 3 before commit.`,
    `## Quick reference: minimal quality loop

\`\`\`bash
ruff format .
ruff check . --fix
pytest -q
\`\`\`

Expected result:
- formatter changes code style
- linter reports/fixes issues
- tests pass`,
    `## Real scenario: CI gate

In CI, fail fast:
1) \`ruff check\`  
2) \`ruff format --check\`  
3) \`pytest\`  
This saves build minutes and catches style bugs early.`,
  ],
  'py-fullstack-scripts': [
    `## Beginner TL;DR

Scripts should be reproducible:
- read config from env
- parse CLI args
- call HTTP with timeout + error handling`,
    `## Quick reference: safe GET request

\`\`\`python
import httpx

url = "https://httpbin.org/get"
r = httpx.get(url, timeout=10.0)
print(r.status_code)
print(r.headers.get("content-type", ""))
\`\`\`

Expected output (shape):
\`\`\`
200
application/json...
\`\`\``,
    `## Real scenario: health-check CLI

Use one script in cron/CI to check service health and return non-zero exit on failure.  
That gives immediate alerting without opening dashboards.`,
  ],
  'py-concurrency': [
    `## Beginner TL;DR

- I/O-bound: threading or asyncio  
- CPU-bound: multiprocessing  
The GIL prevents true CPU parallel threads in one process.`,
    `## Quick reference: choose concurrency model

| Workload | Best default |
|---------|--------------|
| Many HTTP calls | asyncio |
| Blocking library calls | threading |
| Heavy numeric transforms | multiprocessing |

\`\`\`python
import asyncio

async def task(i):
    await asyncio.sleep(0.1)
    return i

print(asyncio.run(asyncio.gather(*(task(i) for i in range(3)))))
# [0, 1, 2]
\`\`\``,
    `## Output walkthrough: CPU-bound note

If you run CPU-heavy loops in threads, speedup is often poor due to GIL.
Use process pool for real parallel CPU execution.`,
  ],
}

function toBlocks(markdowns: string[]): ContentBlock[] {
  return markdowns.map(markdown => ({ type: 'text', markdown }))
}

export function applyPhase3ToolingEnhancements(lessons: Lesson[]): Lesson[] {
  return lessons.map(lesson => {
    const markdowns = phase3ToolingBlocks[lesson.id]
    if (!markdowns) return lesson
    return {
      ...lesson,
      content: [...toBlocks(markdowns), ...lesson.content],
    }
  })
}
