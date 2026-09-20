import { SignUp } from "@clerk/nextjs";
import { clerkAppearance } from "@/lib/clerk-appearance";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center px-6 py-24 gap-6">
      <SignUp
        appearance={clerkAppearance}
        fallbackRedirectUrl="/portal"
        signInUrl="/sign-in"
      />
      <p className="max-w-sm text-center font-mono text-[10px] leading-relaxed tracking-wide text-cream/40">
        Prefer <span className="text-cream/70">Continue with Google</span>.
        Email codes are sent by Clerk and often land in spam — school inboxes
        (@ucalgary.ca) may delay or block them.
      </p>
    </div>
  );
}
