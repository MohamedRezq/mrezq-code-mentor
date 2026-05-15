import type { Lesson } from '@/types/lesson'

export const agentLessons: Lesson[] = [
  {
    id: 'agents-intro',
    moduleId: 'ai-engineering',
    phaseId: 'ai-agents',
    phaseNumber: 3,
    order: 19,
    title: 'What are AI Agents?',
    description: 'The agent paradigm: LLMs that take actions, not just generate text. ReAct loop, tool use basics, and why agents fail in production.',
    duration: '25 min',
    difficulty: 'intermediate',
    objectives: [
      'Define what makes a system an "AI agent"',
      'Understand the observe-think-act (ReAct) loop',
      'Build a simple agent from scratch without frameworks',
      'Identify common failure modes in agent systems',
    ],
    content: [
      {
        type: 'text',
        markdown: `## What Makes Something an "Agent"?

A chatbot receives input and returns text. An **agent** receives input, decides what actions to take, executes those actions, observes the results, and decides what to do next — potentially in a loop until the goal is achieved.

**The core loop (ReAct: Reason + Act):**
1. **Observe** the current state (user request + previous results)
2. **Think** about what to do next
3. **Act** by calling a tool or returning the final answer
4. Repeat until done

**Examples of agents in production:**
- Code execution agents (read code → run tests → fix bugs → repeat)
- Research agents (search → read → synthesize → search more)
- Customer support agents (look up order → check policies → respond)`,
      },
      {
        type: 'code',
        language: 'python',
        filename: 'simple_agent.py',
        code: `from openai import OpenAI
import json
import math

client = OpenAI()

# ── Define tools (functions the agent can call) ───────────────
def calculator(expression: str) -> str:
    """Safely evaluate a math expression."""
    try:
        result = eval(expression, {"__builtins__": {}}, {"math": math})
        return str(result)
    except Exception as e:
        return f"Error: {e}"

def search_web(query: str) -> str:
    """Simulate a web search (in real code, call a search API)."""
    # Placeholder — in production: call Tavily, Bing, or Google Search API
    return f"[Simulated search result for: {query}]"

TOOLS = {
    "calculator": calculator,
    "search_web": search_web,
}

TOOLS_SCHEMA = [
    {
        "type": "function",
        "function": {
            "name": "calculator",
            "description": "Evaluate math expressions. Use for any numerical calculations.",
            "parameters": {
                "type": "object",
                "properties": {"expression": {"type": "string"}},
                "required": ["expression"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "search_web",
            "description": "Search the web for current information.",
            "parameters": {
                "type": "object",
                "properties": {"query": {"type": "string"}},
                "required": ["query"],
            },
        },
    },
]

# ── The ReAct loop ─────────────────────────────────────────────
def run_agent(user_message: str, max_steps: int = 10) -> str:
    messages = [
        {"role": "system", "content": "You are a helpful assistant. Use tools to answer questions that require calculation or current information."},
        {"role": "user", "content": user_message},
    ]

    for step in range(max_steps):
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=messages,
            tools=TOOLS_SCHEMA,
            tool_choice="auto",
        )

        choice = response.choices[0]
        messages.append(choice.message.model_dump())

        # If no tool call, we have the final answer
        if choice.finish_reason == "stop":
            return choice.message.content

        # Execute tool calls
        for tool_call in (choice.message.tool_calls or []):
            fn_name = tool_call.function.name
            fn_args = json.loads(tool_call.function.arguments)

            print(f"  → Calling {fn_name}({fn_args})")
            result = TOOLS[fn_name](**fn_args)
            print(f"  ← Result: {result}")

            messages.append({
                "role": "tool",
                "tool_call_id": tool_call.id,
                "content": result,
            })

    return "Max steps reached without a final answer."

# answer = run_agent("What is 15% of 847, and is that number prime?")`,
      },
      {
        type: 'callout',
        tone: 'warning',
        title: 'Why agents fail in production',
        content: '1. Infinite loops: agent keeps calling tools without making progress. 2. Hallucinated tool calls: agent invents function names that don\'t exist. 3. Context length: long tool outputs fill the context window. 4. Cost: each loop = API call = money. Always set max_steps and monitor loop counts. We cover robust agent design with LangGraph in the next lesson.',
      },
    ],
  },
  {
    id: 'agents-tool-calling',
    moduleId: 'ai-engineering',
    phaseId: 'ai-agents',
    phaseNumber: 3,
    order: 20,
    title: 'Tool Calling & Function Calling',
    description: 'Build reliable tool interfaces: structured tool definitions, parallel tool execution, error handling, and the patterns that prevent agents from going off the rails.',
    duration: '30 min',
    difficulty: 'intermediate',
    objectives: ['Define tools with JSON Schema', 'Handle parallel tool calls', 'Implement tool error recovery', 'Build real tools: web search, code execution, database queries'],
    content: [
      {
        type: 'text',
        markdown: `## Reliable Tool Calling Principles

Tool calling only works in production if your interfaces are strict:

- small, explicit tool set
- strict input schema (types + required fields)
- predictable output format
- timeout + retry + error envelope
- bounded loop steps

Treat tools like public APIs, not helper functions.`,
      },
      {
        type: 'code',
        language: 'python',
        filename: 'tool_contracts.py',
        code: `from pydantic import BaseModel, Field
from typing import Literal


class WeatherArgs(BaseModel):
    city: str = Field(min_length=1, description="City name")
    units: Literal["metric", "imperial"] = "metric"


class SearchArgs(BaseModel):
    query: str = Field(min_length=3)
    top_k: int = Field(default=3, ge=1, le=10)


class ToolResult(BaseModel):
    ok: bool
    data: dict | None = None
    error: str | None = None


def wrap_tool_success(data: dict) -> dict:
    return ToolResult(ok=True, data=data).model_dump()


def wrap_tool_error(message: str) -> dict:
    return ToolResult(ok=False, error=message).model_dump()`,
        explanation:
          'A standardized result envelope (`ok`, `data`, `error`) makes agent reasoning safer and easier to debug.',
      },
      {
        type: 'code',
        language: 'python',
        filename: 'parallel_tool_calls.py',
        code: `import asyncio
import json
from openai import OpenAI

client = OpenAI()


async def call_weather(city: str) -> dict:
    await asyncio.sleep(0.2)
    return {"city": city, "temperature_c": 24}


async def call_search(query: str) -> dict:
    await asyncio.sleep(0.2)
    return {"query": query, "results": ["doc-1", "doc-2"]}


TOOL_IMPL = {
    "get_weather": call_weather,
    "search_docs": call_search,
}


async def execute_tool_call(tool_call) -> dict:
    fn_name = tool_call.function.name
    args = json.loads(tool_call.function.arguments)
    fn = TOOL_IMPL[fn_name]
    result = await fn(**args)
    return {"tool_call_id": tool_call.id, "name": fn_name, "result": result}


async def execute_parallel(tool_calls: list) -> list[dict]:
    tasks = [execute_tool_call(tc) for tc in tool_calls]
    return await asyncio.gather(*tasks)`,
      },
      {
        type: 'callout',
        tone: 'warning',
        title: 'Tool-Safety Checklist',
        content:
          'Validate all args before execution, enforce per-tool timeouts, redact secrets from tool outputs, and never expose unrestricted shell/SQL tools to untrusted prompts.',
      },
      {
        type: 'exercise',
        title: 'Harden an Agent Tool Layer',
        description:
          'Build a tool-execution layer that supports: schema validation, timeout per tool, retries for transient failures, and structured error returns. Then integrate it into a ReAct loop with max_steps=6.',
        language: 'python',
        starterCode: `# TODO:
# - Define Pydantic models for each tool input
# - Add async timeout wrapper (e.g. 3s)
# - Retry transient errors up to 2 times
# - Return {"ok": false, "error": "..."} on failure
# - Stop agent after max_steps`,
        solution: `# Expected architecture:
# tool_registry = {name: {"schema": SchemaCls, "fn": callable, "timeout_s": 3}}
# execute_tool(name, args) -> validates -> retries -> envelope
# agent_loop() -> model response -> tool calls -> append tool outputs -> continue
#
# Minimum production checks:
# - unknown tool name -> safe error
# - invalid args -> validation error
# - timeout -> timeout error
# - retries exhausted -> failure error`,
        hints: [
          'Put validation in one central function',
          'Retries should apply only to transient failures',
          'Make tool errors visible to the model for self-correction',
        ],
      },
    ],
  },
  {
    id: 'agents-langgraph',
    moduleId: 'ai-engineering',
    phaseId: 'ai-agents',
    phaseNumber: 3,
    order: 21,
    title: 'LangGraph: Stateful Agents',
    description: 'Move beyond fragile chains to explicit state machines with LangGraph — conditional edges, loops, human-in-the-loop, and persistence that makes agents debuggable and reliable.',
    duration: '40 min',
    difficulty: 'advanced',
    objectives: ['Define agent state with TypedDict', 'Build a graph with nodes and edges', 'Implement conditional routing', 'Add persistence with checkpointing'],
    content: [
      {
        type: 'text',
        markdown: `## Why LangGraph?

Linear chains fail when workflows need loops, retries, checkpoints, or branch decisions.
LangGraph models agents as explicit state machines:

- **State**: typed shared data
- **Nodes**: deterministic steps
- **Edges**: routing rules
- **Checkpoints**: persistence and resumability

This gives you debuggability and control that ad-hoc loops cannot.`,
      },
      {
        type: 'code',
        language: 'python',
        filename: 'langgraph_research_agent.py',
        code: `from typing import TypedDict, Literal
from langgraph.graph import StateGraph, END


class AgentState(TypedDict):
    question: str
    plan: str
    evidence: list[str]
    draft: str
    approved: bool


def planner(state: AgentState) -> AgentState:
    state["plan"] = f"Search for evidence about: {state['question']}"
    return state


def researcher(state: AgentState) -> AgentState:
    # In real code, call web/doc search tools
    state["evidence"] = [
        "Source A: ...",
        "Source B: ...",
    ]
    return state


def writer(state: AgentState) -> AgentState:
    state["draft"] = f"Answer based on {len(state['evidence'])} sources."
    return state


def reviewer(state: AgentState) -> AgentState:
    state["approved"] = len(state["evidence"]) >= 2
    return state


def route_after_review(state: AgentState) -> Literal["researcher", "end"]:
    return "end" if state["approved"] else "researcher"


builder = StateGraph(AgentState)
builder.add_node("planner", planner)
builder.add_node("researcher", researcher)
builder.add_node("writer", writer)
builder.add_node("reviewer", reviewer)

builder.set_entry_point("planner")
builder.add_edge("planner", "researcher")
builder.add_edge("researcher", "writer")
builder.add_edge("writer", "reviewer")
builder.add_conditional_edges(
    "reviewer",
    route_after_review,
    {"researcher": "researcher", "end": END},
)

graph = builder.compile()
result = graph.invoke(
    {"question": "How does hybrid search improve RAG?", "plan": "", "evidence": [], "draft": "", "approved": False}
)
print(result["draft"])`,
        explanation:
          'The conditional edge allows quality-control loops without hidden control flow.',
      },
      {
        type: 'callout',
        tone: 'production',
        title: 'State Design Rules',
        content:
          'Keep state minimal, typed, and serializable. Avoid storing huge tool outputs; store references/summaries instead to reduce cost and checkpoint size.',
      },
      {
        type: 'exercise',
        title: 'Add Human-in-the-Loop Review',
        description:
          'Extend the graph with a `human_review` node that can approve/reject the draft. If rejected, route back to `researcher` with reviewer feedback in state.',
        language: 'python',
        starterCode: `# TODO:
# 1) Add ` + "`review_feedback`" + ` to AgentState
# 2) Add human_review node
# 3) Route:
#    approved -> END
#    rejected -> researcher
# 4) Preserve revision count to avoid infinite loops`,
        solution: `# Expected routing:
# reviewer -> human_review -> (approved ? END : researcher)
# Add:
# - revision_count in state
# - max_revision_guard to stop at e.g. 3 cycles
# - explicit message when stopped without approval`,
        hints: [
          'Use conditional edges from `human_review`',
          'Track loop counters in state to prevent infinite cycles',
          'Store reviewer comments as short text, not full transcripts',
        ],
      },
    ],
  },
  {
    id: 'agents-multi-agent',
    moduleId: 'ai-engineering',
    phaseId: 'ai-agents',
    phaseNumber: 3,
    order: 22,
    title: 'Multi-Agent Systems',
    description: 'Orchestrate specialized sub-agents: supervisor patterns, crew-based workflows, inter-agent communication, and when multi-agent adds value vs. adds complexity.',
    duration: '35 min',
    difficulty: 'advanced',
    objectives: ['Design a supervisor-worker agent topology', 'Implement handoffs between agents', 'Handle partial failures in agent networks', 'Build a research + writing multi-agent pipeline'],
    content: [
      {
        type: 'text',
        markdown: `## Multi-Agent: Use Sparingly

Multi-agent systems are useful when:
- tasks are naturally specialized (research vs coding vs QA)
- subtasks can run in parallel
- quality gates require independent review

Do **not** use multi-agent for simple flows. Extra agents add latency, cost, and failure modes.`,
      },
      {
        type: 'code',
        language: 'python',
        filename: 'supervisor_pattern.py',
        code: `from dataclasses import dataclass
from typing import Literal


@dataclass
class Task:
    goal: str
    context: str


def research_agent(task: Task) -> str:
    return f"[research findings for: {task.goal}]"


def writer_agent(task: Task, research: str) -> str:
    return f"Draft answer using research: {research}"


def critic_agent(draft: str) -> tuple[bool, str]:
    if len(draft) < 40:
        return False, "Too short; add concrete examples."
    return True, "Looks good."


def supervisor(task: Task) -> str:
    research = research_agent(task)
    draft = writer_agent(task, research)
    approved, feedback = critic_agent(draft)
    if not approved:
        draft = writer_agent(task, f"{research}\\nRevision note: {feedback}")
    return draft


result = supervisor(Task(goal="Explain RAG evaluation metrics", context="For backend engineers"))
print(result)`,
      },
      {
        type: 'text',
        markdown: `## Common Topologies

- **Supervisor-Worker**: central planner delegates to specialists
- **Pipeline**: sequential handoff (research -> draft -> review)
- **Debate/Ensemble**: multiple agents generate candidates, one selects
- **Swarm**: dynamic peers (hard to control; avoid early)

Start with supervisor-worker first. It balances structure and flexibility.`,
      },
      {
        type: 'exercise',
        title: 'Build a Three-Agent Content Pipeline',
        description:
          'Implement a pipeline with `research_agent`, `writer_agent`, and `review_agent`. Add a supervisor that enforces max 2 revisions and logs each handoff. Final output must include a short source list.',
        language: 'python',
        starterCode: `# TODO:
# - Define standard message format passed between agents
# - Implement supervisor orchestration
# - Add revision guard (max 2)
# - Add final source summary`,
        solution: `# Expected behavior:
# step1 research -> returns facts + sources
# step2 writer -> creates draft
# step3 reviewer -> approves/rejects with feedback
# if rejected and revisions < 2 -> writer revises
# else -> return best effort + warning`,
        hints: [
          'Use a shared dict schema for inter-agent payloads',
          'Keep agents pure functions where possible',
          'Log handoffs for debugging and observability',
        ],
      },
    ],
  },
  {
    id: 'agents-context-engineering',
    moduleId: 'ai-engineering',
    phaseId: 'ai-agents',
    phaseNumber: 3,
    order: 23,
    title: 'Context Engineering',
    description: 'The advanced discipline of managing what goes into the context window — the skill that separates reliable production agents from demo-only systems.',
    duration: '25 min',
    difficulty: 'advanced',
    objectives: ['Apply context compression techniques', 'Implement episodic memory with vector stores', 'Use summarization to manage long conversations', 'Avoid context rot in multi-step agents'],
    content: [
      {
        type: 'text',
        markdown: `## Context Engineering = Reliability Engineering

Most production agent bugs are context bugs:
- important instructions pushed out of window
- irrelevant tool dumps dominating token budget
- stale facts conflicting with new evidence

Context engineering is the discipline of deciding **what goes in**, **what stays out**, and **what gets compressed**.`,
      },
      {
        type: 'code',
        language: 'python',
        filename: 'context_manager.py',
        code: `from dataclasses import dataclass


@dataclass
class ContextItem:
    kind: str        # instruction | memory | tool_result | user_message
    content: str
    priority: int    # higher = keep longer
    tokens: int


def trim_to_budget(items: list[ContextItem], max_tokens: int) -> list[ContextItem]:
    # Keep highest-priority items first, then recent items
    ordered = sorted(items, key=lambda x: (x.priority, x.tokens), reverse=True)
    kept: list[ContextItem] = []
    used = 0
    for item in ordered:
        if used + item.tokens <= max_tokens:
            kept.append(item)
            used += item.tokens
    return kept


def summarize_tool_output(text: str, max_chars: int = 450) -> str:
    if len(text) <= max_chars:
        return text
    return text[:max_chars] + "\\n... [truncated summary]"


# Rules of thumb:
# 1) System + safety instructions always highest priority
# 2) Keep recent user intents
# 3) Summarize verbose tool outputs
# 4) Store long-term memory externally (vector DB), not full chat history`,
      },
      {
        type: 'callout',
        tone: 'tip',
        title: 'Practical Context Budget Split',
        content:
          'A common split: 20% system/instructions, 30% conversation state, 40% retrieved memory/docs, 10% tool traces. Track this over time to avoid drift.',
      },
      {
        type: 'exercise',
        title: 'Implement Memory + Compression Strategy',
        description:
          'Add a context manager to an existing agent: keep short-term memory in-message, store long-term memory in vector DB, summarize tool outputs over 700 chars, and enforce a hard token budget. Compare answer quality before/after over 15 multi-turn conversations.',
        language: 'python',
        starterCode: `# TODO:
# - Add context item priority scoring
# - Add summarization pass for long tool results
# - Add vector-memory retrieval for relevant past facts
# - Enforce max token budget before each model call`,
        solution: `# Expected outcomes:
# - Lower prompt token usage per turn
# - Fewer "forgot context" failures
# - Better consistency across long conversations
#
# Report:
# avg_prompt_tokens_before vs after
# success_rate_before vs after
# notable failure cases`,
        hints: [
          'Measure token usage before optimizing',
          'Persist memory as small atomic facts, not full transcripts',
          'Summarization should preserve numbers, IDs, and decisions',
        ],
      },
    ],
  },
]

export const productionLessons: Lesson[] = [
  {
    id: 'prod-evaluation',
    moduleId: 'ai-engineering',
    phaseId: 'ai-production',
    phaseNumber: 4,
    order: 24,
    title: 'LLM Evaluation: LLM-as-Judge & RAGAS',
    description: 'Build automated evaluation pipelines using LLM-as-Judge and RAGAS metrics — the foundation of safe, continuously improving AI systems.',
    duration: '30 min',
    difficulty: 'advanced',
    objectives: ['Build a dataset of golden examples', 'Implement LLM-as-Judge evaluation', 'Measure RAG quality with RAGAS (faithfulness, relevance)', 'Run regression tests on prompt changes'],
    content: [
      {
        type: 'text',
        markdown: `## Evaluation Is a Product Requirement

Without evaluation, prompt and model changes are guesses.
Production AI teams maintain automated evals that run on every meaningful change.

Core eval layers:
- **golden dataset** (representative user tasks)
- **LLM-as-judge** for nuanced quality scoring
- **RAG metrics** (faithfulness, relevance, context precision)
- **regression gate** in CI`,
      },
      {
        type: 'code',
        language: 'python',
        filename: 'llm_judge_eval.py',
        code: `from openai import OpenAI
import json

client = OpenAI()

examples = [
    {
        "question": "What is RRF in hybrid search?",
        "reference": "Reciprocal Rank Fusion combines rankings from multiple retrieval systems.",
        "prediction": "RRF merges ranked lists using reciprocal rank scoring.",
    },
]


def judge_answer(question: str, reference: str, prediction: str) -> dict:
    prompt = f"""You are an evaluator.
Score the prediction from 1-5 on:
1) correctness
2) completeness
3) groundedness
Return strict JSON.

Question: {question}
Reference: {reference}
Prediction: {prediction}
"""
    resp = client.chat.completions.create(
        model="gpt-4o-mini",
        temperature=0,
        response_format={"type": "json_object"},
        messages=[{"role": "user", "content": prompt}],
    )
    return json.loads(resp.choices[0].message.content or "{}")


for ex in examples:
    print(judge_answer(ex["question"], ex["reference"], ex["prediction"]))`,
      },
      {
        type: 'exercise',
        title: 'Create an Eval Gate',
        description:
          'Build an eval script with 40 golden examples that fails CI if average correctness < 4.2/5 or faithfulness drops by >5% from baseline.',
        language: 'python',
        starterCode: `# TODO:
# - load eval dataset
# - run system under test
# - run judge scoring
# - compute aggregate metrics
# - exit(1) if thresholds fail`,
        solution: `# Gate logic example:
# if metrics["avg_correctness"] < 4.2: fail
# if metrics["faithfulness"] < baseline_faithfulness - 0.05: fail
# else pass`,
        hints: [
          'Keep eval set versioned in repo',
          'Use deterministic generation settings during eval',
          'Track baseline metrics per release',
        ],
      },
    ],
  },
  {
    id: 'prod-finetuning',
    moduleId: 'ai-engineering',
    phaseId: 'ai-production',
    phaseNumber: 4,
    order: 25,
    title: 'Fine-Tuning with LoRA/PEFT',
    description: 'Adapt smaller open-source models to specialized tasks without massive compute — LoRA, QLoRA, and when fine-tuning beats RAG.',
    duration: '35 min',
    difficulty: 'advanced',
    objectives: ['Understand when to fine-tune vs RAG vs prompt engineer', 'Prepare a training dataset', 'Fine-tune a model with LoRA using Hugging Face', 'Evaluate and serve the fine-tuned model'],
    content: [
      {
        type: 'text',
        markdown: `## Fine-Tune vs RAG vs Prompting

Use **prompting** first. Add **RAG** for external knowledge. Use **fine-tuning** when you need durable behavior changes (format/style/domain actions) not reliably achieved with prompting.

Typical sequence:
1. Prompt optimization
2. Retrieval grounding
3. Fine-tune only if quality gaps remain`,
      },
      {
        type: 'code',
        language: 'python',
        filename: 'lora_outline.py',
        code: `# pip install transformers peft datasets accelerate bitsandbytes trl
from peft import LoraConfig

lora_config = LoraConfig(
    r=16,
    lora_alpha=32,
    lora_dropout=0.05,
    target_modules=["q_proj", "v_proj"],
    bias="none",
    task_type="CAUSAL_LM",
)

print("LoRA config ready")

# Training flow (outline):
# 1) Load base model + tokenizer
# 2) Prepare supervised dataset (instruction, input, output)
# 3) Apply LoRA adapters
# 4) Train with SFTTrainer
# 5) Evaluate vs baseline model
# 6) Save adapters and serve`,
      },
      {
        type: 'exercise',
        title: 'Fine-Tuning Decision Memo',
        description:
          'Given an AI support assistant with weak output formatting consistency, write a technical decision memo: should you prompt, use RAG, or LoRA fine-tune? Include risk, cost, and rollout plan.',
        language: 'text',
        starterCode: `# Template:
# Problem:
# Baseline behavior:
# Option A: Prompting
# Option B: RAG
# Option C: Fine-tuning
# Decision:
# Rollout + eval plan:`,
        solution: `# Expected decision pattern:
# - If issue is format/style consistency with stable schema:
#   fine-tuning can be justified after prompt+few-shot attempts.
# - If issue is missing knowledge:
#   use RAG first, not fine-tuning.
# - Rollout with shadow traffic + eval gate before full release.`,
        hints: [
          'Separate knowledge problems from behavior problems',
          'Quantify expected gain and training cost',
          'Define rollback criteria before deployment',
        ],
      },
    ],
  },
  {
    id: 'prod-cost-optimization',
    moduleId: 'ai-engineering',
    phaseId: 'ai-production',
    phaseNumber: 4,
    order: 26,
    title: 'Cost Optimization & Caching',
    description: 'Reduce LLM costs by 70%+ with semantic caching, model routing, prompt compression, and batch processing — the engineering work that makes AI products economically viable.',
    duration: '25 min',
    difficulty: 'intermediate',
    objectives: ['Implement semantic caching with a vector DB', 'Route requests to cheaper models', 'Compress prompts without losing accuracy', 'Batch API calls for background workloads'],
    content: [
      {
        type: 'text',
        markdown: `## Cost Is a Feature

A useful AI system that is too expensive is not production-ready.
Your optimization toolbox:

- response caching (exact + semantic)
- model routing (cheap model first)
- prompt compression
- batching for offline workloads
- token budgets and truncation policies`,
      },
      {
        type: 'code',
        language: 'python',
        filename: 'cost_router.py',
        code: `def select_model(task_complexity: str) -> str:
    # Simple heuristic router
    if task_complexity in {"low", "medium"}:
        return "gpt-4o-mini"
    return "gpt-4o"


def estimate_cost(prompt_tokens: int, completion_tokens: int, price_per_1k: float) -> float:
    return ((prompt_tokens + completion_tokens) / 1000) * price_per_1k


# Example:
model = select_model("low")
print("Selected model:", model)`,
      },
      {
        type: 'exercise',
        title: 'Reduce Cost by 40% Without Quality Drop',
        description:
          'Design and implement a cost plan for an AI endpoint serving 100k requests/day. Add semantic cache, routing, and token-budget enforcement. Report cost before/after and quality impact.',
        language: 'python',
        starterCode: `# TODO:
# 1) Add exact cache (hash prompt)
# 2) Add semantic cache (embedding similarity threshold)
# 3) Add model router
# 4) Add token budget checker
# 5) Compare weekly cost`,
        solution: `# Example outcome:
# baseline weekly cost: $2,800
# optimized weekly cost: $1,520
# reduction: 45.7%
# quality delta (eval score): -0.02 (acceptable)`,
        hints: [
          'Start with read-heavy endpoints for caching wins',
          'Track cache hit rate and false-hit rate',
          'Guard quality with an eval set while optimizing',
        ],
      },
    ],
  },
  {
    id: 'prod-guardrails',
    moduleId: 'ai-engineering',
    phaseId: 'ai-production',
    phaseNumber: 4,
    order: 27,
    title: 'Guardrails, Safety & Deployment',
    description: 'Ship AI responsibly: input/output guardrails, prompt injection defense, PII detection, deployment with Docker + FastAPI, and production monitoring.',
    duration: '30 min',
    difficulty: 'intermediate',
    objectives: ['Implement input validation and output filtering', 'Defend against prompt injection attacks', 'Deploy an AI service with FastAPI and Docker', 'Set up production monitoring with LangSmith'],
    content: [
      {
        type: 'text',
        markdown: `## Production Safety Layers

Safety is layered, not one filter:

1. input validation (size/type/allowlists)
2. prompt injection defenses
3. tool permission boundaries
4. output moderation + policy checks
5. PII redaction and secure logging
6. runtime monitoring + alerting`,
      },
      {
        type: 'code',
        language: 'python',
        filename: 'guardrails_middleware.py',
        code: `import re

BLOCKLIST = [
    "ignore previous instructions",
    "reveal system prompt",
    "exfiltrate secrets",
]


def detect_prompt_injection(user_input: str) -> bool:
    text = user_input.lower()
    return any(pattern in text for pattern in BLOCKLIST)


def scrub_pii(text: str) -> str:
    # simplistic examples
    text = re.sub(r"\\b\\d{3}-\\d{2}-\\d{4}\\b", "[SSN_REDACTED]", text)
    text = re.sub(r"\\b\\d{16}\\b", "[CARD_REDACTED]", text)
    return text


def validate_request(user_input: str) -> dict:
    if len(user_input) > 12000:
        return {"ok": False, "error": "Input too long"}
    if detect_prompt_injection(user_input):
        return {"ok": False, "error": "Unsafe prompt pattern detected"}
    return {"ok": True, "clean_input": scrub_pii(user_input)}`,
      },
      {
        type: 'callout',
        tone: 'production',
        title: 'Deployment Checklist',
        content:
          'Containerize with pinned dependencies, isolate secrets in env vars, enforce request timeouts, add structured logs with request IDs, and monitor latency/error/token metrics per endpoint.',
      },
      {
        type: 'exercise',
        title: 'Ship a Safe AI Endpoint',
        description:
          'Implement a FastAPI endpoint `/ai/answer` with guardrails: input checks, injection detection, output moderation stub, PII scrubbing in logs, and request/response tracing. Provide a runbook for incident response.',
        language: 'python',
        starterCode: `# TODO:
# - build pre-LLM validator
# - add safe tool policy check
# - add post-LLM output filter
# - log with request_id and redacted payload
# - return safe fallback message on policy violation`,
        solution: `# Expected behavior:
# - unsafe input -> 400 with policy message
# - safe input -> model response
# - unsafe output -> blocked + safe fallback
# - logs contain no raw PII`,
        hints: [
          'Never log raw user data in production',
          'Guardrails should fail closed for high-risk workflows',
          'Document on-call steps for policy violations',
        ],
      },
    ],
  },
]
