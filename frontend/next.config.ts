import type { NextConfig } from "next";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const nextConfig: NextConfig = {
	experimental: {
		turbopackUseSystemTlsCerts: true,
	},
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "avatars.githubusercontent.com",
			},
			{
				protocol: "https",
				hostname: "img.clerk.com",
			},
		],
	},
};

export default nextConfig;
