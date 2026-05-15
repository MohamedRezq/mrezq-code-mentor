import Link from 'next/link'
import { Map, Footprints, Sparkles } from 'lucide-react'
import { getLessonsByPhase, getLessonsByModule } from '@/data/lessons'
import type { PhaseInfo } from '@/types/lesson'

interface ModuleLearningMapProps {
  moduleId: string
  moduleTitle: string
  phases: PhaseInfo[]
}

export function ModuleLearningMap({ moduleId, moduleTitle, phases }: ModuleLearningMapProps) {
  const moduleLessons = getLessonsByModule(moduleId)
  const totalPlanned = phases.reduce((n, p) => n + p.lessonIds.length, 0)
  const published = moduleLessons.length

  return (
    <section
      className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-muted/40 via-card to-primary/[0.04] p-6 sm:p-8 mb-12"
      aria-labelledby="learning-map-heading"
    >
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-12 -left-8 h-40 w-40 rounded-full bg-violet-500/10 blur-3xl" />

      <div className="relative flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-xl">
          <div className="flex items-center gap-2 text-primary mb-2">
            <Map className="w-5 h-5" aria-hidden />
            <span className="text-xs font-bold uppercase tracking-widest">Learning map</span>
          </div>
          <h2 id="learning-map-heading" className="text-2xl font-black text-foreground tracking-tight">
            Where you are in {moduleTitle}
          </h2>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
            Each stop is a phase. Follow top to bottom (or left to right on wide screens) like a trail — sign in to
            track completed lessons; checkmarks appear in the sidebar and lesson list.
          </p>
          <dl className="mt-4 flex flex-wrap gap-4 text-sm">
            <div>
              <dt className="text-muted-foreground font-medium">Phases</dt>
              <dd className="font-bold text-foreground tabular-nums">{phases.length}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground font-medium">Lessons live</dt>
              <dd className="font-bold text-foreground tabular-nums">
                {published}
                {totalPlanned > published ? (
                  <span className="text-muted-foreground font-normal"> / {totalPlanned} planned</span>
                ) : null}
              </dd>
            </div>
          </dl>
        </div>
        <div className="hidden sm:flex items-center gap-2 rounded-xl border border-border/80 bg-background/60 px-4 py-3 text-xs text-muted-foreground max-w-xs">
          <Sparkles className="w-4 h-4 shrink-0 text-amber-500" aria-hidden />
          <span>Tip: bookmark the module page — this map is your compass for the whole track.</span>
        </div>
      </div>

      <ol className="relative mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {phases.map((phase, idx) => {
          const lessons = getLessonsByPhase(phase.id)
          const first = lessons[0]
          const countLabel =
            lessons.length > 0
              ? `${lessons.length} lesson${lessons.length === 1 ? '' : 's'}`
              : phase.lessonIds.length > 0
                ? `${phase.lessonIds.length} planned`
                : 'Coming soon'

          return (
            <li key={phase.id} className="relative">
              {idx > 0 && (
                <span
                  className="absolute -left-3 top-1/2 hidden h-px w-3 bg-gradient-to-r from-border to-transparent lg:block"
                  aria-hidden
                />
              )}
              <div className="flex h-full flex-col rounded-xl border border-border bg-card/90 p-4 shadow-sm transition hover:border-primary/35 hover:shadow-md">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-black">
                      {phase.number}
                    </span>
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Phase</p>
                      <p className="font-semibold text-foreground leading-snug truncate" title={phase.title}>
                        {phase.title}
                      </p>
                    </div>
                  </div>
                  <Footprints className="w-4 h-4 text-muted-foreground/60 shrink-0 mt-1" aria-hidden />
                </div>
                <p className="text-xs text-muted-foreground mt-2 line-clamp-2 flex-1">{phase.description}</p>
                <div className="mt-3 flex items-center justify-between gap-2 border-t border-border pt-3">
                  <span className="text-xs font-medium text-muted-foreground">{countLabel}</span>
                  {first ? (
                    <Link
                      href={`/learn/${moduleId}/${first.id}`}
                      className="text-xs font-semibold text-primary hover:underline"
                    >
                      Start →
                    </Link>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </div>
              </div>
            </li>
          )
        })}
      </ol>

      <p className="relative mt-6 text-center text-xs text-muted-foreground">
        Jump to a phase below — section headers match this map.
      </p>
    </section>
  )
}
