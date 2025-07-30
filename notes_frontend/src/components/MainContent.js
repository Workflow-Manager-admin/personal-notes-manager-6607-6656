import React from 'react';

// PUBLIC_INTERFACE
/**
 * Main notes display area.
 * Shows search, notes list, and controls to create/edit/delete.
 */
export default function MainContent({
  notes, onEdit, onDelete, onCreate, searchText, onSearch,
  primaryColor, accentColor, secondaryColor
}) {
  return (
    <main className="notes-main">
      <div className="main-toolbar">
        <input
          className="search-input"
          placeholder="Search notes"
          value={searchText}
          onChange={e => onSearch(e.target.value)}
        />
        <button className="btn create-btn" style={{background: accentColor}} onClick={onCreate}>
          + New Note
        </button>
      </div>
      <section className="note-list">
        {notes.length === 0 && (
          <div className="no-notes-msg">No notes found.</div>
        )}
        {notes.map((note) => (
          <div className="note-card" key={note.id} tabIndex={0}>
            <div className="note-header" style={{background: secondaryColor, color: "#fff"}}>
              <div className="note-title">{note.title}</div>
              <div className="note-actions">
                <button className="icon-btn" title="Edit" onClick={() => onEdit(note)}>✏️</button>
                <button className="icon-btn" title="Delete" onClick={() => onDelete(note)}>🗑️</button>
              </div>
            </div>
            <div className="note-body">{note.content}</div>
            {note.category && <span className="note-category-tag">{note.category}</span>}
          </div>
        ))}
      </section>
    </main>
  );
}
