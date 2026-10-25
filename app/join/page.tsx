import JoinClient from "@/components/sections/join/JoinClient";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, pageMetadata, webPageSchema } from "@/lib/seo";

const TITLE = "Join a UCalgary Robotics Club";
const DESCRIPTION =
  "Join Schulich ROAM, a University of Calgary robotics club. Roles in mechanical, electrical, software, geomatics, business, and media.";

export const metadata = pageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: "/join",
});

export default function JoinPage() {
  return (
    <>
      <JsonLd
        data={[
          webPageSchema({ name: TITLE, description: DESCRIPTION, path: "/join" }),
          breadcrumbSchema([{ name: "Join", path: "/join" }]),
        ]}
      />
      <JoinClient />
    </>
  );
}
