import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserProgress, LessonCompletion } from "@/types";

interface ProgressState {
  // Current session state
  currentLanguageId: string | null;
  currentTopicId: string | null;
  currentLessonId: string | null;

  // Progress data
  progress: Record<string, UserProgress>; // keyed by language_id
  completions: LessonCompletion[];

  // XP and streaks
  totalXp: number;
  streakDays: number;
  lastActivityDate: string | null;

  // Actions
  setCurrentLanguage: (languageId: string) => void;
  setCurrentTopic: (topicId: string) => void;
  setCurrentLesson: (lessonId: string) => void;

  updateProgress: (languageId: string, progress: Partial<UserProgress>) => void;
  addCompletion: (completion: LessonCompletion) => void;
  addXp: (amount: number) => void;
  updateStreak: () => void;

  // Sync with server
  syncFromServer: (progress: UserProgress[], completions: LessonCompletion[]) => void;
  reset: () => void;
}

const initialState = {
  currentLanguageId: null,
  currentTopicId: null,
  currentLessonId: null,
  progress: {},
  completions: [],
  totalXp: 0,
  streakDays: 0,
  lastActivityDate: null,
};

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setCurrentLanguage: (languageId) =>
        set({ currentLanguageId: languageId }),

      setCurrentTopic: (topicId) =>
        set({ currentTopicId: topicId }),

      setCurrentLesson: (lessonId) =>
        set({ currentLessonId: lessonId }),

      updateProgress: (languageId, progressUpdate) =>
        set((state) => ({
          progress: {
            ...state.progress,
            [languageId]: {
              ...state.progress[languageId],
              ...progressUpdate,
            } as UserProgress,
          },
        })),

      addCompletion: (completion) =>
        set((state) => ({
          completions: [...state.completions, completion],
        })),

      addXp: (amount) =>
        set((state) => ({
          totalXp: state.totalXp + amount,
        })),

      updateStreak: () => {
        const today = new Date().toISOString().split("T")[0];
        const { lastActivityDate, streakDays } = get();

        if (lastActivityDate === today) {
          return; // Already counted today
        }

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split("T")[0];

        if (lastActivityDate === yesterdayStr) {
          // Continuing streak
          set({ streakDays: streakDays + 1, lastActivityDate: today });
        } else {
          // Starting new streak
          set({ streakDays: 1, lastActivityDate: today });
        }
      },

      syncFromServer: (progressArray, completions) => {
        const progressMap: Record<string, UserProgress> = {};
        let totalXp = 0;

        progressArray.forEach((p) => {
          progressMap[p.language_id] = p;
          totalXp += p.xp;
        });

        set({
          progress: progressMap,
          completions,
          totalXp,
        });
      },

      reset: () => set(initialState),
    }),
    {
      name: "codementor-progress",
      partialize: (state) => ({
        currentLanguageId: state.currentLanguageId,
        currentTopicId: state.currentTopicId,
        totalXp: state.totalXp,
        streakDays: state.streakDays,
        lastActivityDate: state.lastActivityDate,
      }),
    }
  )
);
