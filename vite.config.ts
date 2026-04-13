import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

const cssPreloadPlugin = () => ({
  name: 'css-preload',
  enforce: 'post' as const,
  transformIndexHtml(html: string) {
    return html.replace(/<link rel="stylesheet"(?: crossorigin)? href="([^"]+\.css)">/g, (_, href) => `<link rel="preload" href="${href}" as="style" onload="this.onload=null;this.rel='stylesheet'">\n    <noscript><link rel="stylesheet" href="${href}"></noscript>`);
  },
});

// Local API plugin for development
const exportApiPlugin = () => {
  const registerRoute = (middlewares: any) => {
    middlewares.use('/api/export', async (req: any, res: any) => {
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
        console.error('Video export error:', error);
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: error instanceof Error ? error.message : 'Video export failed' }));
      }
    });
  };

  return {
    name: 'export-api',
    configureServer(server: any) {
      registerRoute(server.middlewares);
    },
    configurePreviewServer(server: any) {
      registerRoute(server.middlewares);
    },
  };
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    cssPreloadPlugin(),
    // Only include local API in development
    process.env.NODE_ENV !== 'production' ? exportApiPlugin() : null,
  ].filter(Boolean),
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      external: ['@ffmpeg-installer/ffmpeg', '@remotion/bundler', '@remotion/renderer'],
    },
  },
});
