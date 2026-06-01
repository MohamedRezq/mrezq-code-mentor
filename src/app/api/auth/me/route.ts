import { NextResponse } from 'next/server'
import { getSessionFromCookies } from '@/lib/auth/session'
import { findUserById, getProfile } from '@/lib/db'

export const runtime = 'nodejs'

export async function GET() {
  try {
    const session = await getSessionFromCookies()
    if (!session) {
      return NextResponse.json({ user: null })
    }

    // JWT is the session source of truth; DB enriches profile when available.
    const user = findUserById(session.sub)
    const profile = getProfile(session.sub)

    return NextResponse.json({
      user: {
        id: session.sub,
        email: session.email,
        name: user?.name ?? session.name,
        learning_style: profile?.learning_style ?? null,
        skill_level: profile?.skill_level ?? null,
      },
      needsOnboarding: !profile?.learning_style || !profile?.skill_level,
    })
  } catch (error) {
    console.error('Auth me error:', error)
    return NextResponse.json({ user: null })
  }
}
