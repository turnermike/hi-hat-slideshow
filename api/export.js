import { renderProjectVideo } from '../src/server/exportVideo';
import type { ExportPayload } from '../src/server/exportVideo';

export const config = {
  runtime: 'nodejs18.x',
  maxDuration: 300,
};

export default async function handler(req: any, res: any) {
  console.log('Video export request received');
  
  // Only allow POST requests
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const payload: ExportPayload = req.body;
    console.log('Payload received:', JSON.stringify(payload, null, 2));
    
    if (!payload.project) {
      console.log('Error: No project data in payload');
      return res.status(400).json({ error: 'Invalid payload: project data required' });
    }

    console.log('Starting video export...');
    const result = await renderProjectVideo(payload);
    console.log('Video export completed successfully');

    res.setHeader('Content-Type', result.mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="portfolio-video-${Date.now()}.${result.fileExtension}"`);
    return res.status(200).send(result.buffer);
  } catch (error) {
    console.error('Video export error:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack available');
    
    const errorMessage = error instanceof Error ? error.message : 'Video export failed';
    console.log('Returning error:', errorMessage);
    
    return res.status(500).json({ error: errorMessage });
  }
}