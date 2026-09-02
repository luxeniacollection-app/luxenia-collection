import fs from 'fs';
import path from 'path';
import os from 'os';

// Default authentic Sovereign Baguette bags embedded for infallible fallback
const DEFAULT_PRODUCTS = [
  {
    id: 'prod-001',
    name: 'The Sovereign Baguette Flap Bag — Noir Black',
    subtitle: 'Smooth Full-Grain Calfskin with Polished Gold-Tone Twist Clasp',
    category: 'handbags',
    categoryName: 'Designer Bags',
    priceKes: 5800,
    priceUsd: 45,
    sku: 'LN-HB-001',
    material: 'Supple Full-Grain Calf Leather',
    isNew: true,
    isFeatured: true,
    isLimitedEdition: false,
    stock: 12,
    status: 'active',
    rating: 5.0,
    reviewCount: 28,
    image: '/images/products/luxe-baguette-noir-black.jpg',
    gallery: [
      '/images/products/luxe-baguette-noir-black.jpg',
      '/images/products/luxe-baguette-sahara-brown.jpg',
      '/images/products/luxe-baguette-ivory-cream.jpg'
    ],
    shortDescription: 'The pinnacle of architectural leather artistry in timeless Noir Black.',
    description: 'The Sovereign Baguette Flap Bag in Noir Black is masterfully handcrafted in our Nairobi atelier from selected full-grain calf leather.',
    details: [
      'Handcrafted in Nairobi from full-grain calf leather',
      'Solid antique gold-tone luxury hardware',
      'Includes Luxe Nia dust bag and certificate of authenticity'
    ],
    sizes: ['Classic Baguette (28cm)'],
    colors: [
      { name: 'Noir Black', hex: '#0A0A0C', borderHex: '#D4AF37', image: '/images/products/luxe-baguette-noir-black.jpg' },
      { name: 'Sahara Mocha', hex: '#542E18', borderHex: '#D4AF37', image: '/images/products/luxe-baguette-sahara-brown.jpg' },
      { name: 'Ivory Pearl', hex: '#F0EBE1', borderHex: '#D4AF37', image: '/images/products/luxe-baguette-ivory-cream.jpg' }
    ],
    tags: ['Noir Black', 'Luxury Bag', 'Handcrafted', 'Atelier'],
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'prod-002',
    name: 'The Sovereign Baguette Flap Bag — Sahara Mocha',
    subtitle: 'Rich Chocolate Calfskin with Polished Gold-Tone Twist Clasp',
    category: 'handbags',
    categoryName: 'Designer Bags',
    priceKes: 5800,
    priceUsd: 45,
    sku: 'LN-HB-002',
    material: 'Supple Full-Grain Calf Leather',
    isNew: true,
    isFeatured: true,
    isLimitedEdition: false,
    stock: 9,
    status: 'active',
    rating: 4.9,
    reviewCount: 21,
    image: '/images/products/luxe-baguette-sahara-brown.jpg',
    gallery: [
      '/images/products/luxe-baguette-sahara-brown.jpg',
      '/images/products/luxe-baguette-noir-black.jpg',
      '/images/products/luxe-baguette-ivory-cream.jpg'
    ],
    shortDescription: 'Warm earth tone luxury crafted from supple mocha calfskin.',
    description: 'Finished in an opulent Sahara Mocha tone, this Sovereign Baguette celebrates African savannah elegance.',
    details: [
      'Handcrafted in Nairobi from full-grain calf leather',
      'Solid antique gold-tone luxury hardware',
      'Includes Luxe Nia dust bag and certificate of authenticity'
    ],
    sizes: ['Classic Baguette (28cm)'],
    colors: [
      { name: 'Sahara Mocha', hex: '#542E18', borderHex: '#D4AF37', image: '/images/products/luxe-baguette-sahara-brown.jpg' },
      { name: 'Noir Black', hex: '#0A0A0C', borderHex: '#D4AF37', image: '/images/products/luxe-baguette-noir-black.jpg' },
      { name: 'Ivory Pearl', hex: '#F0EBE1', borderHex: '#D4AF37', image: '/images/products/luxe-baguette-ivory-cream.jpg' }
    ],
    tags: ['Sahara Mocha', 'Luxury Bag', 'Handcrafted'],
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'prod-003',
    name: 'The Sovereign Baguette Flap Bag — Ivory Pearl',
    subtitle: 'Luminous Off-White Leather with Polished Gold-Tone Twist Clasp',
    category: 'handbags',
    categoryName: 'Designer Bags',
    priceKes: 5800,
    priceUsd: 45,
    sku: 'LN-HB-003',
    material: 'Supple Full-Grain Calf Leather',
    isNew: true,
    isFeatured: true,
    isLimitedEdition: false,
    stock: 8,
    status: 'active',
    rating: 5.0,
    reviewCount: 24,
    image: '/images/products/luxe-baguette-ivory-cream.jpg',
    gallery: [
      '/images/products/luxe-baguette-ivory-cream.jpg',
      '/images/products/luxe-baguette-noir-black.jpg',
      '/images/products/luxe-baguette-sahara-brown.jpg'
    ],
    shortDescription: 'Luminescent ivory leather with radiant gold accents.',
    description: 'The Sovereign Baguette in Ivory Pearl delivers luminous grace for evening galas and elite gatherings.',
    details: [
      'Handcrafted in Nairobi from full-grain calf leather',
      'Solid antique gold-tone luxury hardware',
      'Includes Luxe Nia dust bag and certificate of authenticity'
    ],
    sizes: ['Classic Baguette (28cm)'],
    colors: [
      { name: 'Ivory Pearl', hex: '#F0EBE1', borderHex: '#D4AF37', image: '/images/products/luxe-baguette-ivory-cream.jpg' },
      { name: 'Noir Black', hex: '#0A0A0C', borderHex: '#D4AF37', image: '/images/products/luxe-baguette-noir-black.jpg' },
      { name: 'Sahara Mocha', hex: '#542E18', borderHex: '#D4AF37', image: '/images/products/luxe-baguette-sahara-brown.jpg' }
    ],
    tags: ['Ivory Pearl', 'Luxury Bag', 'Handcrafted'],
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'prod-004',
    name: 'The Sovereign Grand Satchel — Espresso Mahogany',
    subtitle: 'Grained Calfskin Top-Handle Satchel with Dual Rolled Handles',
    category: 'handbags',
    categoryName: 'Designer Bags',
    priceKes: 6500,
    priceUsd: 50,
    sku: 'LN-HB-004',
    material: 'Grained Full-Grain Calf Leather',
    isNew: true,
    isFeatured: true,
    isLimitedEdition: false,
    stock: 10,
    status: 'active',
    rating: 5.0,
    reviewCount: 18,
    image: '/images/products/luxe-satchel-espresso-mahogany.jpg',
    gallery: [
      '/images/products/luxe-satchel-espresso-mahogany.jpg'
    ],
    shortDescription: 'Structured architectural elegance in deep Espresso Mahogany.',
    description: 'The Sovereign Grand Satchel in Espresso Mahogany is an ode to refined architectural luxury. Handcrafted from supple, full-grained leather with precision stitching and dual rolled handles.',
    details: [
      'Handcrafted in Nairobi from full-grain calf leather',
      'Solid antique gold-tone luxury hardware',
      'Includes Luxe Nia dust bag and certificate of authenticity'
    ],
    sizes: ['Grand Satchel (34cm)'],
    colors: [
      { name: 'Espresso Mahogany', hex: '#2A1810', borderHex: '#D4AF37', image: '/images/products/luxe-satchel-espresso-mahogany.jpg' }
    ],
    tags: ['Satchel', 'Espresso Mahogany', 'Top Handle', 'New Drop', 'Grand Bag'],
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'prod-005',
    name: 'The Sovereign Carryall Tote — Glazed Obsidian',
    subtitle: 'Glazed Oil-Wax Calfskin Shopper Tote with Dual Flat Shoulder Straps',
    category: 'handbags',
    categoryName: 'Designer Bags',
    priceKes: 6800,
    priceUsd: 52,
    sku: 'LN-HB-005',
    material: 'Glazed Oil-Wax Pull-Up Calf Leather',
    isNew: true,
    isFeatured: true,
    isLimitedEdition: false,
    stock: 10,
    status: 'active',
    rating: 5.0,
    reviewCount: 15,
    image: '/images/products/luxe-shopper-glazed-noir.jpg',
    gallery: [
      '/images/products/luxe-shopper-glazed-noir.jpg'
    ],
    shortDescription: 'Spacious everyday luxury shopper in glazed obsidian oil-wax leather.',
    description: 'The Sovereign Carryall Tote in Glazed Obsidian combines generous capacity with commanding sophistication. Crafted from lustrous oil-wax calf leather.',
    details: [
      'Handcrafted in Nairobi from full-grain calf leather',
      'Solid antique gold-tone luxury hardware',
      'Includes Luxe Nia dust bag and certificate of authenticity'
    ],
    sizes: ['Grand Shopper (38cm)'],
    colors: [
      { name: 'Glazed Obsidian', hex: '#1C1A20', borderHex: '#D4AF37', image: '/images/products/luxe-shopper-glazed-noir.jpg' }
    ],
    tags: ['Tote Bag', 'Shopper', 'Glazed Leather', 'Obsidian', 'Carryall', 'New Drop'],
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z'
  }
];

// Determine writable DB path (uses /tmp on Vercel/serverless)
const isServerless = !!process.env.VERCEL || !!process.env.AWS_LAMBDA_FUNCTION_NAME;
const DB_FILE_PATH = isServerless 
  ? path.join(os.tmpdir(), 'luxenia_database.json')
  : path.resolve('data/luxenia_database.json');

// In-memory memory fallback
let memoryDb = {
  products: DEFAULT_PRODUCTS,
  categories: [
    { id: 'all', name: 'All Handbags' },
    { id: 'handbags', name: 'Luxury Handbags' }
  ],
  version: '1.0.0',
  lastUpdated: new Date().toISOString()
};

function ensureDbFile() {
  try {
    const dir = path.dirname(DB_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    if (!fs.existsSync(DB_FILE_PATH)) {
      fs.writeFileSync(DB_FILE_PATH, JSON.stringify(memoryDb, null, 2), 'utf-8');
    }
  } catch (err) {
    // Non-blocking in serverless/read-only environments
  }
}

function readDb() {
  ensureDbFile();
  try {
    if (fs.existsSync(DB_FILE_PATH)) {
      const raw = fs.readFileSync(DB_FILE_PATH, 'utf-8');
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.products) && parsed.products.length > 0) {
        memoryDb = parsed;
        return parsed;
      }
    }
  } catch (err) {
    // Use memoryDb
  }
  return memoryDb;
}

function writeDb(data) {
  memoryDb = data;
  try {
    ensureDbFile();
    data.lastUpdated = new Date().toISOString();
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    // Keep in-memory copy
  }
}

/**
 * Get all active products (or all for admin)
 */
export async function getAllProducts({ includeInactive = false, category = null } = {}) {
  const db = readDb();
  let products = db.products || DEFAULT_PRODUCTS;

  if (!includeInactive) {
    products = products.filter(p => p.status !== 'draft' && p.status !== 'archived');
  }

  if (category && category !== 'all') {
    products = products.filter(p => p.category === category);
  }

  return products;
}

/**
 * Get product by ID or SKU
 */
export async function getProductById(id) {
  const db = readDb();
  return (db.products || DEFAULT_PRODUCTS).find(p => p.id === id || p.sku === id) || null;
}

/**
 * Create a new product (Admin)
 */
export async function createProduct(productData) {
  const db = readDb();
  const products = db.products || [...DEFAULT_PRODUCTS];

  const timestamp = Date.now();
  const customId = productData.id || `prod-${timestamp.toString().slice(-6)}`;
  const priceKes = Number(productData.priceKes) || 5800;
  const priceUsd = Number(productData.priceUsd) || Math.round(priceKes / 130);

  const newProduct = {
    id: customId,
    name: productData.name?.trim() || 'Luxe Nia Handbag',
    subtitle: productData.subtitle?.trim() || 'Haute Maroquinerie',
    category: productData.category || 'handbags',
    categoryName: productData.categoryName || 'Designer Bags',
    priceKes,
    priceUsd,
    sku: productData.sku?.trim() || `LN-HB-${timestamp.toString().slice(-4)}`,
    material: productData.material?.trim() || 'Supple Full-Grain Calf Leather',
    isNew: productData.isNew ?? true,
    isFeatured: productData.isFeatured ?? true,
    isLimitedEdition: productData.isLimitedEdition ?? false,
    stock: Number(productData.stock) >= 0 ? Number(productData.stock) : 10,
    status: productData.status || 'active',
    rating: Number(productData.rating) || 5.0,
    reviewCount: Number(productData.reviewCount) || 12,
    image: productData.image || '/images/products/luxe-baguette-noir-black.jpg',
    gallery: Array.isArray(productData.gallery) && productData.gallery.length > 0
      ? productData.gallery
      : [productData.image || '/images/products/luxe-baguette-noir-black.jpg'],
    shortDescription: productData.shortDescription?.trim() || productData.description?.slice(0, 120) || 'Artisanal luxury leather piece.',
    description: productData.description?.trim() || 'Handcrafted luxury leather handbag from the Luxe Nia Nairobi atelier.',
    details: Array.isArray(productData.details) && productData.details.length > 0 
      ? productData.details 
      : [
          'Handcrafted in Nairobi from full-grain calf leather',
          'Solid antique gold-tone luxury hardware',
          'Includes Luxe Nia dust bag and certificate of authenticity'
        ],
    sizes: Array.isArray(productData.sizes) && productData.sizes.length > 0
      ? productData.sizes
      : ['Classic Baguette (28cm)'],
    colors: Array.isArray(productData.colors) && productData.colors.length > 0
      ? productData.colors
      : [{ name: 'Noir Black', hex: '#0A0A0C', borderHex: '#D4AF37', image: productData.image || '/images/products/luxe-baguette-noir-black.jpg' }],
    tags: Array.isArray(productData.tags) ? productData.tags : ['Luxury Bag', 'Handcrafted', 'Atelier'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  products.unshift(newProduct);
  db.products = products;
  writeDb(db);

  return newProduct;
}

/**
 * Update an existing product (Admin)
 */
export async function updateProduct(id, updates) {
  const db = readDb();
  const index = (db.products || []).findIndex(p => p.id === id);

  if (index === -1) {
    throw new Error(`Product with ID "${id}" not found.`);
  }

  const existing = db.products[index];
  
  if (updates.priceKes !== undefined) {
    updates.priceKes = Number(updates.priceKes);
    if (!updates.priceUsd) {
      updates.priceUsd = Math.round(updates.priceKes / 130);
    }
  }

  if (updates.stock !== undefined) {
    updates.stock = Number(updates.stock);
    if (updates.stock <= 0 && (!updates.status || updates.status === 'active')) {
      updates.status = 'out_of_stock';
    }
  }

  const updatedProduct = {
    ...existing,
    ...updates,
    updatedAt: new Date().toISOString()
  };

  db.products[index] = updatedProduct;
  writeDb(db);

  return updatedProduct;
}

/**
 * Delete a product (Admin)
 */
export async function deleteProduct(id) {
  const db = readDb();
  const initialLength = (db.products || []).length;
  db.products = (db.products || []).filter(p => p.id !== id);

  if (db.products.length === initialLength) {
    throw new Error(`Product with ID "${id}" not found.`);
  }

  writeDb(db);
  return { success: true, deletedId: id };
}

/**
 * Reduce stock for purchased items in an order
 * @param {Array<{id: string, quantity: number}>} orderItems
 */
export async function reduceProductStock(orderItems = []) {
  const db = readDb();
  const products = db.products || [];
  const updatedProducts = [];

  for (const item of orderItems) {
    const itemId = item.id || item.productId;
    const index = products.findIndex(p => p.id === itemId || p.sku === itemId);
    if (index !== -1) {
      const currentStock = Number(products[index].stock) >= 0 ? Number(products[index].stock) : 10;
      const qty = Math.max(1, Number(item.quantity) || 1);
      const newStock = Math.max(0, currentStock - qty);

      products[index] = {
        ...products[index],
        stock: newStock,
        status: newStock === 0 ? 'out_of_stock' : products[index].status,
        updatedAt: new Date().toISOString()
      };
      updatedProducts.push(products[index]);
    }
  }

  db.products = products;
  writeDb(db);

  return {
    success: true,
    updatedCount: updatedProducts.length,
    updatedProducts,
    products
  };
}
