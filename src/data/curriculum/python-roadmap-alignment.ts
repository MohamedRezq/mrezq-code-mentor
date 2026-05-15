/**
 * Curriculum alignment with roadmap.sh (primary reference).
 * @see https://roadmap.sh/python
 * @see https://roadmap.sh/full-stack
 * @see https://roadmap.sh/django
 * @see https://roadmap.sh/postgresql
 * @see https://roadmap.sh/docker
 */

export interface RoadmapTopic {
  source: string
  topic: string
  lessonIds: string[]
  status: 'covered' | 'partial' | 'planned'
}

/** Python + full-stack topics mapped to Module 09 lesson IDs. */
export const PYTHON_ROADMAP_TOPICS: RoadmapTopic[] = [
  // roadmap.sh/python — language
  { source: 'python', topic: 'Learn the basics', lessonIds: ['py-getting-started'], status: 'covered' },
  { source: 'python', topic: 'Basic syntax & data types', lessonIds: ['py-types-and-strings'], status: 'covered' },
  { source: 'python', topic: 'Operators & truthiness', lessonIds: ['py-operators-truthiness'], status: 'covered' },
  { source: 'python', topic: 'Control flow & match-case', lessonIds: ['py-control-flow'], status: 'covered' },
  { source: 'python', topic: 'Loops & comprehensions', lessonIds: ['py-loops-iterations'], status: 'covered' },
  { source: 'python', topic: 'Functions & lambdas', lessonIds: ['py-functions-deep'], status: 'covered' },
  { source: 'python', topic: 'Modules & stdlib', lessonIds: ['py-modules-stdlib'], status: 'covered' },
  { source: 'python', topic: 'Data structures', lessonIds: ['py-collections-pro'], status: 'covered' },
  { source: 'python', topic: 'Exceptions & I/O', lessonIds: ['py-exceptions-files'], status: 'covered' },
  { source: 'python', topic: 'JSON & datetime', lessonIds: ['py-json-datetime'], status: 'covered' },
  { source: 'python', topic: 'Regex', lessonIds: ['py-regex'], status: 'covered' },
  { source: 'python', topic: 'OOP & dataclasses', lessonIds: ['py-oop-solid'], status: 'covered' },
  { source: 'python', topic: 'Iterators, generators, decorators', lessonIds: ['py-patterns-advanced'], status: 'covered' },
  { source: 'python', topic: 'Virtual env & packaging', lessonIds: ['py-env', 'py-packaging'], status: 'covered' },
  { source: 'python', topic: 'Type hints & static checking', lessonIds: ['py-typing'], status: 'covered' },
  { source: 'python', topic: 'Testing (pytest)', lessonIds: ['py-quality', 'pb-test-pytest'], status: 'covered' },
  { source: 'python', topic: 'Concurrency & asyncio', lessonIds: ['py-concurrency', 'pb-fastapi-async'], status: 'covered' },
  { source: 'python', topic: 'HTTP & scripting', lessonIds: ['py-fullstack-scripts'], status: 'covered' },
  // roadmap.sh — DSA
  { source: 'python', topic: 'Big O & complexity', lessonIds: ['py-dsa-complexity'], status: 'covered' },
  { source: 'python', topic: 'Arrays, stacks, queues, linked lists', lessonIds: ['py-dsa-linear'], status: 'covered' },
  { source: 'python', topic: 'Hash tables', lessonIds: ['py-dsa-hash'], status: 'covered' },
  { source: 'python', topic: 'Trees & heaps', lessonIds: ['py-dsa-trees'], status: 'covered' },
  { source: 'python', topic: 'Sorting & searching', lessonIds: ['py-dsa-algorithms'], status: 'covered' },
  // roadmap.sh/django + flask
  { source: 'django', topic: 'Django fundamentals & MTV', lessonIds: ['dj-intro'], status: 'covered' },
  { source: 'django', topic: 'Models & migrations', lessonIds: ['dj-models'], status: 'covered' },
  { source: 'django', topic: 'Views & templates', lessonIds: ['dj-views'], status: 'covered' },
  { source: 'django', topic: 'DRF APIs', lessonIds: ['dj-drf'], status: 'covered' },
  { source: 'django', topic: 'Auth & custom user', lessonIds: ['dj-auth'], status: 'covered' },
  { source: 'django', topic: 'Flask microservices', lessonIds: ['py-flask'], status: 'covered' },
  { source: 'django', topic: 'Framework comparison capstone', lessonIds: ['py-frameworks-mastery'], status: 'covered' },
  // FastAPI / APIs
  { source: 'full-stack', topic: 'REST API design', lessonIds: ['pb-fastapi-intro', 'pb-fastapi-routing', 'be-api-design-and-errors'], status: 'partial' },
  { source: 'python', topic: 'FastAPI & Pydantic', lessonIds: ['pb-fastapi-validation'], status: 'covered' },
  { source: 'python', topic: 'JWT auth', lessonIds: ['pb-fastapi-auth'], status: 'covered' },
  { source: 'python', topic: 'Middleware & production APIs', lessonIds: ['pb-fastapi-middleware'], status: 'covered' },
  // Databases
  { source: 'postgresql', topic: 'SQLAlchemy & ORM', lessonIds: ['pb-db-sqlalchemy'], status: 'covered' },
  { source: 'postgresql', topic: 'Migrations (Alembic)', lessonIds: ['pb-db-alembic'], status: 'covered' },
  { source: 'postgresql', topic: 'Advanced queries', lessonIds: ['pb-db-queries'], status: 'covered' },
  { source: 'postgresql', topic: 'Redis caching', lessonIds: ['pb-db-redis'], status: 'covered' },
  { source: 'postgresql', topic: 'PostgreSQL tuning', lessonIds: ['pb-db-postgres-advanced'], status: 'covered' },
  // Testing & production
  { source: 'python', topic: 'API integration tests', lessonIds: ['pb-test-api', 'pb-test-patterns'], status: 'covered' },
  { source: 'docker', topic: 'Containerization', lessonIds: ['pb-prod-docker'], status: 'covered' },
  { source: 'python', topic: 'Task queues (Celery)', lessonIds: ['pb-prod-celery'], status: 'covered' },
  { source: 'python', topic: 'Observability', lessonIds: ['pb-prod-observability'], status: 'covered' },
  { source: 'python', topic: 'Deployment patterns', lessonIds: ['pb-prod-deployment'], status: 'covered' },
  { source: 'python', topic: 'Quick reference', lessonIds: ['py-cheat-sheet'], status: 'covered' },
]

export function roadmapCoverageStats() {
  const covered = PYTHON_ROADMAP_TOPICS.filter((t) => t.status === 'covered').length
  const partial = PYTHON_ROADMAP_TOPICS.filter((t) => t.status === 'partial').length
  const planned = PYTHON_ROADMAP_TOPICS.filter((t) => t.status === 'planned').length
  return { covered, partial, planned, total: PYTHON_ROADMAP_TOPICS.length }
}
