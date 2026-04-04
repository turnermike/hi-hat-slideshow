import { renderProjectVideo } from '../../src/server/exportVideo';
import type { ExportPayload } from '../../src/server/exportVideo';

export async function POST(request: Request) {
  try {
    const payload: ExportPayload = await request.json();
    
    if (!payload.project) {
      return Response.json(
        { error: 'Invalid payload: project data required' },
        { status: 400 }
      );
    }

    const result = await renderProjectVideo(payload);

    return new Response(result.buffer, {
      status: 200,
      headers: {
        'Content-Type': result.mimeType,
        'Content-Disposition': `attachment; filename="portfolio-video-${Date.now()}.${result.fileExtension}"`,
      },
    });
  } catch (error) {
    console.error('Video export error:', error);
    return Response.json(
      { error: error instanceof Error ? error.message : 'Video export failed' },
      { status: 500 }
    );
  }
}