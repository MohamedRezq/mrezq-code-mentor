import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronRight } from 'lucide-react'
import { getModule } from '@/data/modules'
import { CheatSheetPrintBar } from '@/components/python/cheat-sheet-print-bar'
import { CheatSheetContent } from '@/components/python/cheat-sheet-content'

export default async function PythonCheatSheetPage({
  params,
}: {
  params: Promise<{ moduleId: string }>
}) {
  const { moduleId } = await params
  if (moduleId !== 'python-backend') notFound()

  const courseModule = getModule(moduleId)
  if (!courseModule) notFound()

  return (
    <div className="h-full overflow-y-auto bg-background text-foreground">
      <CheatSheetPrintBar title="Python Full-Stack — SeniorPath cheat sheet" />

      <div className="max-w-3xl mx-auto px-6 py-10 print:max-w-none print:py-6 print:px-8">
        <header className="mb-8 print:mb-6 border-b border-border pb-6 print:pb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3 no-print">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href={`/learn/${moduleId}`} className="hover:text-foreground transition-colors">
              {courseModule.title}
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span>Cheat sheet</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight">Python Full-Stack — cheat sheet</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Dense reference aligned with{' '}
            <a href="https://roadmap.sh/python" className="text-primary underline">
              roadmap.sh/python
            </a>{' '}
            · language → DSA → Django/Flask → FastAPI → DB → testing → production · Print → Save as PDF
          </p>
        </header>

        <CheatSheetContent />

        <p className="text-xs text-muted-foreground pt-6 border-t border-border no-print">
          <Link href={`/learn/${moduleId}`}>← Module overview</Link>
        </p>
      </div>

      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
        }
      `}</style>
    </div>
  )
}
