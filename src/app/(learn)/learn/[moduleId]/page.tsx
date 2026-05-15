import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight, BookOpen, Clock, ChevronRight } from 'lucide-react'
import { getModule } from '@/data/modules'
import { getLessonsByModule } from '@/data/lessons'
import { getModuleTotalDuration } from '@/lib/curriculum/module-duration'
import { ModuleLearningMap } from '@/components/learn/module-learning-map'
import { ModuleLessonList } from '@/components/learn/module-page-client'
import type { Track } from '@/types/lesson'

const TRACK_STYLES: Record<Track, string> = {
  Foundation: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
  Technical: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
  Specialization: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300',
  Leadership: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
}

export default async function ModulePage({ params }: { params: Promise<{ moduleId: string }> }) {
  const { moduleId } = await params
  const courseModule = getModule(moduleId)
  if (!courseModule) notFound()

  const allLessons = getLessonsByModule(courseModule.id)
  const firstLesson = allLessons[0]

  return (
    <div className="h-full overflow-y-auto bg-background">
      <header className="border-b border-border bg-background sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-6 py-3 flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-foreground font-medium">{courseModule.title}</span>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-full ${TRACK_STYLES[courseModule.track]}`}
            >
              {courseModule.track}
            </span>
            <span className="text-xs text-muted-foreground">Module {courseModule.number}</span>
          </div>
          <h1 className="text-4xl font-black text-foreground mb-4">{courseModule.title}</h1>
          <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
            {courseModule.description}
          </p>

          <div className="flex items-center gap-6 mt-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              {allLessons.length} lessons
            </span>
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {getModuleTotalDuration(courseModule.id)} total
            </span>
          </div>

          {firstLesson && (
            <Link
              href={`/learn/${courseModule.id}/${firstLesson.id}`}
              className="inline-flex items-center gap-2 mt-8 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors"
            >
              Start Learning <ArrowRight className="w-4 h-4" />
            </Link>
          )}

          {moduleId === 'python-backend' && (
            <div className="mt-6 rounded-xl border border-primary/30 bg-primary/5 px-5 py-4 text-sm">
              <p className="font-semibold text-foreground mb-1">Printable cheat sheet (save as PDF)</p>
              <p className="text-muted-foreground mb-3">
                Full-stack Python reference — syntax through deployment. Browser Print → Save as PDF.
              </p>
              <Link
                href={`/learn/${courseModule.id}/cheat-sheet`}
                className="inline-flex items-center gap-2 font-medium text-primary hover:text-primary/80"
              >
                Open cheat sheet <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>

        <ModuleLearningMap
          moduleId={courseModule.id}
          moduleTitle={courseModule.title}
          phases={courseModule.phases}
        />

        <ModuleLessonList courseModule={courseModule} />
      </div>
    </div>
  )
}
