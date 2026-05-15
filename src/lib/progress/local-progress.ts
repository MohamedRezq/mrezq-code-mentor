const STORAGE_KEY = 'seniorpath-lesson-completions'

export function readLocalCompletions(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === 'string') : []
  } catch {
    return []
  }
}

export function writeLocalCompletions(ids: string[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...new Set(ids)]))
}

export function addLocalCompletion(lessonId: string): void {
  const ids = readLocalCompletions()
  if (!ids.includes(lessonId)) {
    writeLocalCompletions([...ids, lessonId])
  }
}

export function clearLocalCompletions(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(STORAGE_KEY)
}
