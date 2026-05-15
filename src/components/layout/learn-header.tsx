'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ArrowRight, LogIn, UserPlus } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { isSupabaseConfigured } from '@/lib/supabase/config'
import { UserNav } from '@/components/layout/user-nav'
import { Button } from '@/components/ui/button'

export function LearnHeader() {
  const pathname = usePathname()
  const [email, setEmail] = useState<string | null>(null)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function load() {
      if (!isSupabaseConfigured()) {
        if (!cancelled) {
          setEmail(null)
          setChecking(false)
        }
        return
      }

      try {
        const supabase = createClient()
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!cancelled) setEmail(user?.email ?? null)
      } catch {
        if (!cancelled) setEmail(null)
      } finally {
        if (!cancelled) setChecking(false)
      }
    }

    void load()
  }, [pathname])

  const loginHref = `/login?redirect=${encodeURIComponent(pathname || '/learn')}`

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-40">
      <div className="h-12 px-4 sm:px-6 flex items-center justify-between gap-4 max-w-[100vw]">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center text-primary-foreground text-xs font-black">
            S
          </span>
          <span className="font-bold text-foreground hidden sm:inline">SeniorPath</span>
        </Link>

        <nav className="flex items-center gap-2 sm:gap-3">
          {!isSupabaseConfigured() ? (
            <span className="text-xs text-destructive font-medium">Auth not configured</span>
          ) : checking ? (
            <span className="text-xs text-muted-foreground">…</span>
          ) : email ? (
            <>
              <span className="text-xs text-muted-foreground hidden md:inline truncate max-w-[180px]">
                {email}
              </span>
              <UserNav />
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild className="gap-1.5">
                <Link href={loginHref}>
                  <LogIn className="w-4 h-4" />
                  <span className="hidden sm:inline">Log in</span>
                </Link>
              </Button>
              <Button size="sm" asChild className="gap-1.5">
                <Link href={`/signup?redirect=${encodeURIComponent(pathname || '/learn')}`}>
                  <UserPlus className="w-4 h-4" />
                  <span className="hidden sm:inline">Sign up</span>
                  <ArrowRight className="w-3.5 h-3.5 sm:hidden" />
                </Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
