import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  server: {
    host: true,
    allowedHosts: true
  },
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg"],
      manifest: {
        name: "Body Parts Fun Game",
        short_name: "BodyParts",
        description: "Kid-friendly drag and drop body parts learning game",
        theme_color: "#22c55e",
        background_color: "#f0fdfa",
        display: "standalone",
        orientation: "portrait",
        scope: "/",
        start_url: "/",
        icons: [
          {
            src: "pwa-192.svg",
            sizes: "192x192",
            type: "image/svg+xml"
          },
          {
            src: "pwa-512.svg",
            sizes: "512x512",
            type: "image/svg+xml"
          },
          {
            src: "pwa-512.svg",
            sizes: "512x512",
            type: "image/svg+xml",
            purpose: "maskable"
          }
        ]
      }
    })
  ]
});
