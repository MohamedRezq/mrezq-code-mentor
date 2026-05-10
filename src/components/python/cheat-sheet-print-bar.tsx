'use client'

import { Printer } from 'lucide-react'

export function CheatSheetPrintBar({ title }: { title: string }) {
  return (
    <div className="no-print sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur-sm px-4 py-3 flex flex-wrap items-center justify-between gap-3">
      <div>
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          Print or choose &quot;Save as PDF&quot; in the system print dialog.
        </p>
      </div>
      <button
        type="button"
        onClick={() => window.print()}
        className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
      >
        <Printer className="h-4 w-4" />
        Print / Save PDF
      </button>
    </div>
  )
}
