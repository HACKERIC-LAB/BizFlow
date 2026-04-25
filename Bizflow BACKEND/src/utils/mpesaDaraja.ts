import axios from 'axios';
import { config } from '../config';
import { logger } from './logger';

interface StkPushParams {
  phone: string;
  amount: number;
  accountRef: string;
  description: string;
}

export interface StkPushResponse {
  MerchantRequestID: string;
  CheckoutRequestID: string;
  ResponseCode: string;
  ResponseDescription: string;
  CustomerMessage: string;
}

let accessToken: string | null = null;
let tokenExpiry: number = 0;

async function getAccessToken(): Promise<string> {
  if (accessToken && Date.now() < tokenExpiry) return accessToken;

  if (!config.MPESA_CONSUMER_KEY || !config.MPESA_CONSUMER_SECRET) {
    throw new Error('M-PESA credentials not configured');
  }

  const baseUrl =
    config.MPESA_ENV === 'production'
      ? 'https://api.safaricom.co.ke'
      : 'https://sandbox.safaricom.co.ke';

  const credentials = Buffer.from(
    `${config.MPESA_CONSUMER_KEY}:${config.MPESA_CONSUMER_SECRET}`
  ).toString('base64');

  const response = await axios.get(`${baseUrl}/oauth/v1/generate?grant_type=client_credentials`, {
    headers: { Authorization: `Basic ${credentials}` },
  });

  accessToken = response.data.access_token;
  tokenExpiry = Date.now() + 3500 * 1000; // ~58 min
  return accessToken!;
}

export async function initiateStkPush(params: StkPushParams): Promise<StkPushResponse> {
  if (!config.MPESA_SHORTCODE || !config.MPESA_PASSKEY || !config.MPESA_CALLBACK_URL) {
    throw new Error('M-PESA not fully configured');
  }

  const token = await getAccessToken();
  const timestamp = new Date()
    .toISOString()
    .replace(/[^0-9]/g, '')
    .slice(0, 14);
  const password = Buffer.from(
    `${config.MPESA_SHORTCODE}${config.MPESA_PASSKEY}${timestamp}`
  ).toString('base64');

  // Normalize phone: 0712... → 254712...
  const phone = params.phone.startsWith('0')
    ? `254${params.phone.slice(1)}`
    : params.phone.replace('+', '');

  const baseUrl =
    config.MPESA_ENV === 'production'
      ? 'https://api.safaricom.co.ke'
      : 'https://sandbox.safaricom.co.ke';

  const response = await axios.post(
    `${baseUrl}/mpesa/stkpush/v1/processrequest`,
    {
      BusinessShortCode: config.MPESA_SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: Math.ceil(params.amount),
      PartyA: phone,
      PartyB: config.MPESA_SHORTCODE,
      PhoneNumber: phone,
      CallBackURL: config.MPESA_CALLBACK_URL,
      AccountReference: params.accountRef,
      TransactionDesc: params.description,
    },
    { headers: { Authorization: `Bearer ${token}` } }
  );

  logger.info('STK Push initiated', { checkoutRequestId: response.data.CheckoutRequestID });
  return response.data;
}
