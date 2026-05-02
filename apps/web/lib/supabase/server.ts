import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Use mock when no Supabase credentials are configured
const useMock = !SUPABASE_URL || SUPABASE_URL.includes('your-project');

export async function createClient() {
  if (useMock) {
    const { createClient: createMock } = await import('./mock');
    return createMock();
  }

  const cookieStore = await cookies();
  return createServerClient(SUPABASE_URL!, SUPABASE_KEY!, {
    cookies: {
      getAll() { return cookieStore.getAll(); },
      setAll(cookiesToSet: { name: string; value: string; options?: any }[]) {
        cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
      },
    },
  });
}
