// Shared Daraja M-Pesa Helper Utility for Vercel Serverless Functions

export function normalizeMpesaPhone(phone) {
  if (!phone) return null;
  // Strip all non-digit characters except leading +
  let cleaned = phone.toString().trim().replace(/[^\d+]/g, '');

  if (cleaned.startsWith('+')) {
    cleaned = cleaned.substring(1);
  }

  // Handle local formats: 07XXXXXXXX or 01XXXXXXXX -> 2547XXXXXXXX or 2541XXXXXXXX
  if (cleaned.startsWith('0') && cleaned.length === 10) {
    cleaned = '254' + cleaned.substring(1);
  }

  // Handle 7XXXXXXXX or 1XXXXXXXX -> 2547XXXXXXXX or 2541XXXXXXXX
  if ((cleaned.startsWith('7') || cleaned.startsWith('1')) && cleaned.length === 9) {
    cleaned = '254' + cleaned;
  }

  // Validate Kenyan format: exactly 12 digits, starting with 254
  const kenyanPhoneRegex = /^254(7|1)\d{8}$/;
  if (kenyanPhoneRegex.test(cleaned)) {
    return cleaned;
  }

  return null;
}

export function getDarajaConfig() {
  const consumerKey = process.env.MPESA_CONSUMER_KEY;
  const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
  const passkey = process.env.MPESA_PASSKEY;
  const shortcode = process.env.MPESA_SHORTCODE;
  const callbackUrl = process.env.MPESA_CALLBACK_URL || 'https://luxenia.vercel.app/api/mpesa/callback';
  const environment = (process.env.MPESA_ENVIRONMENT || 'sandbox').toLowerCase().trim();
  const transactionType = process.env.MPESA_TRANSACTION_TYPE || 'CustomerPayBillOnline';

  const isProduction = environment === 'production' || environment === 'live';
  const baseUrl = isProduction 
    ? 'https://api.safaricom.co.ke' 
    : 'https://sandbox.safaricom.co.ke';

  const isConfigured = Boolean(consumerKey && consumerSecret && passkey && shortcode);

  return {
    consumerKey,
    consumerSecret,
    passkey,
    shortcode,
    callbackUrl,
    environment,
    transactionType,
    baseUrl,
    isProduction,
    isConfigured
  };
}

export function getDarajaTimestamp() {
  const now = new Date();
  // Adjust to East Africa Time (UTC+3)
  const eatOffsetMs = 3 * 60 * 60 * 1000;
  const eatDate = new Date(now.getTime() + eatOffsetMs);

  const YYYY = eatDate.getUTCFullYear();
  const MM = String(eatDate.getUTCMonth() + 1).padStart(2, '0');
  const DD = String(eatDate.getUTCDate()).padStart(2, '0');
  const HH = String(eatDate.getUTCHours()).padStart(2, '0');
  const mm = String(eatDate.getUTCMinutes()).padStart(2, '0');
  const ss = String(eatDate.getUTCSeconds()).padStart(2, '0');

  return `${YYYY}${MM}${DD}${HH}${mm}${ss}`;
}

export function generateDarajaPassword(shortcode, passkey, timestamp) {
  const raw = `${shortcode}${passkey}${timestamp}`;
  return Buffer.from(raw).toString('base64');
}

export async function fetchDarajaToken(consumerKey, consumerSecret, baseUrl) {
  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');

  const response = await fetch(`${baseUrl}/oauth/v1/generate?grant_type=client_credentials`, {
    method: 'GET',
    headers: {
      'Authorization': `Basic ${auth}`
    }
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Daraja OAuth authentication failed (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  return data.access_token;
}
