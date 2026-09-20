"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { usePortalAuth } from "./AdminAuthContext";

export function PortalGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { canRecruitment, canMembers, canCompose } = usePortalAuth();

  useEffect(() => {
    if (pathname === "/admin" && !canRecruitment) {
      router.replace("/admin/profile");
      return;
    }
    if (pathname?.startsWith("/admin/members") && !canMembers) {
      router.replace("/admin/profile");
      return;
    }
    if (pathname?.startsWith("/admin/email") && !canCompose) {
      router.replace("/admin/profile");
    }
  }, [pathname, canRecruitment, canMembers, canCompose, router]);

  return <>{children}</>;
}
