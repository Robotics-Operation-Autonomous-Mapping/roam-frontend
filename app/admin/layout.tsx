import { PortalAuthProvider } from "@/components/admin/AdminAuthContext";
import { AdminShell } from "@/components/admin/AdminShell";
import { PortalGate } from "@/components/admin/PortalGate";

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
