-- Seed data for local development
-- This file will be automatically loaded when you run supabase db reset

-- Ensure pgcrypto is enabled
CREATE EXTENSION IF NOT EXISTS pgcrypto SCHEMA extensions;

-- Insert into auth.users
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  invited_at,
  confirmation_token,
  confirmation_sent_at,
  recovery_token,
  recovery_sent_at,
  email_change_token_new,
  email_change,
  email_change_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  created_at,
  updated_at,
  phone,
  phone_confirmed_at,
  phone_change,
  phone_change_token,
  phone_change_sent_at,
  email_change_token_current,
  email_change_confirm_status,
  banned_until,
  reauthentication_token,
  reauthentication_sent_at
) VALUES 
  (
    '00000000-0000-0000-0000-000000000000',
    '11111111-1111-1111-1111-111111111111',
    'authenticated',
    'authenticated',
    'john.doe@example.com',
    extensions.crypt('password123', extensions.gen_salt('bf')),
    timezone('utc'::text, now()),
    NULL,
    '',
    NULL,
    '',
    NULL,
    '',
    '',
    NULL,
    NULL,
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "John Doe", "username": "johndoe", "avatar_url": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"}',
    NULL,
    timezone('utc'::text, now()),
    timezone('utc'::text, now()),
    NULL,
    NULL,
    '',
    '',
    NULL,
    '',
    0,
    NULL,
    '',
    NULL
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '22222222-2222-2222-2222-222222222222',
    'authenticated',
    'authenticated',
    'jane.smith@example.com',
    extensions.crypt('password123', extensions.gen_salt('bf')),
    timezone('utc'::text, now()),
    NULL,
    '',
    NULL,
    '',
    NULL,
    '',
    '',
    NULL,
    NULL,
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Jane Smith", "username": "janesmith", "avatar_url": "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"}',
    NULL,
    timezone('utc'::text, now()),
    timezone('utc'::text, now()),
    NULL,
    NULL,
    '',
    '',
    NULL,
    '',
    0,
    NULL,
    '',
    NULL
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '33333333-3333-3333-3333-333333333333',
    'authenticated',
    'authenticated',
    'mike.johnson@example.com',
    extensions.crypt('password123', extensions.gen_salt('bf')),
    timezone('utc'::text, now()),
    NULL,
    '',
    NULL,
    '',
    NULL,
    '',
    '',
    NULL,
    NULL,
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Mike Johnson", "username": "mikejohnson", "avatar_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"}',
    NULL,
    timezone('utc'::text, now()),
    timezone('utc'::text, now()),
    NULL,
    NULL,
    '',
    '',
    NULL,
    '',
    0,
    NULL,
    '',
    NULL
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '44444444-4444-4444-4444-444444444444',
    'authenticated',
    'authenticated',
    'sarah.wilson@example.com',
    extensions.crypt('password123', extensions.gen_salt('bf')),
    timezone('utc'::text, now()),
    NULL,
    '',
    NULL,
    '',
    NULL,
    '',
    '',
    NULL,
    NULL,
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Sarah Wilson", "username": "sarahwilson", "avatar_url": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"}',
    NULL,
    timezone('utc'::text, now()),
    timezone('utc'::text, now()),
    NULL,
    NULL,
    '',
    '',
    NULL,
    '',
    0,
    NULL,
    '',
    NULL
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '55555555-5555-5555-5555-555555555555',
    'authenticated',
    'authenticated',
    'david.brown@example.com',
    extensions.crypt('password123', extensions.gen_salt('bf')),
    timezone('utc'::text, now()),
    NULL,
    '',
    NULL,
    '',
    NULL,
    '',
    '',
    NULL,
    NULL,
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "David Brown", "username": "davidbrown", "avatar_url": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face"}',
    NULL,
    timezone('utc'::text, now()),
    timezone('utc'::text, now()),
    NULL,
    NULL,
    '',
    '',
    NULL,
    '',
    0,
    NULL,
    '',
    NULL
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '66666666-6666-6666-6666-666666666666',
    'authenticated',
    'authenticated',
    'emily.davis@example.com',
    extensions.crypt('password123', extensions.gen_salt('bf')),
    timezone('utc'::text, now()),
    NULL,
    '',
    NULL,
    '',
    NULL,
    '',
    '',
    NULL,
    NULL,
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Emily Davis", "username": "emilydavis", "avatar_url": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face"}',
    NULL,
    timezone('utc'::text, now()),
    timezone('utc'::text, now()),
    NULL,
    NULL,
    '',
    '',
    NULL,
    '',
    0,
    NULL,
    '',
    NULL
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '77777777-7777-7777-7777-777777777777',
    'authenticated',
    'authenticated',
    'alex.miller@example.com',
    extensions.crypt('password123', extensions.gen_salt('bf')),
    timezone('utc'::text, now()),
    NULL,
    '',
    NULL,
    '',
    NULL,
    '',
    '',
    NULL,
    NULL,
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Alex Miller", "username": "alexmiller", "avatar_url": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face"}',
    NULL,
    timezone('utc'::text, now()),
    timezone('utc'::text, now()),
    NULL,
    NULL,
    '',
    '',
    NULL,
    '',
    0,
    NULL,
    '',
    NULL
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '88888888-8888-8888-8888-888888888888',
    'authenticated',
    'authenticated',
    'lisa.garcia@example.com',
    extensions.crypt('password123', extensions.gen_salt('bf')),
    timezone('utc'::text, now()),
    NULL,
    '',
    NULL,
    '',
    NULL,
    '',
    '',
    NULL,
    NULL,
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Lisa Garcia", "username": "lisagarcia", "avatar_url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face"}',
    NULL,
    timezone('utc'::text, now()),
    timezone('utc'::text, now()),
    NULL,
    NULL,
    '',
    '',
    NULL,
    '',
    0,
    NULL,
    '',
    NULL
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '99999999-9999-9999-9999-999999999999',
    'authenticated',
    'authenticated',
    'tom.rodriguez@example.com',
    extensions.crypt('password123', extensions.gen_salt('bf')),
    timezone('utc'::text, now()),
    NULL,
    '',
    NULL,
    '',
    NULL,
    '',
    '',
    NULL,
    NULL,
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Tom Rodriguez", "username": "tomrodriguez", "avatar_url": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face"}',
    NULL,
    timezone('utc'::text, now()),
    timezone('utc'::text, now()),
    NULL,
    NULL,
    '',
    '',
    NULL,
    '',
    0,
    NULL,
    '',
    NULL
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'authenticated',
    'authenticated',
    'rachel.martinez@example.com',
    extensions.crypt('password123', extensions.gen_salt('bf')),
    timezone('utc'::text, now()),
    NULL,
    '',
    NULL,
    '',
    NULL,
    '',
    '',
    NULL,
    NULL,
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Rachel Martinez", "username": "rachelmartinez", "avatar_url": "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"}',
    NULL,
    timezone('utc'::text, now()),
    timezone('utc'::text, now()),
    NULL,
    NULL,
    '',
    '',
    NULL,
    '',
    0,
    NULL,
    '',
    NULL
  );

-- Insert into auth.identities
INSERT INTO auth.identities (
  id,
  user_id,
  identity_data,
  provider,
  provider_id,
  last_sign_in_at,
  created_at,
  updated_at
) VALUES 
  (
    '11111111-1111-1111-1111-111111111111',
    '11111111-1111-1111-1111-111111111111',
    '{"sub": "11111111-1111-1111-1111-111111111111", "email": "john.doe@example.com"}',
    'email',
    '11111111-1111-1111-1111-111111111111',
    timezone('utc'::text, now()),
    timezone('utc'::text, now()),
    timezone('utc'::text, now())
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    '22222222-2222-2222-2222-222222222222',
    '{"sub": "22222222-2222-2222-2222-222222222222", "email": "jane.smith@example.com"}',
    'email',
    '22222222-2222-2222-2222-222222222222',
    timezone('utc'::text, now()),
    timezone('utc'::text, now()),
    timezone('utc'::text, now())
  ),
  (
    '33333333-3333-3333-3333-333333333333',
    '33333333-3333-3333-3333-333333333333',
    '{"sub": "33333333-3333-3333-3333-333333333333", "email": "mike.johnson@example.com"}',
    'email',
    '33333333-3333-3333-3333-333333333333',
    timezone('utc'::text, now()),
    timezone('utc'::text, now()),
    timezone('utc'::text, now())
  ),
  (
    '44444444-4444-4444-4444-444444444444',
    '44444444-4444-4444-4444-444444444444',
    '{"sub": "44444444-4444-4444-4444-444444444444", "email": "sarah.wilson@example.com"}',
    'email',
    '44444444-4444-4444-4444-444444444444',
    timezone('utc'::text, now()),
    timezone('utc'::text, now()),
    timezone('utc'::text, now())
  ),
  (
    '55555555-5555-5555-5555-555555555555',
    '55555555-5555-5555-5555-555555555555',
    '{"sub": "55555555-5555-5555-5555-555555555555", "email": "david.brown@example.com"}',
    'email',
    '55555555-5555-5555-5555-555555555555',
    timezone('utc'::text, now()),
    timezone('utc'::text, now()),
    timezone('utc'::text, now())
  ),
  (
    '66666666-6666-6666-6666-666666666666',
    '66666666-6666-6666-6666-666666666666',
    '{"sub": "66666666-6666-6666-6666-666666666666", "email": "emily.davis@example.com"}',
    'email',
    '66666666-6666-6666-6666-666666666666',
    timezone('utc'::text, now()),
    timezone('utc'::text, now()),
    timezone('utc'::text, now())
  ),
  (
    '77777777-7777-7777-7777-777777777777',
    '77777777-7777-7777-7777-777777777777',
    '{"sub": "77777777-7777-7777-7777-777777777777", "email": "alex.miller@example.com"}',
    'email',
    '77777777-7777-7777-7777-777777777777',
    timezone('utc'::text, now()),
    timezone('utc'::text, now()),
    timezone('utc'::text, now())
  ),
  (
    '88888888-8888-8888-8888-888888888888',
    '88888888-8888-8888-8888-888888888888',
    '{"sub": "88888888-8888-8888-8888-888888888888", "email": "lisa.garcia@example.com"}',
    'email',
    '88888888-8888-8888-8888-888888888888',
    timezone('utc'::text, now()),
    timezone('utc'::text, now()),
    timezone('utc'::text, now())
  ),
  (
    '99999999-9999-9999-9999-999999999999',
    '99999999-9999-9999-9999-999999999999',
    '{"sub": "99999999-9999-9999-9999-999999999999", "email": "tom.rodriguez@example.com"}',
    'email',
    '99999999-9999-9999-9999-999999999999',
    timezone('utc'::text, now()),
    timezone('utc'::text, now()),
    timezone('utc'::text, now())
  ),
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    '{"sub": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa", "email": "rachel.martinez@example.com"}',
    'email',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    timezone('utc'::text, now()),
    timezone('utc'::text, now()),
    timezone('utc'::text, now())
  );

-- Insert additional profile data for testing
-- Note: Profiles are automatically created by the trigger with usernames, but we can update them with additional data
UPDATE public.profiles 
SET 
    display_name = 'John Doe',
    bio = 'Software engineer passionate about building great user experiences.',
    status = 'active'
WHERE user_id = '11111111-1111-1111-1111-111111111111';

UPDATE public.profiles 
SET 
    display_name = 'Jane Smith',
    bio = 'Product designer focused on creating intuitive interfaces.',
    status = 'active'
WHERE user_id = '22222222-2222-2222-2222-222222222222';

UPDATE public.profiles 
SET 
    display_name = 'Mike Johnson',
    bio = 'Full-stack developer with expertise in React and Node.js.',
    status = 'active'
WHERE user_id = '33333333-3333-3333-3333-333333333333';

UPDATE public.profiles 
SET 
    display_name = 'Sarah Wilson',
    bio = 'UX researcher helping teams build better products.',
    status = 'active'
WHERE user_id = '44444444-4444-4444-4444-444444444444';

UPDATE public.profiles 
SET 
    display_name = 'David Brown',
    bio = 'DevOps engineer specializing in cloud infrastructure.',
    status = 'active'
WHERE user_id = '55555555-5555-5555-5555-555555555555';

UPDATE public.profiles 
SET 
    display_name = 'Emily Davis',
    bio = 'Frontend developer creating beautiful web applications.',
    status = 'active'
WHERE user_id = '66666666-6666-6666-6666-666666666666';

UPDATE public.profiles 
SET 
    display_name = 'Alex Miller',
    bio = 'Backend developer building scalable APIs.',
    status = 'active'
WHERE user_id = '77777777-7777-7777-7777-777777777777';

UPDATE public.profiles 
SET 
    display_name = 'Lisa Garcia',
    bio = 'QA engineer ensuring software quality and reliability.',
    status = 'active'
WHERE user_id = '88888888-8888-8888-8888-888888888888';

UPDATE public.profiles 
SET 
    display_name = 'Tom Rodriguez',
    bio = 'Data scientist working on machine learning projects.',
    status = 'active'
WHERE user_id = '99999999-9999-9999-9999-999999999999';

UPDATE public.profiles 
SET 
    display_name = 'Rachel Martinez',
    bio = 'Project manager coordinating development teams.',
    status = 'active'
WHERE user_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

-- Update user_stats with dummy data (they were created automatically by the trigger)
UPDATE public.user_stats 
SET 
    total_points = 1250,
    updated_at = now() - interval '2 hours'
WHERE user_id = '11111111-1111-1111-1111-111111111111';

UPDATE public.user_stats 
SET 
    total_points = 890,
    updated_at = now() - interval '1 day'
WHERE user_id = '22222222-2222-2222-2222-222222222222';

UPDATE public.user_stats 
SET 
    total_points = 2100,
    updated_at = now() - interval '30 minutes'
WHERE user_id = '33333333-3333-3333-3333-333333333333';

UPDATE public.user_stats 
SET 
    total_points = 675,
    updated_at = now() - interval '4 hours'
WHERE user_id = '44444444-4444-4444-4444-444444444444';

UPDATE public.user_stats 
SET 
    total_points = 1580,
    updated_at = now() - interval '6 hours'
WHERE user_id = '55555555-5555-5555-5555-555555555555';

UPDATE public.user_stats 
SET 
    total_points = 3200,
    updated_at = now() - interval '15 minutes'
WHERE user_id = '66666666-6666-6666-6666-666666666666';

UPDATE public.user_stats 
SET 
    total_points = 950,
    updated_at = now() - interval '3 hours'
WHERE user_id = '77777777-7777-7777-7777-777777777777';

UPDATE public.user_stats 
SET 
    total_points = 1420,
    updated_at = now() - interval '1 hour'
WHERE user_id = '88888888-8888-8888-8888-888888888888';

UPDATE public.user_stats 
SET 
    total_points = 780,
    updated_at = now() - interval '5 hours'
WHERE user_id = '99999999-9999-9999-9999-999999999999';

UPDATE public.user_stats 
SET 
    total_points = 1850,
    updated_at = now() - interval '45 minutes'
WHERE user_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

-- Insert dummy data for user_points table with various categories and activities
INSERT INTO public.user_points (id, user_id, points, points_category, reference_id, reference_type, description, created_at) VALUES
  -- John Doe's points (1250 total)
  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', 100, 'profile_completion', NULL, NULL, 'Completed profile setup', now() - interval '30 days'),
  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', 50, 'daily_login', NULL, NULL, 'Daily login streak', now() - interval '29 days'),
  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', 200, 'first_post', gen_random_uuid(), 'post', 'First community post', now() - interval '28 days'),
  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', 150, 'helpful_response', gen_random_uuid(), 'comment', 'Helpful response to question', now() - interval '27 days'),
  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', 75, 'daily_login', NULL, NULL, 'Daily login streak', now() - interval '26 days'),
  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', 300, 'achievement', NULL, NULL, 'Reached 1000 points milestone', now() - interval '25 days'),
  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', 50, 'daily_login', NULL, NULL, 'Daily login streak', now() - interval '24 days'),
  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', 125, 'community_contribution', gen_random_uuid(), 'post', 'Shared valuable resource', now() - interval '23 days'),
  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', 100, 'helpful_response', gen_random_uuid(), 'comment', 'Answered technical question', now() - interval '22 days'),
  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', 50, 'daily_login', NULL, NULL, 'Daily login streak', now() - interval '21 days'),

  -- Jane Smith's points (890 total)
  (gen_random_uuid(), '22222222-2222-2222-2222-222222222222', 100, 'profile_completion', NULL, NULL, 'Completed profile setup', now() - interval '25 days'),
  (gen_random_uuid(), '22222222-2222-2222-2222-222222222222', 50, 'daily_login', NULL, NULL, 'Daily login streak', now() - interval '24 days'),
  (gen_random_uuid(), '22222222-2222-2222-2222-222222222222', 200, 'first_post', gen_random_uuid(), 'post', 'First community post', now() - interval '23 days'),
  (gen_random_uuid(), '22222222-2222-2222-2222-222222222222', 150, 'helpful_response', gen_random_uuid(), 'comment', 'Provided design feedback', now() - interval '22 days'),
  (gen_random_uuid(), '22222222-2222-2222-2222-222222222222', 75, 'daily_login', NULL, NULL, 'Daily login streak', now() - interval '21 days'),
  (gen_random_uuid(), '22222222-2222-2222-2222-222222222222', 125, 'community_contribution', gen_random_uuid(), 'post', 'Shared design inspiration', now() - interval '20 days'),
  (gen_random_uuid(), '22222222-2222-2222-2222-222222222222', 100, 'helpful_response', gen_random_uuid(), 'comment', 'Answered UX question', now() - interval '19 days'),
  (gen_random_uuid(), '22222222-2222-2222-2222-222222222222', 50, 'daily_login', NULL, NULL, 'Daily login streak', now() - interval '18 days'),
  (gen_random_uuid(), '22222222-2222-2222-2222-222222222222', 40, 'daily_login', NULL, NULL, 'Daily login streak', now() - interval '17 days'),

  -- Mike Johnson's points (2100 total)
  (gen_random_uuid(), '33333333-3333-3333-3333-333333333333', 100, 'profile_completion', NULL, NULL, 'Completed profile setup', now() - interval '45 days'),
  (gen_random_uuid(), '33333333-3333-3333-3333-333333333333', 50, 'daily_login', NULL, NULL, 'Daily login streak', now() - interval '44 days'),
  (gen_random_uuid(), '33333333-3333-3333-3333-333333333333', 200, 'first_post', gen_random_uuid(), 'post', 'First community post', now() - interval '43 days'),
  (gen_random_uuid(), '33333333-3333-3333-3333-333333333333', 300, 'achievement', NULL, NULL, 'Reached 500 points milestone', now() - interval '42 days'),
  (gen_random_uuid(), '33333333-3333-3333-3333-333333333333', 150, 'helpful_response', gen_random_uuid(), 'comment', 'Solved coding problem', now() - interval '41 days'),
  (gen_random_uuid(), '33333333-3333-3333-3333-333333333333', 75, 'daily_login', NULL, NULL, 'Daily login streak', now() - interval '40 days'),
  (gen_random_uuid(), '33333333-3333-3333-3333-333333333333', 200, 'community_contribution', gen_random_uuid(), 'post', 'Shared code tutorial', now() - interval '39 days'),
  (gen_random_uuid(), '33333333-3333-3333-3333-333333333333', 125, 'helpful_response', gen_random_uuid(), 'comment', 'Debugged issue', now() - interval '38 days'),
  (gen_random_uuid(), '33333333-3333-3333-3333-333333333333', 50, 'daily_login', NULL, NULL, 'Daily login streak', now() - interval '37 days'),
  (gen_random_uuid(), '33333333-3333-3333-3333-333333333333', 300, 'achievement', NULL, NULL, 'Reached 1000 points milestone', now() - interval '36 days'),
  (gen_random_uuid(), '33333333-3333-3333-3333-333333333333', 150, 'helpful_response', gen_random_uuid(), 'comment', 'Code review feedback', now() - interval '35 days'),
  (gen_random_uuid(), '33333333-3333-3333-3333-333333333333', 75, 'daily_login', NULL, NULL, 'Daily login streak', now() - interval '34 days'),
  (gen_random_uuid(), '33333333-3333-3333-3333-333333333333', 200, 'community_contribution', gen_random_uuid(), 'post', 'Open source contribution', now() - interval '33 days'),
  (gen_random_uuid(), '33333333-3333-3333-3333-333333333333', 125, 'helpful_response', gen_random_uuid(), 'comment', 'Architecture advice', now() - interval '32 days'),
  (gen_random_uuid(), '33333333-3333-3333-3333-333333333333', 50, 'daily_login', NULL, NULL, 'Daily login streak', now() - interval '31 days'),
  (gen_random_uuid(), '33333333-3333-3333-3333-333333333333', 300, 'achievement', NULL, NULL, 'Reached 2000 points milestone', now() - interval '30 days'),
  (gen_random_uuid(), '33333333-3333-3333-3333-333333333333', 100, 'helpful_response', gen_random_uuid(), 'comment', 'Performance optimization tip', now() - interval '29 days'),

  -- Sarah Wilson's points (675 total)
  (gen_random_uuid(), '44444444-4444-4444-4444-444444444444', 100, 'profile_completion', NULL, NULL, 'Completed profile setup', now() - interval '20 days'),
  (gen_random_uuid(), '44444444-4444-4444-4444-444444444444', 50, 'daily_login', NULL, NULL, 'Daily login streak', now() - interval '19 days'),
  (gen_random_uuid(), '44444444-4444-4444-4444-444444444444', 200, 'first_post', gen_random_uuid(), 'post', 'First community post', now() - interval '18 days'),
  (gen_random_uuid(), '44444444-4444-4444-4444-444444444444', 150, 'helpful_response', gen_random_uuid(), 'comment', 'UX research insights', now() - interval '17 days'),
  (gen_random_uuid(), '44444444-4444-4444-4444-444444444444', 75, 'daily_login', NULL, NULL, 'Daily login streak', now() - interval '16 days'),
  (gen_random_uuid(), '44444444-4444-4444-4444-444444444444', 100, 'community_contribution', gen_random_uuid(), 'post', 'Shared research findings', now() - interval '15 days'),

  -- David Brown's points (1580 total)
  (gen_random_uuid(), '55555555-5555-5555-5555-555555555555', 100, 'profile_completion', NULL, NULL, 'Completed profile setup', now() - interval '35 days'),
  (gen_random_uuid(), '55555555-5555-5555-5555-555555555555', 50, 'daily_login', NULL, NULL, 'Daily login streak', now() - interval '34 days'),
  (gen_random_uuid(), '55555555-5555-5555-5555-555555555555', 200, 'first_post', gen_random_uuid(), 'post', 'First community post', now() - interval '33 days'),
  (gen_random_uuid(), '55555555-5555-5555-5555-555555555555', 300, 'achievement', NULL, NULL, 'Reached 500 points milestone', now() - interval '32 days'),
  (gen_random_uuid(), '55555555-5555-5555-5555-555555555555', 150, 'helpful_response', gen_random_uuid(), 'comment', 'DevOps best practices', now() - interval '31 days'),
  (gen_random_uuid(), '55555555-5555-5555-5555-555555555555', 75, 'daily_login', NULL, NULL, 'Daily login streak', now() - interval '30 days'),
  (gen_random_uuid(), '55555555-5555-5555-5555-555555555555', 200, 'community_contribution', gen_random_uuid(), 'post', 'Infrastructure guide', now() - interval '29 days'),
  (gen_random_uuid(), '55555555-5555-5555-5555-555555555555', 125, 'helpful_response', gen_random_uuid(), 'comment', 'Docker configuration help', now() - interval '28 days'),
  (gen_random_uuid(), '55555555-5555-5555-5555-555555555555', 50, 'daily_login', NULL, NULL, 'Daily login streak', now() - interval '27 days'),
  (gen_random_uuid(), '55555555-5555-5555-5555-555555555555', 300, 'achievement', NULL, NULL, 'Reached 1000 points milestone', now() - interval '26 days'),
  (gen_random_uuid(), '55555555-5555-5555-5555-555555555555', 100, 'helpful_response', gen_random_uuid(), 'comment', 'CI/CD pipeline advice', now() - interval '25 days'),
  (gen_random_uuid(), '55555555-5555-5555-5555-555555555555', 75, 'daily_login', NULL, NULL, 'Daily login streak', now() - interval '24 days'),
  (gen_random_uuid(), '55555555-5555-5555-5555-555555555555', 110, 'community_contribution', gen_random_uuid(), 'post', 'Cloud deployment tips', now() - interval '23 days'),

  -- Emily Davis's points (3200 total)
  (gen_random_uuid(), '66666666-6666-6666-6666-666666666666', 100, 'profile_completion', NULL, NULL, 'Completed profile setup', now() - interval '60 days'),
  (gen_random_uuid(), '66666666-6666-6666-6666-666666666666', 50, 'daily_login', NULL, NULL, 'Daily login streak', now() - interval '59 days'),
  (gen_random_uuid(), '66666666-6666-6666-6666-666666666666', 200, 'first_post', gen_random_uuid(), 'post', 'First community post', now() - interval '58 days'),
  (gen_random_uuid(), '66666666-6666-6666-6666-666666666666', 300, 'achievement', NULL, NULL, 'Reached 500 points milestone', now() - interval '57 days'),
  (gen_random_uuid(), '66666666-6666-6666-6666-666666666666', 150, 'helpful_response', gen_random_uuid(), 'comment', 'React component help', now() - interval '56 days'),
  (gen_random_uuid(), '66666666-6666-6666-6666-666666666666', 75, 'daily_login', NULL, NULL, 'Daily login streak', now() - interval '55 days'),
  (gen_random_uuid(), '66666666-6666-6666-6666-666666666666', 200, 'community_contribution', gen_random_uuid(), 'post', 'CSS animation tutorial', now() - interval '54 days'),
  (gen_random_uuid(), '66666666-6666-6666-6666-666666666666', 125, 'helpful_response', gen_random_uuid(), 'comment', 'JavaScript debugging', now() - interval '53 days'),
  (gen_random_uuid(), '66666666-6666-6666-6666-666666666666', 50, 'daily_login', NULL, NULL, 'Daily login streak', now() - interval '52 days'),
  (gen_random_uuid(), '66666666-6666-6666-6666-666666666666', 300, 'achievement', NULL, NULL, 'Reached 1000 points milestone', now() - interval '51 days'),
  (gen_random_uuid(), '66666666-6666-6666-6666-666666666666', 150, 'helpful_response', gen_random_uuid(), 'comment', 'TypeScript guidance', now() - interval '50 days'),
  (gen_random_uuid(), '66666666-6666-6666-6666-666666666666', 75, 'daily_login', NULL, NULL, 'Daily login streak', now() - interval '49 days'),
  (gen_random_uuid(), '66666666-6666-6666-6666-666666666666', 200, 'community_contribution', gen_random_uuid(), 'post', 'Next.js best practices', now() - interval '48 days'),
  (gen_random_uuid(), '66666666-6666-6666-6666-666666666666', 125, 'helpful_response', gen_random_uuid(), 'comment', 'State management advice', now() - interval '47 days'),
  (gen_random_uuid(), '66666666-6666-6666-6666-666666666666', 50, 'daily_login', NULL, NULL, 'Daily login streak', now() - interval '46 days'),
  (gen_random_uuid(), '66666666-6666-6666-6666-666666666666', 300, 'achievement', NULL, NULL, 'Reached 2000 points milestone', now() - interval '45 days'),
  (gen_random_uuid(), '66666666-6666-6666-6666-666666666666', 150, 'helpful_response', gen_random_uuid(), 'comment', 'Performance optimization', now() - interval '44 days'),
  (gen_random_uuid(), '66666666-6666-6666-6666-666666666666', 75, 'daily_login', NULL, NULL, 'Daily login streak', now() - interval '43 days'),
  (gen_random_uuid(), '66666666-6666-6666-6666-666666666666', 200, 'community_contribution', gen_random_uuid(), 'post', 'Accessibility guide', now() - interval '42 days'),
  (gen_random_uuid(), '66666666-6666-6666-6666-666666666666', 125, 'helpful_response', gen_random_uuid(), 'comment', 'Testing strategies', now() - interval '41 days'),
  (gen_random_uuid(), '66666666-6666-6666-6666-666666666666', 50, 'daily_login', NULL, NULL, 'Daily login streak', now() - interval '40 days'),
  (gen_random_uuid(), '66666666-6666-6666-6666-666666666666', 300, 'achievement', NULL, NULL, 'Reached 3000 points milestone', now() - interval '39 days'),
  (gen_random_uuid(), '66666666-6666-6666-6666-666666666666', 100, 'helpful_response', gen_random_uuid(), 'comment', 'Build optimization', now() - interval '38 days'),

  -- Alex Miller's points (950 total)
  (gen_random_uuid(), '77777777-7777-7777-7777-777777777777', 100, 'profile_completion', NULL, NULL, 'Completed profile setup', now() - interval '15 days'),
  (gen_random_uuid(), '77777777-7777-7777-7777-777777777777', 50, 'daily_login', NULL, NULL, 'Daily login streak', now() - interval '14 days'),
  (gen_random_uuid(), '77777777-7777-7777-7777-777777777777', 200, 'first_post', gen_random_uuid(), 'post', 'First community post', now() - interval '13 days'),
  (gen_random_uuid(), '77777777-7777-7777-7777-777777777777', 150, 'helpful_response', gen_random_uuid(), 'comment', 'API design feedback', now() - interval '12 days'),
  (gen_random_uuid(), '77777777-7777-7777-7777-777777777777', 75, 'daily_login', NULL, NULL, 'Daily login streak', now() - interval '11 days'),
  (gen_random_uuid(), '77777777-7777-7777-7777-777777777777', 200, 'community_contribution', gen_random_uuid(), 'post', 'Database optimization tips', now() - interval '10 days'),
  (gen_random_uuid(), '77777777-7777-7777-7777-777777777777', 125, 'helpful_response', gen_random_uuid(), 'comment', 'Authentication help', now() - interval '9 days'),
  (gen_random_uuid(), '77777777-7777-7777-7777-777777777777', 50, 'daily_login', NULL, NULL, 'Daily login streak', now() - interval '8 days'),

  -- Lisa Garcia's points (1420 total)
  (gen_random_uuid(), '88888888-8888-8888-8888-888888888888', 100, 'profile_completion', NULL, NULL, 'Completed profile setup', now() - interval '40 days'),
  (gen_random_uuid(), '88888888-8888-8888-8888-888888888888', 50, 'daily_login', NULL, NULL, 'Daily login streak', now() - interval '39 days'),
  (gen_random_uuid(), '88888888-8888-8888-8888-888888888888', 200, 'first_post', gen_random_uuid(), 'post', 'First community post', now() - interval '38 days'),
  (gen_random_uuid(), '88888888-8888-8888-8888-888888888888', 300, 'achievement', NULL, NULL, 'Reached 500 points milestone', now() - interval '37 days'),
  (gen_random_uuid(), '88888888-8888-8888-8888-888888888888', 150, 'helpful_response', gen_random_uuid(), 'comment', 'Testing methodology', now() - interval '36 days'),
  (gen_random_uuid(), '88888888-8888-8888-8888-888888888888', 75, 'daily_login', NULL, NULL, 'Daily login streak', now() - interval '35 days'),
  (gen_random_uuid(), '88888888-8888-8888-8888-888888888888', 200, 'community_contribution', gen_random_uuid(), 'post', 'QA best practices', now() - interval '34 days'),
  (gen_random_uuid(), '88888888-8888-8888-8888-888888888888', 125, 'helpful_response', gen_random_uuid(), 'comment', 'Bug reporting guide', now() - interval '33 days'),
  (gen_random_uuid(), '88888888-8888-8888-8888-888888888888', 50, 'daily_login', NULL, NULL, 'Daily login streak', now() - interval '32 days'),
  (gen_random_uuid(), '88888888-8888-8888-8888-888888888888', 300, 'achievement', NULL, NULL, 'Reached 1000 points milestone', now() - interval '31 days'),
  (gen_random_uuid(), '88888888-8888-8888-8888-888888888888', 100, 'helpful_response', gen_random_uuid(), 'comment', 'Automation testing tips', now() - interval '30 days'),
  (gen_random_uuid(), '88888888-8888-8888-8888-888888888888', 75, 'daily_login', NULL, NULL, 'Daily login streak', now() - interval '29 days'),
  (gen_random_uuid(), '88888888-8888-8888-8888-888888888888', 50, 'daily_login', NULL, NULL, 'Daily login streak', now() - interval '28 days'),

  -- Tom Rodriguez's points (780 total)
  (gen_random_uuid(), '99999999-9999-9999-9999-999999999999', 100, 'profile_completion', NULL, NULL, 'Completed profile setup', now() - interval '10 days'),
  (gen_random_uuid(), '99999999-9999-9999-9999-999999999999', 50, 'daily_login', NULL, NULL, 'Daily login streak', now() - interval '9 days'),
  (gen_random_uuid(), '99999999-9999-9999-9999-999999999999', 200, 'first_post', gen_random_uuid(), 'post', 'First community post', now() - interval '8 days'),
  (gen_random_uuid(), '99999999-9999-9999-9999-999999999999', 150, 'helpful_response', gen_random_uuid(), 'comment', 'ML model advice', now() - interval '7 days'),
  (gen_random_uuid(), '99999999-9999-9999-9999-999999999999', 75, 'daily_login', NULL, NULL, 'Daily login streak', now() - interval '6 days'),
  (gen_random_uuid(), '99999999-9999-9999-9999-999999999999', 125, 'community_contribution', gen_random_uuid(), 'post', 'Data analysis insights', now() - interval '5 days'),
  (gen_random_uuid(), '99999999-9999-9999-9999-999999999999', 50, 'daily_login', NULL, NULL, 'Daily login streak', now() - interval '4 days'),
  (gen_random_uuid(), '99999999-9999-9999-9999-999999999999', 30, 'daily_login', NULL, NULL, 'Daily login streak', now() - interval '3 days'),

  -- Rachel Martinez's points (1850 total)
  (gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 100, 'profile_completion', NULL, NULL, 'Completed profile setup', now() - interval '50 days'),
  (gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 50, 'daily_login', NULL, NULL, 'Daily login streak', now() - interval '49 days'),
  (gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 200, 'first_post', gen_random_uuid(), 'post', 'First community post', now() - interval '48 days'),
  (gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 300, 'achievement', NULL, NULL, 'Reached 500 points milestone', now() - interval '47 days'),
  (gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 150, 'helpful_response', gen_random_uuid(), 'comment', 'Project management tips', now() - interval '46 days'),
  (gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 75, 'daily_login', NULL, NULL, 'Daily login streak', now() - interval '45 days'),
  (gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 200, 'community_contribution', gen_random_uuid(), 'post', 'Team collaboration guide', now() - interval '44 days'),
  (gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 125, 'helpful_response', gen_random_uuid(), 'comment', 'Agile methodology help', now() - interval '43 days'),
  (gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 50, 'daily_login', NULL, NULL, 'Daily login streak', now() - interval '42 days'),
  (gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 300, 'achievement', NULL, NULL, 'Reached 1000 points milestone', now() - interval '41 days'),
  (gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 150, 'helpful_response', gen_random_uuid(), 'comment', 'Stakeholder communication', now() - interval '40 days'),
  (gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 75, 'daily_login', NULL, NULL, 'Daily login streak', now() - interval '39 days'),
  (gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 200, 'community_contribution', gen_random_uuid(), 'post', 'Risk management strategies', now() - interval '38 days'),
  (gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 125, 'helpful_response', gen_random_uuid(), 'comment', 'Resource planning advice', now() - interval '37 days'),
  (gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 50, 'daily_login', NULL, NULL, 'Daily login streak', now() - interval '36 days'),
  (gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 300, 'achievement', NULL, NULL, 'Reached 1500 points milestone', now() - interval '35 days'),
  (gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 100, 'helpful_response', gen_random_uuid(), 'comment', 'Timeline management', now() - interval '34 days');