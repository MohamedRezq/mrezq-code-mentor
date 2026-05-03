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
        type: 'callout',
        tone: 'info',
        title: 'Full lesson content coming soon',
        content: 'Deep dive into function calling: schema design, handling multiple simultaneous tool calls, error propagation back to the agent, and building production-grade tools (Tavily web search, Python REPL, SQL query executor).',
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
        type: 'callout',
        tone: 'info',
        title: 'Full lesson content coming soon',
        content: 'LangGraph is the production standard for stateful agents. This lesson builds a research agent with: planning node → search node → synthesis node → review node, with the ability to loop back on quality check failure.',
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
        type: 'callout',
        tone: 'info',
        title: 'Full lesson content coming soon',
        content: 'Covers: when to use multi-agent (specialized skills, parallel work, quality gates), supervisor patterns, CrewAI/AutoGen overview, and building a production multi-agent content pipeline.',
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
        type: 'callout',
        tone: 'info',
        title: 'Full lesson content coming soon',
        content: 'Context engineering covers: trimming old messages, compressing tool outputs, semantic memory (RAG-based recall), and structuring the context window for optimal agent performance.',
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
        type: 'callout',
        tone: 'info',
        title: 'Full lesson content coming soon',
        content: 'Covers building eval datasets, LLM-as-Judge with CoT, RAGAS for RAG systems, and integrating evals into CI/CD so every prompt change gets automatically tested.',
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
        type: 'callout',
        tone: 'info',
        title: 'Full lesson content coming soon',
        content: 'Fine-tuning guide covering: decision criteria (fine-tune when you need specialized style/format not achievable with prompts), dataset preparation, LoRA with PEFT, training on a T4 GPU in Google Colab, and deploying with vLLM.',
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
        type: 'callout',
        tone: 'info',
        title: 'Full lesson content coming soon',
        content: 'Real cost optimization techniques: semantic caching (cache similar queries, not just identical ones), LLM routing (use gpt-4o-mini for easy tasks, gpt-4o for hard ones), prompt compression with LLMLingua, and OpenAI Batch API for 50% cost reduction.',
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
        type: 'callout',
        tone: 'info',
        title: 'Full lesson content coming soon',
        content: 'Production readiness checklist: Guardrails AI for safety rules, NeMo Guardrails for dialog management, prompt injection detection, PII scrubbing with spaCy/presidio, FastAPI + Docker deployment, and LangSmith for tracing and monitoring.',
      },
    ],
  },
]
