import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Raise the warning limit slightly to accommodate 3D engine sizes
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Split 3D libraries into their own chunk
          if (
            id.includes("node_modules/three") ||
            id.includes("node_modules/@react-three")
          ) {
            return "vendor-three";
          }
          // Split Firebase into its own chunk
          if (id.includes("node_modules/firebase")) {
            return "vendor-firebase";
          }
          // Split other large node_modules (React, wouter, axios, etc.)
          if (id.includes("node_modules")) {
            return "vendor-utils";
          }
        },
      },
    },
  },
});
