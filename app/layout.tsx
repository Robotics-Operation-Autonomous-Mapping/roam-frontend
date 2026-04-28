import type { Metadata } from "next";
import "./globals.css";
import { bebasNeue, dmSans, jetbrainsMono } from "@/lib/fonts";
import { Navbar } from "@/components/nav/Navbar";
import { Footer } from "@/components/footer/Footer";
import { PageTransition } from "@/components/ui/PageTransition";

export const metadata: Metadata = {
  title: {
    default: "ROAM Robotics Club | Autonomous Systems & AI",
    template: "%s | ROAM Robotics",
  },
  description:
    "ROAM (Robotics Operation for Autonomous Mapping) is a premier student-led robotics club building intelligent autonomous systems that explore, understand, and digitally recreate the world using advanced LiDAR and AI technology.",
  keywords: ["robotics club", "autonomous vehicles", "LiDAR mapping", "AI robotics", "ROAM Robotics", "engineering students", "Schulich School of Engineering"],
  authors: [{ name: "ROAM Robotics Team" }],
  creator: "ROAM Robotics",
  metadataBase: new URL("https://schulichroam.ca"), // Replace with actual domain if different
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://schulichroam.ca",
    title: "ROAM Robotics Club | Building the Future of Autonomy",
    description: "Building intelligent systems that explore, understand, and digitally recreate the world.",
    siteName: "ROAM Robotics",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "ROAM Robotics Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ROAM Robotics Club",
    description: "Building the future of autonomous robotics and AI.",
    images: ["/logo.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png" },
    ],
    other: [
      {
        rel: "manifest",
        url: "/site.webmanifest",
      },
    ],
  },
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
