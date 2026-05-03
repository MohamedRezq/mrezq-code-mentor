import type { AIExplanationRequest, SkillLevel } from "@/types";

export async function getAIExplanation(
  request: AIExplanationRequest
): Promise<ReadableStream<Uint8Array>> {
  const response = await fetch("/api/ai/explain", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error("Failed to get AI explanation");
  }

  if (!response.body) {
    throw new Error("No response body");
  }

  return response.body;
}

export async function getCodeHint(
  code: string,
  exercise: string,
  language: string
): Promise<ReadableStream<Uint8Array>> {
  const response = await fetch("/api/ai/hint", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ code, exercise, language }),
  });

  if (!response.ok) {
    throw new Error("Failed to get code hint");
  }

  if (!response.body) {
    throw new Error("No response body");
  }

  return response.body;
}

export async function reviewCode(
  code: string,
  language: string,
  userLevel?: SkillLevel
): Promise<ReadableStream<Uint8Array>> {
  const response = await fetch("/api/ai/review", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ code, language, userLevel }),
  });

  if (!response.ok) {
    throw new Error("Failed to review code");
  }

  if (!response.body) {
    throw new Error("No response body");
  }

  return response.body;
}

// Helper to read streaming response
export async function readStream(
  stream: ReadableStream<Uint8Array>,
  onChunk: (text: string) => void
): Promise<string> {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let result = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      result += chunk;
      onChunk(chunk);
    }
  } finally {
    reader.releaseLock();
  }

  return result;
}
