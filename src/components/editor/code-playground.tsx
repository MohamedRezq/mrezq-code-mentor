"use client";

import { useState } from "react";
import type { SandpackFiles } from "@codesandbox/sandpack-react";
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  useSandpack,
  SandpackConsole,
} from "@codesandbox/sandpack-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Play,
  RotateCcw,
  Lightbulb,
  Copy,
  Check,
  Terminal,
  Eye,
} from "lucide-react";

interface CodePlaygroundProps {
  initialCode?: string;
  language?: "javascript" | "html" | "css";
  showPreview?: boolean;
  showConsole?: boolean;
  readOnly?: boolean;
  onExplainCode?: (code: string) => void;
  height?: string;
}

function PlaygroundControls({
  onExplainCode,
  readOnly,
}: {
  onExplainCode?: (code: string) => void;
  readOnly?: boolean;
}) {
  const { sandpack } = useSandpack();
  const [copied, setCopied] = useState(false);

  const handleReset = () => {
    sandpack.resetAllFiles();
  };

  const handleCopy = async () => {
    const code = Object.values(sandpack.files)[0]?.code || "";
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExplain = () => {
    const code = Object.values(sandpack.files)[0]?.code || "";
    onExplainCode?.(code);
  };

  return (
    <div className="flex items-center gap-1 p-2 border-b bg-muted/30">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => sandpack.runSandpack()}
            >
              <Play className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Run code</TooltipContent>
        </Tooltip>

        {!readOnly && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" onClick={handleReset}>
                <RotateCcw className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Reset code</TooltipContent>
          </Tooltip>
        )}

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm" onClick={handleCopy}>
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>{copied ? "Copied!" : "Copy code"}</TooltipContent>
        </Tooltip>

        {onExplainCode && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" onClick={handleExplain}>
                <Lightbulb className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Explain this code</TooltipContent>
          </Tooltip>
        )}
      </TooltipProvider>
    </div>
  );
}

export function CodePlayground({
  initialCode = 'console.log("Hello, World!");',
  language = "javascript",
  showPreview = false,
  showConsole = true,
  readOnly = false,
  onExplainCode,
  height = "400px",
}: CodePlaygroundProps) {
  const { resolvedTheme } = useTheme();
  const [outputTab, setOutputTab] = useState<"console" | "preview">(
    showPreview ? "preview" : "console"
  );

  const files: SandpackFiles =
    language === "javascript"
      ? { "/index.js": { code: initialCode, active: true } }
      : { "/index.html": { code: initialCode, active: true } };

  const template = language === "javascript" ? "vanilla" : "static";

  return (
    <div className="rounded-lg border overflow-hidden" style={{ height }}>
      <SandpackProvider
        template={template}
        theme={resolvedTheme === "dark" ? "dark" : "light"}
        files={files}
        options={{
          autorun: true,
          autoReload: true,
          recompileMode: "delayed",
          recompileDelay: 500,
        }}
      >
        <PlaygroundControls onExplainCode={onExplainCode} readOnly={readOnly} />
        <SandpackLayout
          style={{
            height: `calc(${height} - 49px)`,
            borderRadius: 0,
            border: "none",
          }}
        >
          <SandpackCodeEditor
            showLineNumbers
            showInlineErrors
            wrapContent
            readOnly={readOnly}
            style={{ flex: 1 }}
          />
          <div className="flex flex-col" style={{ flex: 1 }}>
            {(showConsole || showPreview) && (
              <Tabs
                value={outputTab}
                onValueChange={(v) => setOutputTab(v as "console" | "preview")}
                className="flex flex-col h-full"
              >
                <TabsList className="justify-start rounded-none border-b bg-muted/30 h-auto p-0">
                  {showConsole && (
                    <TabsTrigger
                      value="console"
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-2"
                    >
                      <Terminal className="h-4 w-4 mr-2" />
                      Console
                    </TabsTrigger>
                  )}
                  {showPreview && (
                    <TabsTrigger
                      value="preview"
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-2"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </TabsTrigger>
                  )}
                </TabsList>
                <div className="flex-1 overflow-hidden">
                  {showConsole && (
                    <TabsContent
                      value="console"
                      className="h-full m-0 data-[state=inactive]:hidden"
                    >
                      <SandpackConsole
                        style={{ height: "100%" }}
                        showHeader={false}
                      />
                    </TabsContent>
                  )}
                  {showPreview && (
                    <TabsContent
                      value="preview"
                      className="h-full m-0 data-[state=inactive]:hidden"
                    >
                      <SandpackPreview
                        style={{ height: "100%" }}
                        showNavigator={false}
                        showRefreshButton={false}
                      />
                    </TabsContent>
                  )}
                </div>
              </Tabs>
            )}
          </div>
        </SandpackLayout>
      </SandpackProvider>
    </div>
  );
}
