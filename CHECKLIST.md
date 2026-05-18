# ALIGNIQ Development Checklist

## 🚀 Pre-Launch Checklist

Use this checklist to ensure everything is ready before launch.

---

## Phase 1: Local Setup ✅

- [ ] **Clone/Extract Project**
  - Project location: `d:/Atomberg/atomberg_vs/`
  - All files present: See `INDEX.md` for file list

- [ ] **Install Dependencies**
  ```bash
  pnpm install
  ```
  - Verify: `pnpm --version` shows 8+
  - Check: `node --version` shows 20+

- [ ] **Configure Environment**
  ```bash
  cp .env.example .env
  ```
  - Add: `DATABASE_URL` from Neon PostgreSQL
  - Add: `NEXTAUTH_SECRET` (32+ chars)
  - Add: `OPENAI_API_KEY` if using AI features

- [ ] **Setup Database**
  ```bash
  pnpm prisma:migrate
  pnpm prisma db seed
  ```
  - Verify: Database created in PostgreSQL
  - Verify: Tables present (10 models)
  - Verify: Demo data seeded

- [ ] **Run Development Server**
  ```bash
  pnpm dev
  ```
  - Verify: Server runs on `http://localhost:3000`
  - Verify: No TypeScript errors
  - Verify: No console errors

---

## Phase 2: Local Testing ✅

### Test All Pages
- [ ] Home page (`/`) loads and displays
- [ ] Dashboard (`/dashboard`) shows overview
- [ ] Goals page (`/goals/create`) shows form
- [ ] Goal detail (`/goals/[id]`) loads
- [ ] Team dashboard (`/team/dashboard`) displays
- [ ] Admin dashboard (`/admin/dashboard`) loads
- [ ] Analytics page (`/analytics`) shows charts

### Test Core Features
- [ ] Can create a new goal
- [ ] Goal form validates weightage (100% total)
- [ ] Can submit check-in/progress
- [ ] Progress bar updates correctly
- [ ] Status changes (Not Started → On Track → Complete)
- [ ] Can see audit logs
- [ ] Charts render with data
- [ ] Navigation works (sidebar, breadcrumbs)

### Test UI/UX
- [ ] Dark theme displays correctly
- [ ] Glass effects visible (frosted glass)
- [ ] Animations run smoothly
- [ ] Responsive on mobile (shrink window)
- [ ] Responsive on tablet (iPad view)
- [ ] Responsive on desktop
- [ ] No layout shifts or jumps
- [ ] Buttons are clickable

### Test Authentication (When Implemented)
- [ ] Login page loads
- [ ] Can login with demo account
- [ ] Session persists on refresh
- [ ] Can logout
- [ ] Protected routes redirect to login
- [ ] Different roles see different pages

---

## Phase 3: Code Quality ✅

- [ ] **Type Checking**
  ```bash
  pnpm tsc --noEmit
  ```
  - No TypeScript errors
  - No `any` types (strict mode enabled)

- [ ] **Linting** (When configured)
  ```bash
  pnpm lint
  ```
  - No linting errors
  - No style violations

- [ ] **Build Test**
  ```bash
  pnpm build
  ```
  - Build completes successfully
  - No warnings (resolve any)
  - Bundle size reasonable (<5MB)

- [ ] **Code Review Checklist**
  - [ ] All services use proper error handling
  - [ ] API routes validate input
  - [ ] Database queries use proper includes
  - [ ] No N+1 queries
  - [ ] Components use proper memo/useMemo
  - [ ] State management is centralized (Zustand)
  - [ ] No hardcoded values (use constants)
  - [ ] Comments explain "why", not "what"

---

## Phase 4: Database Verification ✅

- [ ] **Schema Check**
  ```bash
  pnpm prisma studio
  ```
  - All 10 models present
  - All relationships configured
  - No missing fields

- [ ] **Data Integrity**
  - [ ] Demo users created
  - [ ] Demo goals created
  - [ ] Demo check-ins created
  - [ ] Relationships intact
  - [ ] No orphaned records

- [ ] **Indexes Present**
  - [ ] Index on `goals.ownerId`
  - [ ] Index on `goals.sharedGoalId`
  - [ ] Index on `checkins.goalId`
  - [ ] Index on `auditLog.entityId`
  - [ ] Index on date fields

---

## Phase 5: API Testing ✅

Test using Postman/cURL or similar tool:

- [ ] **Goals Endpoints**
  - [ ] POST `/api/goals` creates goal
  - [ ] GET `/api/goals?userId=xxx` returns goals
  - [ ] GET `/api/goals/[id]` returns detail
  - [ ] PATCH `/api/goals/[id]` updates status

- [ ] **Check-ins Endpoints**
  - [ ] POST `/api/checkins` creates check-in
  - [ ] GET `/api/checkins?goalId=xxx` returns history

- [ ] **AI Endpoints**
  - [ ] GET `/api/ai/risk?goalId=xxx` returns score
  - [ ] POST `/api/ai/summary` generates text

- [ ] **Audit Endpoints**
  - [ ] GET `/api/audit?entityId=xxx` returns trail
  - [ ] GET `/api/audit?action=feed` returns activity
  - [ ] POST `/api/audit/compliance` returns report

- [ ] **Error Handling**
  - [ ] Invalid input returns 400
  - [ ] Missing auth returns 401
  - [ ] Invalid ID returns 404
  - [ ] Server error returns 500 with message

---

## Phase 6: Performance Testing ✅

- [ ] **Page Load Time**
  - Homepage: <2s
  - Dashboard: <2s
  - Analytics: <3s

- [ ] **API Response Time**
  - Goal creation: <500ms
  - Check-in submission: <500ms
  - Goal list: <300ms

- [ ] **Database Query Time**
  - Average query: <50ms
  - Complex queries: <100ms

- [ ] **Build Size**
  - Total bundle: <5MB
  - Main JS: <1MB

---

## Phase 7: Security Checklist ✅

- [ ] **Authentication**
  - [ ] NextAuth.js configured
  - [ ] Session cookie is httpOnly
  - [ ] Session secret is secure (32+ chars)
  - [ ] CORS configured properly

- [ ] **Authorization**
  - [ ] RBAC middleware works
  - [ ] Employees can't access admin pages
  - [ ] Managers can't modify other team's goals

- [ ] **Input Validation**
  - [ ] API validates all inputs
  - [ ] Forms validate before submit
  - [ ] No SQL injection (Prisma prevents)

- [ ] **Sensitive Data**
  - [ ] Passwords never logged
  - [ ] API keys not in code
  - [ ] Database URL in .env only

- [ ] **HTTPS/TLS**
  - [ ] Development uses HTTPS ready
  - [ ] Production requires HTTPS

---

## Phase 8: Deployment Preparation ✅

### Frontend (Vercel)
- [ ] Connect GitHub repository
- [ ] Add environment variables to Vercel
- [ ] Configure build settings
  - Build command: `pnpm build`
  - Output directory: `.next`
- [ ] Setup preview deployments
- [ ] Setup automatic deployments on push
- [ ] Test deployment to staging first
- [ ] Verify custom domain (if using)

### Backend (Railway)
- [ ] Create Railway project
- [ ] Connect GitHub repository
- [ ] Add environment variables
- [ ] Configure service (Node.js)
- [ ] Set build command: `pnpm install`
- [ ] Set start command: `pnpm start` or `node server.js`
- [ ] Deploy to staging first
- [ ] Verify health check endpoint works

### Database (Neon)
- [ ] Create Neon project
- [ ] Get connection string
- [ ] Add to Railway environment variables
- [ ] Run migrations on production
- [ ] Verify database is accessible
- [ ] Setup automated backups
- [ ] Setup point-in-time recovery

### GitHub Actions CI/CD
- [ ] CI/CD workflow configured (`.github/workflows/ci-cd.yml`)
- [ ] Runs on every push to main
- [ ] Runs tests (when added)
- [ ] Builds successfully
- [ ] Deploys to staging automatically
- [ ] Can manually deploy to production

---

## Phase 9: Monitoring Setup ✅

- [ ] **Error Tracking (Sentry)**
  - [ ] Add SENTRY_DSN to environment
  - [ ] Test error logging
  - [ ] Alerts configured

- [ ] **Analytics (Vercel)**
  - [ ] Web vitals tracking enabled
  - [ ] Performance monitoring active
  - [ ] Error rate monitoring

- [ ] **Database Monitoring (Neon)**
  - [ ] Query performance visible
  - [ ] Connection count monitored
  - [ ] Storage usage tracked

- [ ] **Uptime Monitoring**
  - [ ] Setup uptime checks
  - [ ] Configure alerts
  - [ ] Status page ready

---

## Phase 10: Documentation Verification ✅

- [ ] **README.md**
  - [ ] Quick start works
  - [ ] Project overview clear
  - [ ] Links working

- [ ] **QUICKSTART.md**
  - [ ] Setup instructions are accurate
  - [ ] Commands work as written
  - [ ] Troubleshooting section helpful

- [ ] **ARCHITECTURE.md**
  - [ ] Diagrams render correctly
  - [ ] Explanations are clear
  - [ ] Code patterns explained

- [ ] **DEPLOYMENT.md**
  - [ ] Deployment steps are accurate
  - [ ] Environment variables listed
  - [ ] Scaling guide is helpful

- [ ] **API Documentation**
  - [ ] All endpoints documented
  - [ ] Request/response formats shown
  - [ ] Error codes listed

---

## Phase 11: Team Readiness ✅

- [ ] **Developer Onboarding**
  - [ ] All developers can clone and run locally
  - [ ] No setup issues for new team members
  - [ ] Documentation is clear
  - [ ] Code style guide available

- [ ] **Knowledge Transfer**
  - [ ] Architecture walkthrough done
  - [ ] Database schema explained
  - [ ] API design patterns understood
  - [ ] Deployment process known

- [ ] **Code Standards**
  - [ ] ESLint configured
  - [ ] Prettier configured
  - [ ] Commit message convention set
  - [ ] PR review checklist created

- [ ] **Testing Strategy**
  - [ ] Unit test approach defined
  - [ ] Integration test strategy set
  - [ ] E2E test framework chosen
  - [ ] Code coverage targets set

---

## Phase 12: Launch Readiness ✅

- [ ] **Final QA**
  - [ ] All pages tested manually
  - [ ] All workflows tested end-to-end
  - [ ] No console errors
  - [ ] No TypeScript errors
  - [ ] Performance acceptable

- [ ] **Production Readiness**
  - [ ] All environment variables set
  - [ ] Database backups configured
  - [ ] Monitoring active
  - [ ] Error tracking working
  - [ ] Logs aggregated

- [ ] **Go/No-Go Decision**
  - [ ] All critical bugs fixed
  - [ ] Performance acceptable
  - [ ] Security audit complete
  - [ ] Team confident in launch
  - [ ] Rollback plan ready

- [ ] **Launch Day**
  - [ ] Team online and available
  - [ ] Monitoring dashboards open
  - [ ] Communication channels active
  - [ ] Customer support ready
  - [ ] Post-launch plan ready

---

## Quick Commands Reference

```bash
# Setup
pnpm install
cp .env.example .env

# Database
pnpm prisma:migrate
pnpm prisma db seed
pnpm prisma studio

# Development
pnpm dev              # Start dev server
pnpm tsc --noEmit    # Type check
pnpm build           # Build for production
pnpm start           # Start production server

# Deployment
vercel deploy --prod      # Deploy frontend
railway up                # Deploy backend
git push origin main      # Trigger CI/CD
```

---

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| TypeScript errors | Run `pnpm tsc --noEmit` to see all errors |
| Build fails | Check Node version (20+), clear `.next/` folder |
| Database connection | Verify DATABASE_URL in .env |
| Port 3000 in use | Kill process: `lsof -i :3000` on Mac/Linux |
| Prisma migration fails | Reset (dev only): `pnpm prisma migrate reset` |
| Styles not loading | Restart dev server, check Tailwind config |

---

## Success Criteria

✅ All pages load without errors
✅ All features work as designed
✅ TypeScript strict mode passes
✅ Database has correct schema
✅ API endpoints respond correctly
✅ Performance is acceptable
✅ Security measures in place
✅ Documentation is complete
✅ Team is ready to deploy
✅ Monitoring is active

---

## Notes for Team

- Keep this checklist visible during development
- Check off items as you verify them
- Don't proceed to next phase if current phase has unchecked items
- Escalate blockers immediately
- Update this document if you find issues not listed

---

**Ready to launch?** When all items are checked, you're good to go! 🚀

**Questions?** Refer to INDEX.md for documentation map.
