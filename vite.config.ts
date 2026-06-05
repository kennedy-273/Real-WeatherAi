import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  vite: {
    base: "/",
    server: {
      port: 5173,
    },
    build: {
      outDir: "dist",
      minify: "esbuild",
      sourcemap: false,
    },
  },
});


















