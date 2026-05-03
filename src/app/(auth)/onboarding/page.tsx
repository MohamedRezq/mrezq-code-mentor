"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import {
  BookOpen,
  Code2,
  Eye,
  Lightbulb,
  Loader2,
  Rocket,
  Users,
  Wrench,
} from "lucide-react";
import type { LearningStyle, SkillLevel } from "@/types";

const learningStyles: {
  value: LearningStyle;
  label: string;
  description: string;
  icon: React.ReactNode;
}[] = [
  {
    value: "visual",
    label: "Visual",
    description: "I learn best with diagrams, charts, and visual aids",
    icon: <Eye className="h-6 w-6" />,
  },
  {
    value: "examples",
    label: "Examples",
    description: "Show me working code examples I can study",
    icon: <Code2 className="h-6 w-6" />,
  },
  {
    value: "theory",
    label: "Theory First",
    description: "I prefer understanding concepts before practice",
    icon: <BookOpen className="h-6 w-6" />,
  },
  {
    value: "hands-on",
    label: "Hands-On",
    description: "Let me dive in and learn by doing",
    icon: <Wrench className="h-6 w-6" />,
  },
];

const skillLevels: {
  value: SkillLevel;
  label: string;
  description: string;
  icon: React.ReactNode;
}[] = [
  {
    value: "beginner",
    label: "Beginner",
    description: "I'm new to programming",
    icon: <Lightbulb className="h-6 w-6" />,
  },
  {
    value: "intermediate",
    label: "Intermediate",
    description: "I know some programming basics",
    icon: <Users className="h-6 w-6" />,
  },
  {
    value: "advanced",
    label: "Advanced",
    description: "I'm experienced and want to level up",
    icon: <Rocket className="h-6 w-6" />,
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [learningStyle, setLearningStyle] = useState<LearningStyle | null>(
    null
  );
  const [skillLevel, setSkillLevel] = useState<SkillLevel | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  const handleComplete = async () => {
    if (!learningStyle || !skillLevel) return;

    setLoading(true);
    setError(null);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          learning_style: learningStyle,
          skill_level: skillLevel,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (updateError) throw updateError;

      router.push("/learn");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save preferences");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle className="text-2xl">
          {step === 1 ? "How do you learn best?" : "What's your experience?"}
        </CardTitle>
        <CardDescription>
          {step === 1
            ? "This helps us personalize your learning experience"
            : "We'll tailor the content to your level"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {step === 1 ? (
          <div className="grid gap-3">
            {learningStyles.map((style) => (
              <button
                key={style.value}
                onClick={() => setLearningStyle(style.value)}
                className={`flex items-center gap-4 p-4 rounded-lg border text-left transition-colors ${
                  learningStyle === style.value
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div
                  className={`p-2 rounded-md ${
                    learningStyle === style.value
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  {style.icon}
                </div>
                <div>
                  <div className="font-medium">{style.label}</div>
                  <div className="text-sm text-muted-foreground">
                    {style.description}
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="grid gap-3">
            {skillLevels.map((level) => (
              <button
                key={level.value}
                onClick={() => setSkillLevel(level.value)}
                className={`flex items-center gap-4 p-4 rounded-lg border text-left transition-colors ${
                  skillLevel === level.value
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div
                  className={`p-2 rounded-md ${
                    skillLevel === level.value
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  {level.icon}
                </div>
                <div>
                  <div className="font-medium">{level.label}</div>
                  <div className="text-sm text-muted-foreground">
                    {level.description}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {error && (
          <div className="mt-4 text-sm text-destructive bg-destructive/10 p-3 rounded-md">
            {error}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        {step === 2 ? (
          <Button variant="ghost" onClick={() => setStep(1)}>
            Back
          </Button>
        ) : (
          <div />
        )}
        {step === 1 ? (
          <Button onClick={() => setStep(2)} disabled={!learningStyle}>
            Continue
          </Button>
        ) : (
          <Button
            onClick={handleComplete}
            disabled={!skillLevel || loading}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Start Learning
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
