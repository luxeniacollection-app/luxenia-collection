import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.ADMIN_JWT_SECRET || process.env.CEO_JWT_SECRET || 'luxenia_sovereign_secret_key_2026_jwt_token';
const CEO_EMAIL = (process.env.CEO_EMAIL || process.env.ADMIN_EMAIL || 'ceo@luxenia.com').toLowerCase().trim();
const CEO_PASSWORD = process.env.CEO_PASSWORD || process.env.ADMIN_PASSWORD || 'luxenia2026!';

/**
 * Verify CEO & Admin credentials securely on the backend
 */
export async function authenticateAdmin(email, password) {
  if (!email || !password) {
    return { success: false, error: 'Email and password are required.' };
  }

  const cleanEmail = email.toLowerCase().trim();
  const allowedEmails = [
    CEO_EMAIL,
    'ceo@luxenia.com',
    'luxeniacollection@gmail.com',
    'admin@luxenia.com',
    'caroline@luxenia.com'
  ].map(e => e.toLowerCase().trim());

  if (!allowedEmails.includes(cleanEmail)) {
    return { success: false, error: 'Access denied: Unauthorized CEO/Admin credentials.' };
  }

  // Support plain or bcrypt hashed password from environment
  let isMatch = false;
  if (CEO_PASSWORD.startsWith('$2a$') || CEO_PASSWORD.startsWith('$2b$')) {
    isMatch = await bcrypt.compare(password, CEO_PASSWORD);
  } else {
    isMatch = password === CEO_PASSWORD;
  }

  if (!isMatch) {
    return { success: false, error: 'Access denied: Incorrect password.' };
  }

  const token = jwt.sign(
    {
      email: cleanEmail,
      role: 'ceo',
      iss: 'luxenia-auth'
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  return {
    success: true,
    token,
    admin: {
      email: cleanEmail,
      name: 'Caroline G. — LUXE NIA CEO',
      role: 'ceo'
    }
  };
}

/**
 * Verify JWT token from request Authorization header
 */
export function verifyAdminToken(req) {
  const authHeader = req.headers?.authorization || req.headers?.Authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (err) {
    return null;
  }
}

/**
 * Middleware helper for CEO/Admin route protection
 */
export function requireAdminAuth(req, res) {
  const admin = verifyAdminToken(req);
  if (!admin) {
    res.status(401).json({
      success: false,
      error: 'Unauthorized: Valid CEO session token required or expired.'
    });
    return null;
  }
  return admin;
}
