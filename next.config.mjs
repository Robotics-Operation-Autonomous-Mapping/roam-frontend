/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compress: true,
  experimental: {
    // Tree-shake heavy packages to reduce bundle size
    optimizePackageImports: ["framer-motion", "gsap"],
  },
  // Inline small images as base64 (reduces requests)
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96],
  },
};

export default nextConfig;

