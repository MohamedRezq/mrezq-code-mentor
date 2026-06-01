import { NextResponse } from 'next/server'
import { z } from 'zod'
import { verifyPassword } from '@/lib/auth/password'
import { createSessionToken, setSessionCookie } from '@/lib/auth/session'
import { findUserByEmail, profileNeedsOnboarding } from '@/lib/db'

export const runtime = 'nodejs'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export async function POST(request: Request) {
  try {
    const body = loginSchema.parse(await request.json())
    const user = findUserByEmail(body.email)

    if (!user || !(await verifyPassword(body.password, user.password_hash))) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    const token = await createSessionToken({
      sub: user.id,
      email: user.email,
      name: user.name,
    })

    const response = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      needsOnboarding: profileNeedsOnboarding(user.id),
    })

    setSessionCookie(response, token)
    return response
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Could not sign in' }, { status: 500 })
  }
}
