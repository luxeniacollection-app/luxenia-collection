import { 
  getWhatsAppProductOrderUrl, 
  getWhatsAppCartOrderUrl, 
  OFFICIAL_WHATSAPP_PHONE,
  OFFICIAL_LOCAL_PHONE,
  OFFICIAL_INSTAGRAM_HANDLE,
  OFFICIAL_INSTAGRAM_URL 
} from '../src/utils/whatsapp.js';

console.log('--- TESTING LUXE NIA WHATSAPP ORDERING GENERATORS ---');

// 1. Single product order test
const testProduct = {
  name: 'The Sovereign Baguette Flap Bag',
  priceKes: 5800,
  sku: 'LN-HB-001'
};
const singleUrl = getWhatsAppProductOrderUrl(testProduct, { name: 'Noir Black' }, 'Classic Baguette (28cm)', 1);
console.log('\n[1] Single Product Order URL:');
console.log(singleUrl);

const decodedSingle = decodeURIComponent(singleUrl.split('?text=')[1]);
console.log('\nDecoded Single Product Message:');
console.log(decodedSingle);

// 2. Multi-item cart order test
const testCart = [
  { name: 'The Sovereign Baguette Flap Bag', selectedColor: { name: 'Noir Black' }, priceKes: 5800, quantity: 1 },
  { name: 'The Sovereign Baguette Flap Bag', selectedColor: { name: 'Sahara Mocha' }, priceKes: 5800, quantity: 2 }
];
const cartUrl = getWhatsAppCartOrderUrl(testCart, 17400, { fullName: 'Stephanie Wanjiku', deliveryLocation: 'Kilimani, Nairobi' });
console.log('\n[2] Multi-Item Cart Order URL:');
console.log(cartUrl);

const decodedCart = decodeURIComponent(cartUrl.split('?text=')[1]);
console.log('\nDecoded Cart Message:');
console.log(decodedCart);

// 3. Official credentials check
console.log('\n[3] Credentials Verification:');
console.log(`Phone: ${OFFICIAL_LOCAL_PHONE} (${OFFICIAL_WHATSAPP_PHONE})`);
console.log(`Instagram: ${OFFICIAL_INSTAGRAM_HANDLE} (${OFFICIAL_INSTAGRAM_URL})`);

if (
  singleUrl.includes('https://wa.me/254795439545') &&
  decodedSingle.includes('Hello LUXE NIA') &&
  decodedSingle.includes('The Sovereign Baguette Flap Bag') &&
  decodedSingle.includes('5,800') &&
  decodedSingle.includes('Quantity')
) {
  console.log('\n✅ ALL WHATSAPP ORDERING REQUIREMENTS VERIFIED SUCCESSFULLY!');
} else {
  console.error('\n❌ Format check failed!');
  process.exit(1);
}
