-- Optional: only run if email_logs RLS policies are missing.
-- Your migration already includes authenticated read/insert policies.

-- If Sent Log is still empty, verify policies exist:
--   Supabase → Authentication → Policies → email_logs
