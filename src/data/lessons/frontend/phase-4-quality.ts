import type { Lesson } from '@/types/lesson'

export const qualityLessons: Lesson[] = [
  {
    id: 'fe-quality-testing',
    moduleId: 'frontend',
    phaseId: 'fe-quality',
    phaseNumber: 4,
    order: 13,
    title: 'Frontend Testing Pyramid (Unit, Integration, E2E)',
    description: 'Build reliable UI with practical testing layers using Vitest, Testing Library, and Playwright.',
    duration: '55 min',
    difficulty: 'intermediate',
    objectives: [
      'Use the frontend testing pyramid to choose the right test type',
      'Write meaningful component tests with Testing Library',
      'Create resilient end-to-end tests for critical user flows',
      'Avoid brittle snapshot-only and implementation-detail tests',
    ],
    content: [
      {
        type: 'text',
        markdown: `## Test by User Value, Not by Framework Internals

A healthy frontend test strategy:

- **Unit tests**: pure logic and utility functions
- **Integration tests**: component behavior and interactions
- **E2E tests**: critical end-user journeys

Do not over-test implementation details (private state shape, exact class names) that users never observe.`,
      },
      {
        type: 'code',
        language: 'tsx',
        filename: 'LessonFilter.test.tsx',
        code: `import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import { LessonList } from './LessonList'

describe('LessonList', () => {
  it('filters lessons by query', async () => {
    render(<LessonList />)

    const input = screen.getByPlaceholderText(/search lessons/i)
    await userEvent.type(input, 'css')

    expect(screen.getByText(/css layout/i)).toBeInTheDocument()
    expect(screen.queryByText(/semantic html/i)).not.toBeInTheDocument()
  })
})`,
        explanation:
          'This test verifies visible behavior from a user perspective instead of testing internal state directly.',
      },
      {
        type: 'code',
        language: 'typescript',
        filename: 'learn-flow.spec.ts',
        code: `import { test, expect } from '@playwright/test'

test('user can open lesson and mark complete', async ({ page }) => {
  await page.goto('/learn/frontend')
  await page.getByRole('link', { name: /semantic html/i }).click()
  await expect(page.getByRole('heading', { level: 1 })).toContainText(/semantic/i)
  await page.getByRole('button', { name: /mark as complete/i }).click()
  await expect(page.getByText(/completed/i)).toBeVisible()
})`,
      },
      {
        type: 'exercise',
        title: 'Test a Real Learning Flow',
        description:
          'Write: (1) one unit test for a lesson utility function, (2) one integration test for a searchable lesson list, and (3) one Playwright E2E test for lesson completion flow.',
        language: 'typescript',
        starterCode: `// TODO:
// - utility.test.ts
// - LessonList.test.tsx
// - learn-flow.spec.ts`,
        solution: `// Expected outcomes:
// 1) Utility handles edge cases (empty input, invalid ID)
// 2) Integration test verifies visible list filtering behavior
// 3) E2E test validates route navigation + completion UI state`,
        hints: [
          'Use role- and label-based selectors first',
          'Keep E2E tests for high-value critical paths',
          'Prefer deterministic fixtures over random test data',
        ],
      },
    ],
  },
  {
    id: 'fe-quality-accessibility',
    moduleId: 'frontend',
    phaseId: 'fe-quality',
    phaseNumber: 4,
    order: 14,
    title: 'Accessibility Audits and Fixes',
    description: 'Run repeatable accessibility audits and ship interfaces usable by keyboard and assistive technologies.',
    duration: '50 min',
    difficulty: 'intermediate',
    objectives: [
      'Run automated accessibility checks in local and CI',
      'Perform keyboard and screen-reader manual audits',
      'Fix common issues: contrast, focus, labels, heading order',
      'Prevent regressions with accessibility test coverage',
    ],
    content: [
      {
        type: 'code',
        language: 'tsx',
        filename: 'A11yButton.tsx',
        code: `type A11yButtonProps = {
  onClick: () => void
  loading?: boolean
}

export function A11yButton({ onClick, loading = false }: A11yButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      aria-busy={loading}
      className="rounded-md border px-3 py-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600"
    >
      {loading ? 'Saving...' : 'Save progress'}
    </button>
  )
}`,
      },
      {
        type: 'code',
        language: 'typescript',
        filename: 'a11y.test.tsx',
        code: `import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { axe } from 'jest-axe'
import { A11yButton } from './A11yButton'

describe('A11yButton accessibility', () => {
  it('has no basic axe violations', async () => {
    const { container } = render(<A11yButton onClick={() => {}} />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})`,
        explanation:
          'Automated tools catch many issues early, but still require manual keyboard and screen-reader checks for full coverage.',
      },
      {
        type: 'callout',
        tone: 'important',
        title: 'Accessibility Review Checklist',
        content:
          'For every feature: tab through all controls, test focus visibility, verify labels/roles, check heading structure, and confirm color contrast for text and controls.',
      },
      {
        type: 'exercise',
        title: 'Accessibility Hardening Sprint',
        description:
          'Audit one full page and fix at least: one focus issue, one contrast issue, one missing label, and one keyboard interaction bug. Add one automated a11y test for the fixed page.',
        language: 'tsx',
        starterCode: `// TODO:
// 1) run audit (Lighthouse + manual keyboard pass)
// 2) implement 4 fixes
// 3) add one jest-axe test
// 4) document before/after results`,
        solution: `// Example fix log:
// - Added focus-visible styles for interactive controls
// - Updated low-contrast gray text to accessible color
// - Added labels/id association for form inputs
// - Added keyboard handling for expandable sections
// - Added jest-axe smoke test to prevent regression`,
        hints: [
          'Automated checks are baseline, not full audit',
          'Focus styles must be visible on keyboard navigation',
          'Document evidence of fixes for team learning',
        ],
      },
    ],
  },
  {
    id: 'fe-quality-performance',
    moduleId: 'frontend',
    phaseId: 'fe-quality',
    phaseNumber: 4,
    order: 15,
    title: 'Performance Optimization and Core Web Vitals',
    description: 'Measure and improve frontend performance using Core Web Vitals and bundle-level optimizations.',
    duration: '55 min',
    difficulty: 'intermediate',
    objectives: [
      'Understand LCP, INP, and CLS and their business impact',
      'Reduce JavaScript and CSS payload size',
      'Optimize images, fonts, and render paths',
      'Build a measurable performance optimization workflow',
    ],
    content: [
      {
        type: 'text',
        markdown: `## Performance Is a Product Feature

Core Web Vitals health targets:
- **LCP** <= 2.5s
- **INP** <= 200ms
- **CLS** <= 0.1

Performance work should always be metric-driven. Do not optimize blindly.`,
      },
      {
        type: 'code',
        language: 'tsx',
        filename: 'OptimizedHero.tsx',
        code: `import Image from 'next/image'

export function OptimizedHero() {
  return (
    <section className="grid gap-6 md:grid-cols-2">
      <div className="space-y-3">
        <h1 className="text-3xl font-bold">Become a Senior Engineer</h1>
        <p className="text-muted-foreground">
          Learn with practical lessons, projects, and production workflows.
        </p>
      </div>
      <Image
        src="/images/hero-learning.png"
        alt="Learner dashboard preview"
        width={960}
        height={540}
        priority
        className="h-auto w-full rounded-xl"
      />
    </section>
  )
}`,
        explanation:
          'Explicit image dimensions and priority loading improve LCP and reduce layout shifts.',
      },
      {
        type: 'code',
        language: 'typescript',
        filename: 'perf-checklist.ts',
        code: `export const performanceChecklist = [
  'Measure baseline with Lighthouse and Web Vitals in production',
  'Reduce unused JS (code-split heavy routes/components)',
  'Optimize hero media and preload critical assets',
  'Defer non-critical third-party scripts',
  'Set caching headers for static assets',
  'Re-measure and compare before/after metrics',
]`,
      },
      {
        type: 'exercise',
        title: 'Web Vitals Improvement Plan',
        description:
          'Given a page with LCP 3.9s, INP 280ms, CLS 0.19, define and implement at least 3 changes to improve each metric. Re-run measurements and report deltas.',
        language: 'typescript',
        starterCode: `// TODO:
// 1) identify likely LCP element
// 2) identify interaction bottlenecks (INP)
// 3) identify CLS-causing layout shifts
// 4) apply fixes and capture new metrics`,
        solution: `// Example improvement report:
// LCP: 3.9s -> 2.4s (optimized hero image + preload)
// INP: 280ms -> 170ms (reduced heavy handlers and rerenders)
// CLS: 0.19 -> 0.05 (fixed media dimensions + reserved ad slot space)`,
        hints: [
          'Optimize what users see first (above-the-fold content)',
          'Stabilize layout with explicit dimensions',
          'Keep interaction handlers fast and lightweight',
        ],
      },
    ],
  },
  {
    id: 'fe-quality-ci-quality-gates',
    moduleId: 'frontend',
    phaseId: 'fe-quality',
    phaseNumber: 4,
    order: 16,
    title: 'Quality Gates in CI',
    description: 'Enforce quality with automated checks for type safety, tests, accessibility, and performance budgets.',
    duration: '45 min',
    difficulty: 'advanced',
    objectives: [
      'Define practical quality gates for frontend repositories',
      'Fail CI on meaningful regressions, not noise',
      'Set thresholds for tests, lint, and performance budgets',
      'Create a feedback loop that helps developers fix fast',
    ],
    content: [
      {
        type: 'code',
        language: 'yaml',
        filename: '.github/workflows/frontend-quality.yml',
        code: `name: Frontend Quality

on:
  pull_request:
    branches: [main]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm run test -- --run
      - run: npm run test:a11y
      - run: npm run build
      - run: npm run perf:budget`,
        explanation:
          'Quality gates should run fast enough for developer feedback while still blocking critical regressions.',
      },
      {
        type: 'callout',
        tone: 'production',
        title: 'Good Gates Are Specific',
        content:
          'Bad gate: "quality failed". Good gate: "INP budget exceeded by 40ms on /learn/frontend". Make failures actionable so teams can fix quickly.',
      },
      {
        type: 'exercise',
        title: 'Define Frontend Release Gate Policy',
        description:
          'Create a release gate policy with concrete thresholds for lint, type errors, test pass rate, accessibility violations, and performance budgets. Include exceptions and escalation rules.',
        language: 'markdown',
        starterCode: `# Frontend Quality Gate Policy

## Required checks
- Lint:
- Typecheck:
- Unit/Integration tests:
- Accessibility:
- Performance:

## Exceptions
- 

## Escalation
- `,
        solution: `# Frontend Quality Gate Policy

## Required checks
- Lint: zero errors
- Typecheck: zero errors
- Unit/Integration tests: 100% pass
- Accessibility: zero critical violations on changed routes
- Performance: no >10% regression in LCP/INP/CLS budgets on key pages

## Exceptions
- Time-boxed waivers only with owner + follow-up issue

## Escalation
- Failed gate blocks merge unless approved by tech lead`,
        hints: [
          'Set thresholds your team can realistically enforce',
          'Track waived failures and enforce expiry dates',
          'Make policy visible in CONTRIBUTING docs',
        ],
      },
    ],
  },
]
