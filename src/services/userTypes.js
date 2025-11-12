import { authFetch } from './api';

export async function getUserTypes() {
  const res = await authFetch('/api/user-types');
  if (!res.ok) throw new Error((await res.text()) || 'Failed to fetch user types');
  return res.json();
}

export async function createUserType(payload) {
  const res = await authFetch('/api/user-types', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error((await res.text()) || 'Failed to create user type');
  return res.json();
}

export async function updateUserType(id, payload) {
  const res = await authFetch(`/api/user-types/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error((await res.text()) || 'Failed to update user type');
  return res.json();
}

export async function deleteUserType(id) {
  const res = await authFetch(`/api/user-types/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error((await res.text()) || 'Failed to delete user type');
  return res.json();
}

