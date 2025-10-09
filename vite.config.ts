import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import path from "node:path";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";

export default defineConfig({
	plugins: [react(), svgr(), tailwindcss()],
	server: {
		port: 3000,
	},
	css: {
		modules: {
			exportGlobals: false,
			generateScopedName: (name, filename) => {
				const file = path.basename(filename, ".module.css");
				return `${file}__${name}__${Math.random().toString(36).substring(7)}`;
			},
		},
	},
});
