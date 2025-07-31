import { Database } from './database'

// Use the existing database types
export type UserPoints = Database['public']['Tables']['user_points']['Row']
export type UserStats = Database['public']['Tables']['user_stats']['Row']

// Function types from database
export type AwardPointsArgs = Database['public']['Functions']['award_points']['Args']
export type AwardPointsReturn = Database['public']['Functions']['award_points']['Returns']
export type SyncUserPointsResult = Database['public']['Functions']['sync_user_points']['Returns'][0]

// Server action interface that maps to database function
export interface AwardPointsOptions {
  userId: string
  points: number
  category: string
  referenceId?: string
  referenceType?: string
  description?: string
  uniqueKey?: string
}

// Points display props
export interface PointsDisplayProps {
  variant?: 'compact' | 'detailed'
  showLabel?: boolean
  className?: string
} 