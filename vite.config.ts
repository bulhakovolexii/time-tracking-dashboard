import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
export default defineConfig({
  base: "/time-tracking-dashboard/",
  plugins: [tailwindcss()],
});
