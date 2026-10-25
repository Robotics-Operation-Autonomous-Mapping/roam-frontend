import SponsorsClient from "@/components/sections/sponsors/SponsorsClient";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, pageMetadata, webPageSchema } from "@/lib/seo";

const TITLE = "Sponsor a Student Robotics Team in Calgary";
const DESCRIPTION =
  "Sponsor Schulich ROAM, a University of Calgary student robotics team building an autonomous mapping rover. Platinum, Gold and Basic sponsorship packages.";

export const metadata = pageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: "/sponsors",
});

export default function SponsorPage() {
  return (
    <>
      <JsonLd
        data={[
          webPageSchema({ name: TITLE, description: DESCRIPTION, path: "/sponsors" }),
          breadcrumbSchema([{ name: "Sponsors", path: "/sponsors" }]),
        ]}
      />
      <SponsorsClient />
    </>
  );
}
