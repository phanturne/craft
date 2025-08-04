'use server'

import { createClient } from '@/lib/server';
import { ChatService } from '@/models/chats';
import { Database } from '@/types/database';
import { revalidatePath } from 'next/cache';

type ChatInsert = Database['public']['Tables']['chats']['Insert']
type ChatUpdate = Database['public']['Tables']['chats']['Update']
type Chat = Database['public']['Tables']['chats']['Row']

// Type for creating chats without user_id (added server-side)
type CreateChatInput = Omit<ChatInsert, 'user_id'>

/**
 * Server action to delete a chat
 * This handles authentication and authorization server-side
 */
export async function deleteChat(chatId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    
    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: 'Unauthorized' };
    }

    // Verify user owns this chat
    const chat = await ChatService.getChatById(supabase, chatId);
    if (!chat || chat.user_id !== user.id) {
      return { success: false, error: 'Chat not found or access denied' };
    }

    // Delete the chat
    const success = await ChatService.deleteChat(supabase, chatId);
    
    if (!success) {
      return { success: false, error: 'Failed to delete chat' };
    }

    // Revalidate relevant paths
    revalidatePath('/chat');
    revalidatePath('/');

    return { success: true };
  } catch (error) {
    console.error('Error in deleteChat action:', error);
    return { success: false, error: 'Failed to delete chat' };
  }
}

/**
 * Server action to create a new chat
 */
export async function createChat(chat: CreateChatInput): Promise<{ success: boolean; data?: Chat; error?: string }> {
  try {
    const supabase = await createClient();
    
    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: 'Unauthorized' };
    }

    // Ensure the chat belongs to the current user
    const chatWithUserId = { ...chat, user_id: user.id };
    
    const createdChat = await ChatService.createChat(supabase, chatWithUserId);
    
    if (!createdChat) {
      return { success: false, error: 'Failed to create chat' };
    }

    // Revalidate relevant paths
    revalidatePath('/chat');
    revalidatePath('/');

    return { success: true, data: createdChat };
  } catch (error) {
    console.error('Error in createChat action:', error);
    return { success: false, error: 'Failed to create chat' };
  }
}

/**
 * Server action to update a chat
 */
export async function updateChat(chatId: string, updates: ChatUpdate): Promise<{ success: boolean; data?: Chat; error?: string }> {
  try {
    const supabase = await createClient();
    
    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: 'Unauthorized' };
    }

    // Verify user owns this chat
    const chat = await ChatService.getChatById(supabase, chatId);
    if (!chat || chat.user_id !== user.id) {
      return { success: false, error: 'Chat not found or access denied' };
    }

    const updatedChat = await ChatService.updateChat(supabase, chatId, updates);
    
    if (!updatedChat) {
      return { success: false, error: 'Failed to update chat' };
    }

    // Revalidate relevant paths
    revalidatePath('/chat');
    revalidatePath(`/chat/${chatId}`);

    return { success: true, data: updatedChat };
  } catch (error) {
    console.error('Error in updateChat action:', error);
    return { success: false, error: 'Failed to update chat' };
  }
} 