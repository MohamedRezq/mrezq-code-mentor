import type { LessonEnhancement } from '@/lib/curriculum/reviewer-types'
import { clarify, roadmapIntro } from '@/lib/curriculum/reviewer-merge'

/** Final reviewer pass — Module 01 Frontend (16 lessons). */
export const FRONTEND_REVIEWER: Record<string, LessonEnhancement> = {
  'fe-html-semantic': {
    intro: [roadmapIntro('frontend', 'Web core', 'semantic HTML, landmarks, forms, a11y')],
    outro: [clarify('button vs link', 'Use `<button>` for actions on the page; `<a href>` for navigation. Wrong element breaks keyboard and screen-reader behavior.')],
  },
  'fe-css-layout': {
    intro: [roadmapIntro('frontend', 'Web core', 'flexbox, grid, responsive layout')],
    outro: [clarify('Flex vs Grid', 'Flex: one-dimensional rows OR columns. Grid: two-dimensional layouts. Most app shells use both.')],
  },
  'fe-js-dom': {
    intro: [roadmapIntro('javascript', 'Web core', 'DOM, events, fetch basics')],
    outro: [clarify('Event delegation', 'Attach one listener on a parent; use `event.target` to handle children — fewer listeners, works for dynamic lists.')],
  },
  'fe-responsive-accessibility': {
    intro: [roadmapIntro('frontend', 'Web core', 'media queries, WCAG, focus states')],
    outro: [clarify('Focus visible', 'Never remove outline without a replacement. `:focus-visible` styles keyboard focus without ugly rings on mouse clicks.')],
  },
  'fe-react-components': {
    intro: [roadmapIntro('react', 'React', 'components, props, composition')],
    outro: [clarify('Composition over props explosion', 'Prefer `children` and small composable components instead of 20 boolean props on one mega-component.')],
  },
  'fe-react-hooks': {
    intro: [roadmapIntro('react', 'React', 'useState, useEffect, useMemo, useCallback')],
    outro: [clarify('useEffect deps', 'The dependency array is a contract: every value from component scope used inside the effect must be listed or you risk stale closures.')],
  },
  'fe-react-state-management': {
    intro: [roadmapIntro('react', 'React', 'Zustand, TanStack Query, server state')],
    outro: [clarify('Server vs client state', 'TanStack Query owns server data (cache, stale, refetch). Zustand/Context for UI-only state. Do not duplicate API data in global client stores.')],
  },
  'fe-react-performance': {
    intro: [roadmapIntro('react', 'React', 'memo, virtualization, profiling')],
    outro: [clarify('Measure first', 'Use React Profiler before blanket `memo`/`useMemo` — premature memo adds complexity without fixing real bottlenecks.')],
  },
  'fe-nextjs-app-router': {
    intro: [roadmapIntro('nextjs', 'Next.js', 'App Router, layouts, RSC intro')],
    outro: [clarify('Server Components default', 'Files in `app/` are Server Components unless `"use client"`. Fetch on server; pass serializable props to client islands.')],
  },
  'fe-nextjs-data-fetching': {
    intro: [roadmapIntro('nextjs', 'Next.js', 'fetch, cache, revalidate')],
    outro: [clarify('cache tags', 'Use `revalidateTag` after mutations so lists refresh without full page reload — pairs with `fetch(..., { next: { tags: [...] } })`.')],
  },
  'fe-nextjs-rendering-seo': {
    intro: [roadmapIntro('nextjs', 'Next.js', 'SSR, SSG, ISR, metadata')],
    outro: [clarify('Metadata API', 'Export `metadata` or `generateMetadata` from layouts/pages — replaces manual `<head>` juggling for SEO.')],
  },
  'fe-nextjs-server-actions': {
    intro: [roadmapIntro('nextjs', 'Next.js', 'Server Actions, mutations')],
    outro: [clarify('Validate on server', 'Server Actions run on the server — re-validate all inputs there even if the client already validated.')],
  },
  'fe-quality-testing': {
    intro: [roadmapIntro('frontend', 'Quality', 'Vitest, React Testing Library')],
    outro: [clarify('Test behavior', 'Query by role/label (`getByRole`), not implementation details (`container.querySelector`). Users do not see CSS classes.')],
  },
  'fe-quality-accessibility': {
    intro: [roadmapIntro('frontend', 'Quality', 'axe, keyboard, ARIA')],
    outro: [clarify('ARIA last resort', 'Fix semantic HTML first. `aria-label` on a `<motion.div>` is worse than a real `<button>`.')],
  },
  'fe-quality-performance': {
    intro: [roadmapIntro('frontend', 'Quality', 'Lighthouse, Core Web Vitals')],
    outro: [clarify('LCP drivers', 'Largest Contentful Paint: optimize hero image (priority, sizes), reduce blocking JS, use font-display swap.')],
  },
  'fe-quality-ci-quality-gates': {
    intro: [roadmapIntro('frontend', 'Quality', 'CI lint, test, preview deploy')],
    outro: [clarify('Fail fast in CI', 'Lint + typecheck + unit tests on every PR. Catch accessibility regressions with axe in CI where possible.')],
  },
}
