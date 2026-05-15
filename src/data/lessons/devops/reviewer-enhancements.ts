import type { LessonEnhancement } from '@/lib/curriculum/reviewer-types'
import { roadmapIntro } from '@/lib/curriculum/reviewer-merge'

export const DEVOPS_REVIEWER: Record<string, LessonEnhancement> = {
  'do-linux-shell': { intro: [roadmapIntro('devops', 'Foundations', 'Linux, shell, logs, processes')] },
  'do-docker-basics': { intro: [roadmapIntro('docker', 'Foundations', 'images, containers, Dockerfile')] },
  'do-docker-compose': { intro: [roadmapIntro('docker', 'Foundations', 'Compose, local stacks')] },
  'do-networking': { intro: [roadmapIntro('devops', 'Foundations', 'DNS, TLS, ports, debugging')] },
  'do-aws-iam': { intro: [roadmapIntro('aws', 'AWS', 'IAM, roles, least privilege')] },
  'do-aws-compute': { intro: [roadmapIntro('aws', 'AWS', 'EC2, Lambda')] },
  'do-aws-storage': { intro: [roadmapIntro('aws', 'AWS', 'S3, RDS, backups')] },
  'do-aws-vpc': { intro: [roadmapIntro('aws', 'AWS', 'VPC, subnets, security groups')] },
  'do-kubernetes-core': { intro: [roadmapIntro('kubernetes', 'Orchestration', 'pods, deployments, services')] },
  'do-terraform': { intro: [roadmapIntro('terraform', 'Orchestration', 'IaC, state, modules')] },
  'do-cicd': { intro: [roadmapIntro('devops', 'Orchestration', 'CI/CD pipelines')] },
  'do-gitops': { intro: [roadmapIntro('kubernetes', 'Orchestration', 'GitOps, Helm')] },
  'do-metrics': { intro: [roadmapIntro('devops', 'Observability', 'Prometheus, alerts')] },
  'do-logging': { intro: [roadmapIntro('devops', 'Observability', 'structured logs, aggregation')] },
  'do-tracing': { intro: [roadmapIntro('devops', 'Observability', 'OpenTelemetry, traces')] },
  'do-oncall': { intro: [roadmapIntro('devops', 'Observability', 'incidents, postmortems')] },
}
