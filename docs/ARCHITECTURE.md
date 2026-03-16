# Architecture

## High-level overview
ComplyPilot is a multi-tenant SaaS platform composed of a Next.js frontend, Node.js API, PostgreSQL database, Redis + BullMQ jobs, Elasticsearch search, S3-compatible storage, and OpenAI-powered assistant.

```
[Browser] -> [Next.js UI] -> [API Gateway / Express]
                                  |-> PostgreSQL (Prisma)
                                  |-> Redis (BullMQ)
                                  |-> Elasticsearch
                                  |-> S3 (Evidence + Policies)
                                  |-> OpenAI API (assistant)
```

## Key flows
- **Journey wizard:** UI pulls `/journey` to compute stage completion and renders the stepper.
- **Risk engine:** `Risk = Likelihood x Impact`, with severity tiers. Treatments trigger control recommendations.
- **Control mapping:** `riskTreatmentService` maps risk keywords to Annex A control IDs and creates implementation placeholders.
- **Policy generator:** Templates rendered with org data and exported to PDF/DOCX.
- **Evidence collection:** File uploads stored in S3, mapped to controls and risks.
- **Internal audit:** Audit, findings, corrective actions, and mock audit readiness.

## Multi-tenancy
All tenant-specific tables include `orgId`. Organization context is derived from the `x-org-id` header, enforced by middleware.

## Security layers
- JWT authentication
- RBAC with organization roles
- Rate limiting, helmet, input validation
- Optional encryption for sensitive fields

## Services
- `backend/src/services/*` for domain logic and integrations
- `backend/src/controllers/*` for HTTP endpoints
- `backend/src/jobs/*` for async indexing
