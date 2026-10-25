import { ApplicationForm } from "@/components/sections/ApplicationForm";
import { RecruitmentClosed } from "@/components/sections/RecruitmentClosed";
import { JsonLd } from "@/components/seo/JsonLd";
import { RECRUITMENT } from "@/lib/site";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Membership Application",
  description:
    "Apply to join Schulich ROAM, the University of Calgary robotics and autonomous mapping club. Short multi-step application for UCalgary students.",
  path: "/apply",
});

export default function ApplyPage() {
  return (
    <div className="w-full bg-bg min-h-screen">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Join", path: "/join" },
          { name: "Apply", path: "/apply" },
        ])}
      />
      {RECRUITMENT.open ? <ApplicationForm /> : <RecruitmentClosed />}
    </div>
  );
}
