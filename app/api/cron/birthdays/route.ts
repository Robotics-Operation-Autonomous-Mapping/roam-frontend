import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createServiceClient } from "@/lib/supabase/admin";
import {
  birthdayEmailHtml,
  birthdayEmailSubject,
} from "@/lib/email/templates/birthday";
import { formatResendFrom } from "@/lib/email/senders";

function todayInEdmonton(): { month: number; day: number; year: number } {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Edmonton",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const get = (type: string) =>
    Number(parts.find((p) => p.type === type)?.value ?? 0);
  return { year: get("year"), month: get("month"), day: get("day") };
}

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET?.trim();
  const authHeader = request.headers.get("authorization");
  if (!secret || authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json(
      { error: "RESEND_API_KEY is not configured." },
      { status: 503 },
    );
  }

  const { month, day, year } = todayInEdmonton();
  const supabase = createServiceClient();

  const { data: members, error } = await supabase
    .from("members")
    .select("id, full_name, email, interesting_thing, date_of_birth, last_birthday_email_year")
    .not("date_of_birth", "is", null);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const birthdayPeople = (members ?? []).filter((m) => {
    if (!m.date_of_birth) return false;
    if (m.last_birthday_email_year === year) return false;
    // date_of_birth is YYYY-MM-DD
    const [, mm, dd] = String(m.date_of_birth).split("-").map(Number);
    return mm === month && dd === day;
  });

  const resend = new Resend(process.env.RESEND_API_KEY);
  const results: Array<{ email: string; ok: boolean; error?: string }> = [];

  for (const person of birthdayPeople) {
    const { error: sendError } = await resend.emails.send({
      from: formatResendFrom("team@schulichroam.com"),
      to: [person.email],
      subject: birthdayEmailSubject(person.full_name),
      html: birthdayEmailHtml({
        fullName: person.full_name,
        interestingThing: person.interesting_thing,
      }),
    });

    if (sendError) {
      results.push({ email: person.email, ok: false, error: sendError.message });
      continue;
    }

    await supabase
      .from("members")
      .update({ last_birthday_email_year: year })
      .eq("id", person.id);

    results.push({ email: person.email, ok: true });
  }

  return NextResponse.json({
    date: `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
    sent: results.filter((r) => r.ok).length,
    failed: results.filter((r) => !r.ok).length,
    results,
  });
}
