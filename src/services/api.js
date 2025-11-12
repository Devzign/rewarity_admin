// Simple API helper for Rewarity auth
const API_BASE = process.env.REACT_APP_API_BASE || 'https://rewarity-nodejs.onrender.com';

export function getToken() {
  try {
    return localStorage.getItem('auth_token') || '';
  } catch (_) {
    return '';
  }
}

export function setToken(token) {
  try {
    if (token) localStorage.setItem('auth_token', token);
  } catch (_) {}
}

export function setUser(user) {
  try {
    if (user) localStorage.setItem('auth_user', JSON.stringify(user));
  } catch (_) {}
}

export function getUser() {
  try {
    const raw = localStorage.getItem('auth_user');
    return raw ? JSON.parse(raw) : null;
  } catch (_) {
    return null;
  }
}

export function clearAuth() {
  try {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  } catch (_) {}
}

export async function requestOtp(mobile) {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mobile })
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Failed to request OTP');
  }
  return res.json();
}

export async function verifyOtp(mobile, code) {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mobile, code })
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Failed to verify OTP');
  }
  const data = await res.json();
  // Expecting { token, user, message }
  if (data?.token) setToken(data.token);
  if (data?.user) setUser(data.user);
  return data;
}

export async function authFetch(url, options = {}) {
  const token = getToken();
  const headers = {
    ...(options.headers || {}),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${url}`, { ...options, headers });
  return res;
}

export { API_BASE };

