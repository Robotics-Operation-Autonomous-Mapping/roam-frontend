import { NextResponse } from "next/server";
import { Resend } from "resend";
import {
  ADMIN_SENDER_OPTIONS,
  formatResendFrom,
  type AdminSenderAddress,
} from "@/lib/email/senders";
import { requireRole } from "@/lib/supabase/portal-auth";
import { createServiceClient } from "@/lib/supabase/admin";
import { insertEmailLog } from "@/lib/supabase/email-log";

const VALID_FROM = new Set(
  ADMIN_SENDER_OPTIONS.map((s) => s.address),
);

interface AttachmentPayload {
  filename: string;
  content: string;
}

interface SendEmailBody {
  from: string;
  to: string[];
  cc?: string[];
  bcc?: string[];
  subject: string;
  html: string;
  attachments?: AttachmentPayload[];
}

function parseEmails(raw: string): string[] {
  return raw
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean);
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  const session = await requireRole(["admin"]);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json(
      { error: "RESEND_API_KEY is not configured." },
      { status: 503 },
    );
  }

  let body: SendEmailBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const from = body.from?.trim() as AdminSenderAddress;
  const to = Array.isArray(body.to) ? body.to : parseEmails(String(body.to ?? ""));
  const cc = body.cc ?? [];
  const bcc = body.bcc ?? [];
  const subject = body.subject?.trim() ?? "";
  const html = body.html?.trim() ?? "";
  const attachments = body.attachments ?? [];
  const attachmentNames = attachments.map((a) => a.filename);
  const supabase = createServiceClient();

  const logBase = {
    from_address: from,
    to_addresses: to,
    cc: cc.length ? cc : null,
    bcc: bcc.length ? bcc : null,
    subject,
    body_html: html,
    attachment_names: attachmentNames.length ? attachmentNames : null,
  };

  if (!from || !VALID_FROM.has(from)) {
    return NextResponse.json(
      { error: "Invalid sender address." },
      { status: 400 },
    );
  }

  const allRecipients = [...to, ...cc, ...bcc];
  if (!to.length || !allRecipients.every(isValidEmail)) {
    return NextResponse.json(
      { error: "Provide valid To addresses (comma-separated)." },
      { status: 400 },
    );
  }

  if (!subject) {
    return NextResponse.json({ error: "Subject is required." }, { status: 400 });
  }

  if (!html) {
    return NextResponse.json({ error: "Message body is required." }, { status: 400 });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  const { data, error } = await resend.emails.send({
    from: formatResendFrom(from),
    to,
    cc: cc.length ? cc : undefined,
    bcc: bcc.length ? bcc : undefined,
    subject,
    html,
    attachments: attachments.map((a) => ({
      filename: a.filename,
      content: Buffer.from(a.content, "base64"),
    })),
  });

  if (error) {
    const failLog = await insertEmailLog(supabase, session.member.id, {
      ...logBase,
      status: "failed",
      resend_message_id: null,
      error_message: error.message,
    });
    return NextResponse.json(
      {
        error: error.message ?? "Failed to send email.",
        logError: failLog.ok ? undefined : failLog.message,
      },
      { status: 502 },
    );
  }

  const logResult = await insertEmailLog(supabase, session.member.id, {
    ...logBase,
    status: "sent",
    resend_message_id: data?.id ?? null,
    error_message: null,
  });

  return NextResponse.json({
    success: true,
    messageId: data?.id,
    logError: logResult.ok ? undefined : logResult.message,
  });
}
