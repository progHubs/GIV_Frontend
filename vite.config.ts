import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
            "@/components": path.resolve(__dirname, "./src/components"),
            "@/features": path.resolve(__dirname, "./src/features"),
            "@/hooks": path.resolve(__dirname, "./src/hooks"),
            "@/lib": path.resolve(__dirname, "./src/lib"),
            "@/types": path.resolve(__dirname, "./src/types"),
            "@/utils": path.resolve(__dirname, "./src/utils"),
            "@/assets": path.resolve(__dirname, "./src/assets"),
            "@/layouts": path.resolve(__dirname, "./src/layouts"),
            "@/routes": path.resolve(__dirname, "./src/routes"),
            "@/locales": path.resolve(__dirname, "./src/locales"),
        },
    },
    server: {
        port: 5000,
        open: true,
        allowedHosts: ["ee6b-196-189-185-159.ngrok-free.app"]
    },
    build: {
        outDir: "dist",
        sourcemap: true,
    },
});
