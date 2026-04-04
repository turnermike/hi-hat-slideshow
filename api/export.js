export const config = {
  runtime: 'edge'
};

// External video processing service (you can replace this with your preferred service)
const VIDEO_PROCESSING_SERVICE = 'https://api.remotion.dev/render';

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({error: 'Method not allowed'}), {
      status: 405,
      headers: {'content-type': 'application/json'}
    });
  }

  try {
    const payload = await req.json();
    
    if (!payload.project) {
      return new Response(JSON.stringify({error: 'Invalid payload: project data required'}), {
        status: 400,
        headers: {'content-type': 'application/json'}
      });
    }

    console.log('Starting video export via external service...');

    // Call external video processing service
    const response = await fetch(VIDEO_PROCESSING_SERVICE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.REMOTION_API_KEY || 'demo-key'}`
      },
      body: JSON.stringify({
        composition: 'SlideShow',
        inputProps: { project: payload.project },
        codec: 'h264',
        fps: payload.project.exportSettings?.fps || 30,
        width: 1920,
        height: 1080,
        durationInFrames: 180 // 6 seconds at 30fps
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Video processing failed: ${response.status} ${errorText}`);
    }

    // Get the video data
    const videoBuffer = await response.arrayBuffer();
    
    return new Response(videoBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'video/mp4',
        'Content-Disposition': `attachment; filename="portfolio-video-${Date.now()}.mp4"`
      }
    });

  } catch (error) {
    console.error('Video export error:', error);
    return new Response(JSON.stringify({
      error: error instanceof Error ? error.message : 'Video export failed'
    }), {
      status: 500,
      headers: {'content-type': 'application/json'}
    });
  }
}