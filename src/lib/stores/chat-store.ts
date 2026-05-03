import { create } from "zustand";
import type { ChatMessage, ChatContext } from "@/types";

interface ChatState {
  // Messages
  messages: ChatMessage[];
  addMessage: (message: Omit<ChatMessage, "id" | "timestamp">) => void;
  clearMessages: () => void;

  // UI State
  isOpen: boolean;
  isLoading: boolean;
  setIsOpen: (open: boolean) => void;
  toggleOpen: () => void;
  setIsLoading: (loading: boolean) => void;

  // Context
  context: ChatContext;
  setContext: (context: ChatContext) => void;
  clearContext: () => void;

  // Streaming
  streamingContent: string;
  setStreamingContent: (content: string) => void;
  appendStreamingContent: (content: string) => void;
  finalizeStreamingMessage: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  // Messages
  messages: [],
  addMessage: (message) =>
    set((state) => ({
      messages: [
        ...state.messages,
        {
          ...message,
          id: crypto.randomUUID(),
          timestamp: new Date(),
        },
      ],
    })),
  clearMessages: () => set({ messages: [] }),

  // UI State
  isOpen: false,
  isLoading: false,
  setIsOpen: (open) => set({ isOpen: open }),
  toggleOpen: () => set((state) => ({ isOpen: !state.isOpen })),
  setIsLoading: (loading) => set({ isLoading: loading }),

  // Context
  context: {},
  setContext: (context) => set({ context }),
  clearContext: () => set({ context: {} }),

  // Streaming
  streamingContent: "",
  setStreamingContent: (content) => set({ streamingContent: content }),
  appendStreamingContent: (content) =>
    set((state) => ({ streamingContent: state.streamingContent + content })),
  finalizeStreamingMessage: () => {
    const { streamingContent, context } = get();
    if (streamingContent) {
      set((state) => ({
        messages: [
          ...state.messages,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content: streamingContent,
            timestamp: new Date(),
            context: context.lessonId ? { lessonId: context.lessonId } : undefined,
          },
        ],
        streamingContent: "",
        isLoading: false,
      }));
    }
  },
}));
