'use server';

import type { Database } from '@/types/database';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export const createClient = async () => {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    // biome-ignore lint: Forbidden non-null assertion.
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    // biome-ignore lint: Forbidden non-null assertion.
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
};

// Admin client that bypasses RLS
export const createAdminClient = async () => {
  return createServerClient<Database>(
    // biome-ignore lint: Forbidden non-null assertion.
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    // biome-ignore lint: Forbidden non-null assertion.
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() {
          return [];
        },
        setAll() {
          // No-op for admin client
        },
      },
    }
  );
};