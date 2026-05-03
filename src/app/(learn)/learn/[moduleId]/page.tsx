import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight, BookOpen, Clock, ChevronRight } from 'lucide-react'
import { getModule } from '@/data/modules'
import { getLessonsByPhase, getLessonsByModule } from '@/data/lessons'
import type { Track } from '@/types/lesson'

const TRACK_STYLES: Record<Track, string> = {
  Foundation: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
  Technical: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
  Specialization: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300',
  Leadership: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
}

const DIFFICULTY_STYLES = {
  beginner: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  intermediate: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  advanced: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
}

export default function ModulePage({ params }: { params: { moduleId: string } }) {
  const module = getModule(params.moduleId)
  if (!module) notFound()

  const allLessons = getLessonsByModule(module.id)
  const firstLesson = allLessons[0]

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-6 py-3 flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-foreground font-medium">{module.title}</span>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${TRACK_STYLES[module.track]}`}>
              {module.track}
            </span>
            <span className="text-xs text-muted-foreground">Module {module.number}</span>
          </div>
          <h1 className="text-4xl font-black text-foreground mb-4">{module.title}</h1>
          <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">{module.description}</p>

          <div className="flex items-center gap-6 mt-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />{allLessons.length} lessons
            </span>
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4" />{module.duration}
            </span>
          </div>

          {firstLesson && (
            <Link
              href={`/learn/${module.id}/${firstLesson.id}`}
              className="inline-flex items-center gap-2 mt-8 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors"
            >
              Start Learning <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>

        <div className="space-y-10">
          {module.phases.map(phase => {
            const phaseLessons = getLessonsByPhase(phase.id)
            return (
              <div key={phase.id}>
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
                    phaseLessons.map((lesson, i) => (
                      <Link
                        key={lesson.id}
                        href={`/learn/${module.id}/${lesson.id}`}
                        className="flex items-center gap-4 rounded-xl border border-border bg-card hover:border-primary/40 hover:bg-muted/40 transition-all p-4 group"
                      >
                        <span className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-sm font-bold text-muted-foreground shrink-0">
                          {i + 1}
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
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${DIFFICULTY_STYLES[lesson.difficulty]}`}>
                            {lesson.difficulty}
                          </span>
                          <span className="text-xs text-muted-foreground">{lesson.duration}</span>
                          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                      </Link>
                    ))
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
