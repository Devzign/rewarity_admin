import { authFetch } from './api';

export async function createUser(payload) {
  const res = await authFetch('/api/users/create-user', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'accept': '*/*' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error((await res.text()) || 'Failed to create user');
  return res.json();
}

// Scaffolds for future use
export async function listUsers(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await authFetch(`/api/users${query ? `?${query}` : ''}`);
  if (!res.ok) throw new Error((await res.text()) || 'Failed to fetch users');
  return res.json();
}

export async function getUserById(id) {
  const res = await authFetch(`/api/users/${id}`);
  if (!res.ok) throw new Error((await res.text()) || 'Failed to fetch user');
  return res.json();
}

export async function updateUser(id, payload) {
  const res = await authFetch(`/api/users/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error((await res.text()) || 'Failed to update user');
  return res.json();
}

export async function deleteUser(id) {
  const res = await authFetch(`/api/users/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error((await res.text()) || 'Failed to delete user');
  return res.json();
}

export async function assignManager(id, managerId) {
  const res = await authFetch(`/api/users/${id}/assign-manager`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ managerId })
  });
  if (!res.ok) throw new Error((await res.text()) || 'Failed to assign manager');
  return res.json();
}

export async function getSubordinates(id) {
  const res = await authFetch(`/api/users/${id}/subordinates`);
  if (!res.ok) throw new Error((await res.text()) || 'Failed to fetch subordinates');
  return res.json();
}

// Mapping endpoints
export async function mapDealerDistributor(payload) {
  const res = await authFetch('/api/users/map/dealer-distributor', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error((await res.text()) || 'Failed to map dealer to distributor');
  return res.json();
}

export async function mapDistributorSalesman(payload) {
  const res = await authFetch('/api/users/map/distributor-salesman', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error((await res.text()) || 'Failed to map salesman to distributor');
  return res.json();
}

export async function mapDealerSalesman(payload) {
  const res = await authFetch('/api/users/map/dealer-salesman', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error((await res.text()) || 'Failed to map salesman to dealer');
  return res.json();
}
