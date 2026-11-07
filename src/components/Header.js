import React from 'react';

function Header({ query, onQueryChange, theme, onToggleTheme }) {
  return (
    <header className="app-header">
      <div className="header-brand">
        <span onClick={() => window.location.reload()} className="brand-icon">&lt;/&gt;</span>
        <div>
          <h1 className="brand-title">Python ⇄ Java Playground</h1>
          <p className="brand-sub">Learn both languages side by side — with Spring Boot &amp; Django</p>
        </div>
      </div>

      <div className="header-controls">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search topics… (e.g. loops, OOP, JWT)"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
          />
          {query && (
            <button className="search-clear" onClick={() => onQueryChange('')} aria-label="Clear search">
              ✕
            </button>
          )}
        </div>

        <button
          className="theme-toggle"
          onClick={onToggleTheme}
          title={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>
    </header>
  );
}

export default Header;
