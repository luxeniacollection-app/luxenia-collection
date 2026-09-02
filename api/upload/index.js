import { saveProductImage } from '../_storage.js';
import { requireAdminAuth } from '../_auth.js';

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Allow', 'POST, OPTIONS');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed. Use POST.' });
  }

  const admin = requireAdminAuth(req, res);
  if (!admin) return;

  try {
    const { image, name } = req.body || {};
    if (!image) {
      return res.status(400).json({ success: false, error: 'No image data payload provided.' });
    }

    const imageUrl = await saveProductImage(image, name || 'luxe-product');

    return res.status(200).json({
      success: true,
      message: 'Product image uploaded successfully.',
      imageUrl
    });
  } catch (err) {
    console.error('Image Upload Error:', err);
    return res.status(500).json({ success: false, error: err.message || 'Failed to upload product image.' });
  }
}
