'use server'

import { createAdminClient } from '@/lib/server';
import { AwardPointsOptions, AwardPointsReturn, UserStats } from '@/types/points';
import { revalidatePath } from 'next/cache';

/**
 * Server action to award points to a user
 * This uses the admin client to bypass RLS policies
 */
export async function awardPoints(options: AwardPointsOptions): Promise<{ success: boolean; data?: AwardPointsReturn; error?: string }> {
  try {
    const supabase = await createAdminClient()
    
    const { data, error } = await supabase.rpc('award_points', {
      p_user_id: options.userId,
      p_points: options.points,
      p_category: options.category,
      p_reference_id: options.referenceId || undefined,
      p_reference_type: options.referenceType || undefined,
      p_description: options.description || undefined,
      p_unique_key: options.uniqueKey || undefined
    })

    if (error) {
      console.error('Error awarding points:', error)
      return { success: false, error: error.message }
    }

    // Revalidate the points page and home page to show updated points
    revalidatePath('/points')
    revalidatePath('/')

    return { success: true, data }
  } catch (error) {
    console.error('Error in awardPoints action:', error)
    return { success: false, error: 'Failed to award points' }
  }
}

/**
 * Server action to get user stats (for server-side operations)
 */
export async function getUserStats(userId: string): Promise<{ success: boolean; data?: UserStats; error?: string }> {
  try {
    const supabase = await createAdminClient()
    
    const { data, error } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error) {
      console.error('Error fetching user stats:', error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Error in getUserStats action:', error)
    return { success: false, error: 'Failed to fetch user stats' }
  }
}

/**
 * Server action to sync all user points (admin function)
 */
export async function syncAllPoints(): Promise<{ success: boolean; data?: { syncedUsers: number; errors: number }; error?: string }> {
  try {
    const supabase = await createAdminClient()
    
    const { data, error } = await supabase.rpc('sync_user_points')

    if (error) {
      console.error('Error syncing points:', error)
      return { success: false, error: error.message }
    }

    // Transform the database response
    if (data && data.length > 0) {
      const result = data[0]
      return {
        success: true,
        data: {
          syncedUsers: result.synced_users,
          errors: result.errors
        }
      }
    }

    return { success: false, error: 'No data returned from sync' }
  } catch (error) {
    console.error('Error in syncAllPoints action:', error)
    return { success: false, error: 'Failed to sync points' }
  }
} 