'use client'

import { useCallback, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'

declare global {
  interface Window {
    loadPyodide?: (options: { indexURL: string }) => Promise<{
      setStdout: (opts: { batched: (text: string) => void }) => void
      setStderr: (opts: { batched: (text: string) => void }) => void
      runPythonAsync: (code: string) => Promise<unknown>
    }>
  }
}

let pyodidePromise: Promise<{
  setStdout: (opts: { batched: (text: string) => void }) => void
  setStderr: (opts: { batched: (text: string) => void }) => void
  runPythonAsync: (code: string) => Promise<unknown>
}> | null = null

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${src}"]`)
    if (existing) {
      if (window.loadPyodide) {
        resolve()
        return
      }
      const onLoad = () => resolve()
      const onError = () => reject(new Error('Failed to load Pyodide script'))
      existing.addEventListener('load', onLoad)
      existing.addEventListener('error', onError)
      // If script already finished previously without exposing loadPyodide (or CSP blocked),
      // avoid hanging forever by timing out with a helpful message.
      setTimeout(() => {
        if (!window.loadPyodide) {
          existing.removeEventListener('load', onLoad)
          existing.removeEventListener('error', onError)
          reject(new Error('Python runtime failed to initialize (possibly blocked by network/CSP).'))
        }
      }, 10000)
      return
    }

    const script = document.createElement('script')
    script.src = src
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Failed to load Pyodide script'))
    document.head.appendChild(script)
  })
}

async function getPyodide() {
  if (!pyodidePromise) {
    pyodidePromise = (async () => {
      if (!window.loadPyodide) {
        await loadScript('https://cdn.jsdelivr.net/pyodide/v0.27.2/full/pyodide.js')
      }
      if (!window.loadPyodide) {
        throw new Error('Pyodide loader unavailable')
      }
      return window.loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.27.2/full/' })
    })()
  }
  return pyodidePromise
}

function basicFormatPython(input: string): string {
  const lines = input.split('\n').map(line => line.replace(/\t/g, '    ').replace(/\s+$/g, ''))
  const out = lines.join('\n')
  return out.endsWith('\n') ? out : `${out}\n`
}

function basicLintPython(input: string): string[] {
  const warnings: string[] = []
  const lines = input.split('\n')
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i]
    const lineNo = i + 1
    if (/\t/.test(line)) warnings.push(`Line ${lineNo}: tab detected; use 4 spaces`)
    if (/\s+$/.test(line)) warnings.push(`Line ${lineNo}: trailing whitespace`)
    if (line.length > 100) warnings.push(`Line ${lineNo}: >100 chars`)
  }
  if (/def\s+\w+\([^)]*=\s*\[\s*\]/.test(input) || /def\s+\w+\([^)]*=\s*\{\s*\}/.test(input)) {
    warnings.push('Mutable default argument detected (use None + initialize inside function).')
  }
  return warnings
}

interface PythonPlaygroundProps {
  initialCode: string
}

export function PythonPlayground({ initialCode }: PythonPlaygroundProps) {
  const [code, setCode] = useState(initialCode)
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [lintWarnings, setLintWarnings] = useState<string[]>([])
  const [running, setRunning] = useState(false)
  const [initializing, setInitializing] = useState(false)
  const [open, setOpen] = useState(false)

  const placeholder = useMemo(
    () => '# Edit Python code and click Run\nprint("Hello from browser Python")',
    [],
  )

  const runCode = useCallback(async () => {
    setRunning(true)
    setInitializing(true)
    setOutput('')
    setError('')
    try {
      const pyodide = await Promise.race([
        getPyodide(),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Python runtime initialization timed out. Try refresh/run again.')), 20000),
        ),
      ])
      setInitializing(false)
      let stdout = ''
      let stderr = ''
      pyodide.setStdout({ batched: text => { stdout += text } })
      pyodide.setStderr({ batched: text => { stderr += text } })

      const result = await Promise.race([
        pyodide.runPythonAsync(code || placeholder),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Execution timed out. Check for infinite loop or very heavy code.')), 15000),
        ),
      ])
      const resultText = result === undefined || result === null ? '' : String(result)
      setOutput([stdout.trim(), resultText].filter(Boolean).join('\n'))
      if (stderr.trim()) setError(stderr.trim())
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown runtime error')
    } finally {
      setInitializing(false)
      setRunning(false)
    }
  }, [code, placeholder])

  const formatCode = useCallback(() => {
    setCode(prev => basicFormatPython(prev))
  }, [])

  const lintCode = useCallback(() => {
    setLintWarnings(basicLintPython(code))
  }, [code])

  return (
    <div className="mt-3 rounded-lg border border-border bg-muted/20">
      <div className="flex items-center justify-between px-3 py-2 border-b border-border">
        <p className="text-xs text-muted-foreground">Try it on page (resets on refresh)</p>
        <Button variant="outline" size="sm" onClick={() => setOpen(v => !v)}>
          {open ? 'Hide runner' : 'Edit & Run'}
        </Button>
      </div>

      {open && (
        <div className="p-3 space-y-3">
          <textarea
            value={code}
            onChange={e => setCode(e.target.value)}
            className="w-full min-h-48 rounded-md border border-border bg-background p-3 text-sm font-mono"
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={runCode} disabled={running}>
              {running ? (initializing ? 'Loading Python...' : 'Running...') : 'Run'}
            </Button>
            <Button size="sm" variant="outline" onClick={formatCode} disabled={running}>
              Format
            </Button>
            <Button size="sm" variant="outline" onClick={lintCode} disabled={running}>
              Lint
            </Button>
            <Button size="sm" variant="outline" onClick={() => setCode(initialCode)} disabled={running}>
              Reset
            </Button>
          </div>

          <div className="rounded-md border border-border bg-background p-3">
            <p className="text-xs font-semibold mb-2">Output</p>
            {output ? (
              <pre className="text-xs whitespace-pre-wrap">{output}</pre>
            ) : (
              <p className="text-xs text-muted-foreground">No output yet.</p>
            )}
            {error && (
              <>
                <p className="text-xs font-semibold mt-3 mb-1 text-red-500">Error</p>
                <pre className="text-xs whitespace-pre-wrap text-red-500">{error}</pre>
              </>
            )}
            {lintWarnings.length > 0 && (
              <>
                <p className="text-xs font-semibold mt-3 mb-1">Lint warnings</p>
                <ul className="text-xs list-disc pl-4 space-y-1">
                  {lintWarnings.map(w => (
                    <li key={w}>{w}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
