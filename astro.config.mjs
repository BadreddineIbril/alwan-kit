// @ts-check
import { defineConfig, fontProviders } from "astro/config";

export default defineConfig({
  output: "server",
  devToolbar: {
    enabled: false,
  },
  experimental: {
    svgo: true,
    fonts: [
      {
        provider: fontProviders.google(),
        name: "DM Sans",
        cssVariable: "--font-dm-sans",
      },
    ],
  },
});
