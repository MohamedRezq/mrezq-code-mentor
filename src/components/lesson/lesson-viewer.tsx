"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Lightbulb,
  RotateCcw,
  MessageCircle,
  Code2,
  FileText,
  Circle,
  Sparkles,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { CodePlayground } from "@/components/editor/code-playground";
import { AIExplainer, useAIExplainer } from "@/components/ai/ai-explainer";
import { useChatStore } from "@/lib/stores/chat-store";
import { cn } from "@/lib/utils";
import type { LessonContent, LessonSection } from "@/types";

interface LessonViewerProps {
  title: string;
  content: LessonContent;
  lessonId?: string;
  currentSection?: number;
  onComplete?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  hasNext?: boolean;
  hasPrevious?: boolean;
}

function getSectionIcon(type: LessonSection["type"]) {
  switch (type) {
    case "text":
      return FileText;
    case "code":
      return Code2;
    case "exercise":
      return Lightbulb;
    default:
      return Circle;
  }
}

function LessonSectionView({
  section,
  onExplainCode,
  onAskAI,
}: {
  section: LessonSection;
  onExplainCode: (code: string) => void;
  onAskAI: (code: string) => void;
}) {
  switch (section.type) {
    case "text":
      return (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="prose prose-sm dark:prose-invert max-w-none"
        >
          <ReactMarkdown>{section.content}</ReactMarkdown>
        </motion.div>
      );

    case "code":
      return (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Code2 className="h-4 w-4" />
              <span className="capitalize">{section.language || "javascript"}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onAskAI(section.content)}
              className="text-violet-500 hover:text-violet-600 hover:bg-violet-500/10"
            >
              <MessageCircle className="h-4 w-4 mr-1" />
              Ask AI
            </Button>
          </div>
          <CodePlayground
            initialCode={section.content}
            language={
              (section.language as "javascript" | "html" | "css") || "javascript"
            }
            showConsole={true}
            onExplainCode={onExplainCode}
            height="300px"
          />
        </motion.div>
      );

    case "exercise":
      return (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          <Card variant="gradient" className="border-violet-500/30">
            <CardContent className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-violet-500">
                  <div className="p-1.5 rounded-lg bg-violet-500/10">
                    <Lightbulb className="h-4 w-4" />
                  </div>
                  <span className="font-semibold">Exercise</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onAskAI(section.solution || section.content)}
                  className="text-violet-500 hover:text-violet-600 hover:bg-violet-500/10"
                >
                  <MessageCircle className="h-4 w-4 mr-1" />
                  Get Help
                </Button>
              </div>
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <ReactMarkdown>{section.content}</ReactMarkdown>
              </div>
              {section.hint && (
                <details className="text-sm group">
                  <summary className="cursor-pointer text-muted-foreground hover:text-foreground flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-cyan-500" />
                    Need a hint?
                  </summary>
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-2 p-3 bg-muted rounded-lg border-l-2 border-cyan-500"
                  >
                    {section.hint}
                  </motion.p>
                </details>
              )}
              <CodePlayground
                initialCode={section.solution || "// Write your code here"}
                language={
                  (section.language as "javascript" | "html" | "css") ||
                  "javascript"
                }
                showConsole={true}
                onExplainCode={onExplainCode}
                height="250px"
              />
            </CardContent>
          </Card>
        </motion.div>
      );

    default:
      return null;
  }
}

export function LessonViewer({
  title,
  content,
  lessonId,
  currentSection = 0,
  onComplete,
  onNext,
  onPrevious,
  hasNext = false,
  hasPrevious = false,
}: LessonViewerProps) {
  const [sectionIndex, setSectionIndex] = useState(currentSection);
  const [completed, setCompleted] = useState(false);
  const [completedSections, setCompletedSections] = useState<Set<number>>(new Set());
  const { explainerState, openExplainer, setExplainerOpen } = useAIExplainer();
  const { setIsOpen: setChatOpen, setContext } = useChatStore();

  const sections = content.sections;
  const totalSections = sections.length;
  const currentSectionData = sections[sectionIndex];
  const progress = ((sectionIndex + 1) / totalSections) * 100;
  const isLastSection = sectionIndex === totalSections - 1;

  const handleNextSection = () => {
    // Mark current section as completed
    setCompletedSections((prev) => new Set(prev).add(sectionIndex));

    if (isLastSection) {
      setCompleted(true);
      onComplete?.();
    } else {
      setSectionIndex((prev) => Math.min(prev + 1, totalSections - 1));
    }
  };

  const handlePrevSection = () => {
    setSectionIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleJumpToSection = (index: number) => {
    setSectionIndex(index);
  };

  const handleExplainCode = (code: string) => {
    openExplainer(code, "code");
  };

  const handleAskAI = (codeSnippet: string) => {
    setContext({
      lessonId,
      lessonTitle: title,
      currentTopic: currentSectionData?.type,
      codeSnippet,
    });
    setChatOpen(true);
  };

  if (completed) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-16 space-y-6"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.2 }}
          className="p-6 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full shadow-glow"
        >
          <CheckCircle2 className="h-12 w-12 text-white" />
        </motion.div>
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold gradient-text">Lesson Complete!</h2>
          <p className="text-muted-foreground">
            Great job! You've completed this lesson.
          </p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" onClick={() => setCompleted(false)}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Review Again
          </Button>
          {hasNext && (
            <Button variant="gradient" onClick={onNext}>
              Next Lesson
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <div className="flex gap-6">
      {/* Vertical Stepper */}
      <div className="hidden lg:flex flex-col w-12 shrink-0">
        <div className="sticky top-6 space-y-2">
          {sections.map((section, index) => {
            const Icon = getSectionIcon(section.type);
            const isActive = index === sectionIndex;
            const isCompleted = completedSections.has(index);

            return (
              <button
                key={index}
                onClick={() => handleJumpToSection(index)}
                className={cn(
                  "relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200",
                  isActive
                    ? "bg-gradient-to-br from-violet-500 to-blue-500 text-white shadow-glow-sm"
                    : isCompleted
                    ? "bg-green-500/20 text-green-500 border-2 border-green-500"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
              >
                {isCompleted && !isActive ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <Icon className="h-4 w-4" />
                )}
                {/* Connector line */}
                {index < sections.length - 1 && (
                  <div
                    className={cn(
                      "absolute top-full left-1/2 w-0.5 h-2 -translate-x-1/2",
                      isCompleted
                        ? "bg-green-500"
                        : "bg-muted"
                    )}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 space-y-6 min-w-0">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">{title}</h1>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleAskAI("")}
              className="text-violet-500 hover:text-violet-600 hover:bg-violet-500/10"
            >
              <MessageCircle className="h-4 w-4 mr-1" />
              Ask AI Tutor
            </Button>
          </div>
          <div className="flex items-center gap-4">
            <Progress value={progress} variant="gradient" className="flex-1 h-2" />
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              {sectionIndex + 1} / {totalSections}
            </span>
          </div>
        </div>

        {/* Section indicator for mobile */}
        <div className="flex lg:hidden items-center gap-2 overflow-x-auto py-2">
          {sections.map((section, index) => {
            const isActive = index === sectionIndex;
            const isCompleted = completedSections.has(index);

            return (
              <button
                key={index}
                onClick={() => handleJumpToSection(index)}
                className={cn(
                  "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all",
                  isActive
                    ? "bg-gradient-to-br from-violet-500 to-blue-500 text-white"
                    : isCompleted
                    ? "bg-green-500/20 text-green-500"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {isCompleted && !isActive ? (
                  <CheckCircle2 className="h-3 w-3" />
                ) : (
                  index + 1
                )}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="min-h-[300px]">
          <AnimatePresence mode="wait">
            {currentSectionData && (
              <LessonSectionView
                key={sectionIndex}
                section={currentSectionData}
                onExplainCode={handleExplainCode}
                onAskAI={handleAskAI}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex gap-2">
            {hasPrevious && sectionIndex === 0 && (
              <Button variant="outline" onClick={onPrevious}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous Lesson
              </Button>
            )}
            {sectionIndex > 0 && (
              <Button variant="outline" onClick={handlePrevSection}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            )}
          </div>

          <Button variant="gradient" onClick={handleNextSection}>
            {isLastSection ? (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Complete Lesson
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>

      {/* AI Explainer Dialog */}
      <AIExplainer
        content={explainerState.content}
        type={explainerState.type}
        open={explainerState.open}
        onOpenChange={setExplainerOpen}
      />
    </div>
  );
}
