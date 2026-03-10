import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
   images: {
    domains: [
      "images.unsplash.com",
      "upload.wikimedia.org",
      "media.hcdn.vn",
      "product.hstatic.net",
    ],
  },
};

export default nextConfig;
