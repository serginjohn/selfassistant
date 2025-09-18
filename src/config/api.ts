// API Configuration - Update this endpoint as needed
export const API_CONFIG = {
  // Default endpoint - replace with your actual API URL
  endpoint: 'https://dog.ceo/api/breeds/image/random',
  
  // You can easily change this to any API endpoint
  // Examples:
  // endpoint: 'https://api.example.com/chat',
  // endpoint: 'http://localhost:3000/api/chat',
  // endpoint: 'https://your-ai-service.com/generate',
};

export interface ApiResponse {
  id?: string;
  content: string;
  isHeavy?: boolean;
  metadata?: Record<string, any>;
}