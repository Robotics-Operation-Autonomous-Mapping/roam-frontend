import { ApplicationForm } from "@/components/sections/ApplicationForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Apply | ROAM",
  description: "Join the ROAM Robotics engineering team.",
};

export default function ApplyPage() {
  return (
    <main className="w-full bg-bg min-h-screen">
      <ApplicationForm />
    </main>
  );
}
