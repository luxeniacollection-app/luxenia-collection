import { authenticateAdmin } from '../_auth.js';

export default async function handler(req, res) {
  // CORS & Methods
  if (req.method === 'OPTIONS') {
    res.setHeader('Allow', 'POST, OPTIONS');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed. Use POST.' });
  }

  try {
    const { email, password } = req.body || {};
    const result = await authenticateAdmin(email, password);

    if (!result.success) {
      return res.status(401).json({ success: false, error: result.error });
    }

    return res.status(200).json({
      success: true,
      message: 'Admin authentication successful.',
      token: result.token,
      admin: result.admin
    });
  } catch (err) {
    console.error('Admin Login Error:', err);
    return res.status(500).json({ success: false, error: 'Internal server error during authentication.' });
  }
}
