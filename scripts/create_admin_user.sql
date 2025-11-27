-- Enable pgcrypto for password hashing if not already enabled
CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
DECLARE
  new_user_id UUID;
  target_email TEXT := 'robinsonantsanchez@gmail.com';
  temp_password TEXT := 'temp_password_123';
BEGIN
  -- 1. Check if user exists in auth.users
  SELECT id INTO new_user_id FROM auth.users WHERE email = target_email;

  IF new_user_id IS NULL THEN
    -- Create new user
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      target_email,
      crypt(temp_password, gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}',
      '{}',
      now(),
      now()
    ) RETURNING id INTO new_user_id;
    
    RAISE NOTICE 'User created with ID: %', new_user_id;
  ELSE
    RAISE NOTICE 'User already exists with ID: %', new_user_id;
    -- Optional: Update password if needed (commented out for safety)
    -- UPDATE auth.users SET encrypted_password = crypt(temp_password, gen_salt('bf')) WHERE id = new_user_id;
  END IF;

  -- 2. Ensure profile exists and has admin role
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    new_user_id,
    target_email,
    'Admin User',
    'admin'
  )
  ON CONFLICT (id) DO UPDATE SET
    role = 'admin',
    email = EXCLUDED.email; -- Ensure email matches

  RAISE NOTICE 'Admin role assigned to user %', target_email;

END $$;
