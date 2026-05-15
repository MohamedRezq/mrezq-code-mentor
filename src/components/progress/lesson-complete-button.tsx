'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CheckCircle2, Loader2, LogIn } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useProgress } from '@/components/progress/progress-provider'
import { useToast } from '@/lib/hooks/use-toast'
import { isSupabaseConfigured } from '@/lib/supabase/config'

interface LessonCompleteButtonProps {
  lessonId: string
  moduleId: string
}

export function LessonCompleteButton({ lessonId, moduleId }: LessonCompleteButtonProps) {
  const { isAuthenticated, isLessonComplete, markLessonComplete, loading, refresh } = useProgress()
  const { toast } = useToast()
  const [saving, setSaving] = useState(false)
  const complete = isLessonComplete(lessonId)

  const loginHref = `/login?redirect=/learn/${moduleId}/${lessonId}`

  if (loading) {
    return (
      <Button variant="outline" disabled className="gap-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading progress…
      </Button>
    )
  }

  const handleComplete = async () => {
    if (complete || saving) return
    setSaving(true)
    const result = await markLessonComplete(lessonId)
    setSaving(false)

    if (result.ok) {
      toast({
        title: result.synced ? 'Progress saved' : 'Saved locally',
        description: result.message,
        variant: result.synced ? 'default' : 'default',
      })
      if (!result.synced && !isAuthenticated) {
        // nudge sign-in after local save
      }
      await refresh()
    } else {
      toast({
        title: 'Could not save',
        description: result.message ?? 'Please try again.',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="flex flex-col items-center gap-3">
      {!isAuthenticated && isSupabaseConfigured() && (
        <p className="text-sm text-muted-foreground text-center max-w-md">
          <Link href={loginHref} className="text-primary font-semibold hover:underline">
            Sign in
          </Link>{' '}
          to sync progress across devices. You can still mark complete locally below.
        </p>
      )}

      <div className="flex flex-wrap items-center justify-center gap-3">
        {!isAuthenticated && (
          <Button variant="outline" asChild className="gap-2">
            <Link href={loginHref}>
              <LogIn className="h-4 w-4" />
              Log in
            </Link>
          </Button>
        )}

        <Button
          type="button"
          variant={complete ? 'secondary' : 'default'}
          disabled={complete || saving}
          onClick={() => void handleComplete()}
          className="gap-2"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <CheckCircle2 className={`h-4 w-4 ${complete ? 'text-green-600' : ''}`} />
          )}
          {complete ? 'Lesson completed' : 'Mark lesson complete'}
        </Button>
      </div>
    </div>
  )
}
