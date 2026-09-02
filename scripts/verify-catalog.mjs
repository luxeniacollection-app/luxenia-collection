import fs from 'fs';
import path from 'path';
import { initialProducts } from '../src/data/products.js';

console.log('=== LUXE NIA CATALOG & ASSETS VERIFICATION ===\n');

let hasErrors = false;

console.log(`Total Products in Catalog: ${initialProducts.length}`);

if (initialProducts.length !== 5) {
  console.error(`❌ Expected 5 authentic products, found ${initialProducts.length}`);
  hasErrors = true;
} else {
  console.log('✅ Exactly 5 authentic products found.');
}

const expectedProducts = [
  { id: 'prod-001', name: 'The Sovereign Baguette Flap Bag — Noir Black', priceKes: 5800, image: 'luxe-baguette-noir-black.jpg' },
  { id: 'prod-002', name: 'The Sovereign Baguette Flap Bag — Sahara Mocha', priceKes: 5800, image: 'luxe-baguette-sahara-brown.jpg' },
  { id: 'prod-003', name: 'The Sovereign Baguette Flap Bag — Ivory Pearl', priceKes: 5800, image: 'luxe-baguette-ivory-cream.jpg' },
  { id: 'prod-004', name: 'The Sovereign Grand Satchel — Espresso Mahogany', priceKes: 6500, image: 'luxe-satchel-espresso-mahogany.jpg' },
  { id: 'prod-005', name: 'The Sovereign Carryall Tote — Glazed Obsidian', priceKes: 6800, image: 'luxe-shopper-glazed-noir.jpg' }
];

expectedProducts.forEach((expected, index) => {
  const p = initialProducts.find(item => item.id === expected.id);
  if (!p) {
    console.error(`❌ Missing product ${expected.id}: ${expected.name}`);
    hasErrors = true;
    return;
  }

  console.log(`\n[Product ${index + 1}] ${p.name}`);
  console.log(`  - ID: ${p.id} | SKU: ${p.sku}`);
  console.log(`  - Price: KSh ${p.priceKes.toLocaleString()} (USD $${p.priceUsd})`);
  console.log(`  - Stock: ${p.stock} | Status: ${p.status}`);
  console.log(`  - Colors: ${p.colors?.map(c => c.name).join(', ')}`);
  console.log(`  - Details Count: ${p.details?.length || 0}`);

  if (p.priceKes !== expected.priceKes) {
    console.error(`  ❌ Price mismatch: expected KSh ${expected.priceKes}, got KSh ${p.priceKes}`);
    hasErrors = true;
  } else {
    console.log(`  ✅ Price verified: KSh ${p.priceKes.toLocaleString()}`);
  }

  // Check image file on disk
  const imagePath = path.resolve('public', p.image.replace(/^\//, ''));
  if (fs.existsSync(imagePath)) {
    const stats = fs.statSync(imagePath);
    console.log(`  ✅ Image verified: ${p.image} (${(stats.size / 1024).toFixed(1)} KB)`);
  } else {
    console.error(`  ❌ Missing image on disk: ${imagePath}`);
    hasErrors = true;
  }
});

if (hasErrors) {
  console.error('\n❌ Catalog verification failed with errors.');
  process.exit(1);
} else {
  console.log('\n🌟 ALL 5 LUXE NIA HANDBAGS AND ASSETS VERIFIED 100% OPERATIONAL!');
}
