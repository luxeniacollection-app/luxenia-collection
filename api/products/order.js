import { reduceProductStock } from '../_db.js';

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Allow', 'POST, OPTIONS');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed. Use POST.' });
  }

  try {
    const { items } = req.body || {};
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, error: 'Array of order items with product IDs and quantities is required.' });
    }

    const result = await reduceProductStock(items);

    return res.status(200).json({
      success: true,
      message: `Stock updated for ${result.updatedCount} products.`,
      updatedProducts: result.updatedProducts,
      products: result.products
    });
  } catch (err) {
    console.error('Error reducing stock for order:', err);
    return res.status(500).json({ success: false, error: err.message || 'Failed to update stock.' });
  }
}
