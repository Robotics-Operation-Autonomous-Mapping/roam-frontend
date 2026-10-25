import type { Metadata } from "next";
import { NO_INDEX } from "@/lib/seo";

export const metadata: Metadata = { title: "Team Portal", ...NO_INDEX };

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return children;
}
