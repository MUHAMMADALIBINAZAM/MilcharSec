import { supabase } from './supabase-client.js';

const AUTH_LOG = '[MilcharSec auth]';
const log = (...args) => console.info(AUTH_LOG, ...args);
const warn = (...args) => console.warn(AUTH_LOG, ...args);
const logError = (step, error) => console.error(`${AUTH_LOG} ${step} failed`, {
  message: error?.message || String(error),
  code: error?.code,
  details: error?.details,
  hint: error?.hint
});

const app = document.getElementById('app');
const authView = document.getElementById('auth-view');
const authForm = document.getElementById('auth-form');
const authMessage = document.getElementById('auth-message');
const authTitle = document.getElementById('auth-title');
const authSubmit = document.getElementById('auth-submit');
const usernameField = document.getElementById('username-field');
const switchMode = document.getElementById('switch-auth-mode');
let mode = 'login';

log('Supabase client loaded; auth form wiring is starting.');
if (!authForm || !authSubmit) throw new Error('Authentication form elements are missing from index.html.');

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
  log('Submit handler fired.');
  event.preventDefault();
  log('Default browser form submission prevented.');
  setMessage();
  authSubmit.disabled = true;
  const email = authForm.elements.email.value.trim();
  const password = authForm.elements.password.value;
  const username = authForm.elements.username?.value.trim();
  try {
    if (!email || !password || (mode === 'request' && !username)) {
      warn('Form validation failed.', { mode, hasEmail: !!email, hasPassword: !!password, hasUsername: !!username });
      setMessage('Please complete every required field.', 'error');
      return;
    }
    log('Form validation passed.', { mode, email, username: mode === 'request' ? username : undefined });
    if (mode === 'request') {
      log('Calling Supabase Auth signUp.', { email, username });
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { username } }
      });
      if (error) { logError('Supabase Auth signUp', error); throw error; }
      log('Supabase Auth signUp succeeded.', { userId: data.user?.id, hasSession: !!data.session, email });
      if (data.user && data.session) {
        log('Calling profiles INSERT.', { userId: data.user.id, email, username, approved: false });
        const { error: profileError } = await supabase.from('profiles').insert({
          user_id: data.user.id, username, email, approved: false,
          requested_at: new Date().toISOString()
        });
        // The auth.users trigger can win the race and create this same row first.
        if (profileError && profileError.code !== '23505') { logError('profiles INSERT', profileError); throw profileError; }
        if (profileError) warn('profiles INSERT found the trigger-created row already exists; continuing.', { code: profileError.code });
        else log('profiles INSERT succeeded.', { userId: data.user.id });
        await supabase.auth.signOut();
        log('Signup session signed out; request remains pending.');
      } else {
        log('No signup session returned; the database auth.users trigger must create the profile.');
      }
      authForm.reset();
      setMessage('Your request has been submitted and is pending approval.', 'success');
      setMode('login');
      setMessage('Your request has been submitted and is pending approval.', 'success');
      log('Request Access flow completed successfully.', { email, username });
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
    logError('Request Access submit flow', error);
    setMessage(error.message || 'Something went wrong. Please try again.', 'error');
  } finally {
    authSubmit.disabled = false;
  }
});

authForm.addEventListener('invalid', (event) => {
  warn('Native form validation rejected a field.', { field: event.target?.name, validity: event.target?.validity });
}, true);

switchMode.addEventListener('click', () => setMode(mode === 'login' ? 'request' : 'login'));
document.addEventListener('click', async (event) => {
  if (!event.target.closest('[data-auth-signout]')) return;
  await supabase.auth.signOut();
  showAuth();
  setMode('login');
});

supabase.auth.onAuthStateChange(async (event, session) => {
  log('Supabase auth state changed.', { event, userId: session?.user?.id });
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
