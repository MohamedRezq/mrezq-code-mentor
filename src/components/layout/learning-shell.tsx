"use client";

import { Sidebar } from "./sidebar";
import { UserNav } from "./user-nav";
import { AIChat } from "@/components/ai/ai-chat";
import { useUIStore } from "@/lib/stores/ui-store";
import { cn } from "@/lib/utils";

interface LearningShellProps {
  children: React.ReactNode;
}

export function LearningShell({ children }: LearningShellProps) {
  useUIStore();

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar className="hidden md:flex" />

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex h-16 items-center justify-between border-b bg-card/50 backdrop-blur-sm px-6 lg:px-8">
          <div className="flex items-center space-x-4">
            <h1 className="font-display text-xl font-semibold gradient-text">Learn</h1>
          </div>
          <UserNav />
        </header>

        {/* Main content */}
        <main
          className={cn(
            "flex-1 overflow-y-auto",
            "p-6 lg:p-8",
            "transition-all duration-300"
          )}
        >
          {children}
        </main>
      </div>

      {/* AI Chat */}
      <AIChat />
    </div>
  );
}
