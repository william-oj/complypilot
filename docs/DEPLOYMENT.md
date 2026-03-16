# Deployment

## Local development
1. `docker compose up -d` in `infra`.
2. `cd backend && npm install`.
3. `cp .env.example .env` and update values.
4. `npx prisma migrate dev`.
5. `npx prisma db seed`.
6. `npm run dev`.

Frontend:
1. `cd frontend && npm install`.
2. `NEXT_PUBLIC_API_URL=http://localhost:4000 npm run dev`.

## Docker production
- Build API and UI images and push to your registry.
- Use environment variables in `infra/compose.prod.yml`.

## AWS overview
- API: ECS or EKS behind ALB.
- Database: RDS PostgreSQL.
- Redis: ElastiCache.
- Search: OpenSearch.
- Storage: S3.
- Frontend: Vercel or S3 + CloudFront.

## CI/CD
- Build and test on every push.
- Deploy API and UI on main branch.
- Use secrets for database and OpenAI keys.
- Add `GOOGLE_CLIENT_ID` and `MICROSOFT_CLIENT_ID` for OAuth.
