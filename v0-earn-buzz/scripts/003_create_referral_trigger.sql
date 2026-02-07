-- Function to handle new referral
CREATE OR REPLACE FUNCTION public.handle_new_referral()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  referred_balance numeric;
BEGIN
  -- Read the referred user's current balance
  SELECT balance INTO referred_balance FROM public.users WHERE id = NEW.referred_id;

  -- Only credit the referrer immediately if the referred user's balance meets threshold
  IF referred_balance IS NOT NULL AND referred_balance >= 110000 THEN
    UPDATE public.users
    SET
      referral_count = COALESCE(referral_count, 0) + 1,
      referral_balance = COALESCE(referral_balance, 0) + NEW.amount
    WHERE id = NEW.referrer_id;

    -- Mark this referral as processed
    UPDATE public.referrals
    SET processed = TRUE,
        processed_at = NOW()
    WHERE id = NEW.id;
  END IF;

  RETURN NEW;
END;
$$;

-- Create trigger for new referrals
DROP TRIGGER IF EXISTS on_referral_created ON public.referrals;

CREATE TRIGGER on_referral_created
  AFTER INSERT ON public.referrals
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_referral();

-- Function to process pending referrals when a user's balance crosses the threshold
CREATE OR REPLACE FUNCTION public.process_pending_referrals_on_balance_update()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  r RECORD;
BEGIN
  -- Only run when balance has crossed the threshold from below to >= 110000
  IF (TG_OP = 'UPDATE') AND (OLD.balance < 110000) AND (NEW.balance >= 110000) THEN
    FOR r IN SELECT * FROM public.referrals WHERE referred_id = NEW.id AND processed = FALSE LOOP
      -- Credit the referrer
      UPDATE public.users
      SET
        referral_count = COALESCE(referral_count, 0) + 1,
        referral_balance = COALESCE(referral_balance, 0) + r.amount
      WHERE id = r.referrer_id;

      -- Mark referral as processed
      UPDATE public.referrals
      SET processed = TRUE,
          processed_at = NOW()
      WHERE id = r.id;
    END LOOP;
  END IF;

  RETURN NEW;
END;
$$;

-- Create trigger for users balance updates
DROP TRIGGER IF EXISTS on_user_balance_update ON public.users;

CREATE TRIGGER on_user_balance_update
  AFTER UPDATE OF balance ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.process_pending_referrals_on_balance_update();
