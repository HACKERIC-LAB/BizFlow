import axios from 'axios';
import { config } from '../config';
import { logger } from './logger';

const WA_BASE = 'https://graph.facebook.com/v18.0';

export async function sendTextMessage(phone: string, text: string): Promise<void> {
  if (!config.WHATSAPP_PHONE_NUMBER_ID || !config.WHATSAPP_ACCESS_TOKEN) {
    logger.warn('WhatsApp not configured — skipping message send');
    return;
  }
  try {
    await axios.post(
      `${WA_BASE}/${config.WHATSAPP_PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: 'whatsapp',
        to: phone.replace('+', '').replace(/^0/, '254'),
        type: 'text',
        text: { body: text },
      },
      { headers: { Authorization: `Bearer ${config.WHATSAPP_ACCESS_TOKEN}` } }
    );
    logger.info('WhatsApp text sent', { phone });
  } catch (error) {
    logger.error('WhatsApp send failed', { phone, error });
  }
}

export async function sendTemplateMessage(
  phone: string,
  templateName: string,
  language: string,
  components: unknown[]
): Promise<void> {
  if (!config.WHATSAPP_PHONE_NUMBER_ID || !config.WHATSAPP_ACCESS_TOKEN) {
    logger.warn('WhatsApp not configured — skipping template send');
    return;
  }
  try {
    await axios.post(
      `${WA_BASE}/${config.WHATSAPP_PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: 'whatsapp',
        to: phone.replace('+', '').replace(/^0/, '254'),
        type: 'template',
        template: { name: templateName, language: { code: language }, components },
      },
      { headers: { Authorization: `Bearer ${config.WHATSAPP_ACCESS_TOKEN}` } }
    );
    logger.info('WhatsApp template sent', { phone, templateName });
  } catch (error) {
    logger.error('WhatsApp template failed', { phone, templateName, error });
  }
}
