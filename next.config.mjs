/** @type {import('next').NextConfig} */
const supabaseHostname = (() => {
  try {
    return process.env.NEXT_PUBLIC_SUPABASE_URL
      ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
      : undefined;
  } catch {
    return undefined;
  }
})();

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
  // Inline small images as base64 (reduces requests)
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96],
    remotePatterns: supabaseHostname
      ? [
          {
            protocol: "https",
            hostname: supabaseHostname,
            pathname: "/storage/v1/object/public/**",
          },
        ]
      : [],
  },
};

export default nextConfig;

