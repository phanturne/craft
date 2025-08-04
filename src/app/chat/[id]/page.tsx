import Chat from '@/components/chat/Chat';
import ChatError from '@/components/chat/ChatError';
import { createClient } from '@/lib/server';
import { ChatService } from '@/models/chats';
import { MessageService } from '@/models/messages';
import { UIMessage } from 'ai';
import { redirect } from 'next/navigation';

// Force dynamic rendering to prevent static generation issues
export const dynamic = 'force-dynamic';

export default async function ChatPage(props: { params: Promise<{ id: string }> }) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      redirect('/signin');
    }

    const { id } = await props.params;

    // Verify user owns this chat
    const chat = await ChatService.getChatById(supabase, id);
    if (!chat || chat.user_id !== user.id) {
      return <ChatError error="Chat not found or access denied" chatId={id} />;
    }

    // Load messages from database
    const messages = await MessageService.getMessagesByChatId(supabase, id, {
      orderBy: 'created_at',
      orderDirection: 'asc'
    });

    // Convert to UIMessage format
    const uiMessages = messages.map(msg => ({
      id: msg.id,
      role: msg.role as 'user' | 'assistant',
      parts: msg.parts as unknown as UIMessage['parts'],
    }));

    return <Chat id={id} initialMessages={uiMessages} />;
  } catch {
    const { id } = await props.params;
    return <ChatError error="Failed to load chat" chatId={id} />;
  }
} 