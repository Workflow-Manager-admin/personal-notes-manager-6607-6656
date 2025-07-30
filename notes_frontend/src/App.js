import React, { useEffect, useState } from 'react';
import './App.css';
import './index.css';
import './components/NotesApp.custom.css';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import NoteModal from './components/NoteModal';
import LoginModal from './components/LoginModal';
import { getToken, setToken, clearToken } from './utils/auth';
import { fetchNotes, fetchCategories, createNote, updateNote, deleteNote } from './utils/api';

// Color palette (also set in App.css as CSS variables):
const COLOR_PRIMARY = '#1976d2';
const COLOR_ACCENT = '#ff9800';
const COLOR_SECONDARY = '#424242';

// PUBLIC_INTERFACE
/**
 * Main App component for the Notes application.
 * Handles authentication state, modal/dialog logic, and routing for CRUD+UI.
 */
function App() {
  // Authentication
  const [isAuth, setIsAuth] = useState(!!getToken());
  const [showLogin, setShowLogin] = useState(false);

  // Notes Data
  const [notes, setNotes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedNote, setSelectedNote] = useState(null);
  const [modalType, setModalType] = useState(null); // 'edit', 'create', 'delete'

  // Search
  const [searchText, setSearchText] = useState('');

  // Theme state
  const [theme] = useState('light'); // Only light for now, see App.css

  // Fetch notes/categories when authenticated
  useEffect(() => {
    if (isAuth) {
      loadCategories();
      loadNotes();
    }
  }, [isAuth]);

  // PUBLIC_INTERFACE
  async function loadNotes() {
    try {
      const notes = await fetchNotes({ token: getToken(), category: selectedCategory, searchText });
      setNotes(notes);
    } catch (e) {
      setNotes([]);
    }
  }

  // PUBLIC_INTERFACE
  async function loadCategories() {
    try {
      const cats = await fetchCategories(getToken());
      setCategories(['all', ...cats]);
    } catch (e) {
      setCategories(['all']);
    }
  }

  // PUBLIC_INTERFACE
  function handleLogin(token) {
    setToken(token);
    setShowLogin(false);
    setIsAuth(true);
    loadCategories();
    loadNotes();
  }

  // PUBLIC_INTERFACE
  function handleLogout() {
    clearToken();
    setIsAuth(false);
    setNotes([]);
    setCategories([]);
  }

  // PUBLIC_INTERFACE
  async function handleSaveNote(noteData) {
    try {
      if (modalType === 'edit') {
        const updated = await updateNote({ ...noteData, id: selectedNote.id }, getToken());
        setNotes((prev) => prev.map((n) => n.id === updated.id ? updated : n));
      } else if (modalType === 'create') {
        const created = await createNote(noteData, getToken());
        setNotes((prev) => [created, ...prev]);
      }
      setModalType(null);
      setSelectedNote(null);
      loadCategories(); // In case category was added
    } catch (e) { /* handle error gracefully */ }
  }

  // PUBLIC_INTERFACE
  async function handleDeleteNote(noteId) {
    try {
      await deleteNote(noteId, getToken());
      setNotes((prev) => prev.filter((n) => n.id !== noteId));
      setModalType(null);
      setSelectedNote(null);
      loadCategories();
    } catch (e) { /* handle error gracefully */ }
  }

  // PUBLIC_INTERFACE
  function openNoteEditor(mode, note = null) {
    setModalType(mode);
    setSelectedNote(note);
  }

  // PUBLIC_INTERFACE
  function handleCategorySelect(cat) {
    setSelectedCategory(cat);
  }

  // PUBLIC_INTERFACE
  function handleSearch(val) {
    setSearchText(val);
  }

  // Reload notes when category or search changes
  useEffect(() => {
    if (isAuth) {
      loadNotes();
    }
    // eslint-disable-next-line
  }, [selectedCategory, searchText]);

  // Theme setup
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  if (!isAuth) {
    return (
      <div className="App minimal-bg">
        <Header
          isAuth={false}
          onLogin={() => setShowLogin(true)}
          onLogout={handleLogout}
          primaryColor={COLOR_PRIMARY}
        />
        <main className="main-centered blurb">
          <h2>Welcome to Notes!</h2>
          <p>Login to securely manage your personal notes.</p>
          <button className="btn primary" onClick={() => setShowLogin(true)}>Login</button>
        </main>
        {showLogin && (
          <LoginModal
            show={showLogin}
            onClose={() => setShowLogin(false)}
            onSuccess={handleLogin}
          />
        )}
      </div>
    );
  }

  return (
    <div className="App notes-app" style={{background: 'var(--bg-primary)'}}>
      <Header
        isAuth={true}
        onLogin={() => setShowLogin(true)}
        onLogout={handleLogout}
        primaryColor={COLOR_PRIMARY}
      />
      <div className="notes-layout">
        <Sidebar
          categories={categories}
          selected={selectedCategory}
          onSelect={handleCategorySelect}
          accentColor={COLOR_ACCENT}
        />
        <MainContent
          notes={notes}
          onEdit={(note) => openNoteEditor('edit', note)}
          onDelete={(note) => openNoteEditor('delete', note)}
          onCreate={() => openNoteEditor('create')}
          searchText={searchText}
          onSearch={handleSearch}
          primaryColor={COLOR_PRIMARY}
          accentColor={COLOR_ACCENT}
          secondaryColor={COLOR_SECONDARY}
        />
      </div>
      <NoteModal
        show={modalType === 'edit' || modalType === 'create'}
        mode={modalType}
        note={selectedNote}
        categories={categories}
        onClose={() => { setModalType(null); setSelectedNote(null); }}
        onSave={handleSaveNote}
        accentColor={COLOR_ACCENT}
      />
      <NoteModal
        show={modalType === 'delete'}
        mode={modalType}
        note={selectedNote}
        onClose={() => { setModalType(null); setSelectedNote(null); }}
        onDelete={() => handleDeleteNote(selectedNote?.id)}
        accentColor={COLOR_ACCENT}
      />
    </div>
  );
}

export default App;
