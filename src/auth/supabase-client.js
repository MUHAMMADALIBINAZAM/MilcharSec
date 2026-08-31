import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// The Supabase anon key is safe to expose in a browser. Set these values in the
// deployment HTML (or replace the placeholders for a static deployment).
const url = window.MILCHARSEC_SUPABASE_URL || '';
const anonKey = window.MILCHARSEC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(url && anonKey);
export const supabase = isSupabaseConfigured ? createClient(url, anonKey, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
}) : null;
