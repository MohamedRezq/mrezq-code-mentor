import type { LessonEnhancement } from '@/lib/curriculum/reviewer-types'
import { clarify, roadmapIntro } from '@/lib/curriculum/reviewer-merge'

export const FRONTEND_REVIEWER: Record<string, LessonEnhancement> = {
  'fe-html-semantic': {
    intro: [roadmapIntro('frontend', 'Web core', 'semantic HTML, landmarks, forms, a11y')],
    outro: [clarify('button vs link', 'Use `<button>` for actions on the page; `<a href>` for navigation. Wrong element breaks keyboard and screen-reader behavior.')],
  },
  'fe-css-layout': { intro: [roadmapIntro('frontend', 'Web core', 'flexbox, grid, responsive layout')] },
  'fe-js-dom': { intro: [roadmapIntro('javascript', 'Web core', 'DOM, events, fetch basics')] },
  'fe-responsive-accessibility': {
    intro: [roadmapIntro('frontend', 'Web core', 'media queries, WCAG, focus states')],
  },
  'fe-react-components': { intro: [roadmapIntro('react', 'React', 'components, props, composition')] },
  'fe-react-hooks': {
    intro: [roadmapIntro('react', 'React', 'useState, useEffect, useMemo, useCallback')],
    outro: [clarify('useEffect deps', 'The dependency array is a contract: every value from component scope used inside the effect must be listed or you risk stale closures.')],
  },
  'fe-react-state-management': { intro: [roadmapIntro('react', 'React', 'Zustand, TanStack Query, server state')] },
  'fe-react-performance': { intro: [roadmapIntro('react', 'React', 'memo, virtualization, profiling')] },
  'fe-nextjs-app-router': { intro: [roadmapIntro('nextjs', 'Next.js', 'App Router, layouts, RSC intro')] },
  'fe-nextjs-data-fetching': { intro: [roadmapIntro('nextjs', 'Next.js', 'fetch, cache, revalidate')] },
  'fe-nextjs-rendering-seo': { intro: [roadmapIntro('nextjs', 'Next.js', 'SSR, SSG, ISR, metadata')] },
  'fe-nextjs-server-actions': { intro: [roadmapIntro('nextjs', 'Next.js', 'Server Actions, mutations')] },
  'fe-quality-testing': { intro: [roadmapIntro('frontend', 'Quality', 'Vitest, React Testing Library')] },
  'fe-quality-accessibility': { intro: [roadmapIntro('frontend', 'Quality', 'axe, keyboard, ARIA')] },
  'fe-quality-performance': { intro: [roadmapIntro('frontend', 'Quality', 'Lighthouse, Core Web Vitals')] },
  'fe-quality-ci-quality-gates': { intro: [roadmapIntro('frontend', 'Quality', 'CI lint, test, preview deploy')] },
}
