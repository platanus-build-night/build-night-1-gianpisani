/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Ignorar errores de ESLint durante el build
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Ignorar errores de TS durante el build
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig 