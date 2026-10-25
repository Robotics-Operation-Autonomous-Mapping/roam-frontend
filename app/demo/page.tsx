import DemoClient from "@/components/sections/demo/DemoClient";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, pageMetadata, projectSchema, webPageSchema } from "@/lib/seo";

const TITLE = "ATLAS-1 Autonomous Mapping Rover Prototype";
const DESCRIPTION =
  "Follow ATLAS-1, the autonomous LiDAR mapping rover built by Schulich ROAM at UCalgary: build progress, tech stack (ROS 2, dual LiDAR, RTK-GNSS) and simulations.";

export const metadata = pageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: "/demo",
});

export default function DemoPage() {
  return (
    <>
      <JsonLd
        data={[
          webPageSchema({ name: TITLE, description: DESCRIPTION, path: "/demo" }),
          breadcrumbSchema([{ name: "ATLAS-1 Demo", path: "/demo" }]),
          projectSchema(),
        ]}
      />
      <DemoClient />
    </>
  );
}
