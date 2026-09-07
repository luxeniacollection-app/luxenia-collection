async function testCeoSuite() {
  const baseUrl = 'http://localhost:5173';
  let passed = 0;
  let failed = 0;

  console.log('=== LUXE NIA CEO / ADMIN SYSTEM VERIFICATION ===\n');

  // Test 1: CEO Login with admin@luxenia.com
  try {
    const res = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@luxenia.com', password: 'luxenia2026!' })
    });
    const data = await res.json();
    if (res.ok && data.success && data.token && data.admin) {
      console.log('✔ Test 1 Passed: CEO login (admin@luxenia.com) succeeded. Role:', data.admin.role, 'Name:', data.admin.name);
      passed++;
    } else {
      console.error('✖ Test 1 Failed:', data);
      failed++;
    }
  } catch (e) {
    console.error('✖ Test 1 Exception:', e.message);
    failed++;
  }

  // Test 2: CEO Login with ceo@luxenia.com
  try {
    const res = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'ceo@luxenia.com', password: 'luxenia2026!' })
    });
    const data = await res.json();
    if (res.ok && data.success && data.token && data.admin) {
      console.log('✔ Test 2 Passed: CEO login (ceo@luxenia.com) succeeded. Role:', data.admin.role);
      passed++;
    } else {
      console.error('✖ Test 2 Failed:', data);
      failed++;
    }
  } catch (e) {
    console.error('✖ Test 2 Exception:', e.message);
    failed++;
  }

  // Test 3: Unauthenticated / Wrong password rejection
  try {
    const res = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@luxenia.com', password: 'wrongpassword' })
    });
    const data = await res.json();
    if (res.status === 401 && !data.success) {
      console.log('✔ Test 3 Passed: Invalid CEO password correctly rejected');
      passed++;
    } else {
      console.error('✖ Test 3 Failed:', data);
      failed++;
    }
  } catch (e) {
    console.error('✖ Test 3 Exception:', e.message);
    failed++;
  }

  // Test 4: Verify Product API & Stock
  try {
    const res = await fetch(`${baseUrl}/api/products`);
    const data = await res.json();
    if (res.ok && Array.isArray(data.products) && data.products.length > 0) {
      console.log(`✔ Test 4 Passed: Handbag catalog active (${data.products.length} bags loaded)`);
      passed++;
    } else {
      console.error('✖ Test 4 Failed:', data);
      failed++;
    }
  } catch (e) {
    console.error('✖ Test 4 Exception:', e.message);
    failed++;
  }

  console.log(`\n=== RESULTS: ${passed} Passed, ${failed} Failed ===`);
  if (failed > 0) process.exit(1);
}

testCeoSuite();
