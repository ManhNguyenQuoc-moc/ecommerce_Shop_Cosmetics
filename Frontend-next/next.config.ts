/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'media.hcdn.vn' },
      { protocol: 'https', hostname: 'media.hasaki.vn' },
      { protocol: 'https', hostname: 'tse3.mm.bing.net' },
      { protocol: 'https', hostname: 'tse2.mm.bing.net' },
      { protocol: 'https', hostname: 'tse4.mm.bing.net' },
      { protocol: 'https', hostname: 'th.bing.com' },
      { protocol: 'https', hostname: 'i0.wp.com' },
      { protocol: 'https', hostname: 'trang.store' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'product.hstatic.net' },
      { protocol: 'https', hostname: 'cdn.tgdd.vn' },
      { protocol: 'https', hostname: 'www.way.com.vn' },
      { protocol: 'https', hostname: '2momart.vn' },
      { protocol: 'https', hostname: 'focallure.vn' },
      { protocol: 'https', hostname: 'classic.vn' },
      { protocol: 'https', hostname: 'upload.wikimedia.org' },
      { protocol: 'https', hostname: 'cdnv2.tgdd.vn' },
      { protocol: 'https', hostname: 'ananmart.com' },
      { protocol: 'https', hostname: 'logo.clearbit.com' },
      { protocol: 'https', hostname: 'placehold.co' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
    ],
  },
  experimental: {
    turbopackUseSystemTlsCerts: true,
  },
};

module.exports = nextConfig;