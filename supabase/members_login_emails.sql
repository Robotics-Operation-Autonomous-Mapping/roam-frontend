-- Login emails aligned with applications table naming.
-- Portal access: Clerk email must match university_email OR personal_email
-- on an application with status = 'accepted' (admins may be seeded without an application).

ALTER TABLE public.members
  ADD COLUMN IF NOT EXISTS university_email text;

ALTER TABLE public.members
  ADD COLUMN IF NOT EXISTS personal_email text;

-- Migrate leftover alt_email (if the earlier migration was applied)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'members' AND column_name = 'alt_email'
  ) THEN
    UPDATE public.members
    SET personal_email = COALESCE(personal_email, alt_email)
    WHERE alt_email IS NOT NULL AND personal_email IS NULL;

    ALTER TABLE public.members DROP COLUMN alt_email;
  END IF;
END $$;

-- Backfill from primary email when possible
UPDATE public.members
SET university_email = lower(email)
WHERE university_email IS NULL
  AND email ILIKE '%@ucalgary.ca';

UPDATE public.members
SET personal_email = lower(email)
WHERE personal_email IS NULL
  AND email NOT ILIKE '%@ucalgary.ca';

CREATE UNIQUE INDEX IF NOT EXISTS members_university_email_unique
  ON public.members (university_email)
  WHERE university_email IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS members_personal_email_unique
  ON public.members (personal_email)
  WHERE personal_email IS NOT NULL;

COMMENT ON COLUMN public.members.university_email IS 'UCalgary / school email — login allowed when application status is accepted';
COMMENT ON COLUMN public.members.personal_email IS 'Personal / Gmail — login allowed when application status is accepted';
