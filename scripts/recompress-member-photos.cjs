/**
 * One-off: re-encode existing member photos to 640px WebP with a 1-year cache header,
 * upload under a new path, update members.photo_path, and delete the old file.
 *
 *   node scripts/recompress-member-photos.cjs          (dry run)
 *   node scripts/recompress-member-photos.cjs --apply
 */

const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const { createClient } = require("@supabase/supabase-js");

const ROOT = path.join(__dirname, "..");
const BUCKET = "member-photos";
const MAX_WIDTH = 640;
const MAX_HEIGHT = 960;
const QUALITY = 75;
const APPLY = process.argv.includes("--apply");

function loadEnvLocal() {
  const envPath = path.join(ROOT, ".env.local");
  if (!fs.existsSync(envPath)) return;
  const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

async function main() {
  loadEnvLocal();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("Need NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local");
  }
  const supabase = createClient(url, key, { auth: { persistSession: false } });

  const { data: members, error } = await supabase
    .from("members")
    .select("id, full_name, photo_path")
    .not("photo_path", "is", null);
  if (error) throw error;

  let savedBytes = 0;
  for (const m of members) {
    const oldPath = m.photo_path;
    if (!oldPath || /^https?:\/\//.test(oldPath)) continue;

    const { data: blob, error: dlError } = await supabase.storage.from(BUCKET).download(oldPath);
    if (dlError) {
      console.warn(`skip ${m.full_name}: ${dlError.message}`);
      continue;
    }
    const input = Buffer.from(await blob.arrayBuffer());
    const output = await sharp(input)
      .rotate()
      .resize({ width: MAX_WIDTH, height: MAX_HEIGHT, fit: "inside", withoutEnlargement: true })
      .webp({ quality: QUALITY })
      .toBuffer();

    const before = (input.length / 1024).toFixed(0);
    const after = (output.length / 1024).toFixed(0);
    console.log(`${m.full_name}: ${oldPath} ${before}KB -> ${after}KB`);
    savedBytes += input.length - output.length;
    if (!APPLY) continue;

    const newPath = `${m.id}/${Date.now()}.webp`;
    const { error: upError } = await supabase.storage.from(BUCKET).upload(newPath, output, {
      contentType: "image/webp",
      cacheControl: "31536000",
      upsert: true,
    });
    if (upError) {
      console.warn(`  upload failed: ${upError.message}`);
      continue;
    }
    const { error: updError } = await supabase
      .from("members")
      .update({ photo_path: newPath })
      .eq("id", m.id);
    if (updError) {
      console.warn(`  db update failed: ${updError.message}`);
      await supabase.storage.from(BUCKET).remove([newPath]);
      continue;
    }
    await supabase.storage.from(BUCKET).remove([oldPath]);
  }

  console.log(
    `\n${APPLY ? "Saved" : "Would save"} ~${(savedBytes / 1024 / 1024).toFixed(2)} MB` +
      (APPLY ? "" : "  (dry run; pass --apply to write)"),
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
