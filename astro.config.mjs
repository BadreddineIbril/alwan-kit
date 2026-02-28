// @ts-check
import { defineConfig, fontProviders } from "astro/config";
import netlify from "@astrojs/netlify";
import partytown from "@astrojs/partytown";

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
  integrations: [
    partytown({
      config: {
        forward: ["dataLayer.push"],
      },
    }),
  ],
});
