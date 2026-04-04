export default async function handler(req: any, res: any) {
  try {
    // Basic response test
    return res.status(200).json({ 
      message: 'Ultra simple test working!',
      method: req.method,
      timestamp: new Date().toISOString(),
      headers: req.headers
    });
  } catch (error) {
    console.error('Ultra simple test error:', error);
    return res.status(500).json({ 
      error: 'Ultra simple test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}