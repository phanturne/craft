import { Database } from '@/types/database'
import type { SupabaseClient } from '@supabase/supabase-js'

type Message = Database['public']['Tables']['messages']['Row']
type MessageInsert = Database['public']['Tables']['messages']['Insert']
type MessageUpdate = Database['public']['Tables']['messages']['Update']

export class MessageService {
  /**
   * Create a new message
   */
  static async createMessage(supabase: SupabaseClient<Database>, message: MessageInsert): Promise<Message | null> {
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert(message)
        .select()
        .single()

      if (error) {
        console.error('Error creating message:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Error creating message:', error)
      return null
    }
  }

  /**
   * Create multiple messages
   */
  static async createMessages(supabase: SupabaseClient<Database>, messages: MessageInsert[]): Promise<Message[]> {
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert(messages)
        .select()

      if (error) {
        console.error('Error creating messages:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Error creating messages:', error)
      return []
    }
  }

  /**
   * Get a message by ID
   */
  static async getMessageById(supabase: SupabaseClient<Database>, id: string): Promise<Message | null> {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        console.error('Error fetching message:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Error fetching message:', error)
      return null
    }
  }

  /**
   * Get messages by chat ID
   */
  static async getMessagesByChatId(
    supabase: SupabaseClient<Database>,
    chatId: string,
    options?: {
      limit?: number
      offset?: number
      orderBy?: 'created_at' | 'id'
      orderDirection?: 'asc' | 'desc'
    }
  ): Promise<Message[]> {
    try {
      let query = supabase
        .from('messages')
        .select('*')
        .eq('chat_id', chatId)

      const orderBy = options?.orderBy || 'created_at'
      const orderDirection = options?.orderDirection || 'asc'
      query = query.order(orderBy, { ascending: orderDirection === 'asc' })

      if (options?.offset !== undefined) {
        const limit = options?.limit || 50
        query = query.range(options.offset, options.offset + limit - 1)
      } else if (options?.limit) {
        query = query.limit(options.limit)
      }

      const { data, error } = await query

      if (error) {
        console.error('Error fetching messages:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Error fetching messages:', error)
      return []
    }
  }

  /**
   * Update a message
   */
  static async updateMessage(supabase: SupabaseClient<Database>, id: string, updates: MessageUpdate): Promise<Message | null> {
    try {
      const { data, error } = await supabase
        .from('messages')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Error updating message:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Error updating message:', error)
      return null
    }
  }

  /**
   * Delete a message
   */
  static async deleteMessage(supabase: SupabaseClient<Database>, id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting message:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error deleting message:', error)
      return false
    }
  }

  /**
   * Delete messages by chat ID
   */
  static async deleteMessagesByChatId(supabase: SupabaseClient<Database>, chatId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('chat_id', chatId)

      if (error) {
        console.error('Error deleting messages:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error deleting messages:', error)
      return false
    }
  }

  /**
   * Get message count by chat ID
   */
  static async getMessageCountByChatId(supabase: SupabaseClient<Database>, chatId: string): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('messages')
        .select('id', { count: 'exact' })
        .eq('chat_id', chatId)

      if (error) {
        console.error('Error counting messages:', error)
        return 0
      }

      return count || 0
    } catch (error) {
      console.error('Error counting messages:', error)
      return 0
    }
  }
} 