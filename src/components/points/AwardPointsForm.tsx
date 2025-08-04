'use client'

import { useAuth } from '@/contexts/AuthContext'
import { usePoints } from '@/hooks/usePoints'
import { awardPoints } from '@/lib/actions'
import { useState } from 'react'

export default function AwardPointsForm() {
  const { user } = useAuth()
  const { refreshPoints } = usePoints()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleAwardPoints = async (points: number, category: string, description: string) => {
    if (!user) return

    setLoading(true)
    setMessage(null)

    try {
      const result = await awardPoints({
        userId: user.id,
        points,
        category,
        description,
        uniqueKey: `${category}-${Date.now()}` // Ensure uniqueness
      })

      if (result.success) {
        setMessage({ type: 'success', text: `Awarded ${points} points for ${description}!` })
        // Refresh the points display
        refreshPoints()
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to award points' })
      }
    } catch {
      setMessage({ type: 'error', text: 'An unexpected error occurred' })
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return null
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Award Points (Demo)</h3>
      
      {message && (
        <div className={`mb-4 p-3 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-700' 
            : 'bg-red-50 border border-red-200 text-red-700'
        }`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => handleAwardPoints(10, 'demo', 'Demo activity')}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Awarding...' : 'Award 10 Points'}
        </button>

        <button
          onClick={() => handleAwardPoints(25, 'bonus', 'Bonus points')}
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Awarding...' : 'Award 25 Points'}
        </button>

        <button
          onClick={() => handleAwardPoints(50, 'achievement', 'Achievement unlocked')}
          disabled={loading}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Awarding...' : 'Award 50 Points'}
        </button>

        <button
          onClick={() => handleAwardPoints(100, 'milestone', 'Milestone reached')}
          disabled={loading}
          className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Awarding...' : 'Award 100 Points'}
        </button>
      </div>

      <p className="text-sm text-gray-600 mt-4">
        These are demo buttons to test the points system. In a real application, 
        points would be awarded based on user actions and achievements.
      </p>
    </div>
  )
} 