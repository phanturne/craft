'use client';

import { UIMessage, useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useState } from 'react';

export default function Chat({
  id,
  initialMessages,
}: {
  id: string;
  initialMessages?: UIMessage[];
}) {
  const [input, setInput] = useState('');

  const { sendMessage, messages, status, stop } = useChat({
    id, // use the provided chat ID
    messages: initialMessages, // load initial messages
    transport: new DefaultChatTransport({
      api: '/api/chat',
    }),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && status !== 'streaming') {
      sendMessage({ text: input });
      setInput('');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="bg-background border-b border-border px-6 py-4">
        <h1 className="text-2xl font-bold text-foreground">AI Chat</h1>
        <p className="text-muted-foreground mt-1">Powered by DeepSeek Chat</p>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-muted-foreground mt-8">
            <div className="text-4xl mb-4">💬</div>
            <p className="text-lg">Start a conversation with AI</p>
            <p className="text-sm mt-2">Ask anything and get intelligent responses</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card border border-border text-card-foreground'
                }`}
              >
                <div className="whitespace-pre-wrap">
                  {message.parts
                    .map(part => (part.type === 'text' ? part.text : ''))
                    .join('')}
                </div>
              </div>
            </div>
          ))
        )}
        
        {status === 'streaming' && (
          <div className="flex justify-start">
            <div className="bg-card border border-border rounded-lg px-4 py-3">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-muted-foreground text-sm">AI is thinking...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Form */}
      <div className="bg-background border-t border-border px-6 py-4">
        <form onSubmit={handleSubmit} className="flex space-x-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 border border-input rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground placeholder:text-muted-foreground"
            disabled={status === 'streaming'}
          />
          <button
            type="submit"
            disabled={!input.trim() || status === 'streaming'}
            className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {status === 'streaming' ? 'Sending...' : 'Send'}
          </button>
          {status === 'streaming' && (
            <button
              type="button"
              onClick={stop}
              className="bg-destructive text-destructive-foreground px-6 py-3 rounded-lg font-medium hover:bg-destructive/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-colors"
            >
              Stop
            </button>
          )}
        </form>
      </div>
    </div>
  );
} 