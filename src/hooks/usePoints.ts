import { useAuth } from '@/contexts/AuthContext'
import { PointsService } from '@/models/points'
import { UserStats } from '@/types/points'
import { useCallback, useEffect, useState } from 'react'

export function usePoints() {
  const { user } = useAuth()
  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchUserStats = useCallback(async () => {
    if (!user) {
      setUserStats(null)
      return
    }

    try {
      setLoading(true)
      setError(null)
      const stats = await PointsService.getUserStats(user.id)
      setUserStats(stats)
    } catch (err) {
      console.error('Error fetching user stats:', err)
      setError('Failed to load points')
    } finally {
      setLoading(false)
    }
  }, [user])

  const refreshPoints = useCallback(() => {
    fetchUserStats()
  }, [fetchUserStats])

  useEffect(() => {
    fetchUserStats()
  }, [fetchUserStats])

  return {
    points: userStats?.total_points || 0,
    userStats,
    loading,
    error,
    refreshPoints
  }
} 