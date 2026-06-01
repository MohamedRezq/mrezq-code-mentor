import Database from 'better-sqlite3'
import fs from 'node:fs'
import path from 'node:path'
import type { LearningStyle, SkillLevel } from '@/types'

export interface DbUser {
  id: string
  email: string
  password_hash: string
  name: string | null
  created_at: string
}

export interface DbProfile {
  user_id: string
  learning_style: LearningStyle | null
  skill_level: SkillLevel | null
  preferences: string
  updated_at: string
}

export interface DbLessonCompletion {
  id: string
  user_id: string
  lesson_id: string
  completed_at: string
  time_spent_seconds: number | null
}

const SCHEMA = `
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE COLLATE NOCASE,
  password_hash TEXT NOT NULL,
  name TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS profiles (
  user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  learning_style TEXT,
  skill_level TEXT,
  preferences TEXT NOT NULL DEFAULT '{}',
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS lesson_completions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  lesson_id TEXT NOT NULL,
  completed_at TEXT NOT NULL DEFAULT (datetime('now')),
  time_spent_seconds INTEGER,
  UNIQUE (user_id, lesson_id)
);

CREATE INDEX IF NOT EXISTS idx_lesson_completions_user ON lesson_completions(user_id);
`

let db: Database.Database | null = null

function resolveDbPath(): string {
  const configured = process.env.DATABASE_PATH?.trim()
  if (configured) return configured

  // Vercel serverless: writable /tmp (ephemeral per instance)
  if (process.env.VERCEL === '1') {
    return path.join('/tmp', 'seniorpath.db')
  }

  return path.join(process.cwd(), 'data', 'seniorpath.db')
}

export function getDb(): Database.Database {
  if (db) return db

  const dbPath = resolveDbPath()
  fs.mkdirSync(path.dirname(dbPath), { recursive: true })

  db = new Database(dbPath)
  db.pragma('journal_mode = WAL')
  db.pragma('foreign_keys = ON')
  db.exec(SCHEMA)

  return db
}

export function findUserByEmail(email: string): DbUser | undefined {
  return getDb()
    .prepare('SELECT * FROM users WHERE email = ? COLLATE NOCASE')
    .get(email.trim()) as DbUser | undefined
}

export function findUserById(id: string): DbUser | undefined {
  return getDb().prepare('SELECT * FROM users WHERE id = ?').get(id) as DbUser | undefined
}

export function createUser(input: {
  id: string
  email: string
  passwordHash: string
  name: string | null
}): DbUser {
  const dbConn = getDb()
  const insertUser = dbConn.prepare(`
    INSERT INTO users (id, email, password_hash, name)
    VALUES (?, ?, ?, ?)
  `)
  const insertProfile = dbConn.prepare(`
    INSERT INTO profiles (user_id, preferences)
    VALUES (?, '{}')
  `)

  const tx = dbConn.transaction(() => {
    insertUser.run(input.id, input.email.trim().toLowerCase(), input.passwordHash, input.name)
    insertProfile.run(input.id)
  })
  tx()

  const user = findUserById(input.id)
  if (!user) throw new Error('Failed to create user')
  return user
}

export function getProfile(userId: string): DbProfile | undefined {
  return getDb()
    .prepare('SELECT * FROM profiles WHERE user_id = ?')
    .get(userId) as DbProfile | undefined
}

export function updateProfile(
  userId: string,
  input: { learning_style: LearningStyle; skill_level: SkillLevel },
): void {
  getDb()
    .prepare(`
      UPDATE profiles
      SET learning_style = ?, skill_level = ?, updated_at = datetime('now')
      WHERE user_id = ?
    `)
    .run(input.learning_style, input.skill_level, userId)
}

export function profileNeedsOnboarding(userId: string): boolean {
  const profile = getProfile(userId)
  return !profile?.learning_style || !profile?.skill_level
}

export function listCompletions(userId: string): DbLessonCompletion[] {
  return getDb()
    .prepare(`
      SELECT * FROM lesson_completions
      WHERE user_id = ?
      ORDER BY completed_at DESC
    `)
    .all(userId) as DbLessonCompletion[]
}

export function upsertCompletion(input: {
  id: string
  userId: string
  lessonId: string
  timeSpentSeconds: number | null
}): void {
  getDb()
    .prepare(`
      INSERT INTO lesson_completions (id, user_id, lesson_id, time_spent_seconds)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(user_id, lesson_id) DO UPDATE SET
        completed_at = datetime('now'),
        time_spent_seconds = excluded.time_spent_seconds
    `)
    .run(input.id, input.userId, input.lessonId, input.timeSpentSeconds)
}
