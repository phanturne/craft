'use client'

import { useAuth } from '@/contexts/AuthContext'
import { usePoints } from '@/hooks/usePoints'
import { PointsDisplayProps } from '@/types/points'

export default function PointsDisplay({ 
  variant = 'compact', 
  showLabel = true,
  className = ''
}: PointsDisplayProps) {
  const { user } = useAuth()
  const { points, loading } = usePoints()

  if (!user) {
    return null
  }

  if (loading) {
    return (
      <div className={`flex items-center ${className}`}>
        <div className="animate-pulse bg-muted h-4 w-8 rounded"></div>
      </div>
    )
  }

  if (variant === 'compact') {
    return (
      <div className={`flex items-center space-x-1 ${className}`}>
        <span className="text-sm font-medium text-foreground">{points}</span>
        {showLabel && (
          <span className="text-xs text-muted-foreground">pts</span>
        )}
      </div>
    )
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className="flex items-center space-x-1">
        <span className="text-lg font-bold text-primary">{points}</span>
        {showLabel && (
          <span className="text-sm text-muted-foreground">points</span>
        )}
      </div>
    </div>
  )
} 