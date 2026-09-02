import { getAllProducts, createProduct } from '../_db.js';
import { requireAdminAuth, verifyAdminToken } from '../_auth.js';

export default async function handler(req, res) {
  // Handle CORS Preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Allow', 'GET, POST, OPTIONS');
    return res.status(200).end();
  }

  // GET: Fetch product list
  if (req.method === 'GET') {
    try {
      const { category, includeInactive } = req.query || {};
      const isAdmin = !!verifyAdminToken(req);
      
      const products = await getAllProducts({
        category,
        includeInactive: isAdmin && includeInactive === 'true'
      });

      return res.status(200).json({
        success: true,
        count: products.length,
        products
      });
    } catch (err) {
      console.error('Error fetching products:', err);
      return res.status(500).json({ success: false, error: 'Failed to retrieve products from database.' });
    }
  }

  // POST: Add new product (Admin Protected)
  if (req.method === 'POST') {
    const admin = requireAdminAuth(req, res);
    if (!admin) return; // 401 response already sent by requireAdminAuth

    try {
      const productData = req.body || {};
      if (!productData.name) {
        return res.status(400).json({ success: false, error: 'Product name is required.' });
      }
      if (!productData.priceKes) {
        return res.status(400).json({ success: false, error: 'Product price in KSh is required.' });
      }

      const created = await createProduct(productData);
      return res.status(201).json({
        success: true,
        message: `Product "${created.name}" created successfully.`,
        product: created
      });
    } catch (err) {
      console.error('Error creating product:', err);
      return res.status(500).json({ success: false, error: err.message || 'Failed to create product in database.' });
    }
  }

  return res.status(405).json({ success: false, error: 'Method not allowed.' });
}
