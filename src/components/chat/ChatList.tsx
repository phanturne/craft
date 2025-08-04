'use client';

import { useChats } from '@/hooks/useChats';
import { deleteChat } from '@/lib/actions';
import Link from 'next/link';
import NewChatButton from './NewChatButton';

export default function ChatList() {
  const { chats, error, isLoading, mutate } = useChats();

  const handleDeleteChat = async (chatId: string) => {
    try {
      const result = await deleteChat(chatId);
      
      if (result.success) {
        // Revalidate the chats list after successful deletion
        mutate();
      } else {
        console.error('Error deleting chat:', result.error);
      }
    } catch (error) {
      console.error('Error deleting chat:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-12 bg-muted rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="text-center text-destructive">
          <p>Error loading chats: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-2">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">Your Chats</h2>
        <NewChatButton />
      </div>
      
      {chats.length === 0 ? (
        <div className="text-center text-muted-foreground py-8">
          <div className="text-4xl mb-4">💬</div>
          <p className="text-lg">No chats yet</p>
          <p className="text-sm mt-2">Start a new conversation to get started</p>
        </div>
      ) : (
        <div className="space-y-2">
          {chats.map((chat) => (
            <div
              key={chat.id}
              className="flex items-center justify-between p-3 bg-card border border-border rounded-lg hover:bg-accent transition-colors"
            >
              <Link
                href={`/chat/${chat.id}`}
                className="flex-1 min-w-0"
              >
                <div className="truncate text-foreground font-medium">
                  {chat.title}
                </div>
                <div className="text-sm text-muted-foreground">
                  {new Date(chat.updated_at).toLocaleDateString()}
                </div>
              </Link>
              <button
                onClick={() => handleDeleteChat(chat.id)}
                className="ml-2 p-2 text-muted-foreground hover:text-destructive transition-colors"
                title="Delete chat"
              >
                🗑️
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 