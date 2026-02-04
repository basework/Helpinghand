-- Add status column to referrals table for qualification tracking
ALTER TABLE public.referrals 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'COMPLETED'));

-- Create index on status for efficient queries
CREATE INDEX IF NOT EXISTS idx_referrals_status ON public.referrals(status);

-- Create index on referred_id + status for checking referral qualifications
CREATE INDEX IF NOT EXISTS idx_referrals_referred_status ON public.referrals(referred_id, status);
