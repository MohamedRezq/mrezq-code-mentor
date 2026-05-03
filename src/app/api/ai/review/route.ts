import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";
import { getSystemPrompt, getCodeReviewPrompt } from "@/lib/ai/prompts";
import type { SkillLevel } from "@/types";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const {
      code,
      language,
      userLevel = "beginner",
    }: { code: string; language: string; userLevel?: SkillLevel } =
      await request.json();

    if (!code || !language) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const stream = anthropic.messages.stream({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: getSystemPrompt(userLevel),
      messages: [
        {
          role: "user",
          content: getCodeReviewPrompt(code, language),
        },
      ],
    });

    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        for await (const event of stream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        controller.close();
      },
    });

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error) {
    console.error("AI review error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to review code" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
