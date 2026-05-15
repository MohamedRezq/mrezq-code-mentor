import { PYTHON_FULLSTACK_CHEAT_SHEET } from '@/data/cheat-sheets/python-fullstack'

export function CheatSheetContent() {
  return (
    <article className="space-y-10 text-sm leading-relaxed print:text-xs print:space-y-6">
      {PYTHON_FULLSTACK_CHEAT_SHEET.map((section) => (
        <section key={section.title} className="break-inside-avoid">
          <h2 className="text-lg font-bold border-b border-border mb-3 pb-1">{section.title}</h2>
          {section.type === 'list' ? (
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground whitespace-pre-line">
              {section.body.split('\n').map((line) => (
                <li key={line}>
                  <span className="text-foreground font-mono text-xs">{line}</span>
                </li>
              ))}
            </ul>
          ) : (
            <pre className="bg-muted/50 border border-border rounded-lg p-4 overflow-x-auto font-mono text-xs print:p-3 whitespace-pre">
              {section.body}
            </pre>
          )}
        </section>
      ))}
    </article>
  )
}
