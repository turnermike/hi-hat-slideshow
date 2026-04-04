import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Production Vite config for Vercel deployment
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      external: ['@ffmpeg-installer/ffmpeg', '@remotion/bundler', '@remotion/renderer']
    }
  }
});
