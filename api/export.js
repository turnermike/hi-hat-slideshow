export const config = {
  runtime: 'edge'
};

export default async function handler(req) {
  // Add CORS headers for all requests
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  // Handle OPTIONS requests for CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders
    });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({error: 'Method not allowed'}), {
      status: 405,
      headers: {...corsHeaders, 'content-type': 'application/json'}
    });
  }

  try {
    const payload = await req.json();
    
    console.log('Export request received:', JSON.stringify(payload, null, 2));
    
    if (!payload.project) {
      return new Response(JSON.stringify({error: 'Invalid payload: project data required'}), {
        status: 400,
        headers: {...corsHeaders, 'content-type': 'application/json'}
      });
    }

    console.log('Starting video export...');

    // For now, return a mock video response to test the pipeline
    // We'll implement actual video processing next
    const mockVideoBuffer = new Uint8Array([0x00, 0x00, 0x00, 0x20]); // Minimal MP4 header
    
    return new Response(mockVideoBuffer, {
      status: 200,
      headers: {
        ...corsHeaders,
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
      headers: {...corsHeaders, 'content-type': 'application/json'}
    });
  }
}