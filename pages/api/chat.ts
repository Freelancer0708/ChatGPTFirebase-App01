import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  throw new Error('OpenAI API key is missing in environment variables');
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }

  const { prompt, messages } = req.body;

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [...messages, { role: 'user', content: prompt }],
        max_tokens: 300,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    res.status(200).json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch response from OpenAI' });
  }
}
