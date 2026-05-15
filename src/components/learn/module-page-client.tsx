'use client'

import Link from 'next/link'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { getLessonsByPhase } from '@/data/lessons'
import { useProgress } from '@/components/progress/progress-provider'
import { ModuleProgressSummary } from '@/components/progress/module-progress-summary'
import type { Module, PhaseInfo } from '@/types/lesson'

const DIFFICULTY_STYLES = {
  beginner: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  intermediate: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  advanced: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
}

interface ModuleLessonListProps {
  courseModule: Module
}

export function ModuleLessonList({ courseModule }: ModuleLessonListProps) {
  const { isLessonComplete } = useProgress()
  const allLessonIds = courseModule.phases.flatMap((p) =>
    getLessonsByPhase(p.id).map((l) => l.id)
  )

  return (
    <>
      <ModuleProgressSummary lessonIds={allLessonIds} />

      <div className="space-y-10">
        {courseModule.phases.map((phase: PhaseInfo) => {
          const phaseLessons = getLessonsByPhase(phase.id)
          return (
            <div key={phase.id} id={`phase-${phase.id}`} className="scroll-mt-24">
              <div className="mb-5">
                <h2 className="text-xl font-bold text-foreground">
                  Phase {phase.number}: {phase.title}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {phase.description} · {phase.duration}
                </p>
              </div>
              <div className="space-y-2">
                {phaseLessons.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-border p-6 text-center text-muted-foreground text-sm">
                    Lessons coming soon
                  </div>
                ) : (
                  phaseLessons.map((lesson, i) => {
                    const done = isLessonComplete(lesson.id)
                    return (
                      <Link
                        key={lesson.id}
                        href={`/learn/${courseModule.id}/${lesson.id}`}
                        className="flex items-center gap-4 rounded-xl border border-border bg-card hover:border-primary/40 hover:bg-muted/40 transition-all p-4 group"
                      >
                        <span
                          className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 ${
                            done
                              ? 'bg-green-500/15 text-green-600'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {done ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                            {lesson.title}
                          </div>
                          <div className="text-sm text-muted-foreground mt-0.5 truncate">
                            {lesson.description}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full font-medium ${DIFFICULTY_STYLES[lesson.difficulty]}`}
                          >
                            {lesson.difficulty}
                          </span>
                          <span className="text-xs text-muted-foreground">{lesson.duration}</span>
                          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                      </Link>
                    )
                  })
                )}
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}
