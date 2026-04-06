import { renderProjectVideo } from '../../src/server/exportVideo';
import type { ExportPayload } from '../../src/server/exportVideo';

export async function POST(request: Request) {
  console.log('Video export request received');
  
  try {
    const payload: ExportPayload = await request.json();
    console.log('Payload received:', JSON.stringify(payload, null, 2));
    
    if (!payload.project) {
      console.log('Error: No project data in payload');
      return Response.json(
        { error: 'Invalid payload: project data required' },
        { status: 400 }
      );
    }

    console.log('Starting video export...');
    const result = await renderProjectVideo(payload);
    console.log('Video export completed successfully');

    return new Response(result.buffer, {
      status: 200,
      headers: {
        'Content-Type': result.mimeType,
        'Content-Disposition': `attachment; filename="portfolio-video-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}.${result.fileExtension}"`,
      },
    });
  } catch (error) {
    console.error('Video export error:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack available');
    
    const errorMessage = error instanceof Error ? error.message : 'Video export failed';
    console.log('Returning error:', errorMessage);
    
    return Response.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}