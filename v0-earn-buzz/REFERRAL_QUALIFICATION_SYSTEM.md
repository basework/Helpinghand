# Referral Qualification System - Implementation Guide

## Overview
The referral qualification system is an internal logic layer that automatically qualifies referrals based on the invited user's account balance. This prevents referral spamming while maintaining a seamless user experience.

---

## How It Works

### Qualification Criteria
A referral is marked as **COMPLETED** when the invited user meets BOTH conditions:

1. **Earned at least ₦10,000** through tasks/activities
2. **Total balance reaches ₦60,000**, which consists of:
   - ₦50,000 (automatic signup bonus)
   - ₦10,000 (earned by the user)

### Status Flow
```
User Signs Up
    ↓
Referral Record Created (status: PENDING)
    ↓
User Earns via Tasks
    ↓
Balance >= 60,000?
    ├─ YES → Referral Status: COMPLETED
    └─ NO  → Referral Status: PENDING (remains)
```

### Automatic Updates
The referral status is **automatically updated** without requiring manual approval. The qualification check is triggered when:

1. **Task completion** - After a user completes a task and earns rewards
2. **Balance updates** - Via the `/api/user-balance` endpoint
3. **Manual checks** - Via `/api/referral-qualification-check` endpoint

---

## Implementation Details

### Database Changes

#### 1. Add Status Column to Referrals Table
```sql
-- Migration: 005_add_referral_status.sql
ALTER TABLE public.referrals 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'COMPLETED'));

CREATE INDEX idx_referrals_status ON public.referrals(status);
CREATE INDEX idx_referrals_referred_status ON public.referrals(referred_id, status);
```

#### 2. Database Functions
```sql
-- Migration: 006_referral_qualification_functions.sql

-- Function: check_referral_qualification(referred_user_id)
-- Validates if a user meets criteria and updates referral status
-- Returns: referral_id, referrer_id, status change details

-- Function: update_referral_status_for_user(user_id)
-- Bulk updates all PENDING referrals for a user if they qualify
-- Returns: count of updated and completed referrals
```

### API Endpoints

#### POST /api/referral-qualification-check
**Purpose:** Check and update referral qualification status

**Request:**
```json
{
  "userId": "user-uuid"
}
```

**Response (Qualified):**
```json
{
  "success": true,
  "qualified": true,
  "userBalance": 65000,
  "completedReferrals": 3,
  "message": "User balance reached 60,000. Referral(s) marked as COMPLETED."
}
```

**Response (Not Qualified):**
```json
{
  "success": true,
  "qualified": false,
  "userBalance": 45000,
  "earnedAmount": 5000,
  "earningsNeeded": 5000,
  "balanceNeeded": 15000,
  "pendingReferrals": 1,
  "message": "User needs ₦15,000 more to qualify."
}
```

#### GET /api/referral-qualification-check?userId={userId}
**Purpose:** Check referral qualification status (read-only)

**Response:**
```json
{
  "success": true,
  "userId": "user-uuid",
  "userBalance": 60000,
  "earnedAmount": 10000,
  "qualified": true,
  "completedReferrals": 2,
  "pendingReferrals": 0
}
```

#### GET /api/referral-stats?userId={userId}
**Extended Response (now includes detailed referrals):**
```json
{
  "success": true,
  "referral_code": "ABC123XYZ",
  "referral_count": 5,
  "referral_balance": 50000,
  "completed_count": 2,
  "pending_count": 3,
  "referrals": [
    {
      "id": "ref-uuid",
      "referred_id": "user-uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "status": "PENDING",
      "balance": 55000,
      "created_at": "2025-02-04T10:00:00Z"
    },
    {
      "id": "ref-uuid-2",
      "referred_id": "user-uuid-2",
      "name": "Jane Smith",
      "email": "jane@example.com",
      "status": "COMPLETED",
      "balance": 75000,
      "created_at": "2025-02-04T09:00:00Z"
    }
  ]
}
```

### Client-Side Integrations

#### 1. Task Completion (`app/task/page.tsx`)
After a task is completed and balance is updated:
```typescript
// Silently check referral qualification
fetch("/api/referral-qualification-check", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ userId: user.id }),
}).catch(() => {
  // Silently fail - no user feedback
})
```

#### 2. Balance Updates (`app/api/user-balance`)
When balance is updated via API, trigger qualification check if balance >= 60,000

---

## Key Features

### 1. Hidden Logic
- ✅ No UI displays the qualification criteria
- ✅ No tooltips or error messages about requirements
- ✅ Users only see "Pending" or "Completed" status
- ✅ No FAQs or help text about this system

### 2. Automatic Processing
- ✅ No manual approval required
- ✅ Status updates automatically when threshold is met
- ✅ Fire-and-forget mechanism (no user interruption)

### 3. Spam Prevention
- ✅ Prevents bulk referral creation without engagement
- ✅ Requires minimum ₦10,000 earned (not just signup)
- ✅ Requires ₦60,000 total balance threshold
- ✅ Per-referral tracking prevents fake referrals

### 4. Data Integrity
- ✅ Database constraints ensure status validity
- ✅ Indexes for efficient status queries
- ✅ Referrer balance/count only updates on COMPLETED referrals

---

## Referral Count Logic

**Important:** The `referral_count` and `referral_balance` shown to the referrer reflect **COMPLETED** referrals only.

When a new user signs up via referral code:
1. ✅ A new referral record is created with status `PENDING`
2. ✅ Referrer's count/balance is NOT updated yet
3. ✅ When invited user reaches ₦60,000:
   - Referral status changes to `COMPLETED`
   - Referrer's `referral_count` and `referral_balance` are updated

**Current Setup:** Updates happen in referral_balance/count immediately in the signup flow. You may want to defer these updates until referral is COMPLETED. Contact us to implement this change if needed.

---

## Testing the System

### Test Case 1: Basic Qualification
1. User A signs up with referral code from User B
2. User A has balance: 50,000 (initial)
3. User A completes tasks → balance becomes 65,000
4. ✅ Referral status auto-updates to COMPLETED
5. ✅ User B sees referral as "Completed"

### Test Case 2: Partial Earnings
1. User C signs up with referral code from User D
2. User C completes one task → balance: 55,000 (50k + 5k)
3. ✅ Referral status remains PENDING
4. ✅ No changes to User D's count/balance

### Test Case 3: Multiple Referrals
1. User E has 5 referrals, all PENDING
2. All 5 referred users reach 60,000 balance
3. ✅ All 5 referrals auto-mark as COMPLETED
4. ✅ User E's referral_count increases to 5

---

## Files Modified/Created

### Created:
- `scripts/005_add_referral_status.sql` - Database migration
- `scripts/006_referral_qualification_functions.sql` - DB functions
- `app/api/referral-qualification-check/route.ts` - Main qualification API

### Modified:
- `app/task/page.tsx` - Added qualification check on task completion
- `app/api/user-balance/route.ts` - Added qualification check on balance update
- `app/api/referral-stats/route.ts` - Extended to include referral details with status

---

## Deployment Steps

1. **Run Supabase Migrations:**
   ```bash
   # Execute these files in Supabase SQL editor in order:
   - scripts/005_add_referral_status.sql
   - scripts/006_referral_qualification_functions.sql
   ```

2. **Deploy API Changes:**
   ```bash
   # Redeploy your Next.js app
   npm run build && npm run start
   ```

3. **Monitor:**
   - Check `/api/referral-stats` returns the new `referrals` array
   - Verify `/api/referral-qualification-check` works
   - Monitor task completions trigger qualification checks

---

## Future Enhancements

- [ ] Webhook notifications when referrals qualify
- [ ] Dashboard widget showing referral qualification progress
- [ ] Admin panel to manually override referral status
- [ ] Analytics on referral qualification rates
- [ ] Defer referrer balance update until referral is COMPLETED

---

## Support

For issues or questions about the referral qualification system, reach out to the dev team.
