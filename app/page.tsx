import HomeClient from "@/components/home/HomeClient";
import { JsonLd } from "@/components/seo/JsonLd";
import { HOME_DESCRIPTION, HOME_TITLE, pageMetadata, webPageSchema } from "@/lib/seo";

export const metadata = pageMetadata({
  title: HOME_TITLE,
  absoluteTitle: true,
  description: HOME_DESCRIPTION,
  path: "/",
});

export default function Home() {
  return (
    <>
      <JsonLd
        data={webPageSchema({ name: HOME_TITLE, description: HOME_DESCRIPTION, path: "/" })}
      />
      <HomeClient />
    </>
  );
}
