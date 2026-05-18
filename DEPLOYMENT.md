# Deployment Guide

## Prerequisites

- Node.js 20+
- PostgreSQL 16+
- pnpm
- Git
- Vercel account (for frontend)
- Railway account (for backend)
- Neon account (for PostgreSQL)

## Development Setup

### 1. Clone and Install

```bash
git clone https://github.com/aligniq/aligniq.git
cd aligniq
pnpm install
```

### 2. Database Setup

Create a `.env` file:

```
DATABASE_URL=postgresql://user:password@localhost:5432/aligniq
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-min-32-char-secret-key-here
OPENAI_API_KEY=sk-your-key
```

Initialize database:

```bash
pnpm prisma:migrate
pnpm prisma db seed
```

### 3. Run Development Server

```bash
pnpm dev
```

Visit http://localhost:3000

## Production Deployment

### Frontend (Vercel)

1. **Connect GitHub repo**:
   ```bash
   vercel link
   ```

2. **Set environment variables** in Vercel dashboard:
   - `NEXT_PUBLIC_API_URL`
   - `NEXTAUTH_URL`
   - `NEXTAUTH_SECRET`

3. **Deploy**:
   ```bash
   vercel deploy --prod
   ```

### Backend (Railway)

1. **Create Railway project**:
   ```bash
   railway init
   ```

2. **Add PostgreSQL addon**:
   - In Railway dashboard: Add PostgreSQL plugin
   - Copy `DATABASE_URL` to secrets

3. **Deploy**:
   ```bash
   railway up
   ```

### Database (Neon)

1. **Create Neon project**:
   - https://console.neon.tech
   - Create database
   - Copy connection string

2. **Update secrets**:
   ```bash
   railway variables set DATABASE_URL="your-neon-url"
   ```

3. **Run migrations**:
   ```bash
   pnpm prisma migrate deploy
   ```

## Environment Variables (Production)

```
# Neon PostgreSQL
DATABASE_URL=postgresql://user:password@ep-xxx.neon.tech/aligniq

# Authentication
NEXTAUTH_URL=https://aligniq.vercel.app
NEXTAUTH_SECRET=your-production-secret

# OpenAI (for AI features)
OPENAI_API_KEY=sk-prod-key

# Monitoring
SENTRY_DSN=https://xxx@sentry.io/xxx
LOGMANAGER_TOKEN=xxx

# Feature flags
ENABLE_AI_FEATURES=true
ENABLE_ESCALATIONS=true
ENABLE_AUDIT_LOGGING=true
```

## Monitoring & Logging

### Error Tracking (Sentry)

1. Create Sentry project: https://sentry.io
2. Add DSN to environment variables
3. Errors auto-reported

### Analytics (LogRocket)

1. Create LogRocket account
2. Add tracking code to app
3. View UX issues in dashboard

### Performance (Vercel)

- Built-in Web Analytics
- Edge Function monitoring
- Database query insights

## Scaling Strategy

### Database
- Neon auto-scaling (reads/writes)
- Connection pooling with PgBouncer
- Read replicas for reporting

### Caching
- Redis for dashboard queries
- ISR (Incremental Static Regeneration) for charts
- CDN caching (Vercel Edge)

### API Rate Limiting
- 1000 req/min per user
- 100 concurrent connections max
- Queue jobs for escalations

## Backup Strategy

### Database Backups
```bash
# Daily automated backups via Neon
# Manual backup:
pg_dump $DATABASE_URL > backup.sql

# Restore:
psql $DATABASE_URL < backup.sql
```

### Code Backups
- Git history (GitHub)
- Vercel deployments (automatic rollback)
- Railway snapshots

## Performance Optimization

### Frontend
- Next.js Image optimization
- Code splitting & lazy loading
- CSS minification (Tailwind)
- JavaScript tree-shaking

### Backend
- Database query optimization (indexes)
- Connection pooling
- Redis caching
- Gzip compression

### CDN
- Vercel Edge Network
- Cloudflare DDoS protection
- Geographic routing

## Security

### Secrets Management
- Railway Secrets (encrypted at rest)
- Vercel Environment Variables
- Never commit `.env` files
- Rotate keys quarterly

### HTTPS
- Automatic via Vercel
- SSL/TLS certificates
- HSTS headers enabled

### Authentication
- NextAuth.js session management
- JWT tokens (httpOnly cookies)
- CSRF protection
- Rate limiting on auth endpoints

### Data Protection
- PII encryption in transit
- Audit logging (immutable)
- GDPR compliance (data deletion)
- SOX controls for enterprises

## Troubleshooting

### Database Connection Issues
```bash
# Test connection
psql $DATABASE_URL -c "SELECT 1"

# Check Neon status
# https://status.neon.tech
```

### Prisma Migration Stuck
```bash
# Reset (development only)
pnpm prisma:migrate reset

# Production: contact Neon support
```

### Vercel Build Failing
```bash
# Check build logs
vercel logs --prod

# Local build test
pnpm build
```

### Railway Deployment Stuck
```bash
# Check logs
railway logs

# Redeploy
railway up --force
```

## Cost Estimation

### Monthly Costs

| Service | Cost | Notes |
|---------|------|-------|
| Vercel | $20 | Pro plan |
| Railway | $50-200 | Based on usage |
| Neon PostgreSQL | $50-500 | Auto-scaling |
| Sentry | $29 | 50K events |
| Email | $50 | SendGrid |
| **Total** | **$200-800** | Scales with usage |

### Cost Optimization Tips
- Use Neon's compute optimization
- Enable Railway auto-suspend
- Cache aggressively
- Batch database queries
- Archive old audit logs (quarterly)

## Monitoring Checklist

- [ ] Database uptime (Neon dashboard)
- [ ] API response times (Sentry APM)
- [ ] Error rates (<1%)
- [ ] Escalation queue depth
- [ ] User sessions active
- [ ] API rate limit usage
- [ ] Cost trending

---

For additional help, see the [README](./README.md) or contact our team.
