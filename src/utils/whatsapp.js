// Luxe Nia Collections - WhatsApp & Social Media Utilities
export const OFFICIAL_WHATSAPP_PHONE = '254795439545';
export const OFFICIAL_LOCAL_PHONE = '0795439545';
export const OFFICIAL_DISPLAY_PHONE = '+254 795 439 545';

export const OFFICIAL_INSTAGRAM_HANDLE = '@luxeniacollection';
export const OFFICIAL_INSTAGRAM_URL = 'https://www.instagram.com/luxeniacollection/';
export const OFFICIAL_EMAIL = 'luxeniacollection@gmail.com';

export const DEFAULT_WHATSAPP_MESSAGE = "Hello LUXE NIA, I'd like to make an inquiry about your bags.";

/**
 * Generate standard WhatsApp chat link with pre-filled inquiry
 */
export function getWhatsAppInquiryUrl(customMessage = DEFAULT_WHATSAPP_MESSAGE) {
  const text = customMessage || DEFAULT_WHATSAPP_MESSAGE;
  return `https://wa.me/${OFFICIAL_WHATSAPP_PHONE}?text=${encodeURIComponent(text)}`;
}

/**
 * Format order message with Customer Name, Bag Name, Quantity, Bag Price, and Total Price
 * Example: "Hello LUXE NIA, my name is Jane. I would like to order the Black Clutch Bag, quantity 1, at KSh 5,800."
 */
export function formatWhatsAppOrderMessage({
  customerName,
  bagName,
  quantity = 1,
  bagPrice,
  totalPrice
}) {
  const name = (customerName || '').trim() || 'Jane';
  const qty = Number(quantity) || 1;
  const singlePrice = Number(bagPrice) || 5800;
  const total = totalPrice !== undefined && totalPrice !== null
    ? Number(totalPrice)
    : singlePrice * qty;

  const formattedBagPrice = singlePrice.toLocaleString();
  const formattedTotalPrice = total.toLocaleString();

  if (qty === 1) {
    return `Hello LUXE NIA, my name is ${name}. I would like to order the ${bagName}, quantity 1, at KSh ${formattedBagPrice}.`;
  }

  return `Hello LUXE NIA, my name is ${name}. I would like to order the ${bagName}, quantity ${qty}, at KSh ${formattedBagPrice} each (Total: KSh ${formattedTotalPrice}).`;
}

/**
 * Generate WhatsApp direct link for a single bag order
 */
export function getWhatsAppOrderUrl({
  customerName,
  bagName,
  quantity = 1,
  bagPrice,
  totalPrice
}) {
  const message = formatWhatsAppOrderMessage({
    customerName,
    bagName,
    quantity,
    bagPrice,
    totalPrice
  });
  return `https://wa.me/${OFFICIAL_WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
}

/**
 * Legacy single product URL generator (supports backward compatibility)
 */
export function getWhatsAppProductOrderUrl(product, selectedColor, selectedSize, quantity = 1, customerName = '') {
  const bagName = product?.name || 'Luxury Handbag';
  const bagPrice = product?.priceKes || 5800;
  return getWhatsAppOrderUrl({
    customerName,
    bagName,
    quantity,
    bagPrice,
    totalPrice: bagPrice * quantity
  });
}

/**
 * Generate a pre-filled WhatsApp link for ordering cart items with customer's name
 */
export function getWhatsAppCartOrderUrl(cartItems, totalKes, customerName = '') {
  const name = (customerName || '').trim() || 'Jane';

  if (!cartItems || cartItems.length === 0) {
    return getWhatsAppInquiryUrl();
  }

  const totalFormatted = Number(totalKes || 0).toLocaleString();

  if (cartItems.length === 1) {
    const item = cartItems[0];
    return getWhatsAppOrderUrl({
      customerName: name,
      bagName: item.name,
      quantity: item.quantity || 1,
      bagPrice: item.priceKes || 5800,
      totalPrice: (item.priceKes || 5800) * (item.quantity || 1)
    });
  }

  const itemsList = cartItems.map((item) => {
    const itemPrice = Number(item.priceKes || 5800).toLocaleString();
    const subtotal = ((Number(item.priceKes) || 5800) * (item.quantity || 1)).toLocaleString();
    return `• ${item.name}, quantity ${item.quantity || 1}, at KSh ${itemPrice} (KSh ${subtotal})`;
  }).join('\n');

  const text = [
    `Hello LUXE NIA, my name is ${name}. I would like to order the following bags:`,
    itemsList,
    `Total price: KSh ${totalFormatted}.`
  ].join('\n');

  return `https://wa.me/${OFFICIAL_WHATSAPP_PHONE}?text=${encodeURIComponent(text)}`;
}

export const getWhatsAppCartUrl = getWhatsAppCartOrderUrl;
export const getWhatsAppPaymentConfirmationUrl = getWhatsAppCartOrderUrl;
