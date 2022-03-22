const withNx = require('@nrwl/next/plugins/with-nx');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig = {
  pwa: {
    dest: 'public',
    disable: process.env.NODE_ENV === 'development',
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
    {
      source: '/template',
      destination:
        'https://oliverbutler.notion.site/Team-Sprint-96738ffb80834b79abba21c5161fa42d',
      permanent: true,
    },
  ],
};

module.exports = withNx(withBundleAnalyzer(nextConfig));
