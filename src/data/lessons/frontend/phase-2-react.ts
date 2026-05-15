import type { Lesson } from '@/types/lesson'

export const reactLessons: Lesson[] = [
  {
    id: 'fe-react-components',
    moduleId: 'frontend',
    phaseId: 'fe-react',
    phaseNumber: 2,
    order: 5,
    title: 'React Components, Props, and State',
    description: 'Build reusable UI with component composition, typed props, and predictable local state.',
    duration: '45 min',
    difficulty: 'beginner',
    objectives: [
      'Create reusable functional components with TypeScript props',
      'Manage local state with `useState`',
      'Render lists and conditional UI safely',
      'Use composition patterns instead of repetitive markup',
    ],
    content: [
      {
        type: 'text',
        markdown: `## React Mental Model

React turns UI into a function of state:

\`UI = f(state)\`

When state changes, React re-renders the component tree. The goal is predictable, composable UI with clear data flow from parent to child.`,
      },
      {
        type: 'code',
        language: 'tsx',
        filename: 'LessonCard.tsx',
        code: `type LessonCardProps = {
  title: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  duration: string
  completed?: boolean
}

export function LessonCard({
  title,
  difficulty,
  duration,
  completed = false,
}: LessonCardProps) {
  return (
    <article className="rounded-xl border p-4">
      <header className="mb-2 flex items-center justify-between">
        <h3 className="font-semibold">{title}</h3>
        <span className="text-xs uppercase">{difficulty}</span>
      </header>
      <p className="text-sm text-muted-foreground">{duration}</p>
      {completed ? (
        <p className="mt-2 text-xs text-green-600">Completed</p>
      ) : (
        <p className="mt-2 text-xs text-amber-600">In progress</p>
      )}
    </article>
  )
}`,
        explanation:
          'Typed props create self-documenting component APIs and prevent invalid usage at compile time.',
      },
      {
        type: 'code',
        language: 'tsx',
        filename: 'LessonList.tsx',
        code: `import { useState } from 'react'
import { LessonCard } from './LessonCard'

type Lesson = {
  id: string
  title: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  duration: string
}

const LESSONS: Lesson[] = [
  { id: '1', title: 'Semantic HTML', difficulty: 'beginner', duration: '35 min' },
  { id: '2', title: 'CSS Layout', difficulty: 'beginner', duration: '40 min' },
  { id: '3', title: 'DOM Events', difficulty: 'beginner', duration: '45 min' },
]

export function LessonList() {
  const [query, setQuery] = useState('')

  const filtered = LESSONS.filter(lesson =>
    lesson.title.toLowerCase().includes(query.toLowerCase()),
  )

  return (
    <section className="space-y-4">
      <input
        className="w-full rounded border px-3 py-2"
        placeholder="Search lessons..."
        value={query}
        onChange={e => setQuery(e.target.value)}
      />
      <div className="grid gap-3 md:grid-cols-2">
        {filtered.map(lesson => (
          <LessonCard key={lesson.id} {...lesson} />
        ))}
      </div>
    </section>
  )
}`,
      },
      {
        type: 'exercise',
        title: 'Build a Study Tracker Component',
        description:
          'Create a `StudyTracker` component with state for completed lessons. Show total completed count, render lessons from an array, and allow toggling completion with a button on each lesson.',
        language: 'tsx',
        starterCode: `import { useState } from 'react'

type Lesson = { id: string; title: string; completed: boolean }

const initialLessons: Lesson[] = [
  { id: '1', title: 'HTML', completed: false },
  { id: '2', title: 'CSS', completed: false },
]

export function StudyTracker() {
  // TODO: add state
  // TODO: add toggle handler
  // TODO: render completion count + lesson list
  return null
}`,
        solution: `import { useState } from 'react'

type Lesson = { id: string; title: string; completed: boolean }

const initialLessons: Lesson[] = [
  { id: '1', title: 'HTML', completed: false },
  { id: '2', title: 'CSS', completed: false },
]

export function StudyTracker() {
  const [lessons, setLessons] = useState(initialLessons)

  const toggleLesson = (id: string) => {
    setLessons(prev =>
      prev.map(lesson =>
        lesson.id === id ? { ...lesson, completed: !lesson.completed } : lesson,
      ),
    )
  }

  const completedCount = lessons.filter(l => l.completed).length

  return (
    <section className="space-y-3">
      <p className="text-sm">Completed: {completedCount}/{lessons.length}</p>
      {lessons.map(lesson => (
        <div key={lesson.id} className="flex items-center justify-between rounded border p-2">
          <span>{lesson.title}</span>
          <button onClick={() => toggleLesson(lesson.id)}>
            {lesson.completed ? 'Undo' : 'Complete'}
          </button>
        </div>
      ))}
    </section>
  )
}`,
        hints: [
          'Use immutable state updates with `map`',
          'Compute derived values (`completedCount`) from state',
          'Use stable IDs for React keys',
        ],
      },
    ],
  },
  {
    id: 'fe-react-hooks',
    moduleId: 'frontend',
    phaseId: 'fe-react',
    phaseNumber: 2,
    order: 6,
    title: 'React Hooks and Side Effects',
    description: 'Use `useEffect`, `useMemo`, and `useCallback` correctly to avoid bugs and unnecessary re-renders.',
    duration: '50 min',
    difficulty: 'intermediate',
    objectives: [
      'Handle side effects with clean dependency management',
      'Avoid stale closure bugs in event handlers and effects',
      'Use memoization hooks only when they provide measurable value',
      'Structure components for predictable render behavior',
    ],
    content: [
      {
        type: 'code',
        language: 'tsx',
        filename: 'UserSearch.tsx',
        code: `import { useEffect, useState } from 'react'

type User = { id: number; name: string; email: string }

export function UserSearch() {
  const [query, setQuery] = useState('')
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!query.trim()) {
      setUsers([])
      return
    }

    const controller = new AbortController()
    const run = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch(
          \`/api/users?query=\${encodeURIComponent(query)}\`,
          { signal: controller.signal },
        )
        if (!res.ok) throw new Error('Failed to load users')
        const data: User[] = await res.json()
        setUsers(data)
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          setError((err as Error).message)
        }
      } finally {
        setLoading(false)
      }
    }

    run()
    return () => controller.abort()
  }, [query])

  return (
    <section className="space-y-3">
      <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search users..." />
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}
      <ul>{users.map(u => <li key={u.id}>{u.name} - {u.email}</li>)}</ul>
    </section>
  )
}`,
        explanation:
          'AbortController in effects prevents race conditions where slow old requests overwrite newer results.',
      },
      {
        type: 'callout',
        tone: 'warning',
        title: 'Most Common Hook Mistake',
        content:
          'Missing dependencies in `useEffect` causes stale data and subtle bugs. If the linter warns about deps, treat it as a correctness issue, not style.',
      },
      {
        type: 'exercise',
        title: 'Fix a Stale Closure Timer',
        description:
          'You have a timer component where the interval callback reads old state values. Refactor it so count increments correctly and interval cleanup is handled safely.',
        language: 'tsx',
        starterCode: `import { useEffect, useState } from 'react'

export function Counter() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setCount(count + 1) // stale closure bug
    }, 1000)
    return () => clearInterval(id)
  }, [])

  return <p>{count}</p>
}`,
        solution: `import { useEffect, useState } from 'react'

export function Counter() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setCount(prev => prev + 1)
    }, 1000)
    return () => clearInterval(id)
  }, [])

  return <p>{count}</p>
}`,
        hints: [
          'Use functional state updates for interval callbacks',
          'Keep one interval setup/cleanup cycle',
          'Test unmount behavior to ensure cleanup runs',
        ],
      },
    ],
  },
  {
    id: 'fe-react-state-management',
    moduleId: 'frontend',
    phaseId: 'fe-react',
    phaseNumber: 2,
    order: 7,
    title: 'State Management Patterns (Context, Zustand, Query State)',
    description: 'Choose the right state strategy for local UI state, shared client state, and server state.',
    duration: '55 min',
    difficulty: 'intermediate',
    objectives: [
      'Differentiate local state, global client state, and server state',
      'Use Context for stable global UI config',
      'Use Zustand for ergonomic shared state',
      'Use TanStack Query for async server state and caching',
    ],
    content: [
      {
        type: 'text',
        markdown: `## Pick State Tools by State Type

- **Local UI state**: \`useState\` in component
- **Shared client state**: Context or Zustand
- **Server state**: TanStack Query

Do not use one tool for everything. Wrong state architecture causes complexity and stale-data bugs.`,
      },
      {
        type: 'code',
        language: 'tsx',
        filename: 'theme-context.tsx',
        code: `import { createContext, useContext, useMemo, useState } from 'react'

type Theme = 'light' | 'dark'
type ThemeContextValue = {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light')
  const value = useMemo(
    () => ({
      theme,
      toggleTheme: () => setTheme(prev => (prev === 'light' ? 'dark' : 'light')),
    }),
    [theme],
  )
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider')
  return ctx
}`,
      },
      {
        type: 'code',
        language: 'tsx',
        filename: 'progress-store.ts',
        code: `import { create } from 'zustand'

type ProgressState = {
  completedLessonIds: string[]
  markComplete: (lessonId: string) => void
}

export const useProgressStore = create<ProgressState>(set => ({
  completedLessonIds: [],
  markComplete: lessonId =>
    set(state => ({
      completedLessonIds: state.completedLessonIds.includes(lessonId)
        ? state.completedLessonIds
        : [...state.completedLessonIds, lessonId],
    })),
}))`,
        explanation:
          'Zustand is useful for small-to-medium shared client state without Context nesting overhead.',
      },
      {
        type: 'exercise',
        title: 'Split State by Concern',
        description:
          'Refactor an app that keeps everything in one top-level state object. Move theme/auth preferences to client state, keep server-fetched lesson data in TanStack Query, and keep form draft state local.',
        language: 'tsx',
        starterCode: `// TODO:
// 1) identify local vs shared vs server state
// 2) move shared state to store/context
// 3) move server state to query hooks
// 4) keep form state local`,
        solution: `// Suggested split:
// local: search input, modal open/close, form drafts
// shared client: theme, onboarding flags
// server: lessons list, progress snapshot, profile data
//
// Result: fewer rerenders, simpler data flow, cleaner component boundaries.`,
        hints: [
          'If data comes from API and needs caching, it is server state',
          'If only one component needs it, keep it local',
          'Shared state should be minimal and stable',
        ],
      },
    ],
  },
  {
    id: 'fe-react-performance',
    moduleId: 'frontend',
    phaseId: 'fe-react',
    phaseNumber: 2,
    order: 8,
    title: 'React Performance and Rendering Optimization',
    description: 'Diagnose render bottlenecks and apply practical optimizations without premature complexity.',
    duration: '50 min',
    difficulty: 'intermediate',
    objectives: [
      'Use React DevTools profiler to find expensive renders',
      'Apply memoization strategically (`memo`, `useMemo`, `useCallback`)',
      'Use list virtualization for large collections',
      'Reduce unnecessary re-renders via component boundaries',
    ],
    content: [
      {
        type: 'code',
        language: 'tsx',
        filename: 'optimized-list.tsx',
        code: `import { memo, useMemo, useState } from 'react'

type Item = { id: number; name: string; score: number }

const Row = memo(function Row({ item }: { item: Item }) {
  return <li>{item.name} - {item.score}</li>
})

export function Scoreboard({ items }: { items: Item[] }) {
  const [minScore, setMinScore] = useState(0)

  const filtered = useMemo(
    () => items.filter(item => item.score >= minScore),
    [items, minScore],
  )

  return (
    <section className="space-y-2">
      <input
        type="range"
        min={0}
        max={100}
        value={minScore}
        onChange={e => setMinScore(Number(e.target.value))}
      />
      <ul>
        {filtered.map(item => (
          <Row key={item.id} item={item} />
        ))}
      </ul>
    </section>
  )
}`,
        explanation:
          'Memoization only helps when props are stable and render cost is meaningful; always profile before and after.',
      },
      {
        type: 'callout',
        tone: 'tip',
        title: 'Performance Workflow',
        content:
          'Measure first with profiler -> identify hot renders -> optimize smallest high-impact area -> re-measure. Avoid adding memoization blindly.',
      },
      {
        type: 'exercise',
        title: 'Optimize a Slow Lesson Table',
        description:
          'Given a table rendering 2,000 lessons with filters and sorting, reduce render time by at least 40%. You may apply memoized selectors, row memoization, and virtualization.',
        language: 'tsx',
        starterCode: `// TODO:
// 1) profile baseline render time
// 2) memoize expensive sorting/filtering
// 3) avoid inline callback churn where needed
// 4) add virtualization for large lists`,
        solution: `// Expected optimization path:
// - derive filtered/sorted data with useMemo
// - use React.memo row component
// - use react-window for virtualization
// - keep stable row props
//
// Report:
// baseline render: 120ms
// optimized render: 62ms`,
        hints: [
          'Virtualization gives the biggest win for long lists',
          'Avoid passing new object literals to memoized children',
          'Memoizing trivial work can hurt readability more than it helps',
        ],
      },
    ],
  },
]
