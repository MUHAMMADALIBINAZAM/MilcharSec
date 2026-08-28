import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

export const SUPABASE_URL = 'https://cmoyutzhalwsmgozniew.supabase.co';
export const SUPABASE_ANON_KEY = 'sb_publishable_Lji83ZA1nIuLHyByNco1qA_k0PxTFgy';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});
