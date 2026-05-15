import type { LessonEnhancement } from '@/lib/curriculum/reviewer-types'
import { clarify, roadmapIntro } from '@/lib/curriculum/reviewer-merge'

export const CS_REVIEWER: Record<string, LessonEnhancement> = {
  'cs-big-o': {
    intro: [roadmapIntro('computer-science', 'Foundations', 'Big O, growth rates, worst-case analysis')],
    outro: [clarify('Constants drop', 'Big O ignores constants: O(2n) is O(n). Focus on dominant term as n → ∞.')],
  },
  'cs-arrays': {
    intro: [roadmapIntro('computer-science', 'Foundations', 'arrays, dynamic arrays, two pointers')],
  },
  'cs-strings': {
    intro: [roadmapIntro('computer-science', 'Foundations', 'strings, frequency maps, sliding window')],
  },
  'cs-recursion': {
    intro: [roadmapIntro('computer-science', 'Foundations', 'recursion, base case, memoization')],
    outro: [clarify('Stack depth', 'Deep recursion can overflow the call stack — switch to iteration or trampolining for very large n.')],
  },
  'cs-sorting-search': {
    intro: [roadmapIntro('computer-science', 'Foundations', 'binary search, sorting basics')],
  },
  'cs-problem-framework': {
    intro: [roadmapIntro('computer-science', 'Foundations', 'interview framework, edge cases')],
  },
  'cs-hash-maps': {
    intro: [roadmapIntro('computer-science', 'Core structures', 'hash tables, Map, Set')],
  },
  'cs-linked-lists': {
    intro: [roadmapIntro('computer-science', 'Core structures', 'linked lists, pointers')],
  },
  'cs-stacks-queues': {
    intro: [roadmapIntro('computer-science', 'Core structures', 'stacks, queues, monotonic stack')],
  },
  'cs-trees-basics': {
    intro: [roadmapIntro('computer-science', 'Core structures', 'binary trees, traversals')],
  },
  'cs-bfs-dfs': {
    intro: [roadmapIntro('computer-science', 'Core structures', 'graphs, BFS, DFS')],
    outro: [clarify('Visited set', 'Always mark visited when enqueueing/pushing — not only when popping — to avoid duplicate queue work.')],
  },
  'cs-heaps': {
    intro: [roadmapIntro('computer-science', 'Core structures', 'heaps, priority queues, top-k')],
  },
  'cs-dynamic-programming': {
    intro: [roadmapIntro('computer-science', 'Advanced', 'memoization, tabulation, optimal substructure')],
    outro: [clarify('State definition', 'The hardest part of DP is naming the state. Write it in English before coding the recurrence.')],
  },
  'cs-graph-algorithms': {
    intro: [roadmapIntro('computer-science', 'Advanced', 'topological sort, shortest paths, union-find')],
  },
  'cs-tries': {
    intro: [roadmapIntro('computer-science', 'Advanced', 'prefix trees, autocomplete')],
  },
  'cs-interview-patterns': {
    intro: [roadmapIntro('computer-science', 'Advanced', 'sliding window, backtracking, practice plan')],
  },
}
