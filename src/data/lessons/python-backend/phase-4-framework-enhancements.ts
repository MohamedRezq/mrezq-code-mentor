import type { ContentBlock, Lesson } from '@/types/lesson'

// ─── PHASE 4: Django / DRF / Flask ───────────────────────────────────────────
// Expert-reviewer + beginner-tutor standard:
// Every lesson gets: TL;DR · terminology · full API reference with outputs ·
// lifecycle / flow diagram · real scenario · junior mistakes + fix ·
// code-reading guide
// ─────────────────────────────────────────────────────────────────────────────

const phase4Blocks: Record<string, string[]> = {
  // ─── Lesson 1: Django Intro & Project Structure ──────────────────────────
  'dj-intro': [
    `## Beginner TL;DR — What Django actually is

Django (pronounced **JANG-oh**, the D is silent) is a Python web framework that ships with almost everything a web app needs built-in:
authentication, an ORM, an admin panel, URL routing, form validation, template engine, and security middleware.

Contrast with Flask (micro-framework — you add libraries yourself) or FastAPI (async API framework — no admin or ORM built in).

**Mental model:** Django is like a pre-furnished apartment. Flask is an empty room. FastAPI is a different style apartment optimised for one specific use.`,

    `## Terminology you must be able to spell and say

| Term | Pronunciation | What it means |
|---|---|---|
| MTV | M-T-V | Model-Template-View — Django's architecture pattern |
| ORM | O-R-M | Object-Relational Mapper — Python classes ↔ database tables |
| WSGI | WIZ-ghee | Web Server Gateway Interface — sync server protocol |
| ASGI | AZ-ghee | Async Server Gateway Interface — async server protocol |
| Middleware | MID-ul-ware | Code that wraps every request and response |
| manage.py | — | Django's CLI tool for all development tasks |
| startproject | — | Creates the outer Django project scaffold |
| startapp | — | Creates a reusable Django app inside the project |`,

    `## Full reference: manage.py commands you use every day

\`\`\`bash
# Project and app setup
django-admin startproject mysite .          # create project in current dir
python manage.py startapp blog              # create an app module

# Database
python manage.py makemigrations             # detect model changes → write migration
python manage.py migrate                    # apply migrations to database
python manage.py showmigrations             # list all migrations + status
python manage.py sqlmigrate blog 0001       # show SQL a migration would run

# Development server
python manage.py runserver                  # http://127.0.0.1:8000
python manage.py runserver 0.0.0.0:8080    # custom host:port

# Shell
python manage.py shell                      # interactive Python with Django loaded
python manage.py dbshell                    # direct database SQL shell

# Static files
python manage.py collectstatic             # copy all static files to STATIC_ROOT

# Admin user
python manage.py createsuperuser           # create admin login
\`\`\`

Expected output of \`runserver\`:
\`\`\`
Watching for file changes with StatReloader
Performing system checks...

System check identified no issues (0 silenced).
Starting development server at http://127.0.0.1:8000/
Quit the server with CTRL-BREAK.
\`\`\``,

    `## Reference: Django request lifecycle (read this top-to-bottom when debugging)

\`\`\`
Browser → URL dispatcher
         ↓ pattern match (urls.py)
         → Middleware stack (each .process_request())
         ↓
         → View function / class
         ↓ calls Model(s) via ORM
         → Template rendering (or JSON response)
         ↓
         → Middleware stack reversed (.process_response())
         ↓
Browser ← HTTP Response
\`\`\`

**Where to look when something breaks:**
- 404? → URL pattern wrong or app not in \`INSTALLED_APPS\`
- 500? → View raised an exception — check error page or logs
- Data wrong? → ORM query logic in the view
- Permission denied? → Middleware or \`@login_required\` / \`@permission_required\``,

    `## Key settings you must understand

\`\`\`python
# settings.py — critical entries

SECRET_KEY = os.environ.get("DJANGO_SECRET_KEY")   # sign cookies/tokens; NEVER commit to git

DEBUG = False       # True shows tracebacks to users — never True in production
ALLOWED_HOSTS = ["example.com", "www.example.com"]  # required when DEBUG=False

INSTALLED_APPS = [
    # Django built-ins
    "django.contrib.admin",          # /admin/ panel
    "django.contrib.auth",           # user model, login
    "django.contrib.contenttypes",   # generic FK support
    "django.contrib.sessions",       # session storage
    "django.contrib.messages",       # flash messages
    "django.contrib.staticfiles",    # static file serving
    # Your apps
    "blog",                          # always add your apps here
]

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": os.environ.get("DB_NAME"),
        # … user/password/host/port from env
    }
}

AUTH_USER_MODEL = "accounts.User"    # MUST set before first migration if using custom user
\`\`\``,

    `## Real scenario: internal learning portal

**Situation:** You are building an admin dashboard for content managers to create and publish Python lessons.

**Why Django wins here:**
1. \`/admin/\` panel gives CRUD for lessons in minutes — no custom code.
2. Built-in auth handles login/logout/password reset.
3. ORM lets you write \`Lesson.objects.filter(published=True).order_by("order")\` instead of raw SQL.
4. Migrations track schema changes across the team.

**You would not pick Django if:** you only need a JSON API with no admin, OR you need heavy async I/O throughout — use FastAPI instead.`,

    `## Junior mistakes + fix

| Mistake | What happens | Fix |
|---|---|---|
| Omit trailing dot in \`startproject\` | Creates nested project folder | Always run \`django-admin startproject name .\` |
| Forget to add app to \`INSTALLED_APPS\` | Migrations and templates not found | Add \`"appname"\` to the list |
| Commit real \`SECRET_KEY\` to git | Security breach | Load from \`os.environ.get()\` always |
| Set \`DEBUG=True\` on production server | Stack traces visible to all users | Set \`DEBUG=False\`, use logging |
| Mix business logic in templates | Untestable, messy | Templates only format data; logic stays in views/services |`,
  ],

  // ─── Lesson 2: Django Models & ORM ──────────────────────────────────────
  'dj-models': [
    `## Beginner TL;DR — Django Models

A Django model is a Python class that:
1. Defines the structure of one database table
2. Provides methods to create, read, update, and delete rows

You never write SQL directly for normal CRUD. Django's ORM translates Python to SQL.

**Say it out loud:** "I define a \`Course\` model with \`title\`, \`slug\`, and \`price\` fields. Django creates the table. I use \`Course.objects.filter()\` to query it."`,

    `## Full reference: Django field types with examples

\`\`\`python
from django.db import models

class Example(models.Model):
    # Text
    name        = models.CharField(max_length=200)      # VARCHAR(200)
    bio         = models.TextField()                    # TEXT (unlimited)
    slug        = models.SlugField(unique=True)         # URL-safe string

    # Numbers
    price       = models.DecimalField(max_digits=8, decimal_places=2)
    count       = models.IntegerField(default=0)
    rating      = models.FloatField(null=True)

    # Boolean
    is_active   = models.BooleanField(default=True)

    # Date / time
    created_at  = models.DateTimeField(auto_now_add=True)  # set once on creation
    updated_at  = models.DateTimeField(auto_now=True)       # updated on every save
    published_on = models.DateField(null=True, blank=True)

    # File / media
    image       = models.ImageField(upload_to="images/", blank=True)
    file        = models.FileField(upload_to="files/")

    # Relationships
    author      = models.ForeignKey("auth.User", on_delete=models.CASCADE)
    tags        = models.ManyToManyField("Tag", blank=True)
    profile     = models.OneToOneField("Profile", on_delete=models.CASCADE)
\`\`\`

**Field options that change behaviour:**

| Option | What it does |
|---|---|
| \`null=True\` | DB column allows NULL |
| \`blank=True\` | Form/serializer allows empty |
| \`default=\` | Value used if not provided |
| \`unique=True\` | DB-level uniqueness constraint |
| \`db_index=True\` | Faster filtering on this column |
| \`choices=\` | Restrict to known values |
| \`on_delete=CASCADE\` | Delete child rows when parent deleted |
| \`on_delete=PROTECT\` | Block deletion if children exist |
| \`on_delete=SET_NULL\` | Set FK to NULL when parent deleted |`,

    `## Full reference: QuerySet API with expected outputs

\`\`\`python
from courses.models import Course
from django.db.models import Count, Avg, Q

# ── Reading ────────────────────────────────────────────────────────
Course.objects.all()                          # all rows (lazy)
Course.objects.count()                        # → 42
Course.objects.filter(is_published=True)      # WHERE is_published = true
Course.objects.exclude(level="beginner")      # WHERE NOT level = 'beginner'
Course.objects.get(slug="python-basics")      # exactly 1 row or exception
Course.objects.filter(slug="x").first()       # first match or None
Course.objects.filter(slug="x").exists()      # → True / False

# ── Chaining ──────────────────────────────────────────────────────
Course.objects.filter(is_published=True).order_by("-created_at")[:10]
# ORDER BY created_at DESC LIMIT 10

# ── Field lookups (field__lookup) ────────────────────────────────
Course.objects.filter(title__icontains="python")   # case-insensitive LIKE %python%
Course.objects.filter(price__lte=50)               # price <= 50
Course.objects.filter(price__gte=0, price__lt=100) # 0 <= price < 100
Course.objects.filter(created_at__year=2025)       # year part of datetime
Course.objects.filter(category__name="Backend")    # traverse FK with __

# ── OR / complex ──────────────────────────────────────────────────
free_or_beginner = Course.objects.filter(Q(price=0) | Q(level="beginner"))

# ── Aggregation ───────────────────────────────────────────────────
Course.objects.aggregate(total=Count("id"), avg_price=Avg("price"))
# → {"total": 42, "avg_price": 29.5}

# ── Annotation (adds a computed column per row) ──────────────────
Course.objects.annotate(student_count=Count("enrollments")).order_by("-student_count")

# ── Creating / saving ────────────────────────────────────────────
c = Course.objects.create(title="Python", slug="python", category=cat, author=user)
c.title = "Python Pro"
c.save(update_fields=["title"])   # only UPDATE changed fields

# ── Bulk operations ───────────────────────────────────────────────
Course.objects.filter(level="beginner").update(price=0)     # bulk UPDATE
Course.objects.filter(is_published=False).delete()          # bulk DELETE

# ── N+1 fix ───────────────────────────────────────────────────────
# BAD: 1 + N queries
for c in Course.objects.all():
    print(c.author.username)   # extra query per row

# GOOD: 2 queries total
for c in Course.objects.select_related("author", "category"):
    print(c.author.username)   # no extra hit

# GOOD: for ManyToMany / reverse FK
courses = Course.objects.prefetch_related("students").all()
\`\`\``,

    `## Real scenario: course dashboard stats

**Situation:** Admin dashboard needs total courses, published courses, and top-3 by enrolment — in one page load without slowing the server.

\`\`\`python
from django.db.models import Count, Q

stats = Course.objects.aggregate(
    total=Count("id"),
    published=Count("id", filter=Q(is_published=True)),
)
# → {"total": 58, "published": 44}

top_courses = (
    Course.objects
    .annotate(enrolled=Count("enrollment"))
    .order_by("-enrolled")
    .select_related("author")
    [:3]
)
for c in top_courses:
    print(c.title, c.enrolled)
# → Django Mastery 312
# → Python Basics  280
# → FastAPI Pro    201
\`\`\`

This is 2 DB round trips total, not hundreds.`,

    `## Junior mistakes + fix

| Mistake | What happens | Fix |
|---|---|---|
| \`get()\` on possibly missing row | \`DoesNotExist\` exception, 500 error | Use \`.first()\` or \`get_object_or_404()\` |
| Loop + \`.related_field\` access without prefetch | N+1 queries, 100× slower | Add \`select_related\` / \`prefetch_related\` |
| Edit old applied migration file | Team DB gets out of sync | Always create a new migration |
| \`null=True\` on \`CharField\` | Two ways to represent empty | Only use \`blank=True\` on strings; use \`null=True\` for numbers/FKs |
| Forget \`on_delete\` | Migration error | Always declare \`on_delete\` on every ForeignKey |`,
  ],

  // ─── Lesson 3: Django Views, URLs & CBVs ────────────────────────────────
  'dj-views': [
    `## Beginner TL;DR — Views and URLs

A view is a Python function (or class) that:
- receives an \`HttpRequest\`
- does some work (ORM queries, business logic)
- returns an \`HttpResponse\`

A URL pattern maps a path string to a view. Together they are the routing layer of Django.`,

    `## Full reference: URL converters

\`\`\`python
# urls.py — path() converter types
from django.urls import path, re_path

urlpatterns = [
    path("",                        views.home,          name="home"),
    path("courses/",                views.course_list,   name="course-list"),
    path("courses/<int:pk>/",       views.detail_by_pk,  name="detail-pk"),
    path("courses/<slug:slug>/",    views.detail_by_slug, name="detail-slug"),
    path("courses/<str:username>/", views.by_user,       name="by-user"),
    path("files/<path:filepath>",   views.serve_file,    name="serve"),
    path("uuid/<uuid:uid>/",        views.by_uuid,       name="by-uuid"),
    # Regex (use sparingly)
    re_path(r"^legacy/(?P<id>[0-9]+)/$", views.legacy,  name="legacy"),
]

# ⚠ Order matters — fixed paths must come BEFORE converters:
path("courses/featured/", views.featured),   # ← put this FIRST
path("courses/<slug:slug>/", views.detail),  # ← otherwise "featured" matches <slug>
\`\`\`

**Namespaced URLs:**
\`\`\`python
# In app urls.py:
app_name = "courses"
urlpatterns = [path("<slug:slug>/", views.detail, name="detail")]

# In template or view:
from django.urls import reverse
url = reverse("courses:detail", kwargs={"slug": "python-basics"})
# → "/courses/python-basics/"
\`\`\``,

    `## Full reference: FBV shortcuts

\`\`\`python
from django.shortcuts import render, redirect, get_object_or_404
from django.http import HttpRequest, HttpResponse, JsonResponse
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_GET, require_POST, require_http_methods

# render(request, template_name, context) → HttpResponse
def course_list(request: HttpRequest) -> HttpResponse:
    courses = Course.objects.filter(is_published=True)
    return render(request, "courses/list.html", {"courses": courses})

# get_object_or_404 → returns object or raises Http404 (which shows 404 page)
def course_detail(request: HttpRequest, slug: str) -> HttpResponse:
    course = get_object_or_404(Course, slug=slug, is_published=True)
    return render(request, "courses/detail.html", {"course": course})

# redirect(to) → 302 redirect; "permanent=True" → 301
def old_url(request: HttpRequest) -> HttpResponse:
    return redirect("courses:list")          # named URL
    return redirect("/courses/")             # absolute path
    return redirect("https://example.com")   # external URL

# JsonResponse — auto-serialises dict to JSON, sets Content-Type header
def api_status(request: HttpRequest) -> JsonResponse:
    return JsonResponse({"status": "ok", "version": "1.0"})
    return JsonResponse({"error": "not found"}, status=404)

# Decorators
@login_required                         # redirect to LOGIN_URL if anonymous
@require_GET                            # 405 if not GET
@require_http_methods(["GET", "POST"])  # 405 for other methods
def protected(request):
    pass
\`\`\``,

    `## Full reference: Class-Based Views — hooks you must know

\`\`\`python
from django.views.generic import View, TemplateView, ListView, DetailView
from django.views.generic import CreateView, UpdateView, DeleteView
from django.contrib.auth.mixins import LoginRequiredMixin

# Dispatch order for every CBV:
# dispatch() → get() / post() / put() / patch() / delete()

class CourseListView(LoginRequiredMixin, ListView):
    model = Course
    template_name = "courses/list.html"
    context_object_name = "courses"     # variable name in template
    paginate_by = 20

    def get_queryset(self):                    # ← override to filter
        return Course.objects.filter(is_published=True)

    def get_context_data(self, **kwargs):      # ← add extra template data
        ctx = super().get_context_data(**kwargs)
        ctx["total"] = self.get_queryset().count()
        return ctx

class CourseCreateView(LoginRequiredMixin, CreateView):
    model = Course
    fields = ["title", "description", "price"]
    success_url = reverse_lazy("courses:list")

    def form_valid(self, form):                # ← called when form is clean
        form.instance.author = self.request.user
        return super().form_valid(form)

    def form_invalid(self, form):              # ← called on validation failure
        return super().form_invalid(form)
\`\`\`

**Key CBV lookup order when debugging:**
\`dispatch\` → \`get_queryset\` → \`get_object\` → \`get_context_data\` → template`,

    `## Real scenario: permission-gated publish action

\`\`\`python
from django.contrib.auth.decorators import permission_required
from django.contrib import messages

@login_required
@permission_required("courses.can_publish_courses", raise_exception=True)
@require_http_methods(["POST"])
def publish_course(request, slug):
    course = get_object_or_404(Course, slug=slug)
    course.is_published = True
    course.save(update_fields=["is_published"])
    messages.success(request, f"'{course.title}' is now live.")
    return redirect("courses:detail", slug=slug)
\`\`\`

- 401 → not logged in
- 403 → logged in but lacks \`can_publish_courses\` permission
- 405 → called with GET instead of POST`,

    `## Junior mistakes + fix

| Mistake | What happens | Fix |
|---|---|---|
| Forgetting \`raise_exception=True\` in \`@permission_required\` | Redirects to login for authenticated users — confusing | Set \`raise_exception=True\` so authenticated users get 403 |
| State-changing logic in a GET view | Bookmarks/crawlers trigger side effects | Mutate state in POST only |
| All logic inside CBV without service layer | Hard to test, tightly coupled | Extract business logic to a service function |
| Forgetting \`app_name\` in urls.py | \`NoReverseMatch\` in templates | Set \`app_name = "courses"\` before \`urlpatterns\` |`,
  ],

  // ─── Lesson 4: Django REST Framework ────────────────────────────────────
  'dj-drf': [
    `## Beginner TL;DR — DRF

DRF (Django REST Framework) builds REST APIs on top of Django.

- **Serializer** = converts Python objects ↔ JSON, validates input
- **ViewSet** = groups all CRUD actions for one resource
- **Router** = auto-generates the URL patterns

You write less code and get consistent endpoints with built-in auth, pagination, and filtering.`,

    `## Full reference: Serializer fields and options

\`\`\`python
from rest_framework import serializers

class CourseSerializer(serializers.ModelSerializer):
    # Read-only computed from another field
    author_name = serializers.CharField(source="author.username", read_only=True)

    # Nested serializer (for FK)
    category = CategorySerializer(read_only=True)

    # Write-only FK input (client sends an ID, not the full object)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source="category",
        write_only=True,
    )

    # Computed field via method
    enrollment_count = serializers.SerializerMethodField()

    # Field-level validation
    def validate_price(self, value):
        if value < 0:
            raise serializers.ValidationError("Price must be >= 0")
        return value

    # Cross-field validation
    def validate(self, data):
        if data.get("level") == "advanced" and data.get("price") == 0:
            raise serializers.ValidationError("Advanced courses cannot be free")
        return data

    def get_enrollment_count(self, obj):
        return obj.enrollments.count()

    class Meta:
        model = Course
        fields = ["id", "title", "price", "level", "author_name",
                  "category", "category_id", "enrollment_count"]
        read_only_fields = ["id", "created_at"]
\`\`\`

**Common serializer options:**

| Option | Effect |
|---|---|
| \`read_only=True\` | Field appears in response but is ignored on input |
| \`write_only=True\` | Field accepted on input but excluded from response |
| \`required=False\` | Field is optional on input |
| \`allow_null=True\` | Field can be null/None |
| \`source="field.nested"\` | Read from a different attribute name |`,

    `## Full reference: ViewSet actions and custom endpoints

\`\`\`python
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response

class CourseViewSet(viewsets.ModelViewSet):
    # ModelViewSet auto-provides: list, create, retrieve, update, partial_update, destroy

    queryset = Course.objects.all().select_related("author", "category")
    serializer_class = CourseDetailSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    search_fields = ["title", "description"]     # ?search=python
    filterset_fields = ["level", "is_published"] # ?level=beginner
    ordering_fields = ["created_at", "price"]    # ?ordering=-price

    # Use different serializer per action
    def get_serializer_class(self):
        if self.action == "list":
            return CourseListSerializer    # lighter serializer for list
        return CourseDetailSerializer

    # Narrow queryset per action
    def get_queryset(self):
        qs = super().get_queryset()
        if self.action == "list":
            return qs.filter(is_published=True)
        return qs

    # Set author on create — never trust client input for this
    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    # Custom action — POST /courses/{id}/enroll/
    @action(detail=True, methods=["post"], permission_classes=[permissions.IsAuthenticated])
    def enroll(self, request, pk=None):
        course = self.get_object()
        enrollment, created = Enrollment.objects.get_or_create(user=request.user, course=course)
        return Response({"enrolled": True}, status=status.HTTP_201_CREATED if created else 200)

    # Custom action — GET /courses/featured/
    @action(detail=False, methods=["get"])
    def featured(self, request):
        qs = self.get_queryset().order_by("-created_at")[:6]
        return Response(self.get_serializer(qs, many=True).data)
\`\`\``,

    `## Full reference: REST_FRAMEWORK settings

\`\`\`python
# settings.py
REST_FRAMEWORK = {
    # Authentication: who are you?
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework_simplejwt.authentication.JWTAuthentication",
        "rest_framework.authentication.SessionAuthentication",  # for browsable API
    ],

    # Permission: what can you do?
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticatedOrReadOnly",
    ],

    # Pagination
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
    "PAGE_SIZE": 20,

    # Filtering
    "DEFAULT_FILTER_BACKENDS": [
        "django_filters.rest_framework.DjangoFilterBackend",
        "rest_framework.filters.SearchFilter",
        "rest_framework.filters.OrderingFilter",
    ],

    # Error format
    "EXCEPTION_HANDLER": "myapp.exceptions.custom_exception_handler",
}
\`\`\`

**Permission classes reference:**

| Class | Who is allowed |
|---|---|
| \`AllowAny\` | Everyone including anonymous |
| \`IsAuthenticated\` | Logged-in users only |
| \`IsAuthenticatedOrReadOnly\` | Anyone can read, must be logged in to write |
| \`IsAdminUser\` | \`is_staff=True\` users only |
| Custom permission | Subclass \`BasePermission\`, override \`has_permission\` / \`has_object_permission\` |`,

    `## Real scenario: filtering + pagination with no extra code

Client calls: \`GET /api/courses/?level=intermediate&search=python&ordering=-price&page=2\`

Because \`filterset_fields\`, \`search_fields\`, and \`ordering_fields\` are declared on the ViewSet, DRF handles all of this automatically. The response is:
\`\`\`json
{
  "count": 38,
  "next": "/api/courses/?level=intermediate&search=python&ordering=-price&page=3",
  "previous": "/api/courses/?level=intermediate&search=python&ordering=-price&page=1",
  "results": [...]
}
\`\`\``,

    `## Junior mistakes + fix

| Mistake | What happens | Fix |
|---|---|---|
| Accept \`author_id\` from client body on create | Any user can claim any author | Set author in \`perform_create(serializer)\` from \`request.user\` |
| Use same serializer for list and detail | Serializer fetches all nested data even on list page | Separate list (light) vs detail (full) serializers |
| No pagination | Endpoint returns all rows forever | Always set \`DEFAULT_PAGINATION_CLASS\` |
| Expose \`password_hash\` in response | Security breach | Use \`write_only=True\` or exclude from \`fields\` |
| Forget \`select_related\` in queryset | N+1 queries even in DRF | Add it in \`get_queryset()\` |`,
  ],

  // ─── Lesson 5: Django Auth & Admin ──────────────────────────────────────
  'dj-auth': [
    `## Beginner TL;DR — Django Auth

Django ships a complete auth system. You get for free:
- \`User\` model with hashed passwords
- Login / Logout / Password reset views
- Session management
- Groups and permissions

**The one rule:** Create a custom user model before your first migration. You cannot change it later without wiping the database.`,

    `## Full reference: authentication vs authorisation

\`\`\`
Authentication = "Who are you?"  → user.is_authenticated, request.user
Authorisation  = "What can you do?" → permissions, groups
Session        = "Stay logged in" → cookies + DB/cache
CSRF           = "Protect forms"  → automatic in templates, needed for AJAX
\`\`\`

\`\`\`python
# Checking identity and rights in views
if request.user.is_authenticated:
    pass                                        # any logged-in user

if request.user.is_staff:
    pass                                        # admin panel access

if request.user.is_superuser:
    pass                                        # all permissions bypassed

# Object-level permission check
if request.user.has_perm("courses.add_course"):
    pass                                        # model-level permission

if request.user.has_perm("courses.can_publish_courses", obj=course):
    pass                                        # object-level permission
\`\`\``,

    `## Full reference: custom user model setup

\`\`\`python
# accounts/models.py — do this FIRST, before any migration
from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    """
    Extend with project-specific fields.
    AbstractUser gives you: username, email, first_name, last_name,
    is_staff, is_active, date_joined, last_login, groups, user_permissions.
    """
    bio       = models.TextField(blank=True)
    avatar    = models.ImageField(upload_to="avatars/", blank=True)
    plan      = models.CharField(max_length=20, default="free",
                                 choices=[("free","Free"),("pro","Pro")])

# settings.py — must be set before first migration
AUTH_USER_MODEL = "accounts.User"

# ⚠ Always reference User via get_user_model(), never import directly:
from django.contrib.auth import get_user_model
User = get_user_model()
\`\`\``,

    `## Full reference: built-in auth URL wiring

\`\`\`python
# accounts/urls.py
from django.contrib.auth import views as auth_views
from . import views

urlpatterns = [
    path("login/",  auth_views.LoginView.as_view(template_name="accounts/login.html"),  name="login"),
    path("logout/", auth_views.LogoutView.as_view(), name="logout"),
    path("signup/", views.signup, name="signup"),

    # Full password reset flow (4 URLs — all built-in)
    path("password-reset/",
         auth_views.PasswordResetView.as_view(template_name="accounts/pw-reset.html"),
         name="password_reset"),
    path("password-reset/done/",
         auth_views.PasswordResetDoneView.as_view(), name="password_reset_done"),
    path("password-reset/<uidb64>/<token>/",
         auth_views.PasswordResetConfirmView.as_view(), name="password_reset_confirm"),
    path("password-reset/complete/",
         auth_views.PasswordResetCompleteView.as_view(), name="password_reset_complete"),
]
\`\`\`

\`\`\`python
# settings.py — tell Django where to redirect after login/logout
LOGIN_URL          = "/accounts/login/"
LOGIN_REDIRECT_URL = "/dashboard/"
LOGOUT_REDIRECT_URL = "/"
\`\`\``,

    `## Full reference: admin customisation you will use daily

\`\`\`python
# courses/admin.py
from django.contrib import admin
from django.utils.html import format_html
from .models import Course, Category

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    # What columns appear in the list view
    list_display  = ["title", "author", "level", "price_display", "is_published"]

    # Which columns have clickable filters in the sidebar
    list_filter   = ["level", "is_published", "category"]

    # Search box covers these fields
    search_fields = ["title", "description", "author__username"]

    # Edit cells directly in list without opening each row
    list_editable = ["is_published"]

    # Auto-fill slug from title as you type
    prepopulated_fields = {"slug": ("title",)}

    # These fields cannot be changed in the form
    readonly_fields = ["created_at", "updated_at"]

    # Group fields into sections in the detail page
    fieldsets = [
        ("Content",  {"fields": ("title", "slug", "description")}),
        ("Metadata", {"fields": ("level", "price", "category", "author")}),
        ("Status",   {"fields": ("is_published", "created_at", "updated_at")}),
    ]

    # Bulk action in the list view
    @admin.action(description="Publish selected courses")
    def publish_courses(self, request, queryset):
        updated = queryset.update(is_published=True)
        self.message_user(request, f"{updated} courses published.")
    actions = [publish_courses]

    # Custom display column with HTML
    def price_display(self, obj):
        label = "FREE" if obj.price == 0 else f"\${obj.price}"
        color = "green" if obj.price == 0 else "inherit"
        return format_html('<span style="color:{}">{}</span>', color, label)
    price_display.short_description = "Price"
\`\`\``,

    `## Real scenario: editorial workflow with groups

\`\`\`
Groups defined:
  editors    → can add/change courses (draft only)
  publishers → can add/change/publish courses (can_publish_courses permission)

In views:
  @permission_required("courses.can_publish_courses", raise_exception=True)
  def publish_course(request, slug): ...

In admin:
  actions = [publish_courses]  # only visible to users with that permission
\`\`\`

Result: editors can draft, publishers can go live — enforced at server level not just UI.`,

    `## Junior mistakes + fix

| Mistake | What happens | Fix |
|---|---|---|
| Skip custom user model | Cannot add profile fields later without DB wipe | Always define custom User before first migration |
| Hide publish button in UI but not check permission in view | Any user can POST to publish URL directly | Enforce permissions in view/decorator |
| Use \`User.objects.get()\` instead of \`get_user_model()\` | Breaks with custom user model in packages | Always use \`get_user_model()\` |
| Forget \`AUTH_USER_MODEL\` in settings | Django uses default User, breaking your custom model | Set it before running any migrations |`,
  ],

  // ─── Lesson 6: Flask ────────────────────────────────────────────────────
  'py-flask': [
    `## Beginner TL;DR — Flask

Flask is a micro-framework: it gives you routing and request/response handling. Everything else (ORM, validation, auth) you pick and wire yourself.

**Pronunciation:** FLASK (rhymes with "mask")

**Use Flask when:**
- Small microservice or webhook handler
- ML model serving (Flask + PyTorch/ONNX)
- Internal tool with non-standard storage
- You need maximum control over every component`,

    `## Terminology

| Term | Meaning |
|---|---|
| Application factory | \`create_app()\` function that builds the Flask app — enables testing and multiple instances |
| Blueprint | A group of related routes that can be registered on the app |
| Extension | Flask plugin (Flask-SQLAlchemy, Flask-Migrate, Flask-Login) that integrates via \`init_app()\` |
| Context | Flask's mechanism to share per-request state (g, current_app, request, session) |
| \`g\` | Flask's request-scoped scratchpad object for sharing data within one request |`,

    `## Full reference: Flask request object

\`\`\`python
from flask import request

# HTTP method
request.method         # → "GET", "POST", "PATCH", etc.

# URL / path
request.path           # → "/api/courses/"
request.url            # → "http://localhost:5000/api/courses/?page=2"
request.host           # → "localhost:5000"

# Query parameters — ?key=value in URL
request.args.get("page", 1, type=int)    # → 2
request.args.getlist("tag")              # → ["python", "web"]

# JSON body (POST/PATCH/PUT)
data = request.get_json()                # → dict or None
data = request.get_json(force=True)      # skip Content-Type check

# Form data
request.form.get("email")               # HTML form POST

# Files
file = request.files.get("avatar")      # uploaded file
file.filename                           # original filename
file.save("/path/to/destination")

# Headers
token = request.headers.get("Authorization")
\`\`\``,

    `## Full reference: Flask response patterns

\`\`\`python
from flask import jsonify, make_response, redirect, url_for

# JSON response (auto-sets Content-Type: application/json)
return jsonify({"status": "ok"})                 # 200
return jsonify({"status": "ok"}), 201            # custom status
return jsonify({"error": "not found"}), 404

# Plain text
return "Hello", 200

# With custom headers
response = make_response(jsonify({"ok": True}), 200)
response.headers["X-Request-ID"] = "abc123"
return response

# Redirect
return redirect("/new-path")
return redirect(url_for("courses.list"))   # named route

# Abort immediately with an error code
from flask import abort
abort(404)    # raises HTTPException which Flask turns into a 404 response
abort(403)    # forbidden
\`\`\``,

    `## Full reference: Blueprint structure

\`\`\`python
# app/courses/routes.py
from flask import Blueprint

courses_bp = Blueprint("courses", __name__, url_prefix="/api/courses")

@courses_bp.route("/", methods=["GET"])
def list_courses():
    return jsonify([])

@courses_bp.route("/<int:course_id>", methods=["GET"])
def get_course(course_id):
    return jsonify({"id": course_id})

# app/__init__.py
def create_app(config="config.Development"):
    app = Flask(__name__)
    app.config.from_object(config)

    db.init_app(app)
    migrate.init_app(app, db)

    from .courses.routes import courses_bp
    app.register_blueprint(courses_bp)

    return app
\`\`\`

URLs generated:
\`\`\`
GET /api/courses/
GET /api/courses/42
\`\`\``,

    `## Real scenario: ML model serving with Flask

\`\`\`python
# Load model once at startup (not on every request)
model = None

def create_app():
    app = Flask(__name__)
    global model
    model = load_model("model.onnx")  # heavy — run once

    @app.route("/predict", methods=["POST"])
    def predict():
        data = request.get_json()
        result = model.predict(data["features"])
        return jsonify({"prediction": result.tolist()})

    return app
\`\`\`

Flask is perfect here: no ORM overhead, no admin, just a clean HTTP wrapper around your model.`,

    `## Junior mistakes + fix

| Mistake | What happens | Fix |
|---|---|---|
| Global \`app = Flask(__name__)\` (no factory) | Cannot test with different config, no multiple instances | Use \`create_app()\` factory pattern |
| No input validation on JSON body | Crashes on missing/wrong fields | Use Marshmallow schema or Pydantic to validate |
| Returning Python dict instead of \`jsonify()\` | TypeError in Flask < 2.2 | Always use \`jsonify()\` explicitly |
| Calling \`request.get_json()\` without checking None | AttributeError when body is empty | \`data = request.get_json() or {}\` |
| All routes in \`app.py\` | Becomes unmaintainable quickly | Use Blueprints from the start |`,
  ],

  // ─── Lesson 7: Framework Mastery ────────────────────────────────────────
  'py-frameworks-mastery': [
    `## Framework decision matrix — read this before every new project

| Criterion | Django | DRF (on Django) | Flask | FastAPI |
|---|---|---|---|---|
| Admin + backoffice needed | ✅ built-in | ✅ uses Django admin | ❌ build it | ❌ build it |
| REST API on existing Django app | — | ✅ best choice | — | — |
| Pure API, new project | ⚠ overkill | ⚠ overkill | ✅ small scale | ✅ best choice |
| Async I/O throughout | ❌ limited | ❌ limited | ❌ not native | ✅ native |
| Auto Swagger docs | ❌ manual | ✅ drf-spectacular | ❌ manual | ✅ built-in |
| ML model serving | ⚠ heavy | ❌ | ✅ minimal | ✅ typed + async |
| Learning curve | High | Medium | Low | Low-Medium |
| Community + packages | Very large | Very large | Large | Growing fast |`,

    `## Professional vocabulary reference

| Term | Pronunciation | Definition |
|---|---|---|
| ORM | O-R-M | Object-Relational Mapper |
| MTV | M-T-V | Model-Template-View (Django's name for MVC) |
| DRF | D-R-F | Django REST Framework |
| ASGI | AZ-ghee | Async Server Gateway Interface |
| WSGI | WIZ-ghee | Web Server Gateway Interface |
| Serializer | se-RIAL-eye-zer | Converts data between types (Python ↔ JSON) |
| ViewSet | VIEW-set | Class grouping all CRUD actions for one resource |
| Router | ROW-ter | Auto-generates URL patterns for ViewSets |
| Migration | my-GRAY-shun | Version-controlled schema change script |
| Blueprint | BLOO-print | Flask's route grouping mechanism |`,

    `## 4-week practice plan

**Week 1 — Django foundation:**
Build a blog with: custom User model, Post model, category FK, admin customisation, login/logout, published/draft toggle.

**Week 2 — DRF API:**
Expose the same blog as a REST API: serializers, ViewSets, JWT auth, pagination, search, ordering. Use \`drf-spectacular\` for OpenAPI docs.

**Week 3 — Flask microservice:**
Build a notification service: blueprints, SQLAlchemy, Marshmallow validation, health check endpoint, structured JSON errors.

**Week 4 — Cross-framework integration:**
Call your Flask service from your Django app via \`httpx\`. Observe the architectural boundary, then write the \`comparison.md\` with real timings and code-size metrics.`,

    `## Code-reading guide: how to read an unfamiliar Django/Flask project

\`\`\`
1. Read settings.py / config.py first → understand INSTALLED_APPS, DB, and AUTH_USER_MODEL
2. Read root urls.py → see top-level routing structure
3. Read each app's models.py → understand data shape and relationships
4. Read views.py or viewsets.py → see how data flows per endpoint
5. Read serializers.py (DRF) or schemas.py (Flask) → see data contract
6. Run the test suite → see what behaviour is verified
\`\`\``,
  ],
}

function toBlocks(markdowns: string[]): ContentBlock[] {
  return markdowns.map(markdown => ({ type: 'text' as const, markdown }))
}

export function applyPhase4FrameworkEnhancements(lessons: Lesson[]): Lesson[] {
  return lessons.map(lesson => {
    const markdowns = phase4Blocks[lesson.id]
    if (!markdowns) return lesson
    return {
      ...lesson,
      content: [...toBlocks(markdowns), ...lesson.content],
    }
  })
}
