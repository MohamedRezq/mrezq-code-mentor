'use client'

import Link from 'next/link'
import { CheckCircle2, Circle, ChevronDown, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import type { Module, PhaseInfo } from '@/types/lesson'
import { getLessonsByPhase } from '@/data/lessons'

interface LessonSidebarProps {
  module: Module
  activeLessonId?: string
}

function PhaseSection({
  phase,
  moduleId,
  activeLessonId,
}: {
  phase: PhaseInfo
  moduleId: string
  activeLessonId?: string
}) {
  const lessons = getLessonsByPhase(phase.id)
  const isActivePhase = lessons.some(l => l.id === activeLessonId)
  const [open, setOpen] = useState(isActivePhase)

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-3 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted/60 group"
      >
        <span className="text-left">
          Phase {phase.number}: {phase.title}
        </span>
        {open
          ? <ChevronDown className="w-3.5 h-3.5 shrink-0" />
          : <ChevronRight className="w-3.5 h-3.5 shrink-0" />
        }
      </button>

      {open && (
        <div className="mt-1 mb-2 space-y-0.5">
          {lessons.map(lesson => {
            const isActive = lesson.id === activeLessonId
            const isComplete = false // TODO: wire to progress store
            return (
              <Link
                key={lesson.id}
                href={`/learn/${moduleId}/${lesson.id}`}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors ${
                  isActive
                    ? 'bg-primary text-primary-foreground font-medium'
                    : 'text-foreground/70 hover:text-foreground hover:bg-muted/60'
                }`}
              >
                {isComplete ? (
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-green-500" />
                ) : (
                  <Circle className="w-3.5 h-3.5 shrink-0 opacity-40" />
                )}
                <span className="truncate leading-snug">{lesson.title}</span>
                <span className="ml-auto shrink-0 text-xs opacity-50">{lesson.duration}</span>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

export function LessonSidebar({ module, activeLessonId }: LessonSidebarProps) {
  const totalLessons = module.phases.reduce((sum, p) => sum + getLessonsByPhase(p.id).length, 0)

  return (
    <aside className="w-72 shrink-0 border-r border-border bg-background h-full overflow-y-auto">
      {/* Module Header */}
      <div className="px-4 py-5 border-b border-border">
        <Link
          href={`/learn/${module.id}`}
          className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider"
        >
          ← Module {module.number}
        </Link>
        <h2 className="font-bold text-foreground mt-1 leading-snug">{module.title}</h2>
        <p className="text-xs text-muted-foreground mt-1">{totalLessons} lessons · {module.duration}</p>
      </div>

      {/* Phases + Lessons */}
      <nav className="px-2 py-4 space-y-1">
        {module.phases.map(phase => (
          <PhaseSection
            key={phase.id}
            phase={phase}
            moduleId={module.id}
            activeLessonId={activeLessonId}
          />
        ))}
      </nav>
    </aside>
  )
}
