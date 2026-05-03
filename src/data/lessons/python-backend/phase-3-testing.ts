import type { Lesson } from '@/types/lesson'

export const testingLessons: Lesson[] = [
  // ─────────────────────────────────────────────────────────────
  // LESSON 12: pytest Fundamentals
  // ─────────────────────────────────────────────────────────────
  {
    id: 'pb-test-pytest',
    moduleId: 'python-backend',
    phaseId: 'pb-testing',
    phaseNumber: 3,
    order: 12,
    title: 'pytest: The Python Testing Standard',
    description: 'Write effective tests with pytest — fixtures, parametrize, markers, and the patterns senior engineers use to keep test suites fast and maintainable.',
    duration: '22 min',
    difficulty: 'intermediate',
    objectives: [
      'Write and organize tests with pytest conventions',
      'Create reusable test fixtures with different scopes',
      'Test multiple scenarios efficiently with parametrize',
      'Use pytest markers to categorize and selectively run tests',
    ],
    content: [
      {
        type: 'text',
        markdown: `## pytest in a Nutshell

pytest discovers and runs tests by looking for files named \`test_*.py\` and functions named \`test_*\`. No test class required.

\`\`\`bash
uv add pytest pytest-asyncio pytest-cov faker
\`\`\`

\`\`\`
tests/
├── conftest.py          ← shared fixtures for all tests
├── unit/
│   ├── test_security.py
│   └── test_schemas.py
└── integration/
    ├── test_users.py
    └── test_posts.py
\`\`\``,
      },
      {
        type: 'code',
        language: 'python',
        filename: 'tests/unit/test_security.py',
        code: `import pytest
from app.core.security import hash_password, verify_password, create_access_token, decode_token


# ── Basic test: function named test_* ──

def test_password_hash_is_not_plaintext():
    hashed = hash_password("secret123")
    assert hashed != "secret123"
    assert len(hashed) > 50   # bcrypt hashes are long


def test_verify_correct_password():
    hashed = hash_password("mypassword")
    assert verify_password("mypassword", hashed) is True


def test_verify_wrong_password():
    hashed = hash_password("mypassword")
    assert verify_password("wrongpassword", hashed) is False


# ── parametrize: test multiple inputs with one test ──

@pytest.mark.parametrize("password", [
    "short",
    "a" * 72,    # bcrypt truncates at 72 characters
    "unicode: àáâ",
    "spaces in password",
])
def test_hash_and_verify_various_passwords(password: str):
    hashed = hash_password(password)
    assert verify_password(password, hashed) is True


# ── Testing exceptions ──

def test_decode_invalid_token_raises():
    with pytest.raises(Exception):   # jose.JWTError or its parent
        decode_token("not.a.real.token")


def test_create_and_decode_token():
    token = create_access_token({"sub": 42, "role": "admin"})
    payload = decode_token(token)
    assert payload["sub"] == 42
    assert payload["role"] == "admin"
    assert "exp" in payload`,
        explanation: 'pytest.mark.parametrize runs the same test with each input set — much cleaner than writing separate functions or a for loop inside a test.',
      },
      {
        type: 'code',
        language: 'python',
        filename: 'tests/conftest.py',
        code: `import pytest
from faker import Faker

fake = Faker()


# ── Function-scoped fixture (default): fresh instance per test ──

@pytest.fixture
def sample_user() -> dict:
    """Returns a fake user dict — isolated per test."""
    return {
        "id": 1,
        "name": fake.name(),
        "email": fake.email(),
        "role": "member",
    }


# ── Session-scoped fixture: created once for the entire test run ──

@pytest.fixture(scope="session")
def admin_user() -> dict:
    return {"id": 999, "name": "Admin", "email": "admin@test.com", "role": "admin"}


# ── Fixture using another fixture ──

@pytest.fixture
def auth_headers(sample_user: dict) -> dict:
    from app.core.security import create_access_token
    token = create_access_token({"sub": sample_user["id"], "role": sample_user["role"]})
    return {"Authorization": f"Bearer {token}"}


# ── Fixture with teardown (yield) ──

@pytest.fixture
def temp_file(tmp_path):
    """Creates a temp file and cleans up after the test."""
    file = tmp_path / "test_data.json"
    file.write_text('{"key": "value"}')
    yield file
    # Cleanup code runs after the test (even if it fails)
    if file.exists():
        file.unlink()`,
        explanation: 'Fixtures with yield are like context managers. Code before yield = setup. Code after yield = teardown. This runs even if the test fails.',
      },
      {
        type: 'code',
        language: 'python',
        filename: 'tests/unit/test_schemas.py',
        code: `import pytest
from pydantic import ValidationError
from app.schemas.user import UserCreate


def test_user_create_valid():
    user = UserCreate(name="Alice", email="alice@example.com", age=30)
    assert user.name == "Alice"
    assert user.role == "member"   # default value


def test_user_create_strips_whitespace():
    user = UserCreate(name="  Alice  ", email="alice@example.com", age=30)
    assert user.name == "Alice"   # should be stripped


@pytest.mark.parametrize("email", [
    "notanemail",
    "@domain.com",
    "user@",
    "",
])
def test_user_create_rejects_invalid_email(email: str):
    with pytest.raises(ValidationError) as exc_info:
        UserCreate(name="Alice", email=email, age=30)
    assert "email" in str(exc_info.value)


@pytest.mark.parametrize("age,should_fail", [
    (0, True),
    (-1, True),
    (130, True),
    (1, False),
    (129, False),
    (25, False),
])
def test_user_age_validation(age: int, should_fail: bool):
    if should_fail:
        with pytest.raises(ValidationError):
            UserCreate(name="Alice", email="alice@example.com", age=age)
    else:
        user = UserCreate(name="Alice", email="alice@example.com", age=age)
        assert user.age == age`,
      },
      {
        type: 'callout',
        tone: 'tip',
        title: 'Running pytest',
        content: `\`\`\`bash
uv run pytest                          # run all tests
uv run pytest tests/unit/              # run only unit tests
uv run pytest -k "test_password"       # run tests matching name
uv run pytest -v                       # verbose output
uv run pytest --cov=app --cov-report=html  # coverage report
uv run pytest -x                       # stop on first failure
uv run pytest --lf                     # run only last failed tests
\`\`\``,
      },
      {
        type: 'exercise',
        title: 'Test the CacheService',
        description: 'Write tests for the CacheService class using a mock Redis client. Test: (1) get() returns None on cache miss, (2) set() then get() returns the same value, (3) delete() removes the key, (4) set() with TTL stores the value (mock verify setex was called with correct TTL). Use pytest.fixture for the mock client.',
        language: 'python',
        starterCode: `import pytest
from unittest.mock import AsyncMock, MagicMock
from app.services.cache import CacheService


@pytest.fixture
def mock_redis():
    """A mock Redis client."""
    client = AsyncMock()
    return client


@pytest.fixture
def cache(mock_redis):
    return CacheService(mock_redis)


# TODO: test cache miss returns None
# TODO: test set then get returns value
# TODO: test delete removes key
# TODO: test set calls setex with correct TTL`,
        solution: `import pytest
import json
from unittest.mock import AsyncMock
from app.services.cache import CacheService


@pytest.fixture
def mock_redis():
    return AsyncMock()


@pytest.fixture
def cache(mock_redis):
    return CacheService(mock_redis)


@pytest.mark.asyncio
async def test_get_returns_none_on_miss(cache, mock_redis):
    mock_redis.get.return_value = None
    result = await cache.get("missing:key")
    assert result is None
    mock_redis.get.assert_called_once_with("missing:key")


@pytest.mark.asyncio
async def test_set_and_get_round_trip(cache, mock_redis):
    data = {"id": 1, "name": "Alice"}
    mock_redis.get.return_value = json.dumps(data)
    await cache.set("user:1", data, ttl=300)
    result = await cache.get("user:1")
    assert result == data


@pytest.mark.asyncio
async def test_delete_removes_key(cache, mock_redis):
    await cache.delete("user:1")
    mock_redis.delete.assert_called_once_with("user:1")


@pytest.mark.asyncio
async def test_set_uses_correct_ttl(cache, mock_redis):
    await cache.set("key", {"value": 42}, ttl=600)
    mock_redis.setex.assert_called_once()
    call_args = mock_redis.setex.call_args
    assert call_args[0][0] == "key"   # key
    assert call_args[0][1] == 600     # ttl`,
        hints: [
          'AsyncMock auto-mocks async methods — await mock.method() works without configuration',
          'Set return_value on a mock to control what it returns: mock_redis.get.return_value = "value"',
          'mock.assert_called_once_with(args) verifies the mock was called with specific arguments',
          'Add @pytest.mark.asyncio to async test functions',
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // LESSON 13: Testing FastAPI Endpoints
  // ─────────────────────────────────────────────────────────────
  {
    id: 'pb-test-api',
    moduleId: 'python-backend',
    phaseId: 'pb-testing',
    phaseNumber: 3,
    order: 13,
    title: 'Integration Testing FastAPI Endpoints',
    description: 'Test your FastAPI routes end-to-end with httpx TestClient and a real test database — the way professional teams validate their APIs before shipping.',
    duration: '25 min',
    difficulty: 'intermediate',
    objectives: [
      'Use httpx AsyncClient to test FastAPI endpoints',
      'Set up an isolated test database that resets between tests',
      'Override dependencies for testing (DB, auth, Redis)',
      'Write tests that cover authentication, validation, and business logic',
    ],
    content: [
      {
        type: 'text',
        markdown: `## Integration vs Unit Tests

Unit tests test a function in isolation (fast, many). Integration tests test multiple components together (slower, fewer).

For a FastAPI backend:
- **Unit**: test Pydantic schemas, security functions, business logic
- **Integration**: test full HTTP request → route handler → database → response

Integration tests give you the most confidence because they test the real stack.`,
      },
      {
        type: 'code',
        language: 'bash',
        filename: 'terminal',
        code: `uv add pytest-asyncio httpx

# pytest.ini or pyproject.toml config:
# [tool.pytest.ini_options]
# asyncio_mode = "auto"   ← makes all async tests work without @pytest.mark.asyncio`,
      },
      {
        type: 'code',
        language: 'python',
        filename: 'tests/conftest.py (integration)',
        code: `import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from app.main import app
from app.db.base import Base
from app.dependencies import get_db
from app.core.security import create_access_token

# Use SQLite for tests — no PostgreSQL needed locally
TEST_DATABASE_URL = "sqlite+aiosqlite:///./test.db"


@pytest_asyncio.fixture(scope="session")
async def engine():
    """Create test DB engine once per session."""
    test_engine = create_async_engine(TEST_DATABASE_URL, echo=False)
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield test_engine
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
    await test_engine.dispose()


@pytest_asyncio.fixture
async def db_session(engine) -> AsyncSession:
    """Provide a clean DB session per test — rolls back after each test."""
    async with engine.begin() as conn:
        # Use a savepoint to roll back after each test
        session_factory = async_sessionmaker(bind=conn, expire_on_commit=False)
        async with session_factory() as session:
            yield session
            await session.rollback()


@pytest_asyncio.fixture
async def client(db_session: AsyncSession) -> AsyncClient:
    """HTTP client wired to the test app with overridden DB dependency."""
    async def override_get_db():
        yield db_session

    app.dependency_overrides[get_db] = override_get_db
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as c:
        yield c
    app.dependency_overrides.clear()


@pytest.fixture
def user_token() -> str:
    return create_access_token({"sub": 1, "role": "member"})


@pytest.fixture
def admin_token() -> str:
    return create_access_token({"sub": 2, "role": "admin"})


@pytest.fixture
def auth_headers(user_token: str) -> dict:
    return {"Authorization": f"Bearer {user_token}"}


@pytest.fixture
def admin_headers(admin_token: str) -> dict:
    return {"Authorization": f"Bearer {admin_token}"}`,
        explanation: 'dependency_overrides replaces real dependencies with test ones for each test run. This is how you swap the real DB for a test DB without changing application code.',
      },
      {
        type: 'code',
        language: 'bash',
        filename: 'terminal (add aiosqlite for test)',
        code: `uv add aiosqlite   # async SQLite driver — for testing only`,
      },
      {
        type: 'code',
        language: 'python',
        filename: 'tests/integration/test_users.py',
        code: `import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_register_user(client: AsyncClient):
    response = await client.post("/users/", json={
        "name": "Alice",
        "email": "alice@example.com",
        "password": "secure123",
    })
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "alice@example.com"
    assert "password_hash" not in data    # never expose this


@pytest.mark.asyncio
async def test_register_duplicate_email(client: AsyncClient):
    payload = {"name": "Bob", "email": "bob@example.com", "password": "pass123"}
    await client.post("/users/", json=payload)    # first registration
    response = await client.post("/users/", json=payload)   # duplicate
    assert response.status_code == 409
    assert "already registered" in response.json()["error"]["message"].lower()


@pytest.mark.asyncio
async def test_register_invalid_email(client: AsyncClient):
    response = await client.post("/users/", json={
        "name": "Invalid",
        "email": "not-an-email",
        "password": "pass123",
    })
    assert response.status_code == 422
    error = response.json()["error"]
    assert error["code"] == 422
    assert any("email" in f["field"] for f in error["fields"])


@pytest.mark.asyncio
async def test_get_profile_requires_auth(client: AsyncClient):
    response = await client.get("/profile")
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_get_profile_with_valid_token(client: AsyncClient, auth_headers: dict):
    response = await client.get("/profile", headers=auth_headers)
    assert response.status_code == 200


@pytest.mark.asyncio
async def test_admin_route_forbidden_for_member(client: AsyncClient, auth_headers: dict):
    response = await client.get("/admin/stats", headers=auth_headers)
    assert response.status_code == 403


@pytest.mark.asyncio
async def test_admin_route_accessible_for_admin(client: AsyncClient, admin_headers: dict):
    response = await client.get("/admin/stats", headers=admin_headers)
    assert response.status_code == 200`,
      },
      {
        type: 'callout',
        tone: 'tip',
        title: 'Test Naming Convention',
        content: 'Name tests as: test_{what}_{condition}_{expected_result}. Examples: test_register_duplicate_email_returns_409, test_get_posts_with_auth_returns_200. This makes failures self-documenting — you know what broke without reading the test body.',
      },
      {
        type: 'code',
        language: 'python',
        filename: 'tests/integration/test_posts.py',
        code: `import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_create_post_requires_auth(client: AsyncClient):
    response = await client.post("/posts/", json={"title": "Test", "content": "Body"})
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_create_post_success(client: AsyncClient, auth_headers: dict):
    response = await client.post(
        "/posts/",
        json={"title": "My First Post", "content": "Hello world", "published": True},
        headers=auth_headers,
    )
    assert response.status_code == 201
    post = response.json()
    assert post["title"] == "My First Post"
    assert post["author_id"] == 1   # from auth token sub claim


@pytest.mark.asyncio
async def test_list_posts_only_shows_published(client: AsyncClient, auth_headers: dict):
    # Create published post
    await client.post("/posts/", json={"title": "Published", "content": "X", "published": True}, headers=auth_headers)
    # Create draft post
    await client.post("/posts/", json={"title": "Draft", "content": "Y", "published": False}, headers=auth_headers)

    response = await client.get("/posts/")
    assert response.status_code == 200
    posts = response.json()
    titles = [p["title"] for p in posts]
    assert "Published" in titles
    assert "Draft" not in titles


@pytest.mark.asyncio
async def test_get_nonexistent_post_returns_404(client: AsyncClient):
    response = await client.get("/posts/99999")
    assert response.status_code == 404`,
      },
      {
        type: 'exercise',
        title: 'Test Authentication Flow',
        description: 'Write integration tests for the full auth flow: (1) POST /auth/register creates a user and returns 201, (2) POST /auth/token with correct credentials returns an access_token, (3) POST /auth/token with wrong password returns 401, (4) Using the returned token in Authorization header allows GET /auth/me to succeed, (5) A made-up token returns 401 on GET /auth/me.',
        language: 'python',
        starterCode: `import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_register_success(client: AsyncClient):
    pass  # TODO

@pytest.mark.asyncio
async def test_login_success_returns_token(client: AsyncClient):
    pass  # TODO: register first, then login

@pytest.mark.asyncio
async def test_login_wrong_password_returns_401(client: AsyncClient):
    pass  # TODO

@pytest.mark.asyncio
async def test_me_with_valid_token(client: AsyncClient):
    pass  # TODO: full flow: register → login → get /auth/me

@pytest.mark.asyncio
async def test_me_with_fake_token_returns_401(client: AsyncClient):
    pass  # TODO`,
        solution: `import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_register_success(client: AsyncClient):
    response = await client.post("/auth/register", json={"name": "Eve", "email": "eve@test.com", "password": "pass123"})
    assert response.status_code == 201
    assert "user_id" in response.json()

@pytest.mark.asyncio
async def test_login_success_returns_token(client: AsyncClient):
    await client.post("/auth/register", json={"name": "Frank", "email": "frank@test.com", "password": "pass123"})
    response = await client.post("/auth/token", data={"username": "frank@test.com", "password": "pass123"})
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

@pytest.mark.asyncio
async def test_login_wrong_password_returns_401(client: AsyncClient):
    await client.post("/auth/register", json={"name": "Grace", "email": "grace@test.com", "password": "correct"})
    response = await client.post("/auth/token", data={"username": "grace@test.com", "password": "wrong"})
    assert response.status_code == 401

@pytest.mark.asyncio
async def test_me_with_valid_token(client: AsyncClient):
    await client.post("/auth/register", json={"name": "Henry", "email": "henry@test.com", "password": "pass123"})
    login = await client.post("/auth/token", data={"username": "henry@test.com", "password": "pass123"})
    token = login.json()["access_token"]
    response = await client.get("/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200

@pytest.mark.asyncio
async def test_me_with_fake_token_returns_401(client: AsyncClient):
    response = await client.get("/auth/me", headers={"Authorization": "Bearer fake.token.here"})
    assert response.status_code == 401`,
        hints: [
          'POST /auth/token uses form data (data={}), not JSON — this is the OAuth2 spec',
          'Register before logging in — the test DB starts empty each session',
          'Extract the token: token = login.json()["access_token"]',
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // LESSON 14: Test Patterns & Quality Gates
  // ─────────────────────────────────────────────────────────────
  {
    id: 'pb-test-patterns',
    moduleId: 'python-backend',
    phaseId: 'pb-testing',
    phaseNumber: 3,
    order: 14,
    title: 'Test Patterns: Factories, Mocking & Coverage',
    description: 'Level up your test suite with factory patterns for test data, strategic mocking of external dependencies, and coverage gates that keep quality high.',
    duration: '20 min',
    difficulty: 'intermediate',
    objectives: [
      'Create factory fixtures that generate test data at scale',
      'Mock external HTTP calls and email services in tests',
      'Configure coverage thresholds to prevent regressions',
      'Organize tests with markers and run them in CI pipelines',
    ],
    content: [
      {
        type: 'text',
        markdown: `## Factory Pattern for Test Data

Instead of building test objects manually in every test, use factories. This keeps tests focused on what they assert, not on setup.`,
      },
      {
        type: 'code',
        language: 'python',
        filename: 'tests/factories.py',
        code: `from faker import Faker
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.user import User
from app.models.post import Post
from app.core.security import hash_password

fake = Faker()


class UserFactory:
    """Creates User records in the test database."""

    @staticmethod
    async def create(
        db: AsyncSession,
        *,
        name: str | None = None,
        email: str | None = None,
        role: str = "member",
        is_active: bool = True,
    ) -> User:
        user = User(
            name=name or fake.name(),
            email=email or fake.unique.email(),
            password_hash=hash_password("testpassword"),
            role=role,
            is_active=is_active,
        )
        db.add(user)
        await db.flush()
        await db.refresh(user)
        return user

    @staticmethod
    async def create_admin(db: AsyncSession) -> User:
        return await UserFactory.create(db, role="admin")

    @staticmethod
    async def create_batch(db: AsyncSession, count: int) -> list[User]:
        return [await UserFactory.create(db) for _ in range(count)]


class PostFactory:
    @staticmethod
    async def create(
        db: AsyncSession,
        author: User,
        *,
        title: str | None = None,
        published: bool = True,
    ) -> Post:
        post = Post(
            title=title or fake.sentence(nb_words=5),
            content=fake.paragraph(nb_sentences=10),
            published=published,
            author_id=author.id,
        )
        db.add(post)
        await db.flush()
        await db.refresh(post)
        return post`,
        explanation: 'Factories centralize test data creation. When your model changes, you update the factory — not every test file.',
      },
      {
        type: 'code',
        language: 'python',
        filename: 'tests/integration/test_leaderboard.py (using factories)',
        code: `import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession
from tests.factories import UserFactory, PostFactory


@pytest.mark.asyncio
async def test_leaderboard_returns_top_authors(client: AsyncClient, db_session: AsyncSession):
    # Create authors with different post counts
    author1 = await UserFactory.create(db_session, name="Top Author")
    author2 = await UserFactory.create(db_session, name="New Author")

    # author1 has 5 posts, author2 has 1
    await PostFactory.create_batch_for_author(db_session, author1, count=5)
    await PostFactory.create(db_session, author2)

    response = await client.get("/leaderboard")
    assert response.status_code == 200
    data = response.json()["data"]

    # Top author should be first
    assert data[0]["name"] == "Top Author"
    assert data[0]["post_count"] == 5


@pytest.mark.asyncio
async def test_leaderboard_limit_10(client: AsyncClient, db_session: AsyncSession):
    # Create 15 authors
    authors = await UserFactory.create_batch(db_session, 15)
    for author in authors:
        await PostFactory.create(db_session, author)

    response = await client.get("/leaderboard")
    assert len(response.json()["data"]) <= 10`,
      },
      {
        type: 'code',
        language: 'python',
        filename: 'tests/integration/test_notifications.py (mocking)',
        code: `import pytest
from unittest.mock import AsyncMock, patch
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_signup_sends_welcome_email(client: AsyncClient):
    """Verify signup triggers email without actually sending one."""

    # Patch the actual email-sending function
    with patch("app.routers.notifications.send_welcome_email") as mock_send:
        response = await client.post("/notifications/signup", json={
            "name": "Alice",
            "email": "alice@example.com",
        })

        assert response.status_code == 200
        assert "created" in response.json()["message"].lower()

        # The background task was scheduled — verify it was called
        # Note: background tasks run synchronously in test mode
        mock_send.assert_called_once_with("alice@example.com", "Alice")


@pytest.mark.asyncio
async def test_weather_api_timeout_handled(client: AsyncClient):
    """Verify timeout from external API returns 504 gracefully."""
    import httpx

    with patch("app.routers.weather.httpx.AsyncClient") as MockClient:
        mock_instance = AsyncMock()
        mock_instance.get.side_effect = httpx.TimeoutException("timeout")
        mock_instance.__aenter__ = AsyncMock(return_value=mock_instance)
        mock_instance.__aexit__ = AsyncMock(return_value=None)
        MockClient.return_value = mock_instance

        response = await client.get("/weather/london")
        assert response.status_code == 504
        assert "timed out" in response.json()["error"]["message"].lower()`,
        explanation: 'Always mock external services in tests. Tests that call real APIs are slow, flaky, and cost money. Use patch() to replace the external call with a controlled mock.',
      },
      {
        type: 'code',
        language: 'toml',
        filename: 'pyproject.toml (test config)',
        code: `[tool.pytest.ini_options]
asyncio_mode = "auto"
testpaths = ["tests"]
markers = [
    "unit: fast unit tests (no DB, no external services)",
    "integration: tests that use the database",
    "slow: tests that take more than 1 second",
]

[tool.coverage.run]
source = ["app"]
omit = ["app/migrations/*", "*/test*"]

[tool.coverage.report]
fail_under = 80          # fail CI if coverage drops below 80%
show_missing = true
skip_covered = false`,
      },
      {
        type: 'code',
        language: 'yaml',
        filename: '.github/workflows/test.yml',
        code: `name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    services:
      redis:
        image: redis:7-alpine
        ports: ["6379:6379"]

    steps:
      - uses: actions/checkout@v4
      - uses: astral-sh/setup-uv@v3

      - name: Install dependencies
        run: uv sync

      - name: Run unit tests
        run: uv run pytest tests/unit/ -v

      - name: Run integration tests
        run: uv run pytest tests/integration/ -v --cov=app --cov-report=xml

      - name: Check coverage threshold
        run: uv run pytest --cov=app --cov-fail-under=80`,
        explanation: 'Run unit and integration tests separately in CI. Unit tests should be fast (< 30s). If integration tests are slow, cache the test DB between runs.',
      },
      {
        type: 'exercise',
        title: 'Write a Complete Test Suite for Posts',
        description: 'Write a full test suite for the posts router. Cover: (1) creating a post sets author_id from the token, (2) only published posts appear in list, (3) creating 25 posts and listing returns at most 20 (pagination), (4) searching by title finds the post, (5) searching for nonexistent content returns empty list. Use PostFactory for data setup.',
        language: 'python',
        starterCode: `import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession
from tests.factories import UserFactory, PostFactory

@pytest.mark.asyncio
async def test_create_post_sets_author_id(client, db_session, auth_headers):
    pass  # TODO

@pytest.mark.asyncio
async def test_list_posts_excludes_drafts(client, db_session, auth_headers):
    pass  # TODO

@pytest.mark.asyncio
async def test_list_posts_pagination(client, db_session, auth_headers):
    pass  # TODO: create 25 posts, verify only 20 returned

@pytest.mark.asyncio
async def test_search_finds_by_title(client, db_session, auth_headers):
    pass  # TODO

@pytest.mark.asyncio
async def test_search_returns_empty_for_no_match(client, db_session):
    pass  # TODO`,
        solution: `import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession
from tests.factories import UserFactory, PostFactory

@pytest.mark.asyncio
async def test_create_post_sets_author_id(client, db_session, auth_headers):
    response = await client.post("/posts/", json={"title": "My Post", "content": "Body"}, headers=auth_headers)
    assert response.status_code == 201
    assert response.json()["author_id"] == 1  # from auth_headers token

@pytest.mark.asyncio
async def test_list_posts_excludes_drafts(client, db_session, auth_headers):
    author = await UserFactory.create(db_session)
    await PostFactory.create(db_session, author, title="Public Post", published=True)
    await PostFactory.create(db_session, author, title="Secret Draft", published=False)
    response = await client.get("/posts/")
    titles = [p["title"] for p in response.json()]
    assert "Public Post" in titles
    assert "Secret Draft" not in titles

@pytest.mark.asyncio
async def test_list_posts_pagination(client, db_session, auth_headers):
    author = await UserFactory.create(db_session)
    for _ in range(25):
        await PostFactory.create(db_session, author, published=True)
    response = await client.get("/posts/?limit=20")
    assert len(response.json()) <= 20

@pytest.mark.asyncio
async def test_search_finds_by_title(client, db_session):
    author = await UserFactory.create(db_session)
    await PostFactory.create(db_session, author, title="Python Async Guide", published=True)
    response = await client.get("/search?q=Python+Async")
    results = response.json()["results"]
    assert any("Python Async Guide" in r["title"] for r in results)

@pytest.mark.asyncio
async def test_search_returns_empty_for_no_match(client, db_session):
    response = await client.get("/search?q=zzxyzunlikely")
    data = response.json()
    assert data["count"] == 0
    assert data["results"] == []`,
        hints: [
          'UserFactory.create(db_session) inserts to the test DB and returns a User ORM object',
          'Use auth_headers fixture for routes requiring auth (from conftest.py)',
          'Check list length with len() — for pagination test, verify it is at most 20',
        ],
      },
    ],
  },
]
