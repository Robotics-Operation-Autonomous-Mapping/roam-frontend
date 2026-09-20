import { createClient } from "@supabase/supabase-js";
import { supabaseAnonKey, supabaseUrl } from "@/lib/supabase/config";
import { PUBLIC_MEMBER_COLUMNS } from "@/lib/members/constants";
import type { PublicMember } from "@/lib/members/types";

export async function fetchPublicMembers(): Promise<PublicMember[]> {
  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data, error } = await supabase
    .from("members")
    .select(PUBLIC_MEMBER_COLUMNS)
    .eq("is_public", true)
    .order("sort_order", { ascending: true })
    .order("full_name", { ascending: true });

  if (error) {
    console.error("[team] fetchPublicMembers:", error.message);
    return [];
  }

  return (data ?? []) as PublicMember[];
}
