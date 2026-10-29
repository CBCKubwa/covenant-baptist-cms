/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    agentUpgrade: "security",
  },
  poweredByHeader: false,

  images: {
    // Uploaded logos, photos and thumbnails live in Vercel Blob storage.
    // next/image refuses remote hosts that are not whitelisted here, which is
    // why admin-uploaded images would otherwise fail to render.
    remotePatterns: [{ protocol: "https", hostname: "**.public.blob.vercel-storage.com" }],
  },

  async headers() {
    return [
      {
        // Never let browsers/CDNs cache admin screens or admin API responses.
        source: "/admin/:path*",
        headers: [{ key: "Cache-Control", value: "no-store" }],
      },
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
