import type { Lesson } from '@/types/lesson'

export const ragLessons: Lesson[] = [
  {
    id: 'rag-embeddings',
    moduleId: 'ai-engineering',
    phaseId: 'ai-rag',
    phaseNumber: 2,
    order: 14,
    title: 'Embeddings: Turning Text into Numbers',
    description: 'Understand vector embeddings conceptually and practically — how text becomes a point in space, cosine similarity, and why embeddings are the foundation of semantic search and RAG.',
    duration: '25 min',
    difficulty: 'intermediate',
    objectives: [
      'Explain what an embedding is and why it enables semantic search',
      'Generate embeddings with OpenAI and open-source models',
      'Compute cosine similarity between text pairs',
      'Choose the right embedding model for your use case',
    ],
    content: [
      {
        type: 'text',
        markdown: `## What is an Embedding?

An embedding is a list of numbers (a vector) that represents the meaning of a piece of text. Similar texts get similar vectors. This is what enables semantic search — finding documents by meaning, not keywords.

**Example:** "How do I install Python?" and "What are the steps to set up Python?" are very different strings but nearly identical in meaning. An embedding model assigns them vectors that are close together in space. A keyword search would miss this connection.`,
      },
      {
        type: 'code',
        language: 'python',
        filename: 'embeddings_basics.py',
        code: `from openai import OpenAI
import numpy as np

client = OpenAI()


def get_embedding(text: str, model: str = "text-embedding-3-small") -> list[float]:
    """Get an embedding vector for a piece of text."""
    response = client.embeddings.create(input=text, model=model)
    return response.data[0].embedding


def cosine_similarity(v1: list[float], v2: list[float]) -> float:
    """Compute how similar two vectors are. Returns -1 to 1 (1 = identical)."""
    a, b = np.array(v1), np.array(v2)
    return float(np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b)))


# Demonstrate semantic similarity
texts = [
    "How do I install Python?",
    "Steps to set up Python on my computer",
    "What is the capital of France?",
]

embeddings = [get_embedding(t) for t in texts]

# "install Python" vs "set up Python" — should be HIGH similarity
sim_1_2 = cosine_similarity(embeddings[0], embeddings[1])
# "install Python" vs "capital of France" — should be LOW similarity
sim_1_3 = cosine_similarity(embeddings[0], embeddings[2])

print(f"'install Python' vs 'set up Python': {sim_1_2:.3f}")  # ~0.93
print(f"'install Python' vs 'France capital': {sim_1_3:.3f}")  # ~0.12


# Semantic search in a small dataset
def semantic_search(query: str, documents: list[str], top_k: int = 3) -> list[dict]:
    query_embedding = get_embedding(query)
    doc_embeddings = [get_embedding(doc) for doc in documents]

    results = [
        {
            "document": doc,
            "score": cosine_similarity(query_embedding, emb),
        }
        for doc, emb in zip(documents, doc_embeddings)
    ]
    return sorted(results, key=lambda x: x["score"], reverse=True)[:top_k]`,
      },
      {
        type: 'callout',
        tone: 'info',
        title: 'Embedding Models',
        content: 'OpenAI text-embedding-3-small (1536 dimensions, cheap, fast) is a good default. For open-source/local: BAAI/bge-small-en-v1.5 or nomic-embed-text are excellent. The embedding model choice affects retrieval quality significantly — always benchmark with your specific data.',
      },
    ],
  },
  {
    id: 'rag-vector-databases',
    moduleId: 'ai-engineering',
    phaseId: 'ai-rag',
    phaseNumber: 2,
    order: 15,
    title: 'Vector Databases',
    description: 'Store, index, and query millions of embeddings efficiently with Chroma (local) and Pinecone (production). Includes CRUD operations, metadata filtering, and namespace management.',
    duration: '30 min',
    difficulty: 'intermediate',
    objectives: [
      'Set up Chroma for local development',
      'Perform CRUD operations on a vector collection',
      'Filter by metadata alongside semantic search',
      'Connect to Pinecone for production-scale deployments',
    ],
    content: [
      {
        type: 'text',
        markdown: `## What is a Vector Database?

A vector database is built specifically to store and query embedding vectors at scale. The key operation is **Approximate Nearest Neighbor (ANN) search** — given a query vector, find the N most similar vectors in milliseconds, even across millions of documents.

Regular databases (PostgreSQL, MongoDB) can store vectors but struggle at scale. Purpose-built vector DBs (Chroma, Pinecone, Weaviate, Qdrant) use specialized indexing algorithms (HNSW, IVF) to make this fast.`,
      },
      {
        type: 'code',
        language: 'python',
        filename: 'chroma_basics.py',
        code: `# pip install chromadb openai
import chromadb
from openai import OpenAI

# Local Chroma (persists to disk)
client_chroma = chromadb.PersistentClient(path="./chroma_db")
openai_client = OpenAI()


def get_embedding(text: str) -> list[float]:
    return openai_client.embeddings.create(
        input=text, model="text-embedding-3-small"
    ).data[0].embedding


# Create or get a collection
collection = client_chroma.get_or_create_collection(
    name="documentation",
    metadata={"hnsw:space": "cosine"}  # use cosine similarity
)

# Add documents with embeddings
documents = [
    "Python is a high-level, interpreted programming language.",
    "RAG combines retrieval with generation for better factual accuracy.",
    "Docker containers package apps and their dependencies together.",
    "Kubernetes orchestrates containerized applications at scale.",
    "Transformers use self-attention to process sequences in parallel.",
]

collection.add(
    ids=[f"doc_{i}" for i in range(len(documents))],
    embeddings=[get_embedding(doc) for doc in documents],
    documents=documents,
    metadatas=[
        {"topic": "python", "source": "intro.md"},
        {"topic": "ai", "source": "rag_guide.md"},
        {"topic": "devops", "source": "docker.md"},
        {"topic": "devops", "source": "k8s.md"},
        {"topic": "ai", "source": "transformers.md"},
    ],
)

# Query — semantic search
results = collection.query(
    query_embeddings=[get_embedding("How do containers work?")],
    n_results=2,
)
for doc, score in zip(results["documents"][0], results["distances"][0]):
    print(f"[{1-score:.3f}] {doc[:60]}...")  # convert distance to similarity

# Query with metadata filter (only AI docs)
ai_results = collection.query(
    query_embeddings=[get_embedding("machine learning models")],
    n_results=2,
    where={"topic": "ai"},  # metadata filter
)`,
      },
    ],
  },
  {
    id: 'rag-pipeline',
    moduleId: 'ai-engineering',
    phaseId: 'ai-rag',
    phaseNumber: 2,
    order: 16,
    title: 'Building a Complete RAG Pipeline',
    description: 'Combine document loading, chunking, embedding, storage, retrieval, and generation into a production-ready RAG system. The pattern behind every AI knowledge base.',
    duration: '40 min',
    difficulty: 'intermediate',
    objectives: [
      'Implement document chunking strategies',
      'Build an end-to-end ingest pipeline',
      'Implement retrieval with source citations',
      'Evaluate RAG quality with basic metrics',
    ],
    content: [
      {
        type: 'text',
        markdown: `## RAG Pipeline Architecture

A production RAG system has two separate flows:

1. **Ingestion pipeline (offline or scheduled)**
   - Load docs from sources (Markdown, PDFs, Notion, DB)
   - Clean + normalize text
   - Chunk into retrievable pieces
   - Embed chunks
   - Store vectors + metadata

2. **Query pipeline (online, per user request)**
   - Rewrite/normalize query (optional)
   - Embed query
   - Retrieve top-k chunks
   - Build grounded prompt with citations
   - Generate answer
   - Return answer + sources

Keep these pipelines independent. Most teams fail by mixing ingestion and retrieval logic in one script.`,
      },
      {
        type: 'callout',
        tone: 'important',
        title: 'Chunking Is the Highest-Leverage RAG Decision',
        content:
          'If chunking is bad, retrieval fails no matter how good your LLM is. Start with 300-800 token chunks and 10-20% overlap, then tune using retrieval metrics and real user questions.',
      },
      {
        type: 'code',
        language: 'python',
        filename: 'rag_pipeline.py',
        code: `from pathlib import Path
from openai import OpenAI
import chromadb

# The complete RAG pipeline in outline form:
# 1. Load documents
# 2. Chunk into pieces (~512 tokens, 10% overlap)
# 3. Embed each chunk
# 4. Store in vector DB with metadata
# 5. At query time: embed query, retrieve top-k chunks
# 6. Build prompt with retrieved context
# 7. Generate answer with LLM
# 8. Return answer + source citations

def chunk_text(text: str, chunk_size: int = 512, overlap: int = 50) -> list[str]:
    words = text.split()
    chunks = []
    for i in range(0, len(words), chunk_size - overlap):
        chunk = " ".join(words[i:i + chunk_size])
        if chunk:
            chunks.append(chunk)
    return chunks


def build_rag_prompt(query: str, retrieved_chunks: list[dict]) -> str:
    context = "\\n\\n".join(
        f"[Source {i+1}: {chunk['source']}]\\n{chunk['content']}"
        for i, chunk in enumerate(retrieved_chunks)
    )
    return f"""Answer the question using ONLY the provided context.
If the answer is not in the context, say "I don't have information about this."

Context:
{context}

Question: {query}

Answer:"""`,
      },
      {
        type: 'code',
        language: 'python',
        filename: 'rag_full_pipeline.py',
        code: `from dataclasses import dataclass
from pathlib import Path
from typing import Any

import chromadb
from openai import OpenAI

client = OpenAI()
vector_db = chromadb.PersistentClient(path="./rag_store")
collection = vector_db.get_or_create_collection(
    name="knowledge_base",
    metadata={"hnsw:space": "cosine"},
)


@dataclass
class Chunk:
    id: str
    text: str
    source: str
    chunk_index: int


def load_markdown_docs(directory: str) -> list[tuple[str, str]]:
    docs: list[tuple[str, str]] = []
    for path in Path(directory).glob("*.md"):
        docs.append((path.name, path.read_text(encoding="utf-8")))
    return docs


def chunk_text(text: str, chunk_size: int = 450, overlap: int = 60) -> list[str]:
    words = text.split()
    chunks: list[str] = []
    step = max(1, chunk_size - overlap)
    for i in range(0, len(words), step):
        chunk = " ".join(words[i : i + chunk_size]).strip()
        if len(chunk) > 40:
            chunks.append(chunk)
    return chunks


def embed(text: str) -> list[float]:
    return client.embeddings.create(
        model="text-embedding-3-small",
        input=text,
    ).data[0].embedding


def ingest(directory: str) -> int:
    docs = load_markdown_docs(directory)
    all_chunks: list[Chunk] = []
    for source, text in docs:
        for idx, chunk in enumerate(chunk_text(text)):
            all_chunks.append(
                Chunk(
                    id=f"{source}:{idx}",
                    text=chunk,
                    source=source,
                    chunk_index=idx,
                )
            )

    if not all_chunks:
        return 0

    collection.upsert(
        ids=[c.id for c in all_chunks],
        documents=[c.text for c in all_chunks],
        embeddings=[embed(c.text) for c in all_chunks],
        metadatas=[
            {"source": c.source, "chunk_index": c.chunk_index}
            for c in all_chunks
        ],
    )
    return len(all_chunks)


def retrieve(query: str, top_k: int = 4) -> list[dict[str, Any]]:
    result = collection.query(
        query_embeddings=[embed(query)],
        n_results=top_k,
    )
    matches = []
    for doc, metadata, distance in zip(
        result["documents"][0],
        result["metadatas"][0],
        result["distances"][0],
    ):
        matches.append(
            {
                "content": doc,
                "source": metadata["source"],
                "score": round(1 - float(distance), 4),
            }
        )
    return matches


def answer_query(query: str) -> dict[str, Any]:
    retrieved = retrieve(query, top_k=4)
    context = "\\n\\n".join(
        f"[{i+1}] ({chunk['source']}) {chunk['content']}"
        for i, chunk in enumerate(retrieved)
    )
    prompt = f"""You are a factual assistant.
Use only the provided context. If missing, say you do not know.

Context:
{context}

Question: {query}

Return a concise answer followed by cited sources like [1], [2].
"""
    completion = client.chat.completions.create(
        model="gpt-4o-mini",
        temperature=0,
        messages=[{"role": "user", "content": prompt}],
    )
    answer = completion.choices[0].message.content or ""
    return {"answer": answer, "sources": retrieved}


if __name__ == "__main__":
    inserted = ingest("./docs")
    print(f"Ingested {inserted} chunks")
    response = answer_query("How do we deploy this system?")
    print(response["answer"])
    print("Sources:", [s["source"] for s in response["sources"]])`,
        explanation:
          'This is the minimal production shape: independent ingest/retrieve, metadata preservation for citations, deterministic generation (temperature 0), and explicit source return.',
      },
      {
        type: 'text',
        markdown: `## Basic RAG Evaluation Loop

Evaluate RAG with a small golden dataset:

- **Retrieval hit@k**: does at least one retrieved chunk contain the answer?
- **Context precision**: how many retrieved chunks are actually relevant?
- **Faithfulness**: does the answer stay grounded in provided context?
- **Citation correctness**: do cited sources support the claim?

Start with 20-50 realistic questions from your domain. Manual review is fine initially.`,
      },
      {
        type: 'exercise',
        title: 'Build "Chat with Docs" End-to-End',
        description:
          'Implement a full local RAG app for Markdown docs. Requirements: ingestion command, query command, source citation in every answer, metadata filter by source, and a fallback response when evidence is insufficient. Add 10 golden questions and report hit@3.',
        language: 'python',
        starterCode: `# TODO 1: Create ingest.py to read docs/*.md and index chunks
# TODO 2: Create query.py that retrieves top_k chunks and generates answer
# TODO 3: Include source citations in output
# TODO 4: Add --source-filter cli flag
# TODO 5: Evaluate hit@3 on 10 gold Q/A pairs`,
        solution: `# Expected implementation checklist:
# - ingest.py: load -> chunk -> embed -> upsert
# - query.py: embed query -> retrieve -> prompt -> answer + citations
# - eval.py: iterate 10 questions, check if reference doc appears in top 3
#
# Example metric output:
# hit@3: 8/10 (80%)
# citation_precision: 0.72
# avg_latency_ms: 640
#
# Next tuning actions:
# 1) Increase chunk overlap from 60 -> 90
# 2) Add query rewrite for abbreviations
# 3) Raise retrieval top_k from 4 -> 6 before final prompt selection`,
        hints: [
          'Keep ingestion and query scripts separate',
          'Store source + chunk index as metadata so citations are stable',
          'Use deterministic generation settings for evaluation consistency',
        ],
      },
    ],
  },
  {
    id: 'rag-hybrid-search',
    moduleId: 'ai-engineering',
    phaseId: 'ai-rag',
    phaseNumber: 2,
    order: 17,
    title: 'Hybrid Search & Reranking',
    description: 'Combine vector search with BM25 keyword search and add a reranker — the techniques that make production RAG 30%+ more accurate than pure vector search.',
    duration: '30 min',
    difficulty: 'advanced',
    objectives: [
      'Implement BM25 keyword search alongside vector search',
      'Merge results with Reciprocal Rank Fusion (RRF)',
      'Add a cross-encoder reranker (Cohere Rerank)',
      'Benchmark hybrid vs pure vector search',
    ],
    content: [
      {
        type: 'text',
        markdown: `## Why Pure Vector Search Is Not Enough

Vector retrieval is strong for semantic similarity, but weak for:

- exact identifiers (\`ERR_CONN_RESET\`, \`RFC-9110\`, \`v1.2.3\`)
- rare terms and proper nouns
- short acronym-heavy queries

Hybrid search fixes this by combining:
- **Lexical search (BM25)** for exact and sparse matches
- **Vector search** for semantic meaning
- **Reranker** to reorder final candidates using full query-document interaction`,
      },
      {
        type: 'code',
        language: 'python',
        filename: 'hybrid_rrf.py',
        code: `from rank_bm25 import BM25Okapi
import numpy as np
from openai import OpenAI

client = OpenAI()

documents = [
    "FastAPI supports async request handlers and automatic OpenAPI docs.",
    "Django REST Framework provides serializers, viewsets, and routers.",
    "Error ERR_CONN_RESET is often caused by proxy or TLS mismatch.",
    "Use pgvector extension to store embeddings in PostgreSQL.",
    "BM25 is a lexical ranking algorithm for keyword search.",
]

tokenized = [doc.lower().split() for doc in documents]
bm25 = BM25Okapi(tokenized)


def embed(text: str) -> list[float]:
    return client.embeddings.create(
        model="text-embedding-3-small",
        input=text,
    ).data[0].embedding


doc_vecs = [np.array(embed(d)) for d in documents]


def vector_search(query: str, top_k: int = 5) -> list[int]:
    q = np.array(embed(query))
    sims = [float(np.dot(q, d) / (np.linalg.norm(q) * np.linalg.norm(d))) for d in doc_vecs]
    return sorted(range(len(documents)), key=lambda i: sims[i], reverse=True)[:top_k]


def bm25_search(query: str, top_k: int = 5) -> list[int]:
    scores = bm25.get_scores(query.lower().split())
    return sorted(range(len(documents)), key=lambda i: scores[i], reverse=True)[:top_k]


def rrf_merge(rankings: list[list[int]], k: int = 60) -> list[int]:
    # Reciprocal Rank Fusion
    scores: dict[int, float] = {}
    for ranking in rankings:
        for rank, doc_idx in enumerate(ranking, start=1):
            scores[doc_idx] = scores.get(doc_idx, 0.0) + 1.0 / (k + rank)
    return sorted(scores, key=lambda idx: scores[idx], reverse=True)


query = "How to fix ERR_CONN_RESET in api gateway?"
v_rank = vector_search(query, top_k=5)
b_rank = bm25_search(query, top_k=5)
hybrid = rrf_merge([v_rank, b_rank])

print("Vector top:", [documents[i] for i in v_rank[:3]])
print("BM25 top:", [documents[i] for i in b_rank[:3]])
print("Hybrid top:", [documents[i] for i in hybrid[:3]])`,
        explanation:
          'RRF is robust and simple: you do not need score normalization between retrieval systems, only ranking positions.',
      },
      {
        type: 'code',
        language: 'python',
        filename: 'rerank_with_cohere.py',
        code: `# pip install cohere
import cohere

co = cohere.ClientV2()  # uses COHERE_API_KEY from env


def rerank(query: str, candidates: list[str], top_n: int = 3) -> list[dict]:
    response = co.rerank(
        model="rerank-v3.5",
        query=query,
        documents=candidates,
        top_n=top_n,
    )
    out = []
    for item in response.results:
        out.append(
            {
                "index": item.index,
                "score": float(item.relevance_score),
                "document": candidates[item.index],
            }
        )
    return out


# Typically: candidates = hybrid_top_20, then rerank to top_5 for prompt context`,
        explanation:
          'Reranking is expensive, so apply it only to a narrowed candidate set (for example top 20 from hybrid retrieval).',
      },
      {
        type: 'callout',
        tone: 'production',
        title: 'Recommended Retrieval Stack',
        content:
          'Start with vector top-30 + BM25 top-30 -> RRF merge -> rerank top-20 -> send top-5 to the LLM. This pattern is common in high-quality support and search assistants.',
      },
      {
        type: 'exercise',
        title: 'Hybrid Search Benchmark',
        description:
          'Create a 30-query benchmark (mix semantic and exact keyword queries). Compare three systems: vector-only, BM25-only, hybrid+RRF(+rerank optional). Report hit@5 and MRR. Summarize where each method wins.',
        language: 'python',
        starterCode: `# Prepare:
# queries = [{"q": "...", "relevant_doc_ids": [...]}, ...]
#
# TODO:
# 1) Implement evaluate(system_fn, queries) -> metrics
# 2) Run vector / bm25 / hybrid
# 3) Print hit@5 and MRR table
# 4) Analyze failure modes`,
        solution: `# Expected result format:
# vector_only: hit@5=0.73, mrr=0.51
# bm25_only:   hit@5=0.69, mrr=0.48
# hybrid_rrf:  hit@5=0.84, mrr=0.62
#
# Failure analysis examples:
# - vector misses exact error codes
# - BM25 misses paraphrased questions
# - hybrid still fails when docs are outdated`,
        hints: [
          'Include acronym-heavy and identifier-heavy queries',
          'MRR (Mean Reciprocal Rank) rewards putting the correct result earlier',
          'Evaluate before adding reranker, then after',
        ],
      },
    ],
  },
  {
    id: 'rag-advanced',
    moduleId: 'ai-engineering',
    phaseId: 'ai-rag',
    phaseNumber: 2,
    order: 18,
    title: 'Advanced RAG: HyDE, Agentic Retrieval & GraphRAG',
    description: 'Beyond basic RAG — hypothetical document embeddings, query rewriting, iterative retrieval, and graph-enhanced RAG for complex multi-hop questions.',
    duration: '35 min',
    difficulty: 'advanced',
    objectives: [
      'Implement HyDE (Hypothetical Document Embeddings) for better retrieval',
      'Use query rewriting to improve retrieval quality',
      'Build iterative/agentic retrieval that self-corrects',
      'Understand GraphRAG for entity-relationship queries',
    ],
    content: [
      {
        type: 'text',
        markdown: `## When Basic RAG Breaks

Basic top-k retrieval often fails on:
- sparse or ambiguous user queries
- multi-hop questions requiring multiple evidence pieces
- entity relationship questions across documents
- missing vocabulary alignment between query and corpus

Advanced RAG adds query transformation, retrieval strategies, and reasoning structure to recover from these failures.`,
      },
      {
        type: 'code',
        language: 'python',
        filename: 'hyde_retrieval.py',
        code: `from openai import OpenAI

client = OpenAI()


def generate_hypothetical_doc(query: str) -> str:
    prompt = f"""Write a concise, factual passage that would directly answer this question.
Question: {query}
Passage:"""
    res = client.chat.completions.create(
        model="gpt-4o-mini",
        temperature=0.2,
        messages=[{"role": "user", "content": prompt}],
    )
    return res.choices[0].message.content or ""


def hyde_query_embedding(query: str) -> list[float]:
    hypothetical_answer = generate_hypothetical_doc(query)
    # embed the hypothetical answer instead of raw query
    return client.embeddings.create(
        model="text-embedding-3-small",
        input=hypothetical_answer,
    ).data[0].embedding


# HyDE often improves retrieval for short/underspecified queries`,
      },
      {
        type: 'code',
        language: 'python',
        filename: 'multi_query_retrieval.py',
        code: `from openai import OpenAI

client = OpenAI()


def generate_query_variants(query: str, n: int = 4) -> list[str]:
    prompt = f"""Generate {n} alternative search queries for this question.
Keep them short and diverse.
Question: {query}
Return one query per line."""
    res = client.chat.completions.create(
        model="gpt-4o-mini",
        temperature=0.3,
        messages=[{"role": "user", "content": prompt}],
    )
    lines = [line.strip("- ").strip() for line in (res.choices[0].message.content or "").splitlines()]
    return [q for q in lines if q]


def retrieve_multi_query(query: str, retrieve_fn) -> list[dict]:
    variants = [query] + generate_query_variants(query)
    pooled: dict[str, dict] = {}
    for q in variants:
        for result in retrieve_fn(q, top_k=5):
            key = result["id"]
            prev = pooled.get(key)
            if not prev or result["score"] > prev["score"]:
                pooled[key] = result
    return sorted(pooled.values(), key=lambda x: x["score"], reverse=True)[:8]`,
        explanation:
          'Multi-query retrieval increases recall by searching different phrasings of the same intent, then deduplicating and ranking.',
      },
      {
        type: 'text',
        markdown: `## GraphRAG Concept (High Level)

GraphRAG builds a graph of entities and relationships from your corpus:
- entities: companies, people, services, products
- edges: "owns", "depends_on", "deployed_to", "reports_to"

For multi-hop questions ("Which service owned by Team X depends on a deprecated DB?"), graph traversal can outperform pure vector retrieval.

A practical path:
1. Start with standard RAG.
2. Add metadata filtering and query rewriting.
3. Introduce a lightweight knowledge graph only for relationship-heavy domains.`,
      },
      {
        type: 'callout',
        tone: 'warning',
        title: 'Do Not Over-Engineer Early',
        content:
          'Advanced methods help only when baseline retrieval is already clean and measured. First fix chunking, metadata quality, and eval coverage. Then add HyDE/multi-query/graph methods with A/B metrics.',
      },
      {
        type: 'exercise',
        title: 'Advanced Retrieval A/B Test',
        description:
          'Implement four retrieval strategies over the same corpus and compare on a 40-question set: (A) baseline vector, (B) vector+HyDE, (C) vector+multi-query, (D) hybrid+multi-query+rerank. Record hit@5, MRR, latency, and token cost. Pick one production default and justify it.',
        language: 'python',
        starterCode: `strategies = {
    "baseline": baseline_retrieve,
    "hyde": hyde_retrieve,
    "multi_query": multi_query_retrieve,
    "hybrid_plus": hybrid_plus_retrieve,
}

# TODO:
# 1) run each strategy on eval set
# 2) compute quality + latency + cost
# 3) choose default strategy with rationale`,
        solution: `# Example decision outcome:
# baseline:     hit@5=0.68, mrr=0.45, latency=220ms, cost=$
# hyde:         hit@5=0.76, mrr=0.53, latency=390ms, cost=$$
# multi_query:  hit@5=0.81, mrr=0.57, latency=520ms, cost=$$$
# hybrid_plus:  hit@5=0.86, mrr=0.63, latency=740ms, cost=$$$$
#
# Production default might be:
# - use hyde for interactive UX where latency matters
# - use hybrid_plus for high-stakes internal analyst workflows`,
        hints: [
          'Track both quality and operational cost',
          'Use the same evaluation set for every strategy',
          'A slower strategy is acceptable if business value is higher',
        ],
      },
    ],
  },
]
