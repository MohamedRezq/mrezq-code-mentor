'use client'

import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { LessonCompleteButton } from '@/components/progress/lesson-complete-button'
import type { Lesson } from '@/types/lesson'

interface LessonPageFooterProps {
  moduleId: string
  lessonId: string
  prev?: Lesson
  next?: Lesson
}

export function LessonPageFooter({ moduleId, lessonId, prev, next }: LessonPageFooterProps) {
  return (
    <nav className="mt-16 pt-8 border-t border-border space-y-6">
      <div className="flex justify-center">
        <LessonCompleteButton lessonId={lessonId} moduleId={moduleId} />
      </div>

      <div className="flex items-center justify-between gap-4">
        {prev ? (
          <Link
            href={`/learn/${moduleId}/${prev.id}`}
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group max-w-xs"
          >
            <ArrowLeft className="w-4 h-4 shrink-0 group-hover:-translate-x-0.5 transition-transform" />
            <span className="truncate">{prev.title}</span>
          </Link>
        ) : (
          <div />
        )}

        {next ? (
          <Link
            href={`/learn/${moduleId}/${next.id}`}
            className="flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors group max-w-xs"
          >
            <span className="truncate text-right">{next.title}</span>
            <ArrowRight className="w-4 h-4 shrink-0 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        ) : (
          <Link
            href={`/learn/${moduleId}`}
            className="flex items-center gap-2 text-sm font-semibold text-green-600 hover:text-green-500 transition-colors"
          >
            <span>Module complete</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        )}
      </div>
    </nav>
  )
}
