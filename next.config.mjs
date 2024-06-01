/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config, { isServer }) => {
        if (!isServer) {
            config.resolve.alias["net"] = false;
            config.resolve.alias["tls"] = false;
            config.resolve.alias["fs"] = false;
            config.resolve.alias["dns"] = false;
        }
        return config;
    },
};

export default nextConfig;
