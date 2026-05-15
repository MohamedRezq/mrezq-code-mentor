import type { Lesson } from '@/types/lesson'

/** Phase cs-advanced — DP, graphs, tries, interview patterns */
export const csAdvancedLessons: Lesson[] = [
  {
    id: 'cs-dynamic-programming',
    moduleId: 'cs-fundamentals',
    phaseId: 'cs-advanced',
    phaseNumber: 3,
    order: 1,
    title: 'Dynamic Programming',
    description:
      'Memoization vs tabulation, overlapping subproblems, classic 1D/2D DP (climbing stairs, coin change, LCS intro).',
    duration: '2 h',
    difficulty: 'advanced',
    objectives: [
      'Identify overlapping subproblems and optimal substructure',
      'Implement top-down memo and bottom-up table',
      'Reconstruct solutions from DP tables',
      'Avoid exponential recursion without memo',
    ],
    content: [
      {
        type: 'text',
        markdown: `## DP recipe

1. Define state (e.g. \`dp[i]\` = ways to reach step i)
2. Recurrence from smaller states
3. Base cases
4. Order of computation (bottom-up) or memo (top-down)`,
      },
      {
        type: 'code',
        language: 'javascript',
        filename: 'climb-stairs.js',
        code: `function climbStairs(n) {
  if (n <= 2) return n
  let a = 1
  let b = 2
  for (let i = 3; i <= n; i++) {
    const c = a + b
    a = b
    b = c
  }
  return b
}`,
        explanation: 'Fibonacci-style DP — O(n) time, O(1) space after recognizing only last two states matter.',
      },
      {
        type: 'exercise',
        title: 'Coin change',
        description: 'Minimum coins to make amount `target` from `coins[]`, or -1 if impossible. Use bottom-up DP.',
        language: 'javascript',
        starterCode: `function coinChange(coins, amount) {
  const dp = Array(amount + 1).fill(Infinity)
  dp[0] = 0
  // for a from 1..amount: try each coin
  return dp[amount] === Infinity ? -1 : dp[amount]
}
`,
        solution: `function coinChange(coins, amount) {
  const dp = Array(amount + 1).fill(Infinity)
  dp[0] = 0
  for (let a = 1; a <= amount; a++) {
    for (const c of coins) {
      if (a - c >= 0) dp[a] = Math.min(dp[a], dp[a - c] + 1)
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount]
}`,
      },
    ],
  },
  {
    id: 'cs-graph-algorithms',
    moduleId: 'cs-fundamentals',
    phaseId: 'cs-advanced',
    phaseNumber: 3,
    order: 2,
    title: 'Graph Algorithms',
    description:
      'Topological sort, shortest paths intro (Dijkstra concept), union-find for connected components.',
    duration: '2 h',
    difficulty: 'advanced',
    objectives: [
      'Run Kahn’s algorithm for topological sort',
      'Explain Dijkstra when edge weights are non-negative',
      'Use union-find with path compression',
      'Model dependencies as directed acyclic graphs',
    ],
    content: [
      {
        type: 'code',
        language: 'javascript',
        filename: 'topo-sort.js',
        code: `function topoSort(numCourses, prerequisites) {
  const indegree = Array(numCourses).fill(0)
  const adj = Array.from({ length: numCourses }, () => [])
  for (const [course, pre] of prerequisites) {
    adj[pre].push(course)
    indegree[course]++
  }
  const q = []
  for (let i = 0; i < numCourses; i++) if (indegree[i] === 0) q.push(i)
  const order = []
  while (q.length) {
    const u = q.shift()
    order.push(u)
    for (const v of adj[u]) {
      if (--indegree[v] === 0) q.push(v)
    }
  }
  return order.length === numCourses ? order : []
}`,
      },
      {
        type: 'exercise',
        title: 'Can finish courses?',
        description: 'Return true if all courses can be finished (no cycle in prerequisite graph).',
        language: 'javascript',
        starterCode: `function canFinish(numCourses, prerequisites) {
  // topo sort length === numCourses
}
`,
        solution: `function canFinish(numCourses, prerequisites) {
  const order = topoSort(numCourses, prerequisites)
  return order.length === numCourses
}`,
      },
    ],
  },
  {
    id: 'cs-tries',
    moduleId: 'cs-fundamentals',
    phaseId: 'cs-advanced',
    phaseNumber: 3,
    order: 3,
    title: 'Tries (Prefix Trees)',
    description:
      'Autocomplete, word search prefixes, and space/time trade-offs vs hash maps for string keys.',
    duration: '1.5 h',
    difficulty: 'advanced',
    objectives: [
      'Implement trie insert and search',
      'Support startsWith for autocomplete',
      'Compare trie vs Map for prefix queries',
      'Recognize trie in IP routing and keyboards',
    ],
    content: [
      {
        type: 'code',
        language: 'javascript',
        filename: 'trie.js',
        code: `class TrieNode {
  constructor() {
    this.children = new Map()
    this.isEnd = false
  }
}

class Trie {
  constructor() {
    this.root = new TrieNode()
  }
  insert(word) {
    let node = this.root
    for (const ch of word) {
      if (!node.children.has(ch)) node.children.set(ch, new TrieNode())
      node = node.children.get(ch)
    }
    node.isEnd = true
  }
  search(word) {
    const node = this._walk(word)
    return Boolean(node?.isEnd)
  }
  startsWith(prefix) {
    return Boolean(this._walk(prefix))
  }
  _walk(s) {
    let node = this.root
    for (const ch of s) {
      if (!node.children.has(ch)) return null
      node = node.children.get(ch)
    }
    return node
  }
}`,
      },
      {
        type: 'exercise',
        title: 'Word search II concept',
        description: 'In comments, explain why a trie helps when searching many words in a grid vs checking each word separately.',
        language: 'javascript',
        starterCode: `// trie helps because:
`,
        solution: `// shared prefixes are explored once; DFS from each cell reuses trie paths instead of rescanning full words`,
      },
    ],
  },
  {
    id: 'cs-interview-patterns',
    moduleId: 'cs-fundamentals',
    phaseId: 'cs-advanced',
    phaseNumber: 3,
    order: 4,
    title: 'Interview Patterns & Practice',
    description:
      'Sliding window, backtracking intro, and a structured plan to reach 200+ LeetCode-style problems.',
    duration: '1.5 h',
    difficulty: 'advanced',
    objectives: [
      'Apply sliding window to substring problems',
      'Use backtracking for subsets/permutations',
      'Build a 12-week practice schedule by topic',
      'Review complexity before submitting in interviews',
    ],
    content: [
      {
        type: 'code',
        language: 'javascript',
        filename: 'sliding-window.js',
        code: `function lengthOfLongestSubstring(s) {
  const last = new Map()
  let best = 0
  let start = 0
  for (let end = 0; end < s.length; end++) {
    const ch = s[end]
    if (last.has(ch) && last.get(ch) >= start) start = last.get(ch) + 1
    last.set(ch, end)
    best = Math.max(best, end - start + 1)
  }
  return best
}`,
      },
      {
        type: 'callout',
        tone: 'tip',
        title: '200+ problem plan',
        content:
          'Weeks 1–4: arrays/strings/hash. Weeks 5–8: trees/graphs/BFS/DFS. Weeks 9–12: DP, heaps, review weak tags. Track **pattern**, not count alone.',
      },
      {
        type: 'exercise',
        title: 'Subsets backtracking',
        description: 'Return all subsets of `nums` (power set) using backtracking.',
        language: 'javascript',
        starterCode: `function subsets(nums) {
  const result = []
  function backtrack(start, path) {
    // push copy of path; try adding nums[i] for i >= start
  }
  backtrack(0, [])
  return result
}
`,
        solution: `function subsets(nums) {
  const result = []
  function backtrack(start, path) {
    result.push([...path])
    for (let i = start; i < nums.length; i++) {
      path.push(nums[i])
      backtrack(i + 1, path)
      path.pop()
    }
  }
  backtrack(0, [])
  return result
}`,
      },
    ],
  },
]
