'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAuth } from '@/components/providers/auth-provider'
import { isSupabaseConfigured } from '@/lib/supabase/config'
import {
  addLocalCompletion,
  readLocalCompletions,
  writeLocalCompletions,
} from '@/lib/progress/local-progress'

export interface MarkCompleteResult {
  ok: boolean
  synced: boolean
  message?: string
}

export interface LessonProgressState {
  completedIds: Set<string>
  loading: boolean
  isAuthenticated: boolean
  isLessonComplete: (lessonId: string) => boolean
  markLessonComplete: (lessonId: string, timeSpentSeconds?: number) => Promise<MarkCompleteResult>
  refresh: () => Promise<void>
  moduleProgress: (lessonIds: string[]) => { completed: number; total: number; percent: number }
}

export function useLessonProgress(): LessonProgressState {
  const { isAuthenticated, loading: authLoading } = useAuth()
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    setLoading(true)
    const localIds = readLocalCompletions()

    try {
      if (!isSupabaseConfigured() || !isAuthenticated) {
        setCompletedIds(new Set(localIds))
        return
      }

      const res = await fetch('/api/progress', { credentials: 'include' })

      if (!res.ok) {
        setCompletedIds(new Set(localIds))
        return
      }

      const data = (await res.json()) as {
        completions?: { lesson_id: string }[]
      }
      const serverIds = (data.completions ?? []).map((c) => c.lesson_id)
      const merged = new Set([...localIds, ...serverIds])
      setCompletedIds(merged)
      writeLocalCompletions([...merged])
    } catch {
      setCompletedIds(new Set(localIds))
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated])

  useEffect(() => {
    if (authLoading) return
    void refresh()
  }, [authLoading, isAuthenticated, refresh])

  const markLessonComplete = useCallback(
    async (lessonId: string, timeSpentSeconds = 0): Promise<MarkCompleteResult> => {
      addLocalCompletion(lessonId)
      setCompletedIds((prev) => new Set([...prev, lessonId]))

      if (!isSupabaseConfigured()) {
        return {
          ok: true,
          synced: false,
          message: 'Saved on this device. Configure Supabase to sync across devices.',
        }
      }

      if (!isAuthenticated) {
        return {
          ok: true,
          synced: false,
          message: 'Saved on this device. Sign in to sync progress to your account.',
        }
      }

      const res = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ lessonId, timeSpentSeconds }),
      })

      const body = (await res.json().catch(() => ({}))) as { error?: string }

      if (!res.ok) {
        const msg =
          typeof body.error === 'string' && body.error.length > 0
            ? body.error
            : 'Could not save progress. Try signing in again.'
        return { ok: true, synced: false, message: msg }
      }

      return { ok: true, synced: true, message: 'Lesson marked complete!' }
    },
    [isAuthenticated]
  )

  const isLessonComplete = useCallback(
    (lessonId: string) => completedIds.has(lessonId),
    [completedIds]
  )

  const moduleProgress = useCallback(
    (lessonIds: string[]) => {
      const total = lessonIds.length
      const completed = lessonIds.filter((id) => completedIds.has(id)).length
      const percent = total === 0 ? 0 : Math.round((completed / total) * 100)
      return { completed, total, percent }
    },
    [completedIds]
  )

  return useMemo(
    () => ({
      completedIds,
      loading: loading || authLoading,
      isAuthenticated,
      isLessonComplete,
      markLessonComplete,
      refresh,
      moduleProgress,
    }),
    [
      completedIds,
      loading,
      authLoading,
      isAuthenticated,
      isLessonComplete,
      markLessonComplete,
      refresh,
      moduleProgress,
    ]
  )
}
