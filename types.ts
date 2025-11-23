export interface Prompt {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  createdAt: number;
  isFavorite: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export enum AppView {
  HOME = 'home',
  GENERATOR = 'generator',
  CHAT = 'chat',
  IMAGE_EDITOR = 'image_editor',
  LIBRARY = 'library',
  DASHBOARD = 'dashboard'
}

export enum GeminiModel {
  FLASH_LITE = 'gemini-flash-lite-latest', // For fast prompts
  PRO = 'gemini-3-pro-preview', // For complex chat
  IMAGE = 'gemini-2.5-flash-image' // For image editing
}
