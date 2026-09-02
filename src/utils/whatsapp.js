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
 * Generate a pre-filled WhatsApp link for direct single product ordering
 */
export function getWhatsAppProductOrderUrl(product, selectedColor, selectedSize, quantity = 1) {
  const colorName = typeof selectedColor === 'object' ? selectedColor?.name : (selectedColor || 'Noir Black');
  const priceFormatted = Number(product.priceKes || 5800).toLocaleString();
  
  const text = [
    `Hello LUXE NIA ✨`,
    ``,
    `I would like to order:`,
    `👜 *Product:* ${product.name}${colorName ? ` (${colorName})` : ''}`,
    `💰 *Price:* KSh ${priceFormatted}`,
    `🔢 *Quantity:* ${quantity}`,
    ``,
    `Please let me know how we can complete this order, payment, and delivery.`
  ].join('\n');

  return `https://wa.me/${OFFICIAL_WHATSAPP_PHONE}?text=${encodeURIComponent(text)}`;
}

// Alias for backward compatibility
export const getWhatsAppOrderUrl = getWhatsAppProductOrderUrl;

/**
 * Generate a pre-filled WhatsApp link for ordering cart/bag items
 */
export function getWhatsAppCartOrderUrl(cartItems, totalKes) {
  if (!cartItems || cartItems.length === 0) {
    return getWhatsAppInquiryUrl();
  }

  const totalFormatted = Number(totalKes || 0).toLocaleString();

  if (cartItems.length === 1) {
    const item = cartItems[0];
    return getWhatsAppProductOrderUrl(item, item.selectedColor, item.selectedSize, item.quantity || 1);
  }

  const itemsList = cartItems.map((item, idx) => {
    const colorName = typeof item.selectedColor === 'object' ? item.selectedColor?.name : (item.selectedColor || 'Noir Black');
    const itemPrice = Number(item.priceKes || 5800).toLocaleString();
    return `${idx + 1}. ${item.name} (${colorName}) x${item.quantity || 1} - KSh ${itemPrice}`;
  }).join('\n');

  const text = [
    `Hello LUXE NIA ✨`,
    ``,
    `I would like to order the following bags:`,
    ``,
    itemsList,
    ``,
    `💰 *Total:* KSh ${totalFormatted}`,
    ``,
    `Please let me know how we can complete this order, payment, and delivery.`
  ].join('\n');

  return `https://wa.me/${OFFICIAL_WHATSAPP_PHONE}?text=${encodeURIComponent(text)}`;
}

// Alias for backward compatibility
export const getWhatsAppCartUrl = getWhatsAppCartOrderUrl;
export const getWhatsAppPaymentConfirmationUrl = getWhatsAppCartOrderUrl;
