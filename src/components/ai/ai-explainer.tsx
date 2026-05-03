"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { getAIExplanation, readStream } from "@/lib/ai/client";
import type { ExplanationStyle, SkillLevel } from "@/types";

interface AIExplainerProps {
  content: string;
  type: "concept" | "code" | "error";
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userLevel?: SkillLevel;
}

const styleOptions: { value: ExplanationStyle; label: string }[] = [
  { value: "simple", label: "Simple" },
  { value: "detailed", label: "Detailed" },
  { value: "analogy", label: "With Analogies" },
  { value: "step-by-step", label: "Step by Step" },
];

export function AIExplainer({
  content,
  type,
  open,
  onOpenChange,
  userLevel = "beginner",
}: AIExplainerProps) {
  const [style, setStyle] = useState<ExplanationStyle>("simple");
  const [explanation, setExplanation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchExplanation = useCallback(
    async (explainStyle: ExplanationStyle) => {
      setLoading(true);
      setError(null);
      setExplanation("");

      try {
        const stream = await getAIExplanation({
          content,
          type,
          style: explainStyle,
          userLevel,
        });

        await readStream(stream, (chunk) => {
          setExplanation((prev) => prev + chunk);
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to get explanation");
      } finally {
        setLoading(false);
      }
    },
    [content, type, userLevel]
  );

  const handleStyleChange = (newStyle: ExplanationStyle) => {
    setStyle(newStyle);
    fetchExplanation(newStyle);
  };

  const handleOpen = (isOpen: boolean) => {
    onOpenChange(isOpen);
    if (isOpen && !explanation && !loading) {
      fetchExplanation(style);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Explanation
          </DialogTitle>
          <DialogDescription>
            {type === "code"
              ? "Understanding what this code does"
              : type === "error"
              ? "Understanding and fixing this error"
              : "Explaining this concept"}
          </DialogDescription>
        </DialogHeader>

        {/* Style Selector */}
        <div className="flex items-center gap-4 py-2">
          <span className="text-sm text-muted-foreground">Explain it:</span>
          <Select
            value={style}
            onValueChange={(v) => handleStyleChange(v as ExplanationStyle)}
          >
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {styleOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        </div>

        {/* Code Preview */}
        {type === "code" && (
          <div className="rounded-md bg-muted p-3 max-h-32 overflow-auto">
            <pre className="text-sm">
              <code>{content}</code>
            </pre>
          </div>
        )}

        {/* Explanation */}
        <div className="flex-1 overflow-auto">
          {error ? (
            <div className="text-sm text-destructive bg-destructive/10 p-4 rounded-md">
              {error}
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => fetchExplanation(style)}
              >
                Try Again
              </Button>
            </div>
          ) : explanation ? (
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <ReactMarkdown>{explanation}</ReactMarkdown>
            </div>
          ) : loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Hook for using the explainer
export function useAIExplainer() {
  const [explainerState, setExplainerState] = useState<{
    open: boolean;
    content: string;
    type: "concept" | "code" | "error";
  }>({
    open: false,
    content: "",
    type: "code",
  });

  const openExplainer = (
    content: string,
    type: "concept" | "code" | "error" = "code"
  ) => {
    setExplainerState({ open: true, content, type });
  };

  const closeExplainer = () => {
    setExplainerState((prev) => ({ ...prev, open: false }));
  };

  return {
    explainerState,
    openExplainer,
    closeExplainer,
    setExplainerOpen: (open: boolean) =>
      setExplainerState((prev) => ({ ...prev, open })),
  };
}
