export const SUPABASE_URL = 'https://cmoyutzhalwsmgozniew.supabase.co';
export const SUPABASE_ANON_KEY = 'sb_publishable_Lji83ZA1nIuLHyByNco1qA_k0PxTFgy';

const supabaseLibrary = window.supabase;
if (!supabaseLibrary?.createClient) {
  throw new Error('Supabase could not be loaded. Check your internet connection and reload the page.');
}

export const supabase = supabaseLibrary.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});
