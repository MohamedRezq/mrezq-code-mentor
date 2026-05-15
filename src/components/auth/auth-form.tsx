"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { Loader2, Mail } from "lucide-react";

interface AuthFormProps {
  mode: "login" | "signup";
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/learn";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === "signup") {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { name },
            emailRedirectTo: `${window.location.origin}/api/auth/callback`,
          },
        });

        if (signUpError) throw signUpError;
        setConfirmed(true);
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) throw signInError;

        // Ensure session is written to cookies before navigation
        await supabase.auth.getSession();

        router.push(redirect);
        router.refresh();
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "An error occurred";
      if (msg.toLowerCase().includes("email not confirmed")) {
        setError(
          "Please confirm your email first (check inbox/spam), or disable email confirmation in Supabase Auth settings for local dev."
        );
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  if (confirmed) {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="pt-10 pb-10 text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
            <Mail className="w-7 h-7 text-primary" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Check your email</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We sent a confirmation link to{" "}
            <span className="font-medium text-foreground">{email}</span>.
            Click the link to activate your account and start learning.
          </p>
          <p className="text-xs text-muted-foreground">
            Didn&apos;t receive it? Check your spam folder.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">
          {mode === "login" ? "Welcome back" : "Create your account"}
        </CardTitle>
        <CardDescription>
          {mode === "login"
            ? "Enter your credentials to sign in"
            : "Enter your details to get started"}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          {error && (
            <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {mode === "login" ? "Sign in" : "Create account"}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          {mode === "login" ? (
            <>
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-primary hover:underline font-medium">
                Sign up
              </Link>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline font-medium">
                Sign in
              </Link>
            </>
          )}
        </p>
      </CardFooter>
    </Card>
  );
}
