import React, { useState } from 'react';
import { login } from '../utils/api';

// PUBLIC_INTERFACE
/**
 * Login modal dialog. Accepts username/pass, issues login call, returns token.
 */
export default function LoginModal({ show, onClose, onSuccess }) {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState(null);

  async function handleLogin(e) {
    e.preventDefault();
    setError(null);
    try {
      const token = await login(form.username, form.password);
      if (token) {
        onSuccess(token);
      } else {
        setError('Invalid login');
      }
    } catch {
      setError('Invalid login');
    }
  }
  function onField(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }
  if (!show) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-dialog">
        <h3>Sign In</h3>
        <form onSubmit={handleLogin}>
          <label>
            Username
            <input className="modal-input" name="username" autoFocus required value={form.username} onChange={onField} />
          </label>
          <label>
            Password
            <input className="modal-input" name="password" type="password" required value={form.password} onChange={onField} />
          </label>
          {error && <div className="modal-error">{error}</div>}
          <div className="modal-actions">
            <button type="button" className="btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn primary" style={{ background: '#1976d2', color: "#fff" }}>Login</button>
          </div>
        </form>
      </div>
    </div>
  );
}
