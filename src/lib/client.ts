import type { Database } from '@/types/database';
import { createBrowserClient } from '@supabase/ssr';

export const createClient = () =>
  createBrowserClient<Database>(
    // biome-ignore lint: Forbidden non-null assertion.
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    // biome-ignore lint: Forbidden non-null assertion.
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );