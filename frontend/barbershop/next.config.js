module.exports = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    runtime: 'experimental-edge', // Chỉ cho biết dự án sử dụng experimental features
    missingSuspenseWithCSRBailout: false,
  },
};
