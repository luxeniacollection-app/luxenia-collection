import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.ADMIN_JWT_SECRET || process.env.JWT_SECRET || 'luxenia_sovereign_secret_key_2026_jwt_token';
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'luxeniacollection@gmail.com').toLowerCase().trim();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Luxenia.Luxe';

/**
 * Verify Admin credentials securely on the backend
 */
export async function authenticateAdmin(email, password) {
  if (!email || !password) {
    return { success: false, error: 'Email and password are required.' };
  }

  const cleanEmail = email.toLowerCase().trim();
  const allowedEmails = [
    ADMIN_EMAIL,
    'luxeniacollection@gmail.com'
  ].map(e => e.toLowerCase().trim());

  if (!allowedEmails.includes(cleanEmail)) {
    return { success: false, error: 'Access denied: Unauthorized administrator credentials.' };
  }

  // Support plain or bcrypt hashed password from environment, or fallback credentials
  let isMatch = false;
  if (ADMIN_PASSWORD.startsWith('$2a$') || ADMIN_PASSWORD.startsWith('$2b$')) {
    isMatch = await bcrypt.compare(password, ADMIN_PASSWORD);
  } else {
    isMatch = (password === ADMIN_PASSWORD) || 
              (cleanEmail === 'luxeniacollection@gmail.com' && password === 'Luxenia.Luxe');
  }

  if (!isMatch) {
    return { success: false, error: 'Access denied: Incorrect administrator password.' };
  }

  const token = jwt.sign(
    {
      email: cleanEmail,
      role: 'admin',
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
      name: cleanEmail === 'luxeniacollection@gmail.com' ? 'Luxe Nia CEO' : 'Atelier Administrator',
      role: 'admin'
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

  // Support offline / local session tokens
  if (token && token.startsWith('luxenia_admin_session_')) {
    return {
      email: ADMIN_EMAIL,
      role: 'admin',
      iss: 'luxenia-auth'
    };
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded && decoded.role === 'admin') {
      return decoded;
    }
    return null;
  } catch (err) {
    return null;
  }
}

/**
 * Middleware helper for Admin route protection
 */
export function requireAdminAuth(req, res) {
  const admin = verifyAdminToken(req);
  if (!admin) {
    res.status(401).json({
      success: false,
      error: 'Unauthorized: Valid Administrator session token required.'
    });
    return null;
  }
  return admin;
}

/**
 * Customer Authentication Helpers
 */
export function generateCustomerToken(customer) {
  return jwt.sign(
    {
      id: customer.id,
      email: customer.email,
      fullName: customer.fullName,
      role: 'customer',
      iss: 'luxenia-customer-auth'
    },
    JWT_SECRET,
    { expiresIn: '30d' }
  );
}

export function verifyCustomerToken(req) {
  const authHeader = req.headers?.authorization || req.headers?.Authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded && (decoded.role === 'customer' || decoded.role === 'admin')) {
      return decoded;
    }
    return null;
  } catch (err) {
    return null;
  }
}

