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

/**
 * Customer Management Functions
 */
export async function getAllCustomers() {
  const db = readDb();
  return (db.customers || []).map(c => {
    const { passwordHash, ...safe } = c;
    return safe;
  });
}

export async function getCustomerByEmail(email) {
  if (!email) return null;
  const db = readDb();
  const cleanEmail = email.toLowerCase().trim();
  return (db.customers || []).find(c => c.email && c.email.toLowerCase() === cleanEmail) || null;
}

export async function getCustomerById(id) {
  if (!id) return null;
  const db = readDb();
  return (db.customers || []).find(c => c.id === id) || null;
}

export async function createCustomer(customerData) {
  const db = readDb();
  const customers = db.customers || [];
  const cleanEmail = customerData.email.toLowerCase().trim();

  if (customers.some(c => c.email && c.email.toLowerCase() === cleanEmail)) {
    throw new Error('An account with this email address already exists.');
  }

  const timestamp = Date.now();
  const newCustomer = {
    id: `cust-${timestamp.toString().slice(-6)}`,
    fullName: customerData.fullName?.trim() || 'Valued Client',
    email: cleanEmail,
    phone: customerData.phone?.trim() || '',
    passwordHash: customerData.passwordHash || '',
    address: customerData.address || '',
    city: customerData.city || 'Nairobi',
    savedCart: customerData.savedCart || [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  customers.unshift(newCustomer);
  db.customers = customers;
  writeDb(db);

  const { passwordHash, ...safeCustomer } = newCustomer;
  return safeCustomer;
}

export async function updateCustomer(id, updates) {
  const db = readDb();
  const customers = db.customers || [];
  const index = customers.findIndex(c => c.id === id || (c.email && c.email.toLowerCase() === id.toLowerCase()));
  if (index === -1) {
    throw new Error(`Customer "${id}" not found.`);
  }

  customers[index] = {
    ...customers[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };

  db.customers = customers;
  writeDb(db);

  const { passwordHash, ...safeCustomer } = customers[index];
  return safeCustomer;
}

/**
 * Order Management Functions
 */
export async function getAllOrders() {
  const db = readDb();
  const orders = db.orders || [];
  return orders.map(ord => {
    const rawStatus = (ord.status || 'pending').toLowerCase();
    let status = 'pending';
    if (rawStatus.includes('deliver')) status = 'delivered';
    else if (rawStatus.includes('delay')) status = 'delayed';
    else status = 'pending';

    const rawPayment = (ord.payment_status || (ord.paymentVerified !== false ? 'paid' : 'unpaid')).toLowerCase();
    const payment_status = rawPayment === 'unpaid' ? 'unpaid' : 'paid';

    return {
      ...ord,
      status,
      payment_status,
      customer_name: ord.customer_name || ord.customerName || ord.shippingAddress?.fullName || 'Valued Client',
      customer_contact: ord.customer_contact || ord.customerContact || ord.customerEmail || ord.mpesaPhone || ord.shippingAddress?.phone || '',
      created_at: ord.created_at || ord.date || new Date().toISOString()
    };
  });
}

export async function getCustomerOrders(customerEmailOrId) {
  if (!customerEmailOrId) return [];
  const db = readDb();
  const clean = customerEmailOrId.toLowerCase().trim();
  return (db.orders || []).filter(o => 
    (o.customerEmail && o.customerEmail.toLowerCase() === clean) ||
    (o.customerId && o.customerId === customerEmailOrId) ||
    (o.customer_contact && o.customer_contact.toLowerCase().includes(clean)) ||
    (o.mpesaPhone && o.mpesaPhone.includes(clean))
  );
}

export async function createOrder(orderData) {
  const db = readDb();
  const orders = db.orders || [];

  const timestamp = Date.now();
  const orderId = orderData.id || `LN-ORD-${timestamp.toString().slice(-6)}`;

  // Format order items
  const items = Array.isArray(orderData.items) ? orderData.items.map(i => ({
    order_id: orderId,
    product_id: i.product_id || i.id || i.productId || '',
    name: i.name || 'Artisanal Piece',
    quantity: Number(i.quantity || 1),
    price_at_purchase: Number(i.price_at_purchase || i.priceKes || i.price || 0),
    image: i.image || '',
    color: i.color || null,
    size: i.size || null
  })) : [];

  const rawStatus = (orderData.status || 'pending').toLowerCase();
  const status = ['pending', 'delivered', 'delayed'].includes(rawStatus) ? rawStatus : 'pending';

  const rawPaymentStatus = (orderData.payment_status || orderData.paymentStatus || 'paid').toLowerCase();
  const payment_status = ['paid', 'unpaid'].includes(rawPaymentStatus) ? rawPaymentStatus : 'paid';

  const customer_name = orderData.customer_name || orderData.customerName || orderData.shippingAddress?.fullName || 'Valued Client';
  const customer_contact = orderData.customer_contact || orderData.customerContact || orderData.customerEmail || orderData.mpesaPhone || orderData.shippingAddress?.phone || '';

  const newOrder = {
    id: orderId,
    customer_name,
    customer_contact,
    status,
    payment_status,
    items,
    total: Number(orderData.total) || items.reduce((sum, item) => sum + (item.price_at_purchase * item.quantity), 0),
    created_at: new Date().toISOString(),
    // Backwards-compatible aliases
    date: new Date().toISOString(),
    customerName: customer_name,
    customerEmail: customer_contact.includes('@') ? customer_contact : '',
    mpesaPhone: !customer_contact.includes('@') ? customer_contact : (orderData.mpesaPhone || ''),
    paymentMethod: orderData.paymentMethod || 'M-Pesa / WhatsApp Concierge',
    delivery_address: orderData.delivery_address || orderData.shippingAddress?.address || 'Nairobi Delivery',
    shippingAddress: orderData.shippingAddress || {
      fullName: customer_name,
      phone: customer_contact,
      address: orderData.delivery_address || 'Nairobi Delivery',
      city: orderData.city || 'Nairobi'
    }
  };

  orders.unshift(newOrder);
  db.orders = orders;
  writeDb(db);

  return newOrder;
}

export async function updateOrderStatus(orderId, newStatus) {
  const db = readDb();
  const orders = db.orders || [];
  const index = orders.findIndex(o => o.id === orderId);
  if (index === -1) {
    throw new Error(`Order "${orderId}" not found.`);
  }

  const normalized = (newStatus || '').toLowerCase();
  let validStatus = 'pending';
  if (normalized.includes('deliver')) validStatus = 'delivered';
  else if (normalized.includes('delay')) validStatus = 'delayed';
  else validStatus = 'pending';

  orders[index] = {
    ...orders[index],
    status: validStatus,
    updated_at: new Date().toISOString()
  };

  db.orders = orders;
  writeDb(db);

  return orders[index];
}

export async function updateOrderPaymentStatus(orderId, newPaymentStatus) {
  const db = readDb();
  const orders = db.orders || [];
  const index = orders.findIndex(o => o.id === orderId);
  if (index === -1) {
    throw new Error(`Order "${orderId}" not found.`);
  }

  const normalized = (newPaymentStatus || '').toLowerCase();
  const validPaymentStatus = normalized === 'unpaid' ? 'unpaid' : 'paid';

  orders[index] = {
    ...orders[index],
    payment_status: validPaymentStatus,
    updated_at: new Date().toISOString()
  };

  db.orders = orders;
  writeDb(db);

  return orders[index];
}

