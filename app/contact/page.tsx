import ContactClient from "@/components/sections/contact/ContactClient";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, pageMetadata, webPageSchema } from "@/lib/seo";

const TITLE = "Contact Us";
const DESCRIPTION =
  "Contact Schulich ROAM, the University of Calgary robotics and autonomous mapping club, about sponsorship, partnerships, media, or joining the team.";

export const metadata = pageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <JsonLd
        data={[
          webPageSchema({ type: "ContactPage", name: TITLE, description: DESCRIPTION, path: "/contact" }),
          breadcrumbSchema([{ name: "Contact", path: "/contact" }]),
        ]}
      />
      <ContactClient />
    </>
  );
}
