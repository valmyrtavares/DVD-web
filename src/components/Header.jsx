import React from 'react';
import styles from '../pages/styles/Header.module.scss';

export default function Header({ active, onNavigate }) {
  const [open, setOpen] = React.useState(false);

  const handleNavigate = (page) => {
    onNavigate(page);
    setOpen(false);
  };

  return (
    <header className={styles.headerContainer}>
      {/* DESKTOP HEADER */}
      <nav className={styles.desktop}>
        <a
          href="#"
          className={active === 'home' ? styles.active : ''}
          onClick={(e) => { e.preventDefault(); handleNavigate('home'); }}
        >
          Filme principal
        </a>
        <a
          href="#"
          className={active === 'capitulos' ? styles.active : ''}
          onClick={(e) => { e.preventDefault(); handleNavigate('capitulos'); }}
        >
          Capítulos
        </a>
        <a
          href="#"
          className={active === 'extras' ? styles.active : ''}
          onClick={(e) => { e.preventDefault(); handleNavigate('extras'); }}
        >
          Extras
        </a>
      </nav>

      {/* MOBILE HAMBURGER */}
      <div className={styles.mobile}>
        <button
          className={styles.hamburger}
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? '✕' : '☰'}
        </button>

        {open && (
          <nav className={styles.mobileMenu}>
            <a href="#" onClick={(e) => { e.preventDefault(); handleNavigate('home'); }}>Filme principal</a>
            <a href="#" onClick={(e) => { e.preventDefault(); handleNavigate('capitulos'); }}>Capítulos</a>
            <a href="#" onClick={(e) => { e.preventDefault(); handleNavigate('extras'); }}>Extras</a>
          </nav>
        )}
      </div>
    </header>
  );
}
