import type { Lesson } from '@/types/lesson'

export const pythonLessons: Lesson[] = [
  // ─────────────────────────────────────────────────────────────
  // LESSON 1: Python Basics
  // ─────────────────────────────────────────────────────────────
  {
    id: 'py-basics',
    moduleId: 'ai-engineering',
    phaseId: 'ai-python',
    phaseNumber: 0,
    order: 1,
    title: 'Python Basics for AI Engineers',
    description: 'Variables, types, functions, and f-strings — the building blocks every AI script uses, compared to JavaScript.',
    duration: '30 min',
    difficulty: 'beginner',
    objectives: [
      'Write type-annotated Python variables and functions',
      'Use f-strings to build dynamic prompts',
      'Understand how Python differs from JavaScript/TypeScript',
      'Apply Optional and Union type hints',
    ],
    content: [
      {
        type: 'text',
        markdown: `## Why Python for AI?

Python is the lingua franca of AI. Every major framework — LangChain, LlamaIndex, Hugging Face, PyTorch, and the official SDKs for OpenAI and Anthropic — is Python-first. If you already know JavaScript or TypeScript, Python will feel familiar but with important differences.

This lesson gets you productive fast by focusing on what you'll actually use when building AI applications.`,
      },
      {
        type: 'callout',
        tone: 'tip',
        title: 'Coming from JavaScript/TypeScript?',
        content: 'Python uses indentation (4 spaces) instead of curly braces. There are no semicolons. Variables are dynamically typed but you can add type hints (which is how modern Python is written). Think of type hints as TypeScript annotations — optional but strongly recommended.',
      },
      {
        type: 'text',
        markdown: `## Variables & Type Hints

Python 3.10+ supports the clearest type hint syntax. Always annotate your function signatures — it makes AI code much easier to reason about.`,
      },
      {
        type: 'code',
        language: 'python',
        filename: 'basics.py',
        code: `# Basic variables — no 'let', 'const', or 'var'
name: str = "Alice"
age: int = 30
temperature: float = 0.7          # LLM temperature setting
is_streaming: bool = True
nothing: None = None

# Optional — equivalent to TypeScript's string | null
from typing import Optional

model: Optional[str] = None       # might not be set yet
model = "gpt-4o"                  # now it's set

# Union types (Python 3.10+ shorthand)
def process(value: str | int) -> str:
    return str(value)

# Constants — Python convention: ALL_CAPS
MAX_TOKENS: int = 4096
DEFAULT_MODEL: str = "claude-3-5-sonnet-20241022"`,
        explanation: 'Python type hints are purely for static analysis (mypy, pyright) — they do not affect runtime behavior. In modern Python projects, always annotate function signatures and key variables.',
      },
      {
        type: 'text',
        markdown: `## Functions

Python functions support default arguments, keyword arguments, and \`*args\`/\`**kwargs\` — patterns you will see constantly in AI framework code.`,
      },
      {
        type: 'code',
        language: 'python',
        filename: 'functions.py',
        code: `# Basic function with type hints
def create_prompt(task: str, context: str = "") -> str:
    """Create a prompt string for an LLM.
    
    Args:
        task: The instruction for the model
        context: Optional background information
    
    Returns:
        Formatted prompt string
    """
    if context:
        return f"Context: {context}\\n\\nTask: {task}"
    return f"Task: {task}"


# Calling with positional and keyword arguments
prompt1 = create_prompt("Summarize this text")
prompt2 = create_prompt("Summarize this text", context="This is a legal document.")
prompt3 = create_prompt(task="Translate to Spanish", context="User is a beginner")


# **kwargs — receives any keyword arguments as a dict
# Used heavily in LLM API wrappers
def call_llm(model: str, **kwargs) -> dict:
    """
    kwargs might include: temperature, max_tokens, top_p, etc.
    """
    params = {"model": model, **kwargs}
    print(params)  # {'model': 'gpt-4o', 'temperature': 0.7, 'max_tokens': 512}
    return params

result = call_llm("gpt-4o", temperature=0.7, max_tokens=512)


# *args — receives any positional arguments as a tuple
def log(*messages: str) -> None:
    for msg in messages:
        print(f"[LOG] {msg}")

log("Starting pipeline", "Loading documents", "Done")`,
        explanation: '`**kwargs` is everywhere in AI libraries — OpenAI, LangChain, and others use it to accept optional parameters without breaking changes. Learn to read and write it comfortably.',
      },
      {
        type: 'text',
        markdown: `## f-Strings: Your Most-Used Python Feature in AI

You will build LLM prompts constantly. f-strings are the cleanest way to do it.`,
      },
      {
        type: 'code',
        language: 'python',
        filename: 'fstrings.py',
        code: `user_name = "Sarah"
user_query = "What is RAG?"
retrieved_docs = ["RAG stands for...", "It was introduced in..."]
max_words = 150

# Basic f-string interpolation
greeting = f"Hello, {user_name}!"

# Expressions inside f-strings
summary = f"Found {len(retrieved_docs)} relevant documents."

# Multi-line prompts (most common pattern in AI code)
system_prompt = f"""You are a helpful AI assistant answering questions for {user_name}.
Always be concise and accurate. Limit responses to {max_words} words."""

# Building RAG prompts with dynamic context
context_block = "\\n\\n".join(
    [f"[Doc {i+1}]: {doc}" for i, doc in enumerate(retrieved_docs)]
)

rag_prompt = f"""Answer the question using only the provided context.

Context:
{context_block}

Question: {user_query}

Answer:"""

print(rag_prompt)

# Formatting numbers and alignment
token_count = 1_234_567
cost = 0.00234
print(f"Tokens used: {token_count:,}")       # 1,234,567
print(f"Cost: \${cost:.4f}")                  # $0.0023`,
      },
      {
        type: 'callout',
        tone: 'production',
        title: 'Production Pattern: Prompt Templates',
        content: 'In production AI systems, prompts are not hardcoded f-strings. They live in separate files or a prompt registry (like LangChain\'s PromptTemplate), are version-controlled, and are tested independently. We will cover this in the Prompt Engineering lesson. For now, f-strings give you the foundation.',
      },
      {
        type: 'exercise',
        title: 'Build a Prompt Builder Function',
        description: 'Write a function `build_system_prompt` that takes a role (str), expertise level ("beginner", "intermediate", "expert"), and language (str, default "English"), and returns a formatted system prompt string.',
        language: 'python',
        starterCode: `def build_system_prompt(
    role: str,
    expertise_level: str,
    language: str = "English"
) -> str:
    """
    Build a system prompt for an LLM.
    
    Example output:
    "You are a Python expert. The user is an intermediate developer.
    Always respond in English."
    """
    # Your code here
    pass


# Test it
print(build_system_prompt("Python expert", "intermediate"))
print(build_system_prompt("SQL tutor", "beginner", "Arabic"))`,
        solution: `def build_system_prompt(
    role: str,
    expertise_level: str,
    language: str = "English"
) -> str:
    return f"""You are a {role}. The user is a {expertise_level} developer.
Always respond in {language}. Adjust your explanations to match the user's level."""

print(build_system_prompt("Python expert", "intermediate"))
print(build_system_prompt("SQL tutor", "beginner", "Arabic"))`,
        hints: [
          'Use an f-string with multiline triple quotes',
          'Interpolate all three parameters into the string',
        ],
      },
      {
        type: 'exercise',
        title: 'Merge model name with **kwargs',
        description:
          'Implement `build_request_body(model: str, **params) -> dict[str, object]` that returns `{"model": model}` merged with every keyword argument (e.g. `temperature`, `max_tokens`). This mirrors how LLM client helpers flatten options.',
        language: 'python',
        starterCode: `def build_request_body(model: str, **params: object) -> dict[str, object]:
    ...


print(build_request_body("gpt-4o-mini", temperature=0.2, max_tokens=128))
# Expect: model key plus temperature and max_tokens`,
        solution: `def build_request_body(model: str, **params: object) -> dict[str, object]:
    return {"model": model, **params}


print(build_request_body("gpt-4o-mini", temperature=0.2, max_tokens=128))`,
        hints: ['Start from `{"model": model}` and unpack `params` with `**` into the same dict'],
      },
      {
        type: 'exercise',
        title: 'Optional model name',
        description:
          'Write `describe_run(model: str | None, run_id: str) -> str`. If `model` is `None` or empty after stripping, use the literal `"unknown-model"` (good use of `or`). Always include `run_id` in the f-string.',
        language: 'python',
        starterCode: `def describe_run(model: str | None, run_id: str) -> str:
    ...


print(describe_run("claude-3-5-sonnet", "run-1"))
print(describe_run(None, "run-2"))
print(describe_run("   ", "run-3"))`,
        solution: `def describe_run(model: str | None, run_id: str) -> str:
    name = (model or "").strip() or "unknown-model"
    return f"run={run_id} model={name}"


print(describe_run("claude-3-5-sonnet", "run-1"))
print(describe_run(None, "run-2"))
print(describe_run("   ", "run-3"))`,
        hints: ['Strip first if model is a string; `None` has no strip — branch or use `(model or "")`', '`or` picks the first truthy value'],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // LESSON 2: Data Structures
  // ─────────────────────────────────────────────────────────────
  {
    id: 'py-data-structures',
    moduleId: 'ai-engineering',
    phaseId: 'ai-python',
    phaseNumber: 0,
    order: 2,
    title: 'Python Data Structures for AI',
    description: 'Lists, dictionaries, comprehensions, and nested data — the patterns you will use when processing API responses and building data pipelines.',
    duration: '35 min',
    difficulty: 'beginner',
    objectives: [
      'Manipulate lists with comprehensions and built-in methods',
      'Work with nested dictionaries like API responses',
      'Use enumerate, zip, and items() in loops',
      'Parse JSON structures returned by LLM APIs',
    ],
    content: [
      {
        type: 'text',
        markdown: `## Dictionaries: The Most Important Data Structure in AI Code

LLM API responses, RAG metadata, configuration objects — almost everything in AI engineering flows through Python dictionaries. Master them thoroughly.`,
      },
      {
        type: 'code',
        language: 'python',
        filename: 'dicts.py',
        code: `# Creating dictionaries
config: dict[str, str | int | float] = {
    "model": "gpt-4o",
    "max_tokens": 1024,
    "temperature": 0.7,
}

# Accessing values
model = config["model"]              # KeyError if missing
model = config.get("model")          # Returns None if missing
model = config.get("model", "gpt-4o-mini")  # Default value

# Adding and updating
config["stream"] = True
config.update({"top_p": 0.9, "frequency_penalty": 0.0})

# Checking membership
if "temperature" in config:
    print(f"Temperature set to {config['temperature']}")

# Iterating
for key, value in config.items():
    print(f"  {key}: {value}")

# Dict comprehension — transform a dict
sanitized = {k: v for k, v in config.items() if v is not None}

# Merging dicts (Python 3.9+)
defaults = {"temperature": 0.7, "max_tokens": 1024}
overrides = {"temperature": 0.0, "model": "gpt-4o"}
final_config = defaults | overrides   # overrides win
# {'temperature': 0.0, 'max_tokens': 1024, 'model': 'gpt-4o'}`,
        explanation: 'The `.get()` method with a default value is safer than direct key access — use it when a key might not exist (which is common in LLM API responses).',
      },
      {
        type: 'text',
        markdown: `## Working with Nested API Responses

Every LLM API returns nested JSON. Here is how to navigate it confidently.`,
      },
      {
        type: 'code',
        language: 'python',
        filename: 'api_response.py',
        code: `# This is what OpenAI's chat completion response looks like as a dict
openai_response = {
    "id": "chatcmpl-abc123",
    "object": "chat.completion",
    "created": 1677652288,
    "model": "gpt-4o",
    "choices": [
        {
            "index": 0,
            "message": {
                "role": "assistant",
                "content": "The capital of France is Paris.",
            },
            "finish_reason": "stop",
        }
    ],
    "usage": {
        "prompt_tokens": 24,
        "completion_tokens": 9,
        "total_tokens": 33,
    },
}

# Extracting the assistant's reply (this is the most common pattern)
content = openai_response["choices"][0]["message"]["content"]
print(content)  # "The capital of France is Paris."

# Extracting token usage for cost tracking
usage = openai_response["usage"]
total_tokens = usage["total_tokens"]

# Safer navigation with .get()
finish_reason = (
    openai_response.get("choices", [{}])[0]
    .get("finish_reason", "unknown")
)


# Real pattern: a helper function to extract content
def extract_content(response: dict) -> str:
    """Safely extract text content from an OpenAI-style response."""
    try:
        return response["choices"][0]["message"]["content"]
    except (KeyError, IndexError) as e:
        raise ValueError(f"Unexpected response format: {e}") from e`,
      },
      {
        type: 'text',
        markdown: `## Lists and List Comprehensions

Lists are Python's arrays. List comprehensions replace most \`map\` and \`filter\` calls you would write in JavaScript — and they are idiomatic Python.`,
      },
      {
        type: 'code',
        language: 'python',
        filename: 'lists.py',
        code: `# Creating and manipulating lists
documents: list[str] = [
    "Python was created in 1991.",
    "LLMs use transformer architecture.",
    "RAG improves factual accuracy.",
]

# Appending and extending
documents.append("Embeddings are vector representations.")
documents.extend(["One more doc.", "And another."])

# Slicing (like JavaScript, but inclusive start, exclusive end)
first_two = documents[:2]
last_one = documents[-1]
every_other = documents[::2]

# List comprehension — transforms each item
upper_docs = [doc.upper() for doc in documents]

# With a condition (filter)
short_docs = [doc for doc in documents if len(doc) < 40]

# Building message lists for LLM APIs
history = [
    {"role": "user", "content": "What is RAG?"},
    {"role": "assistant", "content": "RAG stands for..."},
]

# Adding a new user message
def add_message(history: list[dict], role: str, content: str) -> list[dict]:
    return [*history, {"role": role, "content": content}]

updated = add_message(history, "user", "How do I implement it?")

# enumerate — get index + value (replaces forEach with index)
for i, doc in enumerate(documents):
    print(f"[{i}] {doc[:50]}...")

# zip — iterate two lists together
sources = ["doc_a.pdf", "doc_b.pdf", "doc_c.pdf"]
scores = [0.92, 0.87, 0.74]

for source, score in zip(sources, scores):
    print(f"{source}: {score:.2%} relevance")`,
      },
      {
        type: 'callout',
        tone: 'tip',
        title: 'List comprehensions vs loops',
        content: 'Use list comprehensions for simple transformations and filters. Use regular for loops when the logic is complex or when you need side effects (logging, API calls). Never write a comprehension so complex that it needs a comment to explain it.',
      },
      {
        type: 'exercise',
        title: 'Parse a Batch LLM Response',
        description: 'You have a list of OpenAI-style response dictionaries from a batch API call. Write a function that returns a list of just the text content from each response, skipping any where finish_reason is not "stop".',
        language: 'python',
        starterCode: `responses = [
    {"choices": [{"message": {"content": "Paris"}, "finish_reason": "stop"}]},
    {"choices": [{"message": {"content": "..."}, "finish_reason": "length"}]},
    {"choices": [{"message": {"content": "Berlin"}, "finish_reason": "stop"}]},
]

def extract_successful_responses(responses: list[dict]) -> list[str]:
    """Return content strings for responses that finished with 'stop'."""
    # Your code here — use a list comprehension
    pass

print(extract_successful_responses(responses))
# Expected: ['Paris', 'Berlin']`,
        solution: `def extract_successful_responses(responses: list[dict]) -> list[str]:
    return [
        r["choices"][0]["message"]["content"]
        for r in responses
        if r["choices"][0]["finish_reason"] == "stop"
    ]`,
        hints: [
          'Use a list comprehension with an if condition',
          'Access nested keys: r["choices"][0]["finish_reason"]',
        ],
      },
      {
        type: 'exercise',
        title: 'Zip sources to scores',
        description:
          'Given parallel lists `sources` (str) and `scores` (float), return a list of dicts `{"source": s, "score": round(x, 3)}` for each pair. If lengths differ, stop at the shorter length (like `zip` does).',
        language: 'python',
        starterCode: `def attach_scores(sources: list[str], scores: list[float]) -> list[dict[str, object]]:
    ...


print(attach_scores(["a.pdf", "b.pdf"], [0.91, 0.77, 0.5]))`,
        solution: `def attach_scores(sources: list[str], scores: list[float]) -> list[dict[str, object]]:
    return [{"source": s, "score": round(x, 3)} for s, x in zip(sources, scores)]


print(attach_scores(["a.pdf", "b.pdf"], [0.91, 0.77, 0.5]))`,
        hints: ['`zip` stops at the shortest iterable', 'Use round(x, 3) inside the comprehension'],
      },
      {
        type: 'exercise',
        title: 'Deep-get with defaults',
        description:
          'Implement `get_usage_total(usage: dict) -> int` that returns `usage["total_tokens"]` if present; otherwise try `usage["input_tokens"] + usage["output_tokens"]` when both exist; otherwise return `0`. Use `.get()` so missing keys never raise.',
        language: 'python',
        starterCode: `def get_usage_total(usage: dict) -> int:
    ...


print(get_usage_total({"total_tokens": 42}))
print(get_usage_total({"input_tokens": 10, "output_tokens": 5}))
print(get_usage_total({}))`,
        solution: `def get_usage_total(usage: dict) -> int:
    if "total_tokens" in usage:
        return int(usage["total_tokens"])
    inp = usage.get("input_tokens")
    out = usage.get("output_tokens")
    if inp is not None and out is not None:
        return int(inp) + int(out)
    return 0


print(get_usage_total({"total_tokens": 42}))
print(get_usage_total({"input_tokens": 10, "output_tokens": 5}))
print(get_usage_total({}))`,
        hints: ['Check keys with `in` or compare `.get(...)` to None', 'Cast to int when building the sum'],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // LESSON 3: OOP & Pydantic
  // ─────────────────────────────────────────────────────────────
  {
    id: 'py-oop-pydantic',
    moduleId: 'ai-engineering',
    phaseId: 'ai-python',
    phaseNumber: 0,
    order: 3,
    title: 'Python OOP & Pydantic',
    description: 'Classes, dataclasses, and Pydantic models — the tools AI frameworks use internally, and that you will use to structure LLM outputs.',
    duration: '35 min',
    difficulty: 'beginner',
    objectives: [
      'Write Python classes with methods and properties',
      'Use @dataclass for clean data containers',
      'Define Pydantic models with field validation',
      'Use Pydantic to parse and validate LLM JSON output',
    ],
    content: [
      {
        type: 'text',
        markdown: `## Classes in Python

Python classes are similar to JavaScript classes but with stronger conventions. The key difference: \`self\` is explicit (not implicit like \`this\`).`,
      },
      {
        type: 'code',
        language: 'python',
        filename: 'classes.py',
        code: `from typing import Optional


class LLMClient:
    """A simple wrapper around an LLM API."""

    # Class variable (shared across all instances)
    default_model: str = "gpt-4o-mini"

    def __init__(self, api_key: str, model: Optional[str] = None) -> None:
        # Instance variables (unique per instance)
        self.api_key = api_key
        self.model = model or self.default_model
        self._request_count = 0  # _prefix = "private" by convention

    def complete(self, prompt: str, max_tokens: int = 256) -> str:
        """Send a completion request (simplified)."""
        self._request_count += 1
        # Real implementation would call the API here
        return f"[Response to: {prompt[:30]}...]"

    @property
    def request_count(self) -> int:
        """Read-only property."""
        return self._request_count

    def reset_count(self) -> None:
        self._request_count = 0

    def __repr__(self) -> str:
        """String representation — useful for debugging."""
        return f"LLMClient(model={self.model!r}, requests={self._request_count})"


# Usage
client = LLMClient(api_key="sk-...", model="gpt-4o")
response = client.complete("What is Python?")
print(client.request_count)  # 1
print(client)  # LLMClient(model='gpt-4o', requests=1)


# Inheritance — common in AI framework code
class CachingLLMClient(LLMClient):
    def __init__(self, api_key: str, **kwargs) -> None:
        super().__init__(api_key, **kwargs)
        self._cache: dict[str, str] = {}

    def complete(self, prompt: str, max_tokens: int = 256) -> str:
        if prompt in self._cache:
            return self._cache[prompt]
        result = super().complete(prompt, max_tokens)
        self._cache[prompt] = result
        return result`,
      },
      {
        type: 'text',
        markdown: `## Dataclasses: Cleaner Data Containers

When you just need to hold data (not behavior), \`@dataclass\` removes the boilerplate of writing \`__init__\` manually.`,
      },
      {
        type: 'code',
        language: 'python',
        filename: 'dataclasses_demo.py',
        code: `from dataclasses import dataclass, field
from typing import Optional


@dataclass
class Document:
    """Represents a document chunk in a RAG pipeline."""
    id: str
    content: str
    source: str
    score: float = 0.0
    metadata: dict = field(default_factory=dict)  # mutable default needs field()

    def preview(self, chars: int = 100) -> str:
        return self.content[:chars] + ("..." if len(self.content) > chars else "")


@dataclass
class ChatMessage:
    role: str   # "system", "user", or "assistant"
    content: str

    def to_dict(self) -> dict[str, str]:
        return {"role": self.role, "content": self.content}


# Usage
doc = Document(id="doc_1", content="Python is a general-purpose language...", source="wiki.pdf")
print(doc.preview())      # Python is a general-purpose language...
print(doc.score)          # 0.0

# Dataclasses get __repr__ for free
print(doc)  # Document(id='doc_1', content='Python is a...', ...)

messages = [
    ChatMessage("system", "You are a helpful assistant."),
    ChatMessage("user", "What is a dataclass?"),
]
api_messages = [m.to_dict() for m in messages]`,
      },
      {
        type: 'text',
        markdown: `## Pydantic: The #1 Tool for Structured LLM Output

Pydantic is a data validation library that is used in virtually every modern Python AI project. FastAPI, LangChain, and the Instructor library all use it. You will use it to ensure LLM responses match an expected schema.`,
      },
      {
        type: 'code',
        language: 'python',
        filename: 'pydantic_demo.py',
        code: `from pydantic import BaseModel, Field, field_validator
from typing import Literal
import json


# A Pydantic model defines expected LLM output structure
class SentimentAnalysis(BaseModel):
    sentiment: Literal["positive", "negative", "neutral"]
    confidence: float = Field(ge=0.0, le=1.0)  # must be 0.0–1.0
    reasoning: str = Field(min_length=10)
    key_phrases: list[str]

    @field_validator("confidence")
    @classmethod
    def round_confidence(cls, v: float) -> float:
        return round(v, 3)


# Simulate an LLM returning JSON
llm_json_output = """
{
  "sentiment": "positive",
  "confidence": 0.9234,
  "reasoning": "The text uses enthusiastic language and positive descriptors.",
  "key_phrases": ["excellent", "highly recommend", "fantastic experience"]
}
"""

# Parse and validate — will raise ValidationError if schema doesn't match
result = SentimentAnalysis.model_validate_json(llm_json_output)
print(result.sentiment)      # "positive"
print(result.confidence)     # 0.923
print(result.key_phrases)    # ["excellent", ...]

# Converting back to dict/JSON
print(result.model_dump())
print(result.model_dump_json(indent=2))

# What happens when the LLM returns bad data?
bad_output = '{"sentiment": "angry", "confidence": 1.5, "reasoning": "bad", "key_phrases": []}'
try:
    SentimentAnalysis.model_validate_json(bad_output)
except Exception as e:
    print(f"Validation error: {e}")
    # sentiment must be 'positive', 'negative', or 'neutral'
    # confidence must be <= 1.0
    # reasoning is too short`,
        explanation: 'Pydantic models become your contract between the LLM and your application code. If the LLM returns data that does not match the schema, you get a clear error instead of a runtime crash deep in your pipeline.',
      },
      {
        type: 'callout',
        tone: 'production',
        title: 'Production Pattern: Schema-first LLM Integration',
        content: 'In production, define your Pydantic models before you write your prompts. Tell the LLM "respond with JSON matching this schema" and validate the output immediately. The Instructor library (covered in the Structured Output lesson) automates this entirely — it feeds the schema to the LLM and handles retries on validation failure.',
      },
      {
        type: 'exercise',
        title: 'Model a Document Extraction Response',
        description: 'Create a Pydantic model for an LLM that extracts structured information from job postings. It should capture: job_title (str), company (str), required_skills (list of strings), years_experience (int, must be >= 0), is_remote (bool).',
        language: 'python',
        starterCode: `from pydantic import BaseModel, Field

class JobPosting(BaseModel):
    # Define the fields here
    pass


# Test with this JSON
sample_json = """
{
  "job_title": "Senior AI Engineer",
  "company": "OpenAI",
  "required_skills": ["Python", "PyTorch", "LLMs"],
  "years_experience": 5,
  "is_remote": true
}
"""
result = JobPosting.model_validate_json(sample_json)
print(result.job_title)
print(result.required_skills)`,
        solution: `from pydantic import BaseModel, Field

class JobPosting(BaseModel):
    job_title: str
    company: str
    required_skills: list[str]
    years_experience: int = Field(ge=0)
    is_remote: bool

sample_json = """{"job_title": "Senior AI Engineer", "company": "OpenAI", "required_skills": ["Python", "PyTorch", "LLMs"], "years_experience": 5, "is_remote": true}"""
result = JobPosting.model_validate_json(sample_json)
print(result.job_title)        # Senior AI Engineer
print(result.required_skills)  # ['Python', 'PyTorch', 'LLMs']`,
      },
      {
        type: 'exercise',
        title: 'Dataclass chunk for RAG',
        description:
          'Define a `@dataclass` `Chunk` with fields: `id: str`, `text: str`, `source: str`, `tokens: int = 0`. Add method `preview(self, n: int = 80) -> str` returning the first `n` characters plus `"..."` if `text` is longer than `n`.',
        language: 'python',
        starterCode: `from dataclasses import dataclass


@dataclass
class Chunk:
    ...


c = Chunk(id="1", text="A" * 100, source="doc.pdf")
print(c.preview())
print(c.preview(10))`,
        solution: `from dataclasses import dataclass


@dataclass
class Chunk:
    id: str
    text: str
    source: str
    tokens: int = 0

    def preview(self, n: int = 80) -> str:
        if len(self.text) <= n:
            return self.text
        return self.text[:n] + "..."


c = Chunk(id="1", text="A" * 100, source="doc.pdf")
print(c.preview())
print(c.preview(10))`,
        hints: ['Use len(self.text) vs n', 'Slice with [:n]'],
      },
      {
        type: 'exercise',
        title: 'Pydantic: tool call arguments',
        description:
          'Model a function tool call: `name: str` (non-empty), `arguments: dict[str, object]` (default empty dict). Add `Field` so `arguments` defaults to a new dict per instance (use `default_factory`). Parse from JSON string.',
        language: 'python',
        starterCode: `from pydantic import BaseModel, Field


class ToolCall(BaseModel):
    ...


raw = '{"name": "search", "arguments": {"q": "RAG"}}'
tc = ToolCall.model_validate_json(raw)
print(tc.name, tc.arguments)`,
        solution: `from pydantic import BaseModel, Field


class ToolCall(BaseModel):
    name: str = Field(min_length=1)
    arguments: dict[str, object] = Field(default_factory=dict)


raw = '{"name": "search", "arguments": {"q": "RAG"}}'
tc = ToolCall.model_validate_json(raw)
print(tc.name, tc.arguments)`,
        hints: ['Mutable default: `Field(default_factory=dict)`', '`min_length=1` on name'],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // LESSON 4: Files, JSON & Environment
  // ─────────────────────────────────────────────────────────────
  {
    id: 'py-files-json',
    moduleId: 'ai-engineering',
    phaseId: 'ai-python',
    phaseNumber: 0,
    order: 4,
    title: 'Files, JSON & Environment Variables',
    description: 'Reading documents, handling JSON, and managing API keys securely — foundations for every RAG pipeline and AI application.',
    duration: '35 min',
    difficulty: 'beginner',
    objectives: [
      'Read and write files with pathlib',
      'Parse and serialize JSON for API communication',
      'Load API keys safely with python-dotenv',
      'Handle common file encoding issues',
    ],
    content: [
      {
        type: 'text',
        markdown: `## Managing API Keys: Do This Right From Day One

Never hardcode API keys in your code. The industry standard is \`.env\` files loaded with \`python-dotenv\`. This matters immediately because you will have API keys from your first lesson on LLMs.`,
      },
      {
        type: 'code',
        language: 'python',
        filename: '.env',
        code: `# .env file — never commit this to git!
OPENAI_API_KEY=sk-proj-...
ANTHROPIC_API_KEY=sk-ant-...
PINECONE_API_KEY=...
DATABASE_URL=postgresql://...`,
      },
      {
        type: 'code',
        language: 'python',
        filename: 'config.py',
        code: `import os
from dotenv import load_dotenv

# Load .env file (does nothing if file doesn't exist)
load_dotenv()

# Get values — raise an error if required keys are missing
def get_required_env(key: str) -> str:
    value = os.getenv(key)
    if not value:
        raise ValueError(
            f"Required environment variable '{key}' is not set. "
            f"Add it to your .env file."
        )
    return value


# Usage in your application
OPENAI_API_KEY = get_required_env("OPENAI_API_KEY")
ANTHROPIC_API_KEY = get_required_env("ANTHROPIC_API_KEY")

# Optional values with defaults
MODEL = os.getenv("DEFAULT_MODEL", "gpt-4o-mini")
MAX_TOKENS = int(os.getenv("MAX_TOKENS", "1024"))
DEBUG = os.getenv("DEBUG", "false").lower() == "true"`,
        explanation: 'Add `.env` to your `.gitignore` immediately. Provide a `.env.example` file with the key names but no values — this tells your team what they need to set up.',
      },
      {
        type: 'text',
        markdown: `## Reading Files with pathlib

The \`pathlib\` module (Python 3.4+) gives you clean, cross-platform file path handling. You will use it in every RAG pipeline to load documents.`,
      },
      {
        type: 'code',
        language: 'python',
        filename: 'file_reading.py',
        code: `from pathlib import Path


# pathlib.Path — the modern way to handle paths
docs_dir = Path("./documents")
output_dir = Path("./output")
output_dir.mkdir(parents=True, exist_ok=True)  # create if needed

# Reading a text file
def read_document(file_path: str | Path) -> str:
    """Read a text document with proper encoding handling."""
    path = Path(file_path)
    return path.read_text(encoding="utf-8")


# Reading all .txt files in a directory
def load_documents(directory: str | Path) -> list[dict]:
    """Load all text files, returning content + metadata."""
    dir_path = Path(directory)
    documents = []

    for file_path in dir_path.glob("*.txt"):  # or "**/*.txt" for recursive
        content = file_path.read_text(encoding="utf-8")
        documents.append({
            "filename": file_path.name,
            "content": content,
            "size_bytes": file_path.stat().st_size,
            "path": str(file_path),
        })

    return documents


# Writing output
def save_results(results: list[dict], output_file: str | Path) -> None:
    path = Path(output_file)
    path.write_text(
        "\\n---\\n".join(r.get("content", "") for r in results),
        encoding="utf-8"
    )`,
      },
      {
        type: 'text',
        markdown: `## JSON: The Format of AI APIs

Every LLM API communicates in JSON. You need \`json.loads()\` (string → Python), \`json.dumps()\` (Python → string), and how to handle edge cases.`,
      },
      {
        type: 'code',
        language: 'python',
        filename: 'json_handling.py',
        code: `import json
from pathlib import Path


# Parsing JSON from an API response string
json_string = '{"model": "gpt-4o", "tokens": 150, "cached": true}'
data = json.loads(json_string)
print(data["model"])   # "gpt-4o"
print(type(data))      # <class 'dict'>

# Serializing Python to JSON
config = {
    "model": "claude-3-5-sonnet-20241022",
    "temperature": 0.7,
    "stop_sequences": ["\\n\\nHuman:", "\\n\\nAssistant:"],
}
json_output = json.dumps(config, indent=2)
print(json_output)


# Loading/saving JSON files (very common for caching embeddings or results)
def load_json_file(path: str | Path) -> dict | list:
    with open(path, encoding="utf-8") as f:
        return json.load(f)

def save_json_file(data: dict | list, path: str | Path) -> None:
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)


# Handling LLM responses that return JSON embedded in text
# (common before structured output was reliable)
def extract_json_from_text(text: str) -> dict:
    """Extract JSON object from LLM response that might have extra text."""
    # Find the first { and last }
    start = text.find("{")
    end = text.rfind("}") + 1
    if start == -1 or end == 0:
        raise ValueError("No JSON object found in response")
    json_str = text[start:end]
    return json.loads(json_str)


messy_response = 'Here is the result: {"score": 0.95, "label": "positive"} Hope that helps!'
clean = extract_json_from_text(messy_response)
print(clean)  # {'score': 0.95, 'label': 'positive'}`,
      },
      {
        type: 'callout',
        tone: 'warning',
        title: 'Never parse LLM JSON with string manipulation in production',
        content: 'The extract_json_from_text pattern is a workaround for older, less reliable LLMs. In production, use structured output (response_format={"type": "json_object"} in OpenAI, or the Instructor library) to get guaranteed JSON responses. We cover this fully in the Structured Output lesson.',
      },
      {
        type: 'exercise',
        title: 'Required vs optional env',
        description:
          'Implement `read_api_key(env: dict[str, str], name: str) -> str` that returns `env[name]` stripped if present and non-empty after strip; otherwise raises `ValueError` with a clear message. Also implement `read_optional_int(env, key, default: int) -> int` using `env.get(key)` — empty or missing means `default`, else `int(value)`.',
        language: 'python',
        starterCode: `def read_api_key(env: dict[str, str], name: str) -> str:
    ...


def read_optional_int(env: dict[str, str], key: str, default: int) -> int:
    ...


fake = {"OPENAI_API_KEY": " sk-123 ", "MAX_TOKENS": ""}
print(read_optional_int(fake, "MAX_TOKENS", 1024))
print(read_api_key(fake, "OPENAI_API_KEY"))`,
        solution: `def read_api_key(env: dict[str, str], name: str) -> str:
    raw = env.get(name)
    if raw is None or not raw.strip():
        raise ValueError(f"Missing or empty environment variable: {name}")
    return raw.strip()


def read_optional_int(env: dict[str, str], key: str, default: int) -> int:
    v = env.get(key)
    if v is None or not str(v).strip():
        return default
    return int(str(v).strip())


fake = {"OPENAI_API_KEY": " sk-123 ", "MAX_TOKENS": ""}
print(read_optional_int(fake, "MAX_TOKENS", 1024))
print(read_api_key(fake, "OPENAI_API_KEY"))`,
        hints: ['Treat whitespace-only as empty for the API key', 'int() after strip for optional int'],
      },
      {
        type: 'exercise',
        title: 'Round-trip JSON config',
        description:
          'Write `roundtrip_config(obj: dict) -> dict`: serialize with `json.dumps(..., indent=2)` then parse back with `json.loads` and return the dict. This checks you can losslessly move config through JSON (like saving run settings).',
        language: 'python',
        starterCode: `import json


def roundtrip_config(obj: dict) -> dict:
    ...


cfg = {"model": "gpt-4o-mini", "temperature": 0.0, "tags": ["dev", "v2"]}
assert roundtrip_config(cfg) == cfg
print("ok")`,
        solution: `import json


def roundtrip_config(obj: dict) -> dict:
    s = json.dumps(obj, indent=2)
    return json.loads(s)


cfg = {"model": "gpt-4o-mini", "temperature": 0.0, "tags": ["dev", "v2"]}
assert roundtrip_config(cfg) == cfg
print("ok")`,
        hints: ['json.dumps then json.loads', 'No need for ensure_ascii in this exercise'],
      },
      {
        type: 'exercise',
        title: 'Extract JSON from noisy LLM text',
        description:
          'Implement `extract_json_from_text(text: str) -> dict` as in the lesson: find substring from first `{` through last `}`, then `json.loads`. Raise `ValueError("no json")` if `{` is missing.',
        language: 'python',
        starterCode: `import json


def extract_json_from_text(text: str) -> dict:
    ...


print(extract_json_from_text('Sure! {"ok": true} thanks'))`,
        solution: `import json


def extract_json_from_text(text: str) -> dict:
    start = text.find("{")
    end = text.rfind("}")
    if start == -1 or end == -1 or end < start:
        raise ValueError("no json")
    return json.loads(text[start : end + 1])


print(extract_json_from_text('Sure! {"ok": true} thanks'))`,
        hints: ['rfind `}` then slice inclusive end+1', 'json.loads on the slice'],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // LESSON 5: HTTP Requests
  // ─────────────────────────────────────────────────────────────
  {
    id: 'py-http-requests',
    moduleId: 'ai-engineering',
    phaseId: 'ai-python',
    phaseNumber: 0,
    order: 5,
    title: 'HTTP Requests with httpx',
    description: 'Call external APIs, handle errors, and implement retry logic — the fundamentals of integrating AI services into your applications.',
    duration: '35 min',
    difficulty: 'beginner',
    objectives: [
      'Make synchronous and async HTTP requests with httpx',
      'Handle API errors, timeouts, and rate limiting',
      'Implement exponential backoff retry logic',
      'Use session reuse with httpx.Client for performance',
    ],
    content: [
      {
        type: 'text',
        markdown: `## Why httpx?

The \`requests\` library is the classic choice, but \`httpx\` is the modern standard because it has the same clean API but also supports async (which you need for concurrent LLM calls). The LLM SDKs like \`openai\` and \`anthropic\` use \`httpx\` internally.`,
      },
      {
        type: 'code',
        language: 'python',
        filename: 'http_basics.py',
        code: `import httpx
import json

# ── Synchronous requests ──────────────────────────────────────

# Basic GET
response = httpx.get("https://api.openai.com/v1/models")
print(response.status_code)   # 401 (no API key yet)
print(response.headers["content-type"])

# GET with headers and params
def list_openai_models(api_key: str) -> list[dict]:
    response = httpx.get(
        "https://api.openai.com/v1/models",
        headers={"Authorization": f"Bearer {api_key}"},
    )
    response.raise_for_status()   # raises HTTPStatusError for 4xx/5xx
    return response.json()["data"]


# POST — how you actually call LLM APIs at the raw level
def raw_chat_completion(api_key: str, prompt: str) -> str:
    response = httpx.post(
        "https://api.openai.com/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
        json={
            "model": "gpt-4o-mini",
            "messages": [{"role": "user", "content": prompt}],
            "max_tokens": 256,
        },
        timeout=30.0,  # always set a timeout
    )
    response.raise_for_status()
    return response.json()["choices"][0]["message"]["content"]


# ── Using a Client (reuses connections — better for multiple requests) ──
with httpx.Client(
    base_url="https://api.openai.com",
    headers={"Authorization": f"Bearer sk-..."},
    timeout=30.0,
) as client:
    resp = client.get("/v1/models")
    resp.raise_for_status()
    models = resp.json()`,
      },
      {
        type: 'text',
        markdown: `## Error Handling and Retry Logic

LLM APIs fail. Rate limits, timeouts, server errors — you will hit all of them in production. Good error handling is non-negotiable.`,
      },
      {
        type: 'code',
        language: 'python',
        filename: 'error_handling.py',
        code: `import httpx
import time
import random
from typing import TypeVar, Callable

T = TypeVar("T")


def with_retry(
    func: Callable[[], T],
    max_retries: int = 3,
    base_delay: float = 1.0,
) -> T:
    """
    Execute a function with exponential backoff retry.
    
    Retries on: rate limit (429), server errors (5xx), timeout, network errors.
    Fails immediately on: auth errors (401, 403), bad requests (400, 422).
    """
    for attempt in range(max_retries + 1):
        try:
            return func()

        except httpx.HTTPStatusError as e:
            status = e.response.status_code
            if status in (401, 403, 422):
                raise   # Don't retry auth/validation errors
            if status == 429:
                retry_after = float(e.response.headers.get("retry-after", base_delay))
                print(f"Rate limited. Waiting {retry_after}s...")
                time.sleep(retry_after)
            elif attempt < max_retries:
                delay = base_delay * (2 ** attempt) + random.uniform(0, 0.5)
                print(f"Server error {status}. Retry {attempt + 1}/{max_retries} in {delay:.1f}s")
                time.sleep(delay)
            else:
                raise

        except (httpx.TimeoutException, httpx.NetworkError) as e:
            if attempt < max_retries:
                delay = base_delay * (2 ** attempt)
                print(f"Network error: {e}. Retry {attempt + 1}/{max_retries} in {delay:.1f}s")
                time.sleep(delay)
            else:
                raise

    raise RuntimeError("Unreachable")


# Usage
def get_completion(prompt: str, client: httpx.Client) -> str:
    def _call():
        resp = client.post("/v1/chat/completions", json={...})
        resp.raise_for_status()
        return resp.json()["choices"][0]["message"]["content"]

    return with_retry(_call, max_retries=3)`,
        explanation: 'The exponential backoff with jitter (random.uniform) is the industry standard. Without jitter, all retrying clients hit the server at the same time after an outage, causing a thundering herd problem.',
      },
      {
        type: 'callout',
        tone: 'production',
        title: 'Use the official SDKs, not raw httpx',
        content: 'In real projects, use openai.OpenAI() or anthropic.Anthropic() instead of raw httpx calls. The SDKs handle auth, retries, timeouts, and streaming for you. The point of this lesson is to understand what the SDKs do under the hood — which helps you debug them when they fail.',
      },
      {
        type: 'exercise',
        title: 'Which HTTP statuses should retry?',
        description:
          'Implement `should_retry_status(code: int) -> bool`: return True for 408, 429, and any 5xx (500–599); False for 401, 403, 404, 422, and 2xx/3xx. This is the decision half of a retry policy (before sleeps and caps).',
        language: 'python',
        starterCode: `def should_retry_status(code: int) -> bool:
    ...


for c in [200, 429, 500, 503, 401, 422]:
    print(c, should_retry_status(c))`,
        solution: `def should_retry_status(code: int) -> bool:
    if code == 408 or code == 429:
        return True
    return 500 <= code <= 599


for c in [200, 429, 500, 503, 401, 422]:
    print(c, should_retry_status(c))`,
        hints: ['Use chained comparisons for 5xx', 'Explicit 408 and 429'],
      },
      {
        type: 'exercise',
        title: 'Exponential backoff delay',
        description:
          'Implement `backoff_seconds(attempt_zero_indexed: int, base: float = 1.0) -> float` returning `base * (2 ** attempt)` (no random jitter here). Used after failed HTTP calls before sleeping.',
        language: 'python',
        starterCode: `def backoff_seconds(attempt_zero_indexed: int, base: float = 1.0) -> float:
    ...


print([backoff_seconds(i) for i in range(4)])`,
        solution: `def backoff_seconds(attempt_zero_indexed: int, base: float = 1.0) -> float:
    return base * (2**attempt_zero_indexed)


print([backoff_seconds(i) for i in range(4)])`,
        hints: ['Attempt 0 → base, attempt 1 → 2*base, ...'],
      },
      {
        type: 'exercise',
        title: 'Build chat-completions JSON body',
        description:
          'Write `chat_completion_body(model: str, user_message: str, max_tokens: int = 256) -> dict` returning the dict you would pass to `httpx.post(..., json=...)`: keys `model`, `messages` (list with one user message dict), `max_tokens`.',
        language: 'python',
        starterCode: `def chat_completion_body(model: str, user_message: str, max_tokens: int = 256) -> dict:
    ...


import json
print(json.dumps(chat_completion_body("gpt-4o-mini", "Hello"), indent=2))`,
        solution: `def chat_completion_body(model: str, user_message: str, max_tokens: int = 256) -> dict:
    return {
        "model": model,
        "messages": [{"role": "user", "content": user_message}],
        "max_tokens": max_tokens,
    }


import json
print(json.dumps(chat_completion_body("gpt-4o-mini", "Hello"), indent=2))`,
        hints: ['messages is a list of dicts with role and content', 'Include max_tokens at top level'],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // LESSON 6: Async Python
  // ─────────────────────────────────────────────────────────────
  {
    id: 'py-async',
    moduleId: 'ai-engineering',
    phaseId: 'ai-python',
    phaseNumber: 0,
    order: 6,
    title: 'Async Python for AI Applications',
    description: 'async/await, asyncio.gather, and concurrent LLM calls — the pattern that makes your AI applications 10x faster when calling multiple models.',
    duration: '40 min',
    difficulty: 'intermediate',
    objectives: [
      'Write and call async functions with await',
      'Run multiple LLM calls concurrently with asyncio.gather',
      'Understand when to use async vs sync',
      'Handle errors in async code',
    ],
    content: [
      {
        type: 'text',
        markdown: `## Why Async Matters for AI Engineering

LLM API calls are slow — 1 to 10 seconds each. If you need to process 100 documents, running them sequentially takes 100–1000 seconds. Running them concurrently with \`asyncio.gather\` can reduce that to 5–10 seconds.

Async Python is also the foundation of FastAPI (the most popular Python web framework for AI backends) and the streaming patterns for LLM responses.`,
      },
      {
        type: 'code',
        language: 'python',
        filename: 'async_basics.py',
        code: `import asyncio
import time


# A regular synchronous function
def sync_greet(name: str) -> str:
    time.sleep(1)  # Simulates a slow API call
    return f"Hello, {name}!"


# The same function as async
async def async_greet(name: str) -> str:
    await asyncio.sleep(1)  # Non-blocking sleep — releases control
    return f"Hello, {name}!"


# ── Running async functions ────────────────────────────────────

async def main() -> None:
    # Calling an async function requires 'await'
    result = await async_greet("Alice")
    print(result)  # Hello, Alice!


# Entry point for an async script
asyncio.run(main())


# ── Sequential vs Concurrent ──────────────────────────────────

async def slow_operation(task_id: int) -> str:
    print(f"Starting task {task_id}")
    await asyncio.sleep(2)  # Simulate 2-second API call
    print(f"Finished task {task_id}")
    return f"Result from task {task_id}"


async def sequential() -> None:
    start = time.time()
    r1 = await slow_operation(1)  # waits 2s
    r2 = await slow_operation(2)  # waits 2s (after r1 done)
    r3 = await slow_operation(3)  # waits 2s (after r2 done)
    print(f"Sequential: {time.time() - start:.1f}s")  # ~6 seconds


async def concurrent() -> None:
    start = time.time()
    results = await asyncio.gather(
        slow_operation(1),
        slow_operation(2),
        slow_operation(3),
    )  # All three run at the same time
    print(f"Concurrent: {time.time() - start:.1f}s")  # ~2 seconds
    print(results)  # ['Result from task 1', 'Result from task 2', ...]


asyncio.run(concurrent())`,
        explanation: '`asyncio.gather()` is the single most useful async pattern for AI engineering. It lets you fire off multiple LLM calls simultaneously and wait for all of them to complete.',
      },
      {
        type: 'text',
        markdown: `## Real-World Pattern: Parallel LLM Calls

This is what concurrent LLM processing looks like with the real OpenAI async client.`,
      },
      {
        type: 'code',
        language: 'python',
        filename: 'parallel_llm.py',
        code: `import asyncio
from openai import AsyncOpenAI


async def classify_sentiment(client: AsyncOpenAI, text: str) -> dict:
    """Classify the sentiment of a single text."""
    response = await client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": 'Respond with only a JSON object: {"sentiment": "positive"|"negative"|"neutral", "score": 0.0-1.0}',
            },
            {"role": "user", "content": f"Text: {text}"},
        ],
        max_tokens=50,
    )
    import json
    return json.loads(response.choices[0].message.content)


async def batch_classify(texts: list[str], api_key: str) -> list[dict]:
    """Classify all texts concurrently."""
    client = AsyncOpenAI(api_key=api_key)

    # Run all requests concurrently — HUGE speed improvement
    results = await asyncio.gather(
        *[classify_sentiment(client, text) for text in texts],
        return_exceptions=True,  # don't stop on a single failure
    )

    # Handle individual failures
    processed = []
    for text, result in zip(texts, results):
        if isinstance(result, Exception):
            print(f"Failed for '{text[:30]}...': {result}")
            processed.append({"sentiment": "error", "score": 0.0})
        else:
            processed.append(result)

    return processed


# Usage
texts = [
    "This product is amazing! Highly recommend.",
    "Terrible experience. Would not buy again.",
    "It was okay. Nothing special.",
]

results = asyncio.run(batch_classify(texts, api_key="sk-..."))
for text, result in zip(texts, results):
    print(f"{result['sentiment']:10} {text[:40]}")`,
      },
      {
        type: 'text',
        markdown: `## Rate Limiting Concurrent Requests

Running 1000 requests with \`asyncio.gather\` will hit rate limits immediately. Use a semaphore to limit concurrent requests.`,
      },
      {
        type: 'code',
        language: 'python',
        filename: 'rate_limiting.py',
        code: `import asyncio
from openai import AsyncOpenAI


async def process_with_rate_limit(
    items: list[str],
    process_fn,
    max_concurrent: int = 10,  # max simultaneous requests
) -> list:
    """Process items concurrently but no more than max_concurrent at once."""
    semaphore = asyncio.Semaphore(max_concurrent)

    async def limited_process(item: str):
        async with semaphore:  # blocks when 'max_concurrent' tasks are active
            return await process_fn(item)

    return await asyncio.gather(*[limited_process(item) for item in items])


# This processes 1000 documents with at most 10 concurrent API calls
# asyncio.run(process_with_rate_limit(documents, classify_fn, max_concurrent=10))`,
        explanation: 'The Semaphore pattern is essential for production AI pipelines. Without it, you either hit rate limits or overwhelm the API with too many concurrent requests.',
      },
      {
        type: 'callout',
        tone: 'tip',
        title: 'async/await quick rules',
        content: '1. async functions must be awaited when called. 2. You can only await inside an async function. 3. Use asyncio.run() as the entry point in scripts. 4. Use asyncio.gather() for concurrent calls. 5. If you\'re inside a FastAPI route, it\'s already async — just use await directly.',
      },
      {
        type: 'exercise',
        title: 'Concurrent fake API calls',
        description:
          'Implement `async def fake_fetch(label: str, delay: float) -> str` that awaits `asyncio.sleep(delay)` then returns `f"done:{label}"`. Implement `async def run_all(labels: list[str]) -> list[str]` that runs all `fake_fetch(label, 0.05)` concurrently with `asyncio.gather` and returns results in the same order as `labels`.',
        language: 'python',
        starterCode: `import asyncio


async def fake_fetch(label: str, delay: float) -> str:
    ...


async def run_all(labels: list[str]) -> list[str]:
    ...


print(asyncio.run(run_all(["a", "b", "c"])))`,
        solution: `import asyncio


async def fake_fetch(label: str, delay: float) -> str:
    await asyncio.sleep(delay)
    return f"done:{label}"


async def run_all(labels: list[str]) -> list[str]:
    return await asyncio.gather(*[fake_fetch(l, 0.05) for l in labels])


print(asyncio.run(run_all(["a", "b", "c"])))`,
        hints: ['List comprehension inside gather preserves order of results', 'asyncio.run only at the bottom in scripts'],
      },
      {
        type: 'exercise',
        title: 'gather with return_exceptions',
        description:
          'Given `async def may_fail(x: int) -> int`: await `asyncio.sleep(0.01)`; if `x == 2` raise `ValueError("bad")`; else return `x * 10`. Write `async def safe_gather(xs: list[int]) -> list[int | str]` using `asyncio.gather(..., return_exceptions=True)` mapping exceptions to the string `"error"`.',
        language: 'python',
        starterCode: `import asyncio


async def may_fail(x: int) -> int:
    ...


async def safe_gather(xs: list[int]) -> list[int | str]:
    ...


print(asyncio.run(safe_gather([1, 2, 3])))`,
        solution: `import asyncio


async def may_fail(x: int) -> int:
    await asyncio.sleep(0.01)
    if x == 2:
        raise ValueError("bad")
    return x * 10


async def safe_gather(xs: list[int]) -> list[int | str]:
    results = await asyncio.gather(*[may_fail(x) for x in xs], return_exceptions=True)
    out: list[int | str] = []
    for r in results:
        if isinstance(r, Exception):
            out.append("error")
        else:
            out.append(r)
    return out


print(asyncio.run(safe_gather([1, 2, 3])))`,
        hints: ['After gather, loop with isinstance(r, Exception)', 'Do not re-raise inside safe_gather'],
      },
      {
        type: 'exercise',
        title: 'Semaphore-limited concurrency',
        description:
          'Complete `async def map_limited(items: list[str], limit: int, worker)` where `worker` is an async function taking one str. Use `asyncio.Semaphore(limit)` and an inner async helper so at most `limit` workers run at once. Return `await asyncio.gather(...)` over all items.',
        language: 'python',
        starterCode: `import asyncio


async def map_limited(
    items: list[str],
    limit: int,
    worker,
) -> list:
    sem = asyncio.Semaphore(limit)

    async def run_one(item: str):
        async with sem:
            return await worker(item)

    ...


async def slow_echo(s: str) -> str:
    await asyncio.sleep(0.02)
    return s.upper()


print(asyncio.run(map_limited(["a", "b", "c", "d"], 2, slow_echo)))`,
        solution: `import asyncio


async def map_limited(
    items: list[str],
    limit: int,
    worker,
) -> list:
    sem = asyncio.Semaphore(limit)

    async def run_one(item: str):
        async with sem:
            return await worker(item)

    return await asyncio.gather(*[run_one(i) for i in items])


async def slow_echo(s: str) -> str:
    await asyncio.sleep(0.02)
    return s.upper()


print(asyncio.run(map_limited(["a", "b", "c", "d"], 2, slow_echo)))`,
        hints: ['Define run_one inside map_limited so it closes over sem', 'gather a list of run_one(item) calls'],
      },
    ],
  },
]
