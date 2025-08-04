import ChatError from '@/components/chat/ChatError';
import { createClient } from '@/lib/server';
import { ChatService } from '@/models/chats';
import { redirect } from 'next/navigation';

// Force dynamic rendering to prevent static generation issues
export const dynamic = 'force-dynamic';

export default async function ChatPage() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect('/signin');
  }

  // Create a new chat directly
  const chatId = crypto.randomUUID();
  
  try {
    const createdChat = await ChatService.createChat(supabase, {
      id: chatId,
      user_id: user.id,
      title: 'New Chat',
      visibility: 'private',
    });

    if (!createdChat) {
      return <ChatError error="Failed to create new chat - service returned null" />;
    }

  } catch (error) {
    return <ChatError error={`Failed to create new chat: ${error instanceof Error ? error.message : 'Unknown error'}`} />;
  }

  // Redirect after successful chat creation (outside try-catch to avoid catching redirect)
  redirect(`/chat/${chatId}`);
} 