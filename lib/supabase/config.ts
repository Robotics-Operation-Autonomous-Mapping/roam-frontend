/**
 * Supabase public credentials — set in .env.local and Vercel.
 * Dashboard: Project Settings → API → Project URL + anon public key.
 *
 * IMPORTANT: Use direct `process.env.NEXT_PUBLIC_*` access (not dynamic keys).
 * Next.js only inlines public env vars for static property access in client bundles.
 */

const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

if (!url || !anonKey) {
  throw new Error(
    "Missing Supabase env vars. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local (see .env.example), then restart the dev server.",
  );
}

export const supabaseUrl = url;
export const supabaseAnonKey = anonKey;
