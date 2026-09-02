import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5173';

async function testAdminSuite() {
  console.log('=== LUXE NIA ADMIN & DATABASE SUITE VERIFICATION ===\n');

  // 1. Test Admin Login API
  console.log('1. Testing Admin Authentication (/api/auth/login)...');
  const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@luxenia.com',
      password: 'luxenia2026!'
    })
  });

  const loginData = await loginRes.json();
  if (!loginRes.ok || !loginData.success || !loginData.token) {
    console.error('❌ Admin login failed:', loginData);
    process.exit(1);
  }
  console.log('✅ Admin login succeeded! JWT token issued.');
  const token = loginData.token;

  // 2. Test Fetch Products
  console.log('\n2. Testing Product Catalog Retrieval (/api/products)...');
  const productsRes = await fetch(`${BASE_URL}/api/products`);
  const productsData = await productsRes.json();
  if (!productsRes.ok || !productsData.success) {
    console.error('❌ Product retrieval failed:', productsData);
    process.exit(1);
  }
  console.log(`✅ Retrieved ${productsData.count} products from persistent database.`);

  // 3. Test Automatic Stock Reduction API
  console.log('\n3. Testing Automatic Stock Reduction on Order (/api/products/order)...');
  const firstProduct = productsData.products[0];
  const initialStock = firstProduct.stock;
  console.log(`- Product: ${firstProduct.name} (Current Stock: ${initialStock})`);

  const orderRes = await fetch(`${BASE_URL}/api/products/order`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      items: [{ id: firstProduct.id, quantity: 1 }]
    })
  });
  const orderData = await orderRes.json();
  if (!orderRes.ok || !orderData.success) {
    console.error('❌ Stock reduction failed:', orderData);
    process.exit(1);
  }
  const updatedFirstProd = orderData.products.find(p => p.id === firstProduct.id);
  console.log(`✅ Stock reduced! New Stock: ${updatedFirstProd.stock} (was ${initialStock})`);

  // Restore stock back
  await fetch(`${BASE_URL}/api/products/item?id=${encodeURIComponent(firstProduct.id)}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ id: firstProduct.id, stock: initialStock, status: 'active' })
  });
  console.log(`- Restored stock back to ${initialStock} for testing continuity.`);

  // 4. Test Adding a New Bag (Admin)
  console.log('\n4. Testing Adding a New Luxury Bag (/api/products)...');
  const newBagData = {
    name: 'The Sovereign Petite Baguette — Emerald Noir',
    subtitle: 'Ultra-Smooth Calfskin with Polished Gold-Tone Twist Clasp',
    category: 'designer-bags',
    categoryName: 'Designer Bags',
    priceKes: 5800,
    priceUsd: 45,
    stock: 10,
    status: 'active',
    material: 'Supple Full-Grain Calf Leather',
    description: 'A bespoke limited-edition silhouette handcrafted in Nairobi.',
    image: '/images/products/luxe-baguette-noir-black.jpg'
  };

  const createRes = await fetch(`${BASE_URL}/api/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(newBagData)
  });
  const createData = await createRes.json();
  if (!createRes.ok || !createData.success) {
    console.error('❌ Creating new bag failed:', createData);
    process.exit(1);
  }
  const createdBagId = createData.product.id;
  console.log(`✅ New Bag created successfully: "${createData.product.name}" (ID: ${createdBagId})`);

  // 5. Test Editing the Bag (Admin)
  console.log('\n5. Testing Editing Bag Details & Stock (/api/products/item)...');
  const updateRes = await fetch(`${BASE_URL}/api/products/item?id=${encodeURIComponent(createdBagId)}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      id: createdBagId,
      stock: 15,
      priceKes: 6200
    })
  });
  const updateData = await updateRes.json();
  if (!updateRes.ok || !updateData.success) {
    console.error('❌ Updating bag failed:', updateData);
    process.exit(1);
  }
  console.log(`✅ Bag updated successfully! New Stock: ${updateData.product.stock}, New Price: KSh ${updateData.product.priceKes}`);

  // 6. Test Deleting the Test Bag (Admin)
  console.log('\n6. Testing Deleting Bag from Catalog (/api/products/item)...');
  const deleteRes = await fetch(`${BASE_URL}/api/products/item?id=${encodeURIComponent(createdBagId)}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ id: createdBagId })
  });
  const deleteData = await deleteRes.json();
  if (!deleteRes.ok || !deleteData.success) {
    console.error('❌ Deleting bag failed:', deleteData);
    process.exit(1);
  }
  console.log(`✅ Bag deleted successfully! ID: ${deleteData.deletedId}`);

  console.log('\n🌟 ALL ADMIN, STOCK, AUTHENTICATION & DATABASE TESTS PASSED 100% OPERATIONAL!\n');
}

testAdminSuite().catch(err => {
  console.error('Test Suite Error:', err);
  process.exit(1);
});
