// Vercel Serverless Function: Initiate M-Pesa STK Push via Daraja API
import {
  normalizeMpesaPhone,
  getDarajaConfig,
  getDarajaTimestamp,
  generateDarajaPassword,
  fetchDarajaToken
} from './_daraja.js';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: `Method ${req.method} not allowed. Please use POST.`
    });
  }

  try {
    const {
      phone,
      orderReference,
      customerName,
      deliveryLocation,
      items,
      amount
    } = req.body || {};

    // 1. Phone number validation and normalization
    const formattedPhone = normalizeMpesaPhone(phone);
    if (!formattedPhone) {
      return res.status(400).json({
        success: false,
        error: 'INVALID_PHONE',
        message: 'Please enter a valid Kenyan Safaricom phone number (e.g. 0712345678, 0112345678, or 254712345678).'
      });
    }

    // 2. Server-side calculation of order total: PRODUCT TOTAL = FINAL TOTAL (NO DELIVERY FEE)
    let calculatedSubtotal = 0;
    if (Array.isArray(items) && items.length > 0) {
      // The authentic Sovereign Baguette is 5,800 KES
      calculatedSubtotal = items.reduce((sum, item) => {
        const qty = Math.max(1, Number(item.quantity) || 1);
        const itemPrice = Number(item.priceKes) || 5800;
        return sum + (itemPrice * qty);
      }, 0);
    } else if (amount && Number(amount) > 0) {
      calculatedSubtotal = Math.round(Number(amount));
    } else {
      calculatedSubtotal = 5800;
    }

    // Zero delivery fee added: Final Amount = Product Total exactly
    const finalAmount = calculatedSubtotal;

    const reference = orderReference || `LN-${Date.now().toString().slice(-6)}`;
    const accountRef = `LUXENIA-${reference.replace(/[^a-zA-Z0-9]/g, '').slice(-8).toUpperCase()}`;

    // 3. Inspect Daraja environment configuration
    const config = getDarajaConfig();

    if (!config.isConfigured) {
      // Clean, informative response when credentials are not yet set in Vercel
      return res.status(200).json({
        success: false,
        isConfigured: false,
        error: 'CREDENTIALS_PENDING',
        message: 'M-Pesa Daraja credentials are not yet configured in server environment variables.',
        instructions: 'Please configure MPESA_CONSUMER_KEY, MPESA_CONSUMER_SECRET, MPESA_PASSKEY, and MPESA_SHORTCODE in your Vercel Project Environment Variables.',
        orderDetails: {
          orderReference: reference,
          accountReference: accountRef,
          customerName: customerName || 'Valued Patron',
          deliveryLocation: deliveryLocation || 'Kenya',
          phone: formattedPhone,
          amount: finalAmount,
          subtotal: calculatedSubtotal
        }
      });
    }

    // 4. Authenticate with Safaricom Daraja and request OAuth Token
    const accessToken = await fetchDarajaToken(
      config.consumerKey,
      config.consumerSecret,
      config.baseUrl
    );

    // 5. Generate Password & Timestamp for STK Push
    const timestamp = getDarajaTimestamp();
    const password = generateDarajaPassword(config.shortcode, config.passkey, timestamp);

    // 6. Build Safaricom STK Push Payload
    const stkPayload = {
      BusinessShortCode: config.shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: config.transactionType || 'CustomerPayBillOnline', // or CustomerBuyGoodsOnline for Till
      Amount: Math.round(finalAmount),
      PartyA: formattedPhone,
      PartyB: config.shortcode,
      PhoneNumber: formattedPhone,
      CallBackURL: config.callbackUrl,
      AccountReference: accountRef,
      TransactionDesc: `Luxe Nia Order ${reference}`
    };

    // 7. Dispatch STK Push to Daraja API
    const darajaResponse = await fetch(`${config.baseUrl}/mpesa/stkpush/v1/processrequest`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(stkPayload)
    });

    const darajaData = await darajaResponse.json();

    if (!darajaResponse.ok || darajaData.ResponseCode !== '0') {
      return res.status(400).json({
        success: false,
        error: 'STK_PUSH_REJECTED',
        message: darajaData.ResponseDescription || darajaData.errorMessage || 'Safaricom could not initiate the STK push request. Please verify your phone number and try again.',
        darajaDetails: darajaData
      });
    }

    // 8. Return success response with CheckoutRequestID for status polling
    return res.status(200).json({
      success: true,
      isConfigured: true,
      checkoutRequestId: darajaData.CheckoutRequestID,
      merchantRequestId: darajaData.MerchantRequestID,
      responseCode: darajaData.ResponseCode,
      customerMessage: darajaData.CustomerMessage || 'STK Push prompt sent. Please enter your M-Pesa PIN on your phone.',
      orderReference: reference,
      amount: finalAmount,
      phone: formattedPhone
    });

  } catch (error) {
    console.error('Error initiating M-Pesa STK Push:', error);
    return res.status(500).json({
      success: false,
      error: 'SERVER_ERROR',
      message: error.message || 'An unexpected error occurred while processing the M-Pesa payment request.'
    });
  }
}
