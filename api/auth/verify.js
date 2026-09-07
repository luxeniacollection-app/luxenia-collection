import { verifyAdminToken } from '../_auth.js';

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Allow', 'GET, OPTIONS');
    return res.status(200).end();
  }

  const admin = verifyAdminToken(req);
  if (!admin) {
    return res.status(401).json({ success: false, authenticated: false, error: 'Invalid or expired session token.' });
  }

  return res.status(200).json({
    success: true,
    authenticated: true,
    admin: {
      email: admin.email,
      name: 'Atelier Administrator',
      role: 'admin'
    }
  });
}
