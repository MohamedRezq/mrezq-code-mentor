import type { Lesson } from '@/types/lesson'

export const databaseLessons: Lesson[] = [
  // ─────────────────────────────────────────────────────────────
  // LESSON 7: SQLAlchemy 2.0 Async ORM
  // ─────────────────────────────────────────────────────────────
  {
    id: 'pb-db-sqlalchemy',
    moduleId: 'python-backend',
    phaseId: 'pb-databases',
    phaseNumber: 2,
    order: 7,
    title: 'SQLAlchemy 2.0: Async ORM with FastAPI',
    description: 'Define database models with SQLAlchemy 2.0, connect to PostgreSQL asynchronously, and integrate the session into FastAPI via dependency injection.',
    duration: '28 min',
    difficulty: 'intermediate',
    objectives: [
      'Define SQLAlchemy 2.0 models using the DeclarativeBase pattern',
      'Create an async database engine and session factory',
      'Inject database sessions into FastAPI routes with Depends',
      'Perform basic CRUD operations with async sessions',
    ],
    content: [
      {
        type: 'text',
        markdown: `## SQLAlchemy 2.0: What Changed

SQLAlchemy 2.0 (released 2023) introduced a new API that is cleaner and fully type-safe. The old patterns (Session.query(), session.execute(query)) still work but are legacy. Here is what changed:

| Old (1.x) | New (2.0) |
|-----------|-----------|
| \`session.query(User).filter(...)\` | \`select(User).where(...)\` |
| \`session.add(obj); session.commit()\` | Same, but async versions exist |
| \`Base = declarative_base()\` | \`class Base(DeclarativeBase): pass\` |
| \`Column(Integer)\` | \`Mapped[int]\` with \`mapped_column()\` |

Use the 2.0 style — it's what you'll see in new projects.`,
      },
      {
        type: 'code',
        language: 'bash',
        filename: 'terminal',
        code: `uv add sqlalchemy asyncpg greenlet psycopg2-binary

# sqlalchemy     → ORM and query builder
# asyncpg        → async PostgreSQL driver
# greenlet       → needed by SQLAlchemy async
# psycopg2-binary → sync driver (for Alembic migrations)`,
      },
      {
        type: 'code',
        language: 'python',
        filename: 'db/base.py',
        code: `from sqlalchemy.orm import DeclarativeBase, MappedColumn
from sqlalchemy import func
from sqlalchemy.orm import mapped_column
from datetime import datetime


class Base(DeclarativeBase):
    """Base class for all database models.
    
    All models inherit from this — they get a shared metadata registry
    which Alembic uses to generate migrations.
    """
    pass`,
      },
      {
        type: 'code',
        language: 'python',
        filename: 'models/user.py',
        code: `from sqlalchemy import String, Boolean, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
from app.db.base import Base


class User(Base):
    __tablename__ = "users"

    # Mapped[type] = column type declaration (2.0 style, fully typed)
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[str] = mapped_column(String(50), default="member")
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    # server_default uses the DB's NOW() — persisted even if inserted via raw SQL
    created_at: Mapped[datetime] = mapped_column(server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(server_default=func.now(), onupdate=func.now())

    # Relationship — defines the ORM association (not a real column)
    posts: Mapped[list["Post"]] = relationship("Post", back_populates="author")

    def __repr__(self) -> str:
        return f"<User id={self.id} email={self.email!r}>"`,
        explanation: 'Use index=True on columns you frequently filter by (email, foreign keys). Without indexes, PostgreSQL does a full table scan for every lookup.',
      },
      {
        type: 'code',
        language: 'python',
        filename: 'db/session.py',
        code: `from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from app.config import settings

# The connection URL uses the async driver (asyncpg)
# postgresql+asyncpg://user:password@host:port/database
engine = create_async_engine(
    settings.DATABASE_URL,
    pool_size=10,        # number of connections to maintain in the pool
    max_overflow=20,     # extra connections allowed beyond pool_size
    pool_pre_ping=True,  # test connections before using (handles DB restarts)
    echo=False,          # set to True to log all SQL (useful for debugging)
)

# Session factory — create a new session with AsyncSessionLocal()
AsyncSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,  # don't expire objects after commit (important for async)
)`,
        explanation: 'expire_on_commit=False is critical for async SQLAlchemy. The default would expire all attributes after commit, requiring a reload — which triggers implicit lazy loads that fail in async context.',
      },
      {
        type: 'code',
        language: 'python',
        filename: 'dependencies.py (database)',
        code: `from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import Depends
from app.db.session import AsyncSessionLocal
from typing import AsyncGenerator


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """FastAPI dependency: provides a database session per request.
    
    The session is automatically committed on success and
    rolled back on exceptions.
    """
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise`,
      },
      {
        type: 'code',
        language: 'python',
        filename: 'routers/users.py (with DB)',
        code: `from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.dependencies import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserResponse
from app.core.security import hash_password

router = APIRouter(prefix="/users", tags=["users"])


@router.post("/", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def create_user(body: UserCreate, db: AsyncSession = Depends(get_db)):
    # Check duplicate email
    result = await db.execute(select(User).where(User.email == body.email))
    if result.scalar_one_or_none():
        raise HTTPException(status_code=409, detail="Email already registered")

    user = User(
        name=body.name,
        email=body.email,
        password_hash=hash_password(body.password),
    )
    db.add(user)
    await db.flush()   # assign the ID without committing
    await db.refresh(user)  # reload from DB (gets server defaults like created_at)
    return user


@router.get("/{user_id}", response_model=UserResponse)
async def get_user(user_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.get("/", response_model=list[UserResponse])
async def list_users(
    skip: int = 0,
    limit: int = 20,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(User)
        .where(User.is_active == True)
        .order_by(User.created_at.desc())
        .offset(skip)
        .limit(limit)
    )
    return result.scalars().all()`,
        explanation: 'Use scalar_one_or_none() for single row lookups (returns the object or None). Use scalars().all() for multiple rows.',
      },
      {
        type: 'callout',
        tone: 'production',
        title: 'Connection Pooling in Production',
        content: 'With 4 Uvicorn workers and pool_size=10, you have up to 40 connections to PostgreSQL. Set pool_size based on: (expected concurrent requests per worker) × workers. PostgreSQL default max_connections is 100 — monitor pg_stat_activity to track actual connections.',
      },
      {
        type: 'exercise',
        title: 'Post Model & CRUD',
        description: 'Create a Post model with: id, title (string), content (text), published (bool, default False), author_id (FK to users.id), created_at. Then create a router with: POST /posts (create a post for the current user using auth), GET /posts (list published posts), GET /posts/{id} (get one post). The POST endpoint should set author_id from the JWT token.',
        language: 'python',
        starterCode: `from sqlalchemy import String, Text, Boolean, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
from app.db.base import Base

# TODO: Define Post model

# In routers/posts.py:
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.dependencies import get_db, get_current_user
from app.models.post import Post

router = APIRouter(prefix="/posts", tags=["posts"])

# TODO: POST /posts - create post for current user
# TODO: GET /posts - list published posts
# TODO: GET /posts/{id} - get one post`,
        solution: `# models/post.py
from sqlalchemy import String, Text, Boolean, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
from app.db.base import Base

class Post(Base):
    __tablename__ = "posts"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(300), nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    published: Mapped[bool] = mapped_column(Boolean, default=False)
    author_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)
    created_at: Mapped[datetime] = mapped_column(server_default=func.now())

    author: Mapped["User"] = relationship("User", back_populates="posts")


# routers/posts.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
from app.dependencies import get_db, get_current_user
from app.models.post import Post

router = APIRouter(prefix="/posts", tags=["posts"])

class PostCreate(BaseModel):
    title: str
    content: str
    published: bool = False

class PostResponse(BaseModel):
    id: int
    title: str
    content: str
    published: bool
    author_id: int
    model_config = {"from_attributes": True}


@router.post("/", response_model=PostResponse, status_code=status.HTTP_201_CREATED)
async def create_post(body: PostCreate, db: AsyncSession = Depends(get_db), current_user: dict = Depends(get_current_user)):
    post = Post(**body.model_dump(), author_id=current_user["user_id"])
    db.add(post)
    await db.flush()
    await db.refresh(post)
    return post


@router.get("/", response_model=list[PostResponse])
async def list_posts(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Post).where(Post.published == True).order_by(Post.created_at.desc()))
    return result.scalars().all()


@router.get("/{id}", response_model=PostResponse)
async def get_post(id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Post).where(Post.id == id))
    post = result.scalar_one_or_none()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post`,
        hints: [
          'ForeignKey("users.id") references the users table — the string must match tablename.column',
          'Use current_user["user_id"] to get the user ID from the JWT',
          'await db.flush() assigns the ID before commit; await db.refresh(post) reloads server defaults',
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // LESSON 8: Alembic Migrations
  // ─────────────────────────────────────────────────────────────
  {
    id: 'pb-db-alembic',
    moduleId: 'python-backend',
    phaseId: 'pb-databases',
    phaseNumber: 2,
    order: 8,
    title: 'Database Migrations with Alembic',
    description: 'Version-control your database schema with Alembic — generate migrations automatically, apply and roll back changes, and handle production schema evolution safely.',
    duration: '22 min',
    difficulty: 'intermediate',
    objectives: [
      'Initialize Alembic and configure it with your SQLAlchemy models',
      'Generate migrations automatically from model changes',
      'Apply migrations with upgrade and roll back with downgrade',
      'Handle common migration patterns: adding columns, indexes, constraints',
    ],
    content: [
      {
        type: 'text',
        markdown: `## What Alembic Does

Without migrations, every schema change requires manually running ALTER TABLE SQL statements across all environments. Alembic solves this by tracking what schema version each database is at and applying changes in order.

\`\`\`
Database has: revision abc123 (users table)
Code needs:   revision def456 (add posts table)
Command:      alembic upgrade head → runs the diff
\`\`\`

Alembic stores the current revision in a table called \`alembic_version\` in your database.`,
      },
      {
        type: 'code',
        language: 'bash',
        filename: 'terminal',
        code: `uv add alembic

# Initialize Alembic in your project
alembic init alembic

# Your project now has:
# alembic/
# ├── env.py          ← configure connection and models here
# ├── script.py.mako  ← template for migration files
# └── versions/       ← individual migration files
# alembic.ini         ← main config file`,
      },
      {
        type: 'code',
        language: 'python',
        filename: 'alembic/env.py',
        code: `import asyncio
from logging.config import fileConfig
from sqlalchemy.ext.asyncio import create_async_engine
from alembic import context

# Import ALL your models so Alembic can detect them
# The import itself registers them in Base.metadata
from app.db.base import Base
from app.models.user import User    # noqa: F401
from app.models.post import Post    # noqa: F401
from app.config import settings

config = context.config
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Tell Alembic what schema to compare against
target_metadata = Base.metadata


def run_migrations_online() -> None:
    """Run migrations against a live database."""
    connectable = create_async_engine(settings.DATABASE_URL)

    async def run():
        async with connectable.connect() as connection:
            await connection.run_sync(do_run_migrations)

    asyncio.run(run())


def do_run_migrations(connection):
    context.configure(connection=connection, target_metadata=target_metadata)
    with context.begin_transaction():
        context.run_migrations()


run_migrations_online()`,
        explanation: 'Import every model here — even if you do not use them directly. The imports register the models in Base.metadata, which is what Alembic inspects for autogenerate.',
      },
      {
        type: 'code',
        language: 'ini',
        filename: 'alembic.ini (key line)',
        code: `# Change the sqlalchemy.url to use your sync driver for Alembic
# (Alembic works better with sync connections for migrations)
sqlalchemy.url = postgresql://user:password@localhost/mydb

# In modern setups, override this in env.py with your async URL
# and use connection.run_sync() — as shown in env.py above`,
      },
      {
        type: 'code',
        language: 'bash',
        filename: 'Migration workflow',
        code: `# 1. After changing a model, generate a migration:
alembic revision --autogenerate -m "add posts table"
# Creates: alembic/versions/20250103_abc123_add_posts_table.py

# 2. Review the generated file (always review before applying!)
cat alembic/versions/20250103_abc123_add_posts_table.py

# 3. Apply the migration to the database:
alembic upgrade head

# 4. Check current revision:
alembic current

# 5. View migration history:
alembic history --verbose

# 6. Roll back one step (if something went wrong):
alembic downgrade -1

# 7. Roll back to a specific revision:
alembic downgrade abc123`,
      },
      {
        type: 'code',
        language: 'python',
        filename: 'alembic/versions/20250103_abc123_add_posts.py',
        code: `"""add posts table

Revision ID: abc123
Revises: def456
Create Date: 2025-01-03 10:00:00
"""
from alembic import op
import sqlalchemy as sa

# Alembic generates this for you — but always review it
revision = "abc123"
down_revision = "def456"     # what revision this builds on
branch_labels = None
depends_on = None


def upgrade() -> None:
    """Apply this migration (forward)."""
    op.create_table(
        "posts",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("title", sa.String(length=300), nullable=False),
        sa.Column("content", sa.Text(), nullable=False),
        sa.Column("published", sa.Boolean(), nullable=True, server_default="false"),
        sa.Column("author_id", sa.Integer(), nullable=False),
        sa.Column("created_at", sa.DateTime(), server_default=sa.func.now(), nullable=True),
        sa.ForeignKeyConstraint(["author_id"], ["users.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_posts_author_id", "posts", ["author_id"])
    op.create_index("ix_posts_published", "posts", ["published"])


def downgrade() -> None:
    """Roll back this migration."""
    op.drop_index("ix_posts_published", table_name="posts")
    op.drop_index("ix_posts_author_id", table_name="posts")
    op.drop_table("posts")`,
      },
      {
        type: 'callout',
        tone: 'warning',
        title: 'Always Review Autogenerated Migrations',
        content: `Alembic autogenerate misses some things:
- Changing a column type (it generates drop + add, losing data)
- Check constraints (not always detected)
- Custom indexes with partial conditions
- Renaming a column (detected as drop + add — use op.alter_column() instead)

Always read the migration file before running upgrade.`,
      },
      {
        type: 'text',
        markdown: `## Common Migration Patterns

Adding a column safely (with a default, no downtime):`,
      },
      {
        type: 'code',
        language: 'python',
        filename: 'safe column addition',
        code: `def upgrade() -> None:
    # Adding a nullable column with server default = zero downtime
    op.add_column(
        "users",
        sa.Column("bio", sa.Text(), nullable=True),
    )
    # Adding a NOT NULL column requires a default (or backfill first)
    op.add_column(
        "users",
        sa.Column(
            "plan",
            sa.String(50),
            nullable=False,
            server_default="free",    # ← required if table has existing rows
        ),
    )
    # Create an index concurrently (no table lock in PostgreSQL)
    op.create_index("ix_users_plan", "users", ["plan"], postgresql_concurrently=True)


def downgrade() -> None:
    op.drop_index("ix_users_plan", table_name="users")
    op.drop_column("users", "plan")
    op.drop_column("users", "bio")`,
        explanation: 'postgresql_concurrently=True creates the index without locking the table — safe to run on a live production database.',
      },
      {
        type: 'exercise',
        title: 'Write a Migration for Comments',
        description: 'Create a Comment model (id, content, post_id FK, author_id FK, created_at). Then generate the migration using alembic revision --autogenerate. Review the generated file. Manually write the upgrade() and downgrade() functions for this model as practice (as if you had to write it from scratch). Include an index on post_id.',
        language: 'python',
        starterCode: `# models/comment.py
from sqlalchemy import Text, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column
from datetime import datetime
from app.db.base import Base

# TODO: Define Comment model

# alembic/versions/xxxx_add_comments.py
from alembic import op
import sqlalchemy as sa

revision = "xxxx"
down_revision = "abc123"

# TODO: Write upgrade() to create comments table with index on post_id
# TODO: Write downgrade() to drop the table`,
        solution: `# models/comment.py
from sqlalchemy import Text, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
from app.db.base import Base

class Comment(Base):
    __tablename__ = "comments"

    id: Mapped[int] = mapped_column(primary_key=True)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    post_id: Mapped[int] = mapped_column(ForeignKey("posts.id", ondelete="CASCADE"), index=True)
    author_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"))
    created_at: Mapped[datetime] = mapped_column(server_default=func.now())


# alembic/versions/xxxx_add_comments.py
from alembic import op
import sqlalchemy as sa

revision = "xxxx"
down_revision = "abc123"

def upgrade() -> None:
    op.create_table(
        "comments",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("content", sa.Text(), nullable=False),
        sa.Column("post_id", sa.Integer(), nullable=False),
        sa.Column("author_id", sa.Integer(), nullable=False),
        sa.Column("created_at", sa.DateTime(), server_default=sa.func.now()),
        sa.ForeignKeyConstraint(["post_id"], ["posts.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["author_id"], ["users.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_comments_post_id", "comments", ["post_id"])

def downgrade() -> None:
    op.drop_index("ix_comments_post_id", table_name="comments")
    op.drop_table("comments")`,
        hints: [
          'ondelete="CASCADE" means deleting a post also deletes its comments',
          'The down_revision links migrations into a chain — do not break this chain',
          'Always write downgrade() even if you think you will never use it',
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // LESSON 9: Advanced Queries & Relationships
  // ─────────────────────────────────────────────────────────────
  {
    id: 'pb-db-queries',
    moduleId: 'python-backend',
    phaseId: 'pb-databases',
    phaseNumber: 2,
    order: 9,
    title: 'Advanced Queries, Joins & Relationships',
    description: 'Write efficient SQLAlchemy queries with joins, eager loading, aggregations, and pagination — the patterns you use every day in production backends.',
    duration: '25 min',
    difficulty: 'intermediate',
    objectives: [
      'Write joins with selectinload and joinedload for efficient loading',
      'Build filtered, sorted, and paginated list endpoints',
      'Use aggregation functions (count, sum, avg, group_by)',
      'Understand N+1 queries and how to avoid them',
    ],
    content: [
      {
        type: 'text',
        markdown: `## The N+1 Problem

This is the most common database performance issue in ORM-based apps. Here is what it looks like:

\`\`\`python
# WRONG: 1 query to get posts + 1 query per post to get author = N+1 queries
posts = session.execute(select(Post)).scalars().all()
for post in posts:
    print(post.author.name)   # ← triggers a new SQL query each iteration!
\`\`\`

With 100 posts, this sends 101 queries to the database. The fix is eager loading.`,
      },
      {
        type: 'code',
        language: 'python',
        filename: 'routers/posts.py (eager loading)',
        code: `from sqlalchemy import select, func, desc
from sqlalchemy.orm import selectinload, joinedload

# ── selectinload: makes 2 queries (get posts, then get all authors at once) ──
# Best for: one-to-many relationships, or when you need the related collection

@router.get("/with-authors")
async def list_posts_with_authors(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Post)
        .options(selectinload(Post.author))   # load author in a 2nd query
        .where(Post.published == True)
        .order_by(Post.created_at.desc())
        .limit(20)
    )
    posts = result.scalars().all()
    # Now post.author.name works without extra queries
    return [
        {
            "id": p.id,
            "title": p.title,
            "author_name": p.author.name,
        }
        for p in posts
    ]


# ── joinedload: makes 1 query with a JOIN ──
# Best for: many-to-one (e.g., post → author), when you always need the relation

@router.get("/{id}/full")
async def get_post_full(id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Post)
        .options(
            joinedload(Post.author),
            selectinload(Post.comments).selectinload(Comment.author),  # nested
        )
        .where(Post.id == id)
    )
    post = result.unique().scalar_one_or_none()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post`,
        explanation: 'Use selectinload for collections (one-to-many). Use joinedload for single related objects (many-to-one). Never use lazy loading in async code — it raises MissingGreenlet errors.',
      },
      {
        type: 'code',
        language: 'python',
        filename: 'services/post_service.py (pagination)',
        code: `from sqlalchemy import select, func, or_
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.post import Post


async def list_posts(
    db: AsyncSession,
    *,
    page: int = 1,
    page_size: int = 20,
    category: str | None = None,
    search: str | None = None,
    author_id: int | None = None,
    order_by: str = "created_at",
    order_dir: str = "desc",
) -> dict:
    """Paginated, filtered post listing — the pattern you'll write for every list endpoint."""

    # Build the base query
    query = select(Post).where(Post.published == True)

    # Apply filters dynamically
    if category:
        query = query.where(Post.category == category)
    if author_id:
        query = query.where(Post.author_id == author_id)
    if search:
        search_term = f"%{search}%"
        query = query.where(
            or_(
                Post.title.ilike(search_term),    # case-insensitive LIKE
                Post.content.ilike(search_term),
            )
        )

    # Count total (for pagination metadata)
    count_query = select(func.count()).select_from(query.subquery())
    total = (await db.execute(count_query)).scalar_one()

    # Apply sorting
    order_col = getattr(Post, order_by, Post.created_at)
    if order_dir == "desc":
        query = query.order_by(order_col.desc())
    else:
        query = query.order_by(order_col.asc())

    # Apply pagination
    query = query.offset((page - 1) * page_size).limit(page_size)

    result = await db.execute(query)
    posts = result.scalars().all()

    return {
        "data": posts,
        "pagination": {
            "page": page,
            "page_size": page_size,
            "total": total,
            "pages": (total + page_size - 1) // page_size,
        },
    }`,
        explanation: 'Always return total count alongside paginated results. Without it, the client cannot know how many pages exist or show a progress indicator.',
      },
      {
        type: 'code',
        language: 'python',
        filename: 'aggregation examples',
        code: `from sqlalchemy import select, func, case

# ── Count posts per author ──
result = await db.execute(
    select(User.id, User.name, func.count(Post.id).label("post_count"))
    .join(Post, Post.author_id == User.id, isouter=True)   # LEFT JOIN
    .group_by(User.id, User.name)
    .order_by(func.count(Post.id).desc())
)
authors_with_counts = result.all()  # list of Row objects: (id, name, post_count)


# ── Statistics in one query ──
result = await db.execute(
    select(
        func.count(Post.id).label("total"),
        func.count(Post.id).filter(Post.published == True).label("published"),
        func.count(Post.id).filter(Post.published == False).label("drafts"),
        func.avg(func.length(Post.content)).label("avg_content_length"),
    )
    .where(Post.author_id == current_user_id)
)
stats = result.one()  # single row
print(f"Total: {stats.total}, Published: {stats.published}")


# ── Conditional counts (case expression) ──
result = await db.execute(
    select(
        Post.category,
        func.count().label("count"),
        func.sum(case((Post.published == True, 1), else_=0)).label("published_count"),
    )
    .group_by(Post.category)
)`,
      },
      {
        type: 'callout',
        tone: 'tip',
        title: 'When to Use Raw SQL',
        content: 'SQLAlchemy handles 95% of queries well. For complex analytics (window functions, CTEs, LATERAL joins), use text() to write raw SQL. This is better than fighting the ORM: `result = await db.execute(text("SELECT ... OVER (PARTITION BY ...)"))`. The ORM is for CRUD; raw SQL is for analytics.',
      },
      {
        type: 'exercise',
        title: 'Author Stats Endpoint',
        description: 'Build GET /authors/{id}/stats that returns: total_posts, published_posts, draft_posts, total_comments (count of comments across all their posts), most_recent_post_title. Use a single query with JOINs and aggregations — no multiple roundtrips.',
        language: 'python',
        starterCode: `from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.dependencies import get_db
from app.models.user import User
from app.models.post import Post
from app.models.comment import Comment

router = APIRouter(prefix="/authors", tags=["authors"])

@router.get("/{id}/stats")
async def get_author_stats(id: int, db: AsyncSession = Depends(get_db)):
    # TODO: verify user exists
    # TODO: single query to get all stats
    pass`,
        solution: `from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, case
from app.dependencies import get_db
from app.models.user import User
from app.models.post import Post
from app.models.comment import Comment

router = APIRouter(prefix="/authors", tags=["authors"])

@router.get("/{id}/stats")
async def get_author_stats(id: int, db: AsyncSession = Depends(get_db)):
    user = (await db.execute(select(User).where(User.id == id))).scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="Author not found")

    result = await db.execute(
        select(
            func.count(Post.id).label("total_posts"),
            func.sum(case((Post.published == True, 1), else_=0)).label("published_posts"),
            func.sum(case((Post.published == False, 1), else_=0)).label("draft_posts"),
            func.count(Comment.id).label("total_comments"),
        )
        .select_from(Post)
        .outerjoin(Comment, Comment.post_id == Post.id)
        .where(Post.author_id == id)
    )
    stats = result.one()

    latest = (await db.execute(
        select(Post.title)
        .where(Post.author_id == id, Post.published == True)
        .order_by(Post.created_at.desc())
        .limit(1)
    )).scalar_one_or_none()

    return {
        "author": {"id": user.id, "name": user.name},
        "stats": {
            "total_posts": stats.total_posts or 0,
            "published_posts": stats.published_posts or 0,
            "draft_posts": stats.draft_posts or 0,
            "total_comments": stats.total_comments or 0,
            "most_recent_post_title": latest,
        },
    }`,
        hints: [
          'Use outerjoin (LEFT JOIN) for comments so authors with 0 comments still appear',
          'case() from sqlalchemy is the SQL CASE WHEN expression for conditional counting',
          'func.sum() with case() is a common pattern for counting things that match a condition',
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // LESSON 10: Redis Caching
  // ─────────────────────────────────────────────────────────────
  {
    id: 'pb-db-redis',
    moduleId: 'python-backend',
    phaseId: 'pb-databases',
    phaseNumber: 2,
    order: 10,
    title: 'Redis: Caching, Sessions & Rate Limiting',
    description: 'Use Redis to cache expensive database queries, store user sessions, implement rate limiting, and pub/sub for real-time features.',
    duration: '22 min',
    difficulty: 'intermediate',
    objectives: [
      'Connect to Redis with redis-py async client',
      'Cache database query results with TTL and cache invalidation',
      'Store and retrieve session data',
      'Implement token blacklisting for secure logout',
    ],
    content: [
      {
        type: 'text',
        markdown: `## What Redis Is Good At

Redis is an in-memory data store — extremely fast for key-value operations (sub-millisecond). Use it when:

| Use Case | How Redis Helps |
|----------|----------------|
| Slow DB queries | Cache results for 5–60 minutes |
| User sessions | Store session data with auto-expiry |
| Rate limiting | Atomic increment counters per IP |
| JWT blacklisting | Store revoked tokens until expiry |
| Background job queues | Celery uses Redis as a broker |
| Pub/Sub | Real-time notifications |

Redis is not a replacement for PostgreSQL — it's a complement. Redis data is ephemeral by default; PostgreSQL is your source of truth.`,
      },
      {
        type: 'code',
        language: 'bash',
        filename: 'terminal',
        code: `uv add redis[hiredis]

# hiredis is a faster C-based parser for Redis responses
# Run Redis locally with Docker:
docker run -d -p 6379:6379 --name redis redis:7-alpine`,
      },
      {
        type: 'code',
        language: 'python',
        filename: 'db/redis.py',
        code: `import redis.asyncio as redis
from app.config import settings

# Create a connection pool — not a new connection per operation
redis_pool = redis.ConnectionPool.from_url(
    settings.REDIS_URL,   # redis://localhost:6379/0
    max_connections=20,
    decode_responses=True,  # automatically decode bytes to strings
)


def get_redis() -> redis.Redis:
    """Return a Redis client using the shared pool."""
    return redis.Redis(connection_pool=redis_pool)


# As a FastAPI dependency:
async def get_redis_client():
    client = get_redis()
    try:
        yield client
    finally:
        await client.aclose()`,
      },
      {
        type: 'code',
        language: 'python',
        filename: 'services/cache.py',
        code: `import json
from typing import Any, Callable, TypeVar
import redis.asyncio as redis
from functools import wraps

T = TypeVar("T")


class CacheService:
    def __init__(self, client: redis.Redis):
        self.client = client

    async def get(self, key: str) -> Any | None:
        """Get a value from cache. Returns None on miss."""
        value = await self.client.get(key)
        if value is None:
            return None
        return json.loads(value)

    async def set(self, key: str, value: Any, ttl: int = 300) -> None:
        """Store a value in cache with TTL (seconds)."""
        await self.client.setex(key, ttl, json.dumps(value, default=str))

    async def delete(self, key: str) -> None:
        """Remove a key from cache."""
        await self.client.delete(key)

    async def delete_pattern(self, pattern: str) -> int:
        """Remove all keys matching a pattern. Use sparingly in production."""
        keys = await self.client.keys(pattern)
        if keys:
            return await self.client.delete(*keys)
        return 0


# ── Usage in a route ──

@router.get("/posts/{id}")
async def get_post_cached(
    id: int,
    db: AsyncSession = Depends(get_db),
    redis_client: redis.Redis = Depends(get_redis_client),
):
    cache = CacheService(redis_client)
    cache_key = f"post:{id}"

    # 1. Check cache first
    cached = await cache.get(cache_key)
    if cached:
        return cached   # ← fast path, no DB query

    # 2. Cache miss — query DB
    result = await db.execute(select(Post).where(Post.id == id))
    post = result.scalar_one_or_none()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    # 3. Store in cache for 10 minutes
    post_dict = {"id": post.id, "title": post.title, "content": post.content}
    await cache.set(cache_key, post_dict, ttl=600)

    return post_dict`,
        explanation: 'Always use a consistent key naming convention: "resource:id" or "resource:filter:value". This makes cache invalidation predictable.',
      },
      {
        type: 'code',
        language: 'python',
        filename: 'services/token_blacklist.py',
        code: `import redis.asyncio as redis
from datetime import datetime, timezone
from app.core.security import decode_token


async def blacklist_token(token: str, redis_client: redis.Redis) -> None:
    """Add a JWT to the blacklist until it expires.
    
    Used for logout — prevents a stolen token from being used
    even before its natural expiry.
    """
    try:
        payload = decode_token(token)
        exp = payload.get("exp")
        if exp:
            ttl = exp - int(datetime.now(timezone.utc).timestamp())
            if ttl > 0:
                await redis_client.setex(f"blacklist:{token}", ttl, "1")
    except Exception:
        pass  # if token is already invalid, nothing to blacklist


async def is_token_blacklisted(token: str, redis_client: redis.Redis) -> bool:
    """Check if a token has been blacklisted (user logged out)."""
    return await redis_client.exists(f"blacklist:{token}") > 0


# In your get_current_user dependency — add this check:
async def get_current_user(
    token: str = Depends(oauth2_scheme),
    redis_client: redis.Redis = Depends(get_redis_client),
) -> dict:
    if await is_token_blacklisted(token, redis_client):
        raise HTTPException(status_code=401, detail="Token has been revoked")
    # ... rest of token validation`,
      },
      {
        type: 'callout',
        tone: 'production',
        title: 'Cache Invalidation Strategy',
        content: `When you update data in the DB, you must invalidate the cache:
- Update post → delete("post:{id}")
- Delete post → delete("post:{id}"), delete_pattern("posts:list:*")
- Cache invalidation bugs cause stale data bugs. Make it a habit: every write operation should invalidate related cache keys.
- Consider cache-aside (read-through) vs write-through depending on read:write ratio.`,
      },
      {
        type: 'exercise',
        title: 'Cached Leaderboard',
        description: 'Build a GET /leaderboard endpoint that returns the top 10 authors by post count (from the database). Cache the result for 5 minutes. Build a POST /posts endpoint that creates a post AND invalidates the leaderboard cache. Use the key "leaderboard:top10".',
        language: 'python',
        starterCode: `from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
import redis.asyncio as redis
from app.dependencies import get_db, get_current_user
from app.db.redis import get_redis_client
from app.services.cache import CacheService
from app.models.user import User
from app.models.post import Post

router = APIRouter(tags=["leaderboard"])
LEADERBOARD_KEY = "leaderboard:top10"

@router.get("/leaderboard")
async def get_leaderboard(db: AsyncSession = Depends(get_db), redis_client: redis.Redis = Depends(get_redis_client)):
    # TODO: check cache, return if hit
    # TODO: query DB for top 10 authors by post count
    # TODO: cache result for 5 minutes
    pass

@router.post("/posts")
async def create_post_with_cache_bust(title: str, content: str, db: AsyncSession = Depends(get_db), current_user: dict = Depends(get_current_user), redis_client: redis.Redis = Depends(get_redis_client)):
    # TODO: create post in DB
    # TODO: invalidate leaderboard cache
    pass`,
        solution: `from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
import redis.asyncio as redis
from app.dependencies import get_db, get_current_user
from app.db.redis import get_redis_client
from app.services.cache import CacheService
from app.models.user import User
from app.models.post import Post

router = APIRouter(tags=["leaderboard"])
LEADERBOARD_KEY = "leaderboard:top10"

@router.get("/leaderboard")
async def get_leaderboard(db: AsyncSession = Depends(get_db), redis_client: redis.Redis = Depends(get_redis_client)):
    cache = CacheService(redis_client)
    cached = await cache.get(LEADERBOARD_KEY)
    if cached:
        return {"data": cached, "cached": True}

    result = await db.execute(
        select(User.id, User.name, func.count(Post.id).label("post_count"))
        .join(Post, Post.author_id == User.id)
        .group_by(User.id, User.name)
        .order_by(func.count(Post.id).desc())
        .limit(10)
    )
    leaderboard = [{"id": r.id, "name": r.name, "post_count": r.post_count} for r in result.all()]
    await cache.set(LEADERBOARD_KEY, leaderboard, ttl=300)
    return {"data": leaderboard, "cached": False}


@router.post("/posts", status_code=status.HTTP_201_CREATED)
async def create_post_with_cache_bust(title: str, content: str, db: AsyncSession = Depends(get_db), current_user: dict = Depends(get_current_user), redis_client: redis.Redis = Depends(get_redis_client)):
    cache = CacheService(redis_client)
    post = Post(title=title, content=content, author_id=current_user["user_id"])
    db.add(post)
    await db.flush()
    await db.refresh(post)
    await cache.delete(LEADERBOARD_KEY)
    return {"id": post.id, "title": post.title}`,
        hints: [
          'Return {"cached": True} in the cache hit path so you can verify caching works',
          'Use .join(Post, ...) not .outerjoin — only count authors who have posts',
          'Invalidate the cache AFTER the DB write succeeds (inside the transaction)',
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // LESSON 11: PostgreSQL Advanced Patterns
  // ─────────────────────────────────────────────────────────────
  {
    id: 'pb-db-postgres-advanced',
    moduleId: 'python-backend',
    phaseId: 'pb-databases',
    phaseNumber: 2,
    order: 11,
    title: 'PostgreSQL: Indexes, Full-Text Search & JSON',
    description: 'Go beyond basic queries: write partial indexes, use PostgreSQL full-text search, store and query JSON data, and use EXPLAIN ANALYZE to find slow queries.',
    duration: '25 min',
    difficulty: 'advanced',
    objectives: [
      'Create and use partial indexes and composite indexes',
      'Implement full-text search with tsvector and to_tsquery',
      'Store and query JSON/JSONB columns with SQLAlchemy',
      'Read EXPLAIN ANALYZE output to identify query bottlenecks',
    ],
    content: [
      {
        type: 'text',
        markdown: `## Indexes: Not Just B-Tree

Most developers only know basic indexes. PostgreSQL offers specialized indexes that dramatically outperform B-tree for specific use cases:

| Index Type | Best For | Example |
|------------|---------|---------|
| B-tree (default) | Equality and range: =, <, >, BETWEEN | users.email, orders.created_at |
| Hash | Equality only: = | High-volume lookup by exact value |
| GIN | Arrays, JSON containment, full-text | tags, metadata JSONB |
| GiST | Geometric data, full-text, ranges | location (PostGIS), search vectors |
| BRIN | Very large, sequential tables | time-series, log tables |`,
      },
      {
        type: 'code',
        language: 'python',
        filename: 'models/post.py (with indexes)',
        code: `from sqlalchemy import String, Text, Boolean, ForeignKey, Index, func
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.postgresql import TSVECTOR, JSONB
from datetime import datetime
from app.db.base import Base


class Post(Base):
    __tablename__ = "posts"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(300))
    content: Mapped[str] = mapped_column(Text)
    published: Mapped[bool] = mapped_column(Boolean, default=False)
    author_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    created_at: Mapped[datetime] = mapped_column(server_default=func.now())

    # JSONB column for flexible metadata (tags, custom fields, etc.)
    metadata_: Mapped[dict] = mapped_column("metadata", JSONB, nullable=True)

    # Full-text search vector (auto-updated by a trigger)
    search_vector: Mapped[str] = mapped_column(TSVECTOR, nullable=True)

    __table_args__ = (
        # Partial index: only index published posts (much smaller and faster)
        Index(
            "ix_posts_published_created",
            "created_at",
            postgresql_where=Boolean("published = true"),
        ),
        # Composite index for common filter: author + published
        Index("ix_posts_author_published", "author_id", "published"),
        # GIN index for full-text search
        Index("ix_posts_search_vector", "search_vector", postgresql_using="gin"),
        # GIN index for JSONB containment queries
        Index("ix_posts_metadata", "metadata_", postgresql_using="gin"),
    )`,
        explanation: 'Partial indexes only index rows matching a condition. An index on published posts is far smaller than one on all posts — queries on published content are faster because less index to scan.',
      },
      {
        type: 'code',
        language: 'python',
        filename: 'services/search.py',
        code: `from sqlalchemy import select, text, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.dialects.postgresql import TSVECTOR
from app.models.post import Post


async def full_text_search(
    db: AsyncSession,
    query: str,
    page: int = 1,
    page_size: int = 20,
) -> list[dict]:
    """Search posts using PostgreSQL full-text search.
    
    PostgreSQL FTS is much better than LIKE for search:
    - Handles stemming (run/running/ran all match "run")
    - Supports boolean operators (AND, OR, NOT)
    - Ranks results by relevance
    """
    # to_tsquery parses the search string into a query
    # plainto_tsquery is more forgiving (handles "multiple words" naturally)
    result = await db.execute(
        select(
            Post,
            func.ts_rank(Post.search_vector, func.plainto_tsquery("english", query)).label("rank"),
        )
        .where(Post.published == True)
        .where(Post.search_vector.op("@@")(func.plainto_tsquery("english", query)))
        .order_by(text("rank DESC"))
        .offset((page - 1) * page_size)
        .limit(page_size)
    )
    return [
        {"post": row.Post, "relevance": round(row.rank, 4)}
        for row in result.all()
    ]


# ── Keep search_vector in sync with a trigger ──
# Add this in a migration:
SEARCH_VECTOR_TRIGGER = """
CREATE OR REPLACE FUNCTION posts_search_vector_update() RETURNS trigger AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', coalesce(NEW.title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(NEW.content, '')), 'B');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER posts_search_vector_trigger
BEFORE INSERT OR UPDATE ON posts
FOR EACH ROW EXECUTE FUNCTION posts_search_vector_update();
"""`,
        explanation: 'Weight A (title) ranks higher than Weight B (content) in full-text search. "setweight" controls this. A trigger keeps the vector in sync automatically — no need to update it manually.',
      },
      {
        type: 'code',
        language: 'python',
        filename: 'JSONB queries',
        code: `from sqlalchemy import select
from sqlalchemy.dialects.postgresql import JSONB
from app.models.post import Post


# ── Store metadata ──
post = Post(
    title="My Post",
    content="Content here",
    metadata_={
        "tags": ["python", "fastapi"],
        "reading_time_min": 5,
        "featured": True,
    },
)


# ── Query JSONB with SQLAlchemy ──

# Containment: posts that have tag "python"
result = await db.execute(
    select(Post)
    .where(Post.metadata_.contains({"tags": ["python"]}))
)

# Key existence: posts that have a "featured" key set to True
result = await db.execute(
    select(Post)
    .where(Post.metadata_["featured"].as_boolean() == True)
)

# Nested access: posts with reading time > 3
result = await db.execute(
    select(Post)
    .where(Post.metadata_["reading_time_min"].as_integer() > 3)
)

# ── Raw SQL for complex JSONB ──
result = await db.execute(
    text("""
        SELECT id, title, metadata->>'reading_time_min' as reading_time
        FROM posts
        WHERE metadata @> '{"featured": true}'
          AND (metadata->>'reading_time_min')::int > 3
        ORDER BY created_at DESC
        LIMIT 20
    """)
)`,
      },
      {
        type: 'text',
        markdown: `## Reading EXPLAIN ANALYZE

When a query is slow, run EXPLAIN ANALYZE to see what PostgreSQL actually does:

\`\`\`sql
EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT)
SELECT * FROM posts WHERE author_id = 42 ORDER BY created_at DESC LIMIT 20;
\`\`\`

Key things to look for:

| You see... | What it means |
|-----------|--------------|
| Seq Scan | Full table scan — probably missing an index |
| Index Scan | Using an index — good |
| Bitmap Heap Scan | Efficient for returning many rows with index |
| Hash Join | Good for large joins |
| Nested Loop | Good for small joins, bad for large ones |
| cost=0.00..5.37 rows=20 | Estimated cost and rows |
| actual time=0.05..0.12 rows=20 | Actual time in milliseconds |
| Buffers: hit=5 read=2 | Hit=from RAM, read=from disk (reads are 100x slower) |`,
      },
      {
        type: 'code',
        language: 'python',
        filename: 'EXPLAIN helper for development',
        code: `from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession


async def explain_query(db: AsyncSession, query) -> str:
    """Run EXPLAIN ANALYZE on a SQLAlchemy query — for development debugging only."""
    # Compile the query to SQL string
    compiled = query.compile(dialect=db.bind.dialect if db.bind else None)
    sql = str(compiled)
    params = compiled.params

    result = await db.execute(
        text(f"EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT) {sql}"),
        params,
    )
    return "\\n".join(row[0] for row in result.all())


# Example usage in a dev endpoint:
@router.get("/debug/explain-posts")
async def explain_posts_query(db: AsyncSession = Depends(get_db)):
    query = select(Post).where(Post.published == True).order_by(Post.created_at.desc()).limit(20)
    plan = await explain_query(db, query)
    return {"plan": plan}`,
        explanation: 'Only expose EXPLAIN endpoints in development/staging environments. Never in production — it leaks query plans and could be exploited.',
      },
      {
        type: 'exercise',
        title: 'Full-Text Search Endpoint',
        description: 'Build a GET /search endpoint with query parameter q. It should: (1) use ilike for a simple search if the search_vector column is not set up, (2) return posts matching title OR content, (3) include a relevance score (use similarity or just rank results by how many fields matched), (4) limit to 10 results. Bonus: add a ?min_reading_time= query param that filters by metadata JSONB field.',
        language: 'python',
        starterCode: `from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_, func
from typing import Annotated
from app.dependencies import get_db
from app.models.post import Post

router = APIRouter(tags=["search"])

@router.get("/search")
async def search_posts(
    q: Annotated[str, Query(min_length=2)],
    min_reading_time: int | None = None,
    db: AsyncSession = Depends(get_db),
):
    # TODO: search title and content with ilike
    # TODO: filter by min_reading_time if provided (JSONB field)
    # TODO: return up to 10 results
    pass`,
        solution: `from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_, func
from typing import Annotated
from app.dependencies import get_db
from app.models.post import Post

router = APIRouter(tags=["search"])

@router.get("/search")
async def search_posts(
    q: Annotated[str, Query(min_length=2)],
    min_reading_time: int | None = None,
    db: AsyncSession = Depends(get_db),
):
    term = f"%{q}%"
    query = (
        select(Post)
        .where(Post.published == True)
        .where(or_(Post.title.ilike(term), Post.content.ilike(term)))
    )
    if min_reading_time is not None:
        query = query.where(Post.metadata_["reading_time_min"].as_integer() >= min_reading_time)

    query = query.order_by(Post.created_at.desc()).limit(10)
    result = await db.execute(query)
    posts = result.scalars().all()

    return {
        "query": q,
        "count": len(posts),
        "results": [
            {
                "id": p.id,
                "title": p.title,
                "reading_time": p.metadata_.get("reading_time_min") if p.metadata_ else None,
            }
            for p in posts
        ],
    }`,
        hints: [
          'ilike is case-insensitive LIKE — wraps your term in % on both sides',
          'or_() from sqlalchemy creates a SQL OR condition',
          'JSONB field access: Post.metadata_["key"].as_integer() casts the JSON value to int',
        ],
      },
    ],
  },
]
