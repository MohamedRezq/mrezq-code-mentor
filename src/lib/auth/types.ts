export interface AuthUser {
  id: string
  email: string
  name: string | null
  learning_style?: string | null
  skill_level?: string | null
}
