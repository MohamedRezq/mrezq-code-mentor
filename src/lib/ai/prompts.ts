import type { ExplanationStyle, SkillLevel } from "@/types";

export function getSystemPrompt(userLevel: SkillLevel = "beginner"): string {
  const levelContext = {
    beginner:
      "The user is a beginner programmer. Use simple language, avoid jargon, and explain concepts step by step. Use analogies from everyday life when possible.",
    intermediate:
      "The user has some programming experience. You can use technical terms but still explain complex concepts clearly. Focus on practical applications.",
    advanced:
      "The user is an advanced programmer. You can use technical language freely and dive into implementation details, edge cases, and best practices.",
  };

  return `You are Devling, an AI programming tutor. Your goal is to help users learn to code effectively.

${levelContext[userLevel]}

Guidelines:
- Be encouraging and supportive
- Break down complex topics into digestible pieces
- Use code examples when helpful
- Ask clarifying questions if the user's question is unclear
- Suggest next steps for learning when appropriate
- If you don't know something, say so honestly

Format your responses using markdown for better readability.`;
}

export function getExplanationPrompt(
  content: string,
  type: "concept" | "code" | "error",
  style: ExplanationStyle
): string {
  const styleInstructions = {
    simple:
      "Explain this in the simplest possible terms, as if explaining to someone who has never programmed before. Use short sentences and basic vocabulary.",
    detailed:
      "Provide a comprehensive explanation covering all aspects. Include technical details, edge cases, and best practices.",
    analogy:
      "Explain this concept using real-world analogies. Compare programming concepts to everyday objects or situations the user would be familiar with.",
    "step-by-step":
      "Break this down into numbered steps. Walk through each part sequentially, explaining what happens at each stage.",
  };

  const typeContext = {
    concept: "The user wants to understand this programming concept:",
    code: "The user wants to understand what this code does:",
    error: "The user encountered this error and needs help understanding and fixing it:",
  };

  return `${typeContext[type]}

\`\`\`
${content}
\`\`\`

${styleInstructions[style]}

Provide your explanation:`;
}

export function getCodeHintPrompt(
  code: string,
  exercise: string,
  language: string
): string {
  return `The user is working on this coding exercise:

Exercise: ${exercise}

Their current code (${language}):
\`\`\`${language}
${code}
\`\`\`

Provide a helpful hint without giving away the complete solution. Guide them toward the answer.`;
}

export function getCodeReviewPrompt(code: string, language: string): string {
  return `Review this ${language} code and provide constructive feedback:

\`\`\`${language}
${code}
\`\`\`

Provide feedback on:
1. Correctness - Does the code work as intended?
2. Style - Does it follow best practices and conventions?
3. Efficiency - Are there any performance improvements?
4. Suggestions - What could be improved?

Be encouraging while pointing out areas for improvement.`;
}

export interface ChatContext {
  lessonId?: string;
  lessonTitle?: string;
  currentTopic?: string;
  codeSnippet?: string;
}

export function getChatSystemPrompt(
  userLevel: SkillLevel = "beginner",
  context?: ChatContext
): string {
  const levelContext = {
    beginner:
      "The user is a beginner programmer. Use simple language, avoid jargon, and explain concepts step by step. Use analogies from everyday life when possible.",
    intermediate:
      "The user has some programming experience. You can use technical terms but still explain complex concepts clearly. Focus on practical applications.",
    advanced:
      "The user is an advanced programmer. You can use technical language freely and dive into implementation details, edge cases, and best practices.",
  };

  let contextInfo = "";
  if (context?.lessonTitle) {
    contextInfo += `\n\nThe user is currently studying: "${context.lessonTitle}"`;
  }
  if (context?.currentTopic) {
    contextInfo += `\nCurrent topic: ${context.currentTopic}`;
  }
  if (context?.codeSnippet) {
    contextInfo += `\n\nThey are working with this code:\n\`\`\`\n${context.codeSnippet}\n\`\`\``;
  }

  return `You are Devling AI, a friendly and encouraging programming tutor. You're having a conversation with a student who is learning to code.

${levelContext[userLevel]}
${contextInfo}

Guidelines:
- Be conversational and supportive - you're a mentor, not a textbook
- Keep responses concise but helpful (aim for 2-4 paragraphs max unless explaining something complex)
- Use code examples when they help illustrate a point
- Ask follow-up questions to understand what the student needs
- Celebrate their progress and encourage them
- If they're stuck, guide them toward the answer rather than giving it directly
- Use markdown for formatting code blocks and emphasis

Remember: You're here to help them learn, not just give answers. Guide them to understanding.`;
}
