import type { Lesson } from '@/types/lesson'

export const fastapiLessons: Lesson[] = [
  // ─────────────────────────────────────────────────────────────
  // LESSON 1: FastAPI Intro
  // ─────────────────────────────────────────────────────────────
  {
    id: 'pb-fastapi-intro',
    moduleId: 'python-backend',
    phaseId: 'pb-fastapi',
    phaseNumber: 1,
    order: 1,
    title: 'FastAPI: Your First Production API',
    description: 'Set up a modern Python project with uv, build your first FastAPI app, and understand why FastAPI is the industry standard for Python backends.',
    duration: '20 min',
    difficulty: 'beginner',
    objectives: [
      'Set up a Python project with uv, the modern package manager',
      'Build and run a FastAPI application with automatic docs',
      'Understand the ASGI model and why FastAPI is fast',
      'Navigate Swagger UI and ReDoc for API exploration',
    ],
    content: [
      {
        type: 'text',
        markdown: `## Why FastAPI?

FastAPI is the standard choice for Python backend development in 2025+. Here is why teams pick it over Flask and Django REST Framework:

| Feature | FastAPI | Flask | Django REST |
|---------|---------|-------|-------------|
| Performance | Very fast (ASGI) | Moderate (WSGI) | Moderate (WSGI) |
| Auto docs | Built-in | Manual | drf-spectacular |
| Type validation | Built-in (Pydantic) | Manual | Serializers |
| Async support | Native | Bolted on | Limited |
| Learning curve | Low | Very low | High |

FastAPI is built on two foundations:
- **Starlette** — a lightweight ASGI framework for routing and HTTP
- **Pydantic** — data validation using Python type hints`,
      },
      {
        type: 'callout',
        tone: 'info',
        title: 'ASGI vs WSGI',
        content: 'WSGI (Flask, Django) handles one request at a time per worker. ASGI (FastAPI, Django Channels) handles thousands of concurrent connections with a single worker using async I/O. For APIs that call databases or external services, ASGI is significantly more efficient.',
      },
      {
        type: 'text',
        markdown: `## Project Setup with uv

\`uv\` is the modern Python package manager (written in Rust, 10–100x faster than pip). In 2025, most teams have switched from pip + venv to uv.`,
      },
      {
        type: 'code',
        language: 'bash',
        filename: 'terminal',
        code: `# Install uv (one-time, system-wide)
curl -LsSf https://astral.sh/uv/install.sh | sh
# Windows: powershell -c "irm https://astral.sh/uv/install.ps1 | iex"

# Create a new project
uv init my-api
cd my-api

# Add dependencies
uv add fastapi uvicorn[standard] pydantic

# Run a script
uv run python main.py

# Your project structure:
# my-api/
# ├── pyproject.toml    ← dependencies (like package.json)
# ├── .python-version   ← Python version pin
# └── main.py`,
        explanation: 'uv manages virtual environments automatically — no need to activate/deactivate. Running `uv run` executes in the correct environment.',
      },
      {
        type: 'code',
        language: 'python',
        filename: 'main.py',
        code: `from fastapi import FastAPI

# Create the application instance
app = FastAPI(
    title="My API",
    description="A production-ready Python API",
    version="1.0.0",
)


# Route decorator + handler function = endpoint
@app.get("/")
def root():
    return {"message": "API is running", "status": "ok"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}


# Run with: uv run uvicorn main:app --reload
# --reload: auto-restart on file changes (development only)`,
        explanation: 'FastAPI uses Python decorators to register routes. The function return value is automatically serialized to JSON.',
      },
      {
        type: 'text',
        markdown: `## Running the Server

\`\`\`bash
uv run uvicorn main:app --reload --host 0.0.0.0 --port 8000
\`\`\`

Once running, FastAPI gives you three URLs for free:

| URL | What it is |
|-----|-----------|
| \`http://localhost:8000\` | Your API |
| \`http://localhost:8000/docs\` | Swagger UI — interactive browser |
| \`http://localhost:8000/redoc\` | ReDoc — clean reference docs |
| \`http://localhost:8000/openapi.json\` | Raw OpenAPI spec |

The docs are automatically generated from your code — no manual documentation needed. This is one of FastAPI's biggest productivity wins.`,
      },
      {
        type: 'callout',
        tone: 'production',
        title: 'In Production',
        content: 'Never use `--reload` in production. Use `uvicorn main:app --workers 4` or run behind Gunicorn with Uvicorn workers: `gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker`. A common rule: workers = 2 × CPU cores + 1.',
      },
      {
        type: 'text',
        markdown: `## Project Structure for a Real API

As your API grows, you need a structure that scales. Here is the pattern used by most production FastAPI projects:

\`\`\`
my-api/
├── app/
│   ├── __init__.py
│   ├── main.py          ← App entry point, lifespan, middleware
│   ├── config.py        ← Settings from environment variables
│   ├── dependencies.py  ← Shared dependencies (DB session, current user)
│   ├── routers/         ← Route groups by feature
│   │   ├── users.py
│   │   ├── products.py
│   │   └── orders.py
│   ├── models/          ← SQLAlchemy ORM models
│   ├── schemas/         ← Pydantic request/response models
│   └── services/        ← Business logic (not in routes)
├── tests/
├── pyproject.toml
└── Dockerfile
\`\`\`

You will build toward this structure throughout the module.`,
      },
      {
        type: 'exercise',
        title: 'Build a Quote API',
        description: 'Create a FastAPI app with 3 endpoints: GET /quotes (return a list of 3 hardcoded quotes), GET /quotes/{id} (return one quote by ID, return 404 if not found using HTTPException), and GET /health. Run it and verify all endpoints work in Swagger UI at /docs.',
        language: 'python',
        starterCode: `from fastapi import FastAPI, HTTPException

app = FastAPI(title="Quote API", version="1.0.0")

QUOTES = [
    {"id": 1, "text": "Code is read more than it is written.", "author": "Donald Knuth"},
    {"id": 2, "text": "Make it work, make it right, make it fast.", "author": "Kent Beck"},
    {"id": 3, "text": "Simplicity is the soul of efficiency.", "author": "Austin Freeman"},
]

# TODO: implement GET /quotes
# TODO: implement GET /quotes/{id}
# TODO: implement GET /health`,
        solution: `from fastapi import FastAPI, HTTPException

app = FastAPI(title="Quote API", version="1.0.0")

QUOTES = [
    {"id": 1, "text": "Code is read more than it is written.", "author": "Donald Knuth"},
    {"id": 2, "text": "Make it work, make it right, make it fast.", "author": "Kent Beck"},
    {"id": 3, "text": "Simplicity is the soul of efficiency.", "author": "Austin Freeman"},
]


@app.get("/quotes")
def list_quotes():
    return {"data": QUOTES, "count": len(QUOTES)}


@app.get("/quotes/{id}")
def get_quote(id: int):
    quote = next((q for q in QUOTES if q["id"] == id), None)
    if not quote:
        raise HTTPException(status_code=404, detail=f"Quote {id} not found")
    return quote


@app.get("/health")
def health():
    return {"status": "healthy"}`,
        hints: [
          'Use next() with a generator expression to find a quote by id',
          'HTTPException takes status_code and detail parameters',
          'The id path parameter type annotation (id: int) auto-validates the input',
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // LESSON 2: Routes, Parameters & Responses
  // ─────────────────────────────────────────────────────────────
  {
    id: 'pb-fastapi-routing',
    moduleId: 'python-backend',
    phaseId: 'pb-fastapi',
    phaseNumber: 1,
    order: 2,
    title: 'Routes, Parameters & HTTP Responses',
    description: 'Master FastAPI routing: HTTP verbs, path parameters, query parameters, response models, and status codes — the building blocks of every REST API.',
    duration: '22 min',
    difficulty: 'beginner',
    objectives: [
      'Use all HTTP verbs correctly in FastAPI',
      'Define path and query parameters with type validation',
      'Return proper HTTP status codes for each operation',
      'Use APIRouter to organize routes into feature files',
    ],
    content: [
      {
        type: 'text',
        markdown: `## HTTP Verbs in REST APIs

REST APIs use HTTP methods to signal intent. This is the convention every backend engineer must know:

| Method | Purpose | Example |
|--------|---------|---------|
| GET | Read a resource | GET /users, GET /users/42 |
| POST | Create a resource | POST /users |
| PUT | Replace a resource completely | PUT /users/42 |
| PATCH | Partially update a resource | PATCH /users/42 |
| DELETE | Remove a resource | DELETE /users/42 |

FastAPI has a decorator for each verb: \`@app.get\`, \`@app.post\`, \`@app.put\`, \`@app.patch\`, \`@app.delete\`.`,
      },
      {
        type: 'code',
        language: 'python',
        filename: 'routers/users.py',
        code: `from fastapi import APIRouter, HTTPException, status

# APIRouter groups related routes — import and include in main.py
router = APIRouter(prefix="/users", tags=["users"])

# In-memory store for examples (real apps use a database)
_users: dict[int, dict] = {}
_next_id = 1


@router.get("/", summary="List all users")
def list_users(skip: int = 0, limit: int = 20):
    users = list(_users.values())
    return {"data": users[skip : skip + limit], "total": len(users)}


@router.get("/{user_id}", summary="Get a user by ID")
def get_user(user_id: int):
    user = _users.get(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.post("/", status_code=status.HTTP_201_CREATED, summary="Create a user")
def create_user(name: str, email: str):
    global _next_id
    user = {"id": _next_id, "name": name, "email": email}
    _users[_next_id] = user
    _next_id += 1
    return user


@router.put("/{user_id}", summary="Replace a user")
def replace_user(user_id: int, name: str, email: str):
    if user_id not in _users:
        raise HTTPException(status_code=404, detail="User not found")
    _users[user_id] = {"id": user_id, "name": name, "email": email}
    return _users[user_id]


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(user_id: int):
    if user_id not in _users:
        raise HTTPException(status_code=404, detail="User not found")
    del _users[user_id]
    # 204 No Content → return nothing`,
        explanation: 'Use the status module for readable status codes instead of magic numbers. 201 Created for POST, 204 No Content for DELETE are the REST conventions.',
      },
      {
        type: 'text',
        markdown: `## Path Parameters vs Query Parameters

These are the two ways to pass data in a GET request:

\`\`\`
GET /products/42          ← path parameter (identifies a resource)
GET /products?category=shoes&max_price=100  ← query parameters (filter/sort)
\`\`\`

FastAPI determines which is which by whether the parameter name appears in the path string.`,
      },
      {
        type: 'code',
        language: 'python',
        filename: 'routers/products.py',
        code: `from fastapi import APIRouter, Query
from enum import Enum
from typing import Annotated

router = APIRouter(prefix="/products", tags=["products"])


class SortOrder(str, Enum):
    asc = "asc"
    desc = "desc"


@router.get("/")
def list_products(
    # Query parameters with validation
    category: str | None = None,
    min_price: Annotated[float | None, Query(ge=0)] = None,
    max_price: Annotated[float | None, Query(ge=0)] = None,
    sort_by: str = "name",
    order: SortOrder = SortOrder.asc,
    page: Annotated[int, Query(ge=1)] = 1,
    page_size: Annotated[int, Query(ge=1, le=100)] = 20,
):
    # In real code: build a DB query using these filters
    return {
        "filters": {
            "category": category,
            "price_range": [min_price, max_price],
        },
        "sort": {"by": sort_by, "order": order},
        "pagination": {"page": page, "page_size": page_size},
    }


@router.get("/{product_id}")
def get_product(
    product_id: int,           # ← path param (in the URL pattern)
    include_reviews: bool = False,  # ← query param (not in URL pattern)
):
    return {"id": product_id, "include_reviews": include_reviews}


# URL: GET /products/42?include_reviews=true`,
        explanation: 'Use Annotated + Query to add validation to query params. ge=0 means "greater than or equal to 0". Enum parameters automatically show as dropdowns in Swagger UI.',
      },
      {
        type: 'text',
        markdown: `## Registering Routers in main.py

Once you have route files, register them in the main app:`,
      },
      {
        type: 'code',
        language: 'python',
        filename: 'main.py',
        code: `from fastapi import FastAPI
from app.routers import users, products

app = FastAPI(title="My API", version="1.0.0")

# Include routers — prefix and tags can be set here or in the router
app.include_router(users.router)
app.include_router(products.router)

# Resulting routes:
# GET    /users/
# GET    /users/{user_id}
# POST   /users/
# PUT    /users/{user_id}
# DELETE /users/{user_id}
# GET    /products/
# GET    /products/{product_id}`,
      },
      {
        type: 'callout',
        tone: 'tip',
        title: 'Route Order Matters',
        content: 'FastAPI matches routes in order. If you have GET /users/me and GET /users/{id}, put /me BEFORE /{id} — otherwise "me" is treated as the id value.',
      },
      {
        type: 'exercise',
        title: 'Build a Tasks CRUD API',
        description: 'Create a tasks router with full CRUD: POST /tasks (create), GET /tasks (list, with ?status=pending|done filter), GET /tasks/{id}, PATCH /tasks/{id} (mark done or update title), DELETE /tasks/{id}. Each task has: id, title, status (pending/done), created_at (use datetime.now().isoformat()). Return 404 for missing tasks, 201 for creation.',
        language: 'python',
        starterCode: `from fastapi import APIRouter, HTTPException, Query, status
from datetime import datetime
from enum import Enum
from typing import Annotated

router = APIRouter(prefix="/tasks", tags=["tasks"])

class TaskStatus(str, Enum):
    pending = "pending"
    done = "done"

_tasks: dict[int, dict] = {}
_next_id = 1

# TODO: POST /tasks - create a task
# TODO: GET /tasks - list tasks with optional ?status filter
# TODO: GET /tasks/{id} - get one task
# TODO: PATCH /tasks/{id} - update title or status
# TODO: DELETE /tasks/{id} - delete a task`,
        solution: `from fastapi import APIRouter, HTTPException, Query, status
from datetime import datetime
from enum import Enum
from typing import Annotated

router = APIRouter(prefix="/tasks", tags=["tasks"])

class TaskStatus(str, Enum):
    pending = "pending"
    done = "done"

_tasks: dict[int, dict] = {}
_next_id = 1


@router.post("/", status_code=status.HTTP_201_CREATED)
def create_task(title: str):
    global _next_id
    task = {"id": _next_id, "title": title, "status": "pending", "created_at": datetime.now().isoformat()}
    _tasks[_next_id] = task
    _next_id += 1
    return task


@router.get("/")
def list_tasks(status_filter: TaskStatus | None = Query(None, alias="status")):
    tasks = list(_tasks.values())
    if status_filter:
        tasks = [t for t in tasks if t["status"] == status_filter]
    return {"data": tasks, "count": len(tasks)}


@router.get("/{id}")
def get_task(id: int):
    task = _tasks.get(id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


@router.patch("/{id}")
def update_task(id: int, title: str | None = None, status_update: TaskStatus | None = Query(None, alias="status")):
    task = _tasks.get(id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    if title:
        task["title"] = title
    if status_update:
        task["status"] = status_update
    return task


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(id: int):
    if id not in _tasks:
        raise HTTPException(status_code=404, detail="Task not found")
    del _tasks[id]`,
        hints: [
          'Use Query(None, alias="status") to avoid conflict with Python\'s built-in status name',
          'PATCH only updates provided fields — check if each parameter is not None',
          'DELETE returns 204 No Content (no return value)',
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // LESSON 3: Pydantic v2 Validation
  // ─────────────────────────────────────────────────────────────
  {
    id: 'pb-fastapi-validation',
    moduleId: 'python-backend',
    phaseId: 'pb-fastapi',
    phaseNumber: 1,
    order: 3,
    title: 'Pydantic v2: Request & Response Models',
    description: 'Use Pydantic v2 models to validate request bodies, shape responses, and catch bad data at the API boundary — before it reaches your database.',
    duration: '25 min',
    difficulty: 'beginner',
    objectives: [
      'Define Pydantic v2 models for request bodies and responses',
      'Apply field-level validation with Field() and custom validators',
      'Use separate schemas for Create, Update, and Response to avoid leaking data',
      'Understand the model_config options for alias, extra fields, and serialization',
    ],
    content: [
      {
        type: 'text',
        markdown: `## Why Pydantic?

Without validation, a user can send anything as the request body and your code will break in unpredictable ways. Pydantic fixes this: it validates incoming data and raises a clear 422 Unprocessable Entity error with field-level details if something is wrong.

\`\`\`json
{
  "detail": [
    {"loc": ["body", "email"], "msg": "value is not a valid email address", "type": "value_error"},
    {"loc": ["body", "age"], "msg": "Input should be greater than 0", "type": "greater_than"}
  ]
}
\`\`\`

You get this for free — no manual validation code.`,
      },
      {
        type: 'code',
        language: 'python',
        filename: 'schemas/user.py',
        code: `from pydantic import BaseModel, EmailStr, Field, field_validator, computed_field
from datetime import datetime
from typing import Annotated

# Install: uv add pydantic[email]

# ── Request schema: what the client sends when creating a user ──
class UserCreate(BaseModel):
    name: Annotated[str, Field(min_length=2, max_length=100)]
    email: EmailStr                    # validated email format
    age: Annotated[int, Field(gt=0, lt=130)]
    role: str = "member"              # default value

    # Custom validator
    @field_validator("name")
    @classmethod
    def name_must_not_be_blank(cls, v: str) -> str:
        if v.strip() == "":
            raise ValueError("Name cannot be blank or whitespace")
        return v.strip()              # clean the value while we're here


# ── Update schema: all fields optional for PATCH ──
class UserUpdate(BaseModel):
    name: Annotated[str, Field(min_length=2, max_length=100)] | None = None
    email: EmailStr | None = None
    age: Annotated[int, Field(gt=0, lt=130)] | None = None


# ── Response schema: what the API returns ──
class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    role: str
    created_at: datetime

    # Computed field: derived, not stored
    @computed_field
    @property
    def display_name(self) -> str:
        return f"{self.name} ({self.role})"

    # Never expose password_hash, internal flags, etc. in this model
    model_config = {"from_attributes": True}  # allows ORM model → schema`,
        explanation: 'Use separate schemas for create, update, and response. This prevents accidentally exposing internal fields (like password_hash) and makes each operation explicit.',
      },
      {
        type: 'code',
        language: 'python',
        filename: 'routers/users.py',
        code: `from fastapi import APIRouter, HTTPException, status
from app.schemas.user import UserCreate, UserUpdate, UserResponse
from datetime import datetime

router = APIRouter(prefix="/users", tags=["users"])

_db: dict[int, dict] = {}
_next_id = 1


@router.post(
    "/",
    response_model=UserResponse,       # ← FastAPI filters the response through this schema
    status_code=status.HTTP_201_CREATED,
)
def create_user(body: UserCreate):    # ← FastAPI validates the request body
    global _next_id
    user = {
        "id": _next_id,
        **body.model_dump(),           # convert Pydantic model → dict
        "created_at": datetime.now(),
    }
    _db[_next_id] = user
    _next_id += 1
    return user


@router.patch("/{user_id}", response_model=UserResponse)
def update_user(user_id: int, body: UserUpdate):
    user = _db.get(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Only update fields that were actually provided
    updates = body.model_dump(exclude_unset=True)   # ← exclude_unset is critical for PATCH
    user.update(updates)
    return user`,
        explanation: 'exclude_unset=True is essential for PATCH — it only includes fields the client actually sent, not all defaults. Without this, a PATCH with {"name": "Alice"} would also set email and age to None.',
      },
      {
        type: 'callout',
        tone: 'important',
        title: 'model_dump() vs model_dump(exclude_unset=True)',
        content: 'For POST/PUT, use model_dump() to get all fields with defaults applied. For PATCH, always use model_dump(exclude_unset=True) — otherwise unset optional fields overwrite existing data with None.',
      },
      {
        type: 'text',
        markdown: `## Nested Models & Lists

Real-world schemas often have nested objects and arrays:`,
      },
      {
        type: 'code',
        language: 'python',
        filename: 'schemas/order.py',
        code: `from pydantic import BaseModel, Field
from typing import Annotated

class Address(BaseModel):
    street: str
    city: str
    country: str = "US"
    postal_code: Annotated[str, Field(pattern=r"^\d{5}$")]   # regex validation


class OrderItem(BaseModel):
    product_id: int
    quantity: Annotated[int, Field(gt=0)]
    unit_price: Annotated[float, Field(gt=0)]

    @property
    def subtotal(self) -> float:
        return self.quantity * self.unit_price


class OrderCreate(BaseModel):
    items: Annotated[list[OrderItem], Field(min_length=1)]   # at least 1 item
    shipping_address: Address
    notes: str | None = None


# Example valid request body:
# {
#   "items": [{"product_id": 1, "quantity": 2, "unit_price": 29.99}],
#   "shipping_address": {"street": "123 Main St", "city": "Austin", "postal_code": "78701"}
# }`,
      },
      {
        type: 'callout',
        tone: 'tip',
        title: 'model_config for API Design',
        content: `Use model_config to control behavior:
- \`str_strip_whitespace = True\` — automatically strip spaces from all strings
- \`extra = "forbid"\` — reject unknown fields (useful for strict APIs)
- \`populate_by_name = True\` — allow both alias and original field name
- \`from_attributes = True\` — allow creating from ORM objects`,
      },
      {
        type: 'exercise',
        title: 'Product Catalog Schema',
        description: 'Design schemas for a product catalog API. Create: ProductCreate (name, description, price > 0, stock >= 0, category from enum: electronics/clothing/food), ProductUpdate (all optional), ProductResponse (all fields + a discounted_price computed field that shows price × 0.9). Then create a POST /products endpoint using these schemas.',
        language: 'python',
        starterCode: `from pydantic import BaseModel, Field, computed_field
from fastapi import APIRouter, status
from enum import Enum
from typing import Annotated
from datetime import datetime

router = APIRouter(prefix="/products", tags=["products"])

class Category(str, Enum):
    electronics = "electronics"
    clothing = "clothing"
    food = "food"

# TODO: Define ProductCreate
# TODO: Define ProductUpdate
# TODO: Define ProductResponse with discounted_price computed field

_db: dict[int, dict] = {}
_next_id = 1

# TODO: POST /products endpoint`,
        solution: `from pydantic import BaseModel, Field, computed_field
from fastapi import APIRouter, status
from enum import Enum
from typing import Annotated
from datetime import datetime

router = APIRouter(prefix="/products", tags=["products"])

class Category(str, Enum):
    electronics = "electronics"
    clothing = "clothing"
    food = "food"


class ProductCreate(BaseModel):
    name: Annotated[str, Field(min_length=1, max_length=200)]
    description: str | None = None
    price: Annotated[float, Field(gt=0)]
    stock: Annotated[int, Field(ge=0)]
    category: Category

    model_config = {"str_strip_whitespace": True}


class ProductUpdate(BaseModel):
    name: Annotated[str, Field(min_length=1, max_length=200)] | None = None
    description: str | None = None
    price: Annotated[float, Field(gt=0)] | None = None
    stock: Annotated[int, Field(ge=0)] | None = None
    category: Category | None = None


class ProductResponse(BaseModel):
    id: int
    name: str
    description: str | None
    price: float
    stock: int
    category: str
    created_at: datetime

    @computed_field
    @property
    def discounted_price(self) -> float:
        return round(self.price * 0.9, 2)

    model_config = {"from_attributes": True}


_db: dict[int, dict] = {}
_next_id = 1


@router.post("/", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
def create_product(body: ProductCreate):
    global _next_id
    product = {"id": _next_id, **body.model_dump(), "created_at": datetime.now()}
    _db[_next_id] = product
    _next_id += 1
    return product`,
        hints: [
          'Annotated[float, Field(gt=0)] means "float that is greater than 0"',
          'computed_field with @property creates a field derived from other fields',
          'Use round() to avoid floating point precision issues in the discount',
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // LESSON 4: JWT Authentication
  // ─────────────────────────────────────────────────────────────
  {
    id: 'pb-fastapi-auth',
    moduleId: 'python-backend',
    phaseId: 'pb-fastapi',
    phaseNumber: 1,
    order: 4,
    title: 'JWT Authentication & Protected Routes',
    description: 'Implement a complete JWT authentication system: password hashing, token creation and verification, OAuth2 flow, and dependency-injected route protection.',
    duration: '30 min',
    difficulty: 'intermediate',
    objectives: [
      'Hash and verify passwords securely with bcrypt',
      'Create and decode JWT access tokens',
      'Implement the OAuth2 password flow that Swagger UI understands',
      'Protect routes using FastAPI dependency injection',
    ],
    content: [
      {
        type: 'text',
        markdown: `## The JWT Auth Flow

Here is the exact flow used in production APIs:

\`\`\`
1. User sends POST /auth/login with { email, password }
2. API looks up user, verifies password hash with bcrypt
3. API creates a JWT signed with a secret key → returns access_token
4. Client stores token and sends it as: Authorization: Bearer <token>
5. Protected routes decode the token → extract user info → allow or deny
\`\`\`

JWT = JSON Web Token. It is a self-contained token with three parts:
- **Header**: algorithm (HS256)
- **Payload**: claims (user_id, role, expiry)
- **Signature**: HMAC of header + payload using the secret

**Important**: JWTs are signed, not encrypted. Anyone can read the payload — never put passwords or sensitive data in a JWT.`,
      },
      {
        type: 'code',
        language: 'bash',
        filename: 'terminal',
        code: `uv add python-jose[cryptography] passlib[bcrypt] python-multipart

# python-jose  → JWT creation and validation
# passlib      → password hashing (bcrypt is the standard)
# python-multipart → needed for OAuth2 form data (Swagger UI login)`,
      },
      {
        type: 'code',
        language: 'python',
        filename: 'core/security.py',
        code: `from datetime import datetime, timedelta, timezone
from jose import JWTError, jwt
from passlib.context import CryptContext

# Secret key — in production, load from environment variable
# Generate a good one: python -c "import secrets; print(secrets.token_hex(32))"
SECRET_KEY = "your-secret-key-change-in-production"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Password hashing context — bcrypt is the industry standard
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(plain: str) -> str:
    """Hash a plain password for storage."""
    return pwd_context.hash(plain)


def verify_password(plain: str, hashed: str) -> bool:
    """Verify a plain password against a stored hash."""
    return pwd_context.verify(plain, hashed)


def create_access_token(data: dict, expires_in: int = ACCESS_TOKEN_EXPIRE_MINUTES) -> str:
    """Create a signed JWT token."""
    payload = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=expires_in)
    payload.update({"exp": expire})
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def decode_token(token: str) -> dict:
    """Decode and validate a JWT. Raises JWTError if invalid or expired."""
    return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])`,
        explanation: 'Always use timezone-aware datetimes (timezone.utc) for JWT expiry. Naive datetimes cause subtle bugs across different server timezones.',
      },
      {
        type: 'code',
        language: 'python',
        filename: 'dependencies.py',
        code: `from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError
from app.core.security import decode_token

# This tells FastAPI: "the token comes from POST /auth/token"
# It also wires up the "Authorize" button in Swagger UI
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token")


async def get_current_user(token: str = Depends(oauth2_scheme)) -> dict:
    """Dependency: decode the JWT and return the user payload.
    
    Inject with: current_user: dict = Depends(get_current_user)
    FastAPI will call this before the route handler runs.
    """
    credentials_error = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = decode_token(token)
        user_id: int = payload.get("sub")
        if user_id is None:
            raise credentials_error
        return {"user_id": user_id, "role": payload.get("role", "member")}
    except JWTError:
        raise credentials_error


async def require_admin(current_user: dict = Depends(get_current_user)) -> dict:
    """Dependency: require the user to have the admin role."""
    if current_user["role"] != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin only")
    return current_user`,
        explanation: 'Dependency injection chains: require_admin depends on get_current_user, which depends on oauth2_scheme. FastAPI resolves this automatically.',
      },
      {
        type: 'code',
        language: 'python',
        filename: 'routers/auth.py',
        code: `from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel, EmailStr
from app.core.security import hash_password, verify_password, create_access_token
from app.dependencies import get_current_user

router = APIRouter(prefix="/auth", tags=["auth"])

# Simulated user store — in real code this is a database table
_users_db: dict[str, dict] = {
    "alice@example.com": {
        "id": 1,
        "name": "Alice",
        "email": "alice@example.com",
        "password_hash": hash_password("secret123"),
        "role": "admin",
    }
}


class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


@router.post("/register", status_code=status.HTTP_201_CREATED)
def register(body: RegisterRequest):
    if body.email in _users_db:
        raise HTTPException(status_code=400, detail="Email already registered")
    user = {
        "id": len(_users_db) + 1,
        "name": body.name,
        "email": body.email,
        "password_hash": hash_password(body.password),
        "role": "member",
    }
    _users_db[body.email] = user
    return {"message": "Account created", "user_id": user["id"]}


# OAuth2PasswordRequestForm is required for Swagger UI login support
@router.post("/token", response_model=TokenResponse)
def login(form: OAuth2PasswordRequestForm = Depends()):
    user = _users_db.get(form.username)  # form.username = the email field
    if not user or not verify_password(form.password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
    token = create_access_token({"sub": user["id"], "role": user["role"]})
    return {"access_token": token, "token_type": "bearer"}


@router.get("/me")
def get_me(current_user: dict = Depends(get_current_user)):
    return current_user`,
      },
      {
        type: 'callout',
        tone: 'production',
        title: 'Production Auth Checklist',
        content: `Before shipping auth to production:
- SECRET_KEY loaded from environment variable (never hardcoded)
- Access tokens expire in 15–60 minutes
- Add refresh tokens for seamless re-authentication  
- Rate-limit the /auth/token endpoint (prevent brute-force)
- Hash passwords only with bcrypt/argon2 — never MD5/SHA1
- Return generic errors ("Incorrect email or password", not "Email not found")`,
      },
      {
        type: 'exercise',
        title: 'Add Role-Based Route Protection',
        description: 'Using the auth system above: (1) create a GET /admin/stats route that returns {"total_users": N, "message": "admin only"} — only admins can access it; (2) create a GET /profile route that returns the current user\'s full profile based on their user_id from the token; (3) verify in Swagger UI that /admin/stats returns 403 for non-admin tokens.',
        language: 'python',
        starterCode: `from fastapi import APIRouter, Depends
from app.dependencies import get_current_user, require_admin

router = APIRouter(tags=["protected"])

# Simulated DB for this exercise
USERS = {
    1: {"id": 1, "name": "Alice", "email": "alice@example.com", "role": "admin"},
    2: {"id": 2, "name": "Bob", "email": "bob@example.com", "role": "member"},
}

# TODO: GET /admin/stats — admin only
# TODO: GET /profile — any authenticated user, return their profile`,
        solution: `from fastapi import APIRouter, Depends, HTTPException
from app.dependencies import get_current_user, require_admin

router = APIRouter(tags=["protected"])

USERS = {
    1: {"id": 1, "name": "Alice", "email": "alice@example.com", "role": "admin"},
    2: {"id": 2, "name": "Bob", "email": "bob@example.com", "role": "member"},
}


@router.get("/admin/stats")
def admin_stats(current_user: dict = Depends(require_admin)):
    return {"total_users": len(USERS), "message": "admin only", "requested_by": current_user["user_id"]}


@router.get("/profile")
def get_profile(current_user: dict = Depends(get_current_user)):
    user = USERS.get(current_user["user_id"])
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user`,
        hints: [
          'Use Depends(require_admin) for admin routes and Depends(get_current_user) for authenticated routes',
          'The current_user dict contains user_id and role from the JWT payload',
          'require_admin already calls get_current_user — no need to double-inject',
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // LESSON 5: Async Patterns & Background Tasks
  // ─────────────────────────────────────────────────────────────
  {
    id: 'pb-fastapi-async',
    moduleId: 'python-backend',
    phaseId: 'pb-fastapi',
    phaseNumber: 1,
    order: 5,
    title: 'Async Patterns & Background Tasks',
    description: 'Understand when and how to use async in FastAPI, make non-blocking HTTP calls with httpx, and run work in the background without blocking the response.',
    duration: '22 min',
    difficulty: 'intermediate',
    objectives: [
      'Know when to use async def vs def in FastAPI route handlers',
      'Make async HTTP requests with httpx',
      'Run background tasks after returning a response',
      'Manage startup and shutdown logic with lifespan',
    ],
    content: [
      {
        type: 'text',
        markdown: `## async def vs def: The Rule

FastAPI handles both sync and async route handlers, but choosing wrong hurts performance:

| Your route does... | Use |
|--------------------|-----|
| Database queries (async driver) | \`async def\` |
| HTTP calls to external APIs | \`async def\` |
| CPU-heavy computation (ML inference, image processing) | \`def\` (FastAPI runs it in a thread pool) |
| Blocking file I/O | \`def\` or use \`asyncio.to_thread()\` |
| Blocking third-party library | \`def\` |

The key insight: \`async def\` routes run on the event loop thread. If you call a **blocking** operation inside \`async def\`, you block every other request. FastAPI runs \`def\` routes in a thread pool executor, so blocking there only blocks that one thread.`,
      },
      {
        type: 'code',
        language: 'python',
        filename: 'routers/weather.py',
        code: `import httpx
from fastapi import APIRouter, HTTPException

router = APIRouter(prefix="/weather", tags=["weather"])

# httpx is the async-first HTTP client for Python
# uv add httpx

@router.get("/{city}")
async def get_weather(city: str):
    async with httpx.AsyncClient(timeout=10.0) as client:
        try:
            # Using a free weather API (wttr.in) — no key required
            response = await client.get(
                f"https://wttr.in/{city}",
                params={"format": "j1"},  # JSON format
            )
            response.raise_for_status()
            data = response.json()

            current = data["current_condition"][0]
            return {
                "city": city,
                "temperature_c": int(current["temp_C"]),
                "description": current["weatherDesc"][0]["value"],
                "humidity": int(current["humidity"]),
            }
        except httpx.TimeoutException:
            raise HTTPException(status_code=504, detail="Weather service timed out")
        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=502, detail=f"Weather service error: {e.response.status_code}")`,
        explanation: 'Always set a timeout on HTTP clients. Without it, a slow external service hangs your route handler forever. Use async with to properly close the connection.',
      },
      {
        type: 'callout',
        tone: 'tip',
        title: 'Reuse the HTTP Client',
        content: 'Creating an httpx.AsyncClient on every request is wasteful. In production, create one client at startup and reuse it. The lifespan pattern below shows how.',
      },
      {
        type: 'code',
        language: 'python',
        filename: 'main.py',
        code: `from contextlib import asynccontextmanager
from fastapi import FastAPI
import httpx

# Shared state — accessible across the app
http_client: httpx.AsyncClient | None = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Run code on startup and shutdown.
    
    Code before 'yield' runs at startup.
    Code after 'yield' runs at shutdown.
    """
    global http_client
    # Startup: create reusable resources
    http_client = httpx.AsyncClient(timeout=10.0)
    print("HTTP client ready")

    yield   # ← application runs here

    # Shutdown: clean up resources
    await http_client.aclose()
    print("HTTP client closed")


app = FastAPI(lifespan=lifespan)


# Access the shared client in routes
@app.get("/external")
async def call_external():
    # Use the shared client instead of creating a new one
    response = await http_client.get("https://api.example.com/data")
    return response.json()`,
        explanation: 'The lifespan pattern replaces the deprecated @app.on_event("startup") decorators. Use it for database connections, HTTP clients, ML models — anything expensive to create.',
      },
      {
        type: 'code',
        language: 'python',
        filename: 'routers/notifications.py',
        code: `import asyncio
from fastapi import APIRouter, BackgroundTasks
from pydantic import BaseModel, EmailStr

router = APIRouter(prefix="/notifications", tags=["notifications"])


# ── Simple background task: runs after the response is sent ──

def send_welcome_email(email: str, name: str):
    """Runs in background — simulates sending email."""
    # In production: use SendGrid, Resend, or SES
    import time
    time.sleep(2)  # simulate email sending delay
    print(f"Email sent to {email}: Welcome, {name}!")


class SignupRequest(BaseModel):
    name: str
    email: EmailStr


@router.post("/signup")
def signup(body: SignupRequest, background_tasks: BackgroundTasks):
    # Response is returned immediately
    # Email is sent after — user does not wait for it
    background_tasks.add_task(send_welcome_email, body.email, body.name)
    return {"message": "Account created! Check your email.", "user": body.name}


# ── Async background task ──

async def notify_team(message: str):
    """Async background task — uses await internally."""
    await asyncio.sleep(1)  # simulate async operation
    print(f"Team notified: {message}")


@router.post("/alert")
async def send_alert(message: str, background_tasks: BackgroundTasks):
    background_tasks.add_task(notify_team, message)
    return {"status": "Alert queued"}`,
        explanation: 'BackgroundTasks run in the same process after the response is sent. They are great for simple tasks like sending emails or logging. For heavy/durable jobs, use Celery (covered later).',
      },
      {
        type: 'callout',
        tone: 'warning',
        title: 'Background Tasks Limitations',
        content: 'FastAPI BackgroundTasks are not durable. If the server crashes mid-task, the task is lost. For tasks that must complete (payment processing, order fulfillment), use a proper task queue like Celery with Redis, covered in the Production phase.',
      },
      {
        type: 'exercise',
        title: 'Async Data Aggregator',
        description: 'Build a GET /summary endpoint that concurrently fetches data from two endpoints using asyncio.gather(): (1) GET https://jsonplaceholder.typicode.com/todos?_limit=5 and (2) GET https://jsonplaceholder.typicode.com/users?_limit=3. Return a combined response with both results. After returning, add a background task that logs "Summary fetched: {todo_count} todos, {user_count} users" to console.',
        language: 'python',
        starterCode: `import asyncio
import httpx
from fastapi import APIRouter, BackgroundTasks

router = APIRouter(tags=["aggregator"])

def log_summary(todo_count: int, user_count: int):
    # TODO: print the log message
    pass

@router.get("/summary")
async def get_summary(background_tasks: BackgroundTasks):
    async with httpx.AsyncClient(timeout=10.0) as client:
        # TODO: fetch todos and users concurrently with asyncio.gather
        # TODO: add background task
        # TODO: return combined response
        pass`,
        solution: `import asyncio
import httpx
from fastapi import APIRouter, BackgroundTasks

router = APIRouter(tags=["aggregator"])


def log_summary(todo_count: int, user_count: int):
    print(f"Summary fetched: {todo_count} todos, {user_count} users")


@router.get("/summary")
async def get_summary(background_tasks: BackgroundTasks):
    async with httpx.AsyncClient(timeout=10.0) as client:
        todos_resp, users_resp = await asyncio.gather(
            client.get("https://jsonplaceholder.typicode.com/todos", params={"_limit": 5}),
            client.get("https://jsonplaceholder.typicode.com/users", params={"_limit": 3}),
        )
        todos = todos_resp.json()
        users = users_resp.json()

    background_tasks.add_task(log_summary, len(todos), len(users))

    return {
        "todos": todos,
        "users": users,
        "counts": {"todos": len(todos), "users": len(users)},
    }`,
        hints: [
          'asyncio.gather() takes multiple coroutines and runs them concurrently, returning a tuple of results',
          'Unpack the tuple: result1, result2 = await asyncio.gather(coro1, coro2)',
          'Close the async client BEFORE adding the background task (exit the async with block first)',
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // LESSON 6: Middleware, CORS & Error Handling
  // ─────────────────────────────────────────────────────────────
  {
    id: 'pb-fastapi-middleware',
    moduleId: 'python-backend',
    phaseId: 'pb-fastapi',
    phaseNumber: 1,
    order: 6,
    title: 'Middleware, CORS & Error Handling',
    description: 'Add cross-cutting concerns to your API: CORS for browser clients, request timing, unique request IDs, and global exception handlers for clean error responses.',
    duration: '20 min',
    difficulty: 'intermediate',
    objectives: [
      'Configure CORS correctly for frontend-backend communication',
      'Write custom middleware for request logging and timing',
      'Add request IDs for distributed tracing',
      'Create global exception handlers that return structured error responses',
    ],
    content: [
      {
        type: 'text',
        markdown: `## What is Middleware?

Middleware is a function that wraps every request and response. It runs before the route handler (to inspect/modify the request) and after (to inspect/modify the response).

\`\`\`
Request → [Middleware 1] → [Middleware 2] → [Route Handler]
Response ← [Middleware 1] ← [Middleware 2] ← [Route Handler]
\`\`\`

Common uses: CORS, authentication, rate limiting, request logging, timing, compression, request ID injection.`,
      },
      {
        type: 'code',
        language: 'python',
        filename: 'main.py',
        code: `import time
import uuid
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware

app = FastAPI()


# ── 1. CORS — always configure this explicitly ──

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",     # local dev (Next.js)
        "https://myapp.vercel.app",  # production frontend
    ],
    allow_credentials=True,          # needed if using cookies
    allow_methods=["*"],             # GET, POST, PUT, PATCH, DELETE, OPTIONS
    allow_headers=["*"],             # Authorization, Content-Type, etc.
)


# ── 2. Request ID middleware ──

class RequestIDMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        request_id = str(uuid.uuid4())
        # Attach to request state for use in route handlers
        request.state.request_id = request_id
        response: Response = await call_next(request)
        # Add to response headers so clients can reference it in support tickets
        response.headers["X-Request-ID"] = request_id
        return response


# ── 3. Request timing middleware ──

class TimingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        start = time.perf_counter()
        response: Response = await call_next(request)
        elapsed_ms = (time.perf_counter() - start) * 1000
        response.headers["X-Response-Time"] = f"{elapsed_ms:.2f}ms"
        # Log slow requests
        if elapsed_ms > 1000:
            print(f"SLOW REQUEST: {request.method} {request.url.path} took {elapsed_ms:.0f}ms")
        return response


app.add_middleware(RequestIDMiddleware)
app.add_middleware(TimingMiddleware)`,
        explanation: 'Middleware order matters: middleware added last runs first. So TimingMiddleware wraps RequestIDMiddleware, meaning timing includes the time to generate a request ID.',
      },
      {
        type: 'code',
        language: 'python',
        filename: 'core/exceptions.py',
        code: `from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from pydantic import ValidationError


def register_exception_handlers(app: FastAPI) -> None:
    """Register all global exception handlers on the app."""

    @app.exception_handler(HTTPException)
    async def http_exception_handler(request: Request, exc: HTTPException) -> JSONResponse:
        """Override the default HTTPException format to be consistent."""
        return JSONResponse(
            status_code=exc.status_code,
            content={
                "error": {
                    "code": exc.status_code,
                    "message": exc.detail,
                    "path": str(request.url.path),
                    "request_id": getattr(request.state, "request_id", None),
                }
            },
        )

    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
        """Format Pydantic validation errors as structured field errors."""
        field_errors = []
        for error in exc.errors():
            field_errors.append({
                "field": ".".join(str(loc) for loc in error["loc"] if loc != "body"),
                "message": error["msg"],
                "type": error["type"],
            })
        return JSONResponse(
            status_code=422,
            content={
                "error": {
                    "code": 422,
                    "message": "Validation failed",
                    "fields": field_errors,
                    "request_id": getattr(request.state, "request_id", None),
                }
            },
        )

    @app.exception_handler(Exception)
    async def unhandled_exception_handler(request: Request, exc: Exception) -> JSONResponse:
        """Catch-all for unexpected errors — never expose internal details."""
        # Log the full traceback here (to your logging system)
        import traceback
        traceback.print_exc()
        return JSONResponse(
            status_code=500,
            content={
                "error": {
                    "code": 500,
                    "message": "An internal error occurred. Please try again.",
                    "request_id": getattr(request.state, "request_id", None),
                }
            },
        )`,
        explanation: 'Always have a catch-all handler. Without it, unhandled exceptions return a 500 with a raw Python traceback — which leaks internal implementation details to clients.',
      },
      {
        type: 'code',
        language: 'python',
        filename: 'main.py (complete)',
        code: `from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.exceptions import register_exception_handlers
from app.middleware import RequestIDMiddleware, TimingMiddleware
from app.routers import users, products, auth

app = FastAPI(
    title="Production API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Middleware (runs in reverse order of registration)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://myapp.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(RequestIDMiddleware)
app.add_middleware(TimingMiddleware)

# Exception handlers
register_exception_handlers(app)

# Routers
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(products.router)


@app.get("/health", tags=["system"])
def health():
    return {"status": "ok", "version": "1.0.0"}`,
      },
      {
        type: 'callout',
        tone: 'production',
        title: 'CORS in Production',
        content: 'Never use allow_origins=["*"] with allow_credentials=True — browsers will reject it. Always list explicit origins in production. Use environment variables to configure them: ALLOWED_ORIGINS="https://app.com,https://admin.app.com".',
      },
      {
        type: 'exercise',
        title: 'Build a Rate Limiting Middleware',
        description: 'Create a simple IP-based rate limiter middleware. Track requests per IP in a dict with a sliding window. Allow 10 requests per minute per IP. If exceeded, return 429 Too Many Requests with a Retry-After header showing seconds until the window resets. Test it by calling an endpoint rapidly.',
        language: 'python',
        starterCode: `from starlette.middleware.base import BaseHTTPMiddleware
from fastapi import Request, Response
from fastapi.responses import JSONResponse
from collections import defaultdict
from datetime import datetime, timedelta

class RateLimitMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, max_requests: int = 10, window_seconds: int = 60):
        super().__init__(app)
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        # {ip: [timestamp1, timestamp2, ...]}
        self._requests: dict[str, list[datetime]] = defaultdict(list)

    async def dispatch(self, request: Request, call_next) -> Response:
        # TODO: get client IP
        # TODO: remove timestamps outside the window
        # TODO: check if limit exceeded → return 429
        # TODO: record this request timestamp
        # TODO: call next and return
        pass`,
        solution: `from starlette.middleware.base import BaseHTTPMiddleware
from fastapi import Request, Response
from fastapi.responses import JSONResponse
from collections import defaultdict
from datetime import datetime, timedelta, timezone

class RateLimitMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, max_requests: int = 10, window_seconds: int = 60):
        super().__init__(app)
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self._requests: dict[str, list[datetime]] = defaultdict(list)

    async def dispatch(self, request: Request, call_next) -> Response:
        ip = request.client.host
        now = datetime.now(timezone.utc)
        window_start = now - timedelta(seconds=self.window_seconds)

        # Remove expired timestamps
        self._requests[ip] = [t for t in self._requests[ip] if t > window_start]

        if len(self._requests[ip]) >= self.max_requests:
            oldest = self._requests[ip][0]
            retry_after = int((oldest + timedelta(seconds=self.window_seconds) - now).total_seconds())
            return JSONResponse(
                status_code=429,
                content={"error": {"code": 429, "message": "Rate limit exceeded"}},
                headers={"Retry-After": str(retry_after)},
            )

        self._requests[ip].append(now)
        return await call_next(request)`,
        hints: [
          'request.client.host gives you the client IP address',
          'Use a list of datetime objects per IP to implement a sliding window',
          'Filter out timestamps older than window_start to keep only recent requests',
          'Retry-After header should be the seconds until the oldest request exits the window',
        ],
      },
    ],
  },
]
