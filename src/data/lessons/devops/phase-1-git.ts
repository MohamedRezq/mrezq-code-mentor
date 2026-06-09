import type { Lesson } from '@/types/lesson'

export const gitWorkflowLesson: Lesson = {
  id: 'do-git-workflow',
  moduleId: 'devops',
  phaseId: 'do-foundations',
  phaseNumber: 1,
  order: 2,
  title: 'Git Workflow & Collaboration',
  description:
    'Branching, commits, merges, rebases, conflicts, hotfixes, and the professional PR workflow used on real teams.',
  duration: '2 h',
  difficulty: 'beginner',
  objectives: [
    'Use feature branches and pull requests confidently',
    'Resolve merge conflicts without panic',
    'Recover from common mistakes (wrong commit, leaked secret)',
    'Choose merge vs rebase vs squash in team workflows',
  ],
  content: [
    {
      type: 'text',
      markdown: `## Why Git matters professionally

Every team you join uses Git. Interviews ask about branching. Incidents start with "who merged what."

**Mental model:** Git is a time machine for your codebase. Each commit is a snapshot. Branches are parallel timelines. Merging combines timelines.`,
    },
    {
      type: 'code',
      language: 'shell',
      filename: 'daily-workflow.sh',
      code: `# Standard professional loop
git checkout main
git pull origin main
git checkout -b feature/add-user-export
# ... edit files ...
git add src/export.py tests/test_export.py
git commit -m "feat: add CSV user export endpoint"
git push -u origin feature/add-user-export
# Open Pull Request on GitHub → review → merge`,
    },
    {
      type: 'exercise',
      title: 'Branch naming',
      description: 'Your team uses prefixes: feature/, fix/, chore/. Name a branch for "fix login timeout on mobile".',
      language: 'shell',
      starterCode: `# branch name:
`,
      solution: `# fix/login-timeout-mobile`,
    },
  ],
}
