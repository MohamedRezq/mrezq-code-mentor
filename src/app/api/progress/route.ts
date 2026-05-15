import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = (await createClient()) as any
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: completions, error } = await supabase
      .from('lesson_completions')
      .select('id, lesson_id, completed_at, time_spent_seconds')
      .eq('user_id', user.id)
      .order('completed_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({ completions: completions ?? [] })
  } catch (error) {
    console.error('Error fetching progress:', error)
    return NextResponse.json({ error: 'Failed to fetch progress' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = (await createClient()) as any
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { lessonId, timeSpentSeconds } = await request.json()

    if (!lessonId || typeof lessonId !== 'string') {
      return NextResponse.json({ error: 'Missing lessonId' }, { status: 400 })
    }

    const { error: completionError } = await supabase.from('lesson_completions').upsert(
      {
        user_id: user.id,
        lesson_id: lessonId,
        completed_at: new Date().toISOString(),
        time_spent_seconds: typeof timeSpentSeconds === 'number' ? timeSpentSeconds : null,
      },
      { onConflict: 'user_id,lesson_id' }
    )

    if (completionError) throw completionError

    return NextResponse.json({ success: true, lessonId })
  } catch (error) {
    console.error('Error recording progress:', error)
    const detail = error instanceof Error ? error.message : 'Unknown error'
    const needsTable =
      detail.includes('lesson_completions') ||
      detail.includes('does not exist') ||
      detail.includes('schema cache')
    return NextResponse.json(
      {
        error: needsTable
          ? 'Progress table missing. Run supabase/lesson_completions.sql in your Supabase SQL editor.'
          : 'Failed to record progress',
        detail: process.env.NODE_ENV === 'development' ? detail : undefined,
      },
      { status: 500 }
    )
  }
}
