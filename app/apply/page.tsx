import { ApplicationForm } from "@/components/sections/ApplicationForm";
import { Metadata } from "next";
import { RecruitmentClosed } from "@/components/sections/RecruitmentClosed";
import { RECRUITMENT } from "@/lib/site";

export const metadata: Metadata = {
  title: "Apply",
  description: "Apply to join ROAM Robotics, the University of Calgary's student team building autonomous mapping rovers.",
  alternates: {
    canonical: "https://schulichroam.com/apply",
  },
};

export default function ApplyPage() {
  return (
    <main className="w-full bg-bg min-h-screen">
      {RECRUITMENT.open ? <ApplicationForm /> : <RecruitmentClosed />}
    </main>
  );
}
