import { supabase } from './supabase-client.js';

const app = document.getElementById('app');
const authView = document.getElementById('auth-view');
const authForm = document.getElementById('auth-form');
const authMessage = document.getElementById('auth-message');
const authTitle = document.getElementById('auth-title');
const authSubmit = document.getElementById('auth-submit');
const usernameField = document.getElementById('username-field');
const switchMode = document.getElementById('switch-auth-mode');
let mode = 'login';

const setMessage = (message = '', type = '') => {
  authMessage.textContent = message;
  authMessage.className = `auth-message ${type}`;
};

const showApp = (user) => {
  authView.classList.add('hidden');
  app.classList.remove('hidden');
  document.querySelector('[data-auth-email]').textContent = user?.email || '';
};

const showAuth = () => {
  app.classList.add('hidden');
  authView.classList.remove('hidden');
};

const setMode = (nextMode) => {
  mode = nextMode;
  const requesting = mode === 'request';
  authTitle.textContent = requesting ? 'Request access' : 'Welcome back';
  document.getElementById('auth-intro').textContent = requesting
    ? 'Create your learner account. An administrator will review your request before access is granted.'
    : 'Sign in to continue your cybersecurity learning journey.';
  usernameField.hidden = !requesting;
  usernameField.querySelector('input').required = requesting;
  authSubmit.textContent = requesting ? 'Submit access request' : 'Log in';
  switchMode.textContent = requesting ? 'Already have an account? Log in' : 'Need access? Request an account';
  setMessage();
};

const checkApproval = async (user) => {
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('approved')
    .eq('user_id', user.id)
    .maybeSingle();
  if (error) throw error;
  return profile?.approved === true;
};

authForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  setMessage();
  authSubmit.disabled = true;
  const email = authForm.elements.email.value.trim();
  const password = authForm.elements.password.value;
  const username = authForm.elements.username?.value.trim();
  try {
    if (mode === 'request') {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { username } }
      });
      if (error) throw error;
      if (data.user && data.session) {
        const { error: profileError } = await supabase.from('profiles').insert({
          user_id: data.user.id, username, email, approved: false,
          requested_at: new Date().toISOString()
        });
        // The auth.users trigger can win the race and create this same row first.
        if (profileError && profileError.code !== '23505') throw profileError;
        await supabase.auth.signOut();
      }
      authForm.reset();
      setMessage('Your request has been submitted and is pending approval.', 'success');
      setMode('login');
      setMessage('Your request has been submitted and is pending approval.', 'success');
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    if (!data.user || !(await checkApproval(data.user))) {
      await supabase.auth.signOut();
      setMessage('Your access request is still pending approval.', 'pending');
      return;
    }
    showApp(data.user);
  } catch (error) {
    setMessage(error.message || 'Something went wrong. Please try again.', 'error');
  } finally {
    authSubmit.disabled = false;
  }
});

switchMode.addEventListener('click', () => setMode(mode === 'login' ? 'request' : 'login'));
document.addEventListener('click', async (event) => {
  if (!event.target.closest('[data-auth-signout]')) return;
  await supabase.auth.signOut();
  showAuth();
  setMode('login');
});

supabase.auth.onAuthStateChange(async (event, session) => {
  if (event === 'SIGNED_OUT') { showAuth(); return; }
  if (!session?.user) { showAuth(); return; }
  try {
    if (await checkApproval(session.user)) showApp(session.user);
    else { await supabase.auth.signOut(); setMessage('Your access request is still pending approval.', 'pending'); }
  } catch (error) {
    await supabase.auth.signOut();
    setMessage(error.message || 'Could not verify your access. Please try again.', 'error');
  }
});

const { data: { session } } = await supabase.auth.getSession();
if (session?.user) {
  try {
    if (await checkApproval(session.user)) showApp(session.user);
    else { await supabase.auth.signOut(); setMessage('Your access request is still pending approval.', 'pending'); }
  } catch (error) { await supabase.auth.signOut(); setMessage(error.message, 'error'); }
} else showAuth();
