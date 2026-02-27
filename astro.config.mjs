// @ts-check
import { defineConfig, fontProviders } from "astro/config";
import netlify from "@astrojs/netlify";

export default defineConfig({
  output: "server",

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

  adapter: netlify(),
});
