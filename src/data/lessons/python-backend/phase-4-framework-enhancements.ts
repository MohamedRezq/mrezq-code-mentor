import type { ContentBlock, Lesson } from '@/types/lesson'

const phase4Blocks: Record<string, string[]> = {
  'dj-intro': [
    `## Beginner TL;DR

Django is a full web framework:
- Model = database tables
- View = request handling logic
- Template = HTML response

Start with one project and one app, then split by domain as the codebase grows.`,
    `## Quick reference: first project commands

\`\`\`bash
django-admin startproject seniorpath .
python manage.py startapp courses
python manage.py runserver
\`\`\`

Expected output shape:
\`\`\`
Starting development server at http://127.0.0.1:8000/
\`\`\``,
    `## Real scenario

You are launching an internal learning portal.  
Use Django first because auth, admin, ORM, forms, and routing are included by default, so you ship the first version faster.`,
  ],
  'dj-models': [
    `## Beginner TL;DR

Django models are Python classes that map to SQL tables.
- Change model class
- Run \`makemigrations\`
- Run \`migrate\`

That is the schema workflow you repeat for the life of the app.`,
    `## Quick reference: ORM reads with expected results

\`\`\`python
published = Course.objects.filter(is_published=True).count()
one = Course.objects.filter(slug="python-basics").first()
print(published)
print(one is None)
\`\`\`

Expected output example:
\`\`\`
12
False
\`\`\``,
    `## Common junior mistakes

- Calling related fields in loops without \`select_related\` or \`prefetch_related\` (N+1 queries)
- Editing old migration files after teammates already applied them
- Using \`get()\` when missing rows are possible (raises exception) instead of \`first()\``,
  ],
  'dj-views': [
    `## Beginner TL;DR

Function-based views are explicit and easier for beginners.  
Class-based views reduce repeated CRUD code when patterns repeat.

Use FBV first, then refactor to CBV when you see duplication.`,
    `## Quick reference: URL + view flow

\`\`\`python
# urls.py
path("courses/<slug:slug>/", views.course_detail, name="detail")
\`\`\`

\`\`\`python
# views.py
def course_detail(request, slug):
    ...
\`\`\`

Expected behavior:
- GET /courses/python-basics/ calls \`course_detail(request, "python-basics")\``,
    `## Output walkthrough

\`\`\`python
from django.http import JsonResponse

def health(request):
    return JsonResponse({"status": "ok"})
\`\`\`

HTTP response body:
\`\`\`json
{"status":"ok"}
\`\`\``,
  ],
  'dj-drf': [
    `## Beginner TL;DR

DRF separates concerns:
- Serializer: validate and shape data
- ViewSet: endpoint behavior
- Router: URL generation

This keeps APIs consistent across the project.`,
    `## Quick reference: DRF HTTP mapping

| Request | Method called |
|---|---|
| GET /api/courses/ | list |
| POST /api/courses/ | create |
| GET /api/courses/1/ | retrieve |
| PATCH /api/courses/1/ | partial_update |
| DELETE /api/courses/1/ | destroy |`,
    `## Real scenario

Frontend team asks for filtering and pagination with minimum custom code.  
DRF gives this by configuration in \`REST_FRAMEWORK\` and \`filter_backends\`, so your API remains clean and predictable.`,
  ],
  'dj-auth': [
    `## Beginner TL;DR

Always start with a custom user model in Django projects.
- Set \`AUTH_USER_MODEL\` early
- Use built-in auth views for login/logout/password reset
- Use permissions for role-controlled actions`,
    `## Quick reference: auth checks

\`\`\`python
if request.user.is_authenticated:
    print("logged in")

if request.user.has_perm("courses.can_publish_courses"):
    print("can publish")
\`\`\`

Expected output example:
\`\`\`
logged in
can publish
\`\`\``,
    `## Real scenario

Your content team needs a backoffice workflow:
- Editor can draft
- Publisher can publish

Implement this with groups + permissions, then enforce it in views and admin actions.`,
  ],
  'py-flask': [
    `## Beginner TL;DR

Flask is minimal and explicit:
- you choose libraries
- you wire components yourself

Use it when you want a small service with full control over every part.`,
    `## Quick reference: response patterns

\`\`\`python
from flask import jsonify
print({"ok": True})
\`\`\`

\`\`\`python
return jsonify({"status": "ok"}), 200
return jsonify({"error": "not found"}), 404
\`\`\``,
    `## Output walkthrough

\`\`\`python
payload = {"courses": [{"id": 1, "title": "Python"}], "total": 1}
print(payload["total"])
\`\`\`

Expected:
\`\`\`
1
\`\`\``,
  ],
  'py-frameworks-mastery': [
    `## Beginner TL;DR

Framework mastery is not from reading only.  
Repeat this loop:
1) learn one concept
2) build one feature
3) test and review trade-offs`,
    `## Quick reference: weekly implementation target

- Week 1: Django app + auth + admin
- Week 2: DRF API + filtering + pagination
- Week 3: Flask microservice + validation
- Week 4: FastAPI async API + profiling notes`,
    `## Real scenario

Interview asks: "When would you pick Django vs FastAPI?"  
If you built the same product API with both stacks, you can answer with evidence (delivery speed, complexity, runtime profile), not theory.`,
  ],
}

function toBlocks(markdowns: string[]): ContentBlock[] {
  return markdowns.map(markdown => ({ type: 'text', markdown }))
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
