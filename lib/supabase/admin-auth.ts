import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { supabaseAnonKey, supabaseUrl } from "./config";

export type VerifiedAdmin = {
  id: string;
  email: string;
  supabase: SupabaseClient;
};

export async function verifyAdminFromRequest(
  request: Request,
): Promise<VerifiedAdmin | null> {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;

  const token = authHeader.slice(7);
  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  });

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser(token);

  if (userError || !user?.email) return null;

  const { data: admin, error: adminError } = await supabase
    .from("admin_users")
    .select("id, email")
    .eq("email", user.email)
    .single();

  if (adminError || !admin) return null;

  return { id: admin.id, email: admin.email, supabase };
}
