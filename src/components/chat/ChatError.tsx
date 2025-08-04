'use client';

import Link from 'next/link';

interface ChatErrorProps {
  error: string;
  chatId?: string;
}

export default function ChatError({ error, chatId }: ChatErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-4">⚠️</div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Something went wrong</h1>
        <p className="text-muted-foreground mb-6">{error}</p>
        <div className="space-y-3">
          <Link
            href="/"
            className="block w-full bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Go Home
          </Link>
          {chatId && (
            <Link
              href="/chat"
              className="block w-full bg-secondary text-secondary-foreground px-6 py-3 rounded-lg font-medium hover:bg-secondary/90 transition-colors"
            >
              Start New Chat
            </Link>
          )}
        </div>
      </div>
    </div>
  );
} 