import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  base: mode === 'development' ? '/' : '/sacramento110/',
  server: {
    port: 3000,
    strictPort: false, // Try next available port if 3000 is in use
    host: true, // Allow external connections
    open: true, // Automatically open browser
  },
  build: {
    outDir: 'dist',
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
}));
