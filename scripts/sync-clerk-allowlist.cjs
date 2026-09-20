/**
 * Sync Clerk allowlist from accepted applications (+ seeded admin emails).
 *
 * Usage:
 *   node scripts/sync-clerk-allowlist.cjs
 *
 * Requires: CLERK_SECRET_KEY, NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 */
const fs = require("fs");
const path = require("path");

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  const text = fs.readFileSync(filePath, "utf8");
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq < 0) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = val;
  }
}

loadEnvFile(path.join(__dirname, "..", ".env.local"));
loadEnvFile(path.join(__dirname, "..", ".env"));

const CLERK_SECRET = process.env.CLERK_SECRET_KEY;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!CLERK_SECRET) {
  console.error("Missing CLERK_SECRET_KEY");
  process.exit(1);
}
if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Missing Supabase URL or service role key");
  process.exit(1);
}

function normalize(email) {
  return String(email || "")
    .trim()
    .toLowerCase();
}

async function clerkFetch(pathname, options = {}) {
  const res = await fetch(`https://api.clerk.com/v1${pathname}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${CLERK_SECRET}`,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
  const text = await res.text();
  let body = null;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = text;
  }
  if (!res.ok) {
    const msg =
      typeof body === "object" && body?.errors
        ? JSON.stringify(body.errors)
        : text;
    throw new Error(
      `${options.method || "GET"} ${pathname} → ${res.status}: ${msg}`,
    );
  }
  return body;
}

async function supabaseGet(pathQuery) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${pathQuery}`, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
    },
  });
  if (!res.ok) {
    throw new Error(`Supabase ${pathQuery} → ${res.status}`);
  }
  return res.json();
}

async function main() {
  const emails = new Set();

  // Accepted applications only — university + personal emails
  const apps = await supabaseGet(
    "applications?select=university_email,personal_email&status=eq.accepted",
  );
  for (const app of apps) {
    const uni = normalize(app.university_email);
    const personal = normalize(app.personal_email);
    if (uni) emails.add(uni);
    if (personal) emails.add(personal);
  }

  // Seeded admins (may not have an application row)
  try {
    const admins = await supabaseGet(
      "members?select=email,university_email,personal_email&role=eq.admin",
    );
    for (const m of admins) {
      for (const key of ["email", "university_email", "personal_email"]) {
        const n = normalize(m[key]);
        if (n) emails.add(n);
      }
    }
  } catch (err) {
    console.warn("Admin member email fetch skipped:", err.message);
  }

  const list = [...emails].sort();
  console.log(
    `Allowlist from accepted applications (+ admins): ${list.length} emails`,
  );

  await clerkFetch("/instance/restrictions", {
    method: "PATCH",
    body: JSON.stringify({
      allowlist: true,
      blocklist: false,
    }),
  });
  console.log("Clerk allowlist enabled for sign-ups");

  const existing = await clerkFetch("/allowlist_identifiers?limit=500");
  const existingEmails = new Set(
    (Array.isArray(existing) ? existing : existing?.data || [])
      .map((row) => normalize(row.identifier || row.email_address))
      .filter(Boolean),
  );

  let added = 0;
  let skipped = 0;
  for (const email of list) {
    if (existingEmails.has(email)) {
      skipped += 1;
      continue;
    }
    try {
      await clerkFetch("/allowlist_identifiers", {
        method: "POST",
        body: JSON.stringify({
          identifier: email,
          notify: false,
        }),
      });
      added += 1;
      process.stdout.write(`+ ${email}\n`);
    } catch (err) {
      console.error(`! failed ${email}: ${err.message}`);
    }
  }

  console.log(`Done. added=${added} already_present=${skipped}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
