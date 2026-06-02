/** Row shape for `email_logs` — matches Supabase migration. */
export type EmailLogStatus = "sent" | "failed";

export type EmailLog = {
  id: string;
  created_at: string;
  sent_by: string | null;
  from_address: string;
  to_addresses: string[];
  cc: string[] | null;
  bcc: string[] | null;
  subject: string;
  body_html: string;
  status: EmailLogStatus;
  resend_message_id: string | null;
  error_message: string | null;
  attachment_names: string[] | null;
};

export type EmailLogInsert = Omit<EmailLog, "id" | "created_at">;
