import type { ContentBlock, Lesson } from '@/types/lesson'

// ─── PHASE 7: Testing ─────────────────────────────────────────────────────────
// Expert-reviewer + beginner-tutor standard:
// TL;DR · terminology · full API reference with outputs ·
// lifecycle diagram · real scenarios · junior mistakes + fix ·
// code-reading guide
// ─────────────────────────────────────────────────────────────────────────────

const phase7Blocks: Record<string, string[]> = {
  // ─── Lesson 1: pytest Fundamentals ─────────────────────────────────────
  'pb-test-pytest': [
    `## Beginner TL;DR — pytest

pytest is the standard Python testing framework. You write functions that start with \`test_\`, put assertions inside them, and run \`pytest\`.

**Pronunciation:** PY-test (like "pie test")

If the assertion passes → green. If it raises → red with a helpful diff. No boilerplate, no class required.`,

    `## Full reference: test discovery and execution

\`\`\`bash
# Run all tests
pytest

# Run a specific file
pytest tests/test_courses.py

# Run a specific test by name
pytest tests/test_courses.py::test_create_course

# Run tests matching a keyword
pytest -k "create"                   # runs all tests with "create" in the name
pytest -k "create and not admin"     # boolean operators work

# Show print output (normally captured)
pytest -s                            # or --capture=no

# Verbose — show each test name and result
pytest -v

# Stop at first failure
pytest -x

# Show slowest N tests
pytest --durations=10

# Run in parallel (pip install pytest-xdist)
pytest -n auto                       # use all CPU cores
pytest -n 4                          # use 4 workers

# Coverage report (pip install pytest-cov)
pytest --cov=app --cov-report=term-missing
pytest --cov=app --cov-report=html   # → htmlcov/index.html
\`\`\``,

    `## Full reference: writing tests — everything you need

\`\`\`python
import pytest

# ── Basic test ─────────────────────────────────────────────────────
def test_addition():
    assert 1 + 1 == 2

# ── Assert variants with descriptive failure messages ─────────────
def test_assertions():
    result = {"name": "Alice", "age": 30}
    assert result["name"] == "Alice"
    assert result["age"] >= 18, f"Expected adult, got {result['age']}"
    assert "name" in result
    assert result is not None

# ── Testing exceptions ─────────────────────────────────────────────
def test_raises_on_zero():
    with pytest.raises(ZeroDivisionError):
        1 / 0

def test_raises_value_error_message():
    with pytest.raises(ValueError, match="must be positive"):
        validate_age(-5)      # expects: raise ValueError("Age must be positive")

# ── Parametrize: run same test with many inputs ───────────────────
@pytest.mark.parametrize("price, expected", [
    (0,     True),
    (9.99,  True),
    (-1,    False),
    (None,  False),
])
def test_is_valid_price(price, expected):
    assert is_valid_price(price) == expected

# ── Skip and expected failure ─────────────────────────────────────
@pytest.mark.skip(reason="feature not built yet")
def test_future_feature():
    pass

@pytest.mark.xfail(reason="known bug #123")
def test_known_bug():
    assert buggy_function() == "expected"
\`\`\``,

    `## Full reference: fixtures — sharing setup code

\`\`\`python
import pytest

# ── Simple fixture ────────────────────────────────────────────────
@pytest.fixture
def sample_user():
    return {"id": 1, "name": "Alice", "email": "alice@example.com"}

def test_user_name(sample_user):
    assert sample_user["name"] == "Alice"   # pytest injects sample_user


# ── Fixture with teardown (yield) ─────────────────────────────────
@pytest.fixture
def temp_file(tmp_path):
    path = tmp_path / "test.txt"
    path.write_text("hello")
    yield path                           # ← test runs here
    path.unlink(missing_ok=True)         # ← cleanup after test


# ── Fixture scope (how long it lives) ────────────────────────────
@pytest.fixture(scope="session")    # created ONCE per test session
def db_engine():
    engine = create_engine("postgresql://...")
    yield engine
    engine.dispose()

@pytest.fixture(scope="module")     # created ONCE per test file
def auth_token(client):
    resp = client.post("/auth/token", data={...})
    return resp.json()["access_token"]

@pytest.fixture(scope="function")   # default — recreated per test
def fresh_user(db):
    user = User(name="Test", email=f"test{uuid4()}@x.com")
    db.add(user)
    db.commit()
    yield user
    db.delete(user)
    db.commit()


# ── conftest.py — fixtures available to all tests in the directory ─
# Create file: tests/conftest.py
# Put shared fixtures there (db, client, auth_token)
\`\`\``,

    `## Full reference: mocking with unittest.mock

\`\`\`python
from unittest.mock import Mock, MagicMock, AsyncMock, patch, call

# ── Mock object — tracks calls ──────────────────────────────────────
mock = Mock()
mock(1, 2)
mock.somemethod("x")

mock.assert_called_once_with(1, 2)   # passes
mock.somemethod.assert_called_with("x")

# ── Patch: replace real code during test ────────────────────────────
# Replace redis.set during the test — no real Redis needed
@patch("app.services.course.redis_client")
def test_cache_hit(mock_redis):
    mock_redis.get.return_value = '{"id": 1, "title": "Python"}'
    result = get_course_cached(1)
    assert result["id"] == 1
    mock_redis.get.assert_called_once_with("course:1")

# ── AsyncMock — for async functions ──────────────────────────────────
@patch("app.services.email.send_email", new_callable=AsyncMock)
async def test_welcome_email(mock_send):
    await create_user_with_email("alice@example.com")
    mock_send.assert_awaited_once()
    args = mock_send.call_args[0]
    assert args[0] == "alice@example.com"

# ── Patch as context manager ──────────────────────────────────────
def test_external_api():
    with patch("httpx.AsyncClient.get") as mock_get:
        mock_get.return_value = Mock(json=lambda: {"status": "ok"}, status_code=200)
        result = call_external_api()
        assert result["status"] == "ok"
\`\`\``,

    `## Real scenario: parametrize the price validation

\`\`\`python
@pytest.mark.parametrize("price, level, expect_error", [
    (0,     "beginner",     False),
    (49.99, "advanced",     False),
    (-1,    "beginner",     True),
    (0,     "advanced",     True),   # advanced must not be free per business rule
    (None,  "beginner",     True),
])
def test_price_validation(price, level, expect_error):
    data = {"title": "Test Course", "price": price, "level": level}
    if expect_error:
        with pytest.raises(ValidationError):
            CourseCreate(**data)
    else:
        course = CourseCreate(**data)
        assert course.price == price

# 5 test cases, one function. Each listed separately in pytest output:
# test_price_validation[0-beginner-False]  PASSED
# test_price_validation[49.99-advanced-False]  PASSED
# test_price_validation[-1-beginner-True]  PASSED
# ...
\`\`\``,

    `## Junior mistakes + fix

| Mistake | What happens | Fix |
|---|---|---|
| Assert \`True\` instead of actual values | Test passes even when behaviour is wrong | Assert the actual return value, not just truthy |
| No \`conftest.py\` — copy fixture in every file | Duplication, drift | Centralise shared fixtures in \`conftest.py\` |
| Real DB/Redis in unit tests | Tests are slow and fragile | Mock external services |
| No \`scope\` on expensive fixtures | DB recreated per test — very slow | Use \`scope="session"\` for engine, \`scope="function"\` for sessions |
| Ignore test failure in CI | Broken code ships | Always run pytest in CI before merge |`,
  ],

  // ─── Lesson 2: API Integration Testing ──────────────────────────────────
  'pb-test-api': [
    `## Beginner TL;DR — API integration testing

Unit tests test single functions. Integration tests test the full HTTP stack: HTTP method → routing → validation → handler → DB → response.

FastAPI's \`TestClient\` wraps the whole app and lets you make real HTTP calls in tests — no server needed.`,

    `## Full reference: FastAPI TestClient setup

\`\`\`python
# tests/conftest.py
import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker

from app.main import app
from app.database import Base, get_db

TEST_DATABASE_URL = "postgresql+asyncpg://user:pass@localhost/test_db"

@pytest.fixture(scope="session")
async def test_engine():
    engine = create_async_engine(TEST_DATABASE_URL)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)   # create all tables
    yield engine
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)     # drop all after tests
    await engine.dispose()

@pytest.fixture
async def db(test_engine):
    AsyncTestSession = async_sessionmaker(test_engine, expire_on_commit=False)
    async with AsyncTestSession() as session:
        yield session
        await session.rollback()   # ← roll back after each test for isolation

@pytest.fixture
async def client(db):
    # Override the real DB dependency with test DB
    app.dependency_overrides[get_db] = lambda: db
    async with AsyncClient(app=app, base_url="http://test") as ac:
        yield ac
    app.dependency_overrides.clear()
\`\`\``,

    `## Full reference: writing integration tests

\`\`\`python
import pytest

@pytest.mark.asyncio
class TestCourseEndpoints:

    async def test_list_courses_empty(self, client):
        response = await client.get("/api/courses/")
        assert response.status_code == 200
        assert response.json() == []

    async def test_create_course(self, client, auth_headers):
        payload = {
            "title": "Python Basics",
            "slug": "python-basics",
            "price": 0,
            "level": "beginner",
        }
        response = await client.post("/api/courses/", json=payload, headers=auth_headers)
        assert response.status_code == 201
        data = response.json()
        assert data["title"] == "Python Basics"
        assert "id" in data

    async def test_create_course_invalid_price(self, client, auth_headers):
        payload = {"title": "Test", "slug": "test", "price": -1, "level": "beginner"}
        response = await client.post("/api/courses/", json=payload, headers=auth_headers)
        assert response.status_code == 422    # Pydantic validation failed
        errors = response.json()["detail"]
        assert any("price" in str(e) for e in errors)

    async def test_get_course_not_found(self, client):
        response = await client.get("/api/courses/99999")
        assert response.status_code == 404
        assert "not found" in response.json()["detail"].lower()

    async def test_update_course_unauthorized(self, client):
        response = await client.patch("/api/courses/1", json={"title": "New"})
        assert response.status_code == 401   # no auth headers

    async def test_delete_course(self, client, auth_headers, created_course):
        response = await client.delete(
            f"/api/courses/{created_course['id']}", headers=auth_headers
        )
        assert response.status_code == 204

        # Verify it's gone
        response = await client.get(f"/api/courses/{created_course['id']}")
        assert response.status_code == 404
\`\`\``,

    `## Full reference: auth token fixture

\`\`\`python
# tests/conftest.py (add to existing conftest)
@pytest.fixture
async def registered_user(client):
    """Create a real user via API, return user data."""
    resp = await client.post("/api/auth/register", json={
        "name": "Test User",
        "email": "test@example.com",
        "password": "SecurePass123!",
    })
    assert resp.status_code == 201
    return resp.json()

@pytest.fixture
async def auth_headers(client, registered_user):
    """Login and return Authorization header dict."""
    resp = await client.post("/api/auth/token", data={
        "username": registered_user["email"],
        "password": "SecurePass123!",
    })
    assert resp.status_code == 200
    token = resp.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}

@pytest.fixture
async def admin_headers(client):
    """Create admin user and return headers."""
    # Directly insert admin user into DB via ORM to bypass normal registration
    ...
\`\`\``,

    `## Full reference: checking the response in detail

\`\`\`python
async def test_course_response_shape(client, auth_headers, created_course):
    resp = await client.get(f"/api/courses/{created_course['id']}")
    assert resp.status_code == 200
    data = resp.json()

    # ── Check all expected fields exist ──────────────────────────
    assert set(data.keys()) >= {"id", "title", "slug", "price", "level", "author"}

    # ── Check types ───────────────────────────────────────────────
    assert isinstance(data["id"],    int)
    assert isinstance(data["title"], str)
    assert isinstance(data["price"], (int, float))

    # ── Check nested object ───────────────────────────────────────
    assert "name" in data["author"]

    # ── Check SENSITIVE fields are NOT present ────────────────────
    assert "password_hash" not in data
    assert "password"      not in data
\`\`\``,

    `## Junior mistakes + fix

| Mistake | What happens | Fix |
|---|---|---|
| Real DB URL in tests | Tests modify production/dev data | Always use a separate test DB or rollback transactions |
| No \`dependency_overrides\` cleanup | Later tests fail with wrong DB | Call \`app.dependency_overrides.clear()\` after each test |
| No test for 404 / 401 / 422 paths | Error paths untested, break silently | Always test unhappy paths alongside happy paths |
| Assert only status code | Missing field in response never caught | Also assert response body structure |
| Shared mutable state between tests | Tests affect each other — order-dependent | Use transaction rollback or truncate in teardown |`,
  ],

  // ─── Lesson 3: Test Patterns & Best Practices ────────────────────────────
  'pb-test-patterns': [
    `## Beginner TL;DR — Test Patterns

Good tests follow the AAA pattern:
1. **Arrange** — set up data and dependencies
2. **Act** — call the function/endpoint
3. **Assert** — check the result

And the FIRST principles:
- **F**ast — run in seconds
- **I**ndependent — no test depends on another
- **R**epeatable — same result every time
- **S**elf-validating — pass or fail, no manual check
- **T**imely — written when (or before) the code`,

    `## Full reference: test data factories

\`\`\`python
# tests/factories.py — generate realistic test data without repetition
from dataclasses import dataclass, field
from datetime import datetime
from typing import Any
import uuid

@dataclass
class UserFactory:
    id:       int   = field(default_factory=lambda: uuid.uuid4().int % 10000)
    name:     str   = "Test User"
    email:    str   = field(default_factory=lambda: f"user{uuid.uuid4().hex[:6]}@test.com")
    role:     str   = "member"
    is_active: bool = True

    def as_dict(self) -> dict[str, Any]:
        return {k: v for k, v in self.__dict__.items()}

@dataclass
class CourseFactory:
    id:           int   = field(default_factory=lambda: uuid.uuid4().int % 10000)
    title:        str   = "Test Course"
    slug:         str   = field(default_factory=lambda: f"test-{uuid.uuid4().hex[:6]}")
    price:        float = 0.0
    level:        str   = "beginner"
    is_published: bool  = True
    author_id:    int   = 1

    def as_dict(self) -> dict[str, Any]:
        return {k: v for k, v in self.__dict__.items()}

# Usage in tests:
def test_course_title_required():
    data = CourseFactory(title="").as_dict()
    with pytest.raises(ValidationError):
        CourseCreate(**data)

def test_unique_emails():
    u1 = UserFactory()
    u2 = UserFactory()
    assert u1.email != u2.email   # factory generates unique emails
\`\`\``,

    `## Full reference: testing edge cases and error paths

\`\`\`python
# Every feature needs at least these test categories:

# 1. Happy path — standard successful use
async def test_create_course_success(client, auth_headers):
    resp = await client.post("/courses/", json=CourseFactory().as_dict(), headers=auth_headers)
    assert resp.status_code == 201

# 2. Boundary conditions — edge of valid range
@pytest.mark.parametrize("price", [0, 0.01, 999.99])
async def test_valid_prices(client, auth_headers, price):
    resp = await client.post("/courses/", json=CourseFactory(price=price).as_dict(), headers=auth_headers)
    assert resp.status_code == 201

# 3. Invalid input — should return 422
@pytest.mark.parametrize("price", [-0.01, -100, None])
async def test_invalid_prices(client, auth_headers, price):
    resp = await client.post("/courses/", json=CourseFactory(price=price).as_dict(), headers=auth_headers)
    assert resp.status_code == 422

# 4. Not found — should return 404
async def test_get_nonexistent_course(client):
    resp = await client.get("/courses/99999")
    assert resp.status_code == 404

# 5. Unauthenticated — should return 401
async def test_create_requires_auth(client):
    resp = await client.post("/courses/", json=CourseFactory().as_dict())
    assert resp.status_code == 401

# 6. Unauthorized — should return 403
async def test_delete_requires_admin(client, member_headers):
    resp = await client.delete("/courses/1", headers=member_headers)
    assert resp.status_code == 403

# 7. Duplicate — should return 409
async def test_duplicate_slug(client, auth_headers, created_course):
    resp = await client.post("/courses/", json=CourseFactory(slug=created_course["slug"]).as_dict(), headers=auth_headers)
    assert resp.status_code == 409
\`\`\``,

    `## Full reference: coverage — what to measure and aim for

\`\`\`bash
# Generate coverage report
pytest --cov=app --cov-report=term-missing

# Example output:
# Name                      Stmts   Miss  Cover   Missing
# app/main.py                  18      0   100%
# app/routers/courses.py       52      4    92%   45-47, 83
# app/services/courses.py      87      8    91%   120-127
# app/models/course.py         20      0   100%
# TOTAL                       177     12    93%

# Lines 45-47 in courses.py are untested — check what they do
\`\`\`

**Coverage guidelines:**
| Area | Target |
|---|---|
| Services / business logic | 90%+ |
| Route handlers | 85%+ |
| Models | 80%+ |
| Utility functions | 95%+ |
| Error handling paths | Must test explicitly |

**100% coverage does not mean bug-free.** You can cover a line without testing the right conditions. Focus on behaviours, not line counts.`,

    `## Full reference: what to test vs not test

\`\`\`
TEST THESE (your code):
✓ Business logic (price validation, permission checks)
✓ API contract (response shape, status codes)
✓ Error paths (404, 401, 403, 422)
✓ Edge cases (empty lists, zero values, very long strings)
✓ Integration between your components (route → service → DB)

DO NOT TEST (third-party code):
✗ Django ORM internals
✗ FastAPI's routing engine
✗ Pydantic's type validation engine
✗ SQLAlchemy's SQL generation
✗ Python's standard library functions

WHY: Third-party libraries have their own test suites.
     Testing them wastes time and couples your tests to implementation details.
\`\`\``,

    `## Real scenario: payment webhook test

\`\`\`python
async def test_payment_webhook_success(client):
    """Simulate Stripe sending a payment.completed webhook."""
    payload = {
        "type": "payment_intent.succeeded",
        "data": {"object": {"id": "pi_123", "amount": 4999, "metadata": {"user_id": "42", "course_id": "7"}}}
    }
    # Stripe signs webhooks — mock the signature verification
    with patch("app.services.stripe.verify_webhook_signature", return_value=True):
        resp = await client.post("/webhooks/stripe", json=payload,
                                 headers={"Stripe-Signature": "mock"})
    assert resp.status_code == 200
    # Verify enrollment was created
    resp2 = await client.get("/courses/7/enrollment", headers=user_42_headers)
    assert resp2.json()["enrolled"] is True
\`\`\``,

    `## Junior mistakes + fix

| Mistake | What happens | Fix |
|---|---|---|
| Only happy-path tests | Bug hidden in error paths ships to production | Always test 404, 401, 403, 422 |
| Hard-coded IDs in tests | Tests fail when DB order changes | Use fixtures that create and return the actual ID |
| Test implementation not behaviour | Refactoring breaks tests even when behaviour is correct | Test the API contract, not internal function calls |
| Skip tests when CI is slow | Technical debt accumulates | Optimise test speed with \`-n auto\` and scoped fixtures |
| No assertion on response body | Returns 200 with wrong data — test passes | Always check at least key fields in the response body |`,
  ],
}

function toBlocks(markdowns: string[]): ContentBlock[] {
  return markdowns.map(markdown => ({ type: 'text' as const, markdown }))
}

export function applyPhase7TestingEnhancements(lessons: Lesson[]): Lesson[] {
  return lessons.map(lesson => {
    const markdowns = phase7Blocks[lesson.id]
    if (!markdowns) return lesson
    return {
      ...lesson,
      content: [...toBlocks(markdowns), ...lesson.content],
    }
  })
}
