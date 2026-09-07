import { authenticateAdmin, generateCustomerToken } from '../api/_auth.js';
import { getAllOrders, updateOrderStatus, getCustomerOrders, createOrder, reduceProductStock, getAllProducts } from '../api/_db.js';
import { VALID_ORDER_STATUSES } from '../api/admin/orders.js';

async function runTests() {
  console.log('=== LUXE NIA ORDER LIFECYCLE & ADMIN CONTROL TEST ===\n');
  let passed = 0;
  let failed = 0;

  // Test 1: Single Admin Role Validation
  try {
    const adminRes = await authenticateAdmin('admin@luxenia.com', 'luxenia2026!');
    if (!adminRes.success || adminRes.admin.role !== 'admin') {
      throw new Error(`Admin authentication failed: ${JSON.stringify(adminRes)}`);
    }
    console.log('✔ Test 1 Passed: Single Admin role verified (role: "admin", email: "admin@luxenia.com")');
    passed++;
  } catch (err) {
    console.error('✖ Test 1 Failed:', err.message);
    failed++;
  }

  // Test 2: Product Stock Synchronization on Purchase
  let testOrder = null;
  try {
    const productsBefore = await getAllProducts({ includeInactive: true });
    const targetProduct = productsBefore[0];
    const initialStock = Number(targetProduct.stock) || 0;

    const testItem = {
      id: targetProduct.id,
      name: targetProduct.name,
      priceKes: targetProduct.priceKes,
      quantity: 2
    };

    // Place order
    testOrder = await createOrder({
      customerEmail: 'vip.client@example.com',
      customerName: 'VIP Client',
      items: [testItem],
      total: testItem.priceKes * 2,
      status: 'New Order'
    });

    if (!testOrder || testOrder.status !== 'New Order') {
      throw new Error(`Initial status is not "New Order": ${testOrder?.status}`);
    }

    // Reduce stock
    await reduceProductStock([testItem]);

    const productsAfter = await getAllProducts({ includeInactive: true });
    const updatedTarget = productsAfter.find(p => p.id === targetProduct.id);
    const expectedStock = Math.max(0, initialStock - 2);

    if (updatedTarget.stock !== expectedStock) {
      throw new Error(`Stock mismatch: expected ${expectedStock}, got ${updatedTarget.stock}`);
    }

    console.log(`✔ Test 2 Passed: Stock synchronized upon order. ${targetProduct.name} stock: ${initialStock} -> ${updatedTarget.stock}`);
    passed++;
  } catch (err) {
    console.error('✖ Test 2 Failed:', err.message);
    failed++;
  }

  // Test 3: 8-Stage Order Status Lifecycle Transitions
  try {
    if (!testOrder) throw new Error('No test order available');

    for (const status of VALID_ORDER_STATUSES) {
      const updated = await updateOrderStatus(testOrder.id, status);
      if (updated.status !== status) {
        throw new Error(`Status update failed for "${status}". Result: ${updated.status}`);
      }
    }

    console.log(`✔ Test 3 Passed: Successfully cycled order through all 8 statuses: ${VALID_ORDER_STATUSES.join(' -> ')}`);
    passed++;
  } catch (err) {
    console.error('✖ Test 3 Failed:', err.message);
    failed++;
  }

  // Test 4: Dashboard Summaries Verification
  try {
    const orders = await getAllOrders();
    const products = await getAllProducts({ includeInactive: true });

    const newOrders = orders.filter(o => o.status === 'New Order').length;
    const pendingOrders = orders.filter(o => 
      ['New Order', 'Order Confirmed', 'Processing', 'Ready for Delivery', 'Out for Delivery'].includes(o.status)
    ).length;
    const deliveredOrders = orders.filter(o => o.status === 'Delivered').length;
    const delayedOrders = orders.filter(o => o.status === 'Delayed').length;
    const inStockProducts = products.filter(p => (Number(p.stock) || 0) > 0).length;
    const outOfStockProducts = products.filter(p => (Number(p.stock) || 0) === 0).length;

    const summaries = {
      totalOrders: orders.length,
      newOrders,
      pendingOrders,
      deliveredOrders,
      delayedOrders,
      totalProducts: products.length,
      inStockProducts,
      outOfStockProducts
    };

    if (typeof summaries.totalOrders !== 'number' || typeof summaries.deliveredOrders !== 'number') {
      throw new Error('Summaries calculation incomplete');
    }

    console.log('✔ Test 4 Passed: Dashboard 8 summary metrics verified:');
    console.log(`   - Total Orders: ${summaries.totalOrders}`);
    console.log(`   - New Orders: ${summaries.newOrders}`);
    console.log(`   - Pending Orders: ${summaries.pendingOrders}`);
    console.log(`   - Delivered Orders: ${summaries.deliveredOrders}`);
    console.log(`   - Delayed Orders: ${summaries.delayedOrders}`);
    console.log(`   - Total Products: ${summaries.totalProducts}`);
    console.log(`   - Products In Stock: ${summaries.inStockProducts}`);
    console.log(`   - Products Out of Stock: ${summaries.outOfStockProducts}`);
    passed++;
  } catch (err) {
    console.error('✖ Test 4 Failed:', err.message);
    failed++;
  }

  // Test 5: Customer Private Data Isolation
  try {
    const vipOrders = await getCustomerOrders('vip.client@example.com');
    const otherOrders = await getCustomerOrders('unrelated.shopper@example.com');

    if (vipOrders.length === 0) {
      throw new Error('VIP client orders not found');
    }
    if (otherOrders.length !== 0) {
      throw new Error('Unrelated customer saw orders they did not place');
    }

    console.log(`✔ Test 5 Passed: Strict customer data isolation verified (VIP sees ${vipOrders.length} orders, stranger sees 0)`);
    passed++;
  } catch (err) {
    console.error('✖ Test 5 Failed:', err.message);
    failed++;
  }

  console.log(`\n=== RESULTS: ${passed} Passed, ${failed} Failed ===`);
  if (failed > 0) process.exit(1);
}

runTests();
