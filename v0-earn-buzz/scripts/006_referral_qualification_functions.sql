-- Function to check if a referred user meets qualification criteria (60,000 total balance)
-- Automatically updates referral status from PENDING to COMPLETED
CREATE OR REPLACE FUNCTION public.check_referral_qualification(referred_user_id UUID)
RETURNS TABLE (
  referral_id UUID,
  referrer_id UUID,
  referred_id UUID,
  old_status TEXT,
  new_status TEXT,
  user_balance INT,
  qualification_met BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_balance INT;
  v_earned_amount INT;
  v_meets_criteria BOOLEAN;
BEGIN
  -- Get the referred user's balance
  SELECT balance INTO v_user_balance
  FROM public.users
  WHERE id = referred_user_id;

  IF v_user_balance IS NULL THEN
    RETURN QUERY SELECT 
      NULL::UUID, NULL::UUID, referred_user_id, 'ERROR', 'USER_NOT_FOUND', 0, FALSE;
    RETURN;
  END IF;

  -- Calculate earned amount: balance - 50000 (signup bonus)
  v_earned_amount := GREATEST(v_user_balance - 50000, 0);

  -- Check if qualification criteria is met:
  -- User must have earned at least 10,000 (total balance must be >= 60,000)
  v_meets_criteria := (v_user_balance >= 60000);

  -- Update referral status if it was PENDING and now meets criteria
  RETURN QUERY
  UPDATE public.referrals
  SET status = CASE 
    WHEN status = 'PENDING' AND v_meets_criteria THEN 'COMPLETED'
    ELSE status
  END
  WHERE referred_id = referred_user_id AND status = 'PENDING'
  RETURNING 
    id,
    referrer_id,
    referred_id,
    'PENDING'::TEXT,
    status,
    v_user_balance,
    v_meets_criteria;
END;
$$;

-- Function to verify and update all PENDING referrals for a user
-- Call this when user's balance changes
CREATE OR REPLACE FUNCTION public.update_referral_status_for_user(user_id UUID)
RETURNS TABLE (
  updated_count INT,
  completed_count INT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_updated INT := 0;
  v_completed INT := 0;
  v_user_balance INT;
BEGIN
  -- Get user's current balance
  SELECT balance INTO v_user_balance
  FROM public.users
  WHERE id = user_id;

  IF v_user_balance IS NULL THEN
    RETURN QUERY SELECT 0, 0;
    RETURN;
  END IF;

  -- If user has reached 60,000 balance, mark ALL their PENDING referrals as COMPLETED
  IF v_user_balance >= 60000 THEN
    UPDATE public.referrals
    SET status = 'COMPLETED'
    WHERE referred_id = user_id AND status = 'PENDING';

    GET DIAGNOSTICS v_updated = ROW_COUNT;
    v_completed := v_updated;
  END IF;

  RETURN QUERY SELECT v_updated, v_completed;
END;
$$;
