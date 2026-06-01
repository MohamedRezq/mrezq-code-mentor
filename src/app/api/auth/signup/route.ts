import { randomUUID } from 'node:crypto'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { hashPassword } from '@/lib/auth/password'
import {
  createSessionToken,
  setSessionCookie,
} from '@/lib/auth/session'
import { createUser, findUserByEmail, profileNeedsOnboarding } from '@/lib/db'

export const runtime = 'nodejs'

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().trim().min(1).max(120).optional(),
})

export async function POST(request: Request) {
  try {
    const body = signupSchema.parse(await request.json())
    const existing = findUserByEmail(body.email)
    if (existing) {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 })
    }

    const userId = randomUUID()
    const passwordHash = await hashPassword(body.password)
    const user = createUser({
      id: userId,
      email: body.email,
      passwordHash,
      name: body.name?.trim() ?? null,
    })

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
    console.error('Signup error:', error)
    return NextResponse.json({ error: 'Could not create account' }, { status: 500 })
  }
}
