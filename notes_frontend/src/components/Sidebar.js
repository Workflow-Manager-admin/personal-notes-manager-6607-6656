import React from 'react';

// PUBLIC_INTERFACE
/**
 * Sidebar component displaying note categories.
 */
export default function Sidebar({ categories, selected, onSelect, accentColor }) {
  return (
    <aside className="sidebar">
      <nav>
        <ul className="category-list">
          {categories.map((cat) => (
            <li
              key={cat}
              className={`category-item${cat === selected ? ' selected' : ''}`}
              style={cat === selected ? { background: accentColor, color: '#fff', fontWeight: 500 } : {}}
              onClick={() => onSelect(cat)}
              tabIndex={0}
              aria-label={`Filter notes by category ${cat}`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
