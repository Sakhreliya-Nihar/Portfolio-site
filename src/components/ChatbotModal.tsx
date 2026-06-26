'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Terminal, Minimize2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MarkdownRenderer } from '@/components/ui/markdown-renderer';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function ChatbotModal() {
  const [isOpen, setIsOpen] = useState(true);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi! I'm Nihar's AI assistant. Feel free to ask me anything about his experience, skills, education, or projects!"
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: updatedMessages.map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      setMessages([...updatedMessages, { role: 'assistant', content: data.message }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages([...updatedMessages, {
        role: 'assistant',
        content: 'ERROR: Connection failed. Please try again.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 md:bottom-6 md:right-6 h-12 w-12 flex items-center justify-center border border-terminal-green bg-[#090b09] text-terminal-green hover:bg-terminal-surface transition-colors z-50 glow-green"
        aria-label="Open chat"
      >
        <Terminal size={20} />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-[calc(100vw-2rem)] max-w-96 h-[calc(100vh-2rem)] max-h-[600px] md:bottom-6 md:right-6 flex flex-col z-50 border border-terminal-green bg-[#090b09] overflow-hidden glow-green panel-enter">
      {/* Title bar */}
      <div className="shrink-0 flex items-center justify-between px-3 py-2 border-b border-terminal-border bg-[#0a0d0a]">
        <div className="flex items-center gap-2">
          <Terminal className="h-3.5 w-3.5 text-terminal-green" />
          <span className="text-xs text-terminal-green font-bold">nihar-ai</span>
          <span className="text-[10px] text-muted-foreground">v1.0</span>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-muted-foreground hover:text-terminal-green transition-colors p-1"
          aria-label="Minimize chat"
        >
          <Minimize2 className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 h-full">
        <div className="space-y-3 p-4">
          {messages.map((message, index) => (
            <div key={index}>
              {message.role === 'user' ? (
                <div className="flex items-start gap-2">
                  <span className="text-terminal-amber text-xs shrink-0 pt-0.5">$</span>
                  <p className="text-xs text-foreground">{message.content}</p>
                </div>
              ) : (
                <div className="text-xs text-muted-foreground pl-4 border-l border-terminal-border">
                  <MarkdownRenderer content={message.content} />
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="pl-4 border-l border-terminal-border">
              <span className="text-xs text-terminal-green">processing</span>
              <span className="text-xs text-terminal-green cursor-blink">_</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="shrink-0 border-t border-terminal-border p-3">
        <div className="flex items-center gap-2">
          <span className="text-terminal-green text-xs shrink-0">$</span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="ask about nihar..."
            disabled={isLoading}
            className="flex-1 bg-transparent text-xs text-foreground placeholder:text-muted-foreground outline-none"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="text-muted-foreground hover:text-terminal-green disabled:opacity-30 transition-colors"
            aria-label="Send message"
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
