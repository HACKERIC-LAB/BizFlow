import axios from 'axios';
import { config } from '../config';
import { logger } from './logger';

export async function chatCompletion(
  systemPrompt: string,
  userMessage: string
): Promise<string> {
  if (!config.OPENAI_API_KEY) {
    logger.warn('OpenAI not configured — returning stub response');
    return 'AI service not configured. Please add OPENAI_API_KEY to use this feature.';
  }

  const response = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
      temperature: 0.7,
      max_tokens: 500,
    },
    {
      headers: {
        Authorization: `Bearer ${config.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data.choices[0].message.content as string;
}
