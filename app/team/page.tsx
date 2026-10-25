import { TeamClient } from "@/components/team/TeamClient";
import { JsonLd } from "@/components/seo/JsonLd";
import { fetchPublicMembers } from "@/lib/members/public";
import {
  breadcrumbSchema,
  pageMetadata,
  teamMembersSchema,
  webPageSchema,
} from "@/lib/seo";

export const revalidate = 3600;

const TITLE = "Our Team: UCalgary Robotics Students";
const DESCRIPTION =
  "Meet the Schulich ROAM team at the University of Calgary: the captain, subteam leads and members building the ATLAS-1 autonomous mapping rover.";

export const metadata = pageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: "/team",
});

export default async function TeamPage() {
  const members = await fetchPublicMembers();
  return (
    <>
      <JsonLd
        data={[
          webPageSchema({ type: "AboutPage", name: TITLE, description: DESCRIPTION, path: "/team" }),
          breadcrumbSchema([{ name: "Team", path: "/team" }]),
          ...(members.length ? [teamMembersSchema(members)] : []),
        ]}
      />
      <TeamClient members={members} />
    </>
  );
}
