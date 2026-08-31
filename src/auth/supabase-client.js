import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// The publishable anon key is intended for browser use. Row Level Security
// policies protect Supabase data; this key is not a service-role secret.
const url = 'https://cmoyutzhalwsmgozniew.supabase.co';
const anonKey = 'sb_publishable_Lji83ZA1nIuLHyByNco1qA_k0PxTFgy';

export const supabase = createClient(url, anonKey, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
});
