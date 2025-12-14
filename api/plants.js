export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { query, id } = req.query;
  const TREFLE_API_KEY = process.env.TREFLE_API_KEY;

  if (!TREFLE_API_KEY) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    let url;
    if (id) {
      // Get specific plant details
      url = `https://trefle.io/api/v1/plants/${id}?token=${TREFLE_API_KEY}`;
    } else if (query) {
      // Search plants
      url = `https://trefle.io/api/v1/plants/search?token=${TREFLE_API_KEY}&q=${encodeURIComponent(query)}`;
    } else {
      return res.status(400).json({ error: 'Query or ID required' });
    }

    const response = await fetch(url);
    const data = await response.json();
    
    return res.status(200).json(data);
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Failed to fetch plant data' });
  }
}