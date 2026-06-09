import type { ContentBlock, Lesson } from '@/types/lesson'

// ─── Git & Docker: scenario-first professional reference ─────────────────────
// Focus: real situations, command sequences with outputs, how to deal, mistakes
// ─────────────────────────────────────────────────────────────────────────────

const gitDockerBlocks: Record<string, string[]> = {
  // ─── Git Workflow ──────────────────────────────────────────────────────────
  'do-git-workflow': [
    `## Beginner TL;DR — Git on a real team

You never commit directly to \`main\`. You:
1. Pull latest \`main\`
2. Create a **feature branch**
3. Commit small, logical changes
4. Push and open a **Pull Request (PR)**
5. After review → merge → delete branch

**Pronunciation:** GIT (hard G, like "get")`,

    `## Terminology you must spell and say

| Term | Pronunciation | Meaning |
|---|---|---|
| Repository (repo) | re-POZ-i-tory | Project folder tracked by Git |
| Commit | kuh-MIT | Saved snapshot with message |
| Branch | — | Independent line of development |
| Merge | — | Combine two branches |
| Rebase | REE-base | Replay commits on top of another branch |
| Pull Request (PR) | — | Request to merge your branch (GitHub/GitLab) |
| Staging area | — | Files marked ready for next commit (\`git add\`) |
| HEAD | — | Current commit/branch pointer |
| Remote | — | Copy on server (usually \`origin\`) |
| Fast-forward | — | Merge with no divergent commits |
| Conflict | — | Same lines edited differently — Git can't auto-merge |`,

    `## Full reference: daily commands with outputs

\`\`\`bash
# ── Start of day: sync with team ─────────────────────────────
git checkout main
git pull origin main
# → Already up to date.
# OR → Fast-forward ... 3 files changed

git checkout -b feature/order-refunds
# → Switched to a new branch 'feature/order-refunds'

# ── See what changed ─────────────────────────────────────────
git status
# → On branch feature/order-refunds
# → Changes not staged for commit:
#       modified:   src/orders/refund.py

git diff src/orders/refund.py    # unstaged changes
git diff --staged                # staged changes (after git add)

# ── Commit (small, one logical change) ───────────────────────
git add src/orders/refund.py tests/test_refund.py
git commit -m "feat(orders): add refund validation for partial amounts"
# → [feature/order-refunds a1b2c3d] feat(orders): add refund validation...

# ── Push branch to remote ────────────────────────────────────
git push -u origin feature/order-refunds
# → branch 'feature/order-refunds' set up to track 'origin/feature/order-refunds'

# ── After PR merged — clean up locally ───────────────────────
git checkout main
git pull origin main
git branch -d feature/order-refunds
# → Deleted branch feature/order-refunds (was a1b2c3d)
\`\`\``,

    `## Real scenario: merge conflict during PR update

**Situation:** You opened a PR. Meanwhile, a teammate merged changes to the same file on \`main\`. CI shows conflicts.

\`\`\`bash
git checkout feature/order-refunds
git fetch origin
git merge origin/main
# → Auto-merging src/orders/service.py
# → CONFLICT (content): Merge conflict in src/orders/service.py
# → Automatic merge failed; fix conflicts and then commit the result.

git status
# → both modified: src/orders/service.py

# Open file — Git marks conflict:
# <<<<<<< HEAD
#   your version
# =======
#   their version
# >>>>>>> origin/main

# Edit file: keep correct combined logic, remove markers
git add src/orders/service.py
git commit -m "merge main into feature/order-refunds, resolve service conflict"
git push
# → PR updates, CI re-runs, conflict gone
\`\`\`

**Alternative (teams that rebase):**
\`\`\`bash
git fetch origin
git rebase origin/main
# fix conflicts per commit → git add → git rebase --continue
git push --force-with-lease
\`\`\`

**Rule:** Never \`git push --force\` to \`main\`. On feature branches, prefer \`--force-with-lease\` over \`--force\`.`,

    `## Real scenario: hotfix while feature branch is half-done

**Situation:** Production is broken. You're mid-feature on \`feature/big-refactor\`. Need urgent fix on \`main\`.

\`\`\`bash
# 1. Save WIP safely (don't commit half-broken code)
git stash push -m "WIP refactor checkout step"
# → Saved working directory and index state

git checkout main
git pull origin main
git checkout -b fix/payment-null-pointer

# 2. Fix, test, commit, push, PR, merge (fast track review)

git checkout main
git pull origin main

# 3. Return to feature work
git checkout feature/big-refactor
git stash pop
# resolve any stash conflicts if same files touched
\`\`\`

**Output you want after hotfix merge:**
\`\`\`bash
git log --oneline -5 main
# → c4d5e6f fix(payments): guard null subscription id  ← hotfix
# → b2c3d4e feat(auth): add OAuth callback
\`\`\``,

    `## Real scenario: undo mistakes

### A) Wrong files staged — before commit
\`\`\`bash
git restore --staged .env          # unstage secret file
git restore .env                   # discard local change to .env (careful!)
\`\`\`

### B) Bad commit message — not pushed yet
\`\`\`bash
git commit --amend -m "fix(api): correct rate limit header name"
\`\`\`

### C) Committed to wrong branch — not pushed
\`\`\`bash
git log --oneline -1               # note commit hash abc1234
git reset --soft HEAD~1            # undo commit, keep changes staged
git stash
git checkout correct-branch
git stash pop
git commit -m "feat: ..."
\`\`\`

### D) Already pushed — don't rewrite history on shared branches
\`\`\`bash
git revert abc1234                 # new commit that undoes abc1234
git push origin main
\`\`\``,

    `## Real scenario: secret committed to Git

**Situation:** You committed \`.env\` with \`DATABASE_URL\` and pushed.

\`\`\`bash
# 1. IMMEDIATELY rotate the secret in production (assume compromised)

# 2. Remove file from tracking (keep local copy)
echo ".env" >> .gitignore
git rm --cached .env
git commit -m "chore: stop tracking .env"
git push

# 3. If secret is in history → use git filter-repo or BFG
#    (team process — never just delete last commit if others pulled)
\`\`\`

**Prevention:** Pre-commit hook blocks \`.env\`:
\`\`\`yaml
# .pre-commit-config.yaml
repos:
  - repo: https://github.com/gitleaks/gitleaks
    rev: v8.18.0
    hooks:
      - id: gitleaks
\`\`\``,

    `## Real scenario: find which commit broke CI

\`\`\`bash
git bisect start
git bisect bad HEAD              # current commit is broken
git bisect good v1.4.0           # last known good release tag

# Git checks out middle commit — you test:
npm test
git bisect good   # or git bisect bad

# Repeat until Git prints:
# → abc1234 is the first bad commit

git bisect reset
\`\`\``,

    `## Merge vs rebase vs squash — when to use what

| Situation | Use | Why |
|---|---|---|
| Updating feature branch with latest main | \`merge origin/main\` OR \`rebase origin/main\` | Team policy — rebase = linear history |
| Merging PR on GitHub | **Squash merge** (common) | One commit per feature on main |
| Long-lived shared branch | **Merge** | Preserves history, no force-push |
| Open-source / strict linear history | **Rebase + squash** | Clean \`git log\` |
| Already pushed feature, rebased locally | \`push --force-with-lease\` | Updates remote safely |

**Junior rule:** If unsure, ask the team. Never rebase commits other people already built on.`,

    `## Professional commit messages (Conventional Commits)

\`\`\`bash
feat(auth): add password reset email flow
fix(checkout): prevent double charge on retry
chore(deps): bump axios to 1.7.2
docs(readme): add local setup for Docker
refactor(orders): extract pricing into service layer
test(users): cover edge case for empty display name
\`\`\`

**Format:** \`type(scope): imperative summary\` — present tense, ≤72 chars subject.`,

    `## Junior mistakes + fix

| Mistake | What happens | Fix |
|---|---|---|
| Commit directly to \`main\` | Breaks team workflow, no review | Always branch first |
| Giant 50-file commits | Unreviewable PRs | Commit per logical unit |
| \`git push --force\` on shared branch | Teammates' history breaks | Use \`--force-with-lease\` on own feature branch only |
| Commit secrets | Security incident | \`.gitignore\` + gitleaks + rotate credentials |
| Ignore merge conflicts markers | Broken code ships (\`<<<<<<<\`) | Search repo for \`<<<<<<<\` before push |
| Never pull before starting work | Conflicts pile up | \`git pull origin main\` every morning |`,
  ],

  // ─── Docker Basics (DevOps module) ─────────────────────────────────────────
  'do-docker-basics': [
    `## Beginner TL;DR — Docker images & containers

**Image** = recipe (read-only). **Container** = running instance of that recipe.

You build once, run anywhere. No more "works on my machine."

\`\`\`bash
docker build -t myapp:1.0 .
docker run -p 3000:3000 --env-file .env myapp:1.0
\`\`\``,

    `## Full reference: essential Docker commands with outputs

\`\`\`bash
# Build
docker build -t myapp:dev .
# → [+] Building 45.2s
# → => exporting to image
# → => naming to docker.io/library/myapp:dev

# Run (map port, pass env, name container, detach)
docker run -d --name myapp \\
  -p 3000:3000 \\
  -e NODE_ENV=production \\
  -e DATABASE_URL=postgres://... \\
  myapp:dev
# → a1b2c3d4e5f6...  (container ID)

# Logs (why did it crash?)
docker logs myapp
docker logs -f myapp --tail 100

# Shell inside running container
docker exec -it myapp sh
# appuser@a1b2c3:/app$ ls

# Inspect / debug
docker ps                          # running containers
docker ps -a                       # all (including exited)
docker inspect myapp | jq '.[0].State'

# Stop and remove
docker stop myapp
docker rm myapp

# Remove unused images (free disk)
docker image prune -a
\`\`\``,

    `## Real scenario: container exits immediately (exit code 1)

**Situation:** \`docker run myapp\` starts then stops. \`docker ps\` shows nothing.

\`\`\`bash
docker ps -a --filter name=myapp
# → STATUS: Exited (1) 2 seconds ago

docker logs myapp
# → Error: Cannot find module './dist/server.js'
# → npm ERR! Missing script: "start"
\`\`\`

**How to deal — checklist:**
1. Read \`docker logs <container>\` — always first step
2. Wrong \`CMD\` or build step didn't compile → fix Dockerfile
3. Missing env var → app crashes on boot → add \`-e\` or \`--env-file\`
4. App binds \`127.0.0.1\` inside container → use \`0.0.0.0\`

\`\`\`dockerfile
# WRONG — only reachable inside container
CMD ["node", "server.js"]   # if server listens on 127.0.0.1:3000

# RIGHT — expose on all interfaces
ENV HOST=0.0.0.0
CMD ["node", "dist/server.js"]
\`\`\``,

    `## Real scenario: "works locally" but fails in Docker

| Local | Docker | Fix |
|---|---|---|
| \`localhost:5432\` Postgres | Container is isolated network | Use service name: \`postgres:5432\` |
| Files in \`./uploads\` | Path not in image | \`VOLUME\` or bind mount |
| \`python script.py\` | Python not in PATH | Set \`ENV PATH\` or use full venv path |
| Writes to \`/var/log\` | Read-only or no permission | Run as non-root with writable dir |
| 2 GB node_modules copied | Slow build, huge image | Multi-stage + \`.dockerignore\` |

\`\`\`bash
# Debug: run with shell instead of CMD
docker run -it --entrypoint sh myapp:dev
# manually run commands inside to see exact error
\`\`\``,

    `## Real scenario: image is 2 GB — optimize layers

\`\`\`dockerfile
# ❌ BAD: single stage, dev deps included, no .dockerignore
FROM node:22
COPY . .
RUN npm install
CMD ["npm", "start"]

# ✅ GOOD: multi-stage, slim base, cached deps layer
FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

FROM node:22-alpine
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
USER node
CMD ["node", "server.js"]
\`\`\`

\`\`\`bash
docker images myapp
# BEFORE → 1.9GB
# AFTER  → 180MB

docker history myapp:dev --no-trunc | head
# see which layer bloated the image
\`\`\``,

    `## Real scenario: port already in use

\`\`\`bash
docker run -p 3000:3000 myapp
# → Error: bind: address already in use

# Find what's using port 3000
ss -tlnp | grep 3000        # Linux
netstat -ano | findstr 3000  # Windows

# Option A: stop conflicting container
docker ps | grep 3000
docker stop <id>

# Option B: map different host port
docker run -p 3001:3000 myapp   # host:container
\`\`\``,

    `## Real scenario: secret baked into image layer

**Situation:** \`ENV API_KEY=sk-live-...\` in Dockerfile. Even after removing line, old layers still contain it.

**How to deal:**
1. Rotate the key immediately
2. Never put secrets in Dockerfile — use runtime env:
   \`\`\`bash
   docker run -e API_KEY="\$API_KEY" myapp
   \`\`\`
3. Use Docker secrets / K8s secrets in production
4. Scan images: \`docker scout cves myapp\` or Trivy

\`\`\`bash
# Build with secret mount (BuildKit — not stored in layers)
docker build --secret id=api_key,src=.api_key .
\`\`\``,

    `## Junior mistakes + fix

| Mistake | What happens | Fix |
|---|---|---|
| No \`.dockerignore\` | Slow builds, secrets in context | Copy \`.gitignore\` patterns + \`.env\` |
| \`COPY .\` before \`package.json\` | Cache bust every code change | Copy dependency files first |
| Run as root | Container escape = host access | \`USER nonroot\` |
| \`:latest\` tag in production | Can't rollback, unknown version | Pin tags or digests: \`myapp:1.2.3\` |
| No HEALTHCHECK | Orchestrator sends traffic to dead app | Add health endpoint + HEALTHCHECK |`,
  ],

  // ─── Docker Compose ────────────────────────────────────────────────────────
  'do-docker-compose': [
    `## Beginner TL;DR — Docker Compose

Compose runs **multiple containers** as one project: app + database + Redis + worker.

One file (\`compose.yaml\`), one command: \`docker compose up\`.

**Use for:** local development and integration testing — not usually production orchestration (that's Kubernetes).`,

    `## Full reference: compose commands with outputs

\`\`\`bash
docker compose up              # foreground, all logs
docker compose up -d           # detached (background)
docker compose ps
# → NAME          STATUS          PORTS
# → myapp-api-1   running         0.0.0.0:3000->3000/tcp
# → myapp-db-1    running (healthy)

docker compose logs -f api     # follow one service
docker compose exec api sh     # shell in api service
docker compose exec db psql -U app -d app

docker compose down            # stop, remove containers (keep volumes)
docker compose down -v         # ⚠ also delete volumes — wipes DB data

docker compose build --no-cache api   # force rebuild one service
docker compose up --build             # rebuild then start
\`\`\``,

    `## Real scenario: app starts before database is ready

**Situation:** API crashes with \`connection refused\` to Postgres on first \`docker compose up\`.

\`\`\`yaml
services:
  api:
    depends_on:
      db:
        condition: service_healthy   # ← wait for healthcheck, not just "started"

  db:
    image: postgres:16
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U app -d app"]
      interval: 5s
      timeout: 3s
      retries: 10
      start_period: 10s
\`\`\`

**Still failing?** Add retry logic in app startup:
\`\`\`python
# wait for DB — 30s max
for attempt in range(30):
    try:
        conn = await engine.connect()
        break
    except Exception:
        await asyncio.sleep(1)
\`\`\``,

    `## Real scenario: dev hot-reload vs production config

**Pattern:** Base \`compose.yaml\` + override \`compose.override.yaml\` (auto-loaded locally).

\`\`\`yaml
# compose.yaml — shared
services:
  api:
    build: .
    ports: ["3000:3000"]
    depends_on:
      db: { condition: service_healthy }

# compose.override.yaml — dev only (gitignored or committed)
services:
  api:
    volumes:
      - ./src:/app/src        # hot reload
    command: npm run dev
    environment:
      DEBUG: "true"

# compose.prod.yaml — explicit for staging
# docker compose -f compose.yaml -f compose.prod.yaml up -d
\`\`\``,

    `## Real scenario: env vars and secrets in Compose

\`\`\`yaml
services:
  api:
    env_file:
      - .env.local            # never commit — in .gitignore
    environment:
      NODE_ENV: production
      DATABASE_URL: postgres://app:\${DB_PASSWORD}@db:5432/app
    secrets:
      - db_password

secrets:
  db_password:
    file: ./secrets/db_password.txt   # chmod 600, not in git

  db:
    image: postgres:16
    environment:
      POSTGRES_PASSWORD_FILE: /run/secrets/db_password
    secrets:
      - db_password
\`\`\`

**Junior mistake:** Committing \`.env\` with production passwords → use \`.env.example\` with placeholders only.`,

    `## Real scenario: debugging a multi-service stack

\`\`\`bash
# 1. Which service is unhealthy?
docker compose ps

# 2. Logs for failing service
docker compose logs db --tail 50

# 3. Network connectivity from api → db
docker compose exec api ping db
docker compose exec api nc -zv db 5432

# 4. Reset everything (nuclear — loses DB data)
docker compose down -v
docker compose up --build
\`\`\``,

    `## Real scenario: CI runs tests with Compose

\`\`\`yaml
# .github/workflows/test.yml
jobs:
  integration:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: docker compose -f compose.yaml -f compose.ci.yaml up -d --wait
      - run: docker compose exec -T api npm test
      - run: docker compose down -v
\`\`\`

\`--wait\` (Compose v2.1+): exits when all healthchecks pass — no flaky "DB not ready" tests.`,

    `## Junior mistakes + fix

| Mistake | What happens | Fix |
|---|---|---|
| Plain \`depends_on: [db]\` | App starts before DB accepts connections | Use \`condition: service_healthy\` |
| \`docker compose down -v\` on prod-like data | All local DB data gone | Use named volumes consciously |
| Same ports on two projects | Bind errors | Set \`COMPOSE_PROJECT_NAME\` or change ports |
| Mount entire repo over built \`node_modules\` | Module not found in container | Anonymous volume for \`node_modules\` |
| Production compose without resource limits | One service eats all RAM | Add \`deploy.resources.limits\` |`,
  ],

  // ─── CI/CD (Git + pipeline scenarios) ──────────────────────────────────────
  'do-cicd': [
    `## Beginner TL;DR — CI/CD

**CI (Continuous Integration):** Every push runs tests automatically.
**CD (Continuous Delivery/Deployment):** Passing main branch deploys to staging/production.

**Git connection:** Pipeline triggers on \`push\`, \`pull_request\`, or \`merge\` events.`,

    `## Real scenario: standard GitHub Actions pipeline

\`\`\`yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

concurrency:
  group: \${{ github.workflow }}-\${{ github.ref }}
  cancel-in-progress: true    # cancel old runs on same branch

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm

      - run: npm ci
      - run: npm run lint
      - run: npm test -- --coverage

  deploy:
    needs: test
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    runs-on: ubuntu-latest
    environment: production     # requires approval in GitHub settings
    steps:
      - uses: actions/checkout@v4
      - run: npm ci && npm run build
      - run: vercel deploy --prod --token=\${{ secrets.VERCEL_TOKEN }}
\`\`\``,

    `## Real scenario: PR checks block bad merge

**Situation:** Developer opens PR. Lint fails. What should happen?

\`\`\`bash
# Locally before push — catch early
npm run lint
npm test

git push origin feature/my-branch
# → GitHub shows ❌ CI failed on PR

# Fix, commit, push again
git add .
git commit -m "fix: resolve eslint unused import"
git push
# → ✅ CI passes → reviewer approves → merge
\`\`\`

**Branch protection on \`main\`:**
- Require PR review
- Require status checks (CI) to pass
- No direct pushes`,

    `## Real scenario: deploy succeeds but app is broken (rollback)

\`\`\`bash
# Deploy tagged images — always know previous version
docker build -t myregistry/myapp:\${{ github.sha }} .
docker push myregistry/myapp:\${{ github.sha }}
docker tag myregistry/myapp:\${{ github.sha }} myregistry/myapp:latest
docker push myregistry/myapp:latest

# Rollback = redeploy previous SHA
kubectl set image deployment/api api=myregistry/myapp:abc1234prev
# OR
vercel rollback
# OR
git revert <bad-merge-commit> && git push origin main
\`\`\`

**Post-deploy smoke test in pipeline:**
\`\`\`yaml
- name: Smoke test
  run: |
    curl -f https://api.myapp.com/health || exit 1
\`\`\``,

    `## Real scenario: cache dependencies in CI (speed)

\`\`\`yaml
- uses: actions/cache@v4
  with:
    path: ~/.npm
    key: \${{ runner.os }}-npm-\${{ hashFiles('package-lock.json') }}
    restore-keys: \${{ runner.os }}-npm-
\`\`\`

**Without cache:** 3 min \`npm ci\` every run.
**With cache:** ~20 seconds on cache hit.`,

    `## Junior mistakes + fix

| Mistake | What happens | Fix |
|---|---|---|
| Secrets in workflow YAML | Exposed in logs/repo | Use GitHub Secrets |
| Deploy on every PR | Preview env pollution | \`if: github.ref == 'refs/heads/main'\` |
| No concurrency cancel | 10 parallel runs waste minutes | \`concurrency: cancel-in-progress\` |
| Skip tests on "tiny change" | Production outage | Tests always run on PR |
| No rollback plan | Long downtime | Pin image SHAs, document rollback cmd |`,
  ],

  // ─── GitOps ─────────────────────────────────────────────────────────────────
  'do-gitops': [
    `## Beginner TL;DR — GitOps

**Git is the source of truth** for what's deployed. You don't \`kubectl apply\` manually — you merge a PR to the config repo and Argo CD / Flux syncs the cluster.

**Flow:** Code PR → image built → update manifest in git → GitOps controller deploys.`,

    `## Real scenario: promote staging → production via git

\`\`\`bash
# infra repo structure
# environments/
#   staging/
#     deployment.yaml    → image: myapp:abc1234
#   production/
#     deployment.yaml    → image: myapp:v1.4.0  (pinned)

# Promote: copy tested SHA from staging manifest to production
git checkout -b promote/abc1234-to-prod
# edit production/deployment.yaml → image: myapp:abc1234
git commit -m "chore(prod): promote myapp abc1234 from staging"
git push origin promote/abc1234-to-prod
# PR review → merge → Argo CD syncs production
\`\`\``,

    `## Real scenario: rollback with GitOps

\`\`\`bash
git revert HEAD              # revert the promote commit
git push origin main
# → Argo CD detects change → rolls back to previous manifest
# → Kubernetes rolls back Deployment
\`\`\`

**Why better than manual kubectl:** Audit trail in git, same review process, no ssh to cluster.`,

    `## Real scenario: Helm values per environment

\`\`\`yaml
# helm/myapp/values-staging.yaml
replicaCount: 1
image:
  tag: abc1234
ingress:
  host: staging.api.myapp.com

# helm/myapp/values-production.yaml
replicaCount: 3
image:
  tag: v1.4.0
resources:
  limits:
    memory: 512Mi
\`\`\`

\`\`\`bash
helm upgrade myapp ./helm/myapp -f values-production.yaml -n production
\`\`\``,

    `## Junior mistakes + fix

| Mistake | What happens | Fix |
|---|---|---|
| Manual \`kubectl apply\` on prod | Drift from git, not auditable | All changes via git PR |
| \`:latest\` tag in manifests | Unknown version deployed | Pin image digest or semver tag |
| No diff review before sync | Bad config takes down prod | Argo CD "Preview diff" in PR checks |
| Secrets in git manifests | Credential leak | Sealed Secrets / External Secrets operator |`,
  ],

  // ─── Python Backend Docker (extra scenarios) ───────────────────────────────
  'pb-prod-docker': [
    `## Real scenario: debug a failing FastAPI container in production-like mode

\`\`\`bash
# Build exactly what CI builds
docker build -t myapp:debug --target production .

# Run with same env as compose
docker run --rm -it \\
  --env-file .env.production.local \\
  -p 8000:8000 \\
  myapp:debug

# Container exits? Check logs
docker logs $(docker ps -lq)

# Override entrypoint to debug interactively
docker run --rm -it --entrypoint bash myapp:debug
# appuser@...$ gunicorn app.main:app -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
\`\`\``,

    `## Real scenario: zero-downtime redeploy with Compose (single host)

\`\`\`bash
# Build new image with new tag
docker compose build api
docker compose up -d --no-deps api
# → recreates only api container; db/redis keep running

# Verify health before telling team
curl -f http://localhost:8000/health
# → {"status":"ok"}

# Rollback if broken
docker tag myapp:previous myapp:latest
docker compose up -d --no-deps api
\`\`\``,

    `## Real scenario: CI builds and pushes Docker image

\`\`\`yaml
# .github/workflows/docker.yml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: docker/setup-buildx-action@v3

      - uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: \${{ github.actor }}
          password: \${{ secrets.GITHUB_TOKEN }}

      - uses: docker/build-push-action@v5
        with:
          push: true
          tags: ghcr.io/org/myapp:\${{ github.sha }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
\`\`\`

**Best practice:** Never build on production server. CI builds immutable image; prod only pulls.`,

    `## Real scenario: disk full from old Docker layers

\`\`\`bash
docker system df
# → Images  45GB
# → Build cache  12GB

docker system prune -a --volumes   # ⚠ removes unused images/volumes
# OR scheduled cleanup in CI runners

# Prevention: multi-stage builds + .dockerignore + pin base image versions
\`\`\``,
  ],
}

function toBlocks(markdowns: string[]): ContentBlock[] {
  return markdowns.map((markdown) => ({ type: 'text' as const, markdown }))
}

export function applyGitDockerScenarioEnhancements(lessons: Lesson[]): Lesson[] {
  return lessons.map((lesson) => {
    const markdowns = gitDockerBlocks[lesson.id]
    if (!markdowns) return lesson
    return {
      ...lesson,
      content: [...toBlocks(markdowns), ...lesson.content],
    }
  })
}

export function applyPythonDockerScenarioEnhancements(lessons: Lesson[]): Lesson[] {
  const markdowns = gitDockerBlocks['pb-prod-docker']
  if (!markdowns) return lessons
  return lessons.map((lesson) => {
    if (lesson.id !== 'pb-prod-docker') return lesson
    return {
      ...lesson,
      content: [...toBlocks(markdowns), ...lesson.content],
    }
  })
}
