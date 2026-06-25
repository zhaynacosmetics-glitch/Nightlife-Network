/** @type {import('next').NextConfig} */
const nextConfig = {
  // Fully static site → export to ./out for Cloudflare Pages (no server runtime needed).
  output: "export",
  reactStrictMode: true,
  poweredByHeader: false,
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
