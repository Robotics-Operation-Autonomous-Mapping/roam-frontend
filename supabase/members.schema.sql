-- ROAM Team Portal — members table
-- Run in Supabase SQL editor, then apply members_rls.sql and create the Storage bucket.

CREATE TYPE public.member_subteam AS ENUM (
  'software',
  'electrical',
  'mechanical',
  'geomatics',
  'business_operations',
  'content_and_events'
);

CREATE TYPE public.member_role AS ENUM (
  'member',
  'lead',
  'admin'
);

CREATE TABLE IF NOT EXISTS public.members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id text UNIQUE,
  full_name text NOT NULL DEFAULT '',
  email text NOT NULL UNIQUE,
  university_email text,
  personal_email text,
  ucid text,
  date_of_birth date,
  interesting_thing text,
  bio text,
  photo_path text,
  linkedin_url text,
  portfolio_url text,
  subteam public.member_subteam,
  role public.member_role NOT NULL DEFAULT 'member',
  is_public boolean NOT NULL DEFAULT false,
  sort_order int NOT NULL DEFAULT 0,
  title text,
  last_birthday_email_year int,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS members_subteam_idx ON public.members (subteam);
CREATE INDEX IF NOT EXISTS members_role_idx ON public.members (role);
CREATE INDEX IF NOT EXISTS members_public_idx ON public.members (is_public) WHERE is_public = true;

CREATE UNIQUE INDEX IF NOT EXISTS members_university_email_unique
  ON public.members (university_email)
  WHERE university_email IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS members_personal_email_unique
  ON public.members (personal_email)
  WHERE personal_email IS NOT NULL;

CREATE OR REPLACE FUNCTION public.set_members_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS members_updated_at ON public.members;
CREATE TRIGGER members_updated_at
  BEFORE UPDATE ON public.members
  FOR EACH ROW
  EXECUTE FUNCTION public.set_members_updated_at();

-- Storage: create a public bucket named "member-photos" in the dashboard
-- (public read; authenticated/service-role write).

COMMENT ON COLUMN public.members.date_of_birth IS 'Private — never expose on public Team page';
COMMENT ON COLUMN public.members.ucid IS 'Private — portal profile only';
COMMENT ON COLUMN public.members.portfolio_url IS 'Optional personal / portfolio website URL';
COMMENT ON COLUMN public.members.university_email IS 'UCalgary email — portal login when application is accepted';
COMMENT ON COLUMN public.members.personal_email IS 'Personal email — portal login when application is accepted';
-- Dual role: role=admin + subteam set → shown as Team Captain and that subteam's lead.

-- Optional: if email_logs.sent_by still references admin_users, relax it:
-- ALTER TABLE public.email_logs DROP CONSTRAINT IF EXISTS email_logs_sent_by_fkey;
