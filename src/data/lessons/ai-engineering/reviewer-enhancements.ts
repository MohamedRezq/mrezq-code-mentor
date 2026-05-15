import type { ContentBlock } from '@/types/lesson'
import type { LessonEnhancement } from '@/lib/curriculum/reviewer-types'
import { clarify, roadmapIntro } from '@/lib/curriculum/reviewer-merge'

function practice(
  title: string,
  description: string,
  starterCode: string,
  solution: string,
  hints?: string[]
): ContentBlock {
  return {
    type: 'exercise',
    title,
    description,
    starterCode,
    language: 'python',
    solution,
    hints,
  }
}

/** Final reviewer pass — Module 06 AI Engineering (27 lessons). */
export const AI_REVIEWER: Record<string, LessonEnhancement> = {
  'py-basics': {
    intro: [roadmapIntro('ai-engineer', 'Python for AI', 'syntax, variables, control flow for scripts')],
    outro: [
      clarify(
        'Scripts vs notebooks',
        'Use **`.py` files** for anything you deploy (agents, ETL, APIs). Jupyter is fine for exploration — promote stable code into modules with `if __name__ == "__main__":`.'
      ),
    ],
  },
  'py-data-structures': {
    intro: [roadmapIntro('python', 'Python for AI', 'lists, dicts, sets for prompts and tool payloads')],
    outro: [
      practice(
        'Prompt payload dict',
        'Build a `messages` list with one system and one user dict (keys `role`, `content`) for a support bot.',
        `# messages = [
`,
        `messages = [
  {"role": "system", "content": "You are a concise support agent."},
  {"role": "user", "content": "Reset my API key."},
]`,
      ),
    ],
  },
  'py-oop-pydantic': {
    intro: [roadmapIntro('ai-engineer', 'Python for AI', 'Pydantic models for structured LLM output')],
    outro: [
      clarify(
        'Pydantic before the API call',
        'Define the **output schema** as a Pydantic model first, then prompt the model to fill it. Validation errors are cheaper than fixing bad JSON in production.'
      ),
    ],
  },
  'py-files-json': {
    intro: [roadmapIntro('python', 'Python for AI', 'JSONL datasets, eval logs, config files')],
    outro: [
      clarify('JSONL for evals', 'One JSON object per line — stream-friendly for large eval sets. Use `json.loads(line)` in a loop, not loading a 2GB array into memory.'),
    ],
  },
  'py-http-requests': {
    intro: [roadmapIntro('ai-engineer', 'Python for AI', 'httpx, headers, API keys from env')],
    outro: [
      practice(
        'Env-based API key',
        'In comments, show the pattern: read `OPENAI_API_KEY` from `os.environ` and pass it in headers — never hard-code.',
        `# import os
# api_key = ...
# headers = ...
`,
        `# import os
# api_key = os.environ["OPENAI_API_KEY"]
# headers = {"Authorization": f"Bearer {api_key}"}`,
        ['Use os.environ.get with a clear error if missing'],
      ),
    ],
  },
  'py-async': {
    intro: [roadmapIntro('ai-engineer', 'Python for AI', 'asyncio, httpx.AsyncClient, batch calls')],
    outro: [
      clarify(
        'Batch async',
        'Use `asyncio.gather` for concurrent LLM calls — cap concurrency with a semaphore when providers rate-limit (429).'
      ),
      practice(
        'Gather pattern',
        'Complete the comment: what does `asyncio.gather(*tasks)` return when all tasks succeed?',
        `# result = asyncio.gather(task_a(), task_b())
# When both succeed, result is:
`,
        `# A list of return values in order: [result_a, result_b]`,
      ),
    ],
  },
  'llm-how-it-works': {
    intro: [roadmapIntro('ai-engineer', 'LLM APIs', 'tokens, context window, temperature, top_p')],
    outro: [
      clarify(
        'Temperature vs top_p',
        '**Temperature** scales randomness of the whole distribution. **top_p** (nucleus) samples from the smallest set of tokens whose cumulative probability ≥ p. For factual APIs use low temperature (0–0.3); for creative drafts, higher (0.7–1.0).'
      ),
      practice(
        'Token estimate',
        'Roughly how many tokens is English text ~4 characters long? If a prompt is 2,000 tokens and max_tokens is 500, what is the minimum context window needed?',
        `# chars ≈ 8000 → tokens ≈ ?
# context needed ≈ ?
`,
        `# ~2000 tokens for 8000 chars (rule of thumb ÷4)
# need at least 2000 + 500 = 2500 tokens context (plus safety margin)`,
      ),
    ],
  },
  'llm-openai-api': {
    intro: [roadmapIntro('ai-engineer', 'LLM APIs', 'chat.completions, roles, usage fields')],
    outro: [
      clarify(
        'Log usage every call',
        'Read `response.usage.prompt_tokens` and `completion_tokens` — aggregate per user/feature for cost dashboards before you scale.'
      ),
    ],
  },
  'llm-claude-api': {
    intro: [roadmapIntro('ai-engineer', 'LLM APIs', 'Anthropic messages, system param, tool use')],
    outro: [
      clarify(
        'OpenAI vs Anthropic message shape',
        'OpenAI puts system in `messages` as a role. Anthropic often uses a top-level `system` string. Adapter layers in your codebase prevent vendor lock-in at the call site.'
      ),
    ],
  },
  'llm-prompt-fundamentals': {
    intro: [roadmapIntro('prompt-engineering', 'LLM APIs', 'system/user/assistant, few-shot, delimiters')],
    outro: [
      practice(
        'Few-shot template',
        'Add one example pair (user question + ideal assistant answer) before the real user message in comments.',
        `# system: classify sentiment
# example user: "I love this product"
# example assistant: positive
# real user: "Shipping took forever"
`,
        `# Few-shot teaches format without fine-tuning`,
      ),
    ],
  },
  'llm-chain-of-thought': {
    intro: [roadmapIntro('ai-engineer', 'LLM APIs', 'reasoning traces, self-consistency')],
    outro: [
      clarify(
        'Show reasoning only when needed',
        'Chain-of-thought helps math and multi-step logic. For production user chat, you may hide the scratchpad and only return the final answer — but keep traces in logs for debugging.'
      ),
    ],
  },
  'llm-structured-output': {
    intro: [roadmapIntro('ai-engineer', 'LLM APIs', 'JSON mode, response_format, tool schemas')],
    outro: [
      clarify(
        'Validate after parse',
        'JSON mode reduces syntax errors; **Pydantic** (or Zod on TS) still validates semantics. Never trust model output for SQL or shell without allowlists.'
      ),
    ],
  },
  'llm-streaming': {
    intro: [roadmapIntro('ai-engineer', 'LLM APIs', 'SSE, deltas, UX for partial tokens')],
    outro: [
      practice(
        'Streaming UX',
        'List two UI reasons to stream tokens to the client instead of waiting for the full completion.',
        `# 1.
# 2.
`,
        `# 1. Perceived latency — user sees progress immediately
# 2. Can cancel long generations early; partial results usable in copilot UIs`,
      ),
    ],
  },
  'rag-embeddings': {
    intro: [roadmapIntro('ai-engineer', 'RAG', 'embedding models, cosine similarity, normalization')],
    outro: [
      clarify(
        'Same model for index and query',
        'Embed documents and queries with the **same embedding model and dimensions**. Mixing models breaks similarity scores.'
      ),
    ],
  },
  'rag-vector-databases': {
    intro: [roadmapIntro('ai-engineer', 'RAG', 'pgvector, Pinecone, metadata filters')],
    outro: [
      clarify(
        'Metadata filters first',
        'Filter by `tenant_id`, `doc_type`, or date **before** vector search when possible — smaller search space, better relevance, lower cost.'
      ),
    ],
  },
  'rag-pipeline': {
    intro: [roadmapIntro('ai-engineer', 'RAG', 'chunking, retrieval, augmentation, generation')],
    outro: [
      practice(
        'Chunk size tradeoff',
        'In one sentence each: why chunks that are too small hurt? Too large?',
        `# too small:
# too large:
`,
        `# too small: lose context, more retrieval noise
# too large: dilute relevance, hit context limits, worse embeddings`,
      ),
    ],
  },
  'rag-hybrid-search': {
    intro: [roadmapIntro('ai-engineer', 'RAG', 'BM25 + vector, reciprocal rank fusion')],
    outro: [
      clarify(
        'When hybrid wins',
        'Keyword search finds exact SKUs and error codes; vectors find paraphrases. Production RAG often combines both with RRF or weighted scores.'
      ),
    ],
  },
  'rag-advanced': {
    intro: [roadmapIntro('ai-engineer', 'RAG', 'rerankers, citation, eval harness')],
    outro: [
      clarify(
        'Measure retrieval separately',
        'Track **recall@k** on a golden question set before tuning the generator. A perfect LLM cannot fix bad retrieval.'
      ),
    ],
  },
  'agents-intro': {
    intro: [roadmapIntro('ai-agents', 'Agents', 'ReAct loop, observe-think-act')],
    outro: [
      practice(
        'ReAct steps',
        'Name the three steps in one ReAct cycle in order.',
        `# 1.
# 2.
# 3.
`,
        `# 1. Thought (reason about state)
# 2. Action (tool call or answer)
# 3. Observation (tool result feeds next thought)`,
      ),
    ],
  },
  'agents-tool-calling': {
    intro: [roadmapIntro('ai-agents', 'Agents', 'JSON schema tools, strict mode')],
    outro: [
      clarify(
        'Narrow tool surface',
        'Give agents **few, well-documented tools** with typed parameters. Every extra tool increases wrong-call rate and prompt bloat.'
      ),
    ],
  },
  'agents-langgraph': {
    intro: [roadmapIntro('ai-agents', 'Agents', 'state graphs, checkpoints, human-in-the-loop')],
    outro: [
      clarify(
        'Graphs for branching workflows',
        'Use LangGraph when you need cycles, approval gates, or parallel branches — linear chains are enough for simple Q&A bots.'
      ),
    ],
  },
  'agents-multi-agent': {
    intro: [roadmapIntro('ai-agents', 'Agents', 'supervisor, handoffs, specialist roles')],
    outro: [
      clarify(
        'Start single-agent',
        'Add a second agent only when one prompt cannot hold the role boundaries. Supervisors route; workers execute — log every handoff.'
      ),
    ],
  },
  'agents-context-engineering': {
    intro: [roadmapIntro('ai-engineer', 'Agents', 'memory tiers, summarization, token budget')],
    outro: [
      practice(
        'Context budget',
        'If context is 128k tokens and you reserve 4k for output, how many tokens remain for system + history + RAG chunks?',
        `# remaining ≈
`,
        `# 128_000 - 4_000 = 124_000 tokens for system, tools, history, retrieved docs`,
      ),
    ],
  },
  'prod-evaluation': {
    intro: [roadmapIntro('ai-engineer', 'Production', 'golden sets, LLM-as-judge, regression')],
    outro: [
      clarify(
        'Eval before every prompt change',
        'Treat prompts like code: CI runs evals on a frozen dataset; block deploy if faithfulness or safety scores drop.'
      ),
    ],
  },
  'prod-finetuning': {
    intro: [roadmapIntro('ai-engineer', 'Production', 'when to fine-tune vs RAG vs prompt')],
    outro: [
      clarify(
        'Default order',
        'Try **prompt + RAG** first. Fine-tune when you need consistent style/format at scale and have hundreds+ quality examples — not for facts that change weekly.'
      ),
    ],
  },
  'prod-cost-optimization': {
    intro: [roadmapIntro('ai-engineer', 'Production', 'caching, smaller models, batch API')],
    outro: [
      practice(
        'Cost levers',
        'List three ways to cut LLM cost without removing a feature entirely.',
        `# 1.
# 2.
# 3.
`,
        `# 1. Cache embeddings and repeated prompts
# 2. Route easy queries to a mini model
# 3. Shorter prompts, smaller max_tokens, summarize long history`,
      ),
    ],
  },
  'prod-guardrails': {
    intro: [roadmapIntro('ai-red-teaming', 'Production', 'PII redaction, jailbreak tests, output filters')],
    outro: [
      clarify(
        'Defense in depth',
        'Input filters + system policy + output validation + human review for high-risk actions. No single prompt instruction is sufficient for security.'
      ),
    ],
  },
}
