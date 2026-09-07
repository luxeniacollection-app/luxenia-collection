async function testUnifiedDestinations() {
  const baseUrl = 'http://localhost:5173';
  let passed = 0;
  let failed = 0;

  console.log('=== TEST UNIFIED LOGIN & DESTINATION ROUTING ===\n');

  // Test 1: Admin Credentials -> Destination: /admin/dashboard
  try {
    const adminEmail = 'admin@luxenia.com';
    const adminPass = 'luxenia2026!';
    
    // Simulate what the Unified Login does
    let destination = null;
    let authRole = null;

    if (adminEmail === 'admin@luxenia.com') {
      const res = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: adminEmail, password: adminPass })
      });
      const data = await res.json();
      if (res.ok && data.success && data.admin?.role === 'admin') {
        authRole = data.admin.role;
        destination = '/admin/dashboard';
      }
    }

    if (destination === '/admin/dashboard' && authRole === 'admin') {
      console.log('✔ Test 1 Passed: Admin credentials correctly route to destination: /admin/dashboard');
      passed++;
    } else {
      console.error('✖ Test 1 Failed: Admin credentials did not route to /admin/dashboard');
      failed++;
    }
  } catch (e) {
    console.error('✖ Test 1 Exception:', e.message);
    failed++;
  }

  // Test 2: Customer Credentials -> Destination: /account
  try {
    const customerEmail = `client.${Date.now()}@example.com`;
    const customerPass = 'securePassword123';

    // Register first
    await fetch(`${baseUrl}/api/customer/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: 'Client VIP',
        email: customerEmail,
        phone: '0700000000',
        password: customerPass
      })
    });

    // Now test Unified Login with customer email
    let destination = null;
    let authRole = null;

    if (customerEmail === 'admin@luxenia.com') {
      destination = '/admin/dashboard';
    } else {
      const custRes = await fetch(`${baseUrl}/api/customer/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: customerEmail, password: customerPass })
      });
      const custData = await custRes.json();
      if (custRes.ok && custData.success && custData.customer) {
        authRole = 'customer';
        destination = '/account';
      }
    }

    if (destination === '/account' && authRole === 'customer') {
      console.log('✔ Test 2 Passed: Customer credentials correctly route to destination: /account');
      passed++;
    } else {
      console.error('✖ Test 2 Failed: Customer credentials did not route to /account');
      failed++;
    }
  } catch (e) {
    console.error('✖ Test 2 Exception:', e.message);
    failed++;
  }

  console.log(`\n=== RESULTS: ${passed} Passed, ${failed} Failed ===`);
  if (failed > 0) process.exit(1);
}

testUnifiedDestinations();
