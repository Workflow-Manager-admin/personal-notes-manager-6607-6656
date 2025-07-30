import React, { useState, useEffect } from 'react';

// PUBLIC_INTERFACE
/**
 * Modal dialog for creating/editing/deleting a note.
 * Shows title/content/category input when editing or creating, and a confirmation for delete.
 */
export default function NoteModal({
  show, mode, note, categories = ['all'], onClose, onSave, onDelete, accentColor
}) {
  const isEdit = mode === 'edit';
  const isCreate = mode === 'create';
  const isDelete = mode === 'delete';

  const [form, setForm] = useState({ title: '', content: '', category: '' });

  useEffect(() => {
    if (isEdit && note) {
      setForm({ title: note.title, content: note.content, category: note.category || '' });
    } else if (isCreate) {
      setForm({ title: '', content: '', category: '' });
    }
    // eslint-disable-next-line
  }, [show, note, mode]);

  function onField(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }
  function handleSave(e) {
    e.preventDefault();
    if (!form.title.trim()) return;
    onSave({ ...form, category: form.category === 'all' ? '' : form.category });
  }
  function handleDelete(e) {
    e.preventDefault();
    onDelete && onDelete();
  }
  if (!show) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-dialog">
        {(isCreate || isEdit) && (
          <>
            <h3>{isEdit ? 'Edit Note' : 'New Note'}</h3>
            <form onSubmit={handleSave}>
              <label>
                Title <input
                  name="title" autoFocus required
                  value={form.title}
                  onChange={onField}
                  maxLength={60}
                  className="modal-input"
                />
              </label>
              <label>
                Content
                <textarea
                  name="content"
                  value={form.content}
                  onChange={onField}
                  rows={6}
                  className="modal-input"
                />
              </label>
              <label>
                Category
                <select
                  name="category"
                  value={form.category}
                  onChange={onField}
                  className="modal-input"
                >
                  <option value="">None</option>
                  {categories.filter(c => c !== 'all').map(cat =>
                    <option key={cat} value={cat}>{cat}</option>
                  )}
                </select>
              </label>
              <div className="modal-actions">
                <button type="button" className="btn" onClick={onClose}>Cancel</button>
                <button type="submit" className="btn" style={{ background: accentColor, color: "#fff" }}>
                  {isEdit ? 'Save' : 'Create'}
                </button>
              </div>
            </form>
          </>
        )}
        {isDelete && note && (
          <>
            <h3>Delete Note?</h3>
            <p>Are you sure you want to delete <b>{note.title}</b>?</p>
            <div className="modal-actions">
              <button className="btn" onClick={onClose}>Cancel</button>
              <button className="btn danger" style={{ background: accentColor, color: "#fff" }} onClick={handleDelete}>Delete</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
