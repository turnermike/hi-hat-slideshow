export default async function handler(req: any, res: any) {
  console.log('Simple test function called');
  
  // Only allow POST requests
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Request body:', req.body);
    
    // Return a simple success response for testing
    return res.status(200).json({ 
      message: 'Test function working!',
      timestamp: new Date().toISOString(),
      received: req.body
    });
  } catch (error) {
    console.error('Test function error:', error);
    return res.status(500).json({ error: error instanceof Error ? error.message : 'Test failed' });
  }
}