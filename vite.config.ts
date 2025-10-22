import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
	build: {
		target: "node22",
		lib: {
			entry: resolve(__dirname, "src/index.ts"),
			name: "notes-api",
			fileName: "index",
			formats: ["es"],
		},
		rollupOptions: {
			external: ["@hono/node-server", "hono"],
			output: {
				format: "es",
			},
		},
		outDir: "dist",
		emptyOutDir: true,
		sourcemap: true,
	},
	resolve: {
		extensions: [".ts", ".js"],
	},
	esbuild: {
		platform: "node",
		target: "node18",
	},
});
