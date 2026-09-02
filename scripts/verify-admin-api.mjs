// Automated verification script for LUXE NIA Admin & Products API
const BASE_URL = 'http://localhost:5173';

async function runVerification() {
  console.log('--- STARTING LUXE NIA API VERIFICATION ---');

  // 1. Check Public Products API
  console.log('\n[1/5] Testing GET /api/products...');
  const prodRes = await fetch(`${BASE_URL}/api/products`);
  if (!prodRes.ok) throw new Error(`GET /api/products failed with status ${prodRes.status}`);
  const prodData = await prodRes.json();
  console.log(`✅ Success! Retrieved ${prodData.count} products from database.`);

  // 2. Test Admin Login API
  console.log('\n[2/5] Testing POST /api/auth/login...');
  const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@luxenia.com',
      password: 'luxenia2026!'
    })
  });
  if (!loginRes.ok) throw new Error(`Login failed with status ${loginRes.status}`);
  const loginData = await loginRes.json();
  if (!loginData.token) throw new Error('No JWT token returned from login.');
  console.log('✅ Success! Admin JWT authentication token obtained.');
  const token = loginData.token;

  // 3. Test Create Product (Admin API)
  console.log('\n[3/5] Testing POST /api/products (Add New Bag)...');
  const createRes = await fetch(`${BASE_URL}/api/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      name: 'The Royal Safari Tote — Emerald Edition',
      subtitle: 'Hand-dyed Calfskin with Antique Gold Trim',
      priceKes: 7200,
      stock: 8,
      status: 'active',
      material: 'Vegetable-Tanned Full Grain Leather',
      category: 'handbags',
      categoryName: 'Designer Bags',
      colors: [{ name: 'Emerald Noir', hex: '#0B3B24', borderHex: '#D4AF37' }]
    })
  });
  if (!createRes.ok) throw new Error(`Create product failed with status ${createRes.status}`);
  const createData = await createRes.json();
  const createdId = createData.product.id;
  console.log(`✅ Success! Created new product "${createData.product.name}" (ID: ${createdId}).`);

  // 4. Test Update Product (Admin API)
  console.log('\n[4/5] Testing PUT /api/products/item (Edit Price & Stock)...');
  const updateRes = await fetch(`${BASE_URL}/api/products/item?id=${encodeURIComponent(createdId)}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      priceKes: 7500,
      stock: 12
    })
  });
  if (!updateRes.ok) throw new Error(`Update product failed with status ${updateRes.status}`);
  const updateData = await updateRes.json();
  console.log(`✅ Success! Updated price to KES ${updateData.product.priceKes} and stock to ${updateData.product.stock}.`);

  // 5. Test Delete Product (Admin API)
  console.log('\n[5/5] Testing DELETE /api/products/item (Remove Bag)...');
  const deleteRes = await fetch(`${BASE_URL}/api/products/item?id=${encodeURIComponent(createdId)}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
  if (!deleteRes.ok) throw new Error(`Delete product failed with status ${deleteRes.status}`);
  console.log(`✅ Success! Removed test product (ID: ${createdId}).`);

  console.log('\n==========================================');
  console.log('🎉 ALL 5 ADMIN API & DATABASE CHECKS PASSED!');
  console.log('==========================================\n');
}

runVerification().catch(err => {
  console.error('❌ Verification Error:', err);
  process.exit(1);
});
