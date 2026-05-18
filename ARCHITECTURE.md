# ALIGNIQ Architecture & Technical Deep Dive

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Client Layer (Vercel)                     │
│  Next.js 15 (React 18) + TypeScript + Tailwind + Framer     │
│                                                              │
│  - Dashboard (CEO/Manager/Employee views)                   │
│  - Goal CRUD (creation, editing, approval)                  │
│  - Analytics (charts, insights, reports)                    │
│  - Real-time notifications (WebSocket ready)                │
└──────────────────┬──────────────────────────────────────────┘
                   │ HTTPS/TLS
                   ▼
┌─────────────────────────────────────────────────────────────┐
│              API Layer (Railway/Fly.io)                      │
│  Express.js OR Next.js Server Actions                       │
│                                                              │
│  /api/goals          - CRUD operations                      │
│  /api/checkins       - Progress updates                     │
│  /api/shared-goals   - KPI management                       │
│  /api/analytics      - Dashboard queries                    │
│  /api/ai             - AI predictions                       │
│  /api/audit          - Compliance logging                   │
│  /api/escalations    - Workflow automation                  │
└──────────────────┬──────────────────────────────────────────┘
                   │ Query/Cache Layer
                   ▼
┌─────────────────────────────────────────────────────────────┐
│              Data Access Layer (Prisma)                      │
│                                                              │
│  - ORM abstraction                                          │
│  - Query optimization                                       │
│  - Connection pooling (PgBouncer)                           │
│  - Caching layer (Redis)                                    │
└──────────────────┬──────────────────────────────────────────┘
                   │ SQL
                   ▼
┌─────────────────────────────────────────────────────────────┐
│         Database Layer (Neon PostgreSQL)                    │
│                                                              │
│  - Users, Goals, Checkins                                   │
│  - SharedGoals, Escalations                                 │
│  - AuditLog, ActivityLog                                    │
│  - Notifications, AIInsights                                │
│  - Read replicas (for analytics)                            │
└─────────────────────────────────────────────────────────────┘
```

## Frontend Architecture

### Directory Structure
```
src/
├── app/
│   ├── (dashboard)/              # Protected routes (with sidebar layout)
│   │   ├── dashboard/page.tsx     # CEO/Manager view
│   │   ├── goals/
│   │   │   ├── create/page.tsx    # New goal form
│   │   │   ├── [id]/page.tsx      # Goal detail + check-in
│   │   │   └── list/page.tsx      # My goals
│   │   ├── team/
│   │   │   └── dashboard/page.tsx # Manager team view
│   │   ├── admin/
│   │   │   └── dashboard/page.tsx # Admin escalations
│   │   ├── analytics/page.tsx     # Org analytics
│   │   └── layout.tsx             # Sidebar + navbar
│   ├── api/                       # API routes
│   ├── layout.tsx                 # Root layout
│   └── page.tsx                   # Home/marketing
├── components/
│   ├── ui/
│   │   ├── Cards.tsx              # KPICard, ProgressBar, StatBadge
│   │   ├── Charts.tsx             # Animated charts (Recharts)
│   │   ├── Forms.tsx              # Button, Input, Select, Textarea
│   │   └── Layout.tsx             # Modal, Tabs, Sidebar, Toast
│   └── features/
│       ├── GoalForm.tsx           # Goal creation form
│       ├── CheckinForm.tsx        # Progress form
│       └── ApprovalFlow.tsx       # Manager workflow
├── services/
│   ├── goalService.ts            # Goal CRUD + validation
│   ├── checkinService.ts         # Check-in logic
│   ├── sharedGoalService.ts      # Shared goal sync
│   ├── escalationService.ts      # Auto-escalation
│   ├── aiService.ts              # AI predictions
│   ├── auditService.ts           # Immutable logging
│   └── notificationService.ts    # Alert system
├── store/
│   └── index.ts                  # Zustand stores (auth, ui)
├── types/
│   ├── index.ts                  # Core types
│   └── api.ts                    # API payloads
├── lib/
│   └── prisma.ts                 # Prisma client
└── styles/
    └── globals.css               # Tailwind + custom classes
```

### State Management (Zustand)
```typescript
// Stores
useAuthStore        // User, login/logout
useUIStore         // Sidebar open, theme
useGoalStore       // Current goals (client cache)
useNotificationStore // Toast notifications

// Usage pattern
const { user } = useAuthStore()
const goals = useGoalStore(s => s.goals)
```

### Data Fetching (TanStack Query)
```typescript
// React Query hooks for server state
useQuery(['goals', userId], () => fetchGoals(userId))
useMutation(createGoal, { onSuccess: () => refetch() })

// Automatic caching, retries, background sync
```

## Backend Architecture

### API Design Pattern
```typescript
// All endpoints follow this pattern
export async function POST(req: NextRequest) {
  try {
    const payload = await req.json()
    
    // Validation
    if (!payload.userId) {
      return NextResponse.json(
        { success: false, error: 'userId required' },
        { status: 400 }
      )
    }

    // Business logic (call service layer)
    const result = await goalService.create(payload)

    // Response
    return NextResponse.json(result, {
      status: result.success ? 201 : 400
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
```

### Service Layer Architecture
```typescript
// services/goalService.ts
export async function createGoal(
  userId: string,
  payload: CreateGoalPayload
): Promise<ApiResponse<Goal>> {
  // Business logic:
  // 1. Validation (weight limits, max goals)
  // 2. Database operation (Prisma create)
  // 3. Side effects (audit log, notifications)
  // 4. Response wrapping
}
```

### Middleware Strategy
```typescript
// Request → Auth Check → Rate Limit → Validation → Service → Response

// Custom middleware for enterprise features
export function withRBAC(requiredRole: Role) {
  return (handler) => async (req) => {
    const user = await getSession(req)
    if (!user || !hasRole(user, requiredRole)) {
      return unauthorized()
    }
    return handler(req)
  }
}

// Usage
export const POST = withRBAC('ADMIN')(createSharedGoal)
```

## Database Schema & Relationships

### Core Entity Relationships
```
User (1) ──has many─→ Goal (many)
         ──has many─→ Checkin (many)
         ──has many─→ AuditLog (many)
         ──has many─→ Notification (many)

Goal (1) ──has many─→ Checkin (many)
       ──has many─→ AuditLog (many)
       ──may link to─→ SharedGoal (1)

SharedGoal (1) ──has many─→ SharedGoalOwner (many)
             ──has many─→ Goal (many)

Escalation ──references─→ Goal (1)
Notification ──references─→ User (1)
AIInsight ──references─→ Goal (1)
```

### Key Indexes for Performance
```sql
-- Fast lookups
CREATE INDEX idx_goals_ownerId ON goals(ownerId);
CREATE INDEX idx_goals_sharedGoalId ON goals(sharedGoalId);
CREATE INDEX idx_checkins_goalId ON checkins(goalId);
CREATE INDEX idx_auditLog_entityId ON "AuditLog"(entityId);

-- Range queries
CREATE INDEX idx_goals_createdAt ON goals(createdAt DESC);
CREATE INDEX idx_checkins_createdAt ON checkins(createdAt DESC);

-- Complex queries
CREATE INDEX idx_goals_composite ON goals(ownerId, status, createdAt);
```

## AI/ML Pipeline Architecture

### Risk Prediction Model
```
Input: Goal data + Check-in history
       ↓
1. Feature Engineering
   - Days since last update
   - Progress velocity (slope)
   - Days until deadline
   - Status history

2. Scoring Algorithm
   - Each feature has weight
   - Score 0-100 (0=safe, 100=critical)
   - Threshold-based alerts (>70 = escalate)

3. Output: AIInsight record
   - Risk score
   - Contributing factors
   - Recommended action
```

### Quarterly Summary Generation
```
Input: User's goals for quarter
       ↓
1. Data Collection
   - Goal count, completion rate
   - Check-in frequency, notes
   - Progress per goal type

2. NLP Processing (OpenAI GPT-4)
   - Template-based prompts
   - Sentiment analysis from notes
   - Trend detection

3. Output: Summary narrative
   - Personalized for employee
   - Data-backed insights
   - Actionable recommendations
```

## Escalation Engine Deep Dive

### Escalation Workflow
```
Trigger Detection (every hour)
  ↓
Check all NOT_STARTED goals
  - Created 2 weeks ago
  - No recent updates
  - No manager follow-up
  ↓
Create Escalation record
  - level: 1 (employee)
  - resolved: false
  ↓
Send Notifications
  - In-app to employee
  - Email reminder
  - Manager alert (if pending)
  ↓
Retry Logic
  - Escalate to level 2 (manager) after 3 days
  - Escalate to level 3 (admin) after 7 days
  ↓
Resolution
  - Mark resolved when goal updated OR
  - Admin marks as completed
```

### Database Triggers (Optional)
```sql
-- Automatically escalate stale goals
CREATE TRIGGER escalate_stale_goals
BEFORE UPDATE ON goals
FOR EACH ROW
WHEN (
  NEW.status = 'NOT_STARTED' AND
  (NOW() - OLD.createdAt) > INTERVAL '14 days'
)
BEGIN
  INSERT INTO escalations (goalId, level, escalatedAt)
  VALUES (NEW.id, 1, NOW());
END;
```

## Caching Strategy

### Query Caching Layers
```
1. Database Query Cache (Prisma)
   - Connection pooling
   - Query plan caching
   - ~100ms latency

2. Redis Cache Layer
   - User goals: 5 min TTL
   - Dashboard KPIs: 1 min TTL
   - Analytics queries: 30 min TTL
   - Invalidate on mutation

3. HTTP Cache Headers
   - Analytics dashboards: 1 min
   - Goal lists: 30 sec
   - User-specific data: private

4. Browser Cache
   - Vercel CDN edge caching
   - Static pages: 24h
   - API responses: 1 min (with revalidation)
```

### Caching Invalidation Pattern
```typescript
// When creating goal:
await prisma.goal.create(...)
await invalidateCache([
  `/api/goals?userId=${userId}`,  // User goals
  `/api/analytics/dashboard`,      // KPIs
  `user:${userId}:goals`          // Redis key
])
```

## Performance Optimization

### Database Query Optimization
```typescript
// ❌ Bad: N+1 queries
const goals = await prisma.goal.findMany({ where: { ownerId } })
for (const goal of goals) {
  const checkins = await prisma.checkin.findMany({ where: { goalId: goal.id } })
}

// ✅ Good: Single query with join
const goals = await prisma.goal.findMany({
  where: { ownerId },
  include: { checkins: { take: 5, orderBy: { createdAt: 'desc' } } }
})
```

### Frontend Performance
```typescript
// Code splitting
const Analytics = dynamic(() => import('./Analytics'), { loading: () => <Skeleton /> })

// Image optimization
<Image src={url} width={400} height={300} priority={false} />

// Lazy loading components
<Suspense fallback={<ChartSkeleton />}>
  <AnimatedChart data={data} />
</Suspense>
```

## Security Architecture

### Authentication Flow
```
1. User logs in (email/password)
   ↓
2. NextAuth.js creates session
   ↓
3. Session stored in httpOnly cookie
   ↓
4. API routes check session
   ↓
5. RBAC validation (role-based access)
   ↓
6. Data returned based on user role
```

### RBAC Matrix
```
Resource          | EMPLOYEE | MANAGER | ADMIN
──────────────────┼──────────┼─────────┼──────
Own Goals         | R/W      | R/W     | R/W
Team Goals        | R        | R/W     | R/W
Shared Goals      | R        | R/W     | R/W/A
Approvals         | —        | A       | A
Escalations       | —        | R       | R/W/A
Audit Log         | Own      | Team    | All
Reports           | Own      | Team    | Org
```

### Audit Logging Strategy
```typescript
// Every mutation logs:
{
  actorId: currentUser.id,
  entityType: 'Goal',
  entityId: goal.id,
  field: 'status',
  oldValue: 'NOT_STARTED',
  newValue: 'ON_TRACK',
  timestamp: NOW()
}

// Immutable (can only SELECT, never UPDATE/DELETE)
// Full compliance with SOX/HIPAA requirements
```

## Scalability Plan

### Horizontal Scaling (10K+ users)
```
Load Balancer (Vercel/Cloudflare)
    ↓
├─ API Node 1 (Railway container)
├─ API Node 2 (Railway container)
└─ API Node 3 (Railway container)
    ↓
Connection Pool (PgBouncer)
    ↓
PostgreSQL Primary (write)
    ↓
├─ Read Replica 1 (analytics)
├─ Read Replica 2 (reports)
└─ Read Replica 3 (backup)
```

### Database Optimization
```sql
-- Partitioning large tables by date
ALTER TABLE "AuditLog"
PARTITION BY RANGE (YEAR(timestamp)) (
  PARTITION p2026 VALUES LESS THAN (2027),
  PARTITION p2027 VALUES LESS THAN (2028),
  PARTITION pmax VALUES LESS THAN (MAXVALUE)
);

-- Archive old data
DELETE FROM "AuditLog" WHERE timestamp < NOW() - INTERVAL '2 years';
```

### Queue-based Processing
```typescript
// Escalation engine runs async
import Bull from 'bull'

const escalationQueue = new Bull('escalations', redisUrl)

escalationQueue.process(async (job) => {
  const staleGoals = await findStaleGoals()
  for (const goal of staleGoals) {
    await createEscalation(goal)
    await sendNotification(goal.owner)
  }
})

// Schedule to run hourly
schedule.scheduleJob('0 * * * *', () => {
  escalationQueue.add({}, { repeat: { cron: '0 * * * *' } })
})
```

## Monitoring & Observability

### Metrics to Track
```
Application Metrics:
- API response time (target: <100ms p95)
- Database query time (target: <50ms)
- Cache hit rate (target: >80%)
- Error rate (target: <0.1%)

Business Metrics:
- Goals created per day
- Check-ins submitted per day
- Escalations triggered per day
- Average goal completion rate

Infrastructure:
- CPU usage (target: <70%)
- Memory usage (target: <75%)
- Database connections (target: <80%)
- API rate limit usage
```

### Logging Strategy
```typescript
// Structured logging
logger.info('goal_created', {
  goalId,
  userId,
  weight,
  type,
  duration_ms: Date.now() - startTime
})

// Error logging with context
logger.error('escalation_failed', {
  goalId,
  reason,
  stack,
  user_id,
  retry_count
})

// Sent to centralized logging (CloudWatch, Datadog, Sentry)
```

---

This architecture is designed for:
- ✅ **Scalability**: Handle 10K+ concurrent users
- ✅ **Performance**: <100ms API latency at p95
- ✅ **Reliability**: 99.9% uptime SLA
- ✅ **Compliance**: SOX/HIPAA audit-ready
- ✅ **Developer Experience**: Clear separation of concerns
- ✅ **Cost Efficiency**: Serverless where possible
