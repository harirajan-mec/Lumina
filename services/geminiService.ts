import { GoogleGenAI, Chat } from "@google/genai";
import { Product } from '../types';

const apiKey = process.env.API_KEY || ''; // Ensure this is available

const ai = new GoogleGenAI({ apiKey });

// Dispatch a custom event for the Debug Console
export const dispatchLog = (type: 'info' | 'error' | 'ai-request' | 'ai-response', title: string, data?: any) => {
  const event = new CustomEvent('lumin-log', {
    detail: {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      type,
      title,
      data
    }
  });
  window.dispatchEvent(event);
};

export const createChatSession = (products: Product[]): Chat => {
  // System prompt to ground the AI in the store's context
  const SYSTEM_INSTRUCTION = `
You are "Lumi", the AI Personal Stylist for Lumina Fashion.
Your goal is to help customers find the perfect clothing from our inventory.
Be helpful, stylish, and concise. 

Here is our current product inventory (JSON):
${JSON.stringify(products.map(p => ({ id: p.id, name: p.name, category: p.category, price: p.price, tags: p.tags, colors: p.colors })))}

RULES:
1. Only recommend products from the inventory list above.
2. When recommending, mention the exact product name and price.
3. If the user asks about fashion advice (e.g., "what to wear to a wedding"), suggest items from the inventory that fit the occasion.
4. Keep responses short (under 100 words) unless asked for detail.
5. If you don't have a specific item (e.g., "swimwear"), politely apologize and suggest the closest alternative (e.g., "summer shorts").
`;

  dispatchLog('info', 'System: Initializing new Chat Session', { systemInstruction: 'Loaded' });
  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      temperature: 0.7,
    },
  });
};

export const generateProductAdvice = async (productName: string, question: string): Promise<string> => {
  dispatchLog('ai-request', `Product Advice: ${productName}`, { prompt: question });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `The user is looking at the product "${productName}". They ask: "${question}". Answer briefly focusing on fashion advice and care.`,
    });
    const text = response.text || "I couldn't generate advice at the moment.";
    dispatchLog('ai-response', `Advice Received`, { response: text });
    return text;
  } catch (error) {
    console.error("Gemini Error:", error);
    dispatchLog('error', 'Gemini API Failed', { error: String(error) });
    return "Sorry, I'm having trouble connecting to the fashion brain right now.";
  }
};