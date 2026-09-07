import { getCustomerById, getCustomerByEmail, updateCustomer } from '../_db.js';
import { verifyCustomerToken } from '../_auth.js';

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Allow', 'GET, PUT, OPTIONS');
    return res.status(200).end();
  }

  const decoded = verifyCustomerToken(req);
  if (!decoded) {
    return res.status(401).json({ success: false, error: 'Authentication required.' });
  }

  // GET: Fetch customer profile
  if (req.method === 'GET') {
    try {
      const customer = (await getCustomerById(decoded.id)) || (await getCustomerByEmail(decoded.email));
      if (!customer) {
        return res.status(404).json({ success: false, error: 'Customer not found.' });
      }
      const { passwordHash, ...safe } = customer;
      return res.status(200).json({ success: true, customer: safe });
    } catch (err) {
      return res.status(500).json({ success: false, error: 'Failed to retrieve profile.' });
    }
  }

  // PUT: Update customer profile (delivery address, phone, saved cart)
  if (req.method === 'PUT') {
    try {
      const updates = req.body || {};
      delete updates.passwordHash; // Don't allow raw hash update here

      const updated = await updateCustomer(decoded.id || decoded.email, updates);
      return res.status(200).json({
        success: true,
        message: 'Profile updated successfully.',
        customer: updated
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message || 'Failed to update profile.' });
    }
  }

  return res.status(405).json({ success: false, error: 'Method not allowed.' });
}
