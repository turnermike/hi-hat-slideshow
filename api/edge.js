export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  try {
    // Basic response test for Edge Runtime
    return new Response(JSON.stringify({ 
      message: 'Edge runtime test working!',
      method: req.method,
      timestamp: new Date().toISOString(),
      url: req.url
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Edge runtime test error:', error);
    return new Response(JSON.stringify({ 
      error: 'Edge runtime test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}