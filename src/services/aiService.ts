import { API_CONFIG, type ApiResponse } from '@/config/api';

export interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  isHeavy?: boolean;
  responseId?: string;
}

export class AIService {
  async sendMessage(message: string): Promise<ApiResponse> {
    try {
      const response = await fetch(API_CONFIG.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      
      // Process the response to determine if it's heavy
      const responseText = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
      const isHeavy = responseText.length > 500 || (typeof data === 'object' && Object.keys(data).length > 10);

      return {
        id: data.id || crypto.randomUUID(),
        content: responseText,
        isHeavy,
        metadata: typeof data === 'object' ? data : undefined,
      };
    } catch (error) {
      console.error('AI Service Error:', error);
      throw new Error('Failed to get response from AI service');
    }
  }

  async getResponseDetail(responseId: string): Promise<ApiResponse | null> {
    // In a real implementation, this might fetch from a cache or database
    // For now, we'll return null as responses are stored in local state
    return null;
  }
}

export const aiService = new AIService();