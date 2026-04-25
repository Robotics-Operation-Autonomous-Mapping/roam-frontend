import type { Metadata } from "next";
import "./globals.css";
import { bebasNeue, dmSans, jetbrainsMono } from "@/lib/fonts";
import { Navbar } from "@/components/nav/Navbar";
import { Footer } from "@/components/footer/Footer";
import { PageTransition } from "@/components/ui/PageTransition";

export const metadata: Metadata = {
  title: "ROAM Robotics Club",
  description:
    "ROAM is a student-led autonomous robotics club building intelligent systems that explore, understand, and digitally recreate the world.",
  keywords: ["robotics", "autonomous", "lidar", "rover", "ROAM"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bebasNeue.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}
    >
      <body className="font-sans antialiased bg-bg text-cream selection:bg-primary selection:text-white">
        <Navbar />
        <PageTransition>
          <main>{children}</main>
        </PageTransition>
        <Footer />
      </body>
    </html>
  );
}
