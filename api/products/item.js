import { getProductById, updateProduct, deleteProduct } from '../_db.js';
import { requireAdminAuth } from '../_auth.js';

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Allow', 'GET, PUT, DELETE, OPTIONS');
    return res.status(200).end();
  }

  const id = req.query?.id || req.body?.id;
  if (!id) {
    return res.status(400).json({ success: false, error: 'Product ID is required.' });
  }

  // GET: Single product
  if (req.method === 'GET') {
    try {
      const product = await getProductById(id);
      if (!product) {
        return res.status(404).json({ success: false, error: `Product "${id}" not found.` });
      }
      return res.status(200).json({ success: true, product });
    } catch (err) {
      console.error('Error getting product:', err);
      return res.status(500).json({ success: false, error: 'Failed to retrieve product.' });
    }
  }

  // PUT: Update product (Admin protected)
  if (req.method === 'PUT') {
    const admin = requireAdminAuth(req, res);
    if (!admin) return;

    try {
      const updates = req.body || {};
      const updated = await updateProduct(id, updates);
      return res.status(200).json({
        success: true,
        message: `Product "${updated.name}" updated successfully.`,
        product: updated
      });
    } catch (err) {
      console.error('Error updating product:', err);
      return res.status(500).json({ success: false, error: err.message || 'Failed to update product.' });
    }
  }

  // DELETE: Delete product (Admin protected)
  if (req.method === 'DELETE') {
    const admin = requireAdminAuth(req, res);
    if (!admin) return;

    try {
      const result = await deleteProduct(id);
      return res.status(200).json({
        success: true,
        message: `Product "${id}" removed from database.`,
        deletedId: id
      });
    } catch (err) {
      console.error('Error deleting product:', err);
      return res.status(500).json({ success: false, error: err.message || 'Failed to delete product.' });
    }
  }

  return res.status(405).json({ success: false, error: 'Method not allowed.' });
}
