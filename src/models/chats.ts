import { Database } from '@/types/database'
import type { SupabaseClient } from '@supabase/supabase-js'

type Chat = Database['public']['Tables']['chats']['Row']
type ChatInsert = Database['public']['Tables']['chats']['Insert']
type ChatUpdate = Database['public']['Tables']['chats']['Update']

export class ChatService {
  /**
   * Create a new chat
   */
  static async createChat(supabase: SupabaseClient<Database>, chat: ChatInsert): Promise<Chat | null> {
    try {
      // First, try to insert the chat
      const { error: insertError } = await supabase
        .from('chats')
        .insert(chat);

      if (insertError) {
        console.error('Error inserting chat:', insertError);
        return null;
      }

      // Then, fetch the created chat
      if (!chat.id) {
        console.error('No chat ID provided');
        return null;
      }
      
      const { data, error: selectError } = await supabase
        .from('chats')
        .select('*')
        .eq('id', chat.id)
        .single();

      if (selectError) {
        console.error('Error fetching created chat:', selectError);
        // Even if we can't fetch it, the chat was created
        // Return null to indicate the operation failed
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error creating chat:', error);
      return null;
    }
  }

  /**
   * Get a chat by ID
   */
  static async getChatById(supabase: SupabaseClient<Database>, id: string): Promise<Chat | null> {
    try {
      const { data, error } = await supabase
        .from('chats')
        .select('*')
        .eq('id', id)
        .maybeSingle()

      if (error) {
        console.error('Error fetching chat:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Error fetching chat:', error)
      return null
    }
  }

  /**
   * Get chats by user ID
   */
  static async getChatsByUserId(
    supabase: SupabaseClient<Database>,
    userId: string,
    options?: {
      limit?: number
      offset?: number
      visibility?: 'public' | 'private'
    }
  ): Promise<Chat[]> {
    try {
      let query = supabase
        .from('chats')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })

      if (options?.visibility) {
        query = query.eq('visibility', options.visibility)
      }

      if (options?.offset !== undefined) {
        const limit = options?.limit || 50
        query = query.range(options.offset, options.offset + limit - 1)
      } else if (options?.limit) {
        query = query.limit(options.limit)
      }

      const { data, error } = await query

      if (error) {
        console.error('Error fetching chats:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Error fetching chats:', error)
      return []
    }
  }

  /**
   * Get public chats
   */
  static async getPublicChats(
    supabase: SupabaseClient<Database>,
    options?: {
      limit?: number
      offset?: number
    }
  ): Promise<Chat[]> {
    try {
      let query = supabase
        .from('chats')
        .select('*')
        .eq('visibility', 'public')
        .order('created_at', { ascending: false })

      if (options?.offset !== undefined) {
        const limit = options?.limit || 50
        query = query.range(options.offset, options.offset + limit - 1)
      } else if (options?.limit) {
        query = query.limit(options.limit)
      }

      const { data, error } = await query

      if (error) {
        console.error('Error fetching public chats:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Error fetching public chats:', error)
      return []
    }
  }

  /**
   * Update a chat
   */
  static async updateChat(supabase: SupabaseClient<Database>, id: string, updates: ChatUpdate): Promise<Chat | null> {
    try {
      const { data, error } = await supabase
        .from('chats')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Error updating chat:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Error updating chat:', error)
      return null
    }
  }

  /**
   * Delete a chat
   */
  static async deleteChat(supabase: SupabaseClient<Database>, id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('chats')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting chat:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error deleting chat:', error)
      return false
    }
  }


} 