import { createOrder, reduceProductStock } from '../_db.js';

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Allow', 'POST, OPTIONS');
    return res.status(200).end();
  }

  // POST: Public Guest Checkout (No customer registration or login required)
  if (req.method === 'POST') {
    try {
      const {
        customer_name,
        customerName,
        customer_contact,
        customerContact,
        customerEmail,
        mpesaPhone,
        items,
        total,
        payment_status,
        paymentStatus,
        paymentMethod,
        delivery_address,
        shippingAddress
      } = req.body || {};

      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ success: false, error: 'Order items are required.' });
      }

      const name = (customer_name || customerName || shippingAddress?.fullName || 'Guest Client').trim();
      const contact = (customer_contact || customerContact || customerEmail || mpesaPhone || shippingAddress?.phone || '').trim();

      const orderPayload = {
        customer_name: name,
        customer_contact: contact,
        items,
        total: Number(total) || 0,
        status: 'pending',
        payment_status: (payment_status || paymentStatus || 'paid').toLowerCase() === 'unpaid' ? 'unpaid' : 'paid',
        paymentMethod: paymentMethod || 'M-Pesa / WhatsApp Concierge',
        delivery_address: delivery_address || shippingAddress?.address || 'Nairobi Delivery',
        shippingAddress: shippingAddress || {
          fullName: name,
          phone: contact,
          address: delivery_address || 'Nairobi Delivery',
          city: 'Nairobi'
        }
      };

      // 1. Create order in database
      const order = await createOrder(orderPayload);

      // 2. Reduce stock for purchased items
      try {
        await reduceProductStock(items);
      } catch (stockErr) {
        console.warn('Stock update notice:', stockErr);
      }

      return res.status(201).json({
        success: true,
        message: `Order #${order.id} placed successfully.`,
        order
      });
    } catch (err) {
      console.error('Error creating guest order:', err);
      return res.status(500).json({ success: false, error: err.message || 'Failed to record order.' });
    }
  }

  return res.status(405).json({ success: false, error: 'Method not allowed. Use POST.' });
}
