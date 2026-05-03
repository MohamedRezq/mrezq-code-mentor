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
        type: 'callout',
        tone: 'info',
        title: 'Full lesson content coming soon',
        content: 'This lesson covers: document loading → chunking strategies (recursive, semantic) → embedding → storage → retrieval → generation → evaluation. Full code walkthrough with a real-world "chat with your codebase" demo.',
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
        type: 'callout',
        tone: 'info',
        title: 'Full lesson content coming soon',
        content: 'Pure vector search misses exact keyword matches. Hybrid search combines the best of both: semantic (vector) + lexical (BM25). Reranking re-scores the top-N results with a more powerful cross-encoder model. This lesson builds the complete hybrid + rerank pipeline.',
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
        type: 'callout',
        tone: 'info',
        title: 'Full lesson content coming soon',
        content: 'Advanced RAG techniques including HyDE, multi-query retrieval, step-back prompting, RAPTOR hierarchical indexing, and GraphRAG. Includes benchmarks comparing each technique on real datasets.',
      },
    ],
  },
]
