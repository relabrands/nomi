-- Update the role of the user to 'admin'
-- Run this AFTER creating the user in the Supabase Dashboard

DO $$
DECLARE
  target_email TEXT := 'robinsonantsanchez@gmail.com';
BEGIN
  -- Update public.profiles
  UPDATE public.profiles
  SET role = 'admin'
  WHERE email = target_email;

  IF FOUND THEN
    RAISE NOTICE 'Successfully updated role to admin for %', target_email;
  ELSE
    RAISE NOTICE 'User % not found in profiles. Make sure you have created the user in the Dashboard first.', target_email;
  END IF;
END $$;
