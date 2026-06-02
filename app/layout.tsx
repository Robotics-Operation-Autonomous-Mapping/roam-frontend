import type { Metadata, Viewport } from "next";
import "./globals.css";
import { bebasNeue, dmSans, jetbrainsMono } from "@/lib/fonts";
import { Navbar } from "@/components/nav/Navbar";
import { Footer } from "@/components/footer/Footer";
import { PageTransition } from "@/components/ui/PageTransition";
import { JsonLd } from "@/components/seo/JsonLd";
import Script from "next/script";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0A0A0B",
};

export const metadata: Metadata = {
  title: {
    default: "ROAM Robotics Club | Autonomous Systems & AI",
    template: "%s | ROAM Robotics",
  },
  description:
    "ROAM (Robotics Operation for Autonomous Mapping) is a premier student-led robotics club building intelligent autonomous systems that explore, understand, and digitally recreate the world using advanced LiDAR and AI technology.",
  keywords: [
    "schulichroam",
    "Schulich ROAM",
    "schulich roam",
    "ROAM Robotics Club",
    "ROAM Robotics Calgary",
    "UCalgary Robotics",
    "University of Calgary robotics club",
    "Schulich School of Engineering",
    "Autonomous mapping",
    "LiDAR mapping",
    "AI robotics",
    "autonomous vehicles",
    "robotics engineering",
    "student engineering club",
    "Mars Rover Calgary"
  ],
  authors: [{ name: "ROAM Robotics Team" }],
  creator: "ROAM Robotics",
  metadataBase: new URL("https://schulichroam.com"),
  alternates: {
    canonical: "./",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "yDNmcUoJ4ah-VKpyU-jHEsaPS5mj_FWctK33juHVR9w",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://schulichroam.com",
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
      <head>
        <JsonLd />
      </head>
      <body className="font-sans antialiased bg-bg text-cream selection:bg-primary selection:text-white">
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-5RFTEQ19RQ"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-5RFTEQ19RQ');
          `}
        </Script>
        <Navbar />
        <PageTransition>
          <main>{children}</main>
        </PageTransition>
        <Footer />
      </body>
    </html>
  );
}
