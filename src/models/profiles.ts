import { createClient } from '@/lib/client'
import { Profile, ProfileUpdate } from '@/types/profiles'

const supabase = createClient()

export class ProfileService {
  /**
   * Fetch a user's profile by user ID
   */
  static async fetchProfile(userId: string): Promise<Profile | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error) {
        console.error('Error fetching profile:', error)
        return null
      }

      return data as Profile
    } catch (error) {
      console.error('Error fetching profile:', error)
      return null
    }
  }

  /**
   * Update a user's profile
   */
  static async updateProfile(userId: string, updates: ProfileUpdate): Promise<Profile | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', userId)
        .select()
        .single()

      if (error) {
        console.error('Error updating profile:', error)
        return null
      }

      return data as Profile
    } catch (error) {
      console.error('Error updating profile:', error)
      return null
    }
  }

  /**
   * Get profile by username
   */
  static async getProfileByUsername(username: string): Promise<Profile | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .single()

      if (error) {
        console.error('Error fetching profile by username:', error)
        return null
      }

      return data as Profile
    } catch (error) {
      console.error('Error fetching profile by username:', error)
      return null
    }
  }

  /**
   * Check if username is available
   */
  static async isUsernameAvailable(username: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username)
        .single()

      if (error && error.code === 'PGRST116') {
        // No rows returned - username is available
        return true
      }

      if (error) {
        console.error('Error checking username availability:', error)
        return false
      }

      // Username exists
      return false
    } catch (error) {
      console.error('Error checking username availability:', error)
      return false
    }
  }

  /**
   * Search profiles by display name or username
   */
  static async searchProfiles(query: string, limit: number = 10): Promise<Profile[]> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .or(`display_name.ilike.%${query}%,username.ilike.%${query}%`)
        .eq('status', 'active')
        .limit(limit)

      if (error) {
        console.error('Error searching profiles:', error)
        return []
      }

      return (data || []) as Profile[]
    } catch (error) {
      console.error('Error searching profiles:', error)
      return []
    }
  }
} 