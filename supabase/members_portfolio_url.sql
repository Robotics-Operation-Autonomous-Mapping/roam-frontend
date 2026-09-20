-- If members table already exists, run this in Supabase SQL editor:

ALTER TABLE public.members
  ADD COLUMN IF NOT EXISTS portfolio_url text;

COMMENT ON COLUMN public.members.portfolio_url IS 'Optional personal / portfolio website URL';

-- Dual role (Team Captain + Subteam Lead):
-- Set role = 'admin', subteam = 'geomatics', title = 'Team Captain & Geomatics Lead'
-- The public Team page shows admins in Captain AND in Subteam Leads when subteam is set.
