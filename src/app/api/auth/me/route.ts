import { NextResponse } from 'next/server'
import { getSessionFromCookies } from '@/lib/auth/session'
import { findUserById, getProfile, profileNeedsOnboarding } from '@/lib/db'

export const runtime = 'nodejs'

export async function GET() {
  try {
    const session = await getSessionFromCookies()
    if (!session) {
      return NextResponse.json({ user: null })
    }

    const user = findUserById(session.sub)
    if (!user) {
      return NextResponse.json({ user: null })
    }

    const profile = getProfile(user.id)

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        learning_style: profile?.learning_style ?? null,
        skill_level: profile?.skill_level ?? null,
      },
      needsOnboarding: profileNeedsOnboarding(user.id),
    })
  } catch (error) {
    console.error('Auth me error:', error)
    return NextResponse.json({ user: null })
  }
}
