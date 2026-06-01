import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getSessionFromCookies } from '@/lib/auth/session'
import { updateProfile } from '@/lib/db'

export const runtime = 'nodejs'
import type { LearningStyle, SkillLevel } from '@/types'

const profileSchema = z.object({
  learning_style: z.enum(['visual', 'examples', 'theory', 'hands-on']),
  skill_level: z.enum(['beginner', 'intermediate', 'advanced']),
})

export async function PATCH(request: Request) {
  try {
    const session = await getSessionFromCookies()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = profileSchema.parse(await request.json())
    updateProfile(session.sub, {
      learning_style: body.learning_style as LearningStyle,
      skill_level: body.skill_level as SkillLevel,
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }
    console.error('Profile update error:', error)
    return NextResponse.json({ error: 'Failed to save preferences' }, { status: 500 })
  }
}
