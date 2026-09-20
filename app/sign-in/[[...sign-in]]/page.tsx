import { SignIn } from "@clerk/nextjs";
import { clerkAppearance } from "@/lib/clerk-appearance";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-6 py-24">
      <SignIn
        appearance={clerkAppearance}
        fallbackRedirectUrl="/admin/profile"
        signUpUrl="/sign-up"
      />
    </div>
  );
}
