// Luxe Nia Collections - Authentic Luxury Handbag Catalog
// Featuring authentic photography of The Sovereign Baguette, Grand Satchel, and Carryall Tote series

export const categories = [
  { id: 'all', name: 'All Handbags' },
  { id: 'handbags', name: 'Luxury Handbags' }
];

export const initialProducts = [
  {
    id: 'prod-001',
    name: 'The Sovereign Baguette Flap Bag — Noir Black',
    subtitle: 'Smooth Calfskin with Polished Gold-Tone Twist Clasp',
    category: 'handbags',
    categoryName: 'Designer Bags',
    priceKes: 5800,
    priceUsd: 45,
    sku: 'LN-HB-001',
    isNew: true,
    isFeatured: true,
    isLimitedEdition: false,
    stock: 12,
    status: 'active',
    material: 'Supple Full-Grain Calf Leather',
    rating: 5.0,
    reviewCount: 28,
    image: '/images/products/luxe-baguette-noir-black.jpg',
    gallery: [
      '/images/products/luxe-baguette-noir-black.jpg',
      '/images/products/luxe-baguette-sahara-brown.jpg',
      '/images/products/luxe-baguette-ivory-cream.jpg'
    ],
    shortDescription: 'An iconic east-west baguette in ultra-smooth noir black leather featuring refined structural lines and an antique gold-tone latch closure.',
    description: 'The Sovereign Baguette in Noir Black captures the quintessence of modern African luxury. Handcrafted from smooth, full-grain leather with immaculate edge finishing, this versatile statement piece features a structured rectangular silhouette, gleaming gold-tone closure, and an adjustable shoulder strap for effortless day-to-evening transitions.',
    details: [
      'Premium smooth full-grain calf leather',
      'Solid antique gold-tone latch lock mechanism',
      'Structured east-west baguette profile with piped base seams',
      'Dimensions: 28cm W x 13cm H x 8cm D',
      'Detachable and adjustable leather shoulder strap (48cm drop)',
      'Satin-touch lining with interior zippered slip compartment',
      'Includes signature Luxe Nia branded gold-foil dust bag and authenticity card'
    ],
    sizes: ['Classic Baguette (28cm)'],
    colors: [
      { name: 'Noir Black', hex: '#0A0A0C', borderHex: '#D4AF37', image: '/images/products/luxe-baguette-noir-black.jpg' },
      { name: 'Sahara Mocha', hex: '#542E18', borderHex: '#D4AF37', image: '/images/products/luxe-baguette-sahara-brown.jpg' },
      { name: 'Ivory Pearl', hex: '#F0EBE1', borderHex: '#D4AF37', image: '/images/products/luxe-baguette-ivory-cream.jpg' }
    ],
    tags: ['Baguette Bag', 'Noir Black', 'Gold Hardware', 'Best Seller', 'Everyday Luxury']
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
    isNew: true,
    isFeatured: true,
    isLimitedEdition: false,
    stock: 9,
    status: 'active',
    material: 'Supple Full-Grain Calf Leather',
    rating: 4.9,
    reviewCount: 21,
    image: '/images/products/luxe-baguette-sahara-brown.jpg',
    gallery: [
      '/images/products/luxe-baguette-sahara-brown.jpg',
      '/images/products/luxe-baguette-noir-black.jpg',
      '/images/products/luxe-baguette-ivory-cream.jpg'
    ],
    shortDescription: 'Warm earthy opulence in deep chocolate mocha calf leather, accented with radiant gold hardware and structured architectural lines.',
    description: 'Rich, grounded, and deeply sophisticated, The Sovereign Baguette in Sahara Mocha Brown embodies warmth and poise. Designed for discerning tastemakers, the deep chocolate tone pairs exquisitely with tailored neutral suits and evening silk wear.',
    details: [
      'Supple chocolate brown smooth calf leather',
      'Solid antique gold-tone latch lock mechanism',
      'Structured east-west baguette profile with reinforced corners',
      'Dimensions: 28cm W x 13cm H x 8cm D',
      'Detachable and adjustable leather shoulder strap (48cm drop)',
      'Satin-touch interior vault with dedicated card slip and zip pocket',
      'Includes signature Luxe Nia branded gold-foil dust bag and authenticity card'
    ],
    sizes: ['Classic Baguette (28cm)'],
    colors: [
      { name: 'Sahara Mocha', hex: '#542E18', borderHex: '#D4AF37', image: '/images/products/luxe-baguette-sahara-brown.jpg' },
      { name: 'Noir Black', hex: '#0A0A0C', borderHex: '#D4AF37', image: '/images/products/luxe-baguette-noir-black.jpg' },
      { name: 'Ivory Pearl', hex: '#F0EBE1', borderHex: '#D4AF37', image: '/images/products/luxe-baguette-ivory-cream.jpg' }
    ],
    tags: ['Baguette Bag', 'Sahara Mocha', 'Brown Leather', 'Gold Hardware', 'Trending']
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
    isNew: true,
    isFeatured: true,
    isLimitedEdition: false,
    stock: 8,
    status: 'active',
    material: 'Supple Full-Grain Calf Leather',
    rating: 5.0,
    reviewCount: 24,
    image: '/images/products/luxe-baguette-ivory-cream.jpg',
    gallery: [
      '/images/products/luxe-baguette-ivory-cream.jpg',
      '/images/products/luxe-baguette-noir-black.jpg',
      '/images/products/luxe-baguette-sahara-brown.jpg'
    ],
    shortDescription: 'Luminous off-white leather framed with contrast hand-burnished edge lacquer and a signature gold-tone latch.',
    description: 'Radiant and pure, The Sovereign Baguette in Ivory Pearl brings an ethereal touch of glamour to any occasion. Featuring dark contrast edge dressing that defines its architectural contours, paired with glowing gold-tone hardware.',
    details: [
      'Luminous smooth ivory pearl calf leather',
      'Hand-burnished contrast dark edge painting',
      'Solid antique gold-tone latch lock mechanism',
      'Dimensions: 28cm W x 13cm H x 8cm D',
      'Detachable and adjustable leather shoulder strap (48cm drop)',
      'Satin-touch interior with gold monogram embossing',
      'Includes signature Luxe Nia branded gold-foil dust bag and authenticity card'
    ],
    sizes: ['Classic Baguette (28cm)'],
    colors: [
      { name: 'Ivory Pearl', hex: '#F0EBE1', borderHex: '#D4AF37', image: '/images/products/luxe-baguette-ivory-cream.jpg' },
      { name: 'Noir Black', hex: '#0A0A0C', borderHex: '#D4AF37', image: '/images/products/luxe-baguette-noir-black.jpg' },
      { name: 'Sahara Mocha', hex: '#542E18', borderHex: '#D4AF37', image: '/images/products/luxe-baguette-sahara-brown.jpg' }
    ],
    tags: ['Baguette Bag', 'Ivory Pearl', 'White Bag', 'Gold Hardware', 'Editorial']
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
    isNew: true,
    isFeatured: true,
    isLimitedEdition: false,
    stock: 10,
    status: 'active',
    material: 'Grained Full-Grain Calf Leather',
    rating: 5.0,
    reviewCount: 18,
    image: '/images/products/luxe-satchel-espresso-mahogany.jpg',
    gallery: [
      '/images/products/luxe-satchel-espresso-mahogany.jpg'
    ],
    shortDescription: 'A structured grand top-handle satchel in rich espresso mahogany leather, designed with dual rolled handles and spacious lined interior.',
    description: 'The Sovereign Grand Satchel in Espresso Mahogany is an ode to refined architectural luxury. Handcrafted from supple, full-grained leather with precision stitching and dual rolled handles, this spacious daily companion seamlessly accommodates everyday essentials while radiating distinguished elegance.',
    details: [
      'Premium grained full-grain calf leather',
      'Dual reinforced rolled top handles with wrapped protective wrap',
      'Smooth top zip closure with custom leather puller and hangtag',
      'Spacious lined main compartment with interior organization pockets',
      'Dimensions: 34cm W x 24cm H x 14cm D',
      'Detachable and adjustable leather shoulder strap',
      'Includes signature Luxe Nia branded gold-foil dust bag and authenticity card'
    ],
    sizes: ['Grand Satchel (34cm)'],
    colors: [
      { name: 'Espresso Mahogany', hex: '#2A1810', borderHex: '#D4AF37', image: '/images/products/luxe-satchel-espresso-mahogany.jpg' }
    ],
    tags: ['Satchel', 'Espresso Mahogany', 'Top Handle', 'New Drop', 'Grand Bag']
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
    isNew: true,
    isFeatured: true,
    isLimitedEdition: false,
    stock: 10,
    status: 'active',
    material: 'Glazed Oil-Wax Pull-Up Calf Leather',
    rating: 5.0,
    reviewCount: 15,
    image: '/images/products/luxe-shopper-glazed-noir.jpg',
    gallery: [
      '/images/products/luxe-shopper-glazed-noir.jpg'
    ],
    shortDescription: 'A grand structured shopper tote in glazed oil-wax calfskin leather, designed with comfortable shoulder straps, center seam detailing, and a capacious lined interior.',
    description: 'The Sovereign Carryall Tote in Glazed Obsidian combines generous capacity with commanding sophistication. Crafted from lustrous oil-wax calf leather that develops a magnificent personal patina over time, this versatile daily tote features long reinforced shoulder handles and an expansive main vault for everyday luxury.',
    details: [
      'Premium glazed oil-wax pull-up calf leather',
      'Reinforced dual flat shoulder straps with wrapped protection',
      'Architectural flared tote profile with center panel seam stitching',
      'Secure top zip closure with custom leather puller and hangtag',
      'Spacious interior vault with dedicated phone and laptop/document slip',
      'Dimensions: 38cm W (top) x 28cm H x 14cm D',
      'Includes signature Luxe Nia branded gold-foil dust bag and authenticity card'
    ],
    sizes: ['Grand Shopper (38cm)'],
    colors: [
      { name: 'Glazed Obsidian', hex: '#1C1A20', borderHex: '#D4AF37', image: '/images/products/luxe-shopper-glazed-noir.jpg' }
    ],
    tags: ['Tote Bag', 'Shopper', 'Glazed Leather', 'Obsidian', 'Carryall', 'New Drop']
  }
];
