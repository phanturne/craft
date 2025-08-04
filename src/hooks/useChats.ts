import { createClient } from '@/lib/client';
import { ChatService } from '@/models/chats';
import { Database } from '@/types/database';
import useSWR from 'swr';

type Chat = Database['public']['Tables']['chats']['Row'];

const fetcher = async (): Promise<Chat[]> => {
  const supabase = createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error('User not authenticated');
  }

  return ChatService.getChatsByUserId(supabase, user.id);
};

export function useChats() {
  const { data: chats, error, isLoading, mutate } = useSWR<Chat[]>(
    'chats',
    fetcher,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      refreshInterval: 0, // Disable auto-refresh, only refresh on focus/reconnect
    }
  );

  return {
    chats: chats || [],
    error,
    isLoading,
    mutate, // Function to manually revalidate
  };
} 