import { NextResponse } from "next/server";
import { Resend } from "resend";
import { CONTACT_SUBJECTS } from "@/components/sections/contact/constants";
import { inboxForContactSubject, TEAM_CC_EMAIL } from "@/lib/site";

/**
 * Vercel / .env.local:
 *   RESEND_API_KEY — required (https://resend.com/api-keys)
 *
 *   RESEND_FROM_EMAIL — optional. You do NOT need paid email hosting.
 *   • Dev / quick test: omit this; uses onboarding@resend.dev (Resend free tier may
 *     only deliver to your Resend signup address until a domain is verified).
 *   • Production (recommended, still free): verify schulichroam.com in Resend → Domains
 *     (add DNS records where your website lives — no separate mail product), then set
 *     e.g. RESEND_FROM_EMAIL=ROAM <contact@schulichroam.com>
 */

interface ContactPayload {
  fullName: string;
  email: string;
  subject: string;
  message: string;
  phone?: string;
  linkedin?: string;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatEmailHtml(data: ContactPayload): string {
  const messageHtml = escapeHtml(data.message).replace(/\n/g, "<br />");
  const rows: [string, string][] = [
    ["Full Name", escapeHtml(data.fullName)],
    ["Email", escapeHtml(data.email)],
    ["Subject", escapeHtml(data.subject)],
    ["Phone", data.phone ? escapeHtml(data.phone) : "—"],
    ["LinkedIn", data.linkedin ? escapeHtml(data.linkedin) : "—"],
    ["Message", messageHtml],
  ];

  const tableRows = rows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:8px 12px;font-weight:600;color:#6b6b72;vertical-align:top;">${label}</td><td style="padding:8px 12px;color:#0a0a0b;">${value}</td></tr>`,
    )
    .join("");

  return `
    <div style="font-family:monospace,sans-serif;max-width:560px;">
      <h2 style="color:#e8512a;margin:0 0 16px;">New ROAM Contact Form Submission</h2>
      <table style="width:100%;border-collapse:collapse;border:1px solid #222226;">${tableRows}</table>
      <p style="font-size:12px;color:#6b6b72;margin-top:16px;">Sent via schulichroam.com contact form</p>
    </div>
  `;
}

export async function POST(request: Request) {
  if (!process.env.RESEND_API_KEY) {
    console.error("[contact] RESEND_API_KEY is not configured");
    return NextResponse.json(
      { error: "Email service is not configured. Please try again later." },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const data = body as ContactPayload;
  const fullName = data.fullName?.trim() ?? "";
  const email = data.email?.trim() ?? "";
  const subject = data.subject?.trim() ?? "";
  const message = data.message?.trim() ?? "";
  const phone = data.phone?.trim() || undefined;
  const linkedin = data.linkedin?.trim() || undefined;

  if (!fullName || fullName.length < 2) {
    return NextResponse.json(
      { error: "Please enter your full name." },
      { status: 400 },
    );
  }

  if (!email || !isValidEmail(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 },
    );
  }

  if (!subject || !CONTACT_SUBJECTS.includes(subject as (typeof CONTACT_SUBJECTS)[number])) {
    return NextResponse.json(
      { error: "Please select a subject." },
      { status: 400 },
    );
  }

  if (!message || message.length < 10) {
    return NextResponse.json(
      { error: "Please enter a message (at least 10 characters)." },
      { status: 400 },
    );
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const from =
    process.env.RESEND_FROM_EMAIL ?? "ROAM Contact <onboarding@resend.dev>";

  const { error } = await resend.emails.send({
    from,
    to: [inboxForContactSubject(subject)],
    cc: [TEAM_CC_EMAIL],
    replyTo: email,
    subject: `[ROAM Contact] ${subject} — ${fullName}`,
    html: formatEmailHtml({ fullName, email, subject, message, phone, linkedin }),
  });

  if (error) {
    console.error("[contact] Resend error:", error);
    return NextResponse.json(
      { error: "Failed to send your message. Please try again or email us directly." },
      { status: 502 },
    );
  }

  return NextResponse.json({ success: true });
}
