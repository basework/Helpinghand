# Referral Qualification System - Deployment Checklist

## Pre-Deployment

- [ ] Back up your Supabase database
- [ ] Review REFERRAL_QUALIFICATION_SYSTEM.md for complete details
- [ ] Test API endpoints locally if possible

---

## Step 1: Database Migrations (Supabase)

Execute in your Supabase SQL editor in this order:

### Migration 005: Add Status Column
```sql
-- File: scripts/005_add_referral_status.sql
ALTER TABLE public.referrals 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'COMPLETED'));

CREATE INDEX IF NOT EXISTS idx_referrals_status ON public.referrals(status);
CREATE INDEX IF NOT EXISTS idx_referrals_referred_status ON public.referrals(referred_id, status);
```

**Verify:** 
- [ ] Column `status` exists on `referrals` table
- [ ] Default value is 'PENDING'
- [ ] Two indexes created

### Migration 006: Add Functions
```sql
-- File: scripts/006_referral_qualification_functions.sql
-- (Execute the entire SQL file)
```

**Verify:**
- [ ] Function `check_referral_qualification()` exists
- [ ] Function `update_referral_status_for_user()` exists

---

## Step 2: Deploy Code Changes

1. **Pull latest code** from your repo
2. **Verify files exist:**
   - [ ] `app/api/referral-qualification-check/route.ts` (NEW)
   - [ ] `app/task/page.tsx` (MODIFIED)
   - [ ] `app/api/user-balance/route.ts` (MODIFIED)
   - [ ] `app/api/referral-stats/route.ts` (MODIFIED)

3. **Build locally:**
   ```bash
   npm run build
   ```
   - [ ] Build succeeds with no errors

4. **Deploy to production:**
   ```bash
   # Your deployment command
   # (Vercel, Netlify, etc.)
   ```

---

## Step 3: Verify Deployment

### Test Endpoints

1. **Check referral stats endpoint:**
   ```bash
   curl "http://localhost:3000/api/referral-stats?userId=YOUR_USER_ID"
   ```
   - [ ] Response includes `referrals`, `completed_count`, `pending_count`

2. **Test qualification check (POST):**
   ```bash
   curl -X POST "http://localhost:3000/api/referral-qualification-check" \
     -H "Content-Type: application/json" \
     -d '{"userId":"YOUR_USER_ID"}'
   ```
   - [ ] Response includes `qualified` status

3. **Test qualification check (GET):**
   ```bash
   curl "http://localhost:3000/api/referral-qualification-check?userId=YOUR_USER_ID"
   ```
   - [ ] Response includes balance and qualification details

### Test User Flow

1. **Create test user A** (referrer)
2. **Create test user B** with referrer A's code (referee)
3. **Verify referral created:**
   ```bash
   curl "http://localhost:3000/api/referral-stats?userId=USER_A_ID"
   ```
   - [ ] New referral appears in `referrals` array
   - [ ] Status is `PENDING`

4. **Simulate task earnings:** 
   - Manually update User B's balance to 65,000 via DB or API
   
5. **Check referral status:**
   ```bash
   curl "http://localhost:3000/api/referral-stats?userId=USER_A_ID"
   ```
   - [ ] Referral status changed to `COMPLETED`
   - [ ] `completed_count` increased to 1

---

## Step 4: Monitor

After deployment, monitor for:

- [ ] No API errors in logs
- [ ] Referral qualification checks completing silently
- [ ] Referral statuses updating correctly when balance reaches 60,000
- [ ] No user-facing changes or confusion

---

## Rollback Plan

If issues occur:

1. **Database Rollback:**
   ```sql
   -- Revert to before migration 005
   ALTER TABLE public.referrals DROP COLUMN IF EXISTS status;
   DROP INDEX IF EXISTS idx_referrals_status;
   DROP INDEX IF EXISTS idx_referrals_referred_status;
   DROP FUNCTION IF EXISTS check_referral_qualification(UUID);
   DROP FUNCTION IF EXISTS update_referral_status_for_user(UUID);
   ```

2. **Code Rollback:**
   - Revert to previous commit
   - Redeploy

---

## Post-Deployment

- [ ] All tests pass
- [ ] No error reports from users
- [ ] Monitor logs for 24+ hours
- [ ] Confirm referral statuses updating correctly

---

## Support

Issues? Check:
1. REFERRAL_QUALIFICATION_SYSTEM.md for detailed docs
2. Ensure all 4 API changes are deployed
3. Verify both SQL migrations executed successfully
4. Check browser console for client-side errors
5. Check server logs for API errors

---

## Completion Date

- [ ] Deployment Start: _______________
- [ ] Database Migrations: _______________
- [ ] Code Deployment: _______________
- [ ] Testing Complete: _______________
- [ ] Production Verified: _______________
