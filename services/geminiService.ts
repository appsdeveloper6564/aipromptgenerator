import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { GeminiModel } from '../types';

// Initialize the Gemini API client safely
// CRITICAL: process.env.API_KEY is automatically injected.
const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey: apiKey });

export const generatePromptContent = async (
  topic: string, 
  category: string, 
  tone: string
): Promise<string> => {
  try {
    if (!apiKey) {
      return "API Key is missing. Please configure your environment variables.";
    }

    const prompt = `
      You are an expert Prompt Engineer.
      Create a highly effective, detailed, and professional prompt for:
      Category: ${category}
      Topic: ${topic}
      Tone: ${tone}
      
      Return ONLY the prompt text, ready to be copied. Do not add conversational filler.
    `;

    // Using Flash Lite for low latency as requested
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
    return "An error occurred while communicating with Gemini.";
  }
};

export const sendChatMessage = async (
  message: string, 
  history: { role: 'user' | 'model', parts: { text: string }[] }[]
): Promise<string> => {
  try {
    if (!apiKey) {
      return "System Error: API Key missing.";
    }

    // Using Pro model for better reasoning in chat
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
    return "Sorry, I'm having trouble connecting right now.";
  }
};

export const editImageWithPrompt = async (
  imageBase64: string,
  prompt: string,
  mimeType: string = 'image/png'
): Promise<string | null> => {
  try {
    if (!apiKey) {
      alert("API Key is missing.");
      return null;
    }

    // Using Flash Image (Nano Banana equivalent) for image editing
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

    // Extract image from response
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    
    return null;
  } catch (error) {
    console.error("Image edit error:", error);
    throw error;
  }
};