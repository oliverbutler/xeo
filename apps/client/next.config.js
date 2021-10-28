// eslint-disable-next-line @typescript-eslint/no-var-requires
const withNx = require('@nrwl/next/plugins/with-nx');

/**
 * @type {import('@nrwl/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  nx: {
    svgr: false,
  },
  i18n: {
    locales: ['en-GB'],
    defaultLocale: 'en-GB',
  },
};

module.exports = withNx(nextConfig);
