import type { Metadata, Viewport } from "next";
import "./globals.css";
import { bebasNeue, dmSans, jetbrainsMono } from "@/lib/fonts";
import { Navbar } from "@/components/nav/Navbar";
import { Footer } from "@/components/footer/Footer";
import { PageTransition } from "@/components/ui/PageTransition";
import { JsonLd } from "@/components/seo/JsonLd";
import Script from "next/script";
import { ClerkProvider } from "@clerk/nextjs";
import { clerkAppearance } from "@/lib/clerk-appearance";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import {
  HOME_DESCRIPTION,
  HOME_TITLE,
  ogImage,
  organizationSchema,
  websiteSchema,
} from "@/lib/seo";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0A0A0B",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: HOME_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: HOME_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "schulichroam",
    "Schulich ROAM",
    "schulich roam",
    "ROAM Robotics Club",
    "ROAM Robotics Calgary",
    "ROAM UCalgary",
    "ROAM University of Calgary",
    "Robotics Operation for Autonomous Mapping",
    "UCalgary Robotics",
    "UCalgary robotics club",
    "University of Calgary robotics club",
    "University of Calgary robotics team",
    "Schulich School of Engineering",
    "autonomous mapping",
    "LiDAR mapping",
    "AI robotics",
    "autonomous vehicles",
    "autonomous rover",
    "robotics engineering",
    "student engineering club",
    "Calgary student engineering team",
    "Mars Rover Calgary",
    "ROS 2",
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  formatDetection: { telephone: false, address: false, email: false },
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
    locale: "en_CA",
    siteName: SITE_NAME,
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    images: [ogImage("home", HOME_TITLE)],
  },
  twitter: {
    card: "summary_large_image",
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    images: ["/og/home.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
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
        <JsonLd data={[organizationSchema(), websiteSchema()]} />
      </head>
      <body className="font-sans antialiased bg-bg text-cream selection:bg-primary selection:text-white">
        <ClerkProvider appearance={clerkAppearance}>
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
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-bg focus:text-primary focus:px-4 focus:py-2 focus:border focus:border-primary font-mono text-xs uppercase tracking-widest"
          >
            Skip to content
          </a>
          <Navbar />
          <PageTransition>
          <main id="main-content">{children}</main>
          </PageTransition>
          <Footer />
        </ClerkProvider>
      </body>
    </html>
  );
}