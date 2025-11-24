import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { GeminiModel } from '../types';

// Declare process for TypeScript to avoid compilation errors, but check existence at runtime
declare const process: any;

// Helper to safely get API Key in browser environment
const getApiKey = (): string => {
  try {
    // Check global process (Node/Build time)
    if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
      return process.env.API_KEY;
    }
    // Check window.process (Browser Polyfill)
    if (typeof window !== 'undefined' && (window as any).process?.env?.API_KEY) {
      return (window as any).process.env.API_KEY;
    }
  } catch (e) {
    console.warn("Error accessing environment variables", e);
  }
  return '';
};

// Lazy initialization to prevent startup crashes
let aiInstance: GoogleGenAI | null = null;

const getAI = (): GoogleGenAI => {
  if (!aiInstance) {
    const apiKey = getApiKey();
    // Initialize even if empty to allow app to load; calls will fail gracefully later with a clear message
    aiInstance = new GoogleGenAI({ apiKey: apiKey });
  }
  return aiInstance;
};

export const generatePromptContent = async (
  topic: string, 
  category: string, 
  tone: string
): Promise<string> => {
  try {
    const apiKey = getApiKey();
    if (!apiKey) {
      return "⚠️ API Key is missing. Please check your configuration.";
    }

    const prompt = `
      You are an expert Prompt Engineer.
      Create a highly effective, detailed, and professional prompt for:
      Category: ${category}
      Topic: ${topic}
      Tone: ${tone}
      
      Return ONLY the prompt text, ready to be copied. Do not add conversational filler.
    `;

    const ai = getAI();
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GeminiModel.FLASH_LITE,
      contents: prompt,
      config: {
        systemInstruction: "You are a specialized AI designed to generate high-quality prompts for LLMs and creative tools.",
        temperature: 0.7,
      }
    });
    
    return response.text || "Failed to generate prompt. Please try again.";
  } catch (error) {
    console.error("Error generating prompt:", error);
    return "An error occurred while communicating with Gemini. Check console for details.";
  }
};

export const sendChatMessage = async (
  message: string, 
  history: { role: 'user' | 'model', parts: { text: string }[] }[]
): Promise<string> => {
  try {
    const apiKey = getApiKey();
    if (!apiKey) {
      return "System Error: API Key missing.";
    }

    const ai = getAI();
    const chat = ai.chats.create({
      model: GeminiModel.PRO,
      history: history,
      config: {
        systemInstruction: "You are PromptMaster AI, a helpful assistant for building apps, coding, and generating creative content. You are knowledgeable about SEO, SaaS monetization, and software architecture.",
      }
    });

    const response: GenerateContentResponse = await chat.sendMessage({ message });
    return response.text || "I couldn't generate a response.";
  } catch (error) {
    console.error("Chat error:", error);
    return "Sorry, I'm having trouble connecting right now. Please try again later.";
  }
};

export const editImageWithPrompt = async (
  imageBase64: string,
  prompt: string,
  mimeType: string = 'image/png'
): Promise<string | null> => {
  try {
    const apiKey = getApiKey();
    if (!apiKey) {
      alert("API Key is missing.");
      return null;
    }

    const ai = getAI();
    const response = await ai.models.generateContent({
      model: GeminiModel.IMAGE,
      contents: {
        parts: [
          {
            inlineData: {
              data: imageBase64,
              mimeType: mimeType
            }
          },
          {
            text: `Edit this image: ${prompt}. Return the edited image.`
          }
        ]
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    
    return null;
  } catch (error) {
    console.error("Image edit error:", error);
    alert("Failed to process image. See console for details.");
    return null;
  }
};