'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LogIn, UserPlus } from 'lucide-react'
import { useAuth } from '@/components/providers/auth-provider'
import { isSupabaseConfigured } from '@/lib/supabase/config'
import { UserNav } from '@/components/layout/user-nav'
import { Button } from '@/components/ui/button'

export function LearnHeader() {
  const pathname = usePathname()
  const { user, loading } = useAuth()

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
          ) : loading ? (
            <span className="text-xs text-muted-foreground" aria-live="polite">
              Loading…
            </span>
          ) : user ? (
            <>
              <span className="text-xs text-muted-foreground hidden md:inline truncate max-w-[180px]">
                {user.email}
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
                </Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
