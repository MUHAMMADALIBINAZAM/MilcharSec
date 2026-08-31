import { supabase } from './supabase-client.js';

const authView = document.getElementById('auth-view');
const appContent = document.getElementById('app-content');
const header = document.getElementById('main-header');
const loader = document.getElementById('loader');
let mode = 'login';
let engineStarted = false;

const messageFor = (error) => {
  const text = (error?.message || '').toLowerCase();
  if (text.includes('invalid login credentials')) return 'The email or password is incorrect.';
  if (text.includes('already registered') || text.includes('already been registered')) return 'An account with this email already exists. Try logging in instead.';
  if (text.includes('password') && text.includes('characters')) return 'Your password must be at least 6 characters.';
  if (text.includes('invalid email')) return 'Enter a valid email address.';
  if (text.includes('rate limit')) return 'Too many attempts. Please wait a moment and try again.';
  return error?.message || 'Something went wrong. Please try again.';
};

function renderAuth(error = '') {
  authView.innerHTML = `<div class="auth-card">
    <div class="auth-brand"><span class="auth-brand-icon">✦</span><span>MilcharSec</span></div>
    <p class="eyebrow">Cybersecurity learning hub</p>
    <h1>${mode === 'login' ? 'Welcome back' : 'Start learning securely'}</h1>
    <p class="auth-subtitle">${mode === 'login' ? 'Log in to continue your learning journey.' : 'Create an account to access your dashboard.'}</p>
    ${error ? `<div class="auth-error" role="alert">${escapeHtml(error)}</div>` : ''}
    <form id="auth-form" novalidate>
      <label>Email<input name="email" type="email" autocomplete="email" required placeholder="you@example.com"></label>
      <label>Password<input name="password" type="password" autocomplete="${mode === 'login' ? 'current-password' : 'new-password'}" required minlength="6" placeholder="At least 6 characters"></label>
      <button class="primary-btn auth-submit" type="submit">${mode === 'login' ? 'Log In' : 'Create Account'}</button>
    </form>
    <p class="auth-switch">${mode === 'login' ? "Don't have an account?" : 'Already have an account?'} <button type="button" data-auth-switch>${mode === 'login' ? 'Create one' : 'Log in'}</button></p>
  </div>`;
  document.getElementById('auth-form').addEventListener('submit', submitAuth);
  authView.querySelector('[data-auth-switch]').addEventListener('click', () => { mode = mode === 'login' ? 'signup' : 'login'; renderAuth(); });
}

function escapeHtml(value) { const span = document.createElement('span'); span.textContent = value; return span.innerHTML; }

async function submitAuth(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const button = form.querySelector('button[type="submit"]');
  const email = form.email.value.trim();
  const password = form.password.value;
  if (!form.reportValidity()) return;
  button.disabled = true;
  button.textContent = mode === 'login' ? 'Logging in…' : 'Creating account…';
  let result;
  try {
    result = mode === 'login'
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password });
  } catch (error) {
    renderAuth(messageFor(error));
    return;
  }
  if (result.error) { renderAuth(messageFor(result.error)); return; }
  if (mode === 'signup' && !result.data.session) { renderAuth('Your account was created, but Supabase returned no active session. Check that email confirmation is disabled in the project settings.'); return; }
  showApp(result.data.session);
}

function showApp(session) {
  if (!session) { authView.classList.remove('hidden'); appContent.classList.add('hidden'); header.classList.add('hidden'); loader.classList.add('hidden'); renderAuth(); return; }
  authView.classList.add('hidden'); appContent.classList.remove('hidden'); header.classList.remove('hidden');
  if (!engineStarted) { engineStarted = true; import('../../modules/module-engine.js'); }
}

async function start() {
  authView.innerHTML = '<div class="auth-loading">Checking your session…</div>';
  const { data: { session } } = await supabase.auth.getSession();
  showApp(session);
  supabase.auth.onAuthStateChange((_event, nextSession) => showApp(nextSession));
  document.getElementById('logout-button').addEventListener('click', async () => {
    const { error } = await supabase.auth.signOut();
    if (error) window.alert(messageFor(error));
  });
}

start();
