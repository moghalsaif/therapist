import { Groq } from 'groq-sdk';

const groqApiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY;

if (!groqApiKey) {
  throw new Error('Missing Groq API key');
}

export const groq = new Groq({
  apiKey: groqApiKey,
}); 