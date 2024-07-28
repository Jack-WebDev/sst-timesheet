/** @type {import('next').NextConfig} */
const nextConfig = {

    webpack: (config) => {
      config.resolve.alias = {
        ...config.resolve.alias,
        'react-pdf': 'react-pdf/dist/esm/entry.webpack'
      };
      return config;
    },
  };
  
  export default nextConfig;
  