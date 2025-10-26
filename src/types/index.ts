export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date | string;
  language?: string;
}

export interface ChatRequest {
  message: string;
  conversationHistory: Message[];
  language: string;
}

export interface ChatResponse {
  message: string;
  language: string;
  error?: string;
}

export interface SarvamAPIResponse {
  choices?: Array<{
    message: {
      content: string;
    };
  }>;
  error?: string;
}

export type Language = {
  code: string;
  name: string;
  nativeName: string;
};
