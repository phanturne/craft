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
        <div className="animate-pulse bg-gray-200 h-4 w-8 rounded"></div>
      </div>
    )
  }

  if (variant === 'compact') {
    return (
      <div className={`flex items-center space-x-1 ${className}`}>
        <span className="text-sm font-medium text-gray-900">{points}</span>
        {showLabel && (
          <span className="text-xs text-gray-500">pts</span>
        )}
      </div>
    )
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className="flex items-center space-x-1">
        <span className="text-lg font-bold text-blue-600">{points}</span>
        {showLabel && (
          <span className="text-sm text-gray-600">points</span>
        )}
      </div>
    </div>
  )
} 