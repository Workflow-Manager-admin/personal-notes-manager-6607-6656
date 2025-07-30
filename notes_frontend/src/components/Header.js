import React from 'react';

// PUBLIC_INTERFACE
/**
 * Header component for Notes app.
 * Shows app title and login/logout options.
 */
export default function Header({ isAuth, onLogin, onLogout, primaryColor }) {
  return (
    <header className="notes-header" style={{backgroundColor: primaryColor, color: '#fff'}}>
      <div className="header-inner">
        <span className="header-title" style={{fontWeight: 700, fontSize: 22}}>📝 Notes</span>
        <div className="header-actions">
          {isAuth
           ? <button className="btn logout" onClick={onLogout}>Logout</button>
           : <button className="btn login" onClick={onLogin}>Login</button>
          }
        </div>
      </div>
    </header>
  );
}
