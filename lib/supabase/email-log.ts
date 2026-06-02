import type { SupabaseClient } from "@supabase/supabase-js";
import type { EmailLogStatus } from "./email-types";

export type EmailLogPayload = {
  from_address: string;
  to_addresses: string[];
  cc: string[] | null;
  bcc: string[] | null;
  subject: string;
  body_html: string;
  attachment_names: string[] | null;
  status: EmailLogStatus;
  resend_message_id: string | null;
  error_message: string | null;
};

export async function insertEmailLog(
  supabase: SupabaseClient,
  sentByAdminId: string,
  payload: EmailLogPayload,
): Promise<{ ok: true } | { ok: false; message: string }> {
  const { error } = await supabase.from("email_logs").insert({
    sent_by: sentByAdminId,
    ...payload,
  });

  if (error) {
    console.error("[email_logs] insert failed:", error.message, error.details);
    return { ok: false, message: error.message };
  }

  return { ok: true };
}
