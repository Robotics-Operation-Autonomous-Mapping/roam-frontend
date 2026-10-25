import type { Metadata } from "next";
import { NO_INDEX } from "@/lib/seo";
import { PortalAuthProvider } from "@/components/admin/AdminAuthContext";
import { AdminShell } from "@/components/admin/AdminShell";
import { PortalGate } from "@/components/admin/PortalGate";

export const metadata: Metadata = { title: "Admin", ...NO_INDEX };

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PortalAuthProvider>
      <AdminShell>
        <PortalGate>{children}</PortalGate>
      </AdminShell>
    </PortalAuthProvider>
  );
}
