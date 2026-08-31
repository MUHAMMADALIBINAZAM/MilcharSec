# Supabase Auth setup

The static app reads the public Supabase project URL and anon key from these
browser globals, which must be defined before `src/auth/auth-gate.js` loads:

```html
<script>
  window.MILCHARSEC_SUPABASE_URL = 'https://your-project.supabase.co';
  window.MILCHARSEC_SUPABASE_ANON_KEY = 'your-public-anon-key';
</script>
```

The anon key is intended for browser use; never put a Supabase service-role key
in this file. In Supabase Authentication settings, keep email confirmation
disabled. Signup uses `signUp` and expects an active session immediately, then
the existing app starts. Sessions are persisted by Supabase Auth across refreshes.
