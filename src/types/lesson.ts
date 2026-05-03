export type Difficulty = 'beginner' | 'intermediate' | 'advanced'
export type Track = 'Foundation' | 'Technical' | 'Specialization' | 'Leadership'
export type CalloutTone = 'info' | 'warning' | 'tip' | 'production' | 'important'

export interface Module {
  id: string
  number: string
  title: string
  description: string
  track: Track
  duration: string
  totalLessons: number
  comingSoon?: boolean
  phases: PhaseInfo[]
}

export interface PhaseInfo {
  id: string
  number: number
  title: string
  duration: string
  description: string
  lessonIds: string[]
}

export interface LessonMeta {
  id: string
  moduleId: string
  phaseId: string
  phaseNumber: number
  title: string
  description: string
  duration: string
  difficulty: Difficulty
  order: number
}

export interface Lesson extends LessonMeta {
  objectives: string[]
  content: ContentBlock[]
  playground?: PlaygroundConfig
}

export type ContentBlock =
  | TextBlock
  | CodeBlock
  | CalloutBlock
  | ExerciseBlock

export interface TextBlock {
  type: 'text'
  markdown: string
}

export interface CodeBlock {
  type: 'code'
  language: string
  filename?: string
  code: string
  explanation?: string
}

export interface CalloutBlock {
  type: 'callout'
  tone: CalloutTone
  title?: string
  content: string
}

export interface ExerciseBlock {
  type: 'exercise'
  title: string
  description: string
  starterCode: string
  language: string
  solution: string
  hints?: string[]
}

export interface PlaygroundConfig {
  template: 'python' | 'node' | 'react' | 'typescript'
  files: Record<string, string>
  visibleFiles?: string[]
  activeFile?: string
}
