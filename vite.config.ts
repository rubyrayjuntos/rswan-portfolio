import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { nitro } from "nitro/vite";

export default defineConfig(({ command, isPreview }) => ({
  server: {
    host: "127.0.0.1",
    port: 8082,
    strictPort: true,
  },
  preview: {
    host: "127.0.0.1",
    port: 8083,
    strictPort: true,
  },
  resolve: { tsconfigPaths: true },
  plugins: [
    tailwindcss(),
    tanstackStart(),
    // Render sets RENDER=true: emit a plain Node server (.output/).
    // Everywhere else (Vercel) keeps the vercel preset.
    ...(command === "build" || isPreview
      ? [nitro({ preset: process.env.RENDER ? "node-server" : "vercel" })]
      : []),
    viteReact(),
  ],
}));
