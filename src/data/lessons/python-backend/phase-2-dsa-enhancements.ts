import type { ContentBlock, Lesson } from '@/types/lesson'

const phase2Enhancements: Record<string, string[]> = {
  'py-dsa-complexity': [
    `## Real scenario: choose data structure for API auth checks

You receive 50,000 API keys and must validate each incoming key quickly.

\`\`\`python
valid_keys_list = [f"k{i}" for i in range(50_000)]
valid_keys_set = set(valid_keys_list)

print("k49999" in valid_keys_list)  # O(n) scan
print("k49999" in valid_keys_set)   # O(1) average lookup
\`\`\`

**Expected output:**
\`\`\`
True
True
\`\`\`

Both are True, but runtime growth is very different. For membership-heavy workloads, use a set/dict.`,
    `## Code-reading terms you must know

- **amortized O(1)**: usually constant, occasional expensive resize
- **hot path**: code executed very frequently
- **trade-off**: improving time at the cost of memory (or vice versa)
- **asymptotic growth**: behavior as input size grows`,
  ],
  'py-dsa-linear': [
    `## Real scenario: background job queue

\`\`\`python
from collections import deque

jobs = deque(["send_email", "build_report", "sync_crm"])
jobs.append("cleanup_logs")

while jobs:
    job = jobs.popleft()
    print("processing:", job)
\`\`\`

**Expected output:**
\`\`\`
processing: send_email
processing: build_report
processing: sync_crm
processing: cleanup_logs
\`\`\`

This is FIFO queue behavior and exactly why \`deque\` is preferred over \`list.pop(0)\`.`,
    `## Professional reading checklist

When reading custom stack/queue classes, verify:
1. Which end is push/enqueue vs pop/dequeue
2. Empty-structure behavior (raises? returns sentinel?)
3. Complexity claims actually match implementation`,
  ],
  'py-dsa-hash': [
    `## Real scenario: count error codes from logs

\`\`\`python
from collections import Counter

codes = [500, 404, 500, 200, 404, 500]
counts = Counter(codes)
print(counts[500])
print(counts.most_common(2))
\`\`\`

**Expected output:**
\`\`\`
3
[(500, 3), (404, 2)]
\`\`\`

Hash maps turn repeated counting from awkward loops into clear O(n) logic.`,
    `## Hash-table terms for interviews and reviews

- **collision**: two keys map to same bucket/slot
- **load factor**: occupied/total table slots
- **rehash/resize**: rebuild table when it gets too full
- **hashable**: stable \`__hash__\` + equality behavior`,
  ],
  'py-dsa-trees': [
    `## Real scenario: priority scheduler with heap

\`\`\`python
import heapq

tasks = []
heapq.heappush(tasks, (3, "daily-report"))
heapq.heappush(tasks, (1, "urgent-alert"))
heapq.heappush(tasks, (2, "email-digest"))

while tasks:
    print(heapq.heappop(tasks))
\`\`\`

**Expected output:**
\`\`\`
(1, 'urgent-alert')
(2, 'email-digest')
(3, 'daily-report')
\`\`\`

Smaller priority value pops first because Python heap is a min-heap.`,
    `## Recursion sanity checklist

For every recursive function confirm:
1. clear base case
2. recursive call moves toward base case
3. no repeated expensive branches without memoization
4. max depth risk is understood`,
  ],
  'py-dsa-algorithms': [
    `## Real scenario: longest streak without duplicate events

\`\`\`python
def longest_unique_stream(s: str) -> int:
    last = {}
    left = 0
    best = 0
    for right, ch in enumerate(s):
        if ch in last and last[ch] >= left:
            left = last[ch] + 1
        last[ch] = right
        best = max(best, right - left + 1)
    return best

print(longest_unique_stream("abcaefbb"))
\`\`\`

**Expected output:**
\`\`\`
5
\`\`\`

Window \`"bcaef"\` has length 5 with no repeated characters.`,
    `## Binary search boundary language

- **lower bound**: first index where value is >= target
- **upper bound**: first index where value is > target
- **invariant**: condition that remains true each loop step

In interviews, saying your invariant out loud often matters as much as code.`,
  ],
}

function asTextBlocks(markdowns: string[]): ContentBlock[] {
  return markdowns.map(markdown => ({ type: 'text', markdown }))
}

export function applyPhase2DsaEnhancements(lessons: Lesson[]): Lesson[] {
  return lessons.map(lesson => {
    const markdowns = phase2Enhancements[lesson.id]
    if (!markdowns) return lesson
    return {
      ...lesson,
      content: [...lesson.content, ...asTextBlocks(markdowns)],
    }
  })
}
