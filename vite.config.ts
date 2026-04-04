import { defineConfig } from 'vitest/config';
import type { Connect, PluginOption, PreviewServer } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import type { IncomingMessage, ServerResponse } from 'node:http';

const exportApiPlugin = (): PluginOption => {
  const registerRoute = (middlewares: Connect.Server) => {
    middlewares.use('/api/export', async (req: IncomingMessage, res: ServerResponse<IncomingMessage>) => {
      if (req.method !== 'POST') {
        res.statusCode = 405;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Method not allowed' }));
        return;
      }

      try {
        const chunks: Uint8Array[] = [];
        for await (const chunk of req) {
          chunks.push(chunk);
        }

        const rawBody = Buffer.concat(chunks).toString('utf-8');
        const payload = JSON.parse(rawBody);
        
        // Dynamic import for server-side functionality
        const { renderProjectVideo } = await import('./src/server/exportVideo');
        const result = await renderProjectVideo(payload);

        res.statusCode = 200;
        res.setHeader('Content-Type', result.mimeType);
        res.setHeader('Content-Disposition', `attachment; filename="portfolio-video-${Date.now()}.${result.fileExtension}"`);
        res.end(result.buffer);
      } catch (error) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: error instanceof Error ? error.message : 'Video export failed' }));
      }
    });
  };

  return {
    name: 'export-api',
    configureServer(server) {
      registerRoute(server.middlewares);
    },
    configurePreviewServer(server: PreviewServer) {
      registerRoute(server.middlewares as Connect.Server);
    },
  };
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    process.env.NODE_ENV === 'production' ? null : exportApiPlugin()
  ].filter(Boolean),
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
  test: {
    environment: 'jsdom',
    globals: true,
  },
});
