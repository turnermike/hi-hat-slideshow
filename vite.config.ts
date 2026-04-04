import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig as defineTestConfig } from 'vitest/config';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      external: ['@ffmpeg-installer/ffmpeg', '@remotion/bundler', '@remotion/renderer']
    }
  },
  ...defineTestConfig({
    test: {
      environment: 'jsdom',
      globals: true,
    },
  }),
});
