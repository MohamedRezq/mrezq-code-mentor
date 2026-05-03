'use client'

import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { ChevronDown, ChevronRight, Lightbulb, AlertTriangle, Info, Zap, Star } from 'lucide-react'
import { CodeBlock } from './code-block'
import type { ContentBlock, CalloutTone } from '@/types/lesson'

const CALLOUT_CONFIG: Record<CalloutTone, {
  icon: React.FC<{ className?: string }>
  className: string
  label: string
}> = {
  tip: {
    icon: Lightbulb,
    className: 'bg-amber-50 border-amber-200 text-amber-900 dark:bg-amber-950/30 dark:border-amber-800 dark:text-amber-100',
    label: 'Tip',
  },
  warning: {
    icon: AlertTriangle,
    className: 'bg-red-50 border-red-200 text-red-900 dark:bg-red-950/30 dark:border-red-800 dark:text-red-100',
    label: 'Warning',
  },
  info: {
    icon: Info,
    className: 'bg-blue-50 border-blue-200 text-blue-900 dark:bg-blue-950/30 dark:border-blue-800 dark:text-blue-100',
    label: 'Note',
  },
  production: {
    icon: Zap,
    className: 'bg-violet-50 border-violet-200 text-violet-900 dark:bg-violet-950/30 dark:border-violet-800 dark:text-violet-100',
    label: 'Production Pattern',
  },
  important: {
    icon: Star,
    className: 'bg-orange-50 border-orange-200 text-orange-900 dark:bg-orange-950/30 dark:border-orange-800 dark:text-orange-100',
    label: 'Important',
  },
}

function Exercise({
  title,
  description,
  starterCode,
  language,
  solution,
  hints,
}: {
  title: string
  description: string
  starterCode: string
  language: string
  solution: string
  hints?: string[]
}) {
  const [showSolution, setShowSolution] = useState(false)
  const [showHints, setShowHints] = useState(false)

  return (
    <div className="rounded-lg border border-border my-6 overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-500/10 to-violet-500/10 border-b border-border px-5 py-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
            Exercise
          </span>
        </div>
        <h4 className="font-semibold text-foreground">{title}</h4>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </div>

      <div className="p-5 space-y-4">
        <CodeBlock code={starterCode} language={language} filename="starter.py" />

        {hints && hints.length > 0 && (
          <div>
            <button
              onClick={() => setShowHints(!showHints)}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {showHints ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              {showHints ? 'Hide hints' : `Show hints (${hints.length})`}
            </button>
            {showHints && (
              <ul className="mt-2 space-y-1 pl-6 list-disc text-sm text-muted-foreground">
                {hints.map((h, i) => <li key={i}>{h}</li>)}
              </ul>
            )}
          </div>
        )}

        <button
          onClick={() => setShowSolution(!showSolution)}
          className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-md border border-border hover:bg-muted transition-colors"
        >
          {showSolution ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          {showSolution ? 'Hide solution' : 'Reveal solution'}
        </button>

        {showSolution && (
          <CodeBlock code={solution} language={language} filename="solution.py" />
        )}
      </div>
    </div>
  )
}

interface ContentRendererProps {
  blocks: ContentBlock[]
}

export function ContentRenderer({ blocks }: ContentRendererProps) {
  return (
    <div className="lesson-content">
      {blocks.map((block, i) => {
        if (block.type === 'text') {
          return (
            <ReactMarkdown
              key={i}
              remarkPlugins={[remarkGfm]}
              components={{
                h2: ({ children }) => (
                  <h2 className="text-xl font-bold mt-10 mb-4 text-foreground first:mt-0 scroll-mt-20">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-lg font-semibold mt-8 mb-3 text-foreground scroll-mt-20">
                    {children}
                  </h3>
                ),
                p: ({ children }) => (
                  <p className="text-base leading-7 text-foreground/90 mb-4">{children}</p>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc pl-6 mb-4 space-y-1.5 text-foreground/90">{children}</ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal pl-6 mb-4 space-y-1.5 text-foreground/90">{children}</ol>
                ),
                li: ({ children }) => <li className="leading-7">{children}</li>,
                strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
                code: ({ children, className }) => {
                  const isBlock = className?.includes('language-')
                  if (isBlock) {
                    const lang = className?.replace('language-', '') || 'text'
                    return <CodeBlock code={String(children).trimEnd()} language={lang} />
                  }
                  return (
                    <code className="text-sm font-mono bg-muted px-1.5 py-0.5 rounded text-foreground">
                      {children}
                    </code>
                  )
                },
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-primary/40 pl-4 italic text-muted-foreground my-4">
                    {children}
                  </blockquote>
                ),
                table: ({ children }) => (
                  <div className="overflow-x-auto my-4">
                    <table className="w-full text-sm border-collapse border border-border">
                      {children}
                    </table>
                  </div>
                ),
                th: ({ children }) => (
                  <th className="border border-border bg-muted px-4 py-2 text-left font-semibold">
                    {children}
                  </th>
                ),
                td: ({ children }) => (
                  <td className="border border-border px-4 py-2">{children}</td>
                ),
                a: ({ href, children }) => (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline underline-offset-2 hover:text-primary/80"
                  >
                    {children}
                  </a>
                ),
              }}
            >
              {block.markdown}
            </ReactMarkdown>
          )
        }

        if (block.type === 'code') {
          return (
            <CodeBlock
              key={i}
              code={block.code}
              language={block.language}
              filename={block.filename}
              explanation={block.explanation}
            />
          )
        }

        if (block.type === 'callout') {
          const cfg = CALLOUT_CONFIG[block.tone]
          const Icon = cfg.icon
          return (
            <div key={i} className={`rounded-lg border px-5 py-4 my-6 ${cfg.className}`}>
              <div className="flex items-start gap-3">
                <Icon className="w-5 h-5 mt-0.5 shrink-0 opacity-80" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm mb-1">
                    {block.title || cfg.label}
                  </p>
                  <p className="text-sm leading-relaxed opacity-90">{block.content}</p>
                </div>
              </div>
            </div>
          )
        }

        if (block.type === 'exercise') {
          return (
            <Exercise
              key={i}
              title={block.title}
              description={block.description}
              starterCode={block.starterCode}
              language={block.language}
              solution={block.solution}
              hints={block.hints}
            />
          )
        }

        return null
      })}
    </div>
  )
}
