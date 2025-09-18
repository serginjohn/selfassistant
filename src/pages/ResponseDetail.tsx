import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Copy, Download, Bot } from 'lucide-react';
import { toast } from 'sonner';
import type { ApiResponse } from '@/config/api';

export default function ResponseDetail() {
  const { id } = useParams<{ id: string }>();
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, you might fetch from an API or local storage
    // For now, we'll simulate loading a response
    const timer = setTimeout(() => {
      setResponse({
        id: id || '',
        content: `This is a detailed response for ID: ${id}\n\nThis represents a heavy response that was too large to display in the chat interface. In a real implementation, this would contain the full API response data.\n\n${JSON.stringify(
          {
            timestamp: new Date().toISOString(),
            responseId: id,
            data: {
              message: "Full API response would be displayed here",
              metadata: {
                tokens: 1234,
                processingTime: "2.3s",
                model: "gpt-3.5-turbo"
              },
              fullResponse: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
            }
          },
          null,
          2
        )}`,
        isHeavy: true,
        metadata: {
          timestamp: new Date().toISOString(),
          size: '2.4 KB',
        },
      });
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [id]);

  const handleCopy = () => {
    if (response) {
      navigator.clipboard.writeText(response.content);
      toast.success('Response copied to clipboard');
    }
  };

  const handleDownload = () => {
    if (response) {
      const blob = new Blob([response.content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ai-response-${id}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Response downloaded');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-background/50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-ai-secondary flex items-center justify-center mb-4 mx-auto">
            <Bot className="w-8 h-8 text-primary-foreground animate-pulse" />
          </div>
          <p className="text-muted-foreground">Loading response details...</p>
        </div>
      </div>
    );
  }

  if (!response) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-background/50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-2">Response Not Found</h1>
          <p className="text-muted-foreground mb-4">
            The requested response could not be found.
          </p>
          <Button asChild>
            <Link to="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Chat
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" asChild>
            <Link to="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Chat
            </Link>
          </Button>
          
          <div className="flex-1">
            <h1 className="text-2xl font-semibold flex items-center gap-2">
              <Bot className="w-6 h-6 text-ai-glow" />
              Response Details
            </h1>
            <p className="text-muted-foreground">
              Response ID: {response.id}
            </p>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCopy}>
              <Copy className="w-4 h-4 mr-2" />
              Copy
            </Button>
            <Button variant="outline" onClick={handleDownload}>
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>
        </div>

        {/* Metadata */}
        {response.metadata && (
          <Card className="p-6 mb-6 bg-card/50 border border-border">
            <h2 className="text-lg font-semibold mb-4">Metadata</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {Object.entries(response.metadata).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="text-muted-foreground capitalize">
                    {key.replace(/([A-Z])/g, ' $1')}:
                  </span>
                  <span className="font-mono">{String(value)}</span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Response Content */}
        <Card className="p-6 bg-card/50 border border-border">
          <h2 className="text-lg font-semibold mb-4">Full Response</h2>
          <div className="bg-background/50 rounded-lg p-4 border border-border">
            <pre className="whitespace-pre-wrap text-sm leading-relaxed overflow-x-auto">
              {response.content}
            </pre>
          </div>
        </Card>
      </div>
    </div>
  );
}