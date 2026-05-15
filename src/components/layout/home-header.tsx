'use client'

import Link from 'next/link'
import { ArrowRight, Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { useAuth } from '@/components/providers/auth-provider'
import { isSupabaseConfigured } from '@/lib/supabase/config'
import { UserNav } from '@/components/layout/user-nav'

export function HomeHeader() {
  const { resolvedTheme, setTheme } = useTheme()
  const { user, loading } = useAuth()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const continueHref = user
    ? '/learn'
    : '/login?redirect=' + encodeURIComponent('/learn')

  return (
    <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground text-xs font-black">S</span>
          </div>
          <span className="font-bold text-foreground text-lg">SeniorPath</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
          <Link href="#modules" className="hover:text-foreground transition-colors">
            Modules
          </Link>
          <Link href="#roadmap" className="hover:text-foreground transition-colors">
            Roadmap
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {mounted && (
            <button
              onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label="Toggle theme"
            >
              {resolvedTheme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          )}

          {isSupabaseConfigured() && loading ? (
            <span className="text-xs text-muted-foreground hidden sm:inline" aria-live="polite">
              …
            </span>
          ) : user ? (
            <>
              <span className="text-xs text-muted-foreground hidden md:inline truncate max-w-[160px]">
                {user.email}
              </span>
              <UserNav />
            </>
          ) : (
            <>
              <Link
                href="/login?redirect=/learn"
                className="text-sm font-medium text-muted-foreground hover:text-foreground px-3 py-2 hidden sm:inline"
              >
                Log in
              </Link>
              <Link
                href="/signup?redirect=/learn"
                className="text-sm font-semibold border border-border px-4 py-2 rounded-lg hover:bg-muted transition-colors hidden sm:inline"
              >
                Sign up
              </Link>
            </>
          )}

          <Link
            href={continueHref}
            className="flex items-center gap-2 text-sm font-semibold bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            {user ? 'Continue' : 'Start'} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </header>
  )
}
