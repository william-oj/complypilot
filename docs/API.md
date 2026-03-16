# API Documentation

Base URL: `http://localhost:4000`

Authentication: use `Authorization: Bearer <token>` and `x-org-id` header for org scoped routes.

## Auth
- `POST /auth/register` { email, password, name?, organizationName? }
- `POST /auth/login` { email, password }
- `POST /auth/oauth` { provider: google|microsoft, idToken, organizationName? }

## Organizations
- `GET /organizations`
- `POST /organizations` { name, legalName?, industry?, size?, country?, timezone? }

## Assets
- `GET /assets`
- `POST /assets` { name, type, classification?, owner?, location?, criticality?, confidentiality?, integrity?, availability? }
- `PUT /assets/:id`
- `DELETE /assets/:id`

## Risks
- `GET /risks`
- `POST /risks` { title, description?, assetId?, likelihood, impact, owner? }
- `PUT /risks/:id`
- `POST /risks/:id/treatments` { treatment, plan?, owner?, targetDate? }

## Controls
- `GET /controls`
- `PUT /controls/:id` { status?, owner?, notes? }

## Policies
- `GET /policies/templates`
- `GET /policies`
- `POST /policies/generate` { templateId, title?, variables?, format? }
- `PUT /policies/:id` { title?, content?, status? }

## Evidence
- `GET /evidence`
- `POST /evidence` (multipart) { title, description?, type?, controlImplementationId?, riskId?, file }

## Audits
- `GET /audits`
- `POST /audits` { title, scope?, scheduledAt?, auditor? }
- `PUT /audits/:id` { status }
- `POST /audits/:id/findings`
- `POST /findings/:id/actions`
- `GET /audits/mock`

## Dashboard and Journey
- `GET /dashboard`
- `GET /journey`
- `GET /badges`

## Search
- `GET /search?q=...&type=assets|risks|policies`

## AI Assistant
- `POST /ai/assist` { prompt }

Swagger: `http://localhost:4000/docs`
