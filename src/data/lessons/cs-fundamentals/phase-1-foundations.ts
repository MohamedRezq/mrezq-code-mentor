import type { Lesson } from '@/types/lesson'

/** Phase cs-basics — [roadmap.sh/computer-science](https://roadmap.sh/computer-science) foundations */
export const csBasicsLessons: Lesson[] = [
  {
    id: 'cs-big-o',
    moduleId: 'cs-fundamentals',
    phaseId: 'cs-basics',
    phaseNumber: 1,
    order: 1,
    title: 'Big O Notation & Complexity Analysis',
    description:
      'Learn how to describe algorithm efficiency with Big O, compare growth rates, and recognize common time/space patterns in interview and production code.',
    duration: '1 h',
    difficulty: 'beginner',
    objectives: [
      'Define worst-case Big O for time and space',
      'Rank O(1), O(log n), O(n), O(n log n), O(n²)',
      'Analyze simple loops and nested loops',
      'Connect complexity to real API and database limits',
    ],
    content: [
      {
        type: 'text',
        markdown: `## Why complexity matters

When \`n\` is 1,000, O(n) is fine. When \`n\` is 10,000,000, O(n²) can time out. Big O describes **how cost grows** as input size grows — not the exact millisecond count.

We usually analyze **worst-case** time unless stated otherwise.`,
      },
      {
        type: 'callout',
        tone: 'tip',
        title: 'Common complexities (fast → slow)',
        content:
          'O(1) constant · O(log n) binary search · O(n) single scan · O(n log n) efficient sort · O(n²) nested loops on same input · O(2ⁿ) naive recursion without memo',
      },
      {
        type: 'code',
        language: 'javascript',
        filename: 'complexity-examples.js',
        code: `// O(1) — hash map lookup (average case)
const user = map.get(userId)

// O(n) — scan entire array once
function findMax(arr) {
  let max = -Infinity
  for (const x of arr) if (x > max) max = x
  return max
}

// O(n²) — every pair
function hasDuplicatePair(nums) {
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] === nums[j]) return true
    }
  }
  return false
}`,
        explanation: 'Nested loops over the same array often mean O(n²). Ask: “How many times does the inner body run as n grows?”',
      },
      {
        type: 'exercise',
        title: 'Classify complexity',
        description: 'For each snippet, write the Big O time complexity in a comment.',
        language: 'javascript',
        starterCode: `function a(n) {
  return n * 2
}

function b(arr) {
  for (const x of arr) console.log(x)
  for (const x of arr) console.log(x)
}

function c(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length; j++) {
      console.log(arr[i], arr[j])
    }
  }
}
// a:
// b:
// c:
`,
        solution: `// a: O(1)
// b: O(n) — two sequential O(n) loops
// c: O(n²)`,
      },
    ],
  },
  {
    id: 'cs-arrays',
    moduleId: 'cs-fundamentals',
    phaseId: 'cs-basics',
    phaseNumber: 1,
    order: 2,
    title: 'Arrays & Dynamic Arrays',
    description:
      'Static arrays, dynamic resizing, amortized append cost, and patterns for in-place array manipulation.',
    duration: '1 h',
    difficulty: 'beginner',
    objectives: [
      'Explain contiguous memory and index O(1) access',
      'Describe amortized O(1) push on dynamic arrays',
      'Use two-pointer patterns on sorted arrays',
      'Avoid off-by-one errors in loops',
    ],
    content: [
      {
        type: 'text',
        markdown: `## Arrays in practice

JavaScript \`Array\` is a dynamic array: \`push\` is usually O(1) amortized; \`unshift\` is O(n) because elements shift.

**Two pointers** on a sorted array solve many problems in O(n) instead of O(n²).`,
      },
      {
        type: 'code',
        language: 'javascript',
        filename: 'two-sum-sorted.js',
        code: `// nums sorted ascending — find two indices that sum to target
function twoSumSorted(nums, target) {
  let left = 0
  let right = nums.length - 1
  while (left < right) {
    const sum = nums[left] + nums[right]
    if (sum === target) return [left, right]
    if (sum < target) left++
    else right--
  }
  return null
}

console.log(twoSumSorted([1, 2, 4, 6, 8], 10)) // [1, 3] → 2 + 8`,
      },
      {
        type: 'exercise',
        title: 'Remove duplicates in-place',
        description:
          'Given sorted `nums`, return the new length after removing duplicates in-place (first k elements unique). Starter sketches the idea.',
        language: 'javascript',
        starterCode: `function removeDuplicates(nums) {
  if (nums.length === 0) return 0
  let write = 1
  for (let read = 1; read < nums.length; read++) {
    // if nums[read] is new, copy to nums[write] and increment write
  }
  return write
}
`,
        solution: `function removeDuplicates(nums) {
  if (nums.length === 0) return 0
  let write = 1
  for (let read = 1; read < nums.length; read++) {
    if (nums[read] !== nums[read - 1]) {
      nums[write] = nums[read]
      write++
    }
  }
  return write
}`,
        hints: ['Compare nums[read] with nums[read - 1]', 'write pointer only moves on new values'],
      },
    ],
  },
  {
    id: 'cs-strings',
    moduleId: 'cs-fundamentals',
    phaseId: 'cs-basics',
    phaseNumber: 1,
    order: 3,
    title: 'Strings & Character Patterns',
    description:
      'Immutable strings, frequency maps, anagram detection, and sliding window basics used in interviews and parsing.',
    duration: '1 h',
    difficulty: 'beginner',
    objectives: [
      'Build character frequency maps in O(n)',
      'Compare strings with sorting or hash maps',
      'Apply sliding window for substrings',
      'Understand why string concatenation in loops can be O(n²)',
    ],
    content: [
      {
        type: 'code',
        language: 'javascript',
        filename: 'anagram.js',
        code: `function charCount(s) {
  const map = new Map()
  for (const ch of s) {
    map.set(ch, (map.get(ch) ?? 0) + 1)
  }
  return map
}

function isAnagram(a, b) {
  if (a.length !== b.length) return false
  const ca = charCount(a)
  const cb = charCount(b)
  for (const [ch, count] of ca) {
    if (cb.get(ch) !== count) return false
  }
  return true
}`,
      },
      {
        type: 'callout',
        tone: 'clarification',
        title: 'Strings are immutable in JS',
        content:
          '`s += ch` in a loop creates new strings each time — O(n²) total. Use an array `parts.push(ch)` then `parts.join("")` for O(n) building.',
      },
      {
        type: 'exercise',
        title: 'Valid palindrome',
        description:
          'Return true if a string is a palindrome after ignoring non-alphanumeric and case. Use two pointers from both ends.',
        language: 'javascript',
        starterCode: `function isPalindrome(s) {
  // two pointers: left, right
  return false
}
`,
        solution: `function isPalindrome(s) {
  const clean = s.toLowerCase().replace(/[^a-z0-9]/g, '')
  let left = 0
  let right = clean.length - 1
  while (left < right) {
    if (clean[left] !== clean[right]) return false
    left++
    right--
  }
  return true
}`,
      },
    ],
  },
  {
    id: 'cs-recursion',
    moduleId: 'cs-fundamentals',
    phaseId: 'cs-basics',
    phaseNumber: 1,
    order: 4,
    title: 'Recursion & Call Stacks',
    description:
      'Base cases, recursive structure, stack overflow risk, and when to switch to iteration or memoization.',
    duration: '1 h',
    difficulty: 'beginner',
    objectives: [
      'Write correct base and recursive cases',
      'Trace the call stack for factorial and Fibonacci',
      'Recognize overlapping subproblems',
      'Convert simple recursion to iteration',
    ],
    content: [
      {
        type: 'code',
        language: 'javascript',
        filename: 'recursion.js',
        code: `function factorial(n) {
  if (n <= 1) return 1 // base case
  return n * factorial(n - 1)
}

// Naive Fibonacci — O(2^n) time
function fib(n) {
  if (n <= 1) return n
  return fib(n - 1) + fib(n - 2)
}

// Memoized — O(n)
function fibMemo(n, memo = new Map()) {
  if (n <= 1) return n
  if (memo.has(n)) return memo.get(n)
  const v = fibMemo(n - 1, memo) + fibMemo(n - 2, memo)
  memo.set(n, v)
  return v
}`,
        explanation: 'Every recursive function needs a base case that stops recursion. Without it → stack overflow.',
      },
      {
        type: 'exercise',
        title: 'Sum array recursively',
        description: 'Implement `sumArray(nums)` that returns the sum using recursion (empty array → 0).',
        language: 'javascript',
        starterCode: `function sumArray(nums) {
  // base: nums.length === 0
  // recursive: first + sum(rest)
}
`,
        solution: `function sumArray(nums) {
  if (nums.length === 0) return 0
  return nums[0] + sumArray(nums.slice(1))
}`,
      },
    ],
  },
  {
    id: 'cs-sorting-search',
    moduleId: 'cs-fundamentals',
    phaseId: 'cs-basics',
    phaseNumber: 1,
    order: 5,
    title: 'Sorting & Searching',
    description:
      'Comparison sorts, stability, binary search prerequisites, and when to use built-in sort vs custom logic.',
    duration: '1.5 h',
    difficulty: 'intermediate',
    objectives: [
      'Implement binary search on sorted data',
      'Explain merge sort divide-and-conquer at high level',
      'Know when `.sort()` comparator is required',
      'Connect sorted data to O(log n) search',
    ],
    content: [
      {
        type: 'text',
        markdown: `## Binary search

Precondition: **sorted** array. Each step eliminates half the remaining elements → O(log n).

\`\`\`
left = 0, right = n - 1
while left <= right:
  mid = floor((left + right) / 2)
  compare nums[mid] with target
\`\`\``,
      },
      {
        type: 'code',
        language: 'javascript',
        filename: 'binary-search.js',
        code: `function binarySearch(nums, target) {
  let left = 0
  let right = nums.length - 1
  while (left <= right) {
    const mid = Math.floor((left + right) / 2)
    if (nums[mid] === target) return mid
    if (nums[mid] < target) left = mid + 1
    else right = mid - 1
  }
  return -1
}`,
      },
      {
        type: 'callout',
        tone: 'clarification',
        title: 'Stable sort',
        content:
          'A **stable** sort keeps equal elements in original order. Important when sorting users by `score` then `name`. JavaScript `Array.sort` is stable in modern engines.',
      },
      {
        type: 'exercise',
        title: 'First bad version',
        description:
          'Versions 1..n are good until first bad. `isBad(v)` is O(1). Find first bad index with binary search.',
        language: 'javascript',
        starterCode: `function firstBadVersion(n, isBad) {
  // binary search for smallest bad
}
`,
        solution: `function firstBadVersion(n, isBad) {
  let left = 1
  let right = n
  while (left < right) {
    const mid = Math.floor((left + right) / 2)
    if (isBad(mid)) right = mid
    else left = mid + 1
  }
  return left
}`,
      },
    ],
  },
  {
    id: 'cs-problem-framework',
    moduleId: 'cs-fundamentals',
    phaseId: 'cs-basics',
    phaseNumber: 1,
    order: 6,
    title: 'Problem-Solving Framework',
    description:
      'A repeatable approach for coding interviews and debugging: clarify, brute force, optimize, implement, test.',
    duration: '45 min',
    difficulty: 'beginner',
    objectives: [
      'Clarify inputs, outputs, and edge cases before coding',
      'Start with brute force then optimize',
      'Write tests for empty, single, and large inputs',
      'Communicate trade-offs aloud in interviews',
    ],
    content: [
      {
        type: 'text',
        markdown: `## UMPIRE-style checklist

1. **Understand** — examples, edge cases, constraints (n max? negatives?)
2. **Match** — pattern (hash map, two pointers, BFS…)
3. **Plan** — pseudocode, complexity target
4. **Implement** — clean names, one function one job
5. **Review** — walk through example, fix off-by-one
6. **Evaluate** — time/space Big O`,
      },
      {
        type: 'callout',
        tone: 'production',
        title: 'Same framework in production bugs',
        content:
          'Reproduce → minimize input → hypothesize → measure (logs/profiler) → fix → regression test. Interview skills transfer directly to incident response.',
      },
      {
        type: 'exercise',
        title: 'Clarifying questions',
        description:
          'For “return the k most frequent words”, list four clarifying questions you would ask an interviewer before coding.',
        language: 'javascript',
        starterCode: `// 1.
// 2.
// 3.
// 4.
`,
        solution: `// 1. Case sensitive? punctuation?
// 2. Tie-break alphabetically?
// 3. Constraints on k and word count?
// 4. Can we use extra O(n) space?`,
      },
    ],
  },
]
