import type { Lesson } from '@/types/lesson'

export const nextjsLessons: Lesson[] = [
  {
    id: 'fe-nextjs-app-router',
    moduleId: 'frontend',
    phaseId: 'fe-nextjs',
    phaseNumber: 3,
    order: 9,
    title: 'Next.js App Router Fundamentals',
    description: 'Build route-driven applications with layouts, nested routes, and server-first architecture in Next.js.',
    duration: '45 min',
    difficulty: 'beginner',
    objectives: [
      'Understand file-based routing in the App Router',
      'Use layouts for shared UI and route segments',
      'Differentiate server and client components',
      'Design clean route structures for scalability',
    ],
    content: [
      {
        type: 'text',
        markdown: `## App Router Mental Model

Next.js App Router is filesystem-driven:

- \`app/page.tsx\` -> route page
- \`app/layout.tsx\` -> shared wrapper for descendants
- nested folders -> nested routes

Default to server components for performance and security; add \`'use client'\` only when interactivity is required.`,
      },
      {
        type: 'code',
        language: 'tsx',
        filename: 'app/learn/layout.tsx',
        code: `export default function LearnLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 md:grid-cols-[260px_1fr]">
      <aside className="rounded-xl border p-4">Lesson Sidebar</aside>
      <main>{children}</main>
    </div>
  )
}`,
      },
      {
        type: 'code',
        language: 'tsx',
        filename: 'app/learn/[moduleId]/[lessonId]/page.tsx',
        code: `type LessonPageProps = {
  params: Promise<{ moduleId: string; lessonId: string }>
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { moduleId, lessonId } = await params

  return (
    <article className="space-y-4">
      <h1 className="text-2xl font-semibold">Lesson {lessonId}</h1>
      <p className="text-muted-foreground">Module: {moduleId}</p>
    </article>
  )
}`,
        explanation:
          'Route params are available on the server and should drive data loading at the page level when possible.',
      },
      {
        type: 'exercise',
        title: 'Build Module + Lesson Routes',
        description:
          'Create route folders for `/learn`, `/learn/[moduleId]`, and `/learn/[moduleId]/[lessonId]` with a shared learning layout and breadcrumb navigation.',
        language: 'tsx',
        starterCode: `app/
  learn/
    // TODO: add layout.tsx
    // TODO: add page.tsx
    [moduleId]/
      // TODO: add page.tsx
      [lessonId]/
        // TODO: add page.tsx`,
        solution: `// Expected route tree:
// app/learn/layout.tsx
// app/learn/page.tsx
// app/learn/[moduleId]/page.tsx
// app/learn/[moduleId]/[lessonId]/page.tsx
//
// Use shared layout for sidebar and keep pages server-first.`,
        hints: [
          'Use one layout per route segment where UI is shared',
          'Keep route params typed and explicit',
          'Avoid duplicating wrappers across pages',
        ],
      },
    ],
  },
  {
    id: 'fe-nextjs-data-fetching',
    moduleId: 'frontend',
    phaseId: 'fe-nextjs',
    phaseNumber: 3,
    order: 10,
    title: 'Data Fetching, Caching, and Revalidation',
    description: 'Use server-side data fetching with cache strategies that balance freshness and performance.',
    duration: '55 min',
    difficulty: 'intermediate',
    objectives: [
      'Fetch data in server components safely',
      'Use `revalidate` and cache control intentionally',
      'Apply tag-based revalidation patterns',
      'Design data boundaries between server and client components',
    ],
    content: [
      {
        type: 'code',
        language: 'tsx',
        filename: 'app/learn/[moduleId]/page.tsx',
        code: `type Module = {
  id: string
  title: string
  description: string
}

async function getModule(moduleId: string): Promise<Module | null> {
  const res = await fetch(\`https://api.example.com/modules/\${moduleId}\`, {
    next: { revalidate: 300, tags: [\`module-\${moduleId}\`] },
  })
  if (!res.ok) return null
  return res.json()
}

export default async function ModulePage({
  params,
}: {
  params: Promise<{ moduleId: string }>
}) {
  const { moduleId } = await params
  const module = await getModule(moduleId)

  if (!module) return <p>Module not found.</p>

  return (
    <section className="space-y-3">
      <h1 className="text-2xl font-semibold">{module.title}</h1>
      <p className="text-muted-foreground">{module.description}</p>
    </section>
  )
}`,
        explanation:
          'Server component fetching reduces client bundle size and keeps API credentials away from the browser.',
      },
      {
        type: 'code',
        language: 'tsx',
        filename: 'app/actions/revalidate-module.ts',
        code: `'use server'

import { revalidateTag } from 'next/cache'

export async function revalidateModule(moduleId: string) {
  revalidateTag(\`module-\${moduleId}\`)
}`,
      },
      {
        type: 'callout',
        tone: 'production',
        title: 'Caching Strategy Rule',
        content:
          'Cache aggressively for content that changes rarely (course metadata), and revalidate precisely for content that changes often (user progress). Over-invalidating destroys performance.',
      },
      {
        type: 'exercise',
        title: 'Design Cache Policy for Learn Pages',
        description:
          'Define caching for three data types: lesson content (rarely changes), user progress (frequent), and AI hints (on-demand). Implement fetch options and revalidation triggers.',
        language: 'tsx',
        starterCode: `// TODO:
// lesson content fetch
// user progress fetch
// ai hints fetch
// add revalidation strategy`,
        solution: `// Suggested policy:
// lesson content: revalidate every 1h (or tag invalidation on publish)
// user progress: no-store (always fresh per request)
// ai hints: no-store (request-specific output)
//
// Use next: { revalidate, tags } where appropriate.`,
        hints: [
          'Per-user data should usually skip shared cache',
          'Use tags for selective invalidation, not global busting',
          'Measure cache hit rates in production telemetry',
        ],
      },
    ],
  },
  {
    id: 'fe-nextjs-rendering-seo',
    moduleId: 'frontend',
    phaseId: 'fe-nextjs',
    phaseNumber: 3,
    order: 11,
    title: 'Rendering Strategies and SEO',
    description: 'Apply SSR, static generation, and metadata APIs to ship fast pages that rank and share well.',
    duration: '50 min',
    difficulty: 'intermediate',
    objectives: [
      'Choose between static, dynamic, and hybrid rendering',
      'Implement route metadata for SEO and social cards',
      'Use streaming and loading states for perceived performance',
      'Build indexable content pages with clean semantics',
    ],
    content: [
      {
        type: 'code',
        language: 'tsx',
        filename: 'app/learn/[moduleId]/[lessonId]/page.tsx',
        code: `import type { Metadata } from 'next'

type Props = {
  params: Promise<{ moduleId: string; lessonId: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { moduleId, lessonId } = await params
  return {
    title: \`\${lessonId} | \${moduleId} | SeniorPath\`,
    description: 'Deep engineering lesson with code examples and exercises.',
    openGraph: {
      title: \`Lesson \${lessonId}\`,
      description: 'SeniorPath learning content',
      type: 'article',
    },
  }
}

export default async function LessonPage({ params }: Props) {
  const { lessonId } = await params
  return (
    <article>
      <h1 className="text-2xl font-semibold">Lesson {lessonId}</h1>
      <p className="text-muted-foreground">Production-grade lesson content.</p>
    </article>
  )
}`,
      },
      {
        type: 'code',
        language: 'tsx',
        filename: 'app/learn/[moduleId]/loading.tsx',
        code: `export default function LoadingModule() {
  return (
    <div className="space-y-3">
      <div className="h-8 w-48 animate-pulse rounded bg-muted" />
      <div className="h-4 w-full animate-pulse rounded bg-muted" />
      <div className="h-4 w-4/5 animate-pulse rounded bg-muted" />
    </div>
  )
}`,
        explanation:
          'Route-level loading states improve perceived speed while server data is fetched.',
      },
      {
        type: 'exercise',
        title: 'SEO Upgrade for Lesson Pages',
        description:
          'Add `generateMetadata` with title/description/Open Graph and ensure each lesson page has semantic headings and indexable text. Add a loading state and verify page source includes metadata.',
        language: 'tsx',
        starterCode: `// TODO:
// 1) implement generateMetadata
// 2) ensure semantic article structure
// 3) add loading.tsx
// 4) verify rendered metadata`,
        solution: `// Expected checks:
// - unique title per lesson
// - descriptive meta description
// - OG tags present
// - <h1> + content in HTML source
// - loading fallback visible during slow fetch`,
        hints: [
          'Metadata should be route-specific, not generic',
          'Ensure title and description reflect lesson content',
          'Use browser View Source or curl to verify SSR output',
        ],
      },
    ],
  },
  {
    id: 'fe-nextjs-server-actions',
    moduleId: 'frontend',
    phaseId: 'fe-nextjs',
    phaseNumber: 3,
    order: 12,
    title: 'Server Actions, Forms, and Mutations',
    description: 'Handle secure mutations with server actions, validation, and optimistic UX patterns.',
    duration: '55 min',
    difficulty: 'advanced',
    objectives: [
      'Implement server actions for trusted mutations',
      'Validate form input on the server boundary',
      'Revalidate views after mutations',
      'Build optimistic form UX with robust failure handling',
    ],
    content: [
      {
        type: 'code',
        language: 'tsx',
        filename: 'app/learn/[moduleId]/actions.ts',
        code: `'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'

const ProgressSchema = z.object({
  lessonId: z.string().min(1),
  completed: z.boolean(),
})

export async function updateLessonProgress(formData: FormData) {
  const parsed = ProgressSchema.safeParse({
    lessonId: formData.get('lessonId'),
    completed: formData.get('completed') === 'true',
  })

  if (!parsed.success) {
    return { ok: false, error: 'Invalid input' }
  }

  // Replace with real persistence (DB/API)
  console.log('Persist progress:', parsed.data)

  revalidatePath('/learn')
  return { ok: true }
}`,
      },
      {
        type: 'code',
        language: 'tsx',
        filename: 'app/learn/[moduleId]/ProgressForm.tsx',
        code: `'use client'

import { useTransition } from 'react'
import { updateLessonProgress } from './actions'

export function ProgressForm({ lessonId }: { lessonId: string }) {
  const [isPending, startTransition] = useTransition()

  return (
    <form
      action={formData => {
        startTransition(async () => {
          await updateLessonProgress(formData)
        })
      }}
      className="space-y-2"
    >
      <input type="hidden" name="lessonId" value={lessonId} />
      <input type="hidden" name="completed" value="true" />
      <button
        type="submit"
        className="rounded bg-primary px-3 py-2 text-primary-foreground"
        disabled={isPending}
      >
        {isPending ? 'Saving...' : 'Mark as complete'}
      </button>
    </form>
  )
}`,
        explanation:
          'Server actions keep mutation logic on the server while preserving simple form ergonomics in the UI.',
      },
      {
        type: 'callout',
        tone: 'warning',
        title: 'Validation Must Be Server-Side',
        content:
          'Client validation improves UX but is never sufficient for security. Always validate again in server actions before writing data.',
      },
      {
        type: 'exercise',
        title: 'Add Feedback Mutation Flow',
        description:
          'Build a server action to submit lesson feedback with fields (`lessonId`, `rating`, `comment`). Validate with Zod, persist to a store, revalidate the lesson page, and show success/error state in UI.',
        language: 'tsx',
        starterCode: `// TODO:
// 1) create FeedbackSchema
// 2) implement submitFeedback action
// 3) call action from form
// 4) show pending/success/error UI states`,
        solution: `// Expected behavior:
// - invalid rating/comment rejected server-side
// - action returns structured result { ok, error? }
// - UI displays pending + completion feedback
// - lesson page revalidated after successful submit`,
        hints: [
          'Use `safeParse` for explicit validation paths',
          'Return serializable action results',
          'Revalidate only affected paths, not the whole app',
        ],
      },
    ],
  },
]
