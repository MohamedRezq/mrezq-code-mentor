'use client'

import { useState } from 'react'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { atomOneDark, atomOneLight } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import { useTheme } from 'next-themes'
import { Check, Copy } from 'lucide-react'

interface CodeBlockProps {
  code: string
  language: string
  filename?: string
  explanation?: string
}

export function CodeBlock({ code, language, filename, explanation }: CodeBlockProps) {
  const { resolvedTheme } = useTheme()
  const [copied, setCopied] = useState(false)
  const isDark = resolvedTheme === 'dark'

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="rounded-lg overflow-hidden border border-border my-6">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-muted/60 border-b border-border">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono font-semibold text-muted-foreground uppercase tracking-wider">
            {language}
          </span>
          {filename && (
            <>
              <span className="text-muted-foreground/40">·</span>
              <span className="text-xs font-mono text-foreground/70">{filename}</span>
            </>
          )}
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded hover:bg-background/50"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-green-500" />
              <span className="text-green-500">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code */}
      <div className="overflow-x-auto">
        <SyntaxHighlighter
          language={language === 'typescript' ? 'ts' : language}
          style={isDark ? atomOneDark : atomOneLight}
          customStyle={{
            margin: 0,
            padding: '1.25rem 1.5rem',
            background: isDark ? 'hsl(var(--card))' : 'hsl(var(--card))',
            fontSize: '0.875rem',
            lineHeight: '1.6',
          }}
          showLineNumbers={code.split('\n').length > 8}
          lineNumberStyle={{ opacity: 0.35, minWidth: '2.5em', paddingRight: '1em' }}
        >
          {code.trimEnd()}
        </SyntaxHighlighter>
      </div>

      {/* Explanation */}
      {explanation && (
        <div className="px-4 py-3 bg-muted/30 border-t border-border text-sm text-muted-foreground">
          {explanation}
        </div>
      )}
    </div>
  )
}
