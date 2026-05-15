import { LearnHeader } from '@/components/layout/learn-header'
import { ProgressProvider } from '@/components/progress/progress-provider'

export default function LearnLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProgressProvider>
      <div className="flex h-dvh flex-col overflow-hidden bg-background">
        <LearnHeader />
        <main className="flex-1 min-h-0 overflow-hidden">{children}</main>
      </div>
    </ProgressProvider>
  )
}
