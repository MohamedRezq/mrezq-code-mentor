import type { Lesson } from '@/types/lesson'

export const pythonDSALessons: Lesson[] = [
  // ─── Lesson 1: Complexity & Big O ───────────────────────────────────────
  {
    id: 'py-dsa-complexity',
    moduleId: 'python-backend',
    phaseId: 'py-dsa',
    phaseNumber: 2,
    order: 1,
    title: 'Complexity & Big O Notation',
    description: 'Learn to measure algorithm efficiency so you can choose the right data structure and write code that scales — not just code that works on small inputs.',
    duration: '40 min',
    difficulty: 'intermediate',
    objectives: [
      'Understand what Big O notation measures and why it matters',
      'Identify O(1), O(log n), O(n), O(n log n), O(n²) from code patterns',
      'Measure time complexity of Python built-in operations',
      'Understand space complexity and trade-offs',
      'Apply complexity analysis to choose between algorithms',
    ],
    content: [
      {
        type: 'text',
        markdown: `## What Big O Measures

Big O notation describes how an algorithm's runtime (or memory) **grows** as input size n increases. It ignores constants and lower-order terms — it's about the shape of growth, not the exact speed.

| Notation | Name | Example | 1000 inputs |
|----------|------|---------|------------|
| O(1) | Constant | Dict lookup, list append | 1 op |
| O(log n) | Logarithmic | Binary search | ~10 ops |
| O(n) | Linear | Linear scan | 1000 ops |
| O(n log n) | Linearithmic | Merge sort | ~10,000 ops |
| O(n²) | Quadratic | Nested loops | 1,000,000 ops |
| O(2ⁿ) | Exponential | Naive recursion | impossible |`,
      },
      {
        type: 'code',
        language: 'python',
        filename: 'complexity_examples.py',
        code: `# O(1) — constant, regardless of input size
def get_first(items: list) -> any:
    return items[0]          # direct index — always 1 step

def dict_lookup(d: dict, key: str):
    return d.get(key)        # hash → bucket → O(1) average

# O(n) — grows linearly
def find_max(nums: list[int]) -> int:
    maximum = nums[0]
    for n in nums:           # visits every element once
        if n > maximum:
            maximum = n
    return maximum

# O(n²) — nested loops over the same data
def has_duplicate_naive(nums: list[int]) -> bool:
    for i in range(len(nums)):
        for j in range(i + 1, len(nums)):   # inner loop = O(n)
            if nums[i] == nums[j]:
                return True
    return False

# O(n) — use a set for O(1) lookup
def has_duplicate_fast(nums: list[int]) -> bool:
    seen = set()
    for n in nums:           # one loop, O(1) set lookup
        if n in seen:
            return True
        seen.add(n)
    return False

# O(log n) — binary search halves the search space each step
def binary_search(sorted_list: list[int], target: int) -> int:
    low, high = 0, len(sorted_list) - 1
    while low <= high:
        mid = (low + high) // 2
        if sorted_list[mid] == target:
            return mid
        elif sorted_list[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1

# Python built-in operation complexities
my_list = list(range(10_000))
my_set = set(my_list)
my_dict = {i: i for i in my_list}

# O(n) — must scan entire list
print(9999 in my_list)   # slow for large lists

# O(1) — hash-based lookup
print(9999 in my_set)    # instant
print(9999 in my_dict)   # instant`,
      },
      {
        type: 'text',
        markdown: `## Python Built-in Operation Complexity

**Lists:**
| Operation | Complexity | Notes |
|-----------|-----------|-------|
| \`list[i]\` | O(1) | Direct index |
| \`list.append()\` | O(1) amortized | Occasional resize |
| \`list.insert(0, x)\` | O(n) | Shifts all elements |
| \`x in list\` | O(n) | Linear scan |
| \`list.sort()\` | O(n log n) | Timsort |

**Dicts & Sets:**
| Operation | Complexity |
|-----------|-----------|
| \`d[key]\` | O(1) average |
| \`key in d\` | O(1) average |
| \`d.keys()\` | O(1) |
| Iteration | O(n) |`,
      },
      {
        type: 'callout',
        tone: 'production',
        title: 'The Real Performance Test',
        content: 'Big O is theory — always benchmark critical paths with `timeit` or `cProfile`. Python has high constant factors so O(n) Python code can be slower than O(n²) C code for small n. Profile before optimising.',
      },
      {
        type: 'exercise',
        title: 'Two Sum',
        description: 'Given a list of integers and a target sum, find all unique pairs that add to the target. First write the O(n²) brute force, then optimise to O(n) using a set. Both should return the same result.',
        language: 'python',
        starterCode: `def two_sum_brute(nums: list[int], target: int) -> list[tuple[int, int]]:
    """O(n²) — check all pairs."""
    pass

def two_sum_fast(nums: list[int], target: int) -> list[tuple[int, int]]:
    """O(n) — use a set."""
    pass

nums = [2, 7, 11, 15, -2, 4, 1]
print(two_sum_brute(nums, 9))  # [(2,7), (11,-2)]
print(two_sum_fast(nums, 9))   # same result`,
        solution: `def two_sum_brute(nums: list[int], target: int) -> list[tuple[int, int]]:
    results = []
    for i in range(len(nums)):
        for j in range(i + 1, len(nums)):
            if nums[i] + nums[j] == target:
                pair = (min(nums[i], nums[j]), max(nums[i], nums[j]))
                if pair not in results:
                    results.append(pair)
    return results

def two_sum_fast(nums: list[int], target: int) -> list[tuple[int, int]]:
    seen = set()
    results = set()
    for n in nums:
        complement = target - n
        if complement in seen:
            pair = (min(n, complement), max(n, complement))
            results.add(pair)
        seen.add(n)
    return list(results)`,
        hints: ['For O(n): for each number, check if (target - number) is already in a set', 'Use min/max to normalise the pair so (2,7) and (7,2) are the same', 'Track seen numbers as you go — add to set after checking'],
      },
    ],
  },

  // ─── Lesson 2: Linear Data Structures ───────────────────────────────────
  {
    id: 'py-dsa-linear',
    moduleId: 'python-backend',
    phaseId: 'py-dsa',
    phaseNumber: 2,
    order: 2,
    title: 'Arrays, Linked Lists, Stacks & Queues',
    description: 'Implement the foundational linear data structures in Python and learn when each is the right tool — with real scenarios from backend systems.',
    duration: '50 min',
    difficulty: 'intermediate',
    objectives: [
      'Understand how arrays and Python lists differ in memory layout',
      'Implement a singly linked list with insert, delete, and reversal',
      'Build a stack (LIFO) and use it to solve bracket matching',
      'Build a queue (FIFO) and understand deque for O(1) both ends',
      'Recognise which structure fits each real-world problem',
    ],
    content: [
      {
        type: 'text',
        markdown: `## Arrays vs Python Lists

A true **array** stores elements in contiguous memory — every element is the same size, so index access is O(1) by simple arithmetic. Python's \`list\` is a **dynamic array of pointers** — it stores references (8 bytes each) to objects anywhere in memory. This means:

- Index access: O(1) ✓
- Append: O(1) amortised (doubles when full)
- Insert at beginning: O(n) — shifts all pointers ✗

For true arrays (numeric, fixed type), use \`array\` module or \`numpy.ndarray\`.`,
      },
      {
        type: 'code',
        language: 'python',
        filename: 'linked_list.py',
        code: `from __future__ import annotations
from typing import Optional, Iterator

class Node:
    __slots__ = ("value", "next")  # memory optimisation — no __dict__

    def __init__(self, value: int) -> None:
        self.value = value
        self.next: Optional[Node] = None

class LinkedList:
    """Singly linked list — O(1) prepend, O(n) search."""

    def __init__(self) -> None:
        self.head: Optional[Node] = None
        self._size = 0

    def prepend(self, value: int) -> None:
        """Add to front — O(1)."""
        node = Node(value)
        node.next = self.head
        self.head = node
        self._size += 1

    def append(self, value: int) -> None:
        """Add to end — O(n) without a tail pointer."""
        node = Node(value)
        if self.head is None:
            self.head = node
        else:
            current = self.head
            while current.next:
                current = current.next
            current.next = node
        self._size += 1

    def delete(self, value: int) -> bool:
        """Remove first node with this value — O(n)."""
        if self.head is None:
            return False
        if self.head.value == value:
            self.head = self.head.next
            self._size -= 1
            return True
        current = self.head
        while current.next:
            if current.next.value == value:
                current.next = current.next.next
                self._size -= 1
                return True
            current = current.next
        return False

    def reverse(self) -> None:
        """Reverse in-place — O(n), O(1) space."""
        prev = None
        current = self.head
        while current:
            nxt = current.next
            current.next = prev
            prev = current
            current = nxt
        self.head = prev

    def __iter__(self) -> Iterator[int]:
        current = self.head
        while current:
            yield current.value
            current = current.next

    def __len__(self) -> int:
        return self._size

    def __repr__(self) -> str:
        return " → ".join(str(v) for v in self) + " → None"

ll = LinkedList()
for v in [1, 2, 3, 4, 5]:
    ll.append(v)
print(ll)       # 1 → 2 → 3 → 4 → 5 → None
ll.reverse()
print(ll)       # 5 → 4 → 3 → 2 → 1 → None`,
      },
      {
        type: 'code',
        language: 'python',
        filename: 'stack_queue.py',
        code: `from collections import deque
from typing import TypeVar, Generic, Optional

T = TypeVar("T")

# ── Stack (LIFO) ──────────────────────────────────────
class Stack(Generic[T]):
    """Last In, First Out. Built on a list — O(1) push/pop."""

    def __init__(self) -> None:
        self._data: list[T] = []

    def push(self, item: T) -> None:
        self._data.append(item)

    def pop(self) -> T:
        if self.is_empty():
            raise IndexError("Stack is empty")
        return self._data.pop()

    def peek(self) -> T:
        if self.is_empty():
            raise IndexError("Stack is empty")
        return self._data[-1]

    def is_empty(self) -> bool:
        return len(self._data) == 0

    def __len__(self) -> int:
        return len(self._data)

# Classic stack problem: balanced brackets
def is_balanced(text: str) -> bool:
    pairs = {")": "(", "]": "[", "}": "{"}
    stack: Stack[str] = Stack()
    for char in text:
        if char in "([{":
            stack.push(char)
        elif char in ")]}":
            if stack.is_empty() or stack.pop() != pairs[char]:
                return False
    return stack.is_empty()

print(is_balanced("({[]})"))   # True
print(is_balanced("([)]"))     # False

# ── Queue (FIFO) ──────────────────────────────────────
class Queue(Generic[T]):
    """First In, First Out. Built on deque — O(1) enqueue/dequeue."""

    def __init__(self) -> None:
        self._data: deque[T] = deque()

    def enqueue(self, item: T) -> None:
        self._data.append(item)        # add to right

    def dequeue(self) -> T:
        if self.is_empty():
            raise IndexError("Queue is empty")
        return self._data.popleft()    # remove from left — O(1)

    def peek(self) -> T:
        return self._data[0]

    def is_empty(self) -> bool:
        return len(self._data) == 0

# Real use: task queue simulation
task_queue: Queue[str] = Queue()
task_queue.enqueue("send_welcome_email")
task_queue.enqueue("generate_report")
task_queue.enqueue("cleanup_temp_files")

while not task_queue.is_empty():
    task = task_queue.dequeue()
    print(f"Processing: {task}")`,
      },
      {
        type: 'exercise',
        title: 'Browser History',
        description: 'Implement a `BrowserHistory` class that simulates browser navigation. `visit(url)` adds a page, `back(steps)` goes back up to `steps` pages (can\'t go before start), `forward(steps)` goes forward, and `current()` returns the current URL. Must run in O(1) per operation.',
        language: 'python',
        starterCode: `class BrowserHistory:
    def __init__(self, homepage: str):
        pass

    def visit(self, url: str) -> None:
        """Visit url. Clears forward history."""
        pass

    def back(self, steps: int) -> str:
        """Go back up to 'steps' pages. Return current URL."""
        pass

    def forward(self, steps: int) -> str:
        """Go forward up to 'steps' pages. Return current URL."""
        pass

    def current(self) -> str:
        pass`,
        solution: `class BrowserHistory:
    def __init__(self, homepage: str):
        self._history = [homepage]
        self._index = 0

    def visit(self, url: str) -> None:
        self._history = self._history[:self._index + 1]
        self._history.append(url)
        self._index += 1

    def back(self, steps: int) -> str:
        self._index = max(0, self._index - steps)
        return self._history[self._index]

    def forward(self, steps: int) -> str:
        self._index = min(len(self._history) - 1, self._index + steps)
        return self._history[self._index]

    def current(self) -> str:
        return self._history[self._index]`,
        hints: ['Use a list and an index pointer', 'visit() should truncate forward history (slice to current + 1)', 'back/forward just clamp the index with max/min'],
      },
    ],
  },

  // ─── Lesson 3: Hash Tables ───────────────────────────────────────────────
  {
    id: 'py-dsa-hash',
    moduleId: 'python-backend',
    phaseId: 'py-dsa',
    phaseNumber: 2,
    order: 3,
    title: 'Hash Tables & Dictionaries',
    description: 'Understand how hash tables achieve O(1) lookup, how Python dicts work internally, common hash-based problem patterns, and when to reach for Counter, defaultdict, or OrderedDict.',
    duration: '40 min',
    difficulty: 'intermediate',
    objectives: [
      'Explain how a hash table maps keys to buckets using a hash function',
      'Understand collision handling (chaining vs open addressing)',
      'Know what makes a good hash (hashable types in Python)',
      'Solve frequency-counting and grouping problems with dicts',
      'Use Counter, defaultdict, and OrderedDict from collections',
    ],
    content: [
      {
        type: 'text',
        markdown: `## How Hash Tables Work

A hash table stores key-value pairs using a **hash function** to turn any key into an array index.

\`\`\`
hash("name") → 7362841 % table_size → index 42
table[42] = ("name", "Alice")
\`\`\`

**Collisions** occur when two keys map to the same index. Python dicts use **open addressing with probing** — on collision, it finds the next available slot. The table resizes when load factor exceeds ~2/3.

**Requirements for hashable keys:** must implement \`__hash__\` AND \`__eq__\`, AND the hash must not change while the object is in the dict. This is why mutable objects (lists, dicts, sets) cannot be dict keys.`,
      },
      {
        type: 'code',
        language: 'python',
        filename: 'hash_patterns.py',
        code: `from collections import defaultdict, Counter, OrderedDict

# ── Frequency counting ──────────────────────────────
words = "the quick brown fox jumps over the lazy dog the".split()

# Manual
freq: dict[str, int] = {}
for word in words:
    freq[word] = freq.get(word, 0) + 1

# Pythonic — Counter does this and more
counter = Counter(words)
print(counter.most_common(3))   # [('the', 3), ('quick', 1), ...]
print(counter["the"])           # 3
print(counter["missing"])       # 0 — no KeyError!

# Counter arithmetic
a = Counter(["a", "b", "a", "c"])
b = Counter(["a", "b", "d"])
print(a + b)   # combine counts
print(a - b)   # subtract (drops zero/negative)
print(a & b)   # minimum of each
print(a | b)   # maximum of each

# ── Grouping with defaultdict ───────────────────────
employees = [
    {"name": "Alice", "dept": "Engineering"},
    {"name": "Bob",   "dept": "Marketing"},
    {"name": "Carol", "dept": "Engineering"},
    {"name": "Dave",  "dept": "Marketing"},
    {"name": "Eve",   "dept": "Engineering"},
]

by_dept: defaultdict[str, list[str]] = defaultdict(list)
for emp in employees:
    by_dept[emp["dept"]].append(emp["name"])

# {"Engineering": ["Alice", "Carol", "Eve"], "Marketing": ["Bob", "Dave"]}

# ── Caching / deduplication ─────────────────────────
def deduplicate_preserving_order(items: list) -> list:
    """Remove duplicates while keeping first occurrence."""
    seen = {}
    return [seen.setdefault(x, x) for x in items if x not in seen]

print(deduplicate_preserving_order([3, 1, 4, 1, 5, 9, 2, 6, 5, 3]))
# [3, 1, 4, 5, 9, 2, 6]

# ── Hashable custom objects ─────────────────────────
from dataclasses import dataclass

@dataclass(frozen=True)   # frozen → hashable
class Point:
    x: float
    y: float

distances: dict[Point, float] = {}
origin = Point(0, 0)
distances[origin] = 0.0   # works because Point is frozen (hashable)`,
      },
      {
        type: 'code',
        language: 'python',
        filename: 'hash_problems.py',
        code: `# Problem: group anagrams together
# "eat" and "tea" and "ate" are anagrams — same sorted letters
def group_anagrams(words: list[str]) -> list[list[str]]:
    groups: defaultdict[str, list[str]] = defaultdict(list)
    for word in words:
        key = "".join(sorted(word))   # canonical form
        groups[key].append(word)
    return list(groups.values())

from collections import defaultdict
print(group_anagrams(["eat","tea","tan","ate","nat","bat"]))
# [["eat","tea","ate"], ["tan","nat"], ["bat"]]

# Problem: first non-repeating character
def first_unique(s: str) -> str:
    counts = Counter(s)
    for char in s:
        if counts[char] == 1:
            return char
    return ""

from collections import Counter
print(first_unique("leetcode"))   # "l"

# Problem: subarray with target sum (prefix sums + hash map)
def subarray_sum_count(nums: list[int], target: int) -> int:
    """Count subarrays whose elements sum to target — O(n)."""
    prefix_sums: dict[int, int] = defaultdict(int)
    prefix_sums[0] = 1   # empty subarray has sum 0
    count = 0
    running = 0
    for n in nums:
        running += n
        # If (running - target) was seen before, a subarray summing to target exists
        count += prefix_sums[running - target]
        prefix_sums[running] += 1
    return count

print(subarray_sum_count([1, 1, 1], 2))   # 2  ([1,1] appears twice)`,
      },
      {
        type: 'exercise',
        title: 'LRU Cache',
        description: 'Implement an LRU (Least Recently Used) cache with O(1) get and put. `get(key)` returns the value or -1. `put(key, value)` inserts or updates; if at capacity, evicts the least recently used entry.',
        language: 'python',
        starterCode: `class LRUCache:
    def __init__(self, capacity: int):
        pass

    def get(self, key: int) -> int:
        """Return value or -1 if not found. Marks as recently used."""
        pass

    def put(self, key: int, value: int) -> None:
        """Insert or update. Evicts LRU if at capacity."""
        pass

cache = LRUCache(2)
cache.put(1, 1)
cache.put(2, 2)
print(cache.get(1))    # 1 (marks 1 as recently used)
cache.put(3, 3)        # evicts key 2 (LRU)
print(cache.get(2))    # -1 (was evicted)`,
        solution: `from collections import OrderedDict

class LRUCache:
    def __init__(self, capacity: int):
        self.capacity = capacity
        self.cache: OrderedDict[int, int] = OrderedDict()

    def get(self, key: int) -> int:
        if key not in self.cache:
            return -1
        self.cache.move_to_end(key)   # mark as recently used
        return self.cache[key]

    def put(self, key: int, value: int) -> None:
        if key in self.cache:
            self.cache.move_to_end(key)
        self.cache[key] = value
        if len(self.cache) > self.capacity:
            self.cache.popitem(last=False)   # evict LRU (first/oldest)`,
        hints: ['OrderedDict maintains insertion order AND supports move_to_end()', 'move_to_end(key) makes that key the most recently used', 'popitem(last=False) removes the oldest item'],
      },
    ],
  },

  // ─── Lesson 4: Trees & Recursion ────────────────────────────────────────
  {
    id: 'py-dsa-trees',
    moduleId: 'python-backend',
    phaseId: 'py-dsa',
    phaseNumber: 2,
    order: 4,
    title: 'Trees, Heaps & Recursion',
    description: 'Build and traverse binary search trees, use Python\'s heapq for priority queues, and master recursion with proper base cases and memoization to avoid exponential blow-up.',
    duration: '55 min',
    difficulty: 'intermediate',
    objectives: [
      'Implement a Binary Search Tree with insert, search, and traversals',
      'Understand in-order, pre-order, post-order, and level-order traversals',
      'Use heapq for min-heap priority queues',
      'Write recursive solutions with clear base cases',
      'Optimise recursion with memoization to avoid redundant computation',
    ],
    content: [
      {
        type: 'code',
        language: 'python',
        filename: 'bst.py',
        code: `from __future__ import annotations
from typing import Optional, Iterator
from collections import deque

class TreeNode:
    __slots__ = ("value", "left", "right")

    def __init__(self, value: int) -> None:
        self.value = value
        self.left: Optional[TreeNode] = None
        self.right: Optional[TreeNode] = None

class BST:
    """Binary Search Tree — O(log n) avg, O(n) worst (unbalanced)."""

    def __init__(self) -> None:
        self.root: Optional[TreeNode] = None

    def insert(self, value: int) -> None:
        self.root = self._insert(self.root, value)

    def _insert(self, node: Optional[TreeNode], value: int) -> TreeNode:
        if node is None:
            return TreeNode(value)
        if value < node.value:
            node.left = self._insert(node.left, value)
        elif value > node.value:
            node.right = self._insert(node.right, value)
        return node   # equal values ignored (set semantics)

    def search(self, value: int) -> bool:
        node = self.root
        while node:
            if value == node.value:
                return True
            node = node.left if value < node.value else node.right
        return False

    # ── Traversals ──────────────────────────────────
    def inorder(self) -> list[int]:
        """Left → Root → Right. Produces sorted output for BST."""
        result: list[int] = []
        def traverse(node: Optional[TreeNode]) -> None:
            if node:
                traverse(node.left)
                result.append(node.value)
                traverse(node.right)
        traverse(self.root)
        return result

    def level_order(self) -> list[list[int]]:
        """BFS — level by level."""
        if not self.root:
            return []
        result, queue = [], deque([self.root])
        while queue:
            level = []
            for _ in range(len(queue)):
                node = queue.popleft()
                level.append(node.value)
                if node.left:  queue.append(node.left)
                if node.right: queue.append(node.right)
            result.append(level)
        return result

bst = BST()
for v in [5, 3, 7, 1, 4, 6, 8]:
    bst.insert(v)
print(bst.inorder())      # [1, 3, 4, 5, 6, 7, 8]
print(bst.level_order())  # [[5], [3, 7], [1, 4, 6, 8]]`,
      },
      {
        type: 'code',
        language: 'python',
        filename: 'heap_recursion.py',
        code: `import heapq

# Python heapq — min-heap (smallest value at top)
nums = [3, 1, 4, 1, 5, 9, 2, 6]
heapq.heapify(nums)         # in-place O(n)
print(heapq.heappop(nums))  # 1 — smallest
print(heapq.heappop(nums))  # 1
heapq.heappush(nums, 0)     # insert

# Max-heap: negate all values
max_heap = [-x for x in [3, 1, 4, 1, 5]]
heapq.heapify(max_heap)
largest = -heapq.heappop(max_heap)   # 5

# K largest / K smallest
data = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5]
print(heapq.nlargest(3, data))    # [9, 6, 5]
print(heapq.nsmallest(3, data))   # [1, 1, 2]

# Priority queue with tuples (priority, value)
tasks: list[tuple[int, str]] = []
heapq.heappush(tasks, (3, "low priority"))
heapq.heappush(tasks, (1, "urgent"))
heapq.heappush(tasks, (2, "normal"))
print(heapq.heappop(tasks))  # (1, "urgent")

# ── Recursion ───────────────────────────────────────
# Always needs: base case + recursive case moving toward base

def factorial(n: int) -> int:
    if n <= 1:          # base case
        return 1
    return n * factorial(n - 1)   # recursive case

# Fibonacci — naive O(2ⁿ)
def fib_naive(n: int) -> int:
    if n < 2:
        return n
    return fib_naive(n-1) + fib_naive(n-2)

# Fibonacci — memoized O(n)
from functools import lru_cache

@lru_cache(maxsize=None)
def fib(n: int) -> int:
    if n < 2:
        return n
    return fib(n-1) + fib(n-2)

print(fib(50))   # instant — 12586269025

# Tree max depth — elegant recursion
def max_depth(node) -> int:
    if node is None:
        return 0
    return 1 + max(max_depth(node.left), max_depth(node.right))`,
      },
      {
        type: 'exercise',
        title: 'K Closest Points',
        description: 'Given a list of `(x, y)` points, return the `k` closest to the origin. Use a max-heap of size k to do it in O(n log k) time instead of sorting everything O(n log n).',
        language: 'python',
        starterCode: `import heapq

def k_closest(points: list[tuple[int, int]], k: int) -> list[tuple[int, int]]:
    """Return k points closest to origin (0,0). O(n log k)."""
    pass

points = [(1, 3), (-2, 2), (5, 8), (0, 1)]
print(k_closest(points, 2))  # [(0,1), (-2,2)] or similar`,
        solution: `import heapq

def k_closest(points: list[tuple[int, int]], k: int) -> list[tuple[int, int]]:
    # Use a max-heap of size k (negate distance for max-heap)
    heap: list[tuple[float, tuple[int, int]]] = []
    for x, y in points:
        dist = x*x + y*y
        heapq.heappush(heap, (-dist, (x, y)))
        if len(heap) > k:
            heapq.heappop(heap)   # remove the farthest
    return [point for _, point in heap]`,
        hints: ['Use negative distance to turn min-heap into max-heap', 'Maintain heap of size k — evict the largest (farthest) when it exceeds k', 'No need to take square root — comparing squared distances is equivalent'],
      },
    ],
  },

  // ─── Lesson 5: Sorting & Searching ──────────────────────────────────────
  {
    id: 'py-dsa-algorithms',
    moduleId: 'python-backend',
    phaseId: 'py-dsa',
    phaseNumber: 2,
    order: 5,
    title: 'Sorting, Searching & Sliding Window',
    description: 'Understand how Timsort works and when to implement your own sort. Master binary search variants, and learn the sliding window and two-pointer techniques that appear in almost every technical interview.',
    duration: '50 min',
    difficulty: 'intermediate',
    objectives: [
      'Understand merge sort and quick sort with their time/space trade-offs',
      'Know when Python\'s built-in sort is always the right choice',
      'Implement binary search and its common variants (left/right boundary)',
      'Apply the sliding window pattern to string and array problems',
      'Use two pointers for sorted array problems',
    ],
    content: [
      {
        type: 'code',
        language: 'python',
        filename: 'sorting.py',
        code: `# Python's sort uses Timsort — O(n log n) worst, O(n) best (nearly sorted)
# Always prefer sorted() or list.sort() over implementing your own

data = [3, 1, 4, 1, 5, 9, 2, 6]
print(sorted(data))                         # new list, original unchanged
data.sort()                                 # in-place

# Sort by key function
users = [{"name": "Bob", "age": 25}, {"name": "Alice", "age": 30}]
users.sort(key=lambda u: u["age"])          # by age ascending
users.sort(key=lambda u: u["name"])         # by name
users.sort(key=lambda u: (-u["age"], u["name"]))  # age desc, name asc

# ── Merge Sort — O(n log n) time, O(n) space ──
def merge_sort(arr: list[int]) -> list[int]:
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    return merge(left, right)

def merge(left: list[int], right: list[int]) -> list[int]:
    result, i, j = [], 0, 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i]); i += 1
        else:
            result.append(right[j]); j += 1
    return result + left[i:] + right[j:]

# ── Binary Search ───────────────────────────────────
def binary_search(arr: list[int], target: int) -> int:
    lo, hi = 0, len(arr) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if arr[mid] == target:   return mid
        elif arr[mid] < target:  lo = mid + 1
        else:                    hi = mid - 1
    return -1

# Left boundary — first index where arr[i] >= target
def lower_bound(arr: list[int], target: int) -> int:
    lo, hi = 0, len(arr)
    while lo < hi:
        mid = (lo + hi) // 2
        if arr[mid] < target:
            lo = mid + 1
        else:
            hi = mid
    return lo

# Use bisect for binary search (stdlib)
import bisect
arr = [1, 3, 4, 4, 7, 9]
print(bisect.bisect_left(arr, 4))   # 2 — leftmost position for 4
print(bisect.bisect_right(arr, 4))  # 4 — rightmost position`,
      },
      {
        type: 'code',
        language: 'python',
        filename: 'sliding_window.py',
        code: `# ── Sliding Window ─────────────────────────────────
# Fixed window: move a window of size k across the array
def max_sum_subarray(nums: list[int], k: int) -> int:
    """Max sum of any k consecutive elements — O(n)."""
    window_sum = sum(nums[:k])
    max_sum = window_sum
    for i in range(k, len(nums)):
        window_sum += nums[i] - nums[i - k]   # slide: add right, remove left
        max_sum = max(max_sum, window_sum)
    return max_sum

# Variable window: expand right, shrink left when condition breaks
def longest_substring_no_repeat(s: str) -> int:
    """Length of longest substring without repeating characters — O(n)."""
    char_index: dict[str, int] = {}
    max_len = left = 0
    for right, char in enumerate(s):
        if char in char_index and char_index[char] >= left:
            left = char_index[char] + 1   # shrink window
        char_index[char] = right
        max_len = max(max_len, right - left + 1)
    return max_len

print(longest_substring_no_repeat("abcabcbb"))  # 3 ("abc")
print(longest_substring_no_repeat("pwwkew"))    # 3 ("wke")

# ── Two Pointers ────────────────────────────────────
def pair_sum_sorted(nums: list[int], target: int) -> tuple[int, int] | None:
    """Find pair summing to target in sorted array — O(n)."""
    left, right = 0, len(nums) - 1
    while left < right:
        total = nums[left] + nums[right]
        if total == target:
            return (nums[left], nums[right])
        elif total < target:
            left += 1
        else:
            right -= 1
    return None

def remove_duplicates_sorted(nums: list[int]) -> int:
    """Remove duplicates in-place, return new length — O(n) O(1) space."""
    if not nums: return 0
    write = 1
    for read in range(1, len(nums)):
        if nums[read] != nums[read - 1]:
            nums[write] = nums[read]
            write += 1
    return write`,
      },
      {
        type: 'exercise',
        title: 'Minimum Window Substring',
        description: 'Given strings `s` and `t`, find the minimum window in `s` that contains all characters of `t` (including duplicates). Return "" if no such window exists. Must run in O(n).',
        language: 'python',
        starterCode: `from collections import Counter

def min_window(s: str, t: str) -> str:
    """Find shortest substring of s containing all chars of t."""
    pass

print(min_window("ADOBECODEBANC", "ABC"))  # "BANC"
print(min_window("a", "a"))               # "a"
print(min_window("a", "aa"))              # ""`,
        solution: `from collections import Counter

def min_window(s: str, t: str) -> str:
    need = Counter(t)
    missing = len(t)         # how many chars still needed
    best = ""
    left = 0

    for right, char in enumerate(s):
        if need[char] > 0:
            missing -= 1
        need[char] -= 1

        if missing == 0:     # window has all chars
            while need[s[left]] < 0:    # shrink from left
                need[s[left]] += 1
                left += 1
            window = s[left:right + 1]
            if not best or len(window) < len(best):
                best = window
            need[s[left]] += 1          # expand window again
            missing += 1
            left += 1

    return best`,
        hints: ['Use Counter for "need" and track how many chars are still missing', 'When missing == 0, shrink the window from the left', 'Only update best answer when you have a valid window'],
      },
    ],
  },
]
