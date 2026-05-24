import type { ContentBlock, Lesson } from '@/types/lesson'

// ─── PHASE 6: Databases ───────────────────────────────────────────────────────
// Expert-reviewer + beginner-tutor standard:
// TL;DR · terminology · full API reference with outputs ·
// lifecycle diagram · real scenarios · junior mistakes + fix ·
// code-reading guide
// ─────────────────────────────────────────────────────────────────────────────

const phase6Blocks: Record<string, string[]> = {
  // ─── Lesson 1: SQLAlchemy 2.0 ────────────────────────────────────────────
  'pb-db-sqlalchemy': [
    `## Beginner TL;DR — SQLAlchemy 2.0

SQLAlchemy is the standard Python ORM (Object-Relational Mapper). You define Python classes and it handles the SQL.

Version 2.0 introduced **typed mapped columns** and **async support**. Always use 2.0-style. Old 1.x patterns (Session.query()) are legacy.

**Pronunciation:** SQL-AL-kem-ee`,

    `## Terminology

| Term | Meaning |
|---|---|
| Engine | The connection factory — knows the DB URL, manages the pool |
| Session | A unit of work — tracks which objects changed, flushes changes to DB |
| Mapped | The 2.0 approach to declare ORM columns using Python type annotations |
| Declarative Base | The parent class all your ORM models inherit from |
| Connection pool | Background set of persistent DB connections, reused across requests |
| Flush | Write pending changes to DB (in transaction, not yet committed) |
| Commit | Make changes permanent in the DB |
| Rollback | Undo all unflushed/uncommitted changes |
| Lazy loading | Access a relationship → fires an extra DB query (default, avoid in loops) |
| Eager loading | Pre-fetch relationships in the same query via JOIN or extra SELECT |`,

    `## Full reference: model definition with all common column types

\`\`\`python
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship
from sqlalchemy import String, Text, Integer, Numeric, Boolean, DateTime, ForeignKey, Index
from datetime import datetime

class Base(DeclarativeBase):
    pass

class Course(Base):
    __tablename__ = "courses"

    # ── Primary key ──────────────────────────────────────────
    id: Mapped[int] = mapped_column(primary_key=True)

    # ── Strings ──────────────────────────────────────────────
    title: Mapped[str]            = mapped_column(String(200), nullable=False)
    slug:  Mapped[str]            = mapped_column(String(200), unique=True, index=True)
    body:  Mapped[str | None]     = mapped_column(Text)          # Optional text

    # ── Numeric ──────────────────────────────────────────────
    price: Mapped[float]          = mapped_column(Numeric(10, 2), default=0)

    # ── Boolean ──────────────────────────────────────────────
    is_published: Mapped[bool]    = mapped_column(Boolean, default=False)

    # ── Timestamps ───────────────────────────────────────────
    created_at: Mapped[datetime]  = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime]  = mapped_column(DateTime, default=datetime.utcnow,
                                                   onupdate=datetime.utcnow)

    # ── Foreign key ──────────────────────────────────────────
    author_id: Mapped[int]        = mapped_column(ForeignKey("users.id", ondelete="CASCADE"))

    # ── Relationships ────────────────────────────────────────
    author:      Mapped["User"]          = relationship(back_populates="courses")
    enrollments: Mapped[list["Enrollment"]] = relationship(back_populates="course")

    # ── Composite index ──────────────────────────────────────
    __table_args__ = (
        Index("ix_courses_author_published", "author_id", "is_published"),
    )

    def __repr__(self):
        return f"Course(id={self.id}, title={self.title!r})"
\`\`\``,

    `## Full reference: async engine + session setup

\`\`\`python
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker

DATABASE_URL = "postgresql+asyncpg://user:pass@localhost/dbname"

# ── Engine ─────────────────────────────────────────────────────────
engine = create_async_engine(
    DATABASE_URL,
    pool_size=20,          # connections kept open
    max_overflow=10,       # extra connections allowed in burst
    pool_pre_ping=True,    # test connection before using (handles DB restarts)
    echo=False,            # echo=True logs all SQL (dev only)
)

# ── Session factory ────────────────────────────────────────────────
AsyncSessionLocal = async_sessionmaker(
    engine,
    expire_on_commit=False,   # loaded objects remain usable after commit
)

# ── FastAPI dependency ─────────────────────────────────────────────
from contextlib import asynccontextmanager

async def get_db():
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise

# ── Create all tables (dev/test only — use Alembic in production) ──
async def create_tables():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
\`\`\``,

    `## Full reference: CRUD operations with outputs

\`\`\`python
from sqlalchemy import select, update, delete

# ── CREATE ──────────────────────────────────────────────────────────
async def create_course(db: AsyncSession, title: str, price: float) -> Course:
    course = Course(title=title, slug=slugify(title), price=price)
    db.add(course)
    await db.flush()   # assigns id without committing
    print(course.id)   # → 7 (auto-assigned)
    return course      # caller's session.commit() makes it permanent

# ── READ ────────────────────────────────────────────────────────────
# Get by primary key
course = await db.get(Course, 7)
# → Course(id=7, title='Python Basics')

# Get one by condition
result = await db.execute(select(Course).where(Course.slug == "python-basics"))
course = result.scalar_one_or_none()
# → Course object or None

# Get multiple (filter + order + limit)
result = await db.execute(
    select(Course)
    .where(Course.is_published == True)
    .order_by(Course.created_at.desc())
    .limit(10)
)
courses = result.scalars().all()
# → [Course(...), Course(...), ...]  (list)

# ── UPDATE ──────────────────────────────────────────────────────────
# Method 1: load → mutate → commit (for single row, triggers hooks)
course = await db.get(Course, 7)
course.price = 49.99
await db.commit()

# Method 2: bulk update (for many rows, no object load)
await db.execute(
    update(Course).where(Course.level == "free").values(price=0)
)
await db.commit()

# ── DELETE ──────────────────────────────────────────────────────────
# Method 1: load → delete
course = await db.get(Course, 7)
await db.delete(course)

# Method 2: bulk delete
await db.execute(delete(Course).where(Course.is_published == False))
await db.commit()
\`\`\``,

    `## Full reference: eager loading — fixing the N+1 problem

\`\`\`python
from sqlalchemy.orm import selectinload, joinedload

# ❌ N+1 problem: 1 query for courses + 1 query per course for author
result = await db.execute(select(Course))
for c in result.scalars().all():
    print(c.author.name)   # fires a separate SELECT for each course

# ✅ Fix with selectinload (2 queries total):
result = await db.execute(
    select(Course).options(selectinload(Course.author))
)
# Query 1: SELECT * FROM courses
# Query 2: SELECT * FROM users WHERE id IN (1, 2, 3, ...)

# ✅ Fix with joinedload (1 query with JOIN):
result = await db.execute(
    select(Course).options(joinedload(Course.author))
)
# Single: SELECT courses.*, users.* FROM courses JOIN users ON ...

# When to use which:
# - selectinload → one-to-many (avoids row duplication)
# - joinedload   → many-to-one FK (single JOIN, no duplication)
\`\`\``,

    `## Real scenario: course listing with author names — no N+1

\`\`\`python
@router.get("/courses", response_model=list[CourseListResponse])
async def list_courses(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Course)
        .where(Course.is_published == True)
        .options(selectinload(Course.author))      # pre-fetch authors
        .order_by(Course.created_at.desc())
        .limit(20)
    )
    return result.scalars().all()

# Without selectinload: 21 queries (1 list + 20 author lookups)
# With selectinload:    2 queries  (1 list + 1 batch author lookup)
# On a course list of 100 items: 2 vs 101 queries — 50× faster
\`\`\``,

    `## Junior mistakes + fix

| Mistake | What happens | Fix |
|---|---|---|
| Use 1.x \`Session.query()\` style | Deprecated, incompatible with async | Use \`select(Model)\` + \`session.execute()\` |
| Forget \`expire_on_commit=False\` | Accessing object after commit raises \`DetachedInstanceError\` | Set it in \`async_sessionmaker\` |
| \`result.all()\` instead of \`result.scalars().all()\` | Returns tuples, not ORM objects | Always call \`.scalars()\` first |
| No eager loading in loops | N+1 queries — exponential slowdown | Add \`selectinload\` / \`joinedload\` |
| \`echo=True\` in production | Logs every SQL query, severe performance hit | Only enable \`echo=True\` in development |`,
  ],

  // ─── Lesson 2: Alembic Migrations ───────────────────────────────────────
  'pb-db-alembic': [
    `## Beginner TL;DR — Alembic

Alembic is to databases what Git is to code: it tracks every schema change as a versioned file that can be applied or rolled back.

**Why you must use it:**
- Team member adds a column → commits the migration → everyone runs it → databases stay in sync
- Bad migration → rollback to previous version in seconds
- Never run raw ALTER TABLE by hand in production`,

    `## Full reference: Alembic workflow (every command you will use)

\`\`\`bash
# 1. One-time project setup
alembic init alembic

# 2. Detect model changes → generate migration script
alembic revision --autogenerate -m "add_course_level_column"
# Creates: alembic/versions/3f8a2b1c_add_course_level_column.py

# 3. Apply all pending migrations
alembic upgrade head

# 4. Roll back the last migration
alembic downgrade -1

# 5. Roll back to a specific revision
alembic downgrade 3f8a2b1c

# 6. See what is applied and what is pending
alembic history --verbose
alembic current

# 7. Show the SQL without running it (dry run)
alembic upgrade head --sql

# 8. Stamp a DB that already has the schema (first-time Alembic setup on existing DB)
alembic stamp head
\`\`\``,

    `## Full reference: env.py configuration for async SQLAlchemy

\`\`\`python
# alembic/env.py — critical section you must configure
import asyncio
from logging.config import fileConfig
from sqlalchemy.ext.asyncio import create_async_engine
from alembic import context

from app.database import Base           # your DeclarativeBase
from app import models                  # import ALL models so Alembic sees them

config = context.config
fileConfig(config.config_file_name)
target_metadata = Base.metadata         # ← Alembic reads this to detect changes

def do_run_migrations(connection):
    context.configure(connection=connection, target_metadata=target_metadata)
    with context.begin_transaction():
        context.run_migrations()

async def run_async_migrations():
    engine = create_async_engine(DATABASE_URL)
    async with engine.connect() as connection:
        await connection.run_sync(do_run_migrations)
    await engine.dispose()

asyncio.run(run_async_migrations())
\`\`\``,

    `## Full reference: anatomy of a migration file

\`\`\`python
# alembic/versions/3f8a2b1c_add_course_level.py

"""add course level column

Revision ID: 3f8a2b1c
Revises: a1b2c3d4           # ← previous migration
Create Date: 2025-01-15
"""
from alembic import op
import sqlalchemy as sa

def upgrade() -> None:
    # ── Add column ──────────────────────────────────────────────────
    op.add_column("courses",
        sa.Column("level", sa.String(20), nullable=True))

    # ── Backfill data BEFORE making nullable=False ────────────────
    op.execute("UPDATE courses SET level = 'beginner' WHERE level IS NULL")

    # ── Now enforce not-null ───────────────────────────────────────
    op.alter_column("courses", "level", nullable=False)

    # ── Add index ─────────────────────────────────────────────────
    op.create_index("ix_courses_level", "courses", ["level"])

    # ── Add FK ────────────────────────────────────────────────────
    op.create_foreign_key("fk_course_category",
                          "courses", "categories", ["category_id"], ["id"])

def downgrade() -> None:
    # Must be exact reverse of upgrade — in reverse order
    op.drop_constraint("fk_course_category", "courses", type_="foreignkey")
    op.drop_index("ix_courses_level", table_name="courses")
    op.drop_column("courses", "level")
\`\`\``,

    `## Safe migration strategies for production

\`\`\`
Adding a column:
  1. ADD COLUMN with default or nullable → safe (no table lock)
  2. Backfill in batches (UPDATE ... LIMIT 1000)
  3. ALTER COLUMN nullable=False → now safe (no nulls exist)

Removing a column:
  1. Deploy code that stops using the column
  2. Wait one full deployment cycle
  3. DROP COLUMN → now safe (no code references it)

Renaming a column (the hard way — never just rename):
  1. ADD new column
  2. Dual-write to both old and new column in code
  3. Backfill old → new
  4. Switch reads to new column
  5. Remove dual-write
  6. DROP old column

Never rename a column in one migration in production — it causes downtime.
\`\`\``,

    `## Junior mistakes + fix

| Mistake | What happens | Fix |
|---|---|---|
| Edit an already-applied migration | DB schema diverges from migration history | Always create a new migration |
| \`alembic upgrade head\` on production without reading the script | Unexpected data loss | Always run \`--sql\` first to review |
| Skip the downgrade function | Cannot roll back | Always write complete \`downgrade()\` |
| Add \`nullable=False\` column with no default or backfill | ERROR: null constraint on existing rows | Add default or backfill before enforcing not-null |
| Forget to import models in \`env.py\` | Alembic misses tables, generates empty migrations | Import all models in env.py |`,
  ],

  // ─── Lesson 3: Advanced Queries ──────────────────────────────────────────
  'pb-db-queries': [
    `## Beginner TL;DR — Advanced SQLAlchemy Queries

After CRUD, real apps need: aggregation, subqueries, window functions, and efficient bulk operations.

This lesson covers the SQLAlchemy 2.0 patterns for each.`,

    `## Full reference: aggregation and grouping

\`\`\`python
from sqlalchemy import select, func, case, cast, Float

# ── COUNT, SUM, AVG, MIN, MAX ────────────────────────────────────────
result = await db.execute(
    select(
        func.count(Course.id).label("total"),
        func.avg(Course.price).label("avg_price"),
        func.sum(Course.price).label("revenue"),
        func.min(Course.price).label("min_price"),
        func.max(Course.price).label("max_price"),
    )
)
row = result.one()
print(row.total, row.avg_price)  # → 58  29.5

# ── GROUP BY (aggregate per group) ─────────────────────────────────
result = await db.execute(
    select(Course.level, func.count(Course.id).label("count"))
    .where(Course.is_published == True)
    .group_by(Course.level)
    .order_by(func.count(Course.id).desc())
)
for row in result.all():
    print(row.level, row.count)
# → intermediate 24
# → beginner     20
# → advanced     14

# ── HAVING (filter after grouping) ─────────────────────────────────
result = await db.execute(
    select(Course.category_id, func.count().label("n"))
    .group_by(Course.category_id)
    .having(func.count() >= 5)
)
\`\`\``,

    `## Full reference: subqueries and EXISTS

\`\`\`python
from sqlalchemy import select, exists, subquery

# ── Subquery: courses with more than 100 enrollments ───────────────
enrollment_counts = (
    select(Enrollment.course_id, func.count().label("n"))
    .group_by(Enrollment.course_id)
    .subquery()
)

result = await db.execute(
    select(Course)
    .join(enrollment_counts, Course.id == enrollment_counts.c.course_id)
    .where(enrollment_counts.c.n > 100)
)
popular = result.scalars().all()

# ── EXISTS: users who have NOT enrolled in any course ──────────────
not_enrolled = (
    select(User)
    .where(
        ~exists(
            select(Enrollment.id)
            .where(Enrollment.user_id == User.id)
        )
    )
)
result = await db.execute(not_enrolled)
inactive_users = result.scalars().all()
\`\`\``,

    `## Full reference: bulk operations for performance

\`\`\`python
from sqlalchemy import insert, update, delete

# ── Bulk insert (much faster than creating N objects one by one) ───
await db.execute(
    insert(Course),
    [
        {"title": "Python Basics", "slug": "python-basics",  "price": 0},
        {"title": "Django Pro",    "slug": "django-pro",     "price": 49},
        {"title": "FastAPI",       "slug": "fastapi",        "price": 39},
    ]
)
# One INSERT statement with 3 rows — not 3 separate INSERTs

# ── Bulk update by condition ───────────────────────────────────────
await db.execute(
    update(Course)
    .where(Course.price > 0, Course.level == "beginner")
    .values(price=0)
)
# One UPDATE ... WHERE statement

# ── Bulk delete ────────────────────────────────────────────────────
await db.execute(
    delete(Course)
    .where(Course.is_published == False, Course.created_at < cutoff)
)
await db.commit()
\`\`\``,

    `## Real scenario: dashboard stats in one round trip

\`\`\`python
@router.get("/stats")
async def get_stats(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(
            func.count(Course.id).label("total"),
            func.count(case((Course.is_published == True, 1))).label("published"),
            func.avg(Course.price).label("avg_price"),
            func.count(case((Course.level == "beginner", 1))).label("beginner_count"),
        )
    )
    row = result.one()
    return {
        "total":          row.total,
        "published":      row.published,
        "avg_price":      round(float(row.avg_price or 0), 2),
        "beginner_count": row.beginner_count,
    }
# Output: {"total": 58, "published": 44, "avg_price": 31.5, "beginner_count": 20}
# One SQL query — not four separate counts
\`\`\``,

    `## Junior mistakes + fix

| Mistake | What happens | Fix |
|---|---|---|
| Call \`func.count()\` without \`.label()\` | Can't access result by name | Always add \`.label("name")\` |
| Python loop + individual inserts | 100 inserts = 100 round trips | Use bulk \`insert(Model), [list]\` |
| Python filter after loading all rows | Loads entire table into memory | Put \`where()\` in the query |
| Forget \`await db.commit()\` after bulk update/delete | Changes are never saved | Always commit after mutating |
| No connection pool settings | Pool exhausted under load | Set \`pool_size\` and \`max_overflow\` |`,
  ],

  // ─── Lesson 4: Redis ─────────────────────────────────────────────────────
  'pb-db-redis': [
    `## Beginner TL;DR — Redis

Redis (pronounced REH-dis) is an in-memory data store. It's dramatically faster than PostgreSQL for:
- Caching query results
- Session storage
- Rate limiting counters
- Token blacklists
- Pub/Sub messaging

**Key insight:** Redis stores data in RAM. Writes and reads take microseconds. PostgreSQL takes milliseconds.`,

    `## Terminology

| Term | Meaning |
|---|---|
| TTL | Time To Live — seconds until key is auto-deleted |
| Key | String name for a stored value (e.g. \`user:42:profile\`) |
| Expiry | Alias for TTL |
| Cache miss | Redis doesn't have the data → fetch from DB |
| Cache hit | Redis has the data → return immediately |
| Eviction | Redis removing old keys when memory is full |
| Pipeline | Batch multiple commands into one round trip |
| Pub/Sub | Publish/Subscribe pattern for real-time messaging |`,

    `## Full reference: redis-py async commands with outputs

\`\`\`python
import redis.asyncio as redis

client = redis.from_url("redis://localhost:6379", decode_responses=True)

# ── String (most common type) ────────────────────────────────────────
await client.set("greeting", "hello")
val = await client.get("greeting")
print(val)   # → "hello"

# Set with TTL (expires after 300 seconds)
await client.setex("session:abc123", 300, "user:42")
val = await client.get("session:abc123")   # → "user:42"
ttl = await client.ttl("session:abc123")   # → 298 (remaining seconds)

# ── Check and delete ────────────────────────────────────────────────
exists = await client.exists("greeting")    # → 1 (truthy) or 0
await client.delete("greeting")             # → 1 if deleted, 0 if not found

# ── Increment (atomic counter for rate limiting) ─────────────────────
await client.set("rate:ip:192.168.1.1", 0)
count = await client.incr("rate:ip:192.168.1.1")  # → 1
count = await client.incr("rate:ip:192.168.1.1")  # → 2
await client.expire("rate:ip:192.168.1.1", 60)    # reset counter in 60s

# ── Hash (structured object) ────────────────────────────────────────
await client.hset("user:42", mapping={"name": "Alice", "plan": "pro"})
name = await client.hget("user:42", "name")           # → "Alice"
user = await client.hgetall("user:42")                 # → {"name": "Alice", "plan": "pro"}
await client.hset("user:42", "plan", "free")           # update one field

# ── List (queue / event log) ────────────────────────────────────────
await client.lpush("events", "login", "signup")     # push to left
await client.rpush("queue", "task1", "task2")       # push to right
last = await client.lpop("queue")                    # → "task1"
length = await client.llen("events")                 # → 2

# ── Set (unique members, e.g. blacklist) ────────────────────────────
await client.sadd("blacklist:tokens", "tok1", "tok2")
is_banned = await client.sismember("blacklist:tokens", "tok1")  # → True
await client.srem("blacklist:tokens", "tok1")

# ── Sorted set (leaderboard / priority queue) ───────────────────────
await client.zadd("leaderboard", {"alice": 350, "bob": 280, "carol": 410})
top = await client.zrevrange("leaderboard", 0, 2, withscores=True)
# → [("carol", 410.0), ("alice", 350.0), ("bob", 280.0)]
\`\`\``,

    `## Full reference: cache-aside pattern (most common caching pattern)

\`\`\`python
import json
from fastapi import Depends
from app.redis import get_redis

@router.get("/courses/{course_id}")
async def get_course(course_id: int, db=Depends(get_db), redis=Depends(get_redis)):
    cache_key = f"course:{course_id}"

    # 1. Check cache first
    cached = await redis.get(cache_key)
    if cached:
        return json.loads(cached)   # → cache HIT, no DB query

    # 2. Cache miss — query DB
    result = await db.execute(
        select(Course).where(Course.id == course_id)
        .options(selectinload(Course.author))
    )
    course = result.scalar_one_or_none()
    if not course:
        raise HTTPException(status_code=404, detail="Not found")

    # 3. Store in cache with 10-minute TTL
    data = CourseResponse.model_validate(course).model_dump()
    await redis.setex(cache_key, 600, json.dumps(data, default=str))

    return data

# Invalidate cache when course is updated:
async def update_course(course_id: int, ...):
    ...
    await redis.delete(f"course:{course_id}")   # force fresh data on next read
\`\`\``,

    `## Full reference: rate limiting with Redis

\`\`\`python
from fastapi import Request, HTTPException

async def rate_limit(request: Request, redis=Depends(get_redis)):
    ip = request.client.host
    key = f"ratelimit:{ip}"

    pipe = redis.pipeline()          # batch commands into one round trip
    pipe.incr(key)
    pipe.expire(key, 60)             # window: 60 seconds
    count, _ = await pipe.execute()

    if count > 100:                  # 100 requests per minute per IP
        raise HTTPException(status_code=429, detail="Too many requests")

# Apply as a dependency:
@router.post("/auth/token", dependencies=[Depends(rate_limit)])
async def login(...): ...
\`\`\``,

    `## Junior mistakes + fix

| Mistake | What happens | Fix |
|---|---|---|
| No TTL on cached keys | Memory fills up over time | Always set \`setex\` (has TTL) not \`set\` |
| Cache stale data after update | Users see old data | Delete cache key in update/delete handlers |
| Store large objects (full DB dumps) | Memory exhausted | Store only lightweight serialised data |
| No \`decode_responses=True\` | All values are \`bytes\` not \`str\` | Add \`decode_responses=True\` to client init |
| Share Redis client across sync/async code | Runtime errors | Always use \`redis.asyncio\` for async FastAPI |`,
  ],

  // ─── Lesson 5: PostgreSQL Advanced ──────────────────────────────────────
  'pb-db-postgres-advanced': [
    `## Beginner TL;DR — PostgreSQL Advanced

PostgreSQL is not just a data store — it's a powerful engine with built-in text search, JSONB documents, advanced indexes, and query analysis tools.

This lesson covers the features that separate senior engineers from juniors.`,

    `## Full reference: index types and when to use them

\`\`\`sql
-- B-Tree (default) — works for =, <, >, BETWEEN, ORDER BY
CREATE INDEX ix_courses_price ON courses(price);
-- Good for: filtering, sorting, range queries

-- Partial index — index only a subset of rows
CREATE INDEX ix_published_courses ON courses(created_at DESC)
WHERE is_published = true;
-- Good for: queries that always filter the same condition (reduces index size by 90%)

-- Composite index — for queries filtering on multiple columns
CREATE INDEX ix_courses_cat_level ON courses(category_id, level);
-- Good for: WHERE category_id = X AND level = Y
-- Order matters: most selective column first

-- GIN — for full-text search and JSONB
CREATE INDEX ix_courses_fts ON courses USING gin(to_tsvector('english', title || ' ' || body));
CREATE INDEX ix_meta ON products USING gin(metadata);   -- for metadata @> '{...}'

-- GiST — for geometric data, IP ranges, fuzzy text
-- BRIN — for naturally-ordered large tables (time-series, logs)

-- Check existing indexes:
SELECT indexname, indexdef FROM pg_indexes WHERE tablename = 'courses';

-- Check if index is being used (run AFTER EXPLAIN ANALYZE):
-- Look for "Index Scan using ix_courses_price" in output
\`\`\``,

    `## Full reference: full-text search

\`\`\`sql
-- tsvector = tokenised searchable document
-- tsquery  = search query

-- Basic search: find courses matching "python async"
SELECT title, ts_rank(to_tsvector('english', title || ' ' || body),
                      to_tsquery('english', 'python & async')) AS rank
FROM courses
WHERE to_tsvector('english', title || ' ' || body) @@ to_tsquery('english', 'python & async')
ORDER BY rank DESC;

-- Prefix search: "pytho:*" matches "python", "pythonic", etc.
WHERE search_vector @@ to_tsquery('english', 'pytho:*')

-- ── Store as column for performance ──────────────────────────────────
ALTER TABLE courses ADD COLUMN search_vector tsvector;

-- Update trigger (auto-rebuild on INSERT/UPDATE)
CREATE FUNCTION courses_search_update() RETURNS trigger AS \$\$
BEGIN
  NEW.search_vector := to_tsvector('english', NEW.title || ' ' || coalesce(NEW.body, ''));
  RETURN NEW;
END \$\$ LANGUAGE plpgsql;

CREATE TRIGGER update_search
BEFORE INSERT OR UPDATE ON courses
FOR EACH ROW EXECUTE FUNCTION courses_search_update();

-- With GIN index (near-instant text search):
CREATE INDEX ix_courses_search ON courses USING gin(search_vector);

-- Final query:
SELECT * FROM courses WHERE search_vector @@ to_tsquery('english', 'django & orm');
\`\`\``,

    `## Full reference: JSONB columns

\`\`\`sql
-- Store dynamic structured data in a column
ALTER TABLE courses ADD COLUMN metadata jsonb DEFAULT '{}';

-- Insert with JSONB
INSERT INTO courses (title, metadata)
VALUES ('Python', '{"tags": ["python", "backend"], "difficulty": 3}');

-- Query inside JSONB
SELECT * FROM courses WHERE metadata->>'difficulty' = '3';  -- text comparison
SELECT * FROM courses WHERE (metadata->>'difficulty')::int > 2;  -- cast to int

-- Containment operator (@>)
SELECT * FROM courses WHERE metadata @> '{"tags": ["python"]}';

-- Array membership
SELECT * FROM courses WHERE metadata->'tags' ? 'python';

-- GIN index for JSONB (makes @> fast)
CREATE INDEX ix_courses_meta ON courses USING gin(metadata);

-- Update a JSONB field
UPDATE courses
SET metadata = jsonb_set(metadata, '{difficulty}', '4')
WHERE id = 1;
\`\`\``,

    `## Full reference: EXPLAIN ANALYZE — query performance debugging

\`\`\`sql
-- EXPLAIN shows the query plan (what Postgres will do)
-- ANALYZE actually runs it and shows real timings

EXPLAIN ANALYZE
SELECT * FROM courses WHERE level = 'beginner' ORDER BY created_at DESC LIMIT 10;

-- Example output — read from bottom to top:
-- Limit  (cost=0.00..2.35 rows=10) (actual time=0.3ms rows=10)
--   ->  Index Scan using ix_courses_level on courses
--         Index Cond: ((level)::text = 'beginner'::text)
--         Filter: (is_published = true)
--         Rows Removed by Filter: 4
-- Planning Time: 0.2ms
-- Execution Time: 0.5ms

-- Red flags:
-- "Seq Scan" on a large table → missing index
-- "Hash Join" with large Hash Batches → add index or narrow query
-- Execution Time >100ms → needs optimisation
-- "Rows Removed by Filter" >> actual rows → index on wrong column
\`\`\``,

    `## Real scenario: course search endpoint with FTS + filters

\`\`\`python
from sqlalchemy import text

@router.get("/search")
async def search_courses(
    q: str,
    level: str | None = None,
    db: AsyncSession = Depends(get_db),
):
    # Using raw SQL for full-text search with ranking
    query = text("""
        SELECT id, title, level,
               ts_rank(search_vector, to_tsquery('english', :query)) AS rank
        FROM courses
        WHERE search_vector @@ to_tsquery('english', :query)
          AND (:level IS NULL OR level = :level)
          AND is_published = true
        ORDER BY rank DESC
        LIMIT 20
    """)
    result = await db.execute(query, {"query": q, "level": level})
    return result.mappings().all()
\`\`\`

Searches 100,000 courses in < 10ms with the GIN index.`,

    `## Junior mistakes + fix

| Mistake | What happens | Fix |
|---|---|---|
| No index on frequently filtered column | Full table scan — slow on large tables | Add \`CREATE INDEX\` for all \`WHERE\` column |
| LIKE '%python%' with leading wildcard | Cannot use B-tree index | Use full-text search (\`@@\`) with GIN index |
| JSONB without GIN index | Containment queries are slow | Add \`CREATE INDEX ... USING gin(column)\` |
| Never run EXPLAIN ANALYZE | Cannot know why queries are slow | Profile every slow query with EXPLAIN ANALYZE |
| SELECT * in production queries | Transfers unused columns → network overhead | Always select only the columns you need |`,
  ],
}

function toBlocks(markdowns: string[]): ContentBlock[] {
  return markdowns.map(markdown => ({ type: 'text' as const, markdown }))
}

export function applyPhase6DatabaseEnhancements(lessons: Lesson[]): Lesson[] {
  return lessons.map(lesson => {
    const markdowns = phase6Blocks[lesson.id]
    if (!markdowns) return lesson
    return {
      ...lesson,
      content: [...toBlocks(markdowns), ...lesson.content],
    }
  })
}
