import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite"; // This is the v4 engine

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5555",
        changeOrigin: true,
      },
      "/auth": {
        target: "http://localhost:5555",
        changeOrigin: true,
      },
      "/articles": {
        target: "http://localhost:5555",
        changeOrigin: true,
      },
      "/categories": {
        target: "http://localhost:5555",
        changeOrigin: true,
      },
      "/users": {
        target: "http://localhost:5555",
        changeOrigin: true,
      },
      "/comments": {
        target: "http://localhost:5555",
        changeOrigin: true,
      },
      "/reactions": {
        target: "http://localhost:5555",
        changeOrigin: true,
      },
      "/leagues": {
        target: "http://localhost:5555",
        changeOrigin: true,
      },
      "/teams": {
        target: "http://localhost:5555",
        changeOrigin: true,
      },
      "/matches": {
        target: "http://localhost:5555",
        changeOrigin: true,
      },
      "/predictions": {
        target: "http://localhost:5555",
        changeOrigin: true,
      },
      "/admin": {
        target: "http://localhost:5555",
        changeOrigin: true,
      },
    },
  },
});
