import axios from 'axios';
import { config } from './config';

const nowPaymentsApi = axios.create({
  baseURL: 'https://api.nowpayments.io/v1',
  headers: {
    'x-api-key': config.nowPayments.apiKey
  }
});

export async function createInvoice(amount, currency) {
  try {
    const response = await nowPaymentsApi.post('/invoice', {
      price_amount: amount,
      price_currency: 'usd',
      pay_currency: currency,
      ipn_callback_url: 'https://your-callback-url.com/nowpayments-ipn'
    });
    return response.data;
  } catch (error) {
    console.error('Error creating NowPayments invoice:', error);
    throw error;
  }
}
