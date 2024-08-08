import { defineConfig } from 'vite'

export default defineConfig({
	server: {
		port: 8000
	},
	base: "./",
	build: {
		sourcemap: "hidden", // makes it so code is obstructed on release
	},
})