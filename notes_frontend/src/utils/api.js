const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:8000/api';

// PUBLIC_INTERFACE
export async function login(username, password) {
  // POST /auth/login { username, password } → { token }
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  if (!res.ok) throw new Error('Login failed');
  const data = await res.json();
  return data.token;
}

// PUBLIC_INTERFACE
export async function fetchNotes({ token, category = '', searchText = '' }) {
  let url = `${API_BASE}/notes?`;
  if (category && category !== 'all') url += `category=${encodeURIComponent(category)}&`;
  if (searchText) url += `search=${encodeURIComponent(searchText)}&`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to fetch notes');
  return await res.json();
}

// PUBLIC_INTERFACE
export async function fetchCategories(token) {
  const res = await fetch(`${API_BASE}/categories`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to fetch categories');
  return await res.json();
}

// PUBLIC_INTERFACE
export async function createNote(note, token) {
  const res = await fetch(`${API_BASE}/notes`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(note)
  });
  if (!res.ok) throw new Error('Failed to create note');
  return await res.json();
}

// PUBLIC_INTERFACE
export async function updateNote(note, token) {
  const res = await fetch(`${API_BASE}/notes/${note.id}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(note)
  });
  if (!res.ok) throw new Error('Failed to update note');
  return await res.json();
}

// PUBLIC_INTERFACE
export async function deleteNote(noteId, token) {
  const res = await fetch(`${API_BASE}/notes/${noteId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to delete note');
  return true;
}
