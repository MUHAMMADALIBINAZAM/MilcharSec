# Supabase Auth setup

The static app initializes Supabase directly in `src/auth/supabase-client.js`.
No build-time environment variables are required.

The anon key is intended for browser use; never put a Supabase service-role key
in this file. In Supabase Authentication settings, keep email confirmation
disabled. Signup uses `signUp` and expects an active session immediately, then
the existing app starts. Sessions are persisted by Supabase Auth across refreshes.
