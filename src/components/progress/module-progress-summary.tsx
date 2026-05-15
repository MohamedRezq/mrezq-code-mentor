'use client'

import { Progress } from '@/components/ui/progress'
import { useProgress } from '@/components/progress/progress-provider'

interface ModuleProgressSummaryProps {
  lessonIds: string[]
  label?: string
}

export function ModuleProgressSummary({
  lessonIds,
  label = 'Your progress',
}: ModuleProgressSummaryProps) {
  const { isAuthenticated, moduleProgress, loading } = useProgress()

  if (loading || !isAuthenticated || lessonIds.length === 0) return null

  const { completed, total, percent } = moduleProgress(lessonIds)

  return (
    <div className="rounded-xl border border-border bg-card p-5 mb-8">
      <div className="flex items-center justify-between gap-4 mb-2">
        <p className="text-sm font-semibold text-foreground">{label}</p>
        <p className="text-sm text-muted-foreground tabular-nums">
          {completed} / {total} lessons · {percent}%
        </p>
      </div>
      <Progress value={percent} className="h-2" />
    </div>
  )
}
