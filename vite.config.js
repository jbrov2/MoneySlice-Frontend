import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/MoneySlice/",
  plugins: [react()],
  css: {
    modules: {
      //Enable camel case names
      localsConvention: "camelCase",
      //scopes the class names to avoid conflicts
      generateScopedName: "[name]__[local]___[hash:base64:5]",
    },
  },
  build: {
    assetsInlineLimit: 0,
    rollupOptions: {
      output: {
        assetFileNames: "assets/[name].[ext]",
      },
    },
  },
});
