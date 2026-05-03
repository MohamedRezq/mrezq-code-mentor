// User & Profile Types
export interface Profile {
  id: string;
  email: string;
  name: string | null;
  avatar_url: string | null;
  learning_style: LearningStyle | null;
  skill_level: SkillLevel | null;
  preferences: UserPreferences;
  created_at: string;
  updated_at: string;
}

export type LearningStyle = "visual" | "examples" | "theory" | "hands-on";
export type SkillLevel = "beginner" | "intermediate" | "advanced";

export interface UserPreferences {
  theme?: "light" | "dark" | "system";
  notifications?: boolean;
  [key: string]: unknown;
}

// Language & Content Types
export interface Language {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  description: string | null;
  display_order: number;
  is_active: boolean;
}

export interface Topic {
  id: string;
  language_id: string;
  name: string;
  slug: string;
  description: string | null;
  prerequisites: string[];
  difficulty: number;
  display_order: number;
}

export interface Concept {
  id: string;
  topic_id: string;
  name: string;
  slug: string;
  description: string | null;
  display_order: number;
}

export interface Lesson {
  id: string;
  concept_id: string;
  title: string;
  content: LessonContent;
  difficulty: number;
  estimated_minutes: number;
  created_at: string;
}

export interface LessonContent {
  sections: LessonSection[];
}

export interface LessonSection {
  type: "text" | "code" | "exercise" | "quiz";
  content: string;
  language?: string;
  solution?: string;
  hint?: string;
}

// Progress Types
export interface UserProgress {
  id: string;
  user_id: string;
  language_id: string;
  current_topic_id: string | null;
  concepts_mastered: string[];
  concepts_in_progress: string[];
  xp: number;
  streak_days: number;
  last_activity_at: string;
}

export interface LessonCompletion {
  id: string;
  user_id: string;
  lesson_id: string;
  completed_at: string;
  time_spent_seconds: number | null;
}

// AI Types
export type ExplanationStyle = "simple" | "detailed" | "analogy" | "step-by-step";

export interface AIExplanationRequest {
  content: string;
  type: "concept" | "code" | "error";
  style: ExplanationStyle;
  userLevel?: SkillLevel;
  language?: string;
}

export interface AIExplanationResponse {
  explanation: string;
  examples?: string[];
  followUpQuestions?: string[];
}

// Chat Types
export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  context?: {
    lessonId?: string;
    lessonTitle?: string;
    codeSnippet?: string;
  };
}

export interface ChatContext {
  lessonId?: string;
  lessonTitle?: string;
  currentTopic?: string;
  codeSnippet?: string;
}

// Navigation Types
export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface SidebarItem {
  id: string;
  label: string;
  href: string;
  icon?: string;
  isActive?: boolean;
  isCompleted?: boolean;
  children?: SidebarItem[];
}
