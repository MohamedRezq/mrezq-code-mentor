import { randomUUID } from 'node:crypto'
import { NextRequest, NextResponse } from 'next/server'
import { getSessionFromCookies } from '@/lib/auth/session'
import { listCompletions, upsertCompletion } from '@/lib/db'

export const runtime = 'nodejs'

export async function GET() {
  try {
    const session = await getSessionFromCookies()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const completions = listCompletions(session.sub).map((row) => ({
      id: row.id,
      lesson_id: row.lesson_id,
      completed_at: row.completed_at,
      time_spent_seconds: row.time_spent_seconds,
    }))

    return NextResponse.json({ completions })
  } catch (error) {
    console.error('Error fetching progress:', error)
    return NextResponse.json({ error: 'Failed to fetch progress' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSessionFromCookies()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { lessonId, timeSpentSeconds } = await request.json()

    if (!lessonId || typeof lessonId !== 'string') {
      return NextResponse.json({ error: 'Missing lessonId' }, { status: 400 })
    }

    upsertCompletion({
      id: randomUUID(),
      userId: session.sub,
      lessonId,
      timeSpentSeconds: typeof timeSpentSeconds === 'number' ? timeSpentSeconds : null,
    })

    return NextResponse.json({ success: true, lessonId })
  } catch (error) {
    console.error('Error recording progress:', error)
    return NextResponse.json({ error: 'Failed to record progress' }, { status: 500 })
  }
}
