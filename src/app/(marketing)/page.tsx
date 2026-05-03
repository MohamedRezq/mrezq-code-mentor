import Link from 'next/link'
import { ArrowRight, BookOpen, Clock, Layers, Trophy } from 'lucide-react'
import { MODULES } from '@/data/modules'
import type { Track } from '@/types/lesson'

const TRACK_STYLES: Record<Track, { badge: string; dot: string }> = {
  Foundation: {
    badge: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
    dot: 'bg-amber-500',
  },
  Technical: {
    badge: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
    dot: 'bg-blue-500',
  },
  Specialization: {
    badge: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300',
    dot: 'bg-purple-500',
  },
  Leadership: {
    badge: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
    dot: 'bg-green-500',
  },
}

const NUMBER_STYLES: Record<string, string> = {
  '00': 'text-amber-500',
  '01': 'text-blue-500',
  '02': 'text-blue-500',
  '03': 'text-blue-500',
  '04': 'text-amber-500',
  '05': 'text-blue-500',
  '06': 'text-violet-500',
  '07': 'text-purple-500',
  '08': 'text-green-500',
}

export default function HomePage() {
  const availableModules = MODULES.filter(m => !m.comingSoon)
  const totalLessons = MODULES.reduce((s, m) => s + m.totalLessons, 0)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground text-xs font-black">S</span>
            </div>
            <span className="font-bold text-foreground text-lg">SeniorPath</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="#modules" className="hover:text-foreground transition-colors">Modules</Link>
            <Link href="#roadmap" className="hover:text-foreground transition-colors">Roadmap</Link>
          </nav>
          <Link
            href="/learn/ai-engineering"
            className="flex items-center gap-2 text-sm font-semibold bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Start Learning <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-16">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1.5 rounded-full mb-6">
            <span className="w-1.5 h-1.5 bg-primary rounded-full" />
            Complete Engineering Curriculum
          </div>
          <h1 className="text-5xl font-black leading-tight text-foreground mb-6">
            From Developer<br />
            to <span className="text-primary">Senior Engineer</span><br />
            & Beyond
          </h1>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-2xl">
            A self-contained learning platform. No external resources needed —
            every concept, example, production demo, and hands-on project is
            right here. 9 modules covering the full path from CS fundamentals to CTO.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/learn/ai-engineering"
              className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors"
            >
              Start with AI Engineering <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="#modules"
              className="flex items-center gap-2 border border-border text-foreground px-6 py-3 rounded-xl font-semibold hover:bg-muted transition-colors"
            >
              Browse All Modules
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: Layers, label: 'Modules', value: '9' },
            { icon: BookOpen, label: 'Lessons', value: `${totalLessons}+` },
            { icon: Clock, label: 'Full Roadmap', value: '24–36 mo' },
            { icon: Trophy, label: 'Projects', value: '25+' },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="text-center p-6 rounded-xl border border-border bg-card">
              <Icon className="w-5 h-5 mx-auto mb-2 text-muted-foreground" />
              <div className="text-3xl font-black text-foreground">{value}</div>
              <div className="text-sm text-muted-foreground mt-1">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Modules Grid */}
      <section id="modules" className="max-w-7xl mx-auto px-6 py-16">
        <div className="mb-10">
          <h2 className="text-3xl font-black text-foreground mb-3">Learning Modules</h2>
          <p className="text-muted-foreground">
            9 comprehensive modules. AI Engineering is available now — all others launching soon.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {MODULES.map(module => {
            const styles = TRACK_STYLES[module.track]
            const numStyle = NUMBER_STYLES[module.number] || 'text-muted-foreground'
            const isAvailable = !module.comingSoon

            return (
              <div
                key={module.id}
                className={`relative rounded-2xl border border-border bg-card p-6 flex flex-col transition-all ${
                  isAvailable
                    ? 'hover:border-primary/50 hover:shadow-lg cursor-pointer'
                    : 'opacity-60'
                }`}
              >
                {/* Number + Badge */}
                <div className="flex items-start justify-between mb-4">
                  <span className={`text-4xl font-black ${numStyle} tabular-nums`}>
                    {module.number}
                  </span>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${styles.badge}`}>
                    {module.track}
                  </span>
                </div>

                {/* Content */}
                <h3 className="font-bold text-foreground text-lg mb-2 leading-snug">
                  {module.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed flex-1">
                  {module.description}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{module.totalLessons} lessons</span>
                    <span>·</span>
                    <span>{module.duration}</span>
                  </div>
                  {isAvailable ? (
                    <Link
                      href={`/learn/${module.id}`}
                      className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
                    >
                      Start <ArrowRight className="w-4 h-4" />
                    </Link>
                  ) : (
                    <span className="text-xs font-medium text-muted-foreground bg-muted px-3 py-1 rounded-full">
                      Coming Soon
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border mt-16 py-8 text-center text-sm text-muted-foreground">
        <p>SeniorPath — A complete self-learning platform for software engineers.</p>
      </footer>
    </div>
  )
}
