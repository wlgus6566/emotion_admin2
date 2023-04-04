const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    BASE_URL: process.env.BASE_URL,
  },
  async rewrites() {
    return [
      {
        source: "/api",
        destination: "http://dev-adm-api.emotion.co.kr/api",
      },
    ]
  },
}

module.exports = nextConfig
