'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import { isSupabaseConfigured } from '@/lib/supabase/config'

interface AuthContextValue {
  user: User | null
  loading: boolean
  isAuthenticated: boolean
  refreshAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const applySession = useCallback((nextUser: User | null) => {
    setUser(nextUser)
    setLoading(false)
  }, [])

  const refreshAuth = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      applySession(null)
      return
    }

    const supabase = createClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()
    applySession(session?.user ?? null)
  }, [applySession])

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      applySession(null)
      return
    }

    const supabase = createClient()
    let cancelled = false

    void (async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!cancelled) applySession(session?.user ?? null)
    })()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!cancelled) applySession(session?.user ?? null)
    })

    return () => {
      cancelled = true
      subscription.unsubscribe()
    }
  }, [applySession])

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      refreshAuth,
    }),
    [user, loading, refreshAuth]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return ctx
}
