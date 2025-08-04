import { createClient } from '@/lib/server';
import { ChatService } from '@/models/chats';
import { MessageService } from '@/models/messages';
import { Database } from '@/types/database';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { convertToModelMessages, streamText, UIMessage } from 'ai';

type Json = Database['public']['Tables']['messages']['Row']['parts'];

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages, id: chatId }: { messages: UIMessage[]; id: string } = body;

    if (!messages || !Array.isArray(messages) || !chatId) {
      return new Response('Invalid request body', { status: 400 });
    }

    // Verify user owns this chat
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return new Response('Unauthorized', { status: 401 });
    }

    const chat = await ChatService.getChatById(supabase, chatId);
    if (!chat || chat.user_id !== user.id) {
      return new Response('Forbidden', { status: 403 });
    }

    const result = streamText({
      model: openrouter.chat('deepseek/deepseek-chat-v3-0324:free'),
      messages: convertToModelMessages(messages),
    });

    return result.toUIMessageStreamResponse({
      originalMessages: messages,
      onFinish: async ({ messages }) => {
        try {
          // Convert UIMessages to database format with proper UUIDs
          const messageInserts = messages.map(msg => ({
            id: crypto.randomUUID(),
            chat_id: chatId,
            role: msg.role,
            parts: msg.parts as unknown as Json,
            created_at: new Date().toISOString(),
          }));

          await MessageService.createMessages(supabase, messageInserts);

          // Update chat title if it's still the default
          if (chat.title === 'New Chat' && messages.length > 0) {
            const firstUserMessage = messages.find(m => m.role === 'user');
            if (firstUserMessage) {
              const textPart = firstUserMessage.parts.find(part => part.type === 'text');
              const title = textPart?.text?.substring(0, 50) || 'New Chat';
              await ChatService.updateChat(supabase, chatId, { title });
            }
          }
        } catch (error) {
          console.error('Error saving messages:', error);
        }
      },
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response('Internal server error', { status: 500 });
  }
}