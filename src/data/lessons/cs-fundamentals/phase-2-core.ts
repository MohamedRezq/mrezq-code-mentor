import type { Lesson } from '@/types/lesson'

/** Phase cs-core — hash maps, linked lists, stacks/queues, trees, BFS/DFS, heaps */
export const csCoreLessons: Lesson[] = [
  {
    id: 'cs-hash-maps',
    moduleId: 'cs-fundamentals',
    phaseId: 'cs-core',
    phaseNumber: 2,
    order: 1,
    title: 'Hash Maps & Sets',
    description:
      'Average O(1) lookup, collision intuition, Map/Set in JavaScript, and classic two-sum / frequency problems.',
    duration: '1 h',
    difficulty: 'intermediate',
    objectives: [
      'Use Map and Set for O(1) average lookups',
      'Solve two-sum with a hash map in one pass',
      'Explain trade-off: memory for speed',
      'Avoid object-key pitfalls for non-string keys',
    ],
    content: [
      {
        type: 'code',
        language: 'javascript',
        filename: 'two-sum.js',
        code: `function twoSum(nums, target) {
  const seen = new Map() // value -> index
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i]
    if (seen.has(need)) return [seen.get(need), i]
    seen.set(nums[i], i)
  }
  return null
}`,
        explanation: 'One pass: for each element, check if complement exists before inserting current index.',
      },
      {
        type: 'exercise',
        title: 'First unique character',
        description: 'Return index of first non-repeating character, or -1. Use a frequency map in two passes.',
        language: 'javascript',
        starterCode: `function firstUniqChar(s) {
  // pass 1: count
  // pass 2: find index with count 1
}
`,
        solution: `function firstUniqChar(s) {
  const count = new Map()
  for (const ch of s) count.set(ch, (count.get(ch) ?? 0) + 1)
  for (let i = 0; i < s.length; i++) {
    if (count.get(s[i]) === 1) return i
  }
  return -1
}`,
      },
    ],
  },
  {
    id: 'cs-linked-lists',
    moduleId: 'cs-fundamentals',
    phaseId: 'cs-core',
    phaseNumber: 2,
    order: 2,
    title: 'Linked Lists',
    description:
      'Singly linked nodes, insertion, reversal, cycle detection (Floyd), and pointer discipline.',
    duration: '1.5 h',
    difficulty: 'intermediate',
    objectives: [
      'Implement a singly linked list node structure',
      'Reverse a list iteratively in O(n)',
      'Detect cycles with slow/fast pointers',
      'Compare linked list vs array trade-offs',
    ],
    content: [
      {
        type: 'code',
        language: 'javascript',
        filename: 'linked-list.js',
        code: `class ListNode {
  constructor(val, next = null) {
    this.val = val
    this.next = next
  }
}

function reverseList(head) {
  let prev = null
  let curr = head
  while (curr) {
    const next = curr.next
    curr.next = prev
    prev = curr
    curr = next
  }
  return prev
}`,
      },
      {
        type: 'callout',
        tone: 'clarification',
        title: 'Array vs linked list',
        content:
          'Arrays: cache-friendly, O(1) index access. Linked lists: O(1) insert at head, no shifting — but no random access. Modern systems often prefer arrays + dynamic resizing unless you need frequent middle inserts.',
      },
      {
        type: 'exercise',
        title: 'Merge two sorted lists',
        description: 'Merge two sorted linked lists into one sorted list. Use a dummy head node.',
        language: 'javascript',
        starterCode: `function mergeTwoLists(l1, l2) {
  const dummy = new ListNode(0)
  let tail = dummy
  // while l1 and l2: attach smaller
  return dummy.next
}
`,
        solution: `function mergeTwoLists(l1, l2) {
  const dummy = new ListNode(0)
  let tail = dummy
  while (l1 && l2) {
    if (l1.val <= l2.val) {
      tail.next = l1
      l1 = l1.next
    } else {
      tail.next = l2
      l2 = l2.next
    }
    tail = tail.next
  }
  tail.next = l1 ?? l2
  return dummy.next
}`,
      },
    ],
  },
  {
    id: 'cs-stacks-queues',
    moduleId: 'cs-fundamentals',
    phaseId: 'cs-core',
    phaseNumber: 2,
    order: 3,
    title: 'Stacks & Queues',
    description:
      'LIFO/FIFO semantics, valid parentheses, monotonic stack intro, and BFS queue patterns.',
    duration: '1 h',
    difficulty: 'intermediate',
    objectives: [
      'Implement stack with array push/pop',
      'Validate balanced brackets with a stack',
      'Use queue (deque) for level-order prep',
      'Recognize monotonic stack problems',
    ],
    content: [
      {
        type: 'code',
        language: 'javascript',
        filename: 'valid-parens.js',
        code: `function isValid(s) {
  const stack = []
  const match = { ')': '(', ']': '[', '}': '{' }
  for (const ch of s) {
    if (ch === '(' || ch === '[' || ch === '{') stack.push(ch)
    else {
      if (stack.pop() !== match[ch]) return false
    }
  }
  return stack.length === 0
}`,
      },
      {
        type: 'exercise',
        title: 'Queue with two stacks',
        description: 'Sketch in comments how `enqueue` and `dequeue` work using two stacks (amortized O(1)).',
        language: 'javascript',
        starterCode: `// stackIn for enqueue, stackOut for dequeue
// enqueue: push to stackIn
// dequeue: if stackOut empty, pour stackIn into stackOut, then pop stackOut
`,
        solution: `// Amortized O(1): each element moved at most once between stacks`,
      },
    ],
  },
  {
    id: 'cs-trees-basics',
    moduleId: 'cs-fundamentals',
    phaseId: 'cs-core',
    phaseNumber: 2,
    order: 4,
    title: 'Binary Trees & Traversals',
    description:
      'Tree terminology, DFS pre/in/post-order, BFS level-order, and max depth / same-tree patterns.',
    duration: '1.5 h',
    difficulty: 'intermediate',
    objectives: [
      'Define root, leaf, height, balanced tree',
      'Implement recursive DFS traversals',
      'Implement BFS with a queue',
      'Solve max-depth recursively',
    ],
    content: [
      {
        type: 'code',
        language: 'javascript',
        filename: 'tree-traversal.js',
        code: `class TreeNode {
  constructor(val, left = null, right = null) {
    this.val = val
    this.left = left
    this.right = right
  }
}

function inorder(root, out = []) {
  if (!root) return out
  inorder(root.left, out)
  out.push(root.val)
  inorder(root.right, out)
  return out
}

function maxDepth(root) {
  if (!root) return 0
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right))
}`,
      },
      {
        type: 'exercise',
        title: 'Level-order traversal',
        description: 'Return values level by level using a queue (BFS).',
        language: 'javascript',
        starterCode: `function levelOrder(root) {
  if (!root) return []
  const result = []
  const q = [root]
  // while q: process level size
  return result
}
`,
        solution: `function levelOrder(root) {
  if (!root) return []
  const result = []
  const q = [root]
  while (q.length) {
    const level = []
    const n = q.length
    for (let i = 0; i < n; i++) {
      const node = q.shift()
      level.push(node.val)
      if (node.left) q.push(node.left)
      if (node.right) q.push(node.right)
    }
    result.push(level)
  }
  return result
}`,
      },
    ],
  },
  {
    id: 'cs-bfs-dfs',
    moduleId: 'cs-fundamentals',
    phaseId: 'cs-core',
    phaseNumber: 2,
    order: 5,
    title: 'BFS & DFS on Graphs',
    description:
      'Adjacency lists, visited sets, shortest path in unweighted graphs, and when to use BFS vs DFS.',
    duration: '1.5 h',
    difficulty: 'intermediate',
    objectives: [
      'Represent graphs as adjacency lists',
      'Run BFS for shortest unweighted path',
      'Run DFS for connectivity and cycles',
      'Avoid infinite loops with a visited set',
    ],
    content: [
      {
        type: 'code',
        language: 'javascript',
        filename: 'graph-bfs.js',
        code: `function bfs(graph, start) {
  const visited = new Set([start])
  const queue = [start]
  const order = []
  while (queue.length) {
    const node = queue.shift()
    order.push(node)
    for (const nei of graph.get(node) ?? []) {
      if (!visited.has(nei)) {
        visited.add(nei)
        queue.push(nei)
      }
    }
  }
  return order
}

// graph: Map<node, neighbor[]>`,
      },
      {
        type: 'callout',
        tone: 'clarification',
        title: 'BFS vs DFS',
        content:
          '**BFS** — shortest steps in unweighted graphs, level-by-level. **DFS** — explore deep paths, topological sort, detecting cycles with recursion stack.',
      },
      {
        type: 'exercise',
        title: 'Number of islands',
        description:
          'Given a 2D grid of "1" land and "0" water, count islands. Each island is connected 4-directionally. Use DFS or BFS.',
        language: 'javascript',
        starterCode: `function numIslands(grid) {
  // iterate cells; on '1' run dfs to sink island and count++
}
`,
        solution: `function numIslands(grid) {
  if (!grid.length) return 0
  let count = 0
  const rows = grid.length
  const cols = grid[0].length
  function dfs(r, c) {
    if (r < 0 || c < 0 || r >= rows || c >= cols || grid[r][c] !== '1') return
    grid[r][c] = '0'
    dfs(r + 1, c)
    dfs(r - 1, c)
    dfs(r, c + 1)
    dfs(r, c - 1)
  }
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === '1') {
        count++
        dfs(r, c)
      }
    }
  }
  return count
}`,
      },
    ],
  },
  {
    id: 'cs-heaps',
    moduleId: 'cs-fundamentals',
    phaseId: 'cs-core',
    phaseNumber: 2,
    order: 6,
    title: 'Heaps & Priority Queues',
    description:
      'Min-heap property, top-k problems, and using a heap (or sorted structure) for scheduling and streaming.',
    duration: '1 h',
    difficulty: 'intermediate',
    objectives: [
      'Explain min-heap vs max-heap',
      'Solve top-k frequent with a size-k heap',
      'Know JavaScript has no built-in heap — use library or array tricks',
      'Connect heaps to Dijkstra and event queues',
    ],
    content: [
      {
        type: 'text',
        markdown: `## Heap in one sentence

A **binary heap** is a complete binary tree where parent ≤ children (min-heap). Insert and extract-min are O(log n); peek min is O(1).

For **top k** largest, keep a **min-heap of size k** — root is the smallest of your top candidates.`,
      },
      {
        type: 'code',
        language: 'javascript',
        filename: 'top-k.js',
        code: `// Using sort for clarity — production may use a heap library
function topKFrequent(nums, k) {
  const freq = new Map()
  for (const n of nums) freq.set(n, (freq.get(n) ?? 0) + 1)
  return [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, k)
    .map(([num]) => num)
}`,
      },
      {
        type: 'exercise',
        title: 'Kth largest element',
        description: 'Describe in comments why a min-heap of size k helps find the kth largest in O(n log k).',
        language: 'javascript',
        starterCode: `// Stream numbers: maintain min-heap size k
// If new value > heap.min, pop min and push new
// After all: heap.min is kth largest
`,
        solution: `// Heap holds the k largest seen; smallest of those is the kth largest overall`,
      },
    ],
  },
]
