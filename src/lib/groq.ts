import { Groq } from 'groq-sdk';

const groqApiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY;

if (!groqApiKey) {
  throw new Error('Missing Groq API key');
}

const groq = new Groq({
  apiKey: groqApiKey,
});

export async function generateTherapistMatches(userPreferences: any) {
  const prompt = `Based on the following user preferences, suggest 3 therapists that would be a good match. Format the response as a JSON array of therapist objects with these fields: name, location, rating (1-5), specialties (array), languages (array), sessionFormat (string), ratePerSession (number), bio (string), and email.

User Preferences:
${JSON.stringify(userPreferences, null, 2)}`;

  const completion = await groq.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: 'You are an AI therapist matching assistant that helps connect users with appropriate therapists based on their preferences and needs.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    model: 'mixtral-8x7b-32768',
    temperature: 0.7,
    max_tokens: 2048,
    stream: false,
  });

  try {
    return JSON.parse(completion.choices[0]?.message?.content || '[]');
  } catch (error) {
    console.error('Error parsing therapist matches:', error);
    return [];
  }
}

export async function generateChatResponse(userMessage: string, userPreferences: any) {
  const systemPrompt = `You are an empathetic AI assistant helping users find the right therapist. Use the user's preferences to provide personalized responses:
${JSON.stringify(userPreferences, null, 2)}`;

  const completion = await groq.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: systemPrompt,
      },
      {
        role: 'user',
        content: userMessage,
      },
    ],
    model: 'mixtral-8x7b-32768',
    temperature: 0.7,
    max_tokens: 1024,
    stream: false,
  });

  return completion.choices[0]?.message?.content || 'I apologize, but I was unable to generate a response. Please try again.';
} 