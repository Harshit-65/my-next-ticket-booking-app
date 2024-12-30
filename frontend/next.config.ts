/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable if your backend is on a different domain
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:3001/api/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
