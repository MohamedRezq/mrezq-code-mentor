'use client'

import { createContext, useContext, type ReactNode } from 'react'
import { useLessonProgress, type LessonProgressState } from '@/lib/hooks/use-lesson-progress'

const ProgressContext = createContext<LessonProgressState | null>(null)

export function ProgressProvider({ children }: { children: ReactNode }) {
  const progress = useLessonProgress()
  return <ProgressContext.Provider value={progress}>{children}</ProgressContext.Provider>
}

export function useProgress() {
  const ctx = useContext(ProgressContext)
  if (!ctx) {
    throw new Error('useProgress must be used within ProgressProvider')
  }
  return ctx
}
