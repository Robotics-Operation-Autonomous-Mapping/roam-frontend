import ProjectsClient from "@/components/sections/projects/ProjectsClient";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, pageMetadata, webPageSchema } from "@/lib/seo";

const TITLE = "Projects";
const DESCRIPTION =
  "The rigs and rovers built by Schulich ROAM at the University of Calgary, starting with ARGOS, the first LiDAR mapping rig.";

export const metadata = pageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: "/projects",
});

export default function ProjectsPage() {
  return (
    <>
      <JsonLd
        data={[
          webPageSchema({ name: TITLE, description: DESCRIPTION, path: "/projects" }),
          breadcrumbSchema([{ name: "Projects", path: "/projects" }]),
        ]}
      />
      <ProjectsClient />
    </>
  );
}
