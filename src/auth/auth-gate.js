const ACCOUNTS_KEY = 'milchar_sec_registered_accounts';
const SESSION_KEY = 'milchar_sec_auth_session';
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/[YOUR_FORM_ID]';

const authView = document.getElementById('auth-view');
const appContent = document.getElementById('app-content');
const header = document.getElementById('main-header');
const loader = document.getElementById('loader');
let mode = 'login';
let engineStarted = false;

const accounts = () => { try { return JSON.parse(localStorage.getItem(ACCOUNTS_KEY)) || []; } catch { return []; } };
const saveAccounts = (value) => localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(value));
const escapeHtml = (value) => { const span = document.createElement('span'); span.textContent = value; return span.innerHTML; };

function renderAuth(error = '', notice = '') {
  authView.innerHTML = `<div class="auth-card">
    <div class="auth-brand"><span class="auth-brand-icon">✦</span><span>MilcharSec</span></div>
    <p class="eyebrow">Cybersecurity learning hub</p>
    <h1>${mode === 'login' ? 'Welcome back' : 'Start learning securely'}</h1>
    <p class="auth-subtitle">${mode === 'login' ? 'Log in to continue your learning journey.' : 'Create an account to access your dashboard.'}</p>
    ${error ? `<div class="auth-error" role="alert">${escapeHtml(error)}</div>` : ''}
    ${notice ? `<div class="auth-notice" role="status">${escapeHtml(notice)}</div>` : ''}
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

async function submitAuth(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const email = form.email.value.trim().toLowerCase();
  const password = form.password.value;
  if (!form.reportValidity()) return;
  const registered = accounts();

  if (mode === 'login') {
    if (!registered.some(account => account.email === email && account.password === password)) {
      renderAuth('Incorrect email or password.');
      return;
    }
    localStorage.setItem(SESSION_KEY, email);
    showApp();
    return;
  }

  if (registered.some(account => account.email === email)) {
    renderAuth('An account with this email already exists. Try logging in instead.');
    return;
  }
  saveAccounts([...registered, { email, password }]);
  localStorage.setItem(SESSION_KEY, email);

  // Only the email is sent to Formspree; the password stays in localStorage.
  try {
    await fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ email })
    });
  } catch { /* Notification failure must not prevent immediate local login. */ }
  showApp();
}

function showApp() {
  authView.classList.add('hidden');
  appContent.classList.remove('hidden');
  header.classList.remove('hidden');
  if (!engineStarted) { engineStarted = true; import('../../modules/module-engine.js'); }
}

function showAuth() {
  authView.classList.remove('hidden');
  appContent.classList.add('hidden');
  header.classList.add('hidden');
  loader.classList.add('hidden');
  renderAuth();
}

if (localStorage.getItem(SESSION_KEY)) showApp(); else showAuth();
document.getElementById('logout-button').addEventListener('click', () => {
  localStorage.removeItem(SESSION_KEY);
  showAuth();
});
