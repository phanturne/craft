'use client'

import { UserProfile } from '@/components/auth/UserProfile'
import PointsDisplay from '@/components/points/PointsDisplay'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'

export default function Home() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className="w-full max-w-4xl">
        <h1 className="text-4xl font-bold text-center mb-8">
          Welcome to Craft
        </h1>
        
        {user ? (
          <div>
            <div className="text-center mb-8">
              <p className="text-lg text-gray-600">
                You are signed in as <span className="font-semibold">{user.email}</span>
              </p>
              <div className="mt-4">
                <PointsDisplay variant="detailed" />
              </div>
            </div>
            <div className="flex justify-center mb-8">
              <Link
                href="/points"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                View Points Details
              </Link>
            </div>
            <UserProfile />
          </div>
        ) : (
          <div className="text-center">
            <div className="max-w-md mx-auto">
              <h2 className="text-2xl font-semibold mb-4 dark:text-white">Get Started</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                Sign in to your account or create a new one to start using Craft.
              </p>
              <div className="space-y-4">
                <Link
                  href="/signin"
                  className="block w-full bg-blue-600 dark:bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors font-medium"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="block w-full bg-green-600 dark:bg-green-500 text-white py-3 px-6 rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors font-medium"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
