'use client'

import AwardPointsForm from '@/components/points/AwardPointsForm'
import { useAuth } from '@/contexts/AuthContext'
import { usePoints } from '@/hooks/usePoints'

export default function PointsPage() {
  const { user, loading: authLoading } = useAuth()
  const { points, userStats, loading, error } = usePoints()

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Sign In Required</h1>
          <p className="text-gray-600 mb-4">Please sign in to view your points</p>
          <a
            href="/signin"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Sign In
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Points</h1>
          <p className="text-gray-600">Track your progress and achievements</p>
        </div>

        {loading ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading your points...</p>
          </div>
        ) : error ? (
          <div className="text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-2 text-red-600 hover:text-red-800 underline"
              >
                Try again
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="text-center">
              <div className="mb-6">
                <div className="text-6xl font-bold text-blue-600 mb-2">
                  {points}
                </div>
                <div className="text-xl text-gray-600">Total Points</div>
              </div>

              {userStats && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm text-gray-500 mb-1">Member Since</div>
                    <div className="text-lg font-semibold text-gray-900">
                      {new Date(userStats.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm text-gray-500 mb-1">Last Updated</div>
                    <div className="text-lg font-semibold text-gray-900">
                      {new Date(userStats.updated_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              )}

              {(points === 0) && (
                <div className="mt-8 text-center">
                  <div className="text-gray-400 mb-4">
                    <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Points Yet</h3>
                  <p className="text-gray-600">Start earning points by participating in activities!</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Demo Points Awarding Form */}
        <div className="mt-8">
          <AwardPointsForm />
        </div>
      </div>
    </div>
  )
} 