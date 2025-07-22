import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5000,
    open: true,
    allowedHosts: ['e3942ae279ac.ngrok-free.app'],
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});
