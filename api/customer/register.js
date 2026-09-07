export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Allow', 'POST, OPTIONS');
    return res.status(200).end();
  }

  return res.status(410).json({ 
    success: false, 
    error: 'Customer account creation has been disabled. LUXE NIA uses seamless guest checkout without requiring accounts.' 
  });
}
