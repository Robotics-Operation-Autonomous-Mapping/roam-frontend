/** @type {import('next').NextConfig} */
const supabaseBase = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim().replace(/\/$/, "");

const nextConfig = {
  reactStrictMode: true,
  compress: true,
  experimental: {
    // Tree-shake heavy packages to reduce package size
    optimizePackageImports: [
      "framer-motion",
      "gsap",
      "three",
      "@react-three/drei",
      "@clerk/nextjs",
    ],
  },
  // Vercel Image Optimization is billed per transformation; photos are resized at upload instead.
  images: {
    unoptimized: true,
  },
  async rewrites() {
    if (!supabaseBase) return [];
    return [
      {
        source: "/member-photos/:path*",
        destination: `${supabaseBase}/storage/v1/object/public/member-photos/:path*`,
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.schulichroam.com" }],
        destination: "https://schulichroam.com/:path*",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
      {
        source: "/member-photos/:path*",
        headers: [
          {
            key: "CDN-Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
