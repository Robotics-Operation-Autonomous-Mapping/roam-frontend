/**
 * Verified Resend sender identities — each address must show as Verified
 * in the Resend dashboard before sends will succeed.
 */
export const ADMIN_SENDER_OPTIONS = [
  { label: "Captain", address: "captain@schulichroam.com" },
  { label: "Team", address: "team@schulichroam.com" },
  { label: "Sponsorship", address: "sponsorship@schulichroam.com" },
] as const;

export type AdminSenderAddress =
  (typeof ADMIN_SENDER_OPTIONS)[number]["address"];

export function formatResendFrom(address: AdminSenderAddress): string {
  return `ROAM <${address}>`;
}
