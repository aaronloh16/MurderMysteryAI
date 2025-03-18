/** @type {import('next').NextConfig} */
const nextConfig = {
	// Use SWC minification instead of Terser for faster builds
	swcMinify: true,

	// Reduce build time for static image imports
	images: {
		disableStaticImages: false,
		// Add formats for improved optimization
		formats: ['image/webp'],
	},

	// Optimize build performance
	compiler: {
		// Remove console logs in production
		removeConsole: process.env.NODE_ENV === 'production',
	},

	// Experimental features for faster development
	experimental: {
		// Enable optimistic updates for development
		optimisticClientCache: true,
		// Improve module resolution in development
		optimizePackageImports: ['framer-motion', '@livekit/components-react'],
	},

	// Configure webpack for faster builds
	webpack: (config, { dev, isServer }) => {
		// Skip type checking during development for faster builds
		if (dev && !isServer) {
			config.infrastructureLogging = {
				level: 'error',
			};
		}

		return config;
	},
};

export default nextConfig;
