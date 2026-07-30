/**
 * Sprite SVG unique, rendu une fois par layout. Les icônes sont ensuite
 * référencées par <Icon name="..." /> — un seul passage réseau, aucune
 * dépendance externe.
 */
export function IconSprite() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
      <symbol id="lens" viewBox="0 0 24 24" fill="none">
        <circle cx="10.5" cy="10.5" r="7" stroke="currentColor" strokeWidth="2" />
        <line x1="15.8" y1="15.8" x2="21" y2="21" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        <circle cx="10.5" cy="10.5" r="2.4" fill="currentColor" />
      </symbol>
      <symbol id="menu" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
        <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
      </symbol>
      <symbol id="check" viewBox="0 0 24 24" fill="none">
        <path d="M5 12.5l4.5 4.5L19 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </symbol>
      <symbol id="cross" viewBox="0 0 24 24" fill="none">
        <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </symbol>
      <symbol id="arch" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="4" width="18" height="5" rx="1" />
        <path d="M5 9v9a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9M10 13h4" />
      </symbol>
      <symbol id="sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="4.5" />
        <path
          d="M12 2.5v2.5M12 19v2.5M4.6 4.6l1.8 1.8M17.6 17.6l1.8 1.8M2.5 12H5M19 12h2.5M4.6 19.4l1.8-1.8M17.6 6.4l1.8-1.8"
          strokeLinecap="round"
        />
      </symbol>
      <symbol id="moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z" strokeLinejoin="round" />
      </symbol>
      <symbol id="alert" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 3l9 16H3z" strokeLinejoin="round" />
        <path d="M12 10v4M12 17h.01" strokeLinecap="round" />
      </symbol>
      <symbol id="split" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 3v18" />
        <path d="M7 8L4 11l3 3M17 8l3 3-3 3" strokeLinecap="round" strokeLinejoin="round" />
      </symbol>
      <symbol id="list" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M4 6h16M4 12h10M4 18h13" strokeLinecap="round" />
      </symbol>
      <symbol id="grid" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </symbol>
      <symbol id="folder" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      </symbol>
      <symbol id="dl" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 3v12m0 0l-4-4m4 4l4-4M4 17v3h16v-3" strokeLinecap="round" strokeLinejoin="round" />
      </symbol>
      <symbol id="srch" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="7" />
        <path d="M21 21l-4-4" strokeLinecap="round" />
      </symbol>
      <symbol id="tbl" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="M3 9h18M9 9v11" />
      </symbol>
      <symbol id="shield" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 3l8 3v6c0 4.5-3.2 7.6-8 9-4.8-1.4-8-4.5-8-9V6z" />
        <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
      </symbol>
      <symbol id="clock" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" strokeLinecap="round" />
      </symbol>
      <symbol id="plus" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
        <path d="M12 5v14M5 12h14" strokeLinecap="round" />
      </symbol>
      <symbol id="lock" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="5" y="10" width="14" height="10" rx="2" />
        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
      </symbol>
      <symbol id="sliders" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M4 6h10M17 6h3M4 12h3M9 12h11M4 18h13M20 18h0" strokeLinecap="round" />
        <circle cx="14" cy="6" r="2.2" />
        <circle cx="7" cy="12" r="2.2" />
        <circle cx="17" cy="18" r="2.2" />
      </symbol>
      <symbol id="bank" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M3 10h18L12 4z" strokeLinejoin="round" />
        <path d="M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 21h18" strokeLinecap="round" />
      </symbol>
      <symbol id="rocket" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M13 3c4 1.5 6.5 5 7 9-4 3.5-7.5 4.5-11 4l-3-3c-.5-3.5.5-7 4-11z" strokeLinejoin="round" />
        <circle cx="14.5" cy="9.5" r="1.8" />
        <path d="M6 16l-2.5 4.5L8 18" strokeLinecap="round" strokeLinejoin="round" />
      </symbol>
      <symbol id="scale" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 4v17M6 21h12M4 8l4-2 4 2 4-2 4 2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8 6L5 13a3 3 0 0 0 6 0zM16 6l-3 7a3 3 0 0 0 6 0z" strokeLinejoin="round" />
      </symbol>
      <symbol id="star" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 2l3 6.5 7 .8-5.2 4.7 1.4 6.9L12 17.6 5.8 20.9l1.4-6.9L2 9.3l7-.8z" strokeLinejoin="round" />
      </symbol>
      <symbol id="chat" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M21 12a8 8 0 0 1-8 8H8l-5 3 1.5-5A8 8 0 1 1 21 12z" strokeLinejoin="round" />
      </symbol>
      <symbol id="users" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="9" cy="8" r="3.5" />
        <path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 5.2a3.5 3.5 0 0 1 0 6.6M18 20a6.4 6.4 0 0 0-2-4.6" strokeLinecap="round" />
      </symbol>
      <symbol id="card" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="2.5" y="5" width="19" height="14" rx="2.5" />
        <path d="M2.5 10h19" />
      </symbol>
      <symbol id="trash" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13" strokeLinecap="round" strokeLinejoin="round" />
      </symbol>
      <symbol id="restore" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M4 12a8 8 0 1 0 3-6.2M4 4v4h4" strokeLinecap="round" strokeLinejoin="round" />
      </symbol>
      <symbol id="pin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 21v-7M8.5 3h7l-1 6 3 3H6.5l3-3z" strokeLinecap="round" strokeLinejoin="round" />
      </symbol>
      <symbol id="doc" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M6 3h8l4 4v14H6z" strokeLinejoin="round" />
        <path d="M14 3v4h4" strokeLinejoin="round" />
      </symbol>
      <symbol id="send" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
        <path d="M4 12l16-8-6 16-2.5-6z" strokeLinejoin="round" />
      </symbol>
      <symbol id="logout" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M14 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4M10 8l-4 4 4 4M6 12h9" strokeLinecap="round" strokeLinejoin="round" />
      </symbol>
    </svg>
  );
}
