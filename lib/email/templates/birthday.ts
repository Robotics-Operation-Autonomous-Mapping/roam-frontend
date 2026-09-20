type BirthdayTemplateInput = {
  fullName: string;
  interestingThing?: string | null;
};

export function birthdayEmailHtml({
  fullName,
  interestingThing,
}: BirthdayTemplateInput): string {
  const first = fullName.trim().split(/\s+/)[0] || "teammate";
  const fun = interestingThing?.trim()
    ? `<p style="margin:16px 0 0;font-size:14px;line-height:1.6;color:#F5ECD7;">Fun fact we love about you: <em>${escapeHtml(interestingThing.trim())}</em></p>`
    : "";

  return `<!DOCTYPE html>
<html>
  <body style="margin:0;padding:0;background:#0A0A0B;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#0A0A0B;padding:40px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" style="max-width:520px;background:#111113;border:1px solid #222226;">
            <tr>
              <td style="padding:28px 28px 8px;border-top:3px solid #E8512A;">
                <p style="margin:0;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#E8512A;font-family:monospace;">ROAM Robotics</p>
                <h1 style="margin:12px 0 0;font-size:28px;line-height:1.2;color:#F5ECD7;">Happy Birthday, ${escapeHtml(first)}.</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 28px 28px;">
                <p style="margin:0;font-size:15px;line-height:1.7;color:#F5ECD7;">
                  The whole crew is wishing you an excellent day. Thanks for building ATLAS-1 with us — the map is better because you’re on it.
                </p>
                ${fun}
                <p style="margin:24px 0 0;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#6B6B72;font-family:monospace;">
                  — Team ROAM
                </p>
                <p style="margin:20px 0 0;">
                  <a href="https://schulichroam.com/team" style="display:inline-block;padding:10px 16px;background:#E8512A;color:#0A0A0B;text-decoration:none;font-size:12px;letter-spacing:0.1em;text-transform:uppercase;font-family:monospace;">See the crew</a>
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export function birthdayEmailSubject(fullName: string): string {
  const first = fullName.trim().split(/\s+/)[0] || "teammate";
  return `Happy Birthday, ${first} — from ROAM`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
