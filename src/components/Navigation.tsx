'use client';

import { useAuth } from '@/contexts/AuthContext';
import { createClient } from '@/lib/client';
import Link from 'next/link';
import NewChatButton from './chat/NewChatButton';

export default function Navigation() {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    signOut();
  };

  return (
    <nav className="bg-background border-b border-border px-6 py-4">
      <div className="container mx-auto max-w-4xl flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <Link href="/" className="text-xl font-bold text-foreground">
            AI Chat
          </Link>
          {user && (
            <div className="flex items-center space-x-4">
              <NewChatButton variant="link" />
              <Link
                href="/profile"
                className="text-foreground hover:text-primary transition-colors"
              >
                Profile
              </Link>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                {user.email}
              </span>
              <button
                onClick={handleSignOut}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link
                href="/signin"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
} 