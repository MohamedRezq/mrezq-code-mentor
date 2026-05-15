import type { Lesson } from '@/types/lesson'

export const djangoLessons: Lesson[] = [
  // ─── Lesson 1: Django Intro & Project Structure ──────────────────────────
  {
    id: 'dj-intro',
    moduleId: 'python-backend',
    phaseId: 'py-django',
    phaseNumber: 4,
    order: 1,
    title: 'Django: Project Structure & the MTV Pattern',
    description: 'Understand what makes Django a "batteries-included" framework, set up your first project, and navigate the MTV (Model-Template-View) architecture that drives every Django application.',
    duration: '45 min',
    difficulty: 'intermediate',
    objectives: [
      'Install Django and create a project with the correct structure',
      'Understand the MTV pattern and how it differs from MVC',
      'Configure settings for development and production',
      'Run the development server and understand the request lifecycle',
      'Create your first Django app and wire it to the project',
    ],
    content: [
      {
        type: 'text',
        markdown: `## Why Django?

FastAPI is great for APIs. Django is great for **full applications** — it ships with an ORM, admin panel, auth system, form handling, templating, migrations, and security middleware out of the box. You get all of that without installing anything extra.

**Django's MTV pattern:**
- **Model** — defines data structure, maps to database tables
- **Template** — HTML presentation layer (or JSON for APIs)
- **View** — business logic that connects models to templates

The URL router maps incoming requests to the right view.`,
      },
      {
        type: 'callout',
        tone: 'clarification',
        title: 'MTV vs MVC naming',
        content:
          'Django’s **View** is roughly what other frameworks call a **Controller** — it decides what data to fetch and which template/response to build. **Templates** are the view layer in MVC terms. The names differ; the flow (URL → logic → presentation) is the same idea.',
      },
      {
        type: 'callout',
        tone: 'clarification',
        title: '`startproject` trailing dot',
        content:
          '`django-admin startproject name .` puts `manage.py` and the inner package in the **current** directory. Without the dot, Django creates an extra nested folder. Most teams use the dot so the repo root stays clean.',
      },
      {
        type: 'code',
        language: 'bash',
        filename: 'setup.sh',
        code: `# Install Django (latest stable)
pip install django

# Create a project (note the trailing dot — creates in current dir)
django-admin startproject seniorpath .

# Project structure created:
# manage.py              ← CLI entry point for everything
# seniorpath/
#   __init__.py
#   settings.py          ← all project configuration
#   urls.py              ← root URL router
#   asgi.py              ← async server entry point
#   wsgi.py              ← sync server entry point

# Create your first app (apps are reusable modules)
python manage.py startapp courses

# App structure:
# courses/
#   migrations/          ← auto-generated database migrations
#   admin.py             ← register models in admin
#   apps.py              ← app configuration
#   models.py            ← database models
#   tests.py             ← tests
#   views.py             ← request handlers
#   urls.py              ← app-level URL patterns (create this)

# Run development server
python manage.py runserver          # http://127.0.0.1:8000
python manage.py runserver 0.0.0.0:8080   # custom host/port`,
      },
      {
        type: 'code',
        language: 'python',
        filename: 'seniorpath/settings.py',
        code: `"""
Key settings to understand. Full file has many more defaults.
"""
import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

# NEVER commit a real SECRET_KEY — read from environment in production
SECRET_KEY = os.environ.get("DJANGO_SECRET_KEY", "dev-only-insecure-key")

# False in production — disables debug pages with stack traces
DEBUG = os.environ.get("DEBUG", "True") == "True"

# Hosts allowed to serve this app (required when DEBUG=False)
ALLOWED_HOSTS = os.environ.get("ALLOWED_HOSTS", "localhost 127.0.0.1").split()

# Apps installed in this project
INSTALLED_APPS = [
    "django.contrib.admin",       # admin panel
    "django.contrib.auth",        # user authentication
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    # Your apps:
    "courses",                    # ← add your app here
]

# Database — defaults to SQLite (good for dev)
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": os.environ.get("DB_NAME", "seniorpath"),
        "USER": os.environ.get("DB_USER", "postgres"),
        "PASSWORD": os.environ.get("DB_PASSWORD", ""),
        "HOST": os.environ.get("DB_HOST", "localhost"),
        "PORT": os.environ.get("DB_PORT", "5432"),
    }
}

# Static files (CSS, JS, images)
STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"

# Media files (user uploads)
MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"

# Default primary key type for models
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"`,
      },
      {
        type: 'code',
        language: 'python',
        filename: 'courses/views.py',
        code: `from django.shortcuts import render, get_object_or_404
from django.http import HttpRequest, HttpResponse, JsonResponse

# Function-based view — simple and explicit
def home(request: HttpRequest) -> HttpResponse:
    context = {
        "title": "SeniorPath Courses",
        "featured_courses": ["Python", "Django", "FastAPI"],
    }
    return render(request, "courses/home.html", context)

# Returns JSON
def api_status(request: HttpRequest) -> JsonResponse:
    return JsonResponse({"status": "ok", "version": "1.0"})`,
      },
      {
        type: 'code',
        language: 'python',
        filename: 'seniorpath/urls.py (root)',
        code: `from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", include("courses.urls")),    # delegate to app URLs
    path("api/", include("courses.api_urls")),
]`,
      },
      {
        type: 'code',
        language: 'python',
        filename: 'courses/urls.py',
        code: `from django.urls import path
from . import views

app_name = "courses"   # namespace — use as "courses:home"

urlpatterns = [
    path("", views.home, name="home"),
    path("status/", views.api_status, name="api-status"),
]`,
      },
      {
        type: 'callout',
        tone: 'production',
        title: 'One Project, Many Apps',
        content: 'Django apps are meant to be self-contained and reusable. A "courses" app handles courses, an "auth" app handles users, a "payments" app handles billing. Each app has its own models, views, URLs, and tests. This keeps codebases navigable as they grow to tens of thousands of lines.',
      },
      {
        type: 'exercise',
        title: 'First Django Project',
        description: 'Create a Django project called `blog` with one app called `posts`. Wire up a view at `/` that returns JSON `{"posts": [], "count": 0}` and a view at `/health/` that returns `{"status": "healthy"}`. No database needed yet.',
        language: 'python',
        starterCode: `# posts/views.py
from django.http import JsonResponse

def post_list(request):
    pass

def health(request):
    pass

# posts/urls.py
from django.urls import path
from . import views

urlpatterns = [
    # wire up the views
]`,
        solution: `# posts/views.py
from django.http import JsonResponse

def post_list(request):
    return JsonResponse({"posts": [], "count": 0})

def health(request):
    return JsonResponse({"status": "healthy"})

# posts/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path("", views.post_list, name="post-list"),
    path("health/", views.health, name="health"),
]

# blog/urls.py
from django.urls import path, include
urlpatterns = [
    path("", include("posts.urls")),
]`,
        hints: ['JsonResponse automatically sets Content-Type: application/json', 'Include the app URLs in the project urls.py with include()', 'Remember to add "posts" to INSTALLED_APPS in settings.py'],
      },
    ],
  },

  // ─── Lesson 2: Django Models & ORM ──────────────────────────────────────
  {
    id: 'dj-models',
    moduleId: 'python-backend',
    phaseId: 'py-django',
    phaseNumber: 4,
    order: 2,
    title: 'Django Models & ORM',
    description: 'Define database schemas as Python classes, run migrations, and query data using Django\'s powerful ORM — without writing a line of SQL for most operations.',
    duration: '55 min',
    difficulty: 'intermediate',
    objectives: [
      'Define models with field types, constraints, and relationships',
      'Create and run database migrations',
      'Query the database using the ORM: filter, exclude, annotate, aggregate',
      'Understand ForeignKey, ManyToMany, and OneToOne relationships',
      'Use select_related and prefetch_related to avoid N+1 queries',
    ],
    content: [
      {
        type: 'callout',
        tone: 'clarification',
        title: 'Migrations are your schema contract',
        content:
          '`makemigrations` writes Python files describing how models changed; `migrate` applies those operations to the database. Never edit applied migration files in a shared repo — add a new migration instead. The ORM and DB only stay aligned if migrations are committed and run everywhere.',
      },
      {
        type: 'code',
        language: 'python',
        filename: 'courses/models.py',
        code: `from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone

User = get_user_model()   # always reference User this way, never import directly

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(unique=True)   # URL-friendly version of name

    class Meta:
        verbose_name_plural = "categories"
        ordering = ["name"]

    def __str__(self) -> str:
        return self.name

class Course(models.Model):
    class Level(models.TextChoices):
        BEGINNER     = "beginner",     "Beginner"
        INTERMEDIATE = "intermediate", "Intermediate"
        ADVANCED     = "advanced",     "Advanced"

    title       = models.CharField(max_length=200)
    slug        = models.SlugField(unique=True)
    description = models.TextField()
    level       = models.CharField(max_length=20, choices=Level.choices, default=Level.BEGINNER)
    price       = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    is_published = models.BooleanField(default=False)

    # Relationships
    category  = models.ForeignKey(Category, on_delete=models.PROTECT, related_name="courses")
    author    = models.ForeignKey(User, on_delete=models.CASCADE, related_name="courses")
    students  = models.ManyToManyField(User, through="Enrollment", related_name="enrolled_courses", blank=True)

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)   # set on creation, never updated
    updated_at = models.DateTimeField(auto_now=True)        # updated on every save

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["slug"]),
            models.Index(fields=["level", "is_published"]),
        ]

    def __str__(self) -> str:
        return self.title

class Enrollment(models.Model):
    """Through model for Course ↔ User M2M relationship."""
    user       = models.ForeignKey(User, on_delete=models.CASCADE)
    course     = models.ForeignKey(Course, on_delete=models.CASCADE)
    enrolled_at = models.DateTimeField(default=timezone.now)
    completed  = models.BooleanField(default=False)

    class Meta:
        unique_together = [["user", "course"]]   # one enrollment per user per course`,
      },
      {
        type: 'code',
        language: 'bash',
        filename: 'migrations.sh',
        code: `# After changing models.py, always run these two commands:

# 1. Create migration file (detects changes automatically)
python manage.py makemigrations

# 2. Apply migrations to the database
python manage.py migrate

# View all migrations
python manage.py showmigrations

# Preview the SQL without running it
python manage.py sqlmigrate courses 0001

# Roll back one migration
python manage.py migrate courses 0001   # back to this migration

# Start fresh (development only — destroys data!)
python manage.py migrate courses zero   # undo all courses migrations`,
      },
      {
        type: 'code',
        language: 'python',
        filename: 'orm_queries.py',
        code: `from courses.models import Course, Category, Enrollment
from django.db.models import Count, Avg, Q, F
from django.contrib.auth import get_user_model

User = get_user_model()

# ── Basic queries ────────────────────────────────────
# QuerySets are lazy — no DB hit until you evaluate them
all_courses = Course.objects.all()
published   = Course.objects.filter(is_published=True)
beginner    = Course.objects.filter(level="beginner", is_published=True)
one_course  = Course.objects.get(slug="python-basics")      # raises if missing
or_none     = Course.objects.filter(slug="x").first()       # None if missing

# ── Chaining ─────────────────────────────────────────
qs = (Course.objects
      .filter(is_published=True)
      .exclude(level="beginner")
      .order_by("-created_at")
      [:10])            # LIMIT 10

# ── Complex lookups (field__lookup) ──────────────────
Course.objects.filter(title__icontains="python")   # case-insensitive contains
Course.objects.filter(price__lte=50)               # price <= 50
Course.objects.filter(created_at__year=2024)
Course.objects.filter(category__name="Backend")    # span FK with __

# ── Q objects — OR queries ────────────────────────────
free_or_beginner = Course.objects.filter(
    Q(price=0) | Q(level="beginner")
)

# ── Aggregation ──────────────────────────────────────
from django.db.models import Count, Avg, Sum, Max
stats = Course.objects.aggregate(
    total=Count("id"),
    avg_price=Avg("price"),
)
# {"total": 42, "avg_price": 29.5}

# Count students per course (annotation — adds a column to each row)
courses_with_counts = Course.objects.annotate(
    student_count=Count("enrollments")
).order_by("-student_count")

# ── N+1 problem and fix ───────────────────────────────
# BAD — 1 query for courses + 1 per course for author (N+1)
for course in Course.objects.all():
    print(course.author.username)   # hits DB each iteration!

# GOOD — 2 queries total (JOIN)
for course in Course.objects.select_related("author", "category"):
    print(course.author.username)   # no extra DB hit

# GOOD — for M2M (prefetch in separate query, efficient)
courses = Course.objects.prefetch_related("students").all()`,
      },
      {
        type: 'callout',
        tone: 'warning',
        title: 'N+1 Queries Will Kill Your App',
        content: 'The most common Django performance issue: looping over a QuerySet and accessing a related object inside the loop causes one extra DB query per row. Always use `select_related()` for ForeignKey/OneToOne, and `prefetch_related()` for ManyToMany. Use `django-debug-toolbar` in development to spot these.',
      },
      {
        type: 'exercise',
        title: 'ORM Query Challenge',
        description: 'Write a `get_dashboard_stats()` function that returns in a single DB round-trip: total courses, total published courses, total enrolled students (unique), most popular category (by course count), and the top 3 courses by enrollment count.',
        language: 'python',
        starterCode: `from django.db.models import Count
from courses.models import Course, Category, Enrollment

def get_dashboard_stats() -> dict:
    """Return platform stats — optimise for minimum DB queries."""
    pass`,
        solution: `from django.db.models import Count
from courses.models import Course, Category, Enrollment

def get_dashboard_stats() -> dict:
    course_stats = Course.objects.aggregate(
        total=Count("id"),
        published=Count("id", filter=Q(is_published=True)),
    )

    total_students = (
        Enrollment.objects
        .values("user")
        .distinct()
        .count()
    )

    top_category = (
        Category.objects
        .annotate(course_count=Count("courses"))
        .order_by("-course_count")
        .first()
    )

    top_courses = (
        Course.objects
        .annotate(enrollment_count=Count("enrollment"))
        .order_by("-enrollment_count")
        .select_related("author", "category")
        [:3]
    )

    return {
        "total_courses": course_stats["total"],
        "published_courses": course_stats["published"],
        "total_students": total_students,
        "top_category": top_category.name if top_category else None,
        "top_courses": [
            {"title": c.title, "enrollments": c.enrollment_count}
            for c in top_courses
        ],
    }`,
        hints: ['Use aggregate() for scalar values across all rows', 'Use annotate() + order_by + [:3] for top courses', 'Count("id", filter=Q(...)) does conditional counting in one query'],
      },
    ],
  },

  // ─── Lesson 3: Django Views, URLs & Class-Based Views ───────────────────
  {
    id: 'dj-views',
    moduleId: 'python-backend',
    phaseId: 'py-django',
    phaseNumber: 4,
    order: 3,
    title: 'Views, URLs & Class-Based Views',
    description: 'Build request handlers using both function-based views and Django\'s class-based views. Handle URL parameters, forms, redirects, and understand the full request/response cycle.',
    duration: '50 min',
    difficulty: 'intermediate',
    objectives: [
      'Write function-based views handling GET, POST, and other methods',
      'Use class-based views (ListView, DetailView, CreateView) to reduce boilerplate',
      'Define URL patterns with converters, slugs, and regex',
      'Use shortcuts: render, redirect, get_object_or_404',
      'Apply mixins for login-required and permission checks',
    ],
    content: [
      {
        type: 'callout',
        tone: 'clarification',
        title: 'FBV vs CBV',
        content:
          'Function-based views are explicit and easy to test. Class-based views save boilerplate for CRUD (`ListView`, `UpdateView`) but hide flow in mixins — learn the parent `dispatch()` / `get()` order before customising. Pick FBV until patterns repeat, then refactor to CBV.',
      },
      {
        type: 'code',
        language: 'python',
        filename: 'courses/views.py',
        code: `from django.shortcuts import render, redirect, get_object_or_404
from django.http import HttpRequest, HttpResponse, JsonResponse
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_http_methods
from django.contrib import messages

from .models import Course, Enrollment

# ── Function-based views ─────────────────────────────
def course_list(request: HttpRequest) -> HttpResponse:
    level = request.GET.get("level")   # query param: ?level=beginner
    qs = Course.objects.filter(is_published=True).select_related("author", "category")
    if level:
        qs = qs.filter(level=level)
    return render(request, "courses/list.html", {"courses": qs, "level": level})

def course_detail(request: HttpRequest, slug: str) -> HttpResponse:
    course = get_object_or_404(Course, slug=slug, is_published=True)
    is_enrolled = (
        request.user.is_authenticated and
        Enrollment.objects.filter(user=request.user, course=course).exists()
    )
    return render(request, "courses/detail.html", {
        "course": course,
        "is_enrolled": is_enrolled,
    })

@login_required   # redirects to /login/ if not authenticated
@require_http_methods(["POST"])
def enroll(request: HttpRequest, slug: str) -> HttpResponse:
    course = get_object_or_404(Course, slug=slug, is_published=True)
    Enrollment.objects.get_or_create(user=request.user, course=course)
    messages.success(request, f"Enrolled in {course.title}!")
    return redirect("courses:detail", slug=slug)`,
      },
      {
        type: 'code',
        language: 'python',
        filename: 'courses/views_cbv.py',
        code: `from django.views.generic import ListView, DetailView, CreateView, UpdateView
from django.contrib.auth.mixins import LoginRequiredMixin, PermissionRequiredMixin
from django.urls import reverse_lazy

from .models import Course
from .forms import CourseForm

# ── Class-based views — less code, more convention ───
class CourseListView(ListView):
    model = Course
    template_name = "courses/list.html"
    context_object_name = "courses"     # name in template (default: object_list)
    paginate_by = 12                    # automatic pagination!

    def get_queryset(self):
        qs = Course.objects.filter(is_published=True).select_related("author")
        level = self.request.GET.get("level")
        if level:
            qs = qs.filter(level=level)
        return qs

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        ctx["levels"] = Course.Level.choices   # add extra context
        return ctx

class CourseDetailView(DetailView):
    model = Course
    template_name = "courses/detail.html"
    slug_field = "slug"
    slug_url_kwarg = "slug"

class CourseCreateView(LoginRequiredMixin, PermissionRequiredMixin, CreateView):
    model = Course
    form_class = CourseForm
    template_name = "courses/form.html"
    permission_required = "courses.add_course"
    success_url = reverse_lazy("courses:list")

    def form_valid(self, form):
        form.instance.author = self.request.user   # set author to current user
        return super().form_valid(form)`,
      },
      {
        type: 'code',
        language: 'python',
        filename: 'courses/urls.py',
        code: `from django.urls import path
from . import views
from .views_cbv import CourseListView, CourseDetailView, CourseCreateView

app_name = "courses"

urlpatterns = [
    # FBV style
    path("", views.course_list, name="list"),
    path("<slug:slug>/", views.course_detail, name="detail"),
    path("<slug:slug>/enroll/", views.enroll, name="enroll"),

    # CBV style (equivalent to above)
    # path("", CourseListView.as_view(), name="list"),
    # path("<slug:slug>/", CourseDetailView.as_view(), name="detail"),
    # path("new/", CourseCreateView.as_view(), name="create"),
]

# URL converters:
# <int:pk>      — matches integer, converts to int
# <slug:slug>   — matches slug (letters, numbers, hyphens)
# <str:name>    — matches any non-empty string (no slashes)
# <uuid:uuid>   — matches UUID
# <path:path>   — matches any string including slashes`,
      },
      {
        type: 'exercise',
        title: 'Search View',
        description: 'Write a `search(request)` view that takes a `q` query parameter, searches courses by title or description (case-insensitive), returns results as JSON with `{"results": [...], "count": int, "query": str}`. Return a 400 if `q` is empty or missing.',
        language: 'python',
        starterCode: `from django.http import HttpRequest, JsonResponse
from .models import Course

def search(request: HttpRequest) -> JsonResponse:
    pass`,
        solution: `from django.http import HttpRequest, JsonResponse
from django.db.models import Q
from .models import Course

def search(request: HttpRequest) -> JsonResponse:
    query = request.GET.get("q", "").strip()
    if not query:
        return JsonResponse({"error": "q parameter is required"}, status=400)

    results = (
        Course.objects
        .filter(
            Q(title__icontains=query) | Q(description__icontains=query),
            is_published=True,
        )
        .select_related("author", "category")
        .values("id", "title", "slug", "level", "price", "author__username")
    )

    return JsonResponse({
        "query": query,
        "count": results.count(),
        "results": list(results),
    })`,
        hints: ['Use Q objects to combine OR conditions', 'values() returns dicts instead of model instances — efficient for JSON', 'author__username spans the FK relationship in values()'],
      },
    ],
  },

  // ─── Lesson 4: Django REST Framework ────────────────────────────────────
  {
    id: 'dj-drf',
    moduleId: 'python-backend',
    phaseId: 'py-django',
    phaseNumber: 4,
    order: 4,
    title: 'Django REST Framework (DRF)',
    description: 'Build professional REST APIs on top of Django using DRF — serializers, viewsets, routers, authentication, and pagination — all following Django conventions.',
    duration: '60 min',
    difficulty: 'intermediate',
    objectives: [
      'Install and configure DRF in a Django project',
      'Write serializers to control how models are converted to/from JSON',
      'Use ViewSets and Routers to generate CRUD endpoints automatically',
      'Implement TokenAuthentication and permission classes',
      'Add pagination, filtering, and searching to list endpoints',
    ],
    content: [
      {
        type: 'code',
        language: 'bash',
        filename: 'install.sh',
        code: `pip install djangorestframework djangorestframework-simplejwt django-filter

# Add to INSTALLED_APPS in settings.py:
# "rest_framework",
# "django_filters",`,
      },
      {
        type: 'callout',
        tone: 'clarification',
        title: 'Serializer boundary',
        content:
          'Serializers are the **trust boundary** between JSON and your DB models: validate untrusted input here, not in random view code. `ModelSerializer` is fast to start; drop to `Serializer` when the wire shape diverges from the ORM model.',
      },
      {
        type: 'code',
        language: 'python',
        filename: 'seniorpath/settings.py (DRF section)',
        code: `REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ],
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticatedOrReadOnly",
    ],
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
    "PAGE_SIZE": 20,
    "DEFAULT_FILTER_BACKENDS": [
        "django_filters.rest_framework.DjangoFilterBackend",
        "rest_framework.filters.SearchFilter",
        "rest_framework.filters.OrderingFilter",
    ],
    "DEFAULT_RENDERER_CLASSES": [
        "rest_framework.renderers.JSONRenderer",
    ],
}`,
      },
      {
        type: 'code',
        language: 'python',
        filename: 'courses/serializers.py',
        code: `from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Course, Category, Enrollment

User = get_user_model()

class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email"]
        read_only_fields = ["id"]

class CategorySerializer(serializers.ModelSerializer):
    course_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Category
        fields = ["id", "name", "slug", "course_count"]

class CourseListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for list views."""
    author = AuthorSerializer(read_only=True)
    category_name = serializers.CharField(source="category.name", read_only=True)

    class Meta:
        model = Course
        fields = ["id", "title", "slug", "level", "price", "is_published",
                  "author", "category_name", "created_at"]

class CourseDetailSerializer(serializers.ModelSerializer):
    """Full serializer for detail/create/update views."""
    author = AuthorSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source="category",
        write_only=True,
    )
    student_count = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = [
            "id", "title", "slug", "description", "level", "price",
            "is_published", "author", "category", "category_id",
            "student_count", "created_at", "updated_at",
        ]
        read_only_fields = ["id", "slug", "author", "created_at", "updated_at"]

    def get_student_count(self, obj: Course) -> int:
        return obj.students.count()

    def validate_price(self, value: float) -> float:
        if value < 0:
            raise serializers.ValidationError("Price cannot be negative")
        return value`,
      },
      {
        type: 'code',
        language: 'python',
        filename: 'courses/views_api.py',
        code: `from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.request import Request
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Count

from .models import Course, Category, Enrollment
from .serializers import CourseListSerializer, CourseDetailSerializer, CategorySerializer

class CourseViewSet(viewsets.ModelViewSet):
    """
    Generates all CRUD endpoints automatically:
    GET    /api/courses/           → list
    POST   /api/courses/           → create
    GET    /api/courses/{id}/      → retrieve
    PUT    /api/courses/{id}/      → update (full)
    PATCH  /api/courses/{id}/      → partial update
    DELETE /api/courses/{id}/      → destroy
    """
    queryset = Course.objects.all().select_related("author", "category")
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["level", "is_published", "category"]
    search_fields = ["title", "description"]     # ?search=python
    ordering_fields = ["created_at", "price"]    # ?ordering=-price

    def get_serializer_class(self):
        if self.action == "list":
            return CourseListSerializer
        return CourseDetailSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        if self.action == "list":
            return qs.filter(is_published=True)
        return qs

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    # Custom action: POST /api/courses/{id}/enroll/
    @action(detail=True, methods=["post"], permission_classes=[permissions.IsAuthenticated])
    def enroll(self, request: Request, pk=None) -> Response:
        course = self.get_object()
        enrollment, created = Enrollment.objects.get_or_create(
            user=request.user, course=course
        )
        status_code = status.HTTP_201_CREATED if created else status.HTTP_200_OK
        return Response(
            {"enrolled": True, "course": course.title},
            status=status_code,
        )

    # Custom action: GET /api/courses/featured/
    @action(detail=False, methods=["get"])
    def featured(self, request: Request) -> Response:
        featured = self.get_queryset().order_by("-created_at")[:6]
        serializer = CourseListSerializer(featured, many=True)
        return Response(serializer.data)`,
      },
      {
        type: 'code',
        language: 'python',
        filename: 'courses/api_urls.py',
        code: `from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.urls import path

from .views_api import CourseViewSet

router = DefaultRouter()
router.register("courses", CourseViewSet, basename="course")

urlpatterns = [
    *router.urls,
    # JWT auth endpoints
    path("auth/token/", TokenObtainPairView.as_view(), name="token-obtain"),
    path("auth/token/refresh/", TokenRefreshView.as_view(), name="token-refresh"),
]`,
      },
      {
        type: 'exercise',
        title: 'Enrollment Serializer & ViewSet',
        description: 'Create an `EnrollmentSerializer` that shows: `id`, `course_title` (from course.title), `enrolled_at`, `completed`. Then create a read-only `EnrollmentViewSet` that only shows the current user\'s enrollments (no admin can see other users\' data through this endpoint).',
        language: 'python',
        starterCode: `from rest_framework import serializers, viewsets, permissions
from .models import Enrollment

class EnrollmentSerializer(serializers.ModelSerializer):
    course_title = ...  # from course.title

    class Meta:
        model = Enrollment
        fields = [...]

class EnrollmentViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = EnrollmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Only return THIS user's enrollments
        pass`,
        solution: `from rest_framework import serializers, viewsets, permissions
from .models import Enrollment

class EnrollmentSerializer(serializers.ModelSerializer):
    course_title = serializers.CharField(source="course.title", read_only=True)
    course_slug = serializers.CharField(source="course.slug", read_only=True)

    class Meta:
        model = Enrollment
        fields = ["id", "course_title", "course_slug", "enrolled_at", "completed"]

class EnrollmentViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = EnrollmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return (
            Enrollment.objects
            .filter(user=self.request.user)
            .select_related("course")
            .order_by("-enrolled_at")
        )`,
        hints: ['source="course.title" traverses the FK relationship in a serializer field', 'get_queryset() is where you enforce data isolation per user', 'ReadOnlyModelViewSet only generates list and retrieve endpoints'],
      },
    ],
  },

  // ─── Lesson 5: Django Auth & Admin ──────────────────────────────────────
  {
    id: 'dj-auth',
    moduleId: 'python-backend',
    phaseId: 'py-django',
    phaseNumber: 4,
    order: 5,
    title: 'Django Auth System & Admin Panel',
    description: 'Use Django\'s built-in authentication — users, groups, permissions — and customise the admin panel into a powerful internal tool, all without writing a single line of SQL.',
    duration: '45 min',
    difficulty: 'intermediate',
    objectives: [
      'Extend the default User model with a custom user model',
      'Implement login, logout, and signup using Django\'s auth views',
      'Apply the permission system: model permissions, custom permissions',
      'Register models in the admin and customise the list/detail display',
      'Use admin actions for bulk operations',
    ],
    content: [
      {
        type: 'callout',
        tone: 'warning',
        title: 'Always Use a Custom User Model',
        content: 'Create a custom User model BEFORE your first migration, even if you don\'t need extra fields yet. Changing the User model later requires wiping the database. Django explicitly recommends this in their docs.',
      },
      {
        type: 'callout',
        tone: 'clarification',
        title: '`AUTH_USER_MODEL`',
        content:
          'Point `AUTH_USER_MODEL` to your custom user **before** any migration creates `auth_user` rows. Third-party apps read this setting at import time — changing it mid-project breaks foreign keys. Plan the user model on day one.',
      },
      {
        type: 'code',
        language: 'python',
        filename: 'accounts/models.py',
        code: `from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    """
    Custom user model — extend with project-specific fields.
    Set AUTH_USER_MODEL = 'accounts.User' in settings.py.
    """
    bio       = models.TextField(blank=True)
    avatar    = models.ImageField(upload_to="avatars/", blank=True)
    website   = models.URLField(blank=True)

    # Always use get_user_model() to reference this — never import directly
    # from django.contrib.auth import get_user_model
    # User = get_user_model()`,
      },
      {
        type: 'code',
        language: 'python',
        filename: 'seniorpath/settings.py (auth section)',
        code: `# Tell Django to use your custom user model
AUTH_USER_MODEL = "accounts.User"

# Login/logout redirect URLs
LOGIN_URL = "/accounts/login/"
LOGIN_REDIRECT_URL = "/dashboard/"
LOGOUT_REDIRECT_URL = "/"`,
      },
      {
        type: 'code',
        language: 'python',
        filename: 'accounts/urls.py',
        code: `from django.urls import path
from django.contrib.auth import views as auth_views
from . import views

urlpatterns = [
    # Django's built-in auth views — just wire them to URLs
    path("login/",    auth_views.LoginView.as_view(template_name="accounts/login.html"),  name="login"),
    path("logout/",   auth_views.LogoutView.as_view(), name="logout"),
    path("signup/",   views.signup, name="signup"),

    # Password reset flow (4 views, all built-in)
    path("password-reset/",          auth_views.PasswordResetView.as_view(),          name="password_reset"),
    path("password-reset/done/",     auth_views.PasswordResetDoneView.as_view(),      name="password_reset_done"),
    path("password-reset/<uidb64>/<token>/", auth_views.PasswordResetConfirmView.as_view(), name="password_reset_confirm"),
    path("password-reset/complete/", auth_views.PasswordResetCompleteView.as_view(),  name="password_reset_complete"),
]`,
      },
      {
        type: 'code',
        language: 'python',
        filename: 'courses/admin.py',
        code: `from django.contrib import admin
from django.utils.html import format_html
from .models import Course, Category, Enrollment

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ["name", "slug", "course_count"]
    prepopulated_fields = {"slug": ("name",)}   # auto-fills slug from name

    def course_count(self, obj):
        return obj.courses.count()
    course_count.short_description = "Courses"

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ["title", "author", "category", "level", "price", "is_published", "created_at"]
    list_filter  = ["level", "is_published", "category"]
    search_fields = ["title", "description", "author__username"]
    list_editable = ["is_published", "price"]     # edit inline in the list
    prepopulated_fields = {"slug": ("title",)}
    readonly_fields = ["created_at", "updated_at"]
    date_hierarchy = "created_at"

    fieldsets = [
        ("Content", {"fields": ("title", "slug", "description")}),
        ("Metadata", {"fields": ("level", "price", "category", "author")}),
        ("Status", {"fields": ("is_published", "created_at", "updated_at")}),
    ]

    # Custom admin action
    @admin.action(description="Publish selected courses")
    def publish_courses(self, request, queryset):
        updated = queryset.update(is_published=True)
        self.message_user(request, f"{updated} course(s) published.")

    actions = [publish_courses]

    def price_display(self, obj):
        color = "green" if obj.price == 0 else "black"
        label = "FREE" if obj.price == 0 else f"\${obj.price}"
        return format_html('<span style="color:{}">{}</span>', color, label)
    price_display.short_description = "Price"`,
      },
      {
        type: 'exercise',
        title: 'Custom Permission',
        description: 'Add a `can_publish_courses` custom permission to the Course model. Create a `PublishCourseView` that requires this permission (using `PermissionRequiredMixin` or `@permission_required`). If the user lacks the permission, return 403.',
        language: 'python',
        starterCode: `# In Course model's Meta class, add:
class Meta:
    permissions = [
        # ("codename", "Human-readable description"),
    ]

# In views.py:
from django.contrib.auth.decorators import permission_required

@permission_required("courses.???", raise_exception=True)
def publish_course(request, slug):
    pass`,
        solution: `# courses/models.py — inside Course.Meta
class Meta:
    ordering = ["-created_at"]
    permissions = [
        ("can_publish_courses", "Can publish and unpublish courses"),
    ]

# courses/views.py
from django.contrib.auth.decorators import permission_required
from django.shortcuts import get_object_or_404, redirect
from django.contrib import messages

@permission_required("courses.can_publish_courses", raise_exception=True)
def publish_course(request, slug):
    course = get_object_or_404(Course, slug=slug)
    course.is_published = True
    course.save(update_fields=["is_published"])
    messages.success(request, f"'{course.title}' is now published.")
    return redirect("courses:detail", slug=slug)`,
        hints: ['Custom permissions are defined in Meta.permissions as (codename, description)', 'The full permission string is "appname.codename" — e.g. "courses.can_publish_courses"', 'raise_exception=True returns 403 instead of redirecting to login for authenticated users without permission'],
      },
    ],
  },

  // ─── Lesson 6: Flask — Lightweight Web & APIs ───────────────────────────
  {
    id: 'py-flask',
    moduleId: 'python-backend',
    phaseId: 'py-django',
    phaseNumber: 4,
    order: 6,
    title: 'Flask: Lightweight Web & APIs',
    description: 'Learn Flask — Python\'s micro-framework — for cases where Django\'s batteries are overkill. Build APIs, microservices, and simple web apps with Flask\'s minimal, explicit approach.',
    duration: '50 min',
    difficulty: 'intermediate',
    objectives: [
      'Understand when to choose Flask over Django or FastAPI',
      'Set up a Flask application with the application factory pattern',
      'Define routes, handle request/response, and use blueprints',
      'Build a REST API with Flask and marshmallow for validation',
      'Integrate SQLAlchemy with Flask-SQLAlchemy',
    ],
    content: [
      {
        type: 'text',
        markdown: `## Flask vs Django vs FastAPI

| | Flask | Django | FastAPI |
|---|---|---|---|
| Philosophy | Micro — bring your own | Batteries included | Modern async |
| Best for | Microservices, simple APIs, prototypes | Full web apps, content sites | High-performance APIs |
| ORM | You choose (SQLAlchemy, Peewee) | Built-in | You choose |
| Admin | You build it | Built-in | You build it |
| Auth | You build it | Built-in | You build it |
| Learning curve | Low | Medium | Medium |
| Async | Add-on (Quart) | Limited | Native |

**Choose Flask when:** small service, full control over every component, integrating non-standard storage, or rapid prototyping.`,
      },
      {
        type: 'callout',
        tone: 'clarification',
        title: 'Application factory',
        content:
          '`create_app()` delays creating the `Flask` instance until configuration is loaded — mandatory for tests (swap config) and for running multiple app instances. Avoid a single global `app = Flask(__name__)` in anything larger than a script.',
      },
      {
        type: 'code',
        language: 'bash',
        filename: 'setup.sh',
        code: `pip install flask flask-sqlalchemy flask-migrate marshmallow

# Project structure (recommended)
# app/
#   __init__.py    ← application factory
#   models.py
#   routes.py
#   schemas.py
# config.py
# run.py`,
      },
      {
        type: 'code',
        language: 'python',
        filename: 'app/__init__.py',
        code: `from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

db = SQLAlchemy()
migrate = Migrate()

def create_app(config: str = "config.DevelopmentConfig") -> Flask:
    """Application factory — create a Flask app instance."""
    app = Flask(__name__)
    app.config.from_object(config)

    # Initialise extensions
    db.init_app(app)
    migrate.init_app(app, db)

    # Register blueprints
    from .routes import courses_bp
    app.register_blueprint(courses_bp, url_prefix="/api/courses")

    return app`,
      },
      {
        type: 'code',
        language: 'python',
        filename: 'app/models.py',
        code: `from datetime import datetime
from . import db

class Course(db.Model):
    __tablename__ = "courses"

    id          = db.Column(db.Integer, primary_key=True)
    title       = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, default="")
    price       = db.Column(db.Float, default=0.0)
    is_published = db.Column(db.Boolean, default=False)
    created_at  = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "title": self.title,
            "price": self.price,
            "is_published": self.is_published,
        }`,
      },
      {
        type: 'code',
        language: 'python',
        filename: 'app/routes.py',
        code: `from flask import Blueprint, request, jsonify, abort
from marshmallow import Schema, fields, validate, ValidationError

from . import db
from .models import Course

courses_bp = Blueprint("courses", __name__)

# ── Marshmallow schemas — validation & serialization ─
class CourseSchema(Schema):
    id          = fields.Int(dump_only=True)
    title       = fields.Str(required=True, validate=validate.Length(min=1, max=200))
    description = fields.Str(load_default="")
    price       = fields.Float(load_default=0.0, validate=validate.Range(min=0))
    is_published = fields.Bool(dump_default=False)
    created_at  = fields.DateTime(dump_only=True)

course_schema  = CourseSchema()
courses_schema = CourseSchema(many=True)

# ── Routes ───────────────────────────────────────────
@courses_bp.route("/", methods=["GET"])
def list_courses():
    page     = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 20, type=int)
    qs = Course.query.filter_by(is_published=True).paginate(page=page, per_page=per_page)
    return jsonify({
        "courses": courses_schema.dump(qs.items),
        "total": qs.total,
        "pages": qs.pages,
        "page": page,
    })

@courses_bp.route("/<int:course_id>", methods=["GET"])
def get_course(course_id: int):
    course = Course.query.get_or_404(course_id)
    return jsonify(course_schema.dump(course))

@courses_bp.route("/", methods=["POST"])
def create_course():
    try:
        data = course_schema.load(request.get_json() or {})
    except ValidationError as err:
        return jsonify({"errors": err.messages}), 400

    course = Course(**data)
    db.session.add(course)
    db.session.commit()
    return jsonify(course_schema.dump(course)), 201

@courses_bp.route("/<int:course_id>", methods=["PATCH"])
def update_course(course_id: int):
    course = Course.query.get_or_404(course_id)
    try:
        data = CourseSchema(partial=True).load(request.get_json() or {})
    except ValidationError as err:
        return jsonify({"errors": err.messages}), 400

    for key, value in data.items():
        setattr(course, key, value)
    db.session.commit()
    return jsonify(course_schema.dump(course))

@courses_bp.route("/<int:course_id>", methods=["DELETE"])
def delete_course(course_id: int):
    course = Course.query.get_or_404(course_id)
    db.session.delete(course)
    db.session.commit()
    return "", 204`,
      },
      {
        type: 'callout',
        tone: 'tip',
        title: 'Flask in 2025: When It Shines',
        content: 'Flask is widely used for internal tools, ML model serving (Flask + PyTorch), webhook handlers, and anywhere you need a small, understandable codebase. For new production APIs needing high throughput, FastAPI is usually the better choice. For full web applications with auth, admin, and content management, Django wins.',
      },
      {
        type: 'exercise',
        title: 'Health Check & Metrics Endpoint',
        description: 'Add a `/health` blueprint to a Flask app with two routes: `GET /health/` returns `{"status": "ok", "timestamp": "..."}`, and `GET /health/db` checks the database connection (tries a simple query) and returns `{"status": "ok"}` or `{"status": "error", "detail": "..."}` with a 503 status.',
        language: 'python',
        starterCode: `from flask import Blueprint, jsonify
from datetime import datetime, timezone
from . import db

health_bp = Blueprint("health", __name__)

@health_bp.route("/")
def health_check():
    pass

@health_bp.route("/db")
def health_db():
    pass`,
        solution: `from flask import Blueprint, jsonify
from datetime import datetime, timezone
from sqlalchemy import text
from . import db

health_bp = Blueprint("health", __name__)

@health_bp.route("/")
def health_check():
    return jsonify({
        "status": "ok",
        "timestamp": datetime.now(timezone.utc).isoformat(),
    })

@health_bp.route("/db")
def health_db():
    try:
        db.session.execute(text("SELECT 1"))
        return jsonify({"status": "ok", "database": "connected"})
    except Exception as e:
        return jsonify({"status": "error", "detail": str(e)}), 503`,
        hints: ['Use text("SELECT 1") from sqlalchemy to run a raw query', 'Return a 503 status code when the DB is unreachable', 'datetime.now(timezone.utc).isoformat() gives a timezone-aware ISO timestamp'],
      },
    ],
  },
  // ─── Lesson 7: Framework Mastery Practice Roadmap ───────────────────────
  {
    id: 'py-frameworks-mastery',
    moduleId: 'python-backend',
    phaseId: 'py-django',
    phaseNumber: 4,
    order: 7,
    title: 'Framework Mastery: Practice Roadmap & Resources',
    description:
      'Turn framework knowledge into production skill with a structured 4-week practice roadmap, curated learning resources, and a capstone that compares Django, Flask, and FastAPI implementations.',
    duration: '65 min',
    difficulty: 'intermediate',
    objectives: [
      'Follow a complete practice system for Django, DRF, Flask, and FastAPI',
      'Use trusted references (official docs + W3Schools + deep-dive tutorials) effectively',
      'Build the same backend feature set with multiple frameworks to understand trade-offs',
      'Create a portfolio-ready capstone with tests, docs, and deployment checklist',
    ],
    content: [
      {
        type: 'text',
        markdown: `## From "I Watched Tutorials" to "I Can Ship"

To truly master backend frameworks, you need three loops:

1. **Learn** a concept quickly (docs/tutorial references)
2. **Build** a focused mini-feature immediately
3. **Review** with tests, profiling, and refactors

This lesson gives you a concrete roadmap you can repeat for any framework in your career.`,
      },
      {
        type: 'callout',
        tone: 'clarification',
        title: 'Same feature, three frameworks',
        content:
          'The capstone suggestion here is intentional: rebuild one bounded domain (auth + CRUD + tests) in Django, Flask, and FastAPI. You will feel where ORM/admin saves time vs where explicit wiring and async APIs win. That contrast sticks better than three separate tutorials.',
      },
      {
        type: 'text',
        markdown: `## Curated Resource Map (Use in This Order)

### Django + DRF
- Official docs: [Django Docs](https://docs.djangoproject.com/en/stable/) and [DRF Docs](https://www.django-rest-framework.org/)
- Fast concept refresh: [W3Schools Django](https://www.w3schools.com/django/)
- Practical deep dives: [Real Python Django](https://realpython.com/tutorials/django/)

### Flask
- Official docs: [Flask Documentation](https://flask.palletsprojects.com/)
- Fast concept refresh: [W3Schools Flask](https://www.w3schools.com/python/flask_intro.asp)
- Practical deep dives: [Real Python Flask](https://realpython.com/tutorials/flask/)

### FastAPI
- Official docs: [FastAPI Documentation](https://fastapi.tiangolo.com/)
- Fast concept refresh: [W3Schools FastAPI](https://www.w3schools.com/python/fastapi/)
- Practical deep dives: [FastAPI Tutorial by TestDriven.io](https://testdriven.io/blog/fastapi-crud/)

### Shared Backend Foundations
- HTTP and REST conventions: [MDN HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP)
- SQL refresher: [W3Schools SQL](https://www.w3schools.com/sql/)
- API testing: [Postman Learning Center](https://learning.postman.com/)`,
      },
      {
        type: 'callout',
        tone: 'important',
        title: 'How to Use Online Resources Correctly',
        content:
          'Use W3Schools for speed and recall, official docs for correctness, and long-form tutorials for context. Never rely on only one source. The sequence should be: W3Schools (5-10 min) -> official docs (20 min) -> implementation in your own project (40+ min).',
      },
      {
        type: 'text',
        markdown: `## 4-Week Framework Practice Plan

### Week 1: Django foundation sprint
- Build models, migrations, admin customization, auth flow
- Deliverable: content management app with role-based access
- Practice target: 12-15 endpoints/pages + 10 tests

### Week 2: DRF API sprint
- Build serializers, viewsets, filtering, pagination, JWT auth
- Deliverable: production-style \`/api/v1\` service with OpenAPI docs
- Practice target: 8-10 API endpoints + 12 API tests

### Week 3: Flask microservice sprint
- Build app factory structure, SQLAlchemy models, Marshmallow validation
- Deliverable: small service for notifications/webhooks
- Practice target: 5-7 endpoints + health checks + metrics endpoint

### Week 4: FastAPI performance sprint
- Build async endpoints, background tasks, middleware, structured errors
- Deliverable: high-throughput API with request ID and timing headers
- Practice target: 8+ endpoints + load-test baseline + profiling notes`,
      },
      {
        type: 'code',
        language: 'text',
        filename: 'practice-checklist.md',
        code: `# Framework Mastery Daily Checklist

- [ ] Read one short external reference (15-25 min max)
- [ ] Implement one feature without copy-pasting full snippets
- [ ] Write at least one test for the new feature
- [ ] Verify API behavior in Swagger/Postman/curl
- [ ] Log one "what I misunderstood today" note
- [ ] Refactor one small area for clarity/performance

# Weekly Demo Checklist

- [ ] Record a 3-5 min walkthrough (routes, architecture, trade-offs)
- [ ] Show test run output
- [ ] Show one performance/security improvement
- [ ] Document "what I'd improve next"`,
        explanation:
          'This checklist keeps learning active and measurable. If you skip tests and demos, knowledge feels good but does not stick in real interviews or production work.',
      },
      {
        type: 'exercise',
        title: 'Capstone: One Product API, Three Frameworks',
        description:
          'Build the same "Product Catalog + Orders" backend three times: (A) Django + DRF, (B) Flask + SQLAlchemy, (C) FastAPI + Pydantic. Implement identical features: CRUD for products, list/search/filter, order creation, auth-protected admin routes, /health and /health/db, pagination, and error format. Then write a short comparison doc explaining when to choose each framework.',
        language: 'python',
        starterCode: `# Goal: maintain the same API contract across all frameworks.

# Required endpoints:
# GET    /products
# POST   /products
# GET    /products/{id}
# PATCH  /products/{id}
# DELETE /products/{id}
# POST   /orders
# GET    /orders/{id}
# GET    /health
# GET    /health/db

# Required extras:
# - JWT authentication for admin-only writes
# - Pagination + search query params
# - Consistent error response format
# - Test suite for each implementation

# Suggested folder structure:
# projects/
#   django_drf_api/
#   flask_api/
#   fastapi_api/
#   comparison.md`,
        solution: `# Expected outcome (high-level):
# 1) Three runnable services with the same endpoint contract.
# 2) At least 8 tests per service (24+ total).
# 3) comparison.md that includes:
#    - Framework learning curve
#    - Boilerplate vs productivity
#    - Performance observations
#    - Best use-cases
#
# Example comparison summary:
# - Django+DRF: fastest for large business apps with auth/admin needs.
# - Flask: best when you need minimal structure and full control.
# - FastAPI: best for modern async APIs and typed validation-heavy services.`,
        hints: [
          'Start with the API contract first, then implement each framework against that contract',
          'Keep one shared Postman collection so all three services are tested consistently',
          'Timebox each framework implementation to avoid over-engineering',
          'Measure at least one practical metric (response time, lines of code, or setup time)',
        ],
      },
      {
        type: 'callout',
        tone: 'production',
        title: 'Portfolio Upgrade',
        content:
          'A side-by-side framework capstone is high-signal for interviews. It proves architecture judgment, not just syntax familiarity. Include README screenshots, test coverage, and a short trade-off matrix.',
      },
    ],
  },
]
