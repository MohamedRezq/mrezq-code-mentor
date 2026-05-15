import type { Lesson } from '@/types/lesson'

export const devopsAwsLessons: Lesson[] = [
  {
    id: 'do-aws-iam',
    moduleId: 'devops',
    phaseId: 'do-aws',
    phaseNumber: 2,
    order: 1,
    title: 'AWS IAM & Least Privilege',
    description: 'Users, roles, policies, OIDC for CI, and never using root for daily work.',
    duration: '1 h',
    difficulty: 'intermediate',
    objectives: ['Write least-privilege IAM policies', 'Use roles for EC2/Lambda/CI', 'Enable MFA on humans', 'Audit with IAM Access Analyzer'],
    content: [
      {
        type: 'callout',
        tone: 'production',
        title: 'Role, not long-lived keys',
        content: 'GitHub Actions → OIDC → IAM role. Avoid AKIA access keys in secrets when possible.',
      },
      {
        type: 'exercise',
        title: 'Policy scope',
        description: 'App only needs read/write one S3 bucket. Resource ARN pattern?',
        language: 'json',
        starterCode: `// Resource:
`,
        solution: `// "arn:aws:s3:::my-bucket/*" plus ListBucket on bucket ARN`,
      },
    ],
  },
  {
    id: 'do-aws-compute',
    moduleId: 'devops',
    phaseId: 'do-aws',
    phaseNumber: 2,
    order: 2,
    title: 'EC2, Lambda & When to Use Each',
    description: 'VMs vs serverless, cold starts, VPC for Lambda, and cost model basics.',
    duration: '1.5 h',
    difficulty: 'intermediate',
    objectives: ['Choose Lambda for event spikes', 'Use EC2/ECS for long-running state', 'Understand cold start impact', 'Place Lambda in VPC only when needed'],
    content: [
      {
        type: 'exercise',
        title: 'Lambda fit',
        description: 'Webhook handler 200ms avg, 50 req/s bursty. Lambda or EC2?',
        language: 'javascript',
        starterCode: `// choice:
`,
        solution: `// Lambda — pay per invoke, scales to zero, fits short bursty work`,
      },
    ],
  },
  {
    id: 'do-aws-storage',
    moduleId: 'devops',
    phaseId: 'do-aws',
    phaseNumber: 2,
    order: 3,
    title: 'S3, RDS & Backups',
    description: 'S3 tiers, versioning, RDS Multi-AZ, snapshots, and restore drills.',
    duration: '1.5 h',
    difficulty: 'intermediate',
    objectives: ['Pick S3 storage class', 'Enable versioning for critical buckets', 'Explain RDS failover', 'Automate snapshot retention'],
    content: [
      {
        type: 'exercise',
        title: 'S3 tier',
        description: 'Logs accessed once a month for compliance. Standard or Glacier?',
        language: 'javascript',
        starterCode: `// tier:
`,
        solution: `// Glacier / Intelligent-Tiering — cheaper for rare access`,
      },
    ],
  },
  {
    id: 'do-aws-vpc',
    moduleId: 'devops',
    phaseId: 'do-aws',
    phaseNumber: 2,
    order: 4,
    title: 'VPC, Subnets & Security Groups',
    description: 'Public/private subnets, NAT gateway, security groups vs NACLs.',
    duration: '1.5 h',
    difficulty: 'advanced',
    objectives: ['Draw a 3-tier VPC diagram', 'Place databases in private subnets', 'Restrict SG ingress to app tier only', 'Avoid 0.0.0.0/0 on SSH'],
    content: [
      {
        type: 'exercise',
        title: 'DB placement',
        description: 'Where does RDS live — public or private subnet? Why?',
        language: 'javascript',
        starterCode: `// answer:
`,
        solution: `// private subnet — no direct internet route; app tier connects via SG rules`,
      },
    ],
  },
]
