"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  BookOpen,
  Code2,
  GraduationCap,
  Home,
  ChevronLeft,
  ChevronRight,
  Trophy,
  Flame,
  Sparkles,
} from "lucide-react";
import { useUIStore } from "@/lib/stores/ui-store";
import { useProgressStore } from "@/lib/stores/progress-store";

interface SidebarProps {
  className?: string;
}

const navItems = [
  { href: "/learn", label: "Dashboard", icon: Home },
  { href: "/learn/javascript", label: "JavaScript", icon: BookOpen },
  { href: "/playground", label: "Playground", icon: Code2 },
];

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const { totalXp, streakDays } = useProgressStore();

  return (
    <aside
      className={cn(
        "relative flex flex-col border-r transition-all duration-300",
        sidebarOpen
          ? "w-64 bg-card"
          : "w-16 glass-subtle",
        className
      )}
    >
      {/* Gradient accent line */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-violet-500 via-blue-500 to-cyan-500 opacity-80" />

      {/* Toggle button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-3 top-6 z-10 h-6 w-6 rounded-full border bg-background shadow-sm hover:shadow-glow-sm transition-shadow"
        onClick={toggleSidebar}
      >
        {sidebarOpen ? (
          <ChevronLeft className="h-3 w-3" />
        ) : (
          <ChevronRight className="h-3 w-3" />
        )}
      </Button>

      {/* Logo */}
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/" className="flex items-center space-x-2">
          <div className="relative">
            <GraduationCap className="h-6 w-6 text-violet-500" />
            <Sparkles className="absolute -top-1 -right-1 h-3 w-3 text-cyan-500" />
          </div>
          {sidebarOpen && (
            <span className="font-bold gradient-text">Devling</span>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href ||
            (item.href !== "/learn" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-gradient-to-r from-violet-500 via-blue-500 to-cyan-500 text-white shadow-md"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className={cn("h-4 w-4 shrink-0", isActive && "text-white")} />
              {sidebarOpen && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Stats section */}
      {sidebarOpen && (
        <div className="border-t p-4 space-y-4 bg-gradient-to-t from-muted/50 to-transparent">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 rounded-md bg-yellow-500/10">
                <Trophy className="h-4 w-4 text-yellow-500" />
              </div>
              <span className="text-muted-foreground">XP</span>
            </div>
            <span className="font-bold text-yellow-600 dark:text-yellow-400">{totalXp}</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 rounded-md bg-orange-500/10">
                <Flame className="h-4 w-4 text-orange-500" />
              </div>
              <span className="text-muted-foreground">Streak</span>
            </div>
            <span className="font-bold text-orange-600 dark:text-orange-400">{streakDays} days</span>
          </div>

          <Separator className="bg-border/50" />

          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Daily Goal</span>
              <span className="font-medium">2/3 lessons</span>
            </div>
            <Progress value={66} variant="gradient" className="h-2" />
          </div>
        </div>
      )}
    </aside>
  );
}
