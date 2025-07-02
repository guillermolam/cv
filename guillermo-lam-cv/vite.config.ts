import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import md from "vite-plugin-md";

export default defineConfig({
  base: "/cv/", // Required for correct links/assets on GitHub Pages
  build: {
    outDir: "dist", // Default, matches your deploy workflow
    emptyOutDir: true,
  },
  server: {
    port: 5173, // Local dev on the same port as Vite default
    strictPort: true,
    open: true,
  },
  preview: {
    port: 5173,
    strictPort: true,
  },
  plugins: [
    solid({ extensions: [".js", ".jsx", ".ts", ".tsx", ".md"] }),
    md(), // Markdown support
  ],
});
