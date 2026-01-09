/** @type {import('next').NextConfig} */

const version = "1.0.5";

const testCfg = {
  basePath: "",
  eslint: {
    ignoreDuringBuilds: true,
  },
  env: {
    completeUrl: "http://localhost:3001",
    API_URL: "http://localhost:3001/api",
    version: version + "_dev",
    JWT_SECRET: process.env.JWT_SECRET,
    NEXT_PUBLIC_SITEKEY: "3x00000000000000000000FF",
  },
};

const prodCfg = {
  basePath: "",
  eslint: {
    ignoreDuringBuilds: true,
  },
  env: {
    completeUrl: process.env.COMPLETE_URL,
    API_URL: `${process.env.COMPLETE_URL}/api`,
    https: version,
    JWT_SECRET: process.env.JWT_SECRET,
    NEXT_PUBLIC_SITEKEY: "0x4AAAAAAA0jPoN9DQzXX2Tg",
  },
};

function returnConfig() {
  if (!process.env.NODE_ENV) {
    return testCfg;
  }

  if (process.env.NODE_ENV === "development") {
    console.log("development");
    return testCfg;
  }

  if (process.env.NODE_ENV === "production") {
    console.log("production");
    return prodCfg;
  }
}

const nextConfig = returnConfig();

export default nextConfig;

