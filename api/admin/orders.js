import { getAllOrders, updateOrderStatus, updateOrderPaymentStatus, getAllProducts } from '../_db.js';
import { requireAdminAuth } from '../_auth.js';

export const VALID_ORDER_STATUSES = ['pending', 'delivered', 'delayed'];
export const VALID_PAYMENT_STATUSES = ['paid', 'unpaid'];

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Allow', 'GET, PUT, PATCH, OPTIONS');
    return res.status(200).end();
  }

  // Strict Admin Authorization Verification (Only the single Admin role)
  const auth = requireAdminAuth(req, res);
  if (!auth.authenticated) return; // Response sent by requireAdminAuth

  // GET: Retrieve all customer orders and executive metric summaries
  if (req.method === 'GET') {
    try {
      const orders = await getAllOrders();
      const products = await getAllProducts({ includeInactive: true });

      const pendingOrders = orders.filter(o => o.status === 'pending').length;
      const deliveredOrders = orders.filter(o => o.status === 'delivered').length;
      const delayedOrders = orders.filter(o => o.status === 'delayed').length;
      const paidOrders = orders.filter(o => o.payment_status === 'paid').length;
      const unpaidOrders = orders.filter(o => o.payment_status === 'unpaid').length;

      const totalProducts = products.length;
      const inStockProducts = products.filter(p => (Number(p.stock) || 0) > 0).length;
      const outOfStockProducts = products.filter(p => (Number(p.stock) || 0) === 0).length;

      return res.status(200).json({
        success: true,
        orders,
        summaries: {
          totalOrders: orders.length,
          pendingOrders,
          deliveredOrders,
          delayedOrders,
          paidOrders,
          unpaidOrders,
          totalProducts,
          inStockProducts,
          outOfStockProducts
        }
      });
    } catch (err) {
      console.error('Error fetching admin orders:', err);
      return res.status(500).json({ success: false, error: 'Failed to retrieve orders.' });
    }
  }

  // PUT / PATCH: Update order status or payment status
  if (req.method === 'PUT' || req.method === 'PATCH') {
    try {
      const { orderId, status, payment_status, paymentStatus } = req.body || {};

      if (!orderId) {
        return res.status(400).json({ success: false, error: 'Order ID is required.' });
      }

      let updatedOrder = null;

      // Update Order Status if provided
      if (status !== undefined) {
        const normalizedStatus = status.toLowerCase();
        let validStatus = 'pending';
        if (normalizedStatus.includes('deliver')) validStatus = 'delivered';
        else if (normalizedStatus.includes('delay')) validStatus = 'delayed';
        else validStatus = 'pending';

        updatedOrder = await updateOrderStatus(orderId, validStatus);
      }

      // Update Payment Status if provided
      const targetPaymentStatus = payment_status !== undefined ? payment_status : paymentStatus;
      if (targetPaymentStatus !== undefined) {
        const normalizedPayment = targetPaymentStatus.toLowerCase();
        const validPayment = normalizedPayment === 'unpaid' ? 'unpaid' : 'paid';
        updatedOrder = await updateOrderPaymentStatus(orderId, validPayment);
      }

      if (!updatedOrder) {
        return res.status(400).json({
          success: false,
          error: 'No valid status or payment_status provided for update.'
        });
      }

      return res.status(200).json({
        success: true,
        message: `Order #${orderId} updated successfully.`,
        order: updatedOrder
      });
    } catch (err) {
      console.error('Error updating order:', err);
      return res.status(500).json({ success: false, error: err.message || 'Failed to update order.' });
    }
  }

  return res.status(405).json({ success: false, error: 'Method not allowed. Use GET or PUT.' });
}
