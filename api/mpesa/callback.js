// Vercel Serverless Function: Webhook receiver for Safaricom Daraja callbacks

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ResultCode: 1, ResultDesc: 'Method not allowed' });
  }

  try {
    const callbackData = req.body;
    console.log('M-Pesa STK Callback Received:', JSON.stringify(callbackData, null, 2));

    const stkCallback = callbackData?.Body?.stkCallback;
    if (stkCallback) {
      const {
        MerchantRequestID,
        CheckoutRequestID,
        ResultCode,
        ResultDesc,
        CallbackMetadata
      } = stkCallback;

      console.log(`CheckoutRequestID: ${CheckoutRequestID}, ResultCode: ${ResultCode}, ResultDesc: ${ResultDesc}`);

      if (ResultCode === 0 && CallbackMetadata?.Item) {
        let amount = null;
        let mpesaReceiptNumber = null;
        let transactionDate = null;
        let phoneNumber = null;

        for (const item of CallbackMetadata.Item) {
          if (item.Name === 'Amount') amount = item.Value;
          if (item.Name === 'MpesaReceiptNumber') mpesaReceiptNumber = item.Value;
          if (item.Name === 'TransactionDate') transactionDate = item.Value;
          if (item.Name === 'PhoneNumber') phoneNumber = item.Value;
        }

        console.log(`Payment SUCCESS: Receipt ${mpesaReceiptNumber}, Amount: ${amount}, Phone: ${phoneNumber}`);
      }
    }

    // Always acknowledge Safaricom callback with standard XML/JSON confirmation
    return res.status(200).json({
      ResultCode: 0,
      ResultDesc: 'Callback processed successfully'
    });

  } catch (error) {
    console.error('Error handling Daraja callback:', error);
    return res.status(200).json({
      ResultCode: 0,
      ResultDesc: 'Callback accepted with internal warning'
    });
  }
}
