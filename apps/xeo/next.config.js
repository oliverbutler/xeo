const withNx = require('@nrwl/next/plugins/with-nx');
const withPWA = require('next-pwa');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig = {
  pwa: {
    dest: 'public',
    register: true,
    skipWaiting: true,
  },
  nx: {
    svgr: false,
  },
  images: {
    domains: ['avatars.githubusercontent.com', 'lh3.googleusercontent.com'],
  },
  redirects: () => [
    {
      source: '/sprint/:id/embed',
      destination: '/sprint/:id?embed=1',
      permanent: true,
    },
  ],
};

module.exports = withPWA(withNx(withBundleAnalyzer(nextConfig)));
