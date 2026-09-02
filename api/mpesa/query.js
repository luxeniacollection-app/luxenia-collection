// Vercel Serverless Function: Query M-Pesa STK Push Status via Daraja API
import {
  getDarajaConfig,
  getDarajaTimestamp,
  generateDarajaPassword,
  fetchDarajaToken
} from './_daraja.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const checkoutRequestId = req.query.checkoutRequestId || req.body?.checkoutRequestId;

    if (!checkoutRequestId) {
      return res.status(400).json({
        success: false,
        message: 'checkoutRequestId is required to query payment status.'
      });
    }

    const config = getDarajaConfig();

    if (!config.isConfigured) {
      return res.status(200).json({
        success: false,
        isConfigured: false,
        status: 'PENDING_CONFIGURATION',
        message: 'Daraja credentials are not yet configured in server environment variables.'
      });
    }

    const accessToken = await fetchDarajaToken(
      config.consumerKey,
      config.consumerSecret,
      config.baseUrl
    );

    const timestamp = getDarajaTimestamp();
    const password = generateDarajaPassword(config.shortcode, config.passkey, timestamp);

    const queryPayload = {
      BusinessShortCode: config.shortcode,
      Password: password,
      Timestamp: timestamp,
      CheckoutRequestID: checkoutRequestId
    };

    const darajaResponse = await fetch(`${config.baseUrl}/mpesa/stkpushquery/v1/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(queryPayload)
    });

    const queryData = await darajaResponse.json();

    /*
      Daraja ResultCodes:
      0: The service request is processed successfully.
      1032: Request cancelled by user.
      1037: DS timeout / user failed to respond within time limit.
      1: The balance is insufficient for the transaction.
      2001: The initiator information is invalid.
    */
    if (queryData.ResultCode === '0' || queryData.ResultCode === 0) {
      return res.status(200).json({
        success: true,
        status: 'SUCCESS',
        resultCode: queryData.ResultCode,
        resultDesc: queryData.ResultDesc,
        receiptNumber: queryData.MpesaReceiptNumber || null,
        transactionDate: queryData.TransactionDate || null
      });
    } else if (queryData.ResultCode === '1032' || queryData.ResultCode === 1032) {
      return res.status(200).json({
        success: false,
        status: 'CANCELLED',
        resultCode: queryData.ResultCode,
        resultDesc: queryData.ResultDesc || 'Payment was cancelled on the customer phone.'
      });
    } else if (queryData.ResultCode === '1037' || queryData.ResultCode === 1037) {
      return res.status(200).json({
        success: false,
        status: 'TIMEOUT',
        resultCode: queryData.ResultCode,
        resultDesc: queryData.ResultDesc || 'The PIN prompt timed out. Please try again.'
      });
    } else if (queryData.errorCode) {
      return res.status(200).json({
        success: false,
        status: 'PENDING',
        message: queryData.errorMessage || 'Transaction is still processing.'
      });
    } else {
      return res.status(200).json({
        success: false,
        status: 'FAILED',
        resultCode: queryData.ResultCode,
        resultDesc: queryData.ResultDesc || 'Payment was not completed. Please try again.'
      });
    }

  } catch (error) {
    console.error('Error querying M-Pesa status:', error);
    return res.status(500).json({
      success: false,
      error: 'SERVER_ERROR',
      message: error.message || 'Error querying M-Pesa payment status.'
    });
  }
}
