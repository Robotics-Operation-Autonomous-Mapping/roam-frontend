import { SignUp } from "@clerk/nextjs";
import { clerkAppearance } from "@/lib/clerk-appearance";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-6 py-24">
      <SignUp
        appearance={clerkAppearance}
        fallbackRedirectUrl="/admin/profile"
        signInUrl="/sign-in"
      />
    </div>
  );
}
