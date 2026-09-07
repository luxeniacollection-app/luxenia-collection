import bcrypt from 'bcryptjs';
import { getCustomerByEmail, getCustomerOrders } from '../_db.js';
import { generateCustomerToken } from '../_auth.js';

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Allow', 'POST, OPTIONS');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed. Use POST.' });
  }

  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Please enter both your email and password.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const customer = await getCustomerByEmail(cleanEmail);

    if (!customer) {
      return res.status(401).json({ success: false, error: 'No account found with this email. Please check your spelling or register.' });
    }

    // Verify password
    let isMatch = false;
    if (customer.passwordHash) {
      isMatch = await bcrypt.compare(password, customer.passwordHash);
    }

    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Incorrect password. Please try again.' });
    }

    const token = generateCustomerToken(customer);
    const orders = await getCustomerOrders(customer.email);

    const { passwordHash, ...safeCustomer } = customer;

    return res.status(200).json({
      success: true,
      message: `Welcome back, ${safeCustomer.fullName}!`,
      token,
      customer: safeCustomer,
      orders
    });
  } catch (err) {
    console.error('Customer login error:', err);
    return res.status(500).json({ success: false, error: 'Authentication failed. Please try again.' });
  }
}
