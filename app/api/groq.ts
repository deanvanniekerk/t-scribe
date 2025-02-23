import Groq from 'groq-sdk';

// Initialize the Groq client
export const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});
