/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
      DATABASE_URL: process.env.DATABASE_URL,
    },
  images: {
    domains: ['lh3.googleusercontent.com'],
  }

  };
  
  export default nextConfig;