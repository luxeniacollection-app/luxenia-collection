// Luxe Nia Collections - Brand Data, Testimonials, Milestones, and Initial Orders

export const brandInfo = {
  name: 'Luxe Nia Collections',
  tagline: 'Timeless Opulence & Contemporary African Luxury',
  location: 'Web-based Online Nairobi',
  atelierAddress: 'Web-based online Nairobi and delivery is done country wide',
  phone: '+254 795 439 545',
  whatsappPhone: '0795439545',
  email: 'luxeniacollection@gmail.com',
  mpesaPaybill: '888222',
  mpesaTill: '9876543',
  supportHours: 'Monday – Sunday: 8:00 AM – 10:00 PM EAT',
  shippingPolicy: {
    nairobiExpress: 'Same-day delivery within Nairobi (orders before 2 PM)',
    nationwide: '24-48 hours delivery countrywide via Courier',
    international: '3-5 business days worldwide via DHL Express',
    deliveryFee: 0
  }
};

export const testimonials = [
  {
    id: 1,
    name: 'Lady Wangari M.',
    role: 'Client & Collector',
    city: 'Karen, Nairobi',
    quote: 'The craftsmanship of The Sovereign Baguette in Noir Black is exceptional. The smooth leather, the gold twist lock, and the presentation dust bag feel world-class.',
    rating: 5,
    date: 'February 2026'
  },
  {
    id: 2,
    name: 'Dr. Tariq Al-Mansoor',
    role: 'Design & Leather Connoisseur',
    city: 'Dubai / Nairobi',
    quote: 'The Sahara Mocha Baguette is masterfully executed. The WhatsApp concierge ordering and courier delivery in Nairobi was seamless. Luxe Nia is setting the benchmark for African luxury.',
    rating: 5,
    date: 'January 2026'
  },
  {
    id: 3,
    name: 'Vanessa K.',
    role: 'Creative Director',
    city: 'Mombasa',
    quote: 'The Ivory Pearl bag is exquisite. From the edge burnishing to the gold hardware, Luxe Nia Collections is truly in a league of its own.',
    rating: 5,
    date: 'March 2026'
  }
];

export const brandMilestones = [
  {
    year: '2022',
    title: 'The Inception',
    description: 'Luxe Nia was founded in Nairobi with a singular vision: to craft world-class luxury leather handbags celebrating elegance and modern African sophistication.'
  },
  {
    year: '2023',
    title: 'The Westlands Atelier',
    description: 'Inauguration of our atelier showroom in Westlands, Nairobi.'
  },
  {
    year: '2024',
    title: 'Sovereign Series Debut',
    description: 'Launched The Sovereign Baguette collection, receiving widespread acclaim for architectural leather silhouettes.'
  },
  {
    year: '2025',
    title: 'Nationwide Delivery & M-Pesa Integration',
    description: 'Expanded same-day courier delivery across Kenya and integrated seamless M-Pesa mobile checkout.'
  }
];

export const sampleInitialOrders = [
  {
    id: 'LN-2026-8941',
    date: '2026-08-15T14:30:00.000Z',
    items: [
      {
        id: 'prod-001',
        name: 'The Sovereign Baguette Flap Bag — Noir Black',
        priceKes: 5800,
        priceUsd: 45,
        quantity: 1,
        selectedSize: 'Classic Baguette (28cm)',
        selectedColor: 'Noir Black',
        image: '/images/products/luxe-baguette-noir-black.jpg'
      }
    ],
    subtotal: 5800,
    shippingFee: 0,
    discount: 0,
    total: 5800,
    paymentMethod: 'mpesa_send_money',
    mpesaReceipt: 'SKL89472QW',
    mpesaPhone: '0712345678',
    status: 'Delivered',
    statusStep: 4,
    shippingAddress: {
      fullName: 'Amani Kenyatta',
      phone: '0712345678',
      deliveryLocation: 'Lavington, Nairobi'
    },
    trackingHistory: [
      { status: 'Order Placed & Paid via M-Pesa', time: 'Aug 15, 2026 - 02:30 PM', location: 'Luxe Nia Online' },
      { status: 'Artisan Inspection & Packaging', time: 'Aug 15, 2026 - 03:45 PM', location: 'Luxe Nia Atelier' },
      { status: 'Dispatched with Courier', time: 'Aug 16, 2026 - 09:15 AM', location: 'Nairobi Logistics Center' },
      { status: 'Out for Delivery (Rider: James K.)', time: 'Aug 16, 2026 - 11:30 AM', location: 'En route to Lavington' },
      { status: 'Delivered & Signed', time: 'Aug 16, 2026 - 01:15 PM', location: 'Delivered to Recipient' }
    ]
  }
];
