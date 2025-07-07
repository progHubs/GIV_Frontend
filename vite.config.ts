import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5000,
    open: true,
    allowedHosts: ['ee6b-196-189-185-159.ngrok-free.app'],
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});
