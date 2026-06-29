import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";

const API_KEY = process.env.WEATHER_AI_KEY ?? "wai_7bf0d5.2c22cb06ff75600ce30fd203b86d52947e4c6f731e3abab4";

export default defineConfig({
  plugins: [react(), tailwindcss(), tsconfigPaths()],
  base: "/",
  server: {
    port: 5173,
    proxy: {
      "/api/weather": {
        target: "https://api.weather-ai.co",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/weather/, "/v1/weather"),
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        },
      },
    },
  },
  build: {
    outDir: "dist",
    minify: "esbuild",
    sourcemap: false,
  },
});