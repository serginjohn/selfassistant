import { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '@/components/ChatMessage';
import { ChatInput } from '@/components/ChatInput';
import { aiService, type ChatMessage as ChatMessageType } from '@/services/aiService';
import { toast } from 'sonner';
import { Bot, Sparkles } from 'lucide-react';

export default function Chat() {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [responses, setResponses] = useState<Record<string, any>>({});

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async (content: string) => {
    const userMessage: ChatMessageType = {
      id: crypto.randomUUID(),
      content,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await aiService.sendMessage(content);
      
      const aiMessage: ChatMessageType = {
        id: crypto.randomUUID(),
        content: response.isHeavy 
          ? `Response received (${response.content.length} characters). Click "View Full Response" to see details.`
          : response.content,
        isUser: false,
        timestamp: new Date(),
        isHeavy: response.isHeavy,
        responseId: response.isHeavy ? response.id : undefined,
      };

      if (response.isHeavy && response.id) {
        setResponses(prev => ({
          ...prev,
          [response.id!]: response,
        }));
      }

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      toast.error('Failed to get AI response. Please try again.');
      console.error('Chat error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-background to-background/50">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-ai-secondary flex items-center justify-center">
            <Bot className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-semibold flex items-center gap-2">
              AI Chat Engine
              <Sparkles className="w-5 h-5 text-ai-glow" />
            </h1>
            <p className="text-sm text-muted-foreground">
              Powered by configurable API endpoints
            </p>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-ai-secondary flex items-center justify-center mb-4">
              <Bot className="w-8 h-8 text-primary-foreground" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">Welcome to AI Chat</h2>
            <p className="text-muted-foreground max-w-md">
              Start a conversation with our AI engine. Your messages will be sent to the configured API endpoint.
            </p>
          </div>
        )}
        
        {messages.map(message => (
          <ChatMessage key={message.id} message={message} />
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center mr-3">
              <Bot className="w-4 h-4 text-primary-foreground" />
            </div>
            <div className="bg-chat-ai border border-border rounded-xl px-4 py-3 max-w-[70%]">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-ai-glow rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-ai-glow rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-ai-glow rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                </div>
                <span className="text-sm text-muted-foreground">AI is thinking...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
}

// Export responses for access from other components
export { Chat };
export const chatResponses = {};