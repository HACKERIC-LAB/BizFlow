import axios from 'axios';
import { config } from '../config';
import { logger } from './logger';

export async function sendSMS(phone: string, message: string): Promise<void> {
  if (!config.AFRICASTALKING_API_KEY) {
    logger.warn("Africa's Talking not configured — skipping SMS");
    return;
  }
  try {
    const to = phone.startsWith('+') ? phone : `+254${phone.replace(/^0/, '')}`;
    await axios.post(
      'https://api.africastalking.com/version1/messaging',
      new URLSearchParams({
        username: config.AFRICASTALKING_USERNAME,
        to,
        message,
        from: 'BizFlow',
      }),
      {
        headers: {
          apiKey: config.AFRICASTALKING_API_KEY,
          Accept: 'application/json',
        },
      }
    );
    logger.info('SMS sent', { phone });
  } catch (error) {
    logger.error('SMS send failed', { phone, error });
  }
}
