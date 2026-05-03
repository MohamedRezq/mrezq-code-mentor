import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";
import { getChatSystemPrompt, type ChatContext } from "@/lib/ai/prompts";
import type { SkillLevel, ChatMessage } from "@/types";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface ChatRequest {
  message: string;
  history: Pick<ChatMessage, "role" | "content">[];
  context?: ChatContext;
  userLevel?: SkillLevel;
}

export async function POST(request: NextRequest) {
  try {
    // Check for API key
    if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY === "your_anthropic_api_key_here") {
      return new Response(
        JSON.stringify({ error: "Anthropic API key not configured. Please add your API key to .env.local" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const body: ChatRequest = await request.json();
    const { message, history = [], context, userLevel = "beginner" } = body;

    if (!message) {
      return new Response(
        JSON.stringify({ error: "Message is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Build messages array from history
    const messages: Anthropic.MessageParam[] = [
      ...history.map((msg) => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      })),
      {
        role: "user" as const,
        content: message,
      },
    ];

    const stream = anthropic.messages.stream({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: getChatSystemPrompt(userLevel, context),
      messages,
    });

    // Create a TransformStream to convert Anthropic's stream to text
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
    console.error("AI chat error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to generate response" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
