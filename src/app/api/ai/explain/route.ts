import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";
import { getSystemPrompt, getExplanationPrompt } from "@/lib/ai/prompts";
import type { AIExplanationRequest } from "@/types";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const body: AIExplanationRequest = await request.json();
    const { content, type, style, userLevel = "beginner" } = body;

    if (!content || !type || !style) {
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
          content: getExplanationPrompt(content, type, style),
        },
      ],
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
    console.error("AI explanation error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to generate explanation" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
