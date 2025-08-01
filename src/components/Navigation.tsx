'use client'

import PointsDisplay from '@/components/points/PointsDisplay'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'

export default function Navigation() {
  const { user, signOut } = useAuth()

  if (!user) {
    return null
  }

  return (
    <nav className="bg-background shadow-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-xl font-bold text-foreground">
              Craft
            </Link>
            <div className="hidden md:flex items-center space-x-6">
              <Link
                href="/chat"
                className="text-muted-foreground hover:text-foreground px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Chat
              </Link>
              <Link
                href="/points"
                className="text-muted-foreground hover:text-foreground px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Points
              </Link>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-muted px-3 py-1 rounded-lg">
              <span className="text-sm text-muted-foreground">Points:</span>
              <PointsDisplay variant="compact" showLabel={false} />
            </div>
            <button
              onClick={() => signOut()}
              className="text-muted-foreground hover:text-foreground px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
} 