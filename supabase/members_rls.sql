-- Public read for Team page; all writes go through Next.js API + service role.

ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read published members" ON public.members;
CREATE POLICY "Public can read published members"
  ON public.members
  FOR SELECT
  TO anon, authenticated
  USING (is_public = true);

-- Service role bypasses RLS. Portal mutations must use SUPABASE_SERVICE_ROLE_KEY.
