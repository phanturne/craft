import { createClient } from '@/lib/client'
import { Database } from '@/types/database'

type UserPoints = Database['public']['Tables']['user_points']['Row']
type UserStats = Database['public']['Tables']['user_stats']['Row']

const supabase = createClient()

export class PointsService {
  /**
   * Award points to a user using the database function
   */
  static async awardPoints(
    userId: string,
    points: number,
    category: string,
    options?: {
      referenceId?: string
      referenceType?: string
      description?: string
      uniqueKey?: string
    }
  ): Promise<string | null> {
    try {
      const { data, error } = await supabase.rpc('award_points', {
        p_user_id: userId,
        p_points: points,
        p_category: category,
        p_reference_id: options?.referenceId || undefined,
        p_reference_type: options?.referenceType || undefined,
        p_description: options?.description || undefined,
        p_unique_key: options?.uniqueKey || undefined
      })

      if (error) {
        console.error('Error awarding points:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Error awarding points:', error)
      return null
    }
  }

  /**
   * Get user's total points
   */
  static async getUserStats(userId: string): Promise<UserStats | null> {
    try {
      const { data, error } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error) {
        console.error('Error fetching user stats:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Error fetching user stats:', error)
      return null
    }
  }

  /**
   * Get user's point history
   */
  static async getUserPoints(
    userId: string,
    options?: {
      limit?: number
      offset?: number
      category?: string
    }
  ): Promise<UserPoints[]> {
    try {
      let query = supabase
        .from('user_points')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (options?.category) {
        query = query.eq('points_category', options.category)
      }

      if (options?.offset !== undefined) {
        const limit = options?.limit || 50
        query = query.range(options.offset, options.offset + limit - 1)
      } else if (options?.limit) {
        query = query.limit(options.limit)
      }

      const { data, error } = await query

      if (error) {
        console.error('Error fetching user points:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Error fetching user points:', error)
      return []
    }
  }

  /**
   * Get leaderboard (top users by points)
   */
  static async getLeaderboard(limit: number = 10): Promise<UserStats[]> {
    try {
      const { data, error } = await supabase
        .from('user_stats')
        .select(`
          *,
          profiles!inner(
            username,
            display_name,
            avatar_url
          )
        `)
        .order('total_points', { ascending: false })
        .limit(limit)

      if (error) {
        console.error('Error fetching leaderboard:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Error fetching leaderboard:', error)
      return []
    }
  }

  /**
   * Sync all user points (admin function)
   */
  static async syncAllPoints(): Promise<{ syncedUsers: number; errors: number } | null> {
    try {
      const { data, error } = await supabase.rpc('sync_user_points')

      if (error) {
        console.error('Error syncing points:', error)
        return null
      }

      // Transform the database response to match the expected interface
      if (data && data.length > 0) {
        const result = data[0]
        return {
          syncedUsers: result.synced_users,
          errors: result.errors
        }
      }

      return null
    } catch (error) {
      console.error('Error syncing points:', error)
      return null
    }
  }

  /**
   * Get points by category for a user
   */
  static async getPointsByCategory(userId: string): Promise<Record<string, number>> {
    try {
      const { data, error } = await supabase
        .from('user_points')
        .select('points_category, points')
        .eq('user_id', userId)

      if (error) {
        console.error('Error fetching points by category:', error)
        return {}
      }

      const categoryTotals: Record<string, number> = {}
      data?.forEach(point => {
        categoryTotals[point.points_category] = (categoryTotals[point.points_category] || 0) + point.points
      })

      return categoryTotals
    } catch (error) {
      console.error('Error fetching points by category:', error)
      return {}
    }
  }
} 