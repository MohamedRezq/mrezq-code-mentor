import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronRight, Clock, BookOpen, ArrowLeft, ArrowRight } from 'lucide-react'
import { getModule } from '@/data/modules'
import { getLessonById, getAdjacentLessons } from '@/data/lessons'
import { LessonSidebar } from '@/components/lesson/lesson-sidebar'
import { ContentRenderer } from '@/components/lesson/content-renderer'

const DIFFICULTY_STYLES = {
  beginner: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  intermediate: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  advanced: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
}

export default function LessonPage({
  params,
}: {
  params: { moduleId: string; lessonId: string }
}) {
  const courseModule = getModule(params.moduleId)
  const lesson = getLessonById(params.lessonId)

  if (!courseModule || !lesson) notFound()

  const { prev, next } = getAdjacentLessons(lesson.id)

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <LessonSidebar module={courseModule} activeLessonId={lesson.id} />

      {/* Main content */}
      <div className="flex-1 overflow-y-auto">
        {/* Top nav */}
        <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-20">
          <div className="max-w-4xl mx-auto px-8 py-3 flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href={`/learn/${courseModule.id}`} className="hover:text-foreground transition-colors">
              {courseModule.title}
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-foreground truncate max-w-xs">{lesson.title}</span>
          </div>
        </header>

        <article className="max-w-4xl mx-auto px-8 py-10">
          {/* Lesson header */}
          <header className="mb-10 pb-8 border-b border-border">
            <div className="flex items-center gap-2 mb-3 text-sm text-muted-foreground">
              <span>Phase {lesson.phaseNumber}</span>
              <ChevronRight className="w-3.5 h-3.5" />
              <span>Lesson {lesson.order}</span>
            </div>

            <h1 className="text-3xl font-black text-foreground mb-3 leading-tight">
              {lesson.title}
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-5">
              {lesson.description}
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${DIFFICULTY_STYLES[lesson.difficulty]}`}>
                {lesson.difficulty}
              </span>
              <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Clock className="w-3.5 h-3.5" />
                {lesson.duration}
              </span>
              <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <BookOpen className="w-3.5 h-3.5" />
                {lesson.objectives.length} objectives
              </span>
            </div>

            {/* Learning objectives */}
            <div className="mt-6 rounded-xl bg-muted/50 border border-border p-5">
              <h3 className="text-sm font-semibold text-foreground mb-3">
                What you will learn
              </h3>
              <ul className="space-y-2">
                {lesson.objectives.map((obj, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="w-5 h-5 rounded-full bg-primary/20 text-primary text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    {obj}
                  </li>
                ))}
              </ul>
            </div>
          </header>

          {/* Lesson content */}
          <ContentRenderer blocks={lesson.content} />

          {/* Navigation */}
          <nav className="mt-16 pt-8 border-t border-border flex items-center justify-between gap-4">
            {prev ? (
              <Link
                href={`/learn/${courseModule.id}/${prev.id}`}
                className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group max-w-xs"
              >
                <ArrowLeft className="w-4 h-4 shrink-0 group-hover:-translate-x-0.5 transition-transform" />
                <span className="truncate">{prev.title}</span>
              </Link>
            ) : <div />}

            {next ? (
              <Link
                href={`/learn/${courseModule.id}/${next.id}`}
                className="flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors group max-w-xs"
              >
                <span className="truncate text-right">{next.title}</span>
                <ArrowRight className="w-4 h-4 shrink-0 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            ) : (
              <Link
                href={`/learn/${courseModule.id}`}
                className="flex items-center gap-2 text-sm font-semibold text-green-600 hover:text-green-500 transition-colors"
              >
                <span>Module Complete!</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </nav>
        </article>
      </div>
    </div>
  )
}
