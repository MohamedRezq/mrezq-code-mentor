import type { ContentBlock, Lesson } from '@/types/lesson'

const phase2BeginnerBlocks: Record<string, string[]> = {
  'py-dsa-complexity': [
    `## Beginner TL;DR

Big O tells how runtime grows when input grows.
- O(1): constant
- O(n): linear
- O(n²): nested loops`,
    `## Quick reference: complexity patterns

\`\`\`python
def constant(arr):
    return arr[0]               # O(1)

def linear(arr):
    s = 0
    for x in arr:               # O(n)
        s += x
    return s

def quadratic(arr):
    c = 0
    for i in arr:
        for j in arr:           # O(n²)
            c += i * j
    return c
\`\`\``,
  ],
  'py-dsa-linear': [
    `## Beginner TL;DR

- Stack = LIFO (last in, first out)
- Queue = FIFO (first in, first out)
- Linked list nodes point to next node`,
    `## Quick reference: stack and queue operations

\`\`\`python
from collections import deque

# stack via list
stack = []
stack.append("A")
stack.append("B")
print(stack.pop())      # B

# queue via deque
q = deque()
q.append("A")
q.append("B")
print(q.popleft())      # A
\`\`\``,
  ],
  'py-dsa-hash': [
    `## Beginner TL;DR

Dictionary/set use hashing, so lookups are usually very fast (O(1) average).`,
    `## Quick reference: dict + Counter + defaultdict

\`\`\`python
from collections import Counter, defaultdict

d = {"a": 1}
d["b"] = 2
print(d.get("c", 0))           # 0

counts = Counter("banana")
print(counts["a"])             # 3

groups = defaultdict(list)
groups["eng"].append("alice")
print(groups["eng"])           # ['alice']
\`\`\``,
  ],
  'py-dsa-trees': [
    `## Beginner TL;DR

Tree = nodes connected parent/child.
Heap = priority queue where smallest item is at top (Python min-heap).`,
    `## Quick reference: heap and recursion

\`\`\`python
import heapq

h = [5, 1, 3]
heapq.heapify(h)
print(heapq.heappop(h))        # 1

def factorial(n: int) -> int:
    if n <= 1:
        return 1
    return n * factorial(n - 1)

print(factorial(5))            # 120
\`\`\``,
  ],
  'py-dsa-algorithms': [
    `## Beginner TL;DR

- Use built-in sort first (\`sorted\`, \`list.sort\`)
- Binary search only on sorted arrays
- Sliding window avoids re-scanning`,
    `## Quick reference: sort/search/window

\`\`\`python
arr = [4, 1, 3, 2]
print(sorted(arr))             # [1, 2, 3, 4]

def binary_search(a, target):
    lo, hi = 0, len(a) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if a[mid] == target:
            return mid
        if a[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1

print(binary_search([1, 3, 5, 7], 5))  # 2
\`\`\``,
  ],
}

function toTextBlocks(markdowns: string[]): ContentBlock[] {
  return markdowns.map(markdown => ({ type: 'text', markdown }))
}

export function applyPhase2BeginnerEnhancements(lessons: Lesson[]): Lesson[] {
  return lessons.map(lesson => {
    const markdowns = phase2BeginnerBlocks[lesson.id]
    if (!markdowns) return lesson
    return {
      ...lesson,
      content: [...toTextBlocks(markdowns), ...lesson.content],
    }
  })
}
