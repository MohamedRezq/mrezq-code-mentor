import type { Lesson } from '@/types/lesson'

export const devopsOrchestrationLessons: Lesson[] = [
  {
    id: 'do-kubernetes-core',
    moduleId: 'devops',
    phaseId: 'do-orchestration',
    phaseNumber: 3,
    order: 1,
    title: 'Kubernetes Core Concepts',
    description: 'Pods, Deployments, Services, ConfigMaps, Secrets, and kubectl essentials.',
    duration: '2 h',
    difficulty: 'advanced',
    objectives: ['Map pods to containers', 'Roll out with Deployments', 'Expose with ClusterIP/LoadBalancer', 'Inject config without image rebuild'],
    content: [
      {
        type: 'code',
        language: 'yaml',
        filename: 'deployment.yaml',
        code: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: api
spec:
  replicas: 3
  selector:
    matchLabels: { app: api }
  template:
    metadata:
      labels: { app: api }
    spec:
      containers:
        - name: api
          image: my/api:1.2.0
          ports: [{ containerPort: 3000 }]`,
      },
      {
        type: 'exercise',
        title: 'Pod vs Deployment',
        description: 'Why not run bare Pods in production?',
        language: 'yaml',
        starterCode: `# reason:
`,
        solution: `# Deployments restart failed pods, manage replicas, rolling updates`,
      },
    ],
  },
  {
    id: 'do-terraform',
    moduleId: 'devops',
    phaseId: 'do-orchestration',
    phaseNumber: 3,
    order: 2,
    title: 'Terraform & Infrastructure as Code',
    description: 'Providers, state, plan/apply, modules, and locking remote state.',
    duration: '1.5 h',
    difficulty: 'intermediate',
    objectives: ['Write basic Terraform resources', 'Use remote state (S3 + lock)', 'Organize modules by domain', 'Never commit secrets to .tf'],
    content: [
      {
        type: 'code',
        language: 'hcl',
        filename: 'main.tf',
        code: `resource "aws_s3_bucket" "logs" {
  bucket = "my-app-logs-prod"
}

terraform {
  backend "s3" {
    bucket = "tf-state"
    key    = "prod/terraform.tfstate"
    region = "us-east-1"
  }
}`,
      },
      {
        type: 'exercise',
        title: 'State lock',
        description: 'Two engineers terraform apply at once without lock. Risk?',
        language: 'hcl',
        starterCode: `// risk:
`,
        solution: `// corrupted state, duplicate/conflicting resources — use DynamoDB lock table`,
      },
    ],
  },
  {
    id: 'do-cicd',
    moduleId: 'devops',
    phaseId: 'do-orchestration',
    phaseNumber: 3,
    order: 3,
    title: 'CI/CD Pipelines',
    description: 'GitHub Actions, build/test/deploy stages, preview envs, and rollback.',
    duration: '1.5 h',
    difficulty: 'intermediate',
    objectives: ['Structure pipeline stages', 'Cache dependencies in CI', 'Deploy on main with approval gates', 'Rollback via previous image tag'],
    content: [
      {
        type: 'code',
        language: 'yaml',
        filename: 'ci.yml',
        code: `jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci && npm test
  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - run: vercel deploy --prod`,
      },
      {
        type: 'exercise',
        title: 'Fail deploy',
        description: 'Tests pass but smoke test fails post-deploy. What should pipeline do?',
        language: 'yaml',
        starterCode: `# action:
`,
        solution: `# fail job, alert, auto-rollback or block promotion, keep previous version live`,
      },
    ],
  },
  {
    id: 'do-gitops',
    moduleId: 'devops',
    phaseId: 'do-orchestration',
    phaseNumber: 3,
    order: 4,
    title: 'GitOps & Helm',
    description: 'Declarative cluster state from git, Helm charts, values per environment.',
    duration: '1 h',
    difficulty: 'advanced',
    objectives: ['Explain pull-based GitOps (Argo CD)', 'Package K8s manifests in Helm', 'Override values for staging/prod', 'Review diffs before sync'],
    content: [
      {
        type: 'exercise',
        title: 'GitOps benefit',
        description: 'One benefit of git as source of truth for cluster config.',
        language: 'yaml',
        starterCode: `// benefit:
`,
        solution: `// auditable history, PR review for infra changes, easy rollback via revert`,
      },
    ],
  },
]
