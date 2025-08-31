// @ts-nocheck
import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

// https://vitejs.dev/config/
export default defineConfig(async ({ mode }) => ({
	plugins: [
		viteSingleFile(),
	],
	server: {
		allowedHosts: true,
		hmr: false,
		port: 8000,
	},
	publicDir: false,
	assetsInclude: [],
	build: {
		minify: "terser",
		chunkSizeWarningLimit: 10000,
		sourcemap: "hidden", // Makes it so code is obstructed on release,
	},
}));