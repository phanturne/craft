# Supabase Authentication Setup

This project includes Supabase authentication with Next.js App Router and Server-Side Rendering (SSR) support. Follow these steps to complete the setup:

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Create a new project
3. Wait for the project to be set up

## 2. Get Your Project Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy your **Project URL** and **anon/public key**

## 3. Set Up Environment Variables

Create a `.env.local` file in your project root and add:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url-here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

Replace the values with your actual Supabase project credentials.

## 4. Configure Authentication

1. In your Supabase dashboard, go to **Authentication** → **Settings**
2. Configure your site URL (e.g., `http://localhost:3000` for development)
3. Add any additional redirect URLs if needed

## 5. Enable Email Authentication

1. In your Supabase dashboard, go to **Authentication** → **Providers**
2. Make sure **Email** provider is enabled
3. Configure email templates if desired

## 6. Generate TypeScript Types (Optional)

If you have the Supabase CLI installed, you can generate TypeScript types for your database:

```bash
npx supabase gen types typescript --project-id your-project-id > src/types/database.ts
```

## 7. Run the Application

```bash
pnpm dev
```

## Features Included

- **SSR Support**: Both client and server-side Supabase clients for optimal performance
- **Sign Up**: Users can create new accounts with email/password (email confirmation required)
- **Sign In**: Users can sign in with existing credentials
- **User Profile**: Display user information and sign out functionality
- **Protected Routes**: Authentication state management with automatic redirects
- **Loading States**: Proper loading indicators during auth operations
- **Error Handling**: User-friendly error messages
- **Dark Mode Support**: UI components support both light and dark themes
- **Responsive Design**: Mobile-friendly authentication forms

## File Structure

```
src/
├── lib/
│   ├── client.ts          # Browser-side Supabase client
│   └── server.ts          # Server-side Supabase client with SSR
├── contexts/
│   └── AuthContext.tsx    # Authentication context provider
├── components/
│   └── auth/
│       ├── AuthForm.tsx   # Sign in/up form component
│       └── UserProfile.tsx # User profile component
├── types/
│   └── database.ts        # Generated TypeScript types
└── app/
    ├── layout.tsx         # Root layout with AuthProvider
    ├── page.tsx           # Main page with auth UI
    ├── signin/
    │   └── page.tsx       # Sign in page
    └── signup/
        └── page.tsx       # Sign up page
```

## Key Implementation Details

### SSR Setup
- Uses `@supabase/ssr` package for proper server-side rendering
- Separate client and server Supabase instances
- Cookie-based session management

### Authentication Flow
1. **Sign Up**: Users enter email/password → confirmation email sent → account activated
2. **Sign In**: Users enter credentials → redirected to home page if successful
3. **Session Management**: Automatic session persistence and state synchronization
4. **Protected Routes**: Automatic redirects for authenticated/unauthenticated users

### UI Components
- **AuthForm**: Handles both sign in and sign up with mode prop
- **UserProfile**: Displays user information and sign out button
- **Loading States**: Spinner animations during authentication operations
- **Error Handling**: Toast-style error messages for failed operations
- **Success Messages**: Email confirmation instructions for new signups

## Dependencies

The following Supabase-related dependencies are required:

```json
{
  "@supabase/ssr": "^0.6.1",
  "@supabase/supabase-js": "^2.52.1"
}
```

For development and type generation, you may also want:

```json
{
  "supabase": "^2.31.8"
}
```

## Usage

The authentication is now fully integrated into your app. Users can:

1. **Sign up** with email and password (requires email confirmation)
2. **Sign in** with existing credentials
3. **View their profile** information including email, creation date, and user ID
4. **Sign out** from their account

The authentication state is managed globally through the `AuthContext` and can be accessed in any component using the `useAuth` hook:

```typescript
import { useAuth } from '@/contexts/AuthContext'

function MyComponent() {
  const { user, loading, signIn, signUp, signOut } = useAuth()
  
  if (loading) return <div>Loading...</div>
  
  return user ? (
    <div>Welcome, {user.email}!</div>
  ) : (
    <div>Please sign in</div>
  )
}
```

## Next Steps

After setting up authentication, you can:

1. Add more authentication providers (Google, GitHub, etc.)
2. Implement role-based access control
3. Add user profile management features
4. Create protected API routes
5. Set up database tables and Row Level Security (RLS)