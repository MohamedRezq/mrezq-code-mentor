import type { ContentBlock, Lesson } from '@/types/lesson'

const outputWalkthrough: Record<string, string> = {
  'py-getting-started': `## Output walkthrough

\`\`\`python
print("Hello")
print(2 + 3)
\`\`\`

Expected:
\`\`\`
Hello
5
\`\`\``,
  'py-types-and-strings': `## Output walkthrough

\`\`\`python
name = "  alice "
print(name.strip().title())
print(type(42).__name__)
\`\`\`

Expected:
\`\`\`
Alice
int
\`\`\``,
  'py-operators-truthiness': `## Output walkthrough

\`\`\`python
print("" or "fallback")
print(bool([]), bool([1]))
\`\`\`

Expected:
\`\`\`
fallback
False True
\`\`\``,
  'py-control-flow': `## Output walkthrough

\`\`\`python
x = 3
if x > 5:
    print("big")
else:
    print("small")
\`\`\`

Expected:
\`\`\`
small
\`\`\``,
  'py-loops-iterations': `## Output walkthrough

\`\`\`python
for i in range(3):
    print(i)
\`\`\`

Expected:
\`\`\`
0
1
2
\`\`\``,
  'py-functions-deep': `## Output walkthrough

\`\`\`python
def add(a, b):
    return a + b
print(add(2, 4))
\`\`\`

Expected:
\`\`\`
6
\`\`\``,
  'py-modules-stdlib': `## Output walkthrough

\`\`\`python
from pathlib import Path
print(Path("a") / "b")
\`\`\`

Expected (OS-dependent slashes):
\`\`\`
a/b
\`\`\``,
  'py-collections-pro': `## Output walkthrough

\`\`\`python
items = [1, 2, 2, 3]
print(len(set(items)))
print({"x": 1}.get("y", 0))
\`\`\`

Expected:
\`\`\`
3
0
\`\`\``,
  'py-exceptions-files': `## Output walkthrough

\`\`\`python
try:
    int("x")
except ValueError:
    print("bad int")
\`\`\`

Expected:
\`\`\`
bad int
\`\`\``,
  'py-json-datetime': `## Output walkthrough

\`\`\`python
import json
print(json.loads('{"ok": true}')["ok"])
\`\`\`

Expected:
\`\`\`
True
\`\`\``,
  'py-regex': `## Output walkthrough

\`\`\`python
import re
print(re.findall(r"\\d+", "a12b3"))
\`\`\`

Expected:
\`\`\`
['12', '3']
\`\`\``,
  'py-oop-solid': `## Output walkthrough

\`\`\`python
class A:
    def hi(self):
        return "hi"
print(A().hi())
\`\`\`

Expected:
\`\`\`
hi
\`\`\``,
  'py-patterns-advanced': `## Output walkthrough

\`\`\`python
def gen():
    yield 1
    yield 2
print(list(gen()))
\`\`\`

Expected:
\`\`\`
[1, 2]
\`\`\``,
  'py-dsa-complexity': `## Output walkthrough

\`\`\`python
arr = list(range(5))
print(arr[0])
print(sum(arr))
\`\`\`

Expected:
\`\`\`
0
10
\`\`\``,
  'py-dsa-linear': `## Output walkthrough

\`\`\`python
from collections import deque
q = deque([1, 2])
print(q.popleft())
\`\`\`

Expected:
\`\`\`
1
\`\`\``,
  'py-dsa-hash': `## Output walkthrough

\`\`\`python
from collections import Counter
print(Counter("aba")["a"])
\`\`\`

Expected:
\`\`\`
2
\`\`\``,
  'py-dsa-trees': `## Output walkthrough

\`\`\`python
import heapq
h = [2, 1, 3]
heapq.heapify(h)
print(heapq.heappop(h))
\`\`\`

Expected:
\`\`\`
1
\`\`\``,
  'py-dsa-algorithms': `## Output walkthrough

\`\`\`python
arr = [4, 2, 3]
print(sorted(arr))
\`\`\`

Expected:
\`\`\`
[2, 3, 4]
\`\`\``,
}

function asText(markdown: string): ContentBlock {
  return { type: 'text', markdown }
}

export function applyPhase12OutputEnhancements(lessons: Lesson[]): Lesson[] {
  return lessons.map(lesson => {
    const markdown = outputWalkthrough[lesson.id]
    if (!markdown) return lesson
    return {
      ...lesson,
      content: [...lesson.content, asText(markdown)],
    }
  })
}
