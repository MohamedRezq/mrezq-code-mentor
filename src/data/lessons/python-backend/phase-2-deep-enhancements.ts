import type { ContentBlock, Lesson } from '@/types/lesson'

// ─── PHASE 2 DSA DEEP ENHANCEMENTS ───────────────────────────────────────────
// Adds to every lesson:
//   · Terminology + pronunciation table
//   · Complete data structure API with ALL outputs
//   · Junior mistakes + fix table
//   · Code-reading guide
//   · Production scenario
// ─────────────────────────────────────────────────────────────────────────────

const deep2Blocks: Record<string, string[]> = {
  // ── Lesson 1: Complexity ─────────────────────────────────────────────────
  'py-dsa-complexity': [
    `## Terminology you must be able to spell and say

| Term | Pronunciation | Meaning |
|---|---|---|
| Big O notation | big-OH | Upper bound on how an algorithm's runtime grows with input size |
| Time complexity | — | How runtime scales with input size |
| Space complexity | — | How memory usage scales with input size |
| O(1) | oh-one | Constant time — does not depend on input size |
| O(log n) | oh-log-n | Logarithmic — halves the problem each step |
| O(n) | oh-n | Linear — proportional to input size |
| O(n log n) | oh-n-log-n | Linearithmic — e.g. merge sort |
| O(n²) | oh-n-squared | Quadratic — nested loops |
| O(2ⁿ) | oh-two-to-the-n | Exponential — avoid in production |
| Amortised | AM-or-tyzed | Average cost per operation over many operations |
| Worst case | — | Largest possible runtime for any input of size n |
| Average case | — | Expected runtime for random inputs |`,

    `## Full reference: Python operation complexities

\`\`\`python
# ── list ──────────────────────────────────────────────────────
lst = [1, 2, 3, 4, 5]
lst[i]            # O(1)  — index access
lst[-1]           # O(1)  — last element
lst.append(x)     # O(1)  amortised — sometimes triggers resize
lst.pop()         # O(1)  — remove last
lst.pop(0)        # O(n)  — removes first; shifts all elements left
lst.insert(0, x)  # O(n)  — inserts at front; shifts all right
lst.insert(i, x)  # O(n)  — inserts at i; shifts from i onward
x in lst          # O(n)  — linear scan
lst.remove(x)     # O(n)  — scans then shifts
lst.index(x)      # O(n)  — linear scan
len(lst)          # O(1)  — stored as attribute
lst.sort()        # O(n log n)  — Timsort
lst.copy()        # O(n)
lst[a:b]          # O(b-a) — slice of length b-a

# ── dict ──────────────────────────────────────────────────────
d[key]            # O(1)  average (hash lookup)
d[key] = val      # O(1)  average
del d[key]        # O(1)  average
key in d          # O(1)  average — MUCH faster than list
len(d)            # O(1)

# ── set ───────────────────────────────────────────────────────
x in s            # O(1)  average
s.add(x)          # O(1)  average
s.remove(x)       # O(1)  average
s | t             # O(len(s) + len(t))  union
s & t             # O(min(len(s), len(t)))  intersection
s - t             # O(len(s))  difference

# ── deque ─────────────────────────────────────────────────────
from collections import deque
dq = deque()
dq.append(x)      # O(1)
dq.appendleft(x)  # O(1)   ← this is what makes deque better than list for queues
dq.pop()          # O(1)
dq.popleft()      # O(1)   ← list.pop(0) is O(n); deque.popleft() is O(1)
\`\`\``,

    `## Real scenario: membership check — list vs set

\`\`\`python
# Feature: check if a user's email is in an allowlist
# allowlist = 100,000 emails

# ❌ SLOW: O(n) per check
allowlist = [...]   # list of 100,000 emails
for request in requests:
    if request.email in allowlist:   # O(100,000) each time
        grant_access()

# ✅ FAST: O(1) per check
allowlist = set(...)   # convert to set once: O(n)
for request in requests:
    if request.email in allowlist:   # O(1) each time
        grant_access()

# With 1,000,000 requests:
# List:  1,000,000 × 100,000 = 10^11 operations
# Set:   1,000,000 × 1       = 10^6  operations — 100,000× faster
\`\`\``,

    `## Junior mistakes + fix

| Mistake | What happens | Fix |
|---|---|---|
| \`x in list\` for large membership checks | O(n) — slows the whole app | Convert to \`set\` for O(1) checks |
| Nested loops on same list | O(n²) — fails at 10,000+ items | Look for O(n log n) sorting + binary search approach |
| Use \`list.pop(0)\` as a queue | O(n) per pop | Use \`collections.deque\` for O(1) popleft |
| Ignore space complexity | Memory exhausted on large inputs | Count both time AND space when designing |
| Call \`len()\` thinking it's O(n) | Incorrect assumption — it's O(1) in Python | \`len()\` is O(1) for built-in types |`,
  ],

  // ── Lesson 2: Linear Data Structures ─────────────────────────────────────
  'py-dsa-linear': [
    `## Terminology

| Term | Pronunciation | Meaning |
|---|---|---|
| Array | uh-RAY | Fixed-size, contiguous memory block (Python: \`array\` module or numpy) |
| Dynamic array | dy-NAM-ik | Resizable array (Python list is this) |
| Linked list | LINKED list | Nodes connected by pointers; no random access |
| Stack | stak | LIFO — Last In, First Out |
| Queue | kyoo | FIFO — First In, First Out |
| Deque | DEK | Double-ended queue — O(1) push/pop from both ends |
| LIFO | LY-foe | Last In First Out (stack) |
| FIFO | FY-foe | First In First Out (queue) |
| Node | node | Element in a linked list containing data + pointer to next |
| Head | hed | First node of a linked list |
| Tail | tayl | Last node of a linked list |`,

    `## Full reference: Stack — complete implementation and API

\`\`\`python
from collections import deque

class Stack:
    """LIFO stack — last pushed item is first popped."""

    def __init__(self):
        self._data: deque = deque()

    def push(self, item) -> None:
        self._data.append(item)

    def pop(self):
        if self.is_empty():
            raise IndexError("pop from empty stack")
        return self._data.pop()

    def peek(self):
        if self.is_empty():
            raise IndexError("peek at empty stack")
        return self._data[-1]

    def is_empty(self) -> bool:
        return len(self._data) == 0

    def __len__(self):
        return len(self._data)

    def __repr__(self):
        return f"Stack({list(self._data)})"

# Usage
s = Stack()
s.push(1)
s.push(2)
s.push(3)
print(s.peek())    # → 3  (look without removing)
print(s.pop())     # → 3
print(s.pop())     # → 2
print(len(s))      # → 1
print(s)           # → Stack([1])

# Real use case: undo history in a text editor
undo_stack = Stack()
undo_stack.push({"action": "type", "text": "Hello"})
undo_stack.push({"action": "delete", "count": 2})
last = undo_stack.pop()   # → {"action": "delete", "count": 2}
\`\`\``,

    `## Full reference: Queue — complete implementation and API

\`\`\`python
from collections import deque

class Queue:
    """FIFO queue — first enqueued item is first dequeued."""

    def __init__(self):
        self._data: deque = deque()

    def enqueue(self, item) -> None:
        self._data.append(item)

    def dequeue(self):
        if self.is_empty():
            raise IndexError("dequeue from empty queue")
        return self._data.popleft()   # O(1) — key advantage over list

    def front(self):
        if self.is_empty():
            raise IndexError("front of empty queue")
        return self._data[0]

    def is_empty(self) -> bool:
        return len(self._data) == 0

    def __len__(self):
        return len(self._data)

# Usage
q = Queue()
q.enqueue("req-1")
q.enqueue("req-2")
q.enqueue("req-3")
print(q.front())       # → "req-1"  (look without removing)
print(q.dequeue())     # → "req-1"
print(q.dequeue())     # → "req-2"
print(len(q))          # → 1

# Real use case: web server request queue
import queue
request_queue = queue.Queue(maxsize=100)   # stdlib thread-safe queue
request_queue.put(request)
job = request_queue.get()                  # blocks until item available
\`\`\``,

    `## Full reference: Singly Linked List

\`\`\`python
class Node:
    def __init__(self, data):
        self.data = data
        self.next: "Node | None" = None

class LinkedList:
    def __init__(self):
        self.head: Node | None = None
        self._size = 0

    def prepend(self, data) -> None:   # O(1)
        node = Node(data)
        node.next = self.head
        self.head = node
        self._size += 1

    def append(self, data) -> None:    # O(n)
        node = Node(data)
        if not self.head:
            self.head = node
        else:
            cur = self.head
            while cur.next:
                cur = cur.next
            cur.next = node
        self._size += 1

    def delete(self, data) -> bool:    # O(n)
        if not self.head: return False
        if self.head.data == data:
            self.head = self.head.next
            self._size -= 1
            return True
        cur = self.head
        while cur.next:
            if cur.next.data == data:
                cur.next = cur.next.next
                self._size -= 1
                return True
            cur = cur.next
        return False

    def to_list(self) -> list:
        result, cur = [], self.head
        while cur:
            result.append(cur.data)
            cur = cur.next
        return result

ll = LinkedList()
ll.prepend(3)
ll.prepend(1)
ll.append(5)
print(ll.to_list())   # → [1, 3, 5]
ll.delete(3)
print(ll.to_list())   # → [1, 5]
\`\`\``,

    `## Junior mistakes + fix

| Mistake | What happens | Fix |
|---|---|---|
| Use \`list.pop(0)\` as queue | O(n) per dequeue — unusable at scale | Use \`collections.deque\` or \`queue.Queue\` |
| Forget base case in recursive linked list | Infinite recursion, stack overflow | Always check \`if not node: return\` first |
| Traverse linked list without stopping at None | \`AttributeError: 'NoneType'\` | \`while cur:\` not \`while True:\` |
| Use Python list when you need a linked list | Insertion at front is O(n) | Use deque for front insertion |
| Lose reference to head | Entire linked list becomes unreachable | Never re-assign head without saving it |`,
  ],

  // ── Lesson 3: Hash Tables ─────────────────────────────────────────────────
  'py-dsa-hash': [
    `## Terminology

| Term | Pronunciation | Meaning |
|---|---|---|
| Hash function | hash | Converts a key to an integer index |
| Bucket | BUK-et | Slot in the hash table array |
| Collision | kol-IZH-un | Two keys hash to the same bucket |
| Chaining | CHAYN-ing | Collision resolution: each bucket holds a list |
| Open addressing | — | Collision resolution: probe next empty slot |
| Load factor | lode | (items / buckets) — triggers resize when too high |
| Hashable | HASH-uh-bul | Object with a stable \`__hash__\` — can be a dict key |
| Rehashing | ree-HASH-ing | Rebuild the table into a larger array |`,

    `## Full reference: Python dict internals you must know

\`\`\`python
# ── What can be a dict key (must be hashable) ─────────────────
d = {}
d[42]        = "int key"        # ✅
d["hello"]   = "str key"        # ✅
d[(1, 2)]    = "tuple key"      # ✅ (immutable tuple)
d[frozenset({1,2})] = "fset"   # ✅
# d[[1, 2]]  = "list key"       # ❌ TypeError: unhashable type: 'list'
# d[{"a":1}] = "dict key"       # ❌ TypeError: unhashable type: 'dict'

# ── Why collision matters: str hash example ───────────────────
print(hash("a"))     # → some large int (stable per process)
print(hash("b"))     # → different int
# Python uses randomised hash seeds since 3.3 (PYTHONHASHSEED)
# That's why dict order used to be unpredictable across runs

# ── Custom hashable object ─────────────────────────────────────
class Point:
    def __init__(self, x, y):
        self.x, self.y = x, y

    def __hash__(self):                    # ← must define for dict key
        return hash((self.x, self.y))

    def __eq__(self, other):               # ← must define with __hash__
        return (self.x, self.y) == (other.x, other.y)

p1 = Point(1, 2)
p2 = Point(1, 2)
d = {p1: "origin"}
d[p2]    # → "origin"  (p1 == p2 → same key)

# ── Common patterns ───────────────────────────────────────────
# Group by key
from collections import defaultdict
by_level = defaultdict(list)
for course in courses:
    by_level[course.level].append(course)

# Frequency count
from collections import Counter
words = "the quick brown fox the fox".split()
freq = Counter(words)
freq.most_common(3)   # → [('the',2),('fox',2),('quick',1)]

# Invert a dict (if values are unique)
orig = {"a": 1, "b": 2, "c": 3}
inverted = {v: k for k, v in orig.items()}
# → {1: "a", 2: "b", 3: "c"}
\`\`\``,

    `## Real scenario: cache with LRU eviction

\`\`\`python
from functools import lru_cache

# Memoisation — cache expensive function results
@lru_cache(maxsize=128)
def fibonacci(n: int) -> int:
    if n < 2:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

fibonacci(50)   # → 12586269025  (computed in microseconds, not seconds)
fibonacci.cache_info()
# → CacheInfo(hits=48, misses=51, maxsize=128, currsize=51)

# Manual dict cache (when you need more control)
_cache: dict[int, int] = {}

def get_course_from_cache(course_id: int):
    if course_id in _cache:           # O(1) lookup
        return _cache[course_id]
    course = fetch_from_db(course_id) # slow operation
    _cache[course_id] = course
    return course
\`\`\``,

    `## Junior mistakes + fix

| Mistake | What happens | Fix |
|---|---|---|
| Use list for frequent membership tests | O(n) per check | Convert to \`set\` or dict for O(1) |
| Mutate object used as dict key | Hash changes → key becomes unfindable | Only use immutable types as keys |
| Forget \`__eq__\` when defining \`__hash__\` | Objects with same hash don't compare equal | Always define both together |
| Override only \`__eq__\` | Class becomes unhashable (Python removes \`__hash__\`) | Always define \`__hash__\` alongside \`__eq__\` |
| Cache without eviction | Memory grows unbounded | Use \`lru_cache(maxsize=N)\` or TTL-based cache |`,
  ],

  // ── Lesson 4: Trees ──────────────────────────────────────────────────────
  'py-dsa-trees': [
    `## Terminology

| Term | Pronunciation | Meaning |
|---|---|---|
| Binary tree | BY-nuh-ree | Each node has at most 2 children |
| BST | B-S-T | Binary Search Tree — left < root < right |
| Root | root | Top node |
| Leaf | leef | Node with no children |
| Height | HYT | Longest path from root to leaf |
| Depth | depth | Distance from root to a specific node |
| Balanced tree | — | Heights of left and right subtrees differ by at most 1 |
| Inorder | IN-or-der | Left → Node → Right (gives sorted output for BST) |
| Preorder | PREE-or-der | Node → Left → Right |
| Postorder | POHST-or-der | Left → Right → Node |
| Level-order | — | BFS — visit level by level (use a queue) |
| Heap | heep | Complete binary tree where parent is always min (or max) |`,

    `## Full reference: BST implementation and traversals

\`\`\`python
class TreeNode:
    def __init__(self, val):
        self.val   = val
        self.left  = None
        self.right = None

class BST:
    def __init__(self):
        self.root = None

    def insert(self, val) -> None:
        self.root = self._insert(self.root, val)

    def _insert(self, node, val):
        if not node: return TreeNode(val)
        if val < node.val:  node.left  = self._insert(node.left,  val)
        elif val > node.val: node.right = self._insert(node.right, val)
        return node

    def search(self, val) -> bool:
        return self._search(self.root, val)

    def _search(self, node, val):
        if not node:        return False
        if val == node.val: return True
        if val < node.val:  return self._search(node.left,  val)
        return              self._search(node.right, val)

    # ── Traversals ───────────────────────────────────────────
    def inorder(self) -> list:
        result = []
        def _in(node):
            if not node: return
            _in(node.left)
            result.append(node.val)
            _in(node.right)
        _in(self.root)
        return result   # ← sorted for BST

    def level_order(self) -> list[list]:
        """BFS — returns list of levels."""
        from collections import deque
        if not self.root: return []
        result, queue = [], deque([self.root])
        while queue:
            level = []
            for _ in range(len(queue)):
                node = queue.popleft()
                level.append(node.val)
                if node.left:  queue.append(node.left)
                if node.right: queue.append(node.right)
            result.append(level)
        return result

# Usage
bst = BST()
for v in [5, 3, 7, 1, 4, 6, 8]:
    bst.insert(v)

bst.inorder()          # → [1, 3, 4, 5, 6, 7, 8]  (sorted!)
bst.level_order()      # → [[5], [3, 7], [1, 4, 6, 8]]
bst.search(4)          # → True
bst.search(99)         # → False
\`\`\``,

    `## Full reference: heapq — Python's heap module

\`\`\`python
import heapq

# ── Min-heap (default) ────────────────────────────────────────
heap = []
heapq.heappush(heap, 5)
heapq.heappush(heap, 1)
heapq.heappush(heap, 3)
print(heap)              # → [1, 3, 5]  (heap order, NOT sorted)
heapq.heappop(heap)      # → 1  (always the minimum)
heap[0]                  # → 3  (peek min without removing)

# Build heap from list in O(n) — faster than N pushes
nums = [5, 2, 8, 1, 9, 3]
heapq.heapify(nums)
nums             # → [1, 2, 3, 5, 9, 8]  (heap property satisfied)

# N largest / smallest
heapq.nlargest(3,  nums)   # → [9, 8, 5]
heapq.nsmallest(3, nums)   # → [1, 2, 3]

# ── Max-heap (negate values) ──────────────────────────────────
max_heap = []
for n in [5, 1, 3]:
    heapq.heappush(max_heap, -n)     # negate to simulate max-heap
-heapq.heappop(max_heap)             # → 5  (largest)

# ── Priority queue (tuples — sorted by first element) ─────────
pq = []
heapq.heappush(pq, (1, "low priority"))
heapq.heappush(pq, (10, "high priority"))
heapq.heappush(pq, (5, "medium priority"))
priority, task = heapq.heappop(pq)   # → (1, "low priority")
\`\`\``,

    `## Junior mistakes + fix

| Mistake | What happens | Fix |
|---|---|---|
| Confuse heap[0] with "sorted" | Heap is not fully sorted — only root is minimum | Use \`heap[0]\` for min; \`heappop\` to extract |
| Recursive DFS without base case | RecursionError — stack overflow | Always check \`if not node: return\` |
| Use list as priority queue | O(n) insert, O(n log n) resort | Use \`heapq\` for O(log n) insert |
| Forget \`heapify\` before using list as heap | Heap property not satisfied | Call \`heapq.heapify(lst)\` first |
| Assume BST is always balanced | Degenerate BST (sorted insert) → O(n) | Use balanced BST (AVL, Red-Black) for production |`,
  ],

  // ── Lesson 5: Sorting & Searching ────────────────────────────────────────
  'py-dsa-algorithms': [
    `## Terminology

| Term | Pronunciation | Meaning |
|---|---|---|
| Timsort | TIM-sort | Python's built-in sort — hybrid merge + insertion sort |
| Stable sort | — | Equal elements keep their original relative order |
| In-place sort | — | Sorts without needing extra memory |
| Binary search | BY-nuh-ree | Find in sorted list in O(log n) by halving |
| Sliding window | — | Pattern for subarray/substring problems |
| Two pointers | — | Pattern using left/right pointer moving toward each other |
| Memoisation | mem-oh-eye-ZAY-shun | Caching recursive call results to avoid recomputation |
| Dynamic programming | dy-NAM-ik | Solving problem by building from subproblems |
| Divide and conquer | — | Split problem, solve parts recursively, combine |`,

    `## Full reference: sorting with key functions

\`\`\`python
# ── sorted() returns new list; list.sort() is in-place ────────
nums = [3, 1, 4, 1, 5, 9, 2, 6]
sorted(nums)                    # → [1, 1, 2, 3, 4, 5, 6, 9]
sorted(nums, reverse=True)      # → [9, 6, 5, 4, 3, 2, 1, 1]

# Key function — sort by a derived value
words = ["banana", "apple", "cherry", "fig"]
sorted(words, key=len)          # → ["fig", "apple", "banana", "cherry"]
sorted(words, key=str.lower)    # → alphabetical, case-insensitive

# Sort objects
courses = [
    {"title": "Django",  "price": 49},
    {"title": "Python",  "price": 0},
    {"title": "FastAPI", "price": 39},
]
sorted(courses, key=lambda c: c["price"])
# → [{"title":"Python","price":0}, {"title":"FastAPI","price":39}, ...]

# Sort by multiple keys (primary: price, secondary: title)
from operator import itemgetter
sorted(courses, key=itemgetter("price", "title"))

# Stable sort: equal elements keep original order
sorted(courses, key=lambda c: c["price"])
# Courses with same price keep their order relative to each other
\`\`\``,

    `## Full reference: binary search

\`\`\`python
# ── Manual implementation ─────────────────────────────────────
def binary_search(arr: list, target) -> int:
    """Returns index of target, or -1 if not found. Requires sorted input."""
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:   return mid
        elif arr[mid] < target:  left  = mid + 1
        else:                    right = mid - 1
    return -1

nums = [1, 3, 5, 7, 9, 11, 13, 15]
binary_search(nums, 7)    # → 3  (index 3)
binary_search(nums, 6)    # → -1 (not found)

# ── bisect module (standard library) ─────────────────────────
import bisect
nums = [1, 3, 5, 7, 9]
bisect.bisect_left(nums, 5)    # → 2  (index where 5 is or would be inserted)
bisect.bisect_right(nums, 5)   # → 3  (index after any existing 5s)
bisect.bisect_left(nums, 6)    # → 3  (6 would go between 5 and 7)

# Insert while keeping sorted
bisect.insort(nums, 6)
print(nums)   # → [1, 3, 5, 6, 7, 9]

# Real use: check if a value is in a sorted range
def is_in_range(sorted_list, value):
    i = bisect.bisect_left(sorted_list, value)
    return i < len(sorted_list) and sorted_list[i] == value
\`\`\``,

    `## Full reference: sliding window and two-pointer patterns

\`\`\`python
# ── Sliding window: max sum of k consecutive elements ─────────
def max_sum_window(arr: list[int], k: int) -> int:
    window_sum = sum(arr[:k])   # initial window
    max_sum    = window_sum
    for i in range(k, len(arr)):
        window_sum += arr[i] - arr[i - k]   # slide: add new, remove old
        max_sum = max(max_sum, window_sum)
    return max_sum

max_sum_window([2, 1, 5, 1, 3, 2], k=3)   # → 9  (5+1+3)

# ── Two pointers: check if a sorted array has pair summing to target ──
def has_pair_sum(sorted_arr: list[int], target: int) -> bool:
    left, right = 0, len(sorted_arr) - 1
    while left < right:
        s = sorted_arr[left] + sorted_arr[right]
        if s == target:   return True
        elif s < target:  left  += 1
        else:             right -= 1
    return False

has_pair_sum([1, 2, 3, 4, 6], 6)   # → True  (2+4)
has_pair_sum([1, 2, 3, 4, 6], 15)  # → False

# ── Memoisation with functools.lru_cache ─────────────────────
from functools import lru_cache

@lru_cache(maxsize=None)
def fib(n: int) -> int:
    if n < 2: return n
    return fib(n-1) + fib(n-2)

fib(40)   # → 102334155  (instant with cache, exponential without)
\`\`\``,

    `## Junior mistakes + fix

| Mistake | What happens | Fix |
|---|---|---|
| Binary search on unsorted list | Wrong results silently | Always sort first (or assert sorted) |
| Off-by-one in binary search | Misses first or last element | Use \`while left <= right\` (not \`<\`) |
| Sliding window with nested loop | O(n²) instead of O(n) | Move the window pointer forward, not restart |
| Recursion without memoisation | Exponential time, TLE in interviews | Use \`@lru_cache\` or a \`dp\` dict |
| \`list.sort()\` then check return value | \`list.sort()\` returns \`None\` | Use \`sorted()\` if you need the sorted version returned |`,
  ],
}

function toBlocks(markdowns: string[]): ContentBlock[] {
  return markdowns.map(markdown => ({ type: 'text' as const, markdown }))
}

export function applyPhase2DeepEnhancements(lessons: Lesson[]): Lesson[] {
  return lessons.map(lesson => {
    const markdowns = deep2Blocks[lesson.id]
    if (!markdowns) return lesson
    return {
      ...lesson,
      content: [...toBlocks(markdowns), ...lesson.content],
    }
  })
}
