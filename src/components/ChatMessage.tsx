import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ExternalLink, Bot, User } from 'lucide-react';
import type { ChatMessage } from '@/services/aiService';

interface ChatMessageProps {
  message: ChatMessage;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.isUser;
  
  return (
    <div className={`flex gap-3 mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
          <Bot className="w-4 h-4 text-primary-foreground" />
        </div>
      )}
      
      <div className={`max-w-[70%] ${isUser ? 'order-first' : ''}`}>
        <div
          className={`rounded-xl px-4 py-3 ${
            isUser
              ? 'bg-chat-user text-primary-foreground ml-auto'
              : 'bg-chat-ai border border-border'
          }`}
          style={{
            boxShadow: 'var(--message-shadow)',
          }}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {message.content}
          </p>
          
          {!isUser && message.isHeavy && message.responseId && (
            <div className="mt-3 pt-3 border-t border-border/50">
              <Button variant="outline" size="sm" asChild>
                <Link to={`/response/${message.responseId}`} className="flex items-center gap-2">
                  <ExternalLink className="w-3 h-3" />
                  View Full Response
                </Link>
              </Button>
            </div>
          )}
        </div>
        
        <div className={`text-xs text-muted-foreground mt-1 ${isUser ? 'text-right' : 'text-left'}`}>
          {message.timestamp.toLocaleTimeString()}
        </div>
      </div>
      
      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent flex items-center justify-center">
          <User className="w-4 h-4 text-accent-foreground" />
        </div>
      )}
    </div>
  );
}