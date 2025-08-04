'use client';

import { createChat } from '@/lib/actions';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { mutate } from 'swr';

interface NewChatButtonProps {
  variant?: 'button' | 'link';
}

export default function NewChatButton({ variant = 'button' }: NewChatButtonProps) {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateChat = async () => {
    if (isCreating) return;
    
    setIsCreating(true);
    try {
      const chatId = crypto.randomUUID();
      const result = await createChat({
        id: chatId,
        title: 'New Chat',
        visibility: 'private',
      });

      if (result.success && result.data) {
        // Invalidate the chats cache to refresh the list
        mutate('chats');
        
        // Navigate to the new chat
        router.push(`/chat/${chatId}`);
      } else {
        console.error('Error creating chat:', result.error);
        // You could show a toast notification here
      }
    } catch (error) {
      console.error('Error creating chat:', error);
      // You could show a toast notification here
    } finally {
      setIsCreating(false);
    }
  };

  if (variant === 'link') {
    return (
      <button
        onClick={handleCreateChat}
        disabled={isCreating}
        className="text-foreground hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isCreating ? 'Creating...' : 'New Chat'}
      </button>
    );
  }

  return (
    <button
      onClick={handleCreateChat}
      disabled={isCreating}
      className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isCreating ? 'Creating...' : 'New Chat'}
    </button>
  );
} 