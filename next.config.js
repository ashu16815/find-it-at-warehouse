/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: { serverActions: { allowedOrigins: ['*'] } },
  images: { 
    domains: [
      'www.thewarehouse.co.nz',
      'www.noelleeming.co.nz', 
      'www.warehousestationery.co.nz',
      'images.ctfassets.net',
      'media.skimlinks.com',
      'tm-prd-cdn.themarket.co.nz',
      'images.unsplash.com'
    ] 
  }
};
module.exports = nextConfig;
