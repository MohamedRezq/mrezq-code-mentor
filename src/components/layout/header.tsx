"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GraduationCap, Moon, Sun, Menu, Sparkles, X } from "lucide-react";
import { useUIStore } from "@/lib/stores/ui-store";
import { useState, useEffect } from "react";

interface HeaderProps {
  showAuth?: boolean;
  showNav?: boolean;
}

export function Header({ showAuth = true, showNav = true }: HeaderProps) {
  const { setTheme } = useTheme();
  const { mobileMenuOpen, setMobileMenuOpen } = useUIStore();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-white/10"
          : "bg-transparent"
      }`}
    >
      <div className="container">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <GraduationCap className="h-7 w-7 text-violet-500 transition-transform group-hover:scale-110" />
              <Sparkles className="absolute -top-1 -right-1 h-3 w-3 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="font-display font-bold text-xl">
              <span className="gradient-text">Devling</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          {showNav && (
            <nav className="hidden md:flex items-center gap-8">
              <Link
                href="/learn"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Learn
              </Link>
              <Link
                href="/playground"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Playground
              </Link>
              <Link
                href="/pricing"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Pricing
              </Link>
            </nav>
          )}

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Theme toggle */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-background/95 backdrop-blur-xl border-white/10">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                  System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Auth buttons */}
            {showAuth && (
              <div className="hidden md:flex items-center gap-3">
                <Button variant="ghost" asChild className="text-sm">
                  <Link href="/login">Log in</Link>
                </Button>
                <Button variant="gradient" asChild className="text-sm rounded-full px-6">
                  <Link href="/signup">Get Started</Link>
                </Button>
              </div>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden rounded-full"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
              <span className="sr-only">Toggle menu</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-xl border-b border-white/10">
          <nav className="container py-6 space-y-4">
            {showNav && (
              <>
                <Link
                  href="/learn"
                  className="block text-lg font-medium hover:text-violet-400 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Learn
                </Link>
                <Link
                  href="/playground"
                  className="block text-lg font-medium hover:text-violet-400 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Playground
                </Link>
                <Link
                  href="/pricing"
                  className="block text-lg font-medium hover:text-violet-400 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Pricing
                </Link>
              </>
            )}
            {showAuth && (
              <div className="pt-4 border-t border-white/10 space-y-3">
                <Button variant="ghost" asChild className="w-full justify-center">
                  <Link href="/login">Log in</Link>
                </Button>
                <Button variant="gradient" asChild className="w-full">
                  <Link href="/signup">Get Started</Link>
                </Button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
