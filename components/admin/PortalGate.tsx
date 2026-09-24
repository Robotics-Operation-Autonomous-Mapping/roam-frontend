"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { usePortalAuth } from "./AdminAuthContext";

export function PortalGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { canRecruitment, canMembers, canCompose } = usePortalAuth();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    if (pathname === "/admin" && !canRecruitment) {
      setAllowed(false);
      router.replace("/admin/profile");
      return;
    }
    if (pathname?.startsWith("/admin/members") && !canMembers) {
      setAllowed(false);
      router.replace("/admin/profile");
      return;
    }
    if (pathname?.startsWith("/admin/email") && !canCompose) {
      setAllowed(false);
      router.replace("/admin/profile");
      return;
    }
    setAllowed(true);
  }, [pathname, canRecruitment, canMembers, canCompose, router]);

  if (!allowed) {
    return (
      <div
        style={{
          padding: 48,
          textAlign: "center",
          fontFamily: "monospace",
          fontSize: 11,
          color: "var(--admin-muted)",
          letterSpacing: "0.15em",
        }}
      >
        CHECKING ACCESS…
      </div>
    );
  }

  return <>{children}</>;
}
