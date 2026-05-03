export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          avatar_url: string | null;
          learning_style: "visual" | "examples" | "theory" | "hands-on" | null;
          skill_level: "beginner" | "intermediate" | "advanced" | null;
          preferences: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          name?: string | null;
          avatar_url?: string | null;
          learning_style?: "visual" | "examples" | "theory" | "hands-on" | null;
          skill_level?: "beginner" | "intermediate" | "advanced" | null;
          preferences?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string | null;
          avatar_url?: string | null;
          learning_style?: "visual" | "examples" | "theory" | "hands-on" | null;
          skill_level?: "beginner" | "intermediate" | "advanced" | null;
          preferences?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };
      languages: {
        Row: {
          id: string;
          name: string;
          slug: string;
          icon: string | null;
          description: string | null;
          display_order: number;
          is_active: boolean;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          icon?: string | null;
          description?: string | null;
          display_order?: number;
          is_active?: boolean;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          icon?: string | null;
          description?: string | null;
          display_order?: number;
          is_active?: boolean;
        };
      };
      topics: {
        Row: {
          id: string;
          language_id: string;
          name: string;
          slug: string;
          description: string | null;
          prerequisites: string[];
          difficulty: number;
          display_order: number;
        };
        Insert: {
          id?: string;
          language_id: string;
          name: string;
          slug: string;
          description?: string | null;
          prerequisites?: string[];
          difficulty: number;
          display_order?: number;
        };
        Update: {
          id?: string;
          language_id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          prerequisites?: string[];
          difficulty?: number;
          display_order?: number;
        };
      };
      concepts: {
        Row: {
          id: string;
          topic_id: string;
          name: string;
          slug: string;
          description: string | null;
          display_order: number;
        };
        Insert: {
          id?: string;
          topic_id: string;
          name: string;
          slug: string;
          description?: string | null;
          display_order?: number;
        };
        Update: {
          id?: string;
          topic_id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          display_order?: number;
        };
      };
      lessons: {
        Row: {
          id: string;
          concept_id: string;
          title: string;
          content: Json;
          difficulty: number;
          estimated_minutes: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          concept_id: string;
          title: string;
          content: Json;
          difficulty: number;
          estimated_minutes?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          concept_id?: string;
          title?: string;
          content?: Json;
          difficulty?: number;
          estimated_minutes?: number;
          created_at?: string;
        };
      };
      user_progress: {
        Row: {
          id: string;
          user_id: string;
          language_id: string;
          current_topic_id: string | null;
          concepts_mastered: string[];
          concepts_in_progress: string[];
          xp: number;
          streak_days: number;
          last_activity_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          language_id: string;
          current_topic_id?: string | null;
          concepts_mastered?: string[];
          concepts_in_progress?: string[];
          xp?: number;
          streak_days?: number;
          last_activity_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          language_id?: string;
          current_topic_id?: string | null;
          concepts_mastered?: string[];
          concepts_in_progress?: string[];
          xp?: number;
          streak_days?: number;
          last_activity_at?: string;
        };
      };
      lesson_completions: {
        Row: {
          id: string;
          user_id: string;
          lesson_id: string;
          completed_at: string;
          time_spent_seconds: number | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          lesson_id: string;
          completed_at?: string;
          time_spent_seconds?: number | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          lesson_id?: string;
          completed_at?: string;
          time_spent_seconds?: number | null;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
