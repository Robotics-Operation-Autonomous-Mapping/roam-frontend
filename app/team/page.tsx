import { Metadata } from "next";
import { TeamClient } from "@/components/team/TeamClient";
import { fetchPublicMembers } from "@/lib/members/public";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Our Team | ROAM Robotics",
  description:
    "Meet the ROAM Robotics subteam leads and crew building ATLAS-1 — software, electrical, mechanical, geomatics, business operations, and content.",
  alternates: {
    canonical: "https://schulichroam.com/team",
  },
};

export default async function TeamPage() {
  const members = await fetchPublicMembers();
  return <TeamClient members={members} />;
}
