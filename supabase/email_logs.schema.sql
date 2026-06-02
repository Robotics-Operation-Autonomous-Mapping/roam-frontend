-- Reference: ROAM Admin Portal — Email Composer Schema (already applied in Supabase).
-- Column names must match lib/supabase/email-types.ts and insertEmailLog().

-- email_logs: cc / bcc (not cc_addresses / bcc_addresses)
-- sent_by → admin_users(id), nullable on delete
