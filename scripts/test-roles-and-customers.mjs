async function runTests() {
  const baseUrl = 'http://localhost:5173';
  let passed = 0;
  let failed = 0;

  console.log('=== LUXE NIA ROLE & CUSTOMER ACCOUNT SUITE TEST ===\n');

  // Test 1: Admin Login with new role
  try {
    const res = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@luxenia.com', password: 'luxenia2026!' })
    });
    const data = await res.json();
    if (res.ok && data.success && data.admin?.role === 'admin') {
      console.log('✔ Test 1 Passed: Admin login succeeded with role: "admin"');
      passed++;
    } else {
      console.error('✖ Test 1 Failed:', data);
      failed++;
    }
  } catch (e) {
    console.error('✖ Test 1 Exception:', e.message);
    failed++;
  }

  // Test 2: Old CEO login rejection (removed roles)
  try {
    const res = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'ceo@luxenia.com', password: 'luxenia2026!' })
    });
    const data = await res.json();
    if (!data.success && res.status === 401) {
      console.log('✔ Test 2 Passed: Legacy CEO role rejected as expected');
      passed++;
    } else {
      console.error('✖ Test 2 Failed: Legacy role was not rejected:', data);
      failed++;
    }
  } catch (e) {
    console.error('✖ Test 2 Exception:', e.message);
    failed++;
  }

  // Test 3: Customer Registration
  const testEmail = `jane.doe.${Date.now()}@example.com`;
  let customerToken = null;
  try {
    const res = await fetch(`${baseUrl}/api/customer/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: 'Jane Doe',
        email: testEmail,
        phone: '0712345678',
        password: 'password123',
        address: 'Westlands, Nairobi',
        city: 'Nairobi'
      })
    });
    const data = await res.json();
    if (res.status === 201 && data.success && data.customer && data.token) {
      customerToken = data.token;
      console.log('✔ Test 3 Passed: Customer registered successfully:', data.customer.fullName, data.customer.email);
      passed++;
    } else {
      console.error('✖ Test 3 Failed:', data);
      failed++;
    }
  } catch (e) {
    console.error('✖ Test 3 Exception:', e.message);
    failed++;
  }

  // Test 4: Customer Login
  try {
    const res = await fetch(`${baseUrl}/api/customer/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: 'password123'
      })
    });
    const data = await res.json();
    if (res.ok && data.success && data.customer) {
      console.log('✔ Test 4 Passed: Customer login succeeded for', data.customer.email);
      passed++;
    } else {
      console.error('✖ Test 4 Failed:', data);
      failed++;
    }
  } catch (e) {
    console.error('✖ Test 4 Exception:', e.message);
    failed++;
  }

  // Test 5: Customer Order Placement & History
  try {
    const orderRes = await fetch(`${baseUrl}/api/customer/orders`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${customerToken}`
      },
      body: JSON.stringify({
        id: `LN-ORD-TEST-${Date.now().toString().slice(-4)}`,
        customerEmail: testEmail,
        customerName: 'Jane Doe',
        total: 5800,
        items: [
          {
            id: 'prod-001',
            name: 'The Sovereign Baguette Flap Bag — Noir Black',
            priceKes: 5800,
            quantity: 1,
            image: '/images/products/luxe-baguette-noir-black.jpg'
          }
        ],
        shippingAddress: {
          fullName: 'Jane Doe',
          phone: '0712345678',
          city: 'Nairobi'
        }
      })
    });
    const orderData = await orderRes.json();
    if (orderRes.status === 201 && orderData.success) {
      console.log('✔ Test 5a Passed: Order saved successfully:', orderData.order.id);
      passed++;

      // Query customer orders
      const listRes = await fetch(`${baseUrl}/api/customer/orders?email=${encodeURIComponent(testEmail)}`, {
        headers: { 'Authorization': `Bearer ${customerToken}` }
      });
      const listData = await listRes.json();
      if (listRes.ok && listData.orders && listData.orders.length > 0) {
        console.log('✔ Test 5b Passed: Retrieved customer order history, count:', listData.orders.length);
        passed++;
      } else {
        console.error('✖ Test 5b Failed:', listData);
        failed++;
      }
    } else {
      console.error('✖ Test 5a Failed:', orderData);
      failed++;
    }
  } catch (e) {
    console.error('✖ Test 5 Exception:', e.message);
    failed++;
  }

  console.log(`\n=== RESULTS: ${passed} Passed, ${failed} Failed ===`);
  if (failed > 0) process.exit(1);
}

runTests();
