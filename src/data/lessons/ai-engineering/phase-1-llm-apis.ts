import type { Lesson } from '@/types/lesson'

export const llmApiLessons: Lesson[] = [
  // ─────────────────────────────────────────────────────────────
  // LESSON 7: How LLMs Work
  // ─────────────────────────────────────────────────────────────
  {
    id: 'llm-how-it-works',
    moduleId: 'ai-engineering',
    phaseId: 'ai-llm-apis',
    phaseNumber: 1,
    order: 7,
    title: 'How LLMs Work: The Mental Model',
    description: 'Tokens, context windows, temperature, and the message format — the mental model every AI engineer needs before writing a single API call.',
    duration: '20 min',
    difficulty: 'beginner',
    objectives: [
      'Understand tokenization and why it matters for cost and limits',
      'Explain context windows and how they affect LLM behavior',
      'Configure temperature, top_p, and max_tokens appropriately',
      'Structure system/user/assistant messages correctly',
    ],
    content: [
      {
        type: 'text',
        markdown: `## What an LLM Actually Does

A Large Language Model (LLM) is a neural network trained to predict the next token given a sequence of tokens. That is the entire mechanism — predict the next piece of text, repeat.

What makes modern LLMs remarkable is the scale of training (hundreds of billions of parameters, trillions of tokens of text) and the Transformer architecture that allows them to attend to context efficiently.

As an AI engineer, you do not need to understand the math deeply. You do need to understand the **operational model**: tokens, context, and parameters.`,
      },
      {
        type: 'text',
        markdown: `## Tokens: The Unit of LLM Economics

LLMs do not see words — they see tokens. A token is roughly 3–4 characters or about ¾ of a word in English. You are billed per token and limited by token counts.`,
      },
      {
        type: 'code',
        language: 'python',
        filename: 'tokenization.py',
        code: `# Install: pip install tiktoken
import tiktoken

# Get the tokenizer for a model
enc = tiktoken.encoding_for_model("gpt-4o")

text = "Hello, I want to build a RAG pipeline."
tokens = enc.encode(text)
print(f"Text:    {text}")
print(f"Tokens:  {tokens}")
print(f"Count:   {len(tokens)}")
# Text:    Hello, I want to build a RAG pipeline.
# Tokens:  [9906, 11, 358, 1390, 311, 1977, 264, 39155, 15252, 13]
# Count:   10

# Practical: estimate cost before making API calls
def estimate_cost(text: str, model: str = "gpt-4o") -> dict:
    enc = tiktoken.encoding_for_model(model)
    token_count = len(enc.encode(text))

    # Prices as of 2025 (check current pricing on each provider's site)
    prices_per_million = {
        "gpt-4o": {"input": 2.50, "output": 10.00},
        "gpt-4o-mini": {"input": 0.15, "output": 0.60},
        "claude-3-5-sonnet-20241022": {"input": 3.00, "output": 15.00},
    }
    price = prices_per_million.get(model, {"input": 3.0, "output": 15.0})

    return {
        "token_count": token_count,
        "estimated_input_cost_usd": (token_count / 1_000_000) * price["input"],
    }

print(estimate_cost("Write a 500-word essay about Python." * 100))
# {'token_count': ~1000, 'estimated_input_cost_usd': ~0.0025}`,
        explanation: 'Always estimate tokens before building a production pipeline. Processing 10,000 documents at 1,000 tokens each = 10M tokens. With GPT-4o that is $25 per run — something to know in advance.',
      },
      {
        type: 'text',
        markdown: `## Context Windows

The context window is how much text the model can "see" at once — both your input (prompt) and the model's output. Everything outside the window is invisible to the model.

| Model | Context Window |
|-------|---------------|
| GPT-4o | 128,000 tokens (~95,000 words) |
| Claude 3.5 Sonnet | 200,000 tokens (~150,000 words) |
| Gemini 1.5 Pro | 1,000,000 tokens (~750,000 words) |

This is why RAG exists: documents are too long to fit in context, so you retrieve only the relevant chunks.`,
      },
      {
        type: 'text',
        markdown: `## The Message Format

Modern LLMs use a **chat format** with three roles. Understanding this is critical — getting the roles wrong is a very common bug.`,
      },
      {
        type: 'code',
        language: 'python',
        filename: 'messages.py',
        code: `# The three roles:
# - system:    Instructions for the model. Set the persona, rules, output format.
# - user:      The human's input (your application's prompt or the user's query).
# - assistant: The model's previous responses (for multi-turn conversations).

messages = [
    {
        "role": "system",
        "content": """You are a senior Python engineer reviewing code.
When you find issues, explain them clearly and provide corrected code.
Focus on: correctness, performance, and security.""",
    },
    {
        "role": "user",
        "content": "Review this function: def get_user(id): return db.query(f'SELECT * FROM users WHERE id={id}')",
    },
]

# Multi-turn conversation — append assistant + user messages
messages.append({
    "role": "assistant",
    "content": "I found a critical SQL injection vulnerability...",
})
messages.append({
    "role": "user",
    "content": "Can you show me the fixed version?",
})


# Key parameters explained:
params = {
    "model": "gpt-4o",
    "messages": messages,

    # temperature: 0.0 = deterministic/focused, 1.0 = creative/random
    # Use 0.0 for: data extraction, classification, code generation
    # Use 0.7-1.0 for: creative writing, brainstorming, persona
    "temperature": 0.0,

    # max_tokens: limit output length (prevents runaway responses and costs)
    "max_tokens": 1024,

    # top_p: nucleus sampling — usually leave at 1.0 if setting temperature
    "top_p": 1.0,

    # stop: sequences where the model should stop generating
    "stop": ["\\n\\nHuman:", "---END---"],
}`,
      },
      {
        type: 'callout',
        tone: 'important',
        title: 'System prompt placement: OpenAI vs Anthropic',
        content: 'In OpenAI\'s API, the system prompt is the first message with role "system". In Anthropic\'s API, the system prompt is a separate top-level "system" parameter — NOT inside the messages array. Getting this wrong is one of the most common mistakes when switching between providers.',
      },
      {
        type: 'callout',
        tone: 'tip',
        title: 'Temperature quick guide',
        content: 'temperature=0.0: SQL queries, data extraction, structured output, classifications. temperature=0.3–0.7: Q&A, summaries, code explanations. temperature=0.8–1.0: creative writing, persona roleplay, brainstorming. When in doubt, start at 0.0 and increase only if responses feel too rigid.',
      },
      {
        type: 'exercise',
        title: 'Token Budget Planner',
        description:
          'Write a script that estimates total input token cost for 3 scenarios: 100, 1,000, and 10,000 requests/day. Each request has system prompt (180 tokens), user input (240 tokens), and retrieved context (900 tokens). Print daily and monthly cost estimates for `gpt-4o` and `gpt-4o-mini`.',
        language: 'python',
        starterCode: `# TODO:
# 1) define token counts per request
# 2) compute total tokens per day for each traffic scenario
# 3) compute cost with two model price tables
# 4) print a readable report`,
        solution: `PRICE_PER_M_INPUT = {
    "gpt-4o": 2.50,
    "gpt-4o-mini": 0.15,
}

TOKENS_PER_REQUEST = 180 + 240 + 900
SCENARIOS = [100, 1000, 10000]

for model, price in PRICE_PER_M_INPUT.items():
    print(f"\\nModel: \${model}")
    for requests_per_day in SCENARIOS:
        daily_tokens = TOKENS_PER_REQUEST * requests_per_day
        daily_cost = (daily_tokens / 1_000_000) * price
        monthly_cost = daily_cost * 30
        print(f"\${requests_per_day:>6}/day -> $\${daily_cost:.3f}/day, $\${monthly_cost:.2f}/month")`,
        hints: [
          'Input cost = (tokens / 1_000_000) * price_per_million',
          'Keep output tokens separate in real production reports',
          'Use constants for clarity and maintainability',
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // LESSON 8: OpenAI API
  // ─────────────────────────────────────────────────────────────
  {
    id: 'llm-openai-api',
    moduleId: 'ai-engineering',
    phaseId: 'ai-llm-apis',
    phaseNumber: 1,
    order: 8,
    title: 'OpenAI API: First Real LLM Calls',
    description: 'Set up the OpenAI SDK, make chat completions, handle errors, count tokens, and build a multi-turn conversation — with production-ready patterns from the start.',
    duration: '30 min',
    difficulty: 'beginner',
    objectives: [
      'Install and configure the OpenAI Python SDK',
      'Make synchronous and async chat completion calls',
      'Handle rate limits, token limits, and network errors',
      'Build a simple multi-turn conversation class',
    ],
    content: [
      {
        type: 'text',
        markdown: `## Setup

You will need an OpenAI account and API key. Get it from [platform.openai.com](https://platform.openai.com/api-keys). Store it in your \`.env\` file, never in code.

\`\`\`bash
pip install openai python-dotenv
\`\`\``,
      },
      {
        type: 'code',
        language: 'python',
        filename: 'openai_basics.py',
        code: `import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

# Initialize the client — reads OPENAI_API_KEY from environment automatically
client = OpenAI()
# Or explicitly: client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


# ── Your first completion ─────────────────────────────────────
response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
        {"role": "user", "content": "What is a transformer model in one sentence?"}
    ],
    max_tokens=100,
)

# Accessing the response
content = response.choices[0].message.content
print(content)

# Metadata you need in production
print(f"Model:            {response.model}")
print(f"Prompt tokens:    {response.usage.prompt_tokens}")
print(f"Completion tokens:{response.usage.completion_tokens}")
print(f"Total tokens:     {response.usage.total_tokens}")
print(f"Finish reason:    {response.choices[0].finish_reason}")
# finish_reason: "stop" = completed, "length" = hit max_tokens, "content_filter" = blocked`,
        explanation: 'Always log token usage in production. It is your cost tracking and a signal for debugging — if finish_reason is "length", your max_tokens is too low.',
      },
      {
        type: 'code',
        language: 'python',
        filename: 'openai_system_prompt.py',
        code: `from openai import OpenAI

client = OpenAI()


def ask_code_reviewer(code: str) -> str:
    """Ask GPT-4o to review Python code."""
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {
                "role": "system",
                "content": """You are a senior Python engineer doing a code review.
Format your response as:
## Issues Found
[List each issue with severity: CRITICAL/WARNING/INFO]

## Improved Code
[Show the corrected version]

## Explanation
[Brief explanation of the key changes]""",
            },
            {
                "role": "user",
                "content": f"Review this code:\\n\\n\`\`\`python\\n{code}\\n\`\`\`",
            },
        ],
        temperature=0.0,  # deterministic for code review
        max_tokens=1500,
    )
    return response.choices[0].message.content


# Usage
code_to_review = """
def get_user_data(user_id):
    query = f"SELECT * FROM users WHERE id = {user_id}"
    return db.execute(query)
"""
print(ask_code_reviewer(code_to_review))`,
      },
      {
        type: 'text',
        markdown: `## Multi-Turn Conversations

Every chatbot and AI assistant maintains conversation history. Here is the canonical pattern.`,
      },
      {
        type: 'code',
        language: 'python',
        filename: 'conversation.py',
        code: `from openai import OpenAI
from dataclasses import dataclass, field


@dataclass
class Conversation:
    """Manages a multi-turn conversation with an LLM."""
    system_prompt: str
    model: str = "gpt-4o-mini"
    max_tokens: int = 1024
    temperature: float = 0.7
    history: list[dict] = field(default_factory=list)
    _client: OpenAI = field(default_factory=OpenAI, init=False, repr=False)

    def chat(self, user_message: str) -> str:
        """Send a message and get a response."""
        self.history.append({"role": "user", "content": user_message})

        response = self._client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": self.system_prompt},
                *self.history,
            ],
            max_tokens=self.max_tokens,
            temperature=self.temperature,
        )

        assistant_message = response.choices[0].message.content
        self.history.append({"role": "assistant", "content": assistant_message})
        return assistant_message

    def clear(self) -> None:
        """Reset the conversation history."""
        self.history = []

    @property
    def token_estimate(self) -> int:
        """Rough token estimate for the full conversation."""
        total_chars = sum(len(m["content"]) for m in self.history)
        return total_chars // 4  # ~4 chars per token


# Usage
conv = Conversation(
    system_prompt="You are a Python tutor. Give short, practical answers with code examples.",
    model="gpt-4o-mini",
)

print(conv.chat("What is a decorator in Python?"))
print(conv.chat("Can you show me a real-world example?"))
print(conv.chat("How is this different from a mixin?"))
print(f"Estimated tokens so far: {conv.token_estimate}")`,
      },
      {
        type: 'text',
        markdown: `## Error Handling in Production

The OpenAI SDK provides specific exception types. Handle them properly.`,
      },
      {
        type: 'code',
        language: 'python',
        filename: 'openai_errors.py',
        code: `from openai import OpenAI, RateLimitError, APIStatusError, APIConnectionError
import time


client = OpenAI()


def safe_complete(prompt: str, retries: int = 3) -> str | None:
    """Make a completion with proper error handling."""
    for attempt in range(retries):
        try:
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=512,
                timeout=30.0,
            )
            return response.choices[0].message.content

        except RateLimitError as e:
            wait_time = 60 if attempt == 0 else 120
            print(f"Rate limited. Waiting {wait_time}s... (attempt {attempt + 1}/{retries})")
            time.sleep(wait_time)

        except APIStatusError as e:
            if e.status_code in (400, 401, 403):
                raise  # Don't retry client errors
            print(f"API error {e.status_code}. Attempt {attempt + 1}/{retries}")
            time.sleep(2 ** attempt)

        except APIConnectionError:
            print(f"Connection failed. Attempt {attempt + 1}/{retries}")
            time.sleep(2 ** attempt)

    return None  # All retries exhausted


# In production, use tenacity library for retry logic:
# pip install tenacity
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type

@retry(
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=1, min=4, max=60),
    retry=retry_if_exception_type(RateLimitError),
)
def resilient_complete(prompt: str) -> str:
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
    )
    return response.choices[0].message.content`,
      },
      {
        type: 'callout',
        tone: 'production',
        title: 'OpenAI SDK already handles retries',
        content: 'The OpenAI Python SDK (v1.0+) has built-in retry logic with exponential backoff for rate limits and server errors. Pass `max_retries=3` to the OpenAI() constructor. The manual retry code above is for understanding — in practice, the SDK handles most cases automatically.',
      },
      {
        type: 'exercise',
        title: 'Production Chat Wrapper',
        description:
          'Build a `chat_once()` function that accepts `model`, `system_prompt`, `user_prompt`, and returns both `content` and usage metadata. Add structured error handling for rate limit, auth failure, and timeout, and include a retry counter in the returned object.',
        language: 'python',
        starterCode: `# TODO:
# def chat_once(model: str, system_prompt: str, user_prompt: str) -> dict:
#   - call OpenAI chat completion
#   - return {"content": ..., "usage": ..., "retries": ...}
#   - catch common SDK errors`,
        solution: `from openai import OpenAI, RateLimitError, APIConnectionError, APIStatusError

client = OpenAI(max_retries=2)

def chat_once(model: str, system_prompt: str, user_prompt: str) -> dict:
    retries = 0
    try:
        response = client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            timeout=30,
        )
        return {
            "content": response.choices[0].message.content,
            "usage": response.usage.model_dump() if response.usage else {},
            "retries": retries,
        }
    except RateLimitError as e:
        return {"error": "rate_limited", "detail": str(e), "retries": retries + 1}
    except APIConnectionError as e:
        return {"error": "network_error", "detail": str(e), "retries": retries}
    except APIStatusError as e:
        return {"error": f"api_status_{e.status_code}", "detail": str(e), "retries": retries}`,
        hints: [
          'Return machine-friendly keys for observability',
          'Include usage to power cost dashboards',
          'Do not swallow errors silently',
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // LESSON 9: Anthropic Claude API
  // ─────────────────────────────────────────────────────────────
  {
    id: 'llm-claude-api',
    moduleId: 'ai-engineering',
    phaseId: 'ai-llm-apis',
    phaseNumber: 1,
    order: 9,
    title: 'Anthropic Claude API',
    description: 'The Claude SDK, its key differences from OpenAI, model tiers, and when to choose Claude over GPT — with production-tested patterns.',
    duration: '20 min',
    difficulty: 'beginner',
    objectives: [
      'Use the Anthropic Python SDK to make completions',
      'Understand the key API differences from OpenAI',
      'Choose the right Claude model (Haiku, Sonnet, Opus)',
      'Use Claude\'s extended thinking for complex reasoning',
    ],
    content: [
      {
        type: 'text',
        markdown: `## Setup

\`\`\`bash
pip install anthropic python-dotenv
\`\`\`

Store your API key in \`.env\` as \`ANTHROPIC_API_KEY\`. Get one at [console.anthropic.com](https://console.anthropic.com).`,
      },
      {
        type: 'code',
        language: 'python',
        filename: 'claude_basics.py',
        code: `import anthropic
from dotenv import load_dotenv

load_dotenv()

# Client initialization — reads ANTHROPIC_API_KEY from environment
client = anthropic.Anthropic()


# ── Key difference #1: system prompt is a top-level parameter ──
message = client.messages.create(
    model="claude-3-5-sonnet-20241022",
    max_tokens=1024,
    system="You are a helpful AI assistant specialized in Python.",  # NOT in messages array
    messages=[
        {"role": "user", "content": "What is the GIL and does it affect async code?"}
    ],
)

# ── Key difference #2: response structure ────────────────────
# OpenAI:   response.choices[0].message.content
# Anthropic: response.content[0].text
content = message.content[0].text
print(content)

# Response metadata
print(f"Model:         {message.model}")
print(f"Stop reason:   {message.stop_reason}")  # "end_turn", "max_tokens", "stop_sequence"
print(f"Input tokens:  {message.usage.input_tokens}")
print(f"Output tokens: {message.usage.output_tokens}")`,
        explanation: 'The two critical differences: (1) system prompt goes in the system= parameter, not in messages, and (2) content is accessed via response.content[0].text, not response.choices[0].message.content.',
      },
      {
        type: 'text',
        markdown: `## Claude Model Tiers

Claude models follow a Haiku/Sonnet/Opus naming convention. Pick the right tier for the task.

| Model | Best For | Speed | Cost |
|-------|----------|-------|------|
| claude-3-5-haiku-20241022 | High-volume, simple tasks (classification, extraction) | Fastest | Lowest |
| claude-3-5-sonnet-20241022 | General tasks, coding, analysis | Fast | Medium |
| claude-3-opus-20240229 | Complex reasoning, nuanced writing | Slower | Highest |
| claude-3-7-sonnet-20250219 | Extended thinking, hard problems | Variable | High |

**Rule of thumb:** Start with Sonnet. Downgrade to Haiku for batch jobs. Only use Opus/extended thinking when Sonnet gives wrong answers.`,
      },
      {
        type: 'code',
        language: 'python',
        filename: 'claude_patterns.py',
        code: `import anthropic

client = anthropic.Anthropic()


# ── Pattern 1: Document analysis with long context ────────────
def analyze_document(document: str, question: str) -> str:
    """Claude's large context window makes it excellent for long documents."""
    return client.messages.create(
        model="claude-3-5-sonnet-20241022",
        max_tokens=2048,
        system="""You are a document analyst. When asked questions about documents:
1. Answer directly based on the document content
2. Quote the relevant sections
3. If the answer is not in the document, say so explicitly""",
        messages=[
            {
                "role": "user",
                "content": f"Document:\\n\\n{document}\\n\\nQuestion: {question}",
            }
        ],
    ).content[0].text


# ── Pattern 2: Multi-turn with Claude ────────────────────────
def claude_conversation(messages: list[dict], system: str) -> str:
    """Claude uses the same messages format as OpenAI, but system is separate."""
    response = client.messages.create(
        model="claude-3-5-sonnet-20241022",
        max_tokens=1024,
        system=system,
        messages=messages,
    )
    return response.content[0].text


# ── Pattern 3: Extended thinking for hard problems ────────────
def solve_complex_problem(problem: str) -> dict:
    """Use Claude's extended thinking for complex reasoning tasks."""
    response = client.messages.create(
        model="claude-3-7-sonnet-20250219",
        max_tokens=16000,
        thinking={
            "type": "enabled",
            "budget_tokens": 10000,  # tokens allocated to internal reasoning
        },
        messages=[{"role": "user", "content": problem}],
    )

    # Response contains both thinking and the final answer
    thinking_text = ""
    answer_text = ""

    for block in response.content:
        if block.type == "thinking":
            thinking_text = block.thinking
        elif block.type == "text":
            answer_text = block.text

    return {"thinking": thinking_text, "answer": answer_text}


# ── Async version ──────────────────────────────────────────────
async def async_claude(prompt: str) -> str:
    async_client = anthropic.AsyncAnthropic()
    message = await async_client.messages.create(
        model="claude-3-5-haiku-20241022",
        max_tokens=256,
        messages=[{"role": "user", "content": prompt}],
    )
    return message.content[0].text`,
      },
      {
        type: 'callout',
        tone: 'tip',
        title: 'When to choose Claude vs OpenAI',
        content: 'Choose Claude when: (1) you have very long documents (Claude\'s 200K context window), (2) you need nuanced instruction following, (3) you want extended thinking for hard reasoning problems. Choose OpenAI when: (1) you need function calling with many tools (slightly more mature), (2) you need multimodal image analysis, (3) your team is already on the OpenAI ecosystem. In practice, benchmark both on your specific task.',
      },
      {
        type: 'exercise',
        title: 'Cross-Provider Benchmark Script',
        description:
          'Create a script that runs the same 5 prompts against one OpenAI model and one Claude model. Capture latency, token usage, and a simple quality rating (1-5 by manual review). Print a final recommendation based on your data.',
        language: 'python',
        starterCode: `# TODO:
# 1) define benchmark prompts list
# 2) call OpenAI and Claude for each prompt
# 3) measure latency with time.perf_counter()
# 4) collect usage + response text
# 5) print comparison summary`,
        solution: `# Expected output shape:
# prompt_1 -> openai: 1.2s, claude: 1.5s
# prompt_2 -> openai: 0.9s, claude: 1.1s
# ...
# Avg latency: openai=1.06s, claude=1.32s
# Avg manual quality: openai=4.0, claude=4.4
# Recommendation: Claude for long-doc analysis, OpenAI for tool-heavy flows`,
        hints: [
          'Keep prompt set representative of your real product',
          'Use temperature=0 for fair deterministic comparison',
          'Benchmark quality and cost, not just speed',
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // LESSON 10: Prompt Engineering Fundamentals
  // ─────────────────────────────────────────────────────────────
  {
    id: 'llm-prompt-fundamentals',
    moduleId: 'ai-engineering',
    phaseId: 'ai-llm-apis',
    phaseNumber: 1,
    order: 10,
    title: 'Prompt Engineering Fundamentals',
    description: 'Zero-shot, few-shot, role prompting, and output format control — the techniques that make the difference between unreliable prototypes and production-grade LLM features.',
    duration: '30 min',
    difficulty: 'intermediate',
    objectives: [
      'Write effective zero-shot and few-shot prompts',
      'Use role and persona prompting for specialized outputs',
      'Control output format with explicit structure instructions',
      'Understand why prompt engineering is a system design concern',
    ],
    content: [
      {
        type: 'text',
        markdown: `## The Mental Model: LLMs as Pattern Completers

An LLM does not "understand" your prompt — it completes a pattern. Every word in your prompt is evidence about what pattern to follow. This framing explains why every prompting technique works.

**Zero-shot:** Give the task with no examples. Works for common tasks the model has seen during training.

**Few-shot:** Give 2–5 examples before the task. Works when you need a specific format, style, or behavior.

**Role prompting:** Tell the model who it is. Shifts which "patterns" it draws from.

**Chain of thought:** Ask it to think before answering. Forces step-by-step reasoning.`,
      },
      {
        type: 'code',
        language: 'python',
        filename: 'prompt_techniques.py',
        code: `from openai import OpenAI

client = OpenAI()


# ── Zero-Shot: Just describe the task ──────────────────────────
zero_shot = """Classify the sentiment of the following customer review as 
POSITIVE, NEGATIVE, or NEUTRAL. Respond with only the label.

Review: "The product works but the packaging was damaged when it arrived."
"""
# Result: NEUTRAL  ✓ (works for common tasks)


# ── Few-Shot: Add 2-3 examples ────────────────────────────────
few_shot = """Classify customer reviews using these categories:
BILLING_ISSUE, TECHNICAL_SUPPORT, FEATURE_REQUEST, GENERAL_PRAISE, CHURN_RISK

Examples:
Review: "I was charged twice this month"
Category: BILLING_ISSUE

Review: "The app crashes every time I open the settings"  
Category: TECHNICAL_SUPPORT

Review: "I wish you had a dark mode"
Category: FEATURE_REQUEST

Review: "I'm canceling if this keeps happening"
Category: CHURN_RISK

Now classify:
Review: "I've been locked out of my account for 3 days"
Category:"""
# Result: TECHNICAL_SUPPORT  ✓


# ── Role Prompting ─────────────────────────────────────────────
ROLES = {
    "security_reviewer": """You are a senior security engineer with 10 years of experience
in application security. You focus on: SQL injection, XSS, auth bypass, SSRF, and OWASP Top 10.
When reviewing code, you are thorough but pragmatic — you distinguish critical issues from
theoretical risks. You always provide working, secure code as a fix.""",

    "explain_to_child": """Explain concepts as if talking to a curious 10-year-old.
Use simple words, relatable analogies, and avoid jargon. Make it fun and memorable.""",

    "senior_engineer_review": """You are a principal engineer doing a code review.
Focus on: correctness, performance, maintainability, and edge cases.
Be direct and specific. For each issue, explain why it matters and how to fix it.""",
}


def with_role(role_key: str, user_message: str) -> str:
    return client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": ROLES[role_key]},
            {"role": "user", "content": user_message},
        ],
        temperature=0.0,
    ).choices[0].message.content`,
      },
      {
        type: 'text',
        markdown: `## Controlling Output Format

This is the most important skill in prompt engineering for production systems. Unstructured output is hard to parse reliably. Always specify the exact format you need.`,
      },
      {
        type: 'code',
        language: 'python',
        filename: 'output_format.py',
        code: `from openai import OpenAI
import json

client = OpenAI()


# ── Method 1: Describe the format in the prompt ───────────────
format_prompt = """Extract the key information from this job posting and respond 
with a JSON object in exactly this format:
{
  "title": "job title here",
  "company": "company name",
  "skills": ["skill1", "skill2"],
  "is_remote": true or false,
  "seniority": "junior" | "mid" | "senior" | "staff"
}

Respond with ONLY the JSON object, no explanation, no markdown code blocks.

Job posting:
Senior Machine Learning Engineer at Anthropic. Remote-friendly. 
Requirements: Python, PyTorch, experience with transformers and RLHF.
5+ years experience required."""

response = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": format_prompt}],
    temperature=0.0,
)
data = json.loads(response.choices[0].message.content)
print(data["title"])  # "Senior Machine Learning Engineer"


# ── Method 2: response_format (OpenAI JSON mode) ──────────────
response = client.chat.completions.create(
    model="gpt-4o",
    messages=[
        {
            "role": "system",
            "content": "Extract job info and respond in JSON.",
        },
        {"role": "user", "content": "Senior ML Engineer at Anthropic..."},
    ],
    response_format={"type": "json_object"},  # Guarantees valid JSON output
    temperature=0.0,
)
data = json.loads(response.choices[0].message.content)


# ── Method 3: Structured Outputs (most reliable) ──────────────
# Covered in depth in the next lesson — uses Pydantic schemas
# response_format={"type": "json_schema", "json_schema": {...}}


# ── Anti-patterns to avoid ─────────────────────────────────────
bad_prompt = "Tell me about this document and maybe include some keywords"
# Problem: "maybe", "some" — vague instructions → inconsistent output

better_prompt = """Analyze this document and return exactly:
1. A 2-sentence summary
2. Exactly 5 keywords (single words or short phrases)
3. The primary topic category from: [technical, business, legal, medical, other]

Format:
SUMMARY: [2 sentences]
KEYWORDS: keyword1, keyword2, keyword3, keyword4, keyword5
CATEGORY: [category]"""`,
        explanation: 'Be explicit and unambiguous. Every vague word in your prompt ("some", "maybe", "appropriate") gives the model latitude to vary its output — which breaks downstream parsing.',
      },
      {
        type: 'callout',
        tone: 'production',
        title: 'Prompt versioning in production',
        content: 'Prompts are code. Version control them. When you change a prompt, run regression tests against a golden dataset of expected outputs. A prompt change that improves 80% of outputs while breaking 20% might still be a net negative. The Instructor and LangSmith tools (covered later) help with prompt evaluation.',
      },
      {
        type: 'exercise',
        title: 'Prompt Refactor Challenge',
        description:
          'Take a vague prompt and refactor it into a production prompt with explicit role, task constraints, output format, and failure behavior. Then test it on 10 inputs and compare consistency.',
        language: 'python',
        starterCode: `bad_prompt = "Analyze this support ticket and help the team."

# TODO:
# 1) rewrite into a strict prompt
# 2) enforce fixed output format
# 3) test on 10 varied tickets
# 4) compare parse success rate`,
        solution: `good_prompt = """You are a support triage assistant.
Classify ticket into one of: BILLING, TECHNICAL, ACCOUNT, OTHER.
Return exactly:
CATEGORY: <label>
PRIORITY: <low|medium|high>
REASON: <one sentence>
If uncertain, set CATEGORY=OTHER and explain uncertainty briefly."""

# Run across dataset and compute valid-format rate.`,
        hints: [
          'Remove vague words like "maybe" and "helpful"',
          'Define allowed labels explicitly',
          'Add deterministic formatting instructions',
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // LESSON 11: Chain of Thought
  // ─────────────────────────────────────────────────────────────
  {
    id: 'llm-chain-of-thought',
    moduleId: 'ai-engineering',
    phaseId: 'ai-llm-apis',
    phaseNumber: 1,
    order: 11,
    title: 'Chain of Thought Prompting',
    description: 'Make LLMs reason step by step, dramatically improving accuracy on complex tasks — from math and logic to multi-criteria evaluation and agent planning.',
    duration: '20 min',
    difficulty: 'intermediate',
    objectives: [
      'Apply standard and zero-shot CoT techniques',
      'Structure prompts for multi-step reasoning',
      'Use CoT for evaluation tasks (LLM-as-Judge)',
      'Know when CoT helps and when it hurts',
    ],
    content: [
      {
        type: 'text',
        markdown: `## Why Chain of Thought Works

When you ask an LLM to answer immediately, it generates the answer token by token based on pattern matching. When you ask it to think step by step, each reasoning step becomes part of the context for the next step — effectively giving the model a scratchpad.

The result: dramatically better accuracy on tasks requiring multi-step reasoning, math, logic, and evaluation.`,
      },
      {
        type: 'code',
        language: 'python',
        filename: 'cot_basics.py',
        code: `from openai import OpenAI

client = OpenAI()


# ── Comparison: direct vs CoT ─────────────────────────────────
question = """A RAG pipeline retrieves 5 documents, each with an average of 800 tokens.
The query is 50 tokens. The system prompt is 200 tokens. The answer is typically 150 tokens.
With GPT-4o at $2.50/million input tokens and $10/million output tokens,
what is the cost per query and cost for 10,000 daily queries?"""

# Direct answer (often wrong for math)
direct = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": question}],
    temperature=0.0,
).choices[0].message.content

# Chain of Thought
cot_prompt = f"""{question}

Think through this step by step, showing your calculations."""

cot_answer = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": cot_prompt}],
    temperature=0.0,
).choices[0].message.content
# More accurate because each calculation step is explicit


# ── Zero-shot CoT (just add "think step by step") ─────────────
def ask_with_cot(question: str, model: str = "gpt-4o") -> str:
    return client.chat.completions.create(
        model=model,
        messages=[
            {
                "role": "user",
                "content": f"{question}\\n\\nThink step by step.",
            }
        ],
        temperature=0.0,
    ).choices[0].message.content


# ── Structured CoT template ────────────────────────────────────
STRUCTURED_COT = """Analyze whether this code change could cause a production outage.

Code diff:
{diff}

Think through this systematically:
1. What does this code change do?
2. What are the dependencies affected?
3. What happens under high load?
4. What are the failure modes?
5. Final verdict: HIGH RISK / MEDIUM RISK / LOW RISK

Format your final verdict as: VERDICT: [RISK LEVEL] - [one line reason]"""

def assess_code_risk(diff: str) -> str:
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "user", "content": STRUCTURED_COT.format(diff=diff)}
        ],
        temperature=0.0,
    )
    return response.choices[0].message.content`,
      },
      {
        type: 'text',
        markdown: `## CoT for LLM-as-Judge Evaluation

One of the most powerful uses of CoT is evaluating other LLM outputs. This is the foundation of automated AI evaluation pipelines.`,
      },
      {
        type: 'code',
        language: 'python',
        filename: 'llm_judge.py',
        code: `from openai import OpenAI
from pydantic import BaseModel, Field

client = OpenAI()


class EvaluationResult(BaseModel):
    reasoning: str
    accuracy_score: int = Field(ge=1, le=5)
    completeness_score: int = Field(ge=1, le=5)
    verdict: str  # "PASS" or "FAIL"


JUDGE_PROMPT = """You are evaluating an AI assistant's response to a user question.

Question: {question}
Reference Answer (ground truth): {reference}
AI Response to Evaluate: {response}

Evaluate the AI response step by step:
1. Is the core information accurate compared to the reference? (note any errors)
2. Does it address all parts of the question?
3. Is it an appropriate length?
4. Final scores (1-5) and verdict (PASS if avg >= 3.5, FAIL otherwise)

Respond with a JSON object:
{{
  "reasoning": "your step-by-step analysis",
  "accuracy_score": 1-5,
  "completeness_score": 1-5,
  "verdict": "PASS" or "FAIL"
}}"""


def evaluate_response(
    question: str,
    reference: str,
    ai_response: str,
) -> EvaluationResult:
    raw = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {
                "role": "user",
                "content": JUDGE_PROMPT.format(
                    question=question,
                    reference=reference,
                    response=ai_response,
                ),
            }
        ],
        response_format={"type": "json_object"},
        temperature=0.0,
    ).choices[0].message.content

    return EvaluationResult.model_validate_json(raw)


# Usage in an evaluation pipeline
result = evaluate_response(
    question="What is RAG?",
    reference="RAG (Retrieval-Augmented Generation) is a technique that enhances LLMs by retrieving relevant documents and including them in the prompt context.",
    ai_response="RAG helps AI models look up information.",
)
print(result.verdict)          # FAIL
print(result.accuracy_score)   # 3
print(result.reasoning)        # "The response is too brief..."`,
      },
      {
        type: 'callout',
        tone: 'warning',
        title: 'When NOT to use CoT',
        content: 'CoT uses more tokens = higher cost and latency. Avoid it for: simple classifications, data extraction with clear schemas, high-volume batch jobs, and latency-sensitive applications. Use it for: complex reasoning, math, code analysis, multi-criteria evaluation, and any task where you have seen the model make reasoning errors without it.',
      },
      {
        type: 'exercise',
        title: 'CoT A/B Evaluation',
        description:
          'Build an A/B harness comparing direct prompting vs CoT prompting on 20 reasoning tasks (math + logic + analysis). Record accuracy, latency, and token usage. Recommend when CoT should be enabled in production.',
        language: 'python',
        starterCode: `# TODO:
# 1) create task set (20 questions + expected answers)
# 2) run direct prompt and CoT prompt
# 3) score correctness
# 4) log latency + usage
# 5) produce recommendation`,
        solution: `# Example decision:
# direct: accuracy=65%, avg_latency=1.1s, avg_tokens=180
# cot:    accuracy=84%, avg_latency=1.9s, avg_tokens=420
#
# Recommendation:
# - Use CoT only for complex-reasoning routes
# - Keep direct prompting for simple high-volume tasks`,
        hints: [
          'Use temperature=0 for fair comparisons',
          'Keep grading rubric deterministic',
          'Report both quality and cost impact',
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // LESSON 12: Structured Output
  // ─────────────────────────────────────────────────────────────
  {
    id: 'llm-structured-output',
    moduleId: 'ai-engineering',
    phaseId: 'ai-llm-apis',
    phaseNumber: 1,
    order: 12,
    title: 'Structured Output with Pydantic',
    description: 'The technique that makes LLM integrations production-ready: schema-enforced outputs, automatic validation, and retry on failure using the Instructor library.',
    duration: '25 min',
    difficulty: 'intermediate',
    objectives: [
      'Use OpenAI Structured Outputs with JSON schema',
      'Integrate the Instructor library for automatic validation',
      'Handle structured output failures and retries',
      'Design Pydantic models for common AI extraction tasks',
    ],
    content: [
      {
        type: 'text',
        markdown: `## The Problem: LLMs Don't Always Follow Instructions

\`\`\`
You asked for JSON. The model returned:
"Sure! Here's the JSON you asked for: \`\`\`json {...} \`\`\`"
\`\`\`

Without enforced schemas, you get markdown code blocks, extra text, invalid JSON, missing fields, and wrong types. In a production pipeline running thousands of requests, this happens constantly.

The solution: **Structured Outputs** — where the model is constrained (at the API level) to produce valid JSON matching your schema. Zero ambiguity.`,
      },
      {
        type: 'code',
        language: 'python',
        filename: 'structured_outputs.py',
        code: `from openai import OpenAI
from pydantic import BaseModel, Field
from typing import Literal
import json

client = OpenAI()


# ── Method 1: OpenAI Structured Outputs (guaranteed valid JSON) ─
class ResumeInfo(BaseModel):
    full_name: str
    email: str
    years_experience: int = Field(ge=0)
    skills: list[str]
    seniority: Literal["junior", "mid", "senior", "staff", "principal"]
    summary: str = Field(max_length=200)


def extract_resume_info(resume_text: str) -> ResumeInfo:
    response = client.beta.chat.completions.parse(
        model="gpt-4o-2024-08-06",  # Structured outputs require this model+
        messages=[
            {"role": "system", "content": "Extract structured information from the resume."},
            {"role": "user", "content": resume_text},
        ],
        response_format=ResumeInfo,  # Pass the Pydantic class directly
    )
    # .parse() returns an already-validated Pydantic object — no json.loads() needed
    return response.choices[0].message.parsed


# Usage
resume = """
John Smith | john@example.com
Senior Software Engineer with 7 years experience
Skills: Python, FastAPI, PostgreSQL, Docker, Kubernetes, LLMs
Currently Staff Engineer at Anthropic, previously at Google.
"""

info = extract_resume_info(resume)
print(info.full_name)      # "John Smith"
print(info.seniority)      # "staff"
print(info.skills[:3])     # ["Python", "FastAPI", "PostgreSQL"]`,
        explanation: 'The `.parse()` method is OpenAI\'s structured outputs API. It guarantees the output matches your Pydantic model — if the model would have violated the schema, OpenAI\'s API layer prevents it from happening.',
      },
      {
        type: 'text',
        markdown: `## Instructor: Structured Outputs for Any LLM

The [Instructor](https://python.useinstructor.com/) library extends structured outputs to Anthropic, Gemini, Cohere, and any OpenAI-compatible API. It also handles automatic retries on validation failure.`,
      },
      {
        type: 'code',
        language: 'python',
        filename: 'instructor_demo.py',
        code: `# pip install instructor anthropic openai
import instructor
import anthropic
from openai import OpenAI
from pydantic import BaseModel, Field, field_validator
from typing import Literal


# ── With Anthropic ─────────────────────────────────────────────
anthropic_client = instructor.from_anthropic(anthropic.Anthropic())

class CodeReview(BaseModel):
    issues: list[str] = Field(description="List of identified issues")
    severity: Literal["critical", "warning", "info", "clean"]
    fixed_code: str = Field(description="The corrected version of the code")
    explanation: str

    @field_validator("issues")
    @classmethod
    def issues_not_empty_if_not_clean(cls, v, info):
        if info.data.get("severity") != "clean" and not v:
            raise ValueError("Must list issues if severity is not 'clean'")
        return v


def review_code_with_claude(code: str) -> CodeReview:
    return anthropic_client.messages.create(
        model="claude-3-5-sonnet-20241022",
        max_tokens=1024,
        response_model=CodeReview,  # instructor's magic parameter
        messages=[
            {
                "role": "user",
                "content": f"Review this Python code for issues:\\n\\n\`\`\`python\\n{code}\\n\`\`\`",
            }
        ],
    )


# ── With OpenAI + Instructor (adds retry logic) ────────────────
openai_client = instructor.from_openai(OpenAI(), mode=instructor.Mode.JSON)

class SentimentBatch(BaseModel):
    results: list[dict]  # [{"text": "...", "sentiment": "positive", "score": 0.9}]
    total_analyzed: int

    @field_validator("total_analyzed")
    @classmethod
    def match_results_count(cls, v, info):
        if info.data.get("results") and v != len(info.data["results"]):
            raise ValueError("total_analyzed must match len(results)")
        return v


# instructor automatically retries if Pydantic validation fails
result = openai_client.chat.completions.create(
    model="gpt-4o",
    response_model=SentimentBatch,
    max_retries=3,  # retry up to 3 times on validation failure
    messages=[{"role": "user", "content": "Analyze: ['Great!', 'Terrible', 'Okay']"}],
)
print(result.total_analyzed)  # 3`,
      },
      {
        type: 'callout',
        tone: 'production',
        title: 'Use Instructor for any structured LLM output in production',
        content: 'Instructor is the industry standard for structured LLM output. It works with any provider, adds retry logic, gives you clear validation errors, and integrates with your existing Pydantic models. The only case to use raw json_object mode is when you cannot add a dependency.',
      },
      {
        type: 'exercise',
        title: 'Schema-First Extraction API',
        description:
          'Implement a `POST /extract-job` endpoint that receives unstructured job text and returns a validated Pydantic object. If validation fails, retry once with a stricter repair prompt, then return a structured error.',
        language: 'python',
        starterCode: `# TODO:
# 1) define JobPosting model
# 2) call LLM with structured output / Instructor
# 3) validate result
# 4) retry once if invalid
# 5) return JSON error envelope on failure`,
        solution: `# Expected response shape:
# success: {"ok": true, "data": {...validated fields...}}
# failure: {"ok": false, "error": "validation_failed", "details": [...]}
#
# Include:
# - request_id
# - model used
# - retry_count`,
        hints: [
          'Keep schema strict and explicit',
          'Validation errors should be logged and observable',
          'Do not return raw malformed model output to clients',
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // LESSON 13: Streaming
  // ─────────────────────────────────────────────────────────────
  {
    id: 'llm-streaming',
    moduleId: 'ai-engineering',
    phaseId: 'ai-llm-apis',
    phaseNumber: 1,
    order: 13,
    title: 'Streaming LLM Responses',
    description: 'Stream tokens as they generate for instant user feedback — implementing SSE in Python, handling partial responses, and building a streaming FastAPI endpoint.',
    duration: '25 min',
    difficulty: 'intermediate',
    objectives: [
      'Stream completions with OpenAI and Anthropic SDKs',
      'Process streamed tokens incrementally',
      'Build a streaming API endpoint with FastAPI',
      'Handle streaming errors and partial responses',
    ],
    content: [
      {
        type: 'text',
        markdown: `## Why Streaming Matters

Without streaming: user waits 5–10 seconds for a blank screen, then sees the full response appear at once. Bad UX.

With streaming: the first words appear in <500ms. Users see the response building in real time, the same way ChatGPT and Claude.ai work.

For long-form output (essays, code, analysis), streaming is not optional in production — it is the difference between a usable and an unusable product.`,
      },
      {
        type: 'code',
        language: 'python',
        filename: 'streaming_basics.py',
        code: `from openai import OpenAI
import anthropic

openai_client = OpenAI()
anthropic_client = anthropic.Anthropic()


# ── OpenAI Streaming ───────────────────────────────────────────
def stream_openai(prompt: str) -> str:
    """Stream and print tokens as they arrive. Returns complete response."""
    full_response = ""

    with openai_client.chat.completions.stream(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=512,
    ) as stream:
        for chunk in stream:
            delta = chunk.choices[0].delta.content
            if delta:
                print(delta, end="", flush=True)
                full_response += delta

    print()  # newline after stream
    return full_response


# ── Anthropic Streaming ────────────────────────────────────────
def stream_claude(prompt: str) -> str:
    """Stream Claude's response."""
    full_response = ""

    with anthropic_client.messages.stream(
        model="claude-3-5-haiku-20241022",
        max_tokens=512,
        messages=[{"role": "user", "content": prompt}],
    ) as stream:
        for text in stream.text_stream:
            print(text, end="", flush=True)
            full_response += text

    print()
    # Get usage stats after streaming completes
    final_message = stream.get_final_message()
    print(f"Tokens used: {final_message.usage.input_tokens} in, {final_message.usage.output_tokens} out")
    return full_response


# Usage
stream_openai("Explain async/await in Python in 3 paragraphs")`,
      },
      {
        type: 'text',
        markdown: `## Streaming API with FastAPI

This is the production pattern for serving streaming LLM responses to a frontend (your Next.js app, for example).`,
      },
      {
        type: 'code',
        language: 'python',
        filename: 'streaming_api.py',
        code: `# pip install fastapi uvicorn openai
from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from openai import AsyncOpenAI
from pydantic import BaseModel
import asyncio
import json

app = FastAPI()

# Allow your frontend to call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["POST"],
    allow_headers=["*"],
)

client = AsyncOpenAI()


class ChatRequest(BaseModel):
    message: str
    history: list[dict] = []


async def generate_stream(messages: list[dict]):
    """Async generator that yields SSE-formatted data chunks."""
    try:
        async with client.chat.completions.stream(
            model="gpt-4o-mini",
            messages=messages,
            max_tokens=1024,
        ) as stream:
            async for chunk in stream:
                delta = chunk.choices[0].delta.content
                if delta:
                    # Format as Server-Sent Events
                    yield f"data: {json.dumps({'content': delta})}\\n\\n"

        # Signal completion
        yield f"data: {json.dumps({'done': True})}\\n\\n"

    except Exception as e:
        yield f"data: {json.dumps({'error': str(e)})}\\n\\n"


@app.post("/chat/stream")
async def chat_stream(request: ChatRequest):
    messages = [
        {"role": "system", "content": "You are a helpful assistant."},
        *request.history,
        {"role": "user", "content": request.message},
    ]

    return StreamingResponse(
        generate_stream(messages),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",  # disable nginx buffering
        },
    )


# Start with: uvicorn streaming_api:app --reload`,
        explanation: 'Server-Sent Events (SSE) is the standard for streaming LLM responses. The frontend reads this with the EventSource API or fetch() with a readable stream reader — which is exactly how the streaming in this learning platform works.',
      },
      {
        type: 'code',
        language: 'typescript',
        filename: 'streaming-client.ts',
        code: `// Reading the SSE stream in your Next.js/React frontend
async function streamChat(message: string, history: Message[]) {
  const response = await fetch('/api/chat/stream', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, history }),
  })

  if (!response.body) throw new Error('No response body')

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let fullContent = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    const chunk = decoder.decode(value)
    const lines = chunk.split('\\n\\n')

    for (const line of lines) {
      if (!line.startsWith('data: ')) continue
      const data = JSON.parse(line.slice(6))

      if (data.done) {
        console.log('Stream complete')
        break
      }
      if (data.error) {
        throw new Error(data.error)
      }
      if (data.content) {
        fullContent += data.content
        // Update your UI state here
        setStreamingContent(prev => prev + data.content)
      }
    }
  }

  return fullContent
}`,
        explanation: 'This is the frontend counterpart to the FastAPI streaming endpoint. The Next.js API routes in this platform use the same pattern under the hood.',
      },
      {
        type: 'exercise',
        title: 'Build a Streaming Chat UI',
        description:
          'Create a minimal chat UI that streams tokens from `/chat/stream`, shows partial output in real time, supports canceling an in-flight stream, and persists completed assistant messages in history.',
        language: 'typescript',
        starterCode: `// TODO:
// 1) create streamChat(message, history)
// 2) append token deltas to UI state
// 3) add AbortController to cancel stream
// 4) on completion, persist final assistant message`,
        solution: `// Key implementation points:
// - Use fetch with signal from AbortController
// - Keep ` + "`streamingContent`" + ` separate from committed messages
// - On done: push assistant message into history array
// - On cancel: stop reader and keep partial text optional`,
        hints: [
          'Separate transient stream state from committed chat history',
          'Handle partial chunks safely (line buffering)',
          'Provide clear UI state: streaming, done, canceled, error',
        ],
      },
    ],
  },
]
